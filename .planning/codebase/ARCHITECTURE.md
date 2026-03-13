# ShuttleClaw 架构文档

## 系统架构概览

ShuttleClaw 采用典型的前后端分离架构，结合了现代 Web 技术栈和 AI 能力。

### 架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         客户端 (React)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ AgentConfig  │  │    Chat      │  │ ModelConfig  │          │
│  │   组件       │  │   组件       │  │   组件       │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│         └─────────────────┴─────────────────┘                   │
│                           │                                     │
│                    ┌──────▼──────┐                              │
│                    │  API 层     │                              │
│                    │  (request)  │                              │
│                    └──────┬──────┘                              │
└───────────────────────────┼─────────────────────────────────────┘
                            │ HTTP/REST API
┌───────────────────────────┼─────────────────────────────────────┐
│                    ┌──────▼──────┐                              │
│                    │  Koa 服务器  │                              │
│                    └──────┬──────┘                              │
│                           │                                     │
│         ┌─────────────────┼─────────────────┐                   │
│         │                 │                 │                   │
│    ┌────▼────┐      ┌────▼────┐      ┌────▼────┐               │
│    │ 路由层   │      │ 中间件   │      │ 业务逻辑  │               │
│    │(router) │      │(middleware)│      │          │               │
│    └────┬────┘      └────┬────┘      └────┬────┘               │
│         │                 │                 │                   │
│         └─────────────────┴─────────────────┘                   │
│                           │                                     │
│                    ┌──────▼──────┐                              │
│                    │  数据访问层  │                              │
│                    │  (Knex ORM) │                              │
│                    └──────┬──────┘                              │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │  MySQL 数据库  │
                    └────────────────┘
```

## 前端架构

### 技术栈

- **React 18.2.0**: 现代化前端框架
- **Ant Design 6.1.1**: 企业级 UI 组件库
- **TypeScript 5.3.3**: 类型安全的 JavaScript 超集
- **Vite 7.2.4**: 下一代前端构建工具
- **@shuttle-ai/render-react**: Shuttle AI React 渲染组件

### 目录结构

```
apps/front/src/
├── apis/                    # API 接口层
│   ├── agent.ts            # 代理相关 API
│   ├── auth.ts             # 认证相关 API
│   ├── config.ts           # 配置相关 API
│   ├── mcp.ts              # MCP 相关 API
│   ├── model.ts            # 模型相关 API
│   ├── skill.ts            # 技能相关 API
│   ├── request.ts          # 请求封装
│   └── types.ts            # 类型定义
├── components/             # React 组件
│   ├── agentConfig/        # 代理配置组件
│   │   ├── AgentForm.tsx   # 代理表单
│   │   ├── AgentNode.tsx   # 代理节点
│   │   └── index.tsx       # 代理配置主组件
│   ├── agentPicker/        # 代理选择器
│   ├── chat/               # 聊天组件
│   ├── modelConfig/        # 模型配置组件
│   └── modelPicker/        # 模型选择器
├── config/                 # 配置文件
│   ├── const.ts            # 常量定义
│   └── transporter.ts     # 传输器配置
├── hooks/                  # React Hooks
│   ├── useAgentTree.ts     # 代理树 Hook
│   └── useAllModels.ts     # 所有模型 Hook
├── utils/                  # 工具函数
│   ├── walkForest/         # 森林遍历工具
│   └── refreshCache.ts     # 缓存刷新工具
├── index.tsx               # 应用入口
└── main.tsx                # 主入口文件
```

### 核心组件分析

#### 1. AgentConfig 组件

**位置**: `apps/front/src/components/agentConfig/index.tsx`

**功能**: 智能体配置管理界面

**核心特性**:

- 树形结构展示智能体层级关系
- 支持拖拽重新排列智能体
- 添加、编辑、删除智能体
- 懒加载和启用状态显示

**关键实现**:

```typescript
// 使用自定义 Hook 获取代理树数据
const [agentTree, loading, refreshAgentTree] = useAgentTree()

