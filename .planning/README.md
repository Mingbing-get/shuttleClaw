# ShuttleClaw 逆向工程文档索引

## 文档概述

本目录包含对 ShuttleClaw 项目的完整逆向工程分析文档，所有文档均使用中文编写。

## 文档列表

### 1. [项目概述](./PROJECT.md)
**文件**: `PROJECT.md`

**内容**:
- 项目基本信息
- 技术栈概览
- 项目结构说明
- 核心功能模块
- 数据模型
- 开发命令
- 架构特点
- 设计模式
- 技术亮点

**适用人群**: 项目管理者、技术决策者、新加入的开发者

---

### 2. [架构文档](./codebase/ARCHITECTURE.md)
**文件**: `codebase/ARCHITECTURE.md`

**内容**:
- 系统架构概览
- 架构图
- 前端架构详解
- 后端架构详解
- 核心模块分析
- 路由设计
- 数据模型
- 核心业务流程
- 安全机制
- 性能优化
- 扩展性设计
- 部署架构
- 监控和日志

**适用人群**: 架构师、高级开发者、技术负责人

---

### 3. [API 文档](./codebase/API.md)
**文件**: `codebase/API.md`

**内容**:
- API 基础信息
- 统一响应格式
- 状态码说明
- 智能体管理 API
- 模型管理 API
- 技能管理 API
- MCP 管理 API
- AI 调用 API
- 认证 API
- 错误处理
- 最佳实践
- 版本历史

**适用人群**: 前端开发者、API 使用者、集成开发者

---

### 4. [逆向工程分析报告](./REVERSE_ENGINEERING_REPORT.md)
**文件**: `REVERSE_ENGINEERING_REPORT.md`

**内容**:
- 执行摘要
- 项目结构分析
- 技术栈分析
- 核心功能分析
- 数据模型分析
- 安全机制分析
- 性能优化分析
- 扩展性分析
- 代码质量分析
- 业务流程分析
- 潜在问题和改进建议
- 总结

**适用人群**: 项目管理者、技术审计人员、重构团队

---

## 文档使用指南

### 快速入门

1. **了解项目**: 先阅读 [项目概述](./PROJECT.md)
2. **理解架构**: 再阅读 [架构文档](./codebase/ARCHITECTURE.md)
3. **使用 API**: 参考 [API 文档](./codebase/API.md)
4. **深入分析**: 查看 [逆向工程分析报告](./REVERSE_ENGINEERING_REPORT.md)

### 按角色阅读

#### 项目管理者
- [项目概述](./PROJECT.md) - 了解项目全貌
- [逆向工程分析报告](./REVERSE_ENGINEERING_REPORT.md) - 了解项目优势和风险

#### 架构师
- [架构文档](./codebase/ARCHITECTURE.md) - 深入了解系统架构
- [逆向工程分析报告](./REVERSE_ENGINEERING_REPORT.md) - 了解技术选型和设计决策

#### 前端开发者
- [项目概述](./PROJECT.md) - 了解前端技术栈
- [API 文档](./codebase/API.md) - 了解 API 接口
- [架构文档](./codebase/ARCHITECTURE.md) - 了解前端架构

#### 后端开发者
- [项目概述](./PROJECT.md) - 了解后端技术栈
- [API 文档](./codebase/API.md) - 了解 API 实现
- [架构文档](./codebase/ARCHITECTURE.md) - 了解后端架构

#### API 集成者
- [API 文档](./codebase/API.md) - 完整的 API 参考
- [项目概述](./PROJECT.md) - 了解认证方式

#### 技术审计人员
- [逆向工程分析报告](./REVERSE_ENGINEERING_REPORT.md) - 全面的技术分析
- [架构文档](./codebase/ARCHITECTURE.md) - 了解架构设计

---

## 核心概念

### 智能体 (Agent)
AI 智能体是系统的核心实体，具有以下特点：
- 支持树形层级结构
- 可以关联多个技能和 MCP
- 支持懒加载和启用状态控制
- 使用指定的 AI 模型

### 模型 (Model)
AI 模型配置，包含：
- API 端点 URL
- 模型名称
- API Key（加密存储）

### 技能 (Skill)
AI 技能插件，支持：
- 从 GitHub 安装
- 环境变量配置
- 动态加载

### MCP (Model Context Protocol)
模型上下文协议配置，用于扩展 AI 能力

---

## 技术栈速查

### 前端
- **框架**: React 18.2.0
- **UI 库**: Ant Design 6.1.1
- **语言**: TypeScript 5.3.3
- **构建工具**: Vite 7.2.4

