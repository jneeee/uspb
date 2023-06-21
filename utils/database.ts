import { LibsqlClient, createClient } from "https://esm.sh/@libsql/client@0.2.0/web";

class Database {
  private readonly client: LibsqlClient;

  constructor() {
    // const config = 
    this.client = createClient(
      {
        url: Deno.env.get("TURSO_URL")!,
        authToken: Deno.env.get("TURSO_TOKEN")!
      }
    );
  }

  async insertEntry(sh_code: string, url_s: string) {
    try {
      await this.client.execute({
        sql: "insert into short_url(short_code, url) values(?, ?)",
        args: [ sh_code, url_s ]
      });
    } catch (e) {
      console.error(e);
    }
  }

  async getEntry(sh_code: string) {
    try {
      const rs = await this.client.execute({
        sql: "select * from short_url where short_code = ?",
        args: [ sh_code ]
    });
      return rs.rows[0];
    } catch (e) {
      console.error(e);
    }
  }

  async batch(cmds: Array<string>) {
    try {
      await this.client.batch(cmds);
    } catch (e) {
      console.error(e);
    }
  }

  async execute(cmd: string) {
    try {
      await this.client.execute(cmd);
    } catch (e) {
      console.error(e);
    }
  }
}

const db = new Database();
export default db;
