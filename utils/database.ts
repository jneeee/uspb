import { DenoKV } from "https://deno.land/x/denokv/mod.ts";


const short_urls = new DenoKV("short_urls");
const stats = new DenoKV("stats");

export { short_urls, stats };
