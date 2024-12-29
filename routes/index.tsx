import { Handlers, PageProps } from "$fresh/server.ts";
import Alert from "@/components/Alert.tsx";
import ContentMeta from "@/components/ContentMeta.tsx";

// https://tabler-icons-tsx.deno.dev/
import IconHomeStats from "icons/home-stats.tsx";
import IconEdit from "icons/edit.tsx";
import IconLink from "icons/link.tsx";

import { generateId } from "@/utils/random.ts";
import Footer from "@/components/Footer.tsx";
import {kv, ShortUrl} from "@/utils/database.ts";


let entry_count = (await kv.get(['stats','entry_count'])).value || 0;
let creation_token = 10;

Deno.cron("Creation token", "0 * * * *", () => {
  creation_token = 10
  console.log("reset creation_token = 10");
});

// url验证函数，用来判断是文本还是url
function isValidUrl(url: string): boolean {
  const regex = /^(http|https):\/\/[^ "]+$/;
  return regex.test(url);
}

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

    // 如果不是url，就不启用去重机制，所以也不需要通过key去查找内容
    if (isValidUrl(url)) {
      const existingEntry = await kv.get<ShortUrl>(["url_by_content", url]);
      if (existingEntry.value) {
        const existingShortCode = existingEntry.value.key;
        const entryCount = (await kv.get(["stats", "entry_count"])).value || 0;
        return ctx.render({
          msg: `🎉Save the link: https://${env.get("SITE_URL")!}/s/${existingShortCode}`,
          entry_count: entryCount,
        });
      }
    }

    const short_code = generateId();
    const entryCount = (await kv.get(["stats", "entry_count"])).value || 0;

    const entry: ShortUrl = {
      key: short_code,
      content: url,
      stats: {access: 0, visibility: form.get("public") ? 'public' : 'private'},
      user: null,
      type: url.startsWith("http") ? "url" : "text",
      create_time: Date.now(),
    };

    // 如果是url的话，还要给url本身加上一个索引，方便下次插入时查找是否存在重复
    if (isValidUrl(url)) {
      await kv.set(["url_by_content", url], entry);
    }
    await kv.set(['url', short_code], entry);
    await kv.set(["stats", "entry_count"], entryCount + 1);
    creation_token -= 1;

    return ctx.render({
      msg: `🎉Save the link: https://${env.get("SITE_URL")!}/s/${short_code}`,
      entry_count: entryCount + 1,
    });
  },
  async GET(_req, ctx) {
    // 每次页面加载时从数据库获取最新的 entry_count
    const entryCount = (await kv.get(["stats", "entry_count"])).value || 0;
    return ctx.render({ entry_count: entryCount, creation_token });
  }
};


export default function Home(props: PageProps) {
  const { entry_count, msg } = props.data; // 要从props获得entry_count实现动态更新前端
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
