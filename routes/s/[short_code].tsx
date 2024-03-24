import { Handlers, PageProps } from "$fresh/server.ts";

import IconClick from "icons/click.tsx"
import IconCalendarTime from "icons/calendar-time.tsx"
import IconWorldShare from "icons/world-share.tsx"

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
          return ctx.render(entry);
        }
      } catch (err) {
        console.error(err);
        return new Response("server error", { status: 500 });
      }
    },
  };

export default function show_text(props: PageProps) {
  const entry: ShortUrl = props.data;
  return (
    <>
    <ContentMeta />
    <main class="container" style="width:80%">
      <article>{entry.content}
      <footer class="grid">
        <div><IconCalendarTime class="w-6 h-6" />{entry.create_time}</div>
        <div><IconClick class="w-6 h-6" />Access: {entry.stats.access}.</div>
        <div><IconWorldShare class="w-6 h-6" />{entry.stats.visibility}</div>
      </footer>
      </article>
      <Footer />
    </main>
    </>
  )
}