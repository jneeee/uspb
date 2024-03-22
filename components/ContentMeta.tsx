import { Head } from "$fresh/runtime.ts";

const DESCRIPTION = "A url shorter and paste bin service";
const KEYWORDS = [
  "url shorter",
  "paste bin",
  "uspb",
];
const TITLE = 'uspb - ' + Deno.env.get("SITE_URL");

const TYPE = "website";
const LOCALE = "en_US";


export default function ContentMeta() {
  return (
    <Head>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:type" content={TYPE} />
      <meta property="og:locale" content={LOCALE} />
      <meta name="keywords" content={KEYWORDS.join(", ")} />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2.0.6/css/pico.min.css" crossorigin="anonymous" />
      <link rel="stylesheet" href="/style.css" />
    </Head>
  );
}
