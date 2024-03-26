export type ShortUrl = {
  key: string;
  content: string;
  stats: {
    access: number;
    visibility: 'public' | 'private';
  };
  user: string | null;
  type: 'url' | 'text';
  create_time: string;
};


export const kv = (
  Deno.env.has("DENO_REGION")
    ? await Deno.openKv()
    : await Deno.openKv("/app/data/uspb.sqlite3")
);
