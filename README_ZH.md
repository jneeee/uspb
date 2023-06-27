# USPB
uspb = **Url Shorter + Paste Bin**. 是个短连接 + 文本存储的服务

用户提交一个文本，会获得一个短链接。如果文本内容是`http`开头，访问这个短链接会提供跳转。否则显示文本内容。

部署在 [Deno](https://deno.dev), 使用 [Turso](https://turso.tech/) 数据库服务。

[![Made with Fresh](https://fresh.deno.dev/fresh-badge.svg)](https://fresh.deno.dev)

[演示](https://uspb.deno.dev/)

## 用法

1. Fork 本仓库
2. 用你的 github 账户登录 [Deno](https://deno.dev)
3. 创建一个新的项目（project），用你刚刚 fork 的仓库。
4. 参考 [Turso](https://turso.tech/) 数据库的文档, 创建你自己的数据库，并获取 token。大概过程参考如下
```
# 安装 turso CLI
curl -sSfL https://get.tur.so/install.sh | bash
# 登录并创建数据库
turso auth login
turso db create mydata

# 获取数据库 url
turso db list

# 获取 Token
turso db tokens create mydata
```
5. 通过如下 schema 创建表:
```
# 进入 SQL CLI;
turso db shell mydata
# 在 SQL CLI 中
create table short_url(
  short_code varchar(10) PRIMARY KEY,
  url text not null,
  access_count integer default 0,
  created_at integer default (cast(unixepoch() as int))
);
# 按 Ctrl+D 退出
```
6. 设置 Deno 项目的环境变量，操作路径是 `projects -> Setting -> Environment Variables`. 参考如下:
```
SITE_URL='uspb.deno.dev'
TURSO_URL="libsql://xxx.turso.io"
TURSO_TOKEN="..."
PASSWD="xxx"
```

## TODO

- [ ] 多语言支持
- [ ] url 访问统计
- [ ] 可用 github 登录并查看创建历史

