import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './models/task.model';
import { Model, Types } from 'mongoose';
import { ExtensionService } from 'src/extension/extension.service';
import { CreateTaskRequestDto } from './dtos/create-task-request.dto';
import { I18nContext } from 'nestjs-i18n';
import { TaskParamRequestDto } from './dtos/task-param-request.dto';
import { ExtensionInputParamResponseDto } from 'src/extension/dtos/extension-input-param-response.dto';
import { TaskColumnsRequestDto } from './dtos/task-column-request.dto';
import { ExtensionColumnParamResponseDto } from 'src/extension/dtos/extension-input-column-response.dto';
import { File, FileDocument } from 'src/file/file.model';
import { TaskStatus } from './models/task-status.model';
import { CreateTaskResponseDto } from './dtos/create-task-response.dto';
import { TaskListRequestDto } from './dtos/task-list-request.dto';
import { TaskListResponseDto } from './dtos/task-list-response.dto';
import { TaskMapper } from './task.mapper';
import { TaskQueueRequest } from './interfaces/task-queue-request.interface';
import { TaskQueue } from './task.queue';
import {
  TaskQueueFailedResponseDto,
  TaskQueueResponseDto,
} from './dtos/task-queue-response.dto';
import { TaskResult } from './models/task-result.model';
import { TaskDetailsResponseDto } from './dtos/task-details-response.dto';
import { ExtensionMultipleColumnParamResponseDto } from 'src/extension/dtos/extension-input-multiple-column-response.dto';
import { TaskColumn, TaskMultipleColumn } from './models/task-column.model';

