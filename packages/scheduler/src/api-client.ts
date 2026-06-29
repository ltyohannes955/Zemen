import type { ApiConfig, Task, CreateTaskInput, UpdateTaskInput, TaskFilters, PaginatedResponse } from './types';

function buildQuery(filters: TaskFilters): string {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.priority) params.set('priority', filters.priority);
  if (filters.dateType) params.set('dateType', filters.dateType);
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.set('dateTo', filters.dateTo);
  if (filters.tags && filters.tags.length > 0) params.set('tags', filters.tags.join(','));
  if (filters.search) params.set('search', filters.search);
  if (filters.upcoming) params.set('upcoming', 'true');
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
  };
}

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export function createApiClient(config: ApiConfig) {
  function headers(): Record<string, string> {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    const token = config.getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  }

  async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${config.baseUrl}/api/v1${path}`, {
      ...options,
      headers: { ...headers(), ...options?.headers },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ message: res.statusText }));
      throw new ApiError(res.status, body.message || 'Request failed', body.errors);
    }

    return res.json();
  }

  return {
    auth: {
      register: (input: RegisterInput) =>
        request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(input) }),
      login: (input: LoginInput) =>
        request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(input) }),
      refresh: (refreshToken: string) =>
        request<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        }),
      forgotPassword: (email: string) =>
        request<{ message: string }>('/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email }),
        }),
      resetPassword: (token: string, password: string) =>
        request<{ message: string }>('/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify({ token, password }),
        }),
      profile: () => request<{ id: string; email: string; name: string | null; avatarUrl: string | null }>('/auth/profile'),
    },
    tasks: {
      list: (filters: TaskFilters = {}, page = 1, limit = 50) =>
        request<PaginatedResponse<Task>>(`/tasks${buildQuery(filters)}&page=${page}&limit=${limit}`),
      get: (id: string) => request<Task>(`/tasks/${id}`),
      create: (input: CreateTaskInput) =>
        request<Task>('/tasks', { method: 'POST', body: JSON.stringify(input) }),
      update: (id: string, input: UpdateTaskInput) =>
        request<Task>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(input) }),
      delete: (id: string) =>
        request<void>(`/tasks/${id}`, { method: 'DELETE' }),
      updateStatus: (id: string, status: string) =>
        request<Task>(`/tasks/${id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        }),
      upcoming: (days = 7) =>
        request<Task[]>(`/tasks/upcoming?days=${days}`),
      range: (start: string, end: string) =>
        request<Task[]>(`/tasks/range?start=${start}&end=${end}`),
    },
  };
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: { field: string; message: string }[],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export type ApiClient = ReturnType<typeof createApiClient>;
