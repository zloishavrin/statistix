import {
  ExtensionMethodSchema,
  IExtensionMethod,
} from './extension-method.interface';
import { LocalizedMeta, LocalizedMetaSchema } from './localized-meta.interface';
import { z } from 'zod';

export interface IExtension {
  service_name: string;
  localized_meta: LocalizedMeta;
  methods: IExtensionMethod[];
}

export const ExtensionSchema = z.object({
  service_name: z.string(),
  localized_meta: LocalizedMetaSchema,
  methods: z.array(ExtensionMethodSchema),
});
