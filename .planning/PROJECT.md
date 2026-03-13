# ShuttleClaw 项目逆向工程文档

## 项目概述

ShuttleClaw 是一个基于 AI 的智能代理管理系统，采用前后端分离架构。

### 项目基本信息

- **项目名称**: ShuttleClaw
- **作者**: Mingbing-get
- **许可证**: MIT
- **包管理器**: pnpm 8.15.4
- **仓库**: https://github.com/Mingbing-get/shuttleClaw

### 技术栈

#### 前端技术栈

- **框架**: React 18.2.0
- **UI 库**: Ant Design 6.1.1
- **构建工具**: Vite 7.2.4
- **语言**: TypeScript 5.3.3
- **核心依赖**:
  - `@shuttle-ai/render-react` - Shuttle AI React 渲染库
  - `@shuttle-ai/client` - Shuttle AI 客户端
  - `@shuttle-ai/type` - Shuttle AI 类型定义

#### 后端技术栈

- **框架**: Koa 3.1.1
- **路由**: @koa/router 14.0.0
- **数据库**: MySQL 3.9.1 (通过 Knex 3.1.0 ORM)
- **认证**: JWT (jsonwebtoken 9.0.2, koa-jwt 4.0.4)
- **AI 框架**: LangChain 1.2.17
- **语言**: TypeScript 5.3.3
- **运行时**: tsx 4.7.1
- **核心依赖**:
  - `@shuttle-ai/skill` - Shuttle AI 技能管理
  - `@shuttle-ai/mcp-client` - Shuttle AI MCP 客户端
  - `@shuttle-ai/agent` - Shuttle AI 代理管理
  - `@shuttle-ai/type` - Shuttle AI 类型定义

### 项目结构

```
shuttleClaw/
├── apps/
│   ├── front/                 # 前端应用
│   │   ├── src/
│   │   │   ├── apis/         # API 接口层
│   │   │   ├── components/   # React 组件
│   │   │   ├── config/       # 配置文件
│   │   │   ├── hooks/        # React Hooks
│   │   │   └── utils/        # 工具函数
│   │   └── package.json
│   └── server/               # 后端应用
│       ├── src/
│       │   ├── config/       # 配置文件
│       │   ├── init/         # 初始化脚本
│       │   ├── middleware/   # 中间件
│       │   ├── router/       # 路由定义
│       │   ├── types/        # 类型定义
│       │   └── utils/        # 工具函数
│       └── package.json
├── .planning/                # GSD 项目管理目录
├── package.json              # 根项目配置
└── tsconfig.json             # TypeScript 配置
```

## 核心功能模块

### 前端模块

#### 1. API 接口层 (`src/apis/`)

- `agent.ts` - 代理相关 API
- `auth.ts` - 认证相关 API
- `config.ts` - 配置相关 API
- `mcp.ts` - MCP 相关 API
- `model.ts` - 模型相关 API
- `skill.ts` - 技能相关 API
- `request.ts` - 请求封装
- `types.ts` - 类型定义

#### 2. 组件层 (`src/components/`)

- `agentConfig/` - 代理配置组件
  - `AgentForm.tsx` - 代理表单
  - `AgentNode.tsx` - 代理节点
- `agentPicker/` - 代理选择器
- `chat/` - 聊天组件
- `modelConfig/` - 模型配置组件
- `modelPicker/` - 模型选择器
- `authRouter.tsx` - 认证路由

#### 3. Hooks (`src/hooks/`)

- `useAgentTree.ts` - 代理树 Hook
- `useAllModels.ts` - 所有模型 Hook

#### 4. 工具函数 (`src/utils/`)

- `walkForest/` - 森林遍历工具
- `refreshCache.ts` - 缓存刷新工具

### 后端模块

#### 1. 配置模块 (`src/config/`)

- `consts.ts` - 常量定义
- `db.ts` - 数据库配置
- `snowFlake.ts` - 雪花算法 ID 生成

#### 2. 初始化模块 (`src/init/`)

- `db.ts` - 数据库初始化
- `index.ts` - 初始化入口

#### 3. 中间件 (`src/middleware/`)

- `errorHandle.ts` - 错误处理
- `jwt.ts` - JWT 认证

#### 4. 路由模块 (`src/router/`)

- `agent/` - 代理路由
  - `all.ts` - 查询所有代理
  - `create.ts` - 创建代理
  - `delete.ts` - 删除代理
  - `index.ts` - 路由入口
  - `move.ts` - 移动代理
  - `query.ts` - 查询代理
  - `queryById.ts` - 按 ID 查询代理
  - `root.ts` - 根代理
  - `update.ts` - 更新代理
