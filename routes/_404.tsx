import { UnknownPageProps } from "$fresh/server.ts";
import ContentMeta from "@/components/ContentMeta.tsx";


export default function NotFoundPage({ url }: UnknownPageProps) {
  return (
    <body>
      <ContentMeta />
      <main class="container">
        <p>404 not found: {url.pathname}</p>
      </main>
    </body>
  )
}
