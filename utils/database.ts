export interface ShortUrl {
  key: string;
  content: string;
  user: string | null;
  stats: Record<string, unknown>;
  type?: 'url' | 'text';
}
