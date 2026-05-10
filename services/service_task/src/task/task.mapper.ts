import { Injectable } from '@nestjs/common';
import { TaskDocument } from './models/task.model';
import { I18nContext } from 'nestjs-i18n';
import { TaskListResponseDto } from './dtos/task-list-response.dto';
import { TaskResponseDto } from './dtos/task-response.dto';
import { ExtensionService } from 'src/extension/extension.service';
import { ExtensionMapper } from 'src/extension/extension.mapper';
import { TaskDetailsResponseDto } from './dtos/task-details-response.dto';
import { ExtensionMethodDetailsResponseDto } from 'src/extension/dtos/extension-method-details-response.dto';
import { TaskParamResponseDto } from './dtos/task-param-response.dto';
import { TaskParam } from './models/task-param.model';
import { ExtensionInputParamResponseDto } from 'src/extension/dtos/extension-input-param-response.dto';
import { TaskColumns } from './models/task-column.model';
import { ExtensionColumnParamResponseDto } from 'src/extension/dtos/extension-input-column-response.dto';
import {
  TaskColumnResponseDto,
  TaskColumnsResponseDto,
  TaskMultipleColumnResponseDto,
} from './dtos/task-column-response.dto';
import { ExtensionMultipleColumnParamResponseDto } from 'src/extension/dtos/extension-input-multiple-column-response.dto';

@Injectable()
export class TaskMapper {
  constructor(
    private readonly extensionService: ExtensionService,
    private readonly extensionMapper: ExtensionMapper,
  ) {}

  toTaskDetailsResponseDto(
    task: TaskDocument,
    method: ExtensionMethodDetailsResponseDto,
  ): TaskDetailsResponseDto {
    return {
      id: task._id.toString(),
      title: method.title,
      description: method.description,
      inputParams:
        task.inputParams && task.inputParams.length > 0 && method.params
          ? this.mapTaskParams(task.inputParams, method.params)
          : undefined,
      inputColumns:
        task.inputColumns &&
        ((task.inputColumns.columns &&
          task.inputColumns.columns.length > 0 &&
          method.columns) ||
          (task.inputColumns.multipleColumns &&
            task.inputColumns.multipleColumns.length > 0 &&
            method.multipleColumns))
          ? this.mapTaskColumns(
              task.inputColumns,
              method.columns,
              method.multipleColumns,
            )
          : undefined,
      status: task.status,
      errorMessage: task.errorMessage,
      result: task.result
        ? {
            params:
              task.result.params &&
              task.result.params.length > 0 &&
              method.outputParams
                ? this.mapTaskParams(task.result.params, method.outputParams)
                : undefined,
            columns:
              (task.result.columns &&
                task.result.columns.columns &&
                task.result.columns.columns.length > 0 &&
                method.outputColumns) ||
              (task.result.columns &&
                task.result.columns.multipleColumns &&
                task.result.columns.multipleColumns.length > 0 &&
                method.outputMultipleColumns)
                ? this.mapTaskColumns(
                    task.result.columns,
                    method.outputColumns,
                    method.outputMultipleColumns,
                  )
                : undefined,
          }
        : undefined,
      createdAt: task.createdAt.toISOString(),
      completedAt: task.completedAt?.toISOString(),
    };
  }

  mapTaskColumns(
    taskColumns: TaskColumns,
    methodColumns?: ExtensionColumnParamResponseDto[],
    methodMultipleColumns?: ExtensionMultipleColumnParamResponseDto[],
  ): TaskColumnsResponseDto {
    const resultColumns: TaskColumnResponseDto[] = [];
    const resultMultipleColumns: TaskMultipleColumnResponseDto[] = [];

    if (methodColumns && taskColumns.columns) {
      const methodColumnsMap = new Map<
        string,
        ExtensionColumnParamResponseDto
      >();
      methodColumns.forEach((column) =>
        methodColumnsMap.set(column.id, column),
      );

      for (const column of taskColumns.columns) {
        const methodColumn = methodColumnsMap.get(column.column);
        if (methodColumn) {
          resultColumns.push({
            id: column.column,
            title: methodColumn.title,
            description: methodColumn.description,
            index: column.index,
          });
        }
      }
    }

    if (methodMultipleColumns && taskColumns.multipleColumns) {
      const methodMultipleColumnsMap = new Map<
        string,
        ExtensionMultipleColumnParamResponseDto
      >();
      methodMultipleColumns.forEach((column) =>
        methodMultipleColumnsMap.set(column.id, column),
      );

      for (const column of taskColumns.multipleColumns) {
        const methodColumn = methodMultipleColumnsMap.get(column.column);
        if (methodColumn) {
          resultMultipleColumns.push({
            id: column.column,
            title: methodColumn.title,
            description: methodColumn.description,
            index: column.index,
          });
        }
      }
    }

    return {
      file: taskColumns.file.toString(),
      columns: resultColumns,
      multipleColumns: resultMultipleColumns,
    };
  }

  mapTaskParams(
    taskParams: TaskParam[],
    methodParams: ExtensionInputParamResponseDto[],
  ): TaskParamResponseDto[] {
    const methodParamsMap = new Map<string, ExtensionInputParamResponseDto>();
    methodParams.forEach((param) => methodParamsMap.set(param.id, param));

    const resultParams: TaskParamResponseDto[] = [];
    for (const param of taskParams) {
      const methodParam = methodParamsMap.get(param.param);

      if (methodParam) {
        resultParams.push({
          id: param.param,
          title: methodParam.title,
          description: methodParam.description,
          value: param.value,
        });
      }
    }

    return resultParams;
  }

  toTaskListResponseDto(
    tasks: TaskDocument[],
    isEnd: boolean,
    i18n: I18nContext,
  ): TaskListResponseDto {
    return {
      list: tasks.map((task) => this.toTaskResponseDto(task, i18n)),
      isEnd: isEnd,
    };
  }

  toTaskResponseDto(task: TaskDocument, i18n: I18nContext): TaskResponseDto {
    return {
      id: task._id.toString(),
      title: this.getTaskTitle(task, i18n),
      status: task.status,
      createdAt: task.createdAt.toISOString(),
      completedAt: task.completedAt?.toISOString(),
    };
  }

  getTaskTitle(task: TaskDocument, i18n: I18nContext): string {
    const method = this.extensionService.extensionMethodMap.get(
      `${task.extension}-${task.method}`,
    );
    if (!method) {
      return i18n.service.t('message.unknownMethodTitle');
    }

    const localizedMeta = this.extensionMapper.getCurrentLocalizedMeta(
      method.localized_meta,
      i18n,
    );
    return localizedMeta.title;
  }
}
