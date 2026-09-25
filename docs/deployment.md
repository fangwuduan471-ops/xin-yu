# 心屿部署指南

## 本地 Docker 部署

1. 将 `.env.example` 复制为 `.env`，填写至少以下值：

   ```env
   POSTGRES_PASSWORD=使用强随机密码
   AUTH_SECRET=使用至少 32 字符的随机密钥
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

2. 构建并启动：

   ```bash
   docker compose up --build
   ```

Compose 会等待 PostgreSQL 健康检查通过，然后执行 Prisma 迁移，最后启动应用。首次启动后可运行 `docker compose exec app` 以外的迁移容器命令或在本机执行 `pnpm db:seed` 写入默认分类。

## 托管部署

- 应用容器需要 `DATABASE_URL`、`AUTH_SECRET` 与 `NEXT_PUBLIC_APP_URL`。
- 数据库需使用托管 PostgreSQL，并启用自动备份与连接池。
- 先在发布任务执行 `pnpm db:deploy`，再替换应用实例。
- 反向代理必须启用 HTTPS，并把站点域名作为 `NEXT_PUBLIC_APP_URL`。

## 上线检查清单

- [ ] `AUTH_SECRET` 为独立、强随机值，未提交到仓库。
- [ ] 数据库使用私有网络或 IP 白名单，且已启用备份。
- [ ] 迁移已在生产数据库成功执行，默认分类已导入。
- [ ] `/api/health` 返回 `status: ok` 且 `databaseConfigured: true`。
- [ ] 注册、审核、发布、举报和管理员权限在生产环境完成冒烟测试。
- [ ] HTTPS、日志、错误监控与异常告警已启用。
