import { Handlers, PageProps } from "$fresh/server.ts";
import short_urls from "@/utils/database.ts";
import ContentMeta from "@/components/ContentMeta.tsx";
import Footer from "@/components/Footer.tsx";


export const handler: Handlers = {
    async GET(_req, ctx) {
      const short_code = ctx.params.short_code;

      try {
        const entry = await short_urls.get(short_code);
        const row = JSON.parse(entry);
        console.debug(`Get short_code: (${short_code}), row: ${row}`)
        if (!row) {
            return ctx.renderNotFound();
        }

        row.stats.access += 1;
        await short_urls.put(short_code, JSON.stringify(row));

        if (row.type == "url") {
            return Response.redirect(row.content, 302);
        } else {
          return ctx.render(row.content);
        }
      } catch (err) {
        console.error(err);
        return new Response("server error", { status: 500 });
      }
    },
  };

export default function show_text(props: PageProps) {

    return (
        <>
        <ContentMeta />
        <main class="container">
          <article>{props.data}</article>
          <Footer />
        </main>
        </>
    )
}