// 拖拽处理
const handleDrop = useCallback(
  async (info) => {
    // 验证拖拽目标
    // 调用 API 移动代理
    await agentApi.move(dragNode.id, { parentId: newParentId })
    refreshAgentTree()
  },
  [agentTree],
)
```

#### 2. AgentForm 组件

**位置**: `apps/front/src/components/agentConfig/AgentForm.tsx`

**功能**: 智能体创建和编辑表单

**表单字段**:

- 智能体名称 (必填)
- 描述 (必填)
- 大模型选择 (必填)
- 父级智能体 (可选，仅创建时)
- 是否懒加载
- 是否启用

**核心逻辑**:

```typescript
// 根据是否有 ID 判断是创建还是更新
const isEdit = useMemo(() => !!initialValues?.id, [initialValues?.id])

// 表单提交处理
const handleOk = useCallback(async () => {
  const values = await form.validateFields()

  let response
  if (initialValues?.id) {
    response = await agentApi.update(initialValues.id, values)
  } else {
    response = await agentApi.create(values as any)
  }

  if (response.code === 200) {
    message.success('操作成功')
    onOk?.(response.data!)
  }
}, [initialValues?.id])
```

#### 3. Chat 组件

**位置**: `apps/front/src/components/chat/index.tsx`

**功能**: AI 对话界面

**核心实现**:

```typescript
// 使用 Shuttle AI 的 React 渲染组件
<AgentWorkProvider transporter={transporter} context={{}}>
  <AgentWorkRender style={{ height: '100%' }} />
</AgentWorkProvider>
```

### 自定义 Hooks

#### useAgentTree Hook

**位置**: `apps/front/src/hooks/useAgentTree.ts`

**功能**: 管理智能体树数据

**特性**:

- 自动缓存 (30秒)
- 自动刷新机制
- 扁平化数据转树形结构

**核心实现**:

```typescript
// 使用缓存机制
const allAgentCache = new RefreshCache(async () => {
  const res = await agentApi.queryAll()
  return res.data || []
}, 1000 * 30)

