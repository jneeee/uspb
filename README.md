# USPB
uspb = **Url Shorter + Paste Bin**.

[中文文档](/README_ZH.md)

The visitor submits the text. For the text starts with `http`, It provider a redirect, otherwise it will display a card with the input text.

It's hosted by [Deno](https://deno.dev), using [Deno kv](https://deno.com/kv) OR [Turso](https://turso.tech/) database service.

[![Made with Fresh](https://fresh.deno.dev/fresh-badge.svg)](https://fresh.deno.dev)

[Demo](https://uspb.deno.dev/) (This is just a demo, no data security guarantees are provided.)

## 1 Usage
This project supports independent deployment after forking. There are two database options: denokv (recommended) and turso database.

### 1.1 Use DenoKV as database
1. Fork the repo
2. Go to [Deno](https://deno.dev), integrate with your github account.
3. Create a project use the repo you just forked.
4. Set ENV in your project
```
SITE_URL='uspb.deno.dev'
```
`PASSWD` is an optional environment variable; if it does not exist, it will not be validated during create short url.

That's all

### 1.2 Use Turso as database
[Turso](https://turso.tech/) is a edge database service.

1. Fork the repo(**use branch turso_as_db as deploy branch**)
2. Go to [Deno](https://deno.dev), integrate with your github account.
3. Create a project use the repo you just forked.
4. Go to turso dashborad, create your own database and get the token.
```
# install the turso CLI
curl -sSfL https://get.tur.so/install.sh | bash
# Create a db
turso auth login
turso db create mydata

# Get the url
turso db list

# Get the token
turso db tokens create mydata
```
5. Create the table with the schema:
```
# Into SQL CLI;
turso db shell mydata
# in the SQL CLI
create table short_url(
  short_code varchar(10) PRIMARY KEY,
  url text not null,
  access_count integer default 0,
  created_at integer default (cast(unixepoch() as int))
);
# Press Ctrl+D for quit
```
6. Set the env in Deno project in `projects -> Setting -> Environment Variables`. Here is example:
```
SITE_URL='uspb.deno.dev'
TURSO_URL="libsql://xxx.turso.io"
TURSO_TOKEN="..."
PASSWD="Changeme" (Optional)
```

### 1.3 self-hosted
Run your instance with containers:

```shell
docker run -d --name uspb -v ~/vol/uspb:/app/data -p 3000:3000 -e SITE_URL=xxx.com ghcr.io/jneeee/uspb:latest
```
Consider replacing the following options:

| Option | Explanation |
| ------ | ----------- |
| -v ./xx:/app/data | Persist data in sqlite3 file Outside the container |
| -p xx:3000 | the port to expose |
| -e SITE_URL=<site addr> | your site address |
