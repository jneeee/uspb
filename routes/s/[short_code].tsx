import { Handlers, PageProps } from "$fresh/server.ts";
import ContentMeta from "@/components/ContentMeta.tsx";
import Footer from "@/components/Footer.tsx";
import ShortUrl from "@/utils/database.ts";


const kv = await Deno.openKv();

export const handler: Handlers = {
    async GET(_req, ctx) {
      const short_code = ctx.params.short_code;

      try {
        const entry = (await kv.get<ShortUrl>(['url', short_code])).value;
        console.debug(`Get short_code: (${short_code}), entry: ${entry}`)
        if (!entry) {
            return ctx.renderNotFound();
        }

        entry.stats.access += 1;
        await kv.set(['url', short_code], entry);

        if (entry.type == "url") {
            return Response.redirect(entry.content, 302);
        } else {
          return ctx.render(entry.content);
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