import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, UpdateStatusDto, TaskQueryDto } from './dto/tasks.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateTaskDto) {
    return this.tasksService.create((req as Request & { user: { id: string } }).user.id, dto);
  }

  @Get()
  findAll(@Req() req: Request, @Query() query: TaskQueryDto) {
    return this.tasksService.findAll((req as Request & { user: { id: string } }).user.id, query);
  }

  @Get('upcoming')
  getUpcoming(@Req() req: Request, @Query('days') days?: number) {
    return this.tasksService.getUpcoming((req as Request & { user: { id: string } }).user.id, days || 7);
  }

  @Get('range')
  getRange(@Req() req: Request, @Query('start') start: string, @Query('end') end: string) {
    return this.tasksService.getRange((req as Request & { user: { id: string } }).user.id, start, end);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.tasksService.findOne((req as Request & { user: { id: string } }).user.id, id);
  }

  @Put(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update((req as Request & { user: { id: string } }).user.id, id, dto);
  }

  @Patch(':id/status')
  updateStatus(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.tasksService.updateStatus((req as Request & { user: { id: string } }).user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.tasksService.remove((req as Request & { user: { id: string } }).user.id, id);
  }
}
