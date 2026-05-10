import { z } from 'zod';

export interface ILocalizedMetaValue {
  title: string;
  description: string;
}

export type LocalizedMeta = Record<
  string,
  {
    title: string;
    description: string;
  }
>;

export const LocalizedMetaSchema = z.record(
  z.string(),
  z.object({
    title: z.string(),
    description: z.string(),
  }),
);
