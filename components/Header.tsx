
export default function HeaderNav() {
    return (
        <nav class="container">
            <ul>
                <li><a href="/"><kbd>{Deno.env.get("SITE_URL")}</kbd></a></li>
            </ul>
            <ul>
                <li>Home</li>
            </ul>
        </nav>
    );
}
