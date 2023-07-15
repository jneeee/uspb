import { Handlers, PageProps } from "$fresh/server.ts";
import Alert from "@/components/Alert.tsx";
import ContentMeta from "@/components/ContentMeta.tsx";

import db from "@/utils/database.ts";
import { generateId } from "@/utils/random.ts";
import Footer from "@/components/Footer.tsx";

// https://tabler-icons-tsx.deno.dev/
import IconHomeStats from "icons/home-stats.tsx";
import IconEdit from "icons/edit.tsx";
import IconLink from "icons/link.tsx";


const temprow = await db.getEntry('entry_count');
let entry_count = 1;
if (temprow) {
  entry_count = parseInt(temprow.url);
}

export const handler: Handlers = {
  async POST(req, ctx) {
    const form = await req.formData();

    if (form.get("pswd")?.toString() != Deno.env.get('PASSWD')) {
      return ctx.render({'msg': 'Wrong password!', 'entry_count': entry_count});
    }

    const url = form.get("url")?.toString();

    if (!url) {
      return ctx.render({'msg': 'Pelease input content!', 'entry_count': entry_count});
    }

    const short_code = generateId();
    entry_count++;

    try {
      await db.batch([
        {
          sql: "insert into short_url(short_code, url) values (?, ?)",
          args: [ short_code, url ]
        },
        `update short_url SET url = ${entry_count} where short_code = 'entry_count'`
        ]
      )
    } catch (err) {
      console.error(err);
      return new Response("server error", { status: 500 });
    }
    return ctx.render(
      {'msg': `The short url, only show once: https://${Deno.env.get('SITE_URL')!}/s/${short_code}`,
       'entry_count': entry_count}
    );
  },
  GET(_req, ctx) {
    return ctx.render({'entry_count': parseInt(entry_count)});
  }
};


export default function Home(props: PageProps) {
  return (
    <>
    <ContentMeta />
    <main class="container">
      <Alert message={props.data.msg} />
      <form method="post" class="center" style="width:70%">
        <fieldset>
          <textarea name="url" type="text" placeholder="url or text"/>
          <input name="pswd" type="password" placeholder="password" class="left"></input>
          <button type="submit" class="right">Submit</button>
        </fieldset>
      </form>
      <div class="grid">
        <article>
          <h5><IconLink class="w-6 h-6" /> Url shorter</h5>
          <p><b>Content start with http</b> get a 302 redirecting. <a href={`https://${Deno.env.get('SITE_URL')!}/s/1xSzh`}>Example</a> will jump to github.</p>
        </article>
        <article>
          <h5><IconEdit class="w-6 h-6" /> Pastebin</h5>
          <p>Text content will be saved and shown as article card. <a href={`https://${Deno.env.get('SITE_URL')!}/s/5pUOC`}>Example</a> </p>
        </article>
        <article>
          <h5><IconHomeStats class="w-6 h-6" /> System status</h5>
          <p>{props.data.entry_count} links have been created. 🎉</p>
        </article>
      </div>
      <Footer />
    </main>
    </>
  );
}