@Injectable()
export class TaskService implements OnModuleInit {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @InjectModel(File.name) private readonly fileModel: Model<File>,
    private readonly taskMapper: TaskMapper,
    private readonly taskQueue: TaskQueue,
    private readonly extensionService: ExtensionService,
  ) {}

  onModuleInit() {
    this.taskQueue.setHandlers(
      async (data) => this.onTaskComplete(data),
      async (data) => this.onTaskFailed(data),
    );
  }

  async getTask(
    userId: Types.ObjectId,
    id: string,
    i18n: I18nContext,
  ): Promise<TaskDetailsResponseDto> {
    const task = await this.taskModel.findById(id);
    if (!task) {
      throw new NotFoundException();
    }
    if (task.user.toString() !== userId.toString()) {
      throw new NotFoundException();
    }

    const method = this.extensionService.getMethod(
      task.extension,
      task.method,
      i18n,
      true,
    );

    return this.taskMapper.toTaskDetailsResponseDto(task, method);
  }

  /**
   * Get task list with pagination
   * @param userId ID of user
   * @param dto Pagination and filter params
   * @param i18n I18n context
   * @returns Task list with pagination params
   */
  async getTaskList(
    userId: Types.ObjectId,
    dto: TaskListRequestDto,
    i18n: I18nContext,
  ): Promise<TaskListResponseDto> {
    const { limit, page, sort = 'desc', status } = dto;

    const sortStatus = sort === 'desc' ? -1 : 1;

    const tasks = await this.taskModel
      .find({
        user: userId,
        ...(status && { status: status }),
      })
      .sort({ createdAt: sortStatus })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return this.taskMapper.toTaskListResponseDto(
      tasks,
      tasks.length < limit,
      i18n,
    );
  }

  /**
   * Create task and add to queue
   * @param userId ID of user
   * @param dto Task settings
   * @param i18n I18n context
   * @returns Object with task ID
   */
  async createTask(
    userId: Types.ObjectId,
    dto: CreateTaskRequestDto,
    i18n: I18nContext,
  ): Promise<CreateTaskResponseDto> {
    const { extension, method: methodId, params, columns } = dto;

    const method = this.extensionService.getMethod(extension, methodId, i18n);

    if (method.params && method.params.length > 0) {
      this.validateParams(i18n, method.params, params);
    }

    let file: FileDocument | null = null;
    if (
      (method.columns && method.columns.length > 0) ||
      (method.multipleColumns && method.multipleColumns.length > 0)
    ) {
      file = await this.validateColumns(
        i18n,
        userId,
        method.columns,
        method.multipleColumns,
        columns,
      );
    }

    const newTask = await this.taskModel.create({
      user: userId,
      extension: extension,
      method: methodId,
      inputColumns: columns
        ? {
            file: new Types.ObjectId(columns.file),
            columns: columns.columns,
            multipleColumns: columns.multipleColumns,
          }
        : undefined,
      inputParams: params,
      status: TaskStatus.IN_PROGRESS,
      createdAt: new Date(),
    });

    this.addTaskToQueue(extension, methodId, {
      id: newTask._id.toString(),
      language: i18n.lang,
      params: newTask.inputParams,
      columns:
        file && newTask.inputColumns
          ? {
              file: {
                key: file.key,
                type: file.type,
                size: file.size,
              },
              columns: newTask.inputColumns.columns,
              multiple_columns: newTask.inputColumns.multipleColumns,
            }
          : undefined,
    });

    return {
      task: newTask._id.toString(),
    };
  }

  private async onTaskComplete(data: TaskQueueResponseDto) {
    const task = await this.taskModel.findById(data.id);
    if (!task) return;

    if (task.status !== TaskStatus.IN_PROGRESS) {
      return;
    }

    const method = this.extensionService.extensionMethodMap.get(
      `${task.extension}-${task.method}`,
    );
    if (!method) return;
    const methodTitle =
      method.localized_meta[data.language].title ||
      method.localized_meta[0].title;

    const result: TaskResult = {};
    if (
      method.output.params &&
      method.output.params.length > 0 &&
      data.params &&
      data.params.length > 0
    ) {
      const methodOutputParamsSet = new Set(
        method.output.params.map((param) => param.id),
      );
      const resultParams = data.params.filter((param) =>
        methodOutputParamsSet.has(param.param),
      );
      result.params = resultParams;
    }

    if (
      (method.output.columns || method.output.multiple_columns) &&
      data.columns
    ) {
      const newFile = await this.fileModel.create({
        user: task.user,
        key: data.columns.file.key,
        type: data.columns.file.type,
        size: data.columns.file.size,
        originalName: `${methodTitle.toLowerCase().replaceAll(' ', '_')}-${data.id}-result.${data.columns.file.type}`,
        createdAt: new Date(),
      });

      let resultColumns: TaskColumn[] | undefined;
      if (method.output.columns) {
        const methodOutputColumnsSet = new Set(
          method.output.columns.map((column) => column.id),
        );
        resultColumns = data.columns.columns.filter((column) =>
          methodOutputColumnsSet.has(column.column),
        );
      }

      let resultMultipleColumns: TaskMultipleColumn[] | undefined;
      if (method.output.multiple_columns) {
        const methodOutputMultipleColumnsSet = new Set(
          method.output.multiple_columns.map((column) => column.id),
        );
        resultMultipleColumns = data.columns.multiple_columns.filter((column) =>
          methodOutputMultipleColumnsSet.has(column.column),
        );
      }

      result.columns = {
        file: newFile._id,
        columns: resultColumns,
        multipleColumns: resultMultipleColumns,
      };
    }

    task.status = TaskStatus.COMPLETED;
    task.completedAt = new Date();
    task.result = result;
    await task.save();

    this.taskQueue.emitNotification(
      task._id.toString(),
      task.user.toString(),
      methodTitle,
      'completed',
    );
  }

  private async onTaskFailed(data: TaskQueueFailedResponseDto) {
    const task = await this.taskModel.findById(data.id);
    if (!task) return;

    if (task.status !== TaskStatus.IN_PROGRESS) {
      return;
    }

    task.status = TaskStatus.FAILED;
    if (data.error_message) task.errorMessage = data.error_message;
    await task.save();

    const method = this.extensionService.extensionMethodMap.get(
      `${task.extension}-${task.method}`,
    );
    if (!method) return;

    const methodTitle =
      method.localized_meta[data.language].title ||
      method.localized_meta[0].title;

    this.taskQueue.emitNotification(
      task._id.toString(),
      task.user.toString(),
      methodTitle,
      'failed',
    );
  }

  /**
   * Validate params for current method
   * @param i18n I18n context
   * @param methodInputParams Input params for method
   * @param params User input params
   */
  private validateParams(
    i18n: I18nContext,
    methodInputParams: ExtensionInputParamResponseDto[],
    params?: TaskParamRequestDto[],
  ): void {
    /** VALIDATE REQUIRED PARAMS **/
    const requiredParams = methodInputParams.filter(
      (param) => param.isRequired,
    );
    if (requiredParams.length === 0) return;

    if (!params) {
      throw new BadRequestException(
        `${i18n.service.t('message.emptyParams')} ${requiredParams.map((param) => `"${param.title}"`).join(', ')}`,
      );
    }

    const paramsSet: Set<string> = new Set();
    params.forEach((param) => paramsSet.add(param.param));

    const emptyParams: ExtensionInputParamResponseDto[] = [];
    for (const inputParam of requiredParams) {
      if (!paramsSet.has(inputParam.id) && inputParam.isRequired) {
        emptyParams.push(inputParam);
      }
    }

    if (emptyParams.length > 0) {
      throw new BadRequestException(
        `${i18n.service.t('message.emptyParams')} ${emptyParams.map((param) => `"${param.title}"`).join(', ')}`,
      );
    }

    /** VALIDATE MIN/MAX PARAMS **/
    const methodParamsMap: Map<string, ExtensionInputParamResponseDto> =
      new Map();
    methodInputParams.forEach((param) => methodParamsMap.set(param.id, param));

    for (const param of params) {
      const paramSettings = methodParamsMap.get(param.param);
      if (!paramSettings) continue;

      const paramValue = param.value;
      if (paramSettings.min !== undefined) {
        if (paramValue < paramSettings.min) {
          throw new BadRequestException(
            `${paramSettings.title} ${i18n.service.t('validate.minValidateParam')} ${paramSettings.min}`,
          );
        }
      }
      if (paramSettings.max !== undefined) {
        if (paramValue > paramSettings.max) {
          throw new BadRequestException(
            `${paramSettings.title} ${i18n.service.t('validate.maxValidateParam')} ${paramSettings.min}`,
          );
        }
      }
    }
  }

  /**
   * Validate columns data for current method
   * @param i18n I18n context
   * @param userId ID of user
   * @param methodInputColumns Input columns for method
   * @param columns User input columns data
   * @returns S3 key of file
   */
  private async validateColumns(
    i18n: I18nContext,
    userId: Types.ObjectId,
    methodInputColumns?: ExtensionColumnParamResponseDto[],
    methodInputMultipleColumns?: ExtensionMultipleColumnParamResponseDto[],
    columns?: TaskColumnsRequestDto,
  ): Promise<FileDocument | null> {
    const requiredSingle = (methodInputColumns ?? []).filter(
      (column) => column.isRequired,
    );
    const requiredMultiple = (methodInputMultipleColumns ?? []).filter(
      (column) => column.isRequired,
    );

    if (!columns?.file || !Types.ObjectId.isValid(columns.file)) {
      throw new BadRequestException(i18n.service.t('message.invalidFile'));
    }

    const file = await this.fileModel.findOne({
      _id: new Types.ObjectId(columns.file),
      user: userId,
    });

    if (!file) {
      throw new BadRequestException(i18n.service.t('message.invalidFile'));
    }

    const providedSingle = new Set(
      (columns.columns ?? []).map((column) => column.column),
    );

    const missingSingle = requiredSingle.filter(
      (column) => !providedSingle.has(column.id),
    );

    const providedMultiple = new Set(
      (columns.multipleColumns ?? []).map((column) => column.column),
    );

    const missingMultiple = requiredMultiple.filter(
      (column) => !providedMultiple.has(column.id),
    );

    const missingAll = [...missingSingle, ...missingMultiple];

    if (missingAll.length > 0) {
      throw new BadRequestException(
        `${i18n.service.t('message.emptyParams')} ` +
          missingAll.map((column) => `"${column.title}"`).join(', '),
      );
    }

    return file;
  }

  /**
   * Add task to rabbitmq queue
   * @param extension Extension id
   * @param method Method id
   * @param request Object with task ID
   */
  private addTaskToQueue(
    extension: string,
    method: string,
    request: TaskQueueRequest,
  ): void {
    this.taskQueue.emit(`${extension}.${method}`, request);
  }
}
