declare module '@reedsy/rich-text' {
  export * as Delta from '@reedsy/quill-delta';
  import sharedb from 'sharedb';

  export type Type = (typeof sharedb)['types']['map'][string];

  export const config: {
    serializedProperties: Record<string, boolean>;
  };

  export const type: Type;
}
