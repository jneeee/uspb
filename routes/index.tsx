import { Handlers, PageProps } from "$fresh/server.ts";
import Alert from "@/components/Alert.tsx";
import ContentMeta from "@/components/ContentMeta.tsx";

// https://tabler-icons-tsx.deno.dev/
import IconHomeStats from "icons/home-stats.tsx";
import IconEdit from "icons/edit.tsx";
import IconLink from "icons/link.tsx";

import { generateId } from "@/utils/random.ts";
import Footer from "@/components/Footer.tsx";
import ShortUrl from "@/utils/database.ts";

const kv = await Deno.openKv();

let entry_count = (await kv.get(['stats','entry_count'])).value || 0;
let creation_token = 10;

Deno.cron("Creation token", "0 * * * *", () => {
  creation_token = 10
  console.log("reset creation_token = 10");
});


export const handler: Handlers = {
  async POST(req, ctx) {
    if (creation_token <= 0) {
      return ctx.render({ 'msg': '429 too many requests'});
    }

    const env = Deno.env;
    const form = await req.formData();

    if (env.get('PASSWD') && form.get("pswd")?.toString() != env.get('PASSWD')) {
      return ctx.render({'msg': 'Wrong password!'});
    }

    const url = form.get("url")?.toString();

    if (!url) {
      return ctx.render({'msg': 'Please input content!'});
    }

    const short_code = generateId();
    entry_count++;

    const entry: ShortUrl = {
      key: short_code,
      content: url,
      stats: {access: 0, visibility: form.get("public") ? 'public' : 'private'},
      user: null,
      type: url.startsWith("http") ? "url" : "text",
      create_time: new Date().toISOString(),
    };

    await kv.set(['url', short_code], entry);
    await kv.set(['stats','entry_count'], entry_count);
    creation_token -= 1;

    return ctx.render(
      {'msg': `🎉Save the link: https://${env.get('SITE_URL')!}/s/${short_code}`}
    );
  },
  GET(_req, ctx) {
    return ctx.render();
  }
};


export default function Home(props: PageProps) {
  return (
    <>
    <ContentMeta />
    <main class="container">
      {props.data && <Alert message={props.data.msg} />}
      <form method="post" class="center" style="width:70%">
        <fieldset>
          <textarea name="url" type="text" placeholder="url or text"/>
          {Deno.env.get('PASSWD') && <input name="pswd" type="password" placeholder="password" class="left"></input>}
          <label><input type="checkbox" name="public" checked />Public(show in list)</label>
          <button type="submit" class="right">Submit</button>
        </fieldset>
      </form>
      <div class="grid">
        <article>
          <h5><IconLink class="w-6 h-6" /> Url shorter</h5>
          <p><b>Content start with http</b> get a 302 redirecting. <a href="https://uspb.deno.dev/s/ofb6MGOa">Example</a> will jump to github.</p>
        </article>
        <article>
          <h5><IconEdit class="w-6 h-6" /> Pastebin</h5>
          <p>Text content will be saved and shown as article card. <a href="https://uspb.deno.dev/s/TnadVS9h">Example</a> </p>
        </article>
        <article>
          <h5><IconHomeStats class="w-6 h-6" /> System status</h5>
          <p>{entry_count} links have been created. 🎉</p>
          <p>{creation_token} creation token remains in the last hour.</p>
        </article>
      </div>
      <Footer />
    </main>
    </>
  );
}
