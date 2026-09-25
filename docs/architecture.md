# 心屿架构决策

## 当前阶段

Phase 3 已增加作品草稿、编辑与投稿审核的服务端状态机。首页内容仍为静态设计基线，不把示例内容当成真实作品。

## 目录约定

- `src/app`：路由、页面与后续 Route Handlers。
- `src/components`：跨页面复用的展示组件；按 `layout`、`ui`、`work`、`admin` 划分。
- `src/features`：后续按领域划分的用例与页面组合。
- `src/server`：后续服务、仓储、权限策略和任务；不得被客户端组件直接导入。
- `prisma`：Prisma schema、迁移和种子数据。
- `tests`：单元、集成和端到端测试。

## 产品约束

- 游客可以阅读全部已发布的公开作品。
- 所有投稿都必须经历人工审核：`DRAFT → PENDING_REVIEW → PUBLISHED / REJECTED`。
- 前台列表、搜索和作者主页只能展示 `PUBLISHED` 内容。
- 后续持久化用户输入时，Markdown 必须服务端净化，权限必须服务端校验。

## 作品投稿约定

- 创建作品只会生成 `DRAFT`，且只有作者本人可编辑。
- 作品提交时保存不可变版本，并从 `DRAFT` 或 `REJECTED` 迁移到 `PENDING_REVIEW`。
- 前台没有任何可绕过审核直接变更为 `PUBLISHED` 的接口。
- 默认分类由 `prisma/seed.ts` 幂等写入，运行 `pnpm db:seed` 即可初始化。

## 认证约定

- 邮箱/密码登录使用 Auth.js 的 Credentials Provider 与 JWT 会话。
- 密码以 bcrypt 成本因子 12 的哈希形式保存；绝不返回或记录密码。
- `DATABASE_URL` 缺失时数据库客户端会在实际使用时明确失败，防止构建或预览意外连接错误数据库。
- `USER`、`MODERATOR` 与 `ADMIN` 是服务端权限来源，客户端页面不作为授权依据。
