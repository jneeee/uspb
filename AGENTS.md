# Agent Instructions

本项目中 AI Agent 的行为规范和约束。

## 安全警告

### 删除操作权限漏洞

当前项目的删除逻辑**没有任何权限控制**，存在严重安全隐患：

- **位置**: `routes/list.tsx` 的 DELETE handler
- **问题**: 任何人无需认证即可删除任意链接
- **风险**: 恶意用户可通过构造 `DELETE /list?key={shortCode}` 请求删除数据

Agent 在开发时需要注意：
1. 禁止在未添加认证的情况下增加批量删除功能
2. 任何新的删除接口必须实现权限验证
3. 推荐方案：添加密码验证或 session 认证

## 项目规范

### 技术栈
- **框架**: Deno Fresh 1.7.3
- **语言**: TypeScript
- **数据库**: Deno KV (SQLite)
- **UI**: Preact

### 测试规范
- **测试框架**: Deno test
- **文件命名**: `{filename}.test.ts` 或 `{filename}.test.tsx`
- **位置**: 测试文件与被测文件放在同一目录
- **运行命令**: `deno test -A`
- **CI**: GitHub Actions (`.github/workflows/test.yml`)

### 代码风格
- 使用 `const` 而非 `let`（除非需要重新赋值）
- Button 组件必须指定 `type` 属性
- 避免未使用变量
- 运行 `deno lint` 检查

### 命令参考
```bash
# 开发
deno task start

# 测试
deno test -A

# Lint
deno lint

# 构建
deno task build
```

## Agent 行为约束

1. **禁止删除操作**: 不得执行 `rm`、`git clean` 等删除命令
2. **权限控制优先**: 涉及数据修改的功能必须先实现认证
3. **测试覆盖**: 新增功能需包含单元测试
4. **中文注释**: 代码注释使用中文
