
export default function HeaderNav() {
    return (
        <nav class="container">
            <ul>
                <li><kbd>{Deno.env.get("SITE_URL")}</kbd></li>
                <li><a href="/">New</a></li>
                <li><a href="/list">List</a></li>
            </ul>
            <ul>
            </ul>
        </nav>
    );
}
