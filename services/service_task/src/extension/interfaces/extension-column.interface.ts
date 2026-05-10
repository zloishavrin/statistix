import { LocalizedMeta, LocalizedMetaSchema } from './localized-meta.interface';
import { z } from 'zod';

export interface IExtensionColumn {
  id: string;
  required?: boolean;
  localized_meta: LocalizedMeta;
}

export const ExtensionColumnSchema = z.object({
  id: z.string(),
  required: z.boolean().default(true),
  localized_meta: LocalizedMetaSchema,
});
