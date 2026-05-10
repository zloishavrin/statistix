import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtensionSchema, IExtension } from './interfaces/extension.interface';
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { ExtensionResponseDto } from './dtos/extension-response.dto';
import { ExtensionMapper } from './extension.mapper';
import { I18nContext } from 'nestjs-i18n';
import { ExtensionDetailsResponseDto } from './dtos/extension-details-response.dto';
import { IExtensionMethod } from './interfaces/extension-method.interface';
import { ExtensionMethodDetailsResponseDto } from './dtos/extension-method-details-response.dto';

@Injectable()
export class ExtensionService {
  private readonly extensionConfigsPath: string;
  public extensions: IExtension[] = [];
  public extensionMap: Map<string, IExtension> = new Map();

  // Map<extensionId-methodId, IExtensionMethod>
  public extensionMethodMap: Map<string, IExtensionMethod> = new Map();

  constructor(
    private readonly extensionMapper: ExtensionMapper,
    private readonly configService: ConfigService,
  ) {
    this.extensionConfigsPath =
      this.configService.getOrThrow<string>('configPath');
    void this.loadConfigurations();
  }

  /**
   * Get details method with params
   * @param extensionId ID of method extension
   * @param methodId ID of method
   * @param i18n I18n context
   * @returns Details method
   */
  getMethod(
    extensionId: string,
    methodId: string,
    i18n: I18nContext,
    enableOutput: boolean = false,
  ): ExtensionMethodDetailsResponseDto {
    const methodKey = `${extensionId}-${methodId}`;

    const method = this.extensionMethodMap.get(methodKey);
    if (!method) {
      throw new NotFoundException();
    }

    return this.extensionMapper.toExtensionMethodDetailsResponseDto(
      method,
      i18n,
      enableOutput,
    );
  }

  /**
   * Get details extension
   * @param extensionId
   * @param i18n
   */
  getExtension(
    extensionId: string,
    i18n: I18nContext,
  ): ExtensionDetailsResponseDto {
    const extension = this.extensionMap.get(extensionId);
    if (!extension) {
      throw new NotFoundException();
    }

    return this.extensionMapper.toExtensionDetailsResponseDto(extension, i18n);
  }

  /**
   * Get all extensions
   * @param i18n I18n context
   * @returns All extensions
   */
  getExtensions(i18n: I18nContext): ExtensionResponseDto[] {
    return this.extensions.map((extension) =>
      this.extensionMapper.toExtensionResponseDto(extension, i18n),
    );
  }

  /**
   * Get details extensions and methods with filter by search string
   * @param i18n I18n context
   * @param searchString Search string
   * @returns Extensions
   */
  getExtensionMethods(
    i18n: I18nContext,
    searchString?: string,
  ): ExtensionDetailsResponseDto[] {
    const result: ExtensionDetailsResponseDto[] = [];

    const query = searchString?.trim().toLowerCase();

    for (const extension of this.extensions) {
      const extMeta = this.extensionMapper.getCurrentLocalizedMeta(
        extension.localized_meta,
        i18n,
      );

      const extMatch =
        !query ||
        extMeta.title.toLowerCase().includes(query) ||
        extMeta.description.toLowerCase().includes(query);

      let matchedMethods: IExtensionMethod[] = [];

      if (query) {
        matchedMethods = extension.methods.filter((method) => {
          const meta = this.extensionMapper.getCurrentLocalizedMeta(
            method.localized_meta,
            i18n,
          );

          return (
            meta.title.toLowerCase().includes(query) ||
            meta.description.toLowerCase().includes(query)
          );
        });
      }

      if (extMatch || matchedMethods.length > 0) {
        result.push(
          this.extensionMapper.toExtensionDetailsResponseDto(
            {
              ...extension,
              methods: query ? matchedMethods : extension.methods,
            },
            i18n,
          ),
        );
      }
    }

    return result;
  }

  /**
   * Load all extensions from configs
   */
  private async loadConfigurations(): Promise<void> {
    const files = await readdir(this.extensionConfigsPath);

    const configFiles = files.filter((file) =>
      file.endsWith('.worker-config.json'),
    );

    const loadedExtensions: IExtension[] = [];

    for (const file of configFiles) {
      try {
        const fullPath = path.join(this.extensionConfigsPath, file);
        const raw = await readFile(fullPath, 'utf-8');
        const extension: unknown = JSON.parse(raw);

        if (this.isValidExtension(extension)) {
          if (this.extensionMap.has(extension.service_name)) {
            console.warn(
              `Extension ${extension.service_name} already exists. Pass extension.`,
            );
            continue;
          }
          loadedExtensions.push(extension);
          this.extensionMap.set(extension.service_name, extension);

          for (const method of extension.methods) {
            const methodKey = `${extension.service_name}-${method.id}`;
            if (this.extensionMethodMap.has(methodKey)) {
              console.warn(
                `Method ${method.id} already exists in ${extension.service_name} extension. Pass method`,
              );
              continue;
            }

            this.extensionMethodMap.set(methodKey, method);
          }

          console.info(
            `Initialized ${Object.values(extension.localized_meta)[0].title} extension`,
          );
        }
      } catch (error) {
        console.error(`Failed to load config ${file}`, error);
      }
    }

    this.extensions = loadedExtensions;
    console.log(`Initialized ${loadedExtensions.length} extensions`);
  }

  /**
   * Validate extension config by schema
   * @param obj Config
   * @returns Success or error
   */
  private isValidExtension(obj: unknown): obj is IExtension {
    const result = ExtensionSchema.safeParse(obj);
    if (result.success) {
      return true;
    }

    const error = result.error;
    throw new Error(`Invalidate extension config:\n${error}`);
  }
}