// 扁平化转树形结构
function agentListToTree(agents: Table.Agent[]) {
  const tree: AgentTree[] = []
  const map: Record<string, AgentTree> = {}

  // 创建映射
  agents.forEach((agent) => {
    map[agent.id] = { ...agent, children: [] }
  })

  // 构建树形结构
  agents.forEach((agent) => {
    if (agent.parentId) {
      map[agent.parentId].children?.push(map[agent.id])
    } else {
      tree.push(map[agent.id])
    }
  })

  return tree
}
```

### API 层设计

**位置**: `apps/front/src/apis/`

**设计模式**: 统一的 API 封装

**核心特性**:

- 基于 request.ts 的统一请求封装
- 类型安全的 API 调用
- 标准化的响应处理

**示例**:

```typescript
// agent.ts
export const agentApi = {
  create: (data: Create.Agent) =>
    api.post<Table.Agent>(API_ENDPOINTS.AGENT.CREATE, { body: data }),

  query: (params?: QueryParams) =>
    api.get<ListResponse<Table.Agent>>(API_ENDPOINTS.AGENT.LIST, { params }),

  update: (id: string, data: Update.Agent) =>
    api.put<Table.Agent>(API_ENDPOINTS.AGENT.UPDATE(id), { body: data }),

  delete: (id: string) => api.delete<void>(API_ENDPOINTS.AGENT.DELETE(id)),
}
```

## 后端架构

### 技术栈

- **Koa 3.1.1**: 轻量级 Node.js Web 框架
- **TypeScript 5.3.3**: 类型安全的后端开发
- **Knex 3.1.0**: SQL 查询构建器和 ORM
- **MySQL 3.9.1**: 关系型数据库
- **LangChain 1.2.17**: AI 应用开发框架
- \*_@shuttle-ai/_: Shuttle AI 生态系统

### 目录结构

```
apps/server/src/
├── config/                 # 配置文件
│   ├── consts.ts          # 常量定义
│   ├── db.ts              # 数据库配置
│   └── snowFlake.ts       # 雪花算法 ID 生成
├── init/                   # 初始化脚本
│   ├── db.ts              # 数据库初始化
│   └── index.ts           # 初始化入口
├── middleware/             # 中间件
│   ├── errorHandle.ts     # 错误处理
│   └── jwt.ts             # JWT 认证
├── router/                 # 路由定义
│   ├── agent/             # 代理路由
│   ├── ai/                # AI 路由
│   ├── auth/              # 认证路由
│   ├── mcp/               # MCP 路由
│   ├── model/             # 模型路由
│   └── skill/             # 技能路由
├── types/                  # 类型定义
│   ├── index.ts           # 通用类型
│   └── table.ts           # 数据库表类型
├── utils/                  # 工具函数
│   ├── responseModel.ts   # 响应模型
│   ├── secret.ts          # 密钥管理
│   └── snowFlake.ts       # 雪花算法
└── index.ts                # 应用入口
```

### 核心模块分析

#### 1. 应用入口 (index.ts)

**位置**: `apps/server/src/index.ts`

**功能**: 服务器启动和中间件配置

**中间件链**:

1. CORS 跨域处理
2. koa-body 请求体解析
3. 错误处理中间件
4. 静态文件服务
5. 路由挂载

**路由挂载**:

```typescript
app.use(mount('/auth', authRouter.routes()))
app.use(mount('/ai', aiRouter.routes()))
app.use(mount('/model', modelRouter.routes()))
app.use(mount('/agent', agentRouter.routes()))
app.use(mount('/skill', skillRouter.routes()))
app.use(mount('/mcp', mcpRouter.routes()))
```

#### 2. 数据库配置 (db.ts)

**位置**: `apps/server/src/config/db.ts`

**功能**: Knex 数据库连接配置

**连接池配置**:

```typescript
pool: {
  min: Number(process.env.DB_POOL_MIN),
  max: Number(process.env.DB_POOL_MAX),
  acquireTimeoutMillis: Number(process.env.DB_POOL_ACQUIRE_TIMEOUT),
  idleTimeoutMillis: Number(process.env.DB_POOL_IDLE_TIMEOUT),
}
```

**类型转换**:

```typescript
typeCast: function (field, next) {
  // TINY(1) 转换为 boolean
  if (field.type === 'TINY' && field.length === 1) {
    return field.string() === '1'
  }
  return next()
}
```

#### 3. 数据库初始化 (init/db.ts)

**位置**: `apps/server/src/init/db.ts`

**功能**: 自动创建和同步数据库表结构

**表结构**:

- `model`: AI 模型配置
- `agent`: 智能体配置
- `skill`: 技能配置
- `mcp`: MCP 配置
- `message`: 消息记录

**同步策略**:

```typescript
async function syncTable({ tableName, fieldMap }: Options) {
  const hasTable = await db.schema.hasTable(tableName)
  if (!hasTable) {
    // 创建表
    await db.schema.createTable(tableName, (table) => {
      Object.entries(fieldMap).forEach(([fieldName, fieldBuilder]) => {
        fieldBuilder(table)
      })
    })
  } else {
    // 同步字段：添加新字段，删除旧字段
    const result = await db.raw(`SHOW COLUMNS FROM \`${tableName}\``)
    const columnNames: string[] = result[0].map((item) => item.Field)

    await db.schema.alterTable(tableName, (table) => {
      // 添加新字段
      Object.entries(fieldMap).forEach(([fieldName, fieldBuilder]) => {
        if (!columnNames.includes(fieldName)) {
          fieldBuilder(table)
        }
      })

      // 删除旧字段
      columnNames.forEach((columnName) => {
        if (!Object.keys(fieldMap).includes(columnName)) {
          table.dropColumn(columnName)
        }
      })
    })
  }
}
```

#### 4. AI 调用模块 (ai/invoke.ts)

**位置**: `apps/server/src/router/ai/invoke.ts`

**功能**: 处理 AI 调用请求，支持流式响应

**核心流程**:

```typescript
const invoke: Middleware = async (ctx) => {
  const { workId, prompt, mainAgentId, autoRunScope } = ctx.request.body

  // 设置 SSE 响应头
  ctx.type = 'application/octet-stream'
  ctx.set('Cache-Control', 'no-cache')
  ctx.set('Connection', 'keep-alive')

  // 创建可读流和 hooks
  const { stream, hooks, send, close, resolveConfirmTool, resolveAgentStart } =
    readableHook(createLoadAgent(mainAgentId))

  // 创建 AgentCluster
  const agentCluster = new AgentCluster({
    id: workId,
    hooks: hooks,
    autoRunScope,
    messageCollector: new MessageCollector(),
  })

  // 注册解析器
  resolverManager.addAgentResolver(agentCluster.id, {
    resolveConfirmTool,
    resolveAgentStart,
  })

  // 流式响应
  ctx.body = stream

  // 发送开始事件
  send({ type: 'startWork', data: { workId: agentCluster.id } })

  // 调用 AI
  agentCluster.invoke(prompt).then(closeAll)
}
```

#### 5. 代理加载器 (ai/utils/loadAgent.ts)

**位置**: `apps/server/src/router/ai/utils/loadAgent.ts`

**功能**: 动态加载代理配置和依赖

**加载流程**:

```typescript
async function loadAgent(
  name: string,
): Promise<ShuttleAi.Cluster.AgentStartReturn> {
  // 1. 查询代理基本信息
  const agent = await db<Table.Agent>(AGENT_TABLE_NAME)
    .where('name', '=', agentName)
    .first()

  // 2. 查询模型配置
  const agentModel = await db<Table.Model>(MODEL_TABLE_NAME)
    .where('id', '=', agent.modelId)
    .first()

  // 3. 查询子代理
  const subAgents = await db<Table.Agent>(AGENT_TABLE_NAME)
    .where('parentId', '=', agent.id)
    .andWhere('enabled', '=', true)
    .select()

  // 4. 查询技能
  const skills = await db<Table.Skill>(SKILL_TABLE_NAME)
    .where('agentId', '=', agent.id)
    .andWhere('enabled', '=', true)
    .select()

  // 5. 查询 MCP
  const mpcs = await db<Table.MCP>(MCP_TABLE_NAME)
    .where('agentId', '=', agent.id)
    .andWhere('enabled', '=', true)
    .select()

  // 6. 创建技能加载器
  const skillLoader = new SkillLoader({
    dir: resolve(process.cwd(), AGENT_DIR, agentName, SKILL_DIR),
    pickSkillNames: skills.map((skill) => skill.skillName),
    async getEnv(skillName) {
      const skill = skills.find((s) => s.skillName === skillName)
      return skill?.env || {}
    },
  })

  // 7. 创建 ChatOpenAI 模型
  const model = new ChatOpenAI({
    modelName: agentModel.model,
    apiKey: decrypt(agentModel.apiKey),
    configuration: { baseURL: agentModel.url },
    streaming: true,
  })

  // 8. 返回代理配置
  return {
    model,
    mcps: mpcs.map((mcp) => mcp.config),
    subAgents: subAgents.filter((subAgent) => !subAgent.isLazy),
    lazyAgents: subAgents.filter((subAgent) => subAgent.isLazy),
    skillConfig: skillLoader ? { loader: skillLoader } : undefined,
  }
}
```

#### 6. JWT 认证中间件 (middleware/jwt.ts)

**位置**: `apps/server/src/middleware/jwt.ts`

**功能**: JWT token 验证

**实现**:

```typescript
export const jwtVerify: Middleware = async (ctx, next) => {
  const xUser = ctx.request.headers['x-user'] as string
  const jwtPayload = decode(xUser)

  if (jwtPayload && !isExp(jwtPayload as JwtPayload)) {
    await next()
  } else {
    const resModel = new ResponseModel(
      ResponseModel.CODE.UNAUTHORIZED,
      'Unauthorized',
    )
    ctx.body = resModel.getResult()
  }
}

