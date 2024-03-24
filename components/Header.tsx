
export default function HeaderNav() {
    return (
        <nav class="container">
            <ul>
                <li><a href="/"><kbd>{Deno.env.get("SITE_URL")}</kbd></a></li>
                <li><a href="/list">List</a></li>
            </ul>
            <ul>
                <li>Login</li>
            </ul>
        </nav>
    );
}
