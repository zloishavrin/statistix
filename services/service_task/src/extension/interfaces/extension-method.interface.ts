import {
  ExtensionColumnSchema,
  IExtensionColumn,
} from './extension-column.interface';
import {
  IExtensionMultipleColumn,
  ExtensionMultipleColumnSchema,
} from './extension-multiple-columns.interface';
import {
  IExtensionParam,
  ExtensionParamSchema,
} from './extension-param.interface';
import { LocalizedMeta, LocalizedMetaSchema } from './localized-meta.interface';
import { z } from 'zod';

export interface IExtensionMethod {
  id: string;
  localized_meta: LocalizedMeta;
  input: {
    columns?: IExtensionColumn[];
    multiple_columns?: IExtensionMultipleColumn[];
    params?: IExtensionParam[];
  };
  output: {
    columns?: IExtensionColumn[];
    multiple_columns?: IExtensionMultipleColumn[];
    params?: IExtensionParam[];
  };
}

export const ExtensionMethodSchema = z.object({
  id: z.string(),
  localized_meta: LocalizedMetaSchema,
  input: z.object({
    columns: z.array(ExtensionColumnSchema).optional(),
    multiple_columns: z.array(ExtensionMultipleColumnSchema).optional(),
    params: z.array(ExtensionParamSchema).optional(),
  }),
  output: z.object({
    columns: z.array(ExtensionColumnSchema).optional(),
    multiple_columns: z.array(ExtensionMultipleColumnSchema).optional(),
    params: z.array(ExtensionParamSchema).optional(),
  }),
});
