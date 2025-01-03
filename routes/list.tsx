import { Handlers, PageProps } from "$fresh/server.ts";

import { kv, ShortUrl } from "@/utils/database.ts";
import ContentMeta from "@/components/ContentMeta.tsx";
import Footer from "@/components/Footer.tsx";
import DeleteButton from "@/islands/DeleteButton.tsx";

const ENTRIES_PER_PAGE = 20;

export const handler: Handlers = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const startIndex = (page - 1) * ENTRIES_PER_PAGE;

    const iter = kv.list<ShortUrl>({ prefix: ["url"] });
    const allEntries: ShortUrl[] = [];

    for await (const entry of iter) {
      if (entry.value.stats.visibility === "public") {
        allEntries.push(entry.value);
      }
    }

    allEntries.sort((a, b) => new Date(b.create_time).getTime() - new Date(a.create_time).getTime());
    const paginatedEntries = allEntries.slice(startIndex, startIndex + ENTRIES_PER_PAGE);
    const hasNextPage = startIndex + ENTRIES_PER_PAGE < allEntries.length;

    return ctx.render({
      entries: paginatedEntries,
      nextPage: hasNextPage ? page + 1 : null,
    });
  },

  async DELETE(req) {
    const url = new URL(req.url);
    const key = url.searchParams.get("key");

    if (!key) {
      return new Response("Missing URL key", { status: 400 });
    }

    const entry = await kv.get<ShortUrl>(["url", key]);
    if (!entry.value) {
      return new Response("Entry not found", { status: 404 });
    }

    // 删除记录
    await kv.delete(["url", key]);
    if (entry.value.type === "url") {
      await kv.delete(["url_by_content", entry.value.content]);
    }

    // 更新 entry_count
    const entryCount = (await kv.get(["stats", "entry_count"])).value || 0;
    if (entryCount > 0) {
      await kv.set(["stats", "entry_count"], entryCount - 1);
    }

    return new Response("Entry deleted successfully", { status: 200 });
  },
};

export default function ListPage(props: PageProps<{ entries: ShortUrl[]; nextPage: number | null }>) {
    const { entries, nextPage } = props.data;
  
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.key}>
                  <td>{entry.content.length > 20 ? `${entry.content.substring(0, 20)}...` : entry.content}</td>
                  <td>
                    <a href={`/s/${entry.key}`}>
                      {new Date(entry.create_time).toLocaleString("zh-CN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                        timeZone: "Asia/Shanghai", // 确保使用中国时区
                      }).replace(/\//g, "/")}
                    </a>
                  </td>
                  <td>{entry.stats.access}</td>
                  <td>
                    {/* 使用 Island 渲染删除按钮 */}
                    <DeleteButton shortCode={entry.key} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {nextPage && (
            <a href={`?page=${nextPage}`} class="pagination">Next Page</a>
          )}
          <Footer />
        </main>
      </>
    );
  }