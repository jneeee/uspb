# USPB
uspb = **Url Shorter + Paste Bin**.

访客提交文本。对于以 `http` 开头的文本，它提供重定向；否则，它将显示一个包含输入文本的卡片。

它由 [Deno](https://deno.dev) 托管，使用 [Deno kv](https://deno.com/kv) 或 [Turso](https://turso.tech/) 数据库服务。

[![Made with Fresh](https://fresh.deno.dev/fresh-badge.svg)](https://fresh.deno.dev)

[演示](https://uspb.deno.dev/)（这只是一个演示，不提供数据安全保证。）

## 1 使用方法
该项目支持 fork 后独立部署。有两种数据库选项：denokv（推荐）和 turso database。

### 1.1 使用 DenoKV 作为数据库
1. Fork 该仓库
2. 前往 [Deno](https://deno.dev)，并与您的 github 账号集成。
3. 使用您刚刚 fork 的仓库创建一个项目。
4. 在您的项目中设置 ENV
```
SITE_URL='uspb.deno.dev'
```

`PASSWD` 是一个可选的环境变量：如果不存在，将不会在之后创建URL时进行验证。


### 1.2 使用 Turso 作为数据库
[Turso](https://turso.tech/) 是一个边缘数据库服务。

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

### 1.3 自托管
使用容器运行你的实例：

```shell
docker run -d --name uspb -v ~/vol/uspb:/app/data -p 3000:3000 -e SITE_URL=xxx.com ghcr.io/jneeee/uspb:v0.2
```
请考虑根据需要替换以下选项：

| 选项 | 解释 |
| ------ | ----------- |
| -v ./xx:/app/data | 在容器外保存sqlite3文件 |
| -p xx:3000 | 外部监听端口 |
| -e SITE_URL=<site addr> | 你的站点地址 |