- `ai/` - AI 路由
  - `utils/` - AI 工具
    - `loadAgent.ts` - 加载代理
    - `messageCollector.ts` - 消息收集器
    - `resolverManager.ts` - 解析器管理器
  - `index.ts` - 路由入口
  - `invoke.ts` - 调用 AI
  - `report.ts` - 报告
  - `revokeMessage.ts` - 撤回消息
- `auth/` - 认证路由
  - `check.ts` - 检查认证
  - `index.ts` - 路由入口
- `mcp/` - MCP 路由
  - `create.ts` - 创建 MCP
  - `delete.ts` - 删除 MCP
  - `index.ts` - 路由入口
  - `query.ts` - 查询 MCP
  - `queryById.ts` - 按 ID 查询 MCP
  - `update.ts` - 更新 MCP
- `model/` - 模型路由
  - `create.ts` - 创建模型
  - `delete.ts` - 删除模型
  - `index.ts` - 路由入口
  - `query.ts` - 查询模型
  - `queryById.ts` - 按 ID 查询模型
  - `update.ts` - 更新模型
- `skill/` - 技能路由
  - `delete.ts` - 删除技能
  - `index.ts` - 路由入口
  - `install.ts` - 安装技能
  - `query.ts` - 查询技能
  - `queryById.ts` - 按 ID 查询技能
  - `update.ts` - 更新技能

#### 5. 类型定义 (`src/types/`)

- `index.ts` - 通用类型
- `table.ts` - 数据库表类型

#### 6. 工具函数 (`src/utils/`)

- `responseModel.ts` - 响应模型
- `secret.ts` - 密钥管理
- `snowFlake.ts` - 雪花算法

## 数据模型

### 核心实体

1. **Agent (代理)**
   - 支持树形结构
   - 支持懒加载
   - 支持启用/禁用状态
   - 包含名称、描述等基本信息

2. **Model (模型)**
   - AI 模型配置
   - 支持创建、查询、更新、删除

3. **Skill (技能)**
   - AI 技能管理
   - 支持安装、查询、更新、删除

4. **MCP (Model Context Protocol)**
   - 模型上下文协议管理
   - 支持创建、查询、更新、删除

5. **Auth (认证)**
   - JWT 认证
   - 用户认证检查

## 开发命令

### 根项目命令

```bash
pnpm dev:server    # 启动后端开发服务器
pnpm dev:front     # 启动前端开发服务器
pnpm build         # 构建所有应用
pnpm test          # 运行测试
pnpm lint          # 代码检查
pnpm clean         # 清理构建产物
```

### 前端命令

```bash
pnpm dev           # 启动开发服务器
pnpm build         # 构建生产版本
pnpm type-check    # TypeScript 类型检查
```

### 后端命令

```bash
pnpm dev           # 启动开发服务器 (使用 tsx watch)
pnpm start         # 启动生产服务器
pnpm build         # 构建 TypeScript
pnpm type-check    # TypeScript 类型检查
```

## 逆向工程分析

### 架构特点

1. **Monorepo 架构**: 使用 pnpm workspace 管理多个应用
2. **前后端分离**: React 前端 + Koa 后端
3. **RESTful API**: 标准的 REST 接口设计
4. **JWT 认证**: 基于 token 的身份认证
5. **AI 集成**: 集成 LangChain 和 Shuttle AI 生态
6. **数据库**: MySQL + Knex ORM

### 设计模式

1. **分层架构**: API 层 → 业务逻辑层 → 数据访问层
2. **组件化设计**: React 组件化开发
3. **路由模块化**: 按功能模块划分路由
4. **中间件模式**: Koa 中间件处理横切关注点

### 技术亮点

1. **TypeScript 全栈**: 前后端都使用 TypeScript
2. **现代构建工具**: Vite 前端构建，tsx 后端开发
3. **AI 能力**: 集成 LangChain 和 Shuttle AI
4. **代码规范**: ESLint + Prettier + Commitlint
5. **Git 工作流**: Husky + lint-staged 自动化

## 待分析内容

- [ ] 数据库表结构详细分析
- [ ] API 接口详细文档
- [ ] 组件交互流程分析
- [ ] AI 调用流程分析
- [ ] 认证授权流程分析
- [ ] 错误处理机制分析
