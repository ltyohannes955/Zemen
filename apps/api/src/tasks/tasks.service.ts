import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto, UpdateStatusDto, TaskQueryDto } from './dto/tasks.dto';
import { toGregorian } from '@zemen/core';
import type { EthiopianDate } from '@zemen/core';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description || '',
        dateType: dto.dateType,
        primaryYear: dto.primaryYear,
        primaryMonth: dto.primaryMonth,
        primaryDay: dto.primaryDay,
        secondaryYear: dto.secondaryYear,
        secondaryMonth: dto.secondaryMonth,
        secondaryDay: dto.secondaryDay,
        time: dto.time || null,
        priority: dto.priority || 'none',
        status: dto.status || 'pending',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recurrence: dto.recurrence as any || undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        reminder: dto.reminder as any || undefined,
        tags: dto.tags || [],
      },
    });
  }

  async findAll(userId: string, query: TaskQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { userId, deletedAt: null };

    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;
    if (query.dateType) where.dateType = query.dateType;

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.tags) {
      const tagList = query.tags.split(',').map((t) => t.trim());
      where.tags = { hasSome: tagList };
    }

    if (query.upcoming === 'true') {
      const now = new Date();
      where.primaryYear = { gte: now.getUTCFullYear() };
    }

    const [data, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(userId: string, taskId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException('Access denied');
    return task;
  }

  async update(userId: string, taskId: string, dto: UpdateTaskDto) {
    await this.findOne(userId, taskId);
    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.dateType !== undefined && { dateType: dto.dateType }),
        ...(dto.primaryYear !== undefined && { primaryYear: dto.primaryYear }),
        ...(dto.primaryMonth !== undefined && { primaryMonth: dto.primaryMonth }),
        ...(dto.primaryDay !== undefined && { primaryDay: dto.primaryDay }),
        ...(dto.secondaryYear !== undefined && { secondaryYear: dto.secondaryYear }),
        ...(dto.secondaryMonth !== undefined && { secondaryMonth: dto.secondaryMonth }),
        ...(dto.secondaryDay !== undefined && { secondaryDay: dto.secondaryDay }),
        ...(dto.time !== undefined && { time: dto.time }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.position !== undefined && { position: dto.position }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(dto.recurrence !== undefined && { recurrence: dto.recurrence as any }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(dto.reminder !== undefined && { reminder: dto.reminder as any }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
      },
    });
  }

  async updateStatus(userId: string, taskId: string, dto: UpdateStatusDto) {
    await this.findOne(userId, taskId);
    return this.prisma.task.update({
      where: { id: taskId },
      data: { status: dto.status },
    });
  }

  async remove(userId: string, taskId: string) {
    await this.findOne(userId, taskId);
    // Soft delete
    return this.prisma.task.update({
      where: { id: taskId },
      data: { deletedAt: new Date() },
    });
  }

  private computeGregorianDate(task: { dateType: string; primaryYear: number; primaryMonth: number; primaryDay: number }): string {
    if (task.dateType === 'gregorian') {
      return `${task.primaryYear}-${String(task.primaryMonth).padStart(2, '0')}-${String(task.primaryDay).padStart(2, '0')}`;
    }
    const ethDate: EthiopianDate = { year: task.primaryYear, month: task.primaryMonth, day: task.primaryDay };
    const gregDate = toGregorian(ethDate);
    const y = gregDate.getUTCFullYear();
    const m = String(gregDate.getUTCMonth() + 1).padStart(2, '0');
    const d = String(gregDate.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  async getUpcoming(userId: string, days = 7) {
    const now = new Date();
    const startStr = now.toISOString().slice(0, 10);
    const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const endStr = endDate.toISOString().slice(0, 10);

    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        deletedAt: null,
        status: 'pending',
      },
      orderBy: [{ primaryYear: 'asc' }, { primaryMonth: 'asc' }, { primaryDay: 'asc' }],
      take: 100,
    });

    return tasks
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((task: any) => ({
        ...task,
        gregorianDate: this.computeGregorianDate(task),
      }))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((task: any) => task.gregorianDate >= startStr && task.gregorianDate <= endStr);
  }

  async getRange(userId: string, _start: string, _end: string) {
    void _start; void _end;
    return this.prisma.task.findMany({
      where: {
        userId,
        deletedAt: null,
        status: 'pending',
      },
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
    });
  }
}
