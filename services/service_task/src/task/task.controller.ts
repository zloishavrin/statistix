import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskResponseDto } from './dtos/create-task-response.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { Types } from 'mongoose';
import { CreateTaskRequestDto } from './dtos/create-task-request.dto';
import { TaskListResponseDto } from './dtos/task-list-response.dto';
import { TaskListRequestDto } from './dtos/task-list-request.dto';
import { TaskDetailsResponseDto } from './dtos/task-details-response.dto';

@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('details/:id')
  @ApiOperation({ summary: 'Get task details' })
  @ApiOkResponse({
    type: TaskDetailsResponseDto,
    description: 'Task details',
  })
  async getTask(
    @UserId() userId: Types.ObjectId,
    @Param('id') id: string,
    @I18n() i18n: I18nContext,
  ): Promise<TaskDetailsResponseDto> {
    return this.taskService.getTask(userId, id, i18n);
  }

  @Get('list')
  @ApiOperation({ summary: 'Get list tasks' })
  @ApiOkResponse({
    type: TaskListResponseDto,
    description: 'List tasks',
  })
  async getTaskList(
    @UserId() userId: Types.ObjectId,
    @Query() dto: TaskListRequestDto,
    @I18n() i18n: I18nContext,
  ): Promise<TaskListResponseDto> {
    return this.taskService.getTaskList(userId, dto, i18n);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create task' })
  @ApiOkResponse({
    type: [CreateTaskResponseDto],
    description: 'Task ID',
  })
  async createTask(
    @UserId() userId: Types.ObjectId,
    @Body() dto: CreateTaskRequestDto,
    @I18n() i18n: I18nContext,
  ): Promise<CreateTaskResponseDto> {
    return this.taskService.createTask(userId, dto, i18n);
  }
}
