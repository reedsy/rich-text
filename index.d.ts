declare module '@reedsy/rich-text' {
  import Delta from '@reedsy/quill-delta';
  import * as sharedb from 'sharedb';

  export type Type = (typeof sharedb)['types']['map'][string];

  export {Delta};

  export const config: {
    serializedProperties: Record<string, boolean>;
  };

  export const type: Type;
}
