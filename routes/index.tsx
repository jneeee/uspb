import { Handlers, PageProps } from "$fresh/server.ts";
import Alert from "@/components/Alert.tsx";
import ContentMeta from "@/components/ContentMeta.tsx";

import { short_urls, stats } from "@/utils/database.ts";
import { generateId } from "@/utils/random.ts";
import Footer from "@/components/Footer.tsx";

// https://tabler-icons-tsx.deno.dev/
import IconHomeStats from "icons/home-stats.tsx";
import IconEdit from "icons/edit.tsx";
import IconLink from "icons/link.tsx";


let entry_count = parseInt(await stats.get('entry_count')) || 0;

export const handler: Handlers = {
  async POST(req, ctx) {

    const env = Deno.env;
    const form = await req.formData();

    if (env.get('PASSWD') && form.get("pswd")?.toString() != env.get('PASSWD')) {
      return ctx.render({'msg': 'Wrong password!', 'entry_count': entry_count});
    }

    const url = form.get("url")?.toString();

    if (!url) {
      return ctx.render({'msg': 'Pelease input content!', 'entry_count': entry_count});
    }

    const short_code = generateId();
    entry_count++;

    const entry = {
      "key": short_code,
      "content": url,
      "stats": {"access": 0},
      "user": null,
    };
    entry["type"] = url.startsWith("http") ? "url" : "text";

    await short_urls.put(short_code, JSON.stringify(entry));
    if (entry_count % 10 == 0) {
      await stats.put('entry_count', entry_count.toString());
    }

    return ctx.render(
      {'msg': `🎉(Only show once): https://${env.get('SITE_URL')!}/s/${short_code}`,
       'entry_count': entry_count}
    );
  },
  GET(_req, ctx) {
    return ctx.render({'entry_count': entry_count});
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
          {Deno.env.get('PASSWD') && <input name="pswd" type="password" placeholder="password" class="left"></input>}
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
          <p>{entry_count} links have been created. 🎉</p>
        </article>
      </div>
      <Footer />
    </main>
    </>
  );
}