export function isExp(jwtPayload: JwtPayload) {
  if (!jwtPayload.exp) return false
  return jwtPayload.exp * 1000 <= new Date().getTime()
}
```

### 路由设计

#### 代理路由 (router/agent/)

**端点列表**:

- `POST /agent/create` - 创建代理
- `GET /agent/list` - 查询代理列表 (分页)
- `GET /agent/detail/:id` - 查询代理详情
- `PUT /agent/update/:id` - 更新代理
- `DELETE /agent/delete/:id` - 删除代理
- `POST /agent/move/:id` - 移动代理
- `GET /agent/root` - 查询根代理
- `GET /agent/all` - 查询所有代理

#### 模型路由 (router/model/)

**端点列表**:

- `POST /model/create` - 创建模型
- `GET /model/list` - 查询模型列表 (分页)
- `GET /model/detail/:id` - 查询模型详情
- `PUT /model/update/:id` - 更新模型
- `DELETE /model/delete/:id` - 删除模型

#### 技能路由 (router/skill/)

**端点列表**:

- `POST /skill/install` - 安装技能
- `GET /skill/list` - 查询技能列表
- `GET /skill/detail/:id` - 查询技能详情
- `PUT /skill/update/:id` - 更新技能
- `DELETE /skill/delete/:id` - 删除技能

#### MCP 路由 (router/mcp/)

**端点列表**:

- `POST /mcp/create` - 创建 MCP
- `GET /mcp/list` - 查询 MCP 列表
- `GET /mcp/detail/:id` - 查询 MCP 详情
- `PUT /mcp/update/:id` - 更新 MCP
- `DELETE /mcp/delete/:id` - 删除 MCP

#### AI 路由 (router/ai/)

**端点列表**:

- `POST /ai/invoke` - 调用 AI (流式响应)
- `POST /ai/report` - 报告
- `POST /ai/revokeMessage` - 撤回消息

## 数据模型

### 数据库表结构

#### model 表 (AI 模型配置)

```sql
CREATE TABLE model (
  id VARCHAR(255) PRIMARY KEY,
  url VARCHAR(255) NOT NULL,
  model VARCHAR(255) NOT NULL,
  apiKey VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

#### agent 表 (智能体配置)

```sql
CREATE TABLE agent (
  id VARCHAR(255) PRIMARY KEY,
  modelId VARCHAR(255) NOT NULL,
  name VARCHAR(20) UNIQUE NOT NULL,
  describe TEXT NOT NULL,
  parentId VARCHAR(255),
  isLazy BOOLEAN NOT NULL DEFAULT FALSE,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (modelId) REFERENCES model(id)
);
```

#### skill 表 (技能配置)

```sql
CREATE TABLE skill (
  id VARCHAR(255) PRIMARY KEY,
  agentId VARCHAR(255) NOT NULL,
  skillName VARCHAR(255) NOT NULL,
  describe TEXT,
  envDefine JSON,
  env JSON,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (agentId) REFERENCES agent(id)
);
```

#### mcp 表 (MCP 配置)

```sql
CREATE TABLE mcp (
  id VARCHAR(255) PRIMARY KEY,
  agentId VARCHAR(255) NOT NULL,
  config JSON NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (agentId) REFERENCES agent(id)
);
```

#### message 表 (消息记录)

```sql
CREATE TABLE message (
  id VARCHAR(255) PRIMARY KEY,
  role VARCHAR(20) NOT NULL,
  workId VARCHAR(255) NOT NULL,
  runAgentId VARCHAR(255) NOT NULL,
  extra JSON NOT NULL,
  createdAt DATETIME NOT NULL
);
```

### TypeScript 类型定义

#### Table 命名空间

```typescript
export namespace Table {
  export interface Agent {
    id: string
    modelId: string
    name: string
    parentId?: string
    describe: string
    isLazy: boolean
    enabled: boolean
    createdAt: string
    updatedAt: string
  }

  export interface Model {
    id: string
    url: string
    model: string
    apiKey: string
    createdAt: string
    updatedAt: string
  }

  export interface Skill {
    id: string
    agentId: string
    skillName: string
    describe: string
    envDefine?: Record<string, any> | null
    env?: Record<string, any> | null
    enabled: boolean
    createdAt: string
    updatedAt: string
  }

  export interface MCP {
    id: string
    agentId: string
    config: Record<string, any>
    enabled: boolean
    createdAt: string
    updatedAt: string
  }

  export interface Message {
    id: string
    role: string
    workId: string
    runAgentId: string
    extra: Record<string, any>
    createdAt: string
  }
}
```

## 核心业务流程

### 1. 智能体创建流程

```
用户填写表单
    ↓
前端验证
    ↓
调用 POST /agent/create
    ↓
后端验证父代理存在性
    ↓
后端验证模型存在性
    ↓
生成雪花 ID
    ↓
插入数据库
    ↓
返回创建结果
    ↓
前端刷新代理树
```

### 2. AI 调用流程

```
用户发送消息
    ↓
前端调用 POST /ai/invoke
    ↓
后端创建 AgentCluster
    ↓
加载主代理配置
    ↓
建立 Stream 连接
    ↓
发送 startWork 事件
    ↓
AgentCluster.invoke(prompt)
    ↓
动态加载子代理、技能、MCP
    ↓
流式返回 AI 响应
    ↓
发送 endWork 事件
    ↓
关闭连接
```

### 3. 代理移动流程

```
用户拖拽代理节点
    ↓
前端验证拖拽目标
    ↓
调用 POST /agent/:id/move
    ↓
后端更新 parentId
    ↓
返回成功
    ↓
前端刷新代理树
```

## 安全机制

### 1. JWT 认证

- Token 有效期: 24小时
- 通过 `x-user` 请求头传递
- 中间件自动验证过期时间

### 2. 数据加密

- API Key 使用加密存储
- 通过 `decrypt` 函数解密使用

### 3. 权限控制

- 基于角色的访问控制 (RBAC)
- 路由级别的权限验证

## 性能优化

### 1. 前端优化

- 组件懒加载
- 数据缓存 (30秒)
- 虚拟滚动 (大列表)

### 2. 后端优化

- 数据库连接池
- 流式响应 (Stream)
- 异步处理

### 3. 数据库优化

- 索引优化
- 查询优化
- 连接池管理

## 扩展性设计

### 1. 插件化架构

- 技能系统支持动态加载
- MCP 协议支持扩展

### 2. 微服务准备

- 模块化路由设计
- 独立的业务逻辑层

### 3. 多租户支持

- 数据隔离设计
- 配置化管理

## 部署架构

### 开发环境

```
前端: Vite Dev Server (端口 5173)
后端: tsx watch (端口 3100)
数据库: MySQL (本地)
```

### 生产环境

```
前端: Nginx 静态文件服务
后端: Node.js 进程管理 (PM2)
数据库: MySQL 集群
```

## 监控和日志

### 1. 日志记录

- 操作日志
- 错误日志
- 性能日志

### 2. 监控指标

- API 响应时间
- 数据库查询性能
- AI 调用成功率

## 总结

ShuttleClaw 是一个设计良好的 AI 智能体管理系统，具有以下特点：

1. **现代化技术栈**: React + Koa + TypeScript
2. **清晰的架构**: 前后端分离，模块化设计
3. **强大的 AI 能力**: 集成 LangChain 和 Shuttle AI
4. **良好的扩展性**: 插件化架构，支持动态加载
5. **完善的类型系统**: 全栈 TypeScript
6. **安全的认证机制**: JWT + 数据加密
7. **高性能**: 流式响应、连接池、缓存机制
