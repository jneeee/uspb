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
  Deno.env.get("runtime") === "DOCKER"
    ? await Deno.openKv("/app/data/uspb.sqlite3")
    : await Deno.openKv()
);
