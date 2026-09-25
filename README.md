# 心屿

面向年轻创作者的开放文学社区。

## 开发

需要 Node.js 24+ 与 pnpm 11+：

```bash
pnpm dev
```

打开 `http://localhost:3000`。

## 当前进度

已完成 Phase 1：Next.js 项目骨架、基础视觉系统、响应式首页、工程配置与架构文档。

Phase 10 已完成 Docker 交付、健康检查与部署文档。详见 [部署指南](docs/deployment.md)。

## 封闭测试

在部署环境中设置 `BETA_MODE=true` 和一个强度足够的 `BETA_INVITE_CODE`，即可启用邀请码注册。该模式保留公开作品阅读，但拒绝所有未持有效邀请码的注册请求，并要求搜索引擎不要收录页面。邀请码只应私下发送给测试成员，不能提交到 Git 仓库。
