import IconBrandGithub from "icons/brand-github.tsx";


export default function Footer() {
  return (
    <footer style="text-align: center">
      <small>{Deno.env.get("SITE_URL")}. Host by <a href="https://deno.com/deploy">Deno</a>. <IconBrandGithub/><a href="https://github/jneeee/uspb">uspb</a>. </small>
    </footer>
  )
}
