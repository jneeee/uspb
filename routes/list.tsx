import { Handlers, PageProps } from "$fresh/server.ts";

import { ShortUrl } from "@/utils/database.ts";
import ContentMeta from "@/components/ContentMeta.tsx";
import Footer from "@/components/Footer.tsx";

const kv = await Deno.openKv();
const ENTRIES_PER_PAGE = 20;

export const handler: Handlers = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const startKey = url.searchParams.get("start");

    // Calculate the starting point for listing keys
    let iter: ShortUrl[] = [];
    if (startKey) {
        iter = kv.list<ShortUrl>({ prefix: ["url"], start: ["url", startKey]}, {limit: ENTRIES_PER_PAGE + 1 })
    } else {
        iter = kv.list<ShortUrl>({ prefix: ["url"]}, {limit: ENTRIES_PER_PAGE + 1 })
    }

    const entries: ShortUrl[] = [];
    let nextStartKey = null;
    let count = 0

    for await (const entry of iter) {
      count++
      if (count < ENTRIES_PER_PAGE) {
        if (entry.value.stats.visibility === 'public') {
          entries.push(entry.value);
        }
      } else {
        nextStartKey = entry.key;
        break;
      }
    }

    return ctx.render({ entries, nextPage: page + 1, nextStartKey });
  },
};

export default function ListPage(props: PageProps<{ entries: ShortUrl[]; nextPage: number; nextStartKey: string | null }>) {
    const { entries, nextPage, nextStartKey } = props.data;
  
    return (
      <>
        <ContentMeta />
        <main class="center" style="width:70%">
          <h1>Public Entries</h1>
          <table class="striped">
            <thead>
              <tr>
                <th>Content</th>
                <th>Date</th>
                <th>Access Count</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.key}>
                  <td>{entry.content.length > 20 ? `${entry.content.substring(0, 20)}...` : entry.content}</td>
                  <td><a href={`/s/${entry.key}`}>{new Date(entry.create_time).toLocaleDateString()}</a></td>
                  <td>{entry.stats.access}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {nextStartKey && (
            <a href={`?page=${nextPage}&start=${nextStartKey}`}>Next Page</a>
          )}
          <Footer />
        </main>
      </>
    );
  }