export type ShortUrl = {
  key: string;
  content: string;
  stats: {
    access: number;
    visibility: 'public' | 'private';
  };
  user: string | null;
  type: 'url' | 'text';
};
