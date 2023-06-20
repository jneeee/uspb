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
      const sql = `insert into short_url(short_code, url) values('${sh_code}', '${url_s}')`;
      console.log(sql);
      await this.client.execute(sql);
    } catch (e) {
      console.error(e);
    }
  }

  async getEntry(sh_code: string) {
    try {
      const sql = `select * from short_url where short_code = '${sh_code}'`;
      console.log(sql);
      const rs = await this.client.execute(sql);
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
