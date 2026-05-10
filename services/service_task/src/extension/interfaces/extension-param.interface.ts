import { LocalizedMeta, LocalizedMetaSchema } from './localized-meta.interface';
import { z } from 'zod';

export interface IExtensionParam {
  id: string;
  required?: boolean;
  min?: number;
  max?: number;
  localized_meta: LocalizedMeta;
}

export const ExtensionParamSchema = z.object({
  id: z.string(),
  min: z.number().optional(),
  max: z.number().optional(),
  required: z.boolean().default(true),
  localized_meta: LocalizedMetaSchema,
});
