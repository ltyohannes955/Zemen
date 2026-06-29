export {
  createApiClient,
  ApiError,
} from './api-client';

export {
  computeNextOccurrence,
  computeOccurrencesInRange,
  taskIsDueOnDate,
  tasksForDate,
  groupTasksByDate,
  computeEthiopianDate,
  ethDateFromGregorianString,
} from './recurrence';

export {
  validateCreateTask,
  validateUpdateTask,
  validateTask,
  validateTitle,
  validatePriority,
  validateStatus,
  validateDateType,
  validatePrimaryDate,
  validateGregorianDate,
  validateTags,
  validateRecurrence,
  validateReminder,
} from './validation';

export type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
  RecurrenceRule,
  ReminderRule,
  Priority,
  TaskStatus,
  DateType,
  RecurrenceType,
  ReminderType,
  PaginatedResponse,
  ApiConfig,
  ValidationError,
} from './types';

export {
  getEthiopianDate,
  getEthiopianSecondary,
} from './types';

export type { AuthResponse, RegisterInput, LoginInput, ApiClient } from './api-client';
