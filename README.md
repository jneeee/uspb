# USPB
uspb = **Url Shorter + Paste Bin**.

The visitor submits a text. For the content starts with `http`, It provider a redirect, else it will display a card with the input text.

It's hosted by [Deno](https://deno.dev), using [Turso](https://turso.tech/) db service.

[![Made with Fresh](https://fresh.deno.dev/fresh-badge.svg)](https://fresh.deno.dev)

[Demo](https://s.114114.xyz/)

## Usage

1. Fork the repo
2. Go to [Deno](https://deno.dev), integrate with your github account.
3. Create a project use the repo you just forked.
3. Go to [Truso](https://turso.tech/), It's a edge database service. Create your own db and get the token.
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
4. Create the table with the schema:
```
# Create the table;
turso db shell mydata
# in the db shell
create table short_url(
  short_code varchar(10) PRIMARY KEY,
  url text not null,
  access_count integer default 0,
  created_at integer default (cast(unixepoch() as int))
);
# Press Ctrl+D for quit
```
5. Set the env in Deno project in `projects -> Setting -> Environment Variables`. Here is example:
```
SITE_URL='s.114114.xyz'
TURSO_URL="libsql://xxx.turso.io"
TURSO_TOKEN="..."
```

## TODO

- [ ] Multi lang support
- [ ] url access count
- [ ] login with github and save the input history

