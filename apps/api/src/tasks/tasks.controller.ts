import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
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
  create(@Req() req: any, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req: any, @Query() query: TaskQueryDto) {
    return this.tasksService.findAll(req.user.id, query);
  }

  @Get('upcoming')
  getUpcoming(@Req() req: any, @Query('days') days?: number) {
    return this.tasksService.getUpcoming(req.user.id, days || 7);
  }

  @Get('range')
  getRange(@Req() req: any, @Query('start') start: string, @Query('end') end: string) {
    return this.tasksService.getRange(req.user.id, start, end);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.tasksService.findOne(req.user.id, id);
  }

  @Put(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(req.user.id, id, dto);
  }

  @Patch(':id/status')
  updateStatus(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.tasksService.updateStatus(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.tasksService.remove(req.user.id, id);
  }
}