### 后端
- **框架**: Koa 3.1.1
- **ORM**: Knex 3.1.0
- **数据库**: MySQL 3.9.1
- **语言**: TypeScript 5.3.3
- **AI 框架**: LangChain 1.2.17

### AI 生态
- @shuttle-ai/agent 0.0.12
- @shuttle-ai/skill 0.0.12
- @shuttle-ai/mcp-client 0.0.12
- @shuttle-ai/render-react 0.0.12
- @shuttle-ai/client 0.0.12

---

## 关键文件位置

### 前端核心文件
- 主入口: `apps/front/src/main.tsx`
- 应用入口: `apps/front/src/index.tsx`
- API 层: `apps/front/src/apis/`
- 组件层: `apps/front/src/components/`
- Hooks: `apps/front/src/hooks/`

### 后端核心文件
- 主入口: `apps/server/src/index.ts`
- 路由定义: `apps/server/src/router/`
- 中间件: `apps/server/src/middleware/`
- 配置: `apps/server/src/config/`
- 类型定义: `apps/server/src/types/`

---

## 开发命令速查

### 根项目
```bash
pnpm dev:server    # 启动后端开发服务器
pnpm dev:front     # 启动前端开发服务器
pnpm build         # 构建所有应用
pnpm test          # 运行测试
pnpm lint          # 代码检查
```

### 前端
```bash
pnpm dev           # 启动开发服务器
pnpm build         # 构建生产版本
pnpm type-check    # TypeScript 类型检查
```

### 后端
```bash
pnpm dev           # 启动开发服务器
pnpm start         # 启动生产服务器
pnpm build         # 构建 TypeScript
pnpm type-check    # TypeScript 类型检查
```

---

## 数据库表速查

| 表名 | 用途 | 关键字段 |
|------|------|----------|
| agent | 智能体配置 | id, name, modelId, parentId, isLazy, enabled |
| model | AI 模型配置 | id, url, model, apiKey |
| skill | 技能配置 | id, agentId, skillName, envDefine, env |
| mcp | MCP 配置 | id, agentId, config |
| message | 消息记录 | id, role, workId, runAgentId, extra |

---

## API 端点速查

### 智能体
- `POST /agent` - 创建
- `GET /agent` - 列表
- `GET /agent/:id` - 详情
- `PUT /agent/:id` - 更新
- `DELETE /agent/:id` - 删除
- `POST /agent/:id/move` - 移动
- `GET /agent/root` - 根节点
- `GET /agent/all` - 全部

### 模型
- `POST /model` - 创建
- `GET /model` - 列表
- `GET /model/:id` - 详情
- `PUT /model/:id` - 更新
- `DELETE /model/:id` - 删除

### 技能
- `POST /skill/install` - 安装
- `GET /skill` - 列表
- `GET /skill/:id` - 详情
- `PUT /skill/:id` - 更新
- `DELETE /skill/:id` - 删除

### MCP
- `POST /mcp` - 创建
- `GET /mcp` - 列表
- `GET /mcp/:id` - 详情
- `PUT /mcp/:id` - 更新
- `DELETE /mcp/:id` - 删除

### AI
- `POST /ai/invoke` - 调用 (流式)
- `POST /ai/report` - 报告
- `POST /ai/revokeMessage` - 撤回消息

### 认证
- `POST /auth/check` - 检查

---

## 常见问题

### Q1: 如何启动项目？
A: 参见 [项目概述](./PROJECT.md) 中的开发命令部分。

### Q2: 如何调用 AI？
A: 参见 [API 文档](./codebase/API.md) 中的 AI 调用部分。

### Q3: 如何安装技能？
A: 参见 [API 文档](./codebase/API.md) 中的技能管理部分。

### Q4: 如何配置数据库？
A: 参见 [架构文档](./codebase/ARCHITECTURE.md) 中的数据库配置部分。

### Q5: 如何进行认证？
A: 参见 [API 文档](./codebase/API.md) 中的认证方式部分。

---

## 更新日志

### v1.0.0 (2026-03-13)
- 初始版本
- 完成项目逆向工程分析
- 生成完整的中文文档

---

## 联系方式

- **作者**: Mingbing-get
- **邮箱**: 1508850533@qq.com
- **GitHub**: https://github.com/Mingbing-get/shuttleClaw

---

## 许可证

MIT License

---

**文档生成时间**: 2026-03-13  
**分析工具**: GSD (Get Shit Done)  
**文档语言**: 中文