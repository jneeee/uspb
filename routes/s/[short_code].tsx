import { Handlers, PageProps } from "$fresh/server.ts";
import db from "@/utils/database.ts";
import ContentMeta from "@/components/ContentMeta.tsx";
import Footer from "@/components/Footer.tsx";


export const handler: Handlers = {
    async GET(_req, ctx) {
      const short_code = ctx.params.short_code;

      try {
        const row = await db.getEntry(short_code);
        console.log(`Get short_code: (${short_code}), row: ${row}`)
        if (!row) {
            return ctx.renderNotFound();
        }
        if (!row.url.startsWith('http')) {
            return ctx.render(row.url);
        } else {
            return Response.redirect(row.url, 302);
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