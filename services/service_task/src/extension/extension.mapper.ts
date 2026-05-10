import { Injectable } from '@nestjs/common';
import { IExtension } from './interfaces/extension.interface';
import { ExtensionResponseDto } from './dtos/extension-response.dto';
import { I18nContext } from 'nestjs-i18n';
import {
  ILocalizedMetaValue,
  LocalizedMeta,
} from './interfaces/localized-meta.interface';
import { ExtensionDetailsResponseDto } from './dtos/extension-details-response.dto';
import { ExtensionMethodResponseDto } from './dtos/extension-method-response.dto';
import { IExtensionMethod } from './interfaces/extension-method.interface';
import { ExtensionMethodDetailsResponseDto } from './dtos/extension-method-details-response.dto';
import { IExtensionParam } from './interfaces/extension-param.interface';
import { ExtensionInputParamResponseDto } from './dtos/extension-input-param-response.dto';
import { IExtensionColumn } from './interfaces/extension-column.interface';
import { ExtensionColumnParamResponseDto } from './dtos/extension-input-column-response.dto';
import { IExtensionMultipleColumn } from './interfaces/extension-multiple-columns.interface';
import { ExtensionMultipleColumnParamResponseDto } from './dtos/extension-input-multiple-column-response.dto';

@Injectable()
export class ExtensionMapper {
  toExtensionMethodDetailsResponseDto(
    method: IExtensionMethod,
    i18n: I18nContext,
    enableOutput: boolean = false,
  ): ExtensionMethodDetailsResponseDto {
    const meta = this.getCurrentLocalizedMeta(method.localized_meta, i18n);

    return {
      id: method.id,
      title: meta.title,
      description: meta.description,
      params: method.input.params?.map((param) =>
        this.toExtensionInputParamResponseDto(param, i18n),
      ),
      columns: method.input.columns?.map((column) =>
        this.toExtensionInputColumnResponseDto(column, i18n),
      ),
      multipleColumns: method.input.multiple_columns?.map((column) =>
        this.toExtensionInputMultipleColumnResponseDto(column, i18n),
      ),
      outputParams: enableOutput
        ? method.output.params?.map((param) =>
            this.toExtensionInputParamResponseDto(param, i18n),
          )
        : undefined,
      outputColumns: enableOutput
        ? method.output.columns?.map((column) =>
            this.toExtensionInputColumnResponseDto(column, i18n),
          )
        : undefined,
      outputMultipleColumns: enableOutput
        ? method.output.multiple_columns?.map((column) =>
            this.toExtensionInputMultipleColumnResponseDto(column, i18n),
          )
        : undefined,
    };
  }

  toExtensionInputParamResponseDto(
    param: IExtensionParam,
    i18n: I18nContext,
  ): ExtensionInputParamResponseDto {
    const meta = this.getCurrentLocalizedMeta(param.localized_meta, i18n);

    return {
      id: param.id,
      title: meta.title,
      isRequired: param.required === undefined ? true : param.required,
      min: param.min,
      max: param.max,
      description: meta.description,
    };
  }

  toExtensionInputColumnResponseDto(
    column: IExtensionColumn,
    i18n: I18nContext,
  ): ExtensionColumnParamResponseDto {
    const meta = this.getCurrentLocalizedMeta(column.localized_meta, i18n);

    return {
      id: column.id,
      isRequired: column.required === undefined ? true : column.required,
      title: meta.title,
      description: meta.description,
    };
  }

  toExtensionInputMultipleColumnResponseDto(
    column: IExtensionMultipleColumn,
    i18n: I18nContext,
  ): ExtensionMultipleColumnParamResponseDto {
    const meta = this.getCurrentLocalizedMeta(column.localized_meta, i18n);

    return {
      id: column.id,
      isRequired: column.required === undefined ? true : column.required,
      title: meta.title,
      description: meta.description,
    };
  }

  toExtensionResponseDto(
    extension: IExtension,
    i18n: I18nContext,
  ): ExtensionResponseDto {
    return {
      id: extension.service_name,
      title: this.getCurrentLocalizedMeta(extension.localized_meta, i18n).title,
    };
  }

  toExtensionDetailsResponseDto(
    extension: IExtension,
    i18n: I18nContext,
  ): ExtensionDetailsResponseDto {
    const meta = this.getCurrentLocalizedMeta(extension.localized_meta, i18n);

    return {
      id: extension.service_name,
      title: meta.title,
      description: meta.description,
      methods: extension.methods.map((method) =>
        this.toExtensionMethodResponseDto(method, i18n),
      ),
    };
  }

  toExtensionMethodResponseDto(
    method: IExtensionMethod,
    i18n: I18nContext,
  ): ExtensionMethodResponseDto {
    const meta = this.getCurrentLocalizedMeta(method.localized_meta, i18n);

    return {
      id: method.id,
      title: meta.title,
      description: meta.description,
    };
  }

  getCurrentLocalizedMeta(
    localizedMeta: LocalizedMeta,
    i18n: I18nContext,
  ): ILocalizedMetaValue {
    const language = i18n.lang;
    return localizedMeta[language] || Object.values(localizedMeta)[0];
  }
}
