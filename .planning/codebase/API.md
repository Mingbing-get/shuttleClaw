# ShuttleClaw API 文档

## 概述

ShuttleClaw 提供了一套完整的 RESTful API，用于管理智能体、模型、技能和 MCP 等资源。所有 API 都遵循统一的响应格式，并使用 JWT 进行身份认证。

## 基础信息

### Base URL

```
http://localhost:3100
```

### 认证方式

所有 API 请求都需要在请求头中包含 JWT token：

```
x-user: <your-jwt-token>
```

### 统一响应格式

所有 API 返回统一的 JSON 格式：

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 401 | 未授权 |
| 404 | 资源不存在 |
| 461 | 参数错误 |
| 462 | 验证错误 |
| 463 | 未知错误 |
| 500 | 服务器内部错误 |

## API 端点

### 1. 智能体管理 (Agent)

#### 1.1 创建智能体

**端点**: `POST /agent`

**认证**: 需要

**请求体**:

```json
{
  "name": "智能体名称",
  "describe": "智能体描述",
  "modelId": "模型ID",
  "parentId": "父级智能体ID（可选）",
  "isLazy": true,
  "enabled": true
}
```

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "生成的ID",
    "name": "智能体名称",
    "describe": "智能体描述",
    "modelId": "模型ID",
    "parentId": "父级智能体ID",
    "isLazy": true,
    "enabled": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**业务逻辑**:
- 验证父级智能体是否存在（如果提供了 parentId）
- 验证模型是否存在
- 使用雪花算法生成 ID
- 自动设置创建时间和更新时间

#### 1.2 查询智能体列表（分页）

**端点**: `GET /agent`

**认证**: 需要

**查询参数**:

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | number | 否 | 1 | 页码 |
| pageSize | number | 否 | 10 | 每页数量 |
| search | string | 否 | - | 搜索关键词（匹配名称或描述） |
| sortBy | string | 否 | createdAt | 排序字段 |
| sortOrder | string | 否 | desc | 排序方向（asc/desc） |

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "智能体ID",
        "name": "智能体名称",
        "describe": "智能体描述",
        "modelId": "模型ID",
        "parentId": "父级智能体ID",
        "isLazy": true,
        "enabled": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

#### 1.3 查询智能体详情

**端点**: `GET /agent/:id`

**认证**: 需要

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 智能体ID |

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "智能体ID",
    "name": "智能体名称",
    "describe": "智能体描述",
    "modelId": "模型ID",
    "parentId": "父级智能体ID",
    "isLazy": true,
    "enabled": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "id": "技能ID",
        "agentId": "智能体ID",
        "skillName": "技能名称",
        "describe": "技能描述",
        "envDefine": {},
        "env": {},
        "enabled": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "mcps": [
      {
        "id": "MCP ID",
        "agentId": "智能体ID",
        "config": {},
        "enabled": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "subAgents": [
      {
        "id": "子智能体ID",
        "name": "子智能体名称",
        "describe": "子智能体描述",
        "isLazy": true,
        "enabled": true
      }
    ]
  }
}
```

#### 1.4 更新智能体

**端点**: `PUT /agent/:id`

**认证**: 需要

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 智能体ID |

**请求体**:

```json
{
  "describe": "新的描述",
  "enabled": false,
  "isLazy": false,
  "modelId": "新的模型ID"
}
```

**注意**: 
- `name` 和 `parentId` 字段不可更新
- 所有字段都是可选的

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "智能体ID",
    "name": "智能体名称",
    "describe": "新的描述",
    "modelId": "新的模型ID",
    "parentId": "父级智能体ID",
    "isLazy": false,
    "enabled": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 1.5 删除智能体

**端点**: `DELETE /agent/:id`

**认证**: 需要

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 智能体ID |

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "ids": ["智能体ID", "子智能体ID1", "子智能体ID2"]
  }
}
```

**业务逻辑**:
- 递归删除所有子智能体
- 删除关联的技能和 MCP
- 删除技能文件目录
- 使用数据库事务确保数据一致性

#### 1.6 移动智能体

**端点**: `POST /agent/:id/move`

**认证**: 需要

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 智能体ID |

**请求体**:

```json
{
  "parentId": "新的父级智能体ID（可选，不传则设为根节点）"
}
```

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "智能体ID",
    "name": "智能体名称",
    "describe": "智能体描述",
    "modelId": "模型ID",
    "parentId": "新的父级智能体ID",
    "isLazy": true,
    "enabled": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**业务逻辑**:
- 验证智能体不能移动到自己下面
- 验证智能体不能移动到自己的子孙节点下面
- 验证父级智能体是否存在

#### 1.7 查询根智能体

**端点**: `GET /agent/root`

**认证**: 需要

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "智能体ID",
      "name": "智能体名称",
      "describe": "智能体描述",
      "modelId": "模型ID",
      "parentId": null,
      "isLazy": true,
      "enabled": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 1.8 查询所有智能体

**端点**: `GET /agent/all`

**认证**: 需要

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "智能体ID",
      "name": "智能体名称",
      "describe": "智能体描述",
      "modelId": "模型ID",
      "parentId": "父级智能体ID",
      "isLazy": true,
      "enabled": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. 模型管理 (Model)

#### 2.1 创建模型

**端点**: `POST /model`

**认证**: 需要

**请求体**:

```json
{
  "url": "https://api.openai.com/v1",
  "model": "gpt-4",
  "apiKey": "sk-..."
}
```

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "生成的ID",
    "url": "https://api.openai.com/v1",
    "model": "gpt-4",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**注意**: API Key 会被加密存储，响应中不返回明文

#### 2.2 查询模型列表（分页）

**端点**: `GET /model`

**认证**: 需要

**查询参数**:

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | number | 否 | 1 | 页码 |
| pageSize | number | 否 | 10 | 每页数量 |
| search | string | 否 | - | 搜索关键词 |
| sortBy | string | 否 | createdAt | 排序字段 |
| sortOrder | string | 否 | desc | 排序方向 |

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "模型ID",
        "url": "https://api.openai.com/v1",
        "model": "gpt-4",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 10,
      "totalPages": 1
    }
  }
}
```

#### 2.3 查询模型详情

**端点**: `GET /model/:id`

**认证**: 需要

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 模型ID |

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "模型ID",
    "url": "https://api.openai.com/v1",
    "model": "gpt-4",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2.4 更新模型

**端点**: `PUT /model/:id`

**认证**: 需要

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 模型ID |

**请求体**:

```json
{
  "url": "新的URL",
  "model": "新的模型名称",
  "apiKey": "新的API Key"
}
```

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "模型ID",
    "url": "新的URL",
    "model": "新的模型名称",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2.5 删除模型

**端点**: `DELETE /model/:id`

**认证**: 需要

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 模型ID |

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 3. 技能管理 (Skill)

#### 3.1 安装技能

**端点**: `POST /skill/install`

**认证**: 需要

**请求体**:

```json
{
  "agentId": "智能体ID",
  "installSource": {
    "type": "github",
    "url": "https://github.com/username/repo"
  },
  "enabled": true
}
```

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "生成的ID",
      "agentId": "智能体ID",
      "skillName": "技能名称",
      "describe": "技能描述",
      "envDefine": {},
      "env": {},
      "enabled": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**业务逻辑**:
- 验证智能体是否存在
- 从 GitHub 仓库下载技能
- 解析技能元数据（描述、环境变量定义）
- 将技能安装到指定目录
- 将技能信息保存到数据库

#### 3.2 查询技能列表

**端点**: `GET /skill`

**认证**: 需要

**查询参数**:

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | number | 否 | 1 | 页码 |
| pageSize | number | 否 | 10 | 每页数量 |
| search | string | 否 | - | 搜索关键词 |
| sortBy | string | 否 | createdAt | 排序字段 |
| sortOrder | string | 否 | desc | 排序方向 |

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "技能ID",
        "agentId": "智能体ID",
        "skillName": "技能名称",
        "describe": "技能描述",
        "envDefine": {},
        "env": {},
        "enabled": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 10,
      "totalPages": 1
    }
  }
}
```

#### 3.3 查询技能详情

**端点**: `GET /skill/:id`

**认证**: 需要

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 技能ID |

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "技能ID",
    "agentId": "智能体ID",
    "skillName": "技能名称",
    "describe": "技能描述",
    "envDefine": {},
    "env": {},
    "enabled": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 3.4 更新技能

**端点**: `PUT /skill/:id`

**认证**: 需要

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 技能ID |

**请求体**:

```json
{
  "enabled": false,
  "env": {
    "API_KEY": "value"
  }
}
```

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "技能ID",
    "agentId": "智能体ID",
    "skillName": "技能名称",
    "describe": "技能描述",
    "envDefine": {},
    "env": {
      "API_KEY": "value"
    },
    "enabled": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 3.5 删除技能

**端点**: `DELETE /skill/:id`

**认证**: 需要

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 技能ID |

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 4. MCP 管理 (MCP)

#### 4.1 创建 MCP

**端点**: `POST /mcp`

**认证**: 需要

**请求体**:

```json
{
  "agentId": "智能体ID",
  "config": {
    "name": "MCP名称",
    "command": "命令",
    "args": []
  },
  "enabled": true
}
```

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "生成的ID",
    "agentId": "智能体ID",
    "config": {
      "name": "MCP名称",
      "command": "命令",
      "args": []
    },
    "enabled": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**业务逻辑**:
- 验证智能体是否存在
- 将 config 序列化为 JSON 存储

#### 4.2 查询 MCP 列表

**端点**: `GET /mcp`

**认证**: 需要

**查询参数**:

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | number | 否 | 1 | 页码 |
| pageSize | number | 否 | 10 | 每页数量 |
| search | string | 否 | - | 搜索关键词 |
| sortBy | string | 否 | createdAt | 排序字段 |
| sortOrder | string | 否 | desc | 排序方向 |

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "MCP ID",
        "agentId": "智能体ID",
        "config": {
          "name": "MCP名称",
          "command": "命令",
          "args": []
        },
        "enabled": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 10,
      "totalPages": 1
    }
  }
}
```

#### 4.3 查询 MCP 详情

**端点**: `GET /mcp/:id`

**认证**: 需要

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | MCP ID |

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "MCP ID",
    "agentId": "智能体ID",
    "config": {
      "name": "MCP名称",
      "command": "命令",
      "args": []
    },
    "enabled": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 4.4 更新 MCP

**端点**: `PUT /mcp/:id`

**认证**: 需要

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | MCP ID |

**请求体**:

```json
{
  "config": {
    "name": "新的MCP名称",
    "command": "新的命令",
    "args": []
  },
  "enabled": false
}
```

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "MCP ID",
    "agentId": "智能体ID",
    "config": {
      "name": "新的MCP名称",
      "command": "新的命令",
      "args": []
    },
    "enabled": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 4.5 删除 MCP

**端点**: `DELETE /mcp/:id`

**认证**: 需要

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | MCP ID |

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 5. AI 调用 (AI)

#### 5.1 调用 AI（流式响应）

**端点**: `POST /ai/invoke`

**认证**: 需要

**请求体**:

```json
{
  "workId": "工作ID",
  "prompt": "用户提示词",
  "mainAgentId": "主智能体ID（可选）",
  "autoRunScope": {
    "maxSteps": 10,
    "timeout": 60000
  }
}
```

**响应**: Server-Sent Events (SSE) 流式响应

**事件类型**:

1. **startWork**: 开始工作
```json
{
  "type": "startWork",
  "data": {
    "workId": "工作ID"
  }
}
```

2. **message**: 消息事件
```json
{
  "type": "message",
  "data": {
    "role": "user|assistant|system",
    "content": "消息内容",
    "agentId": "智能体ID"
  }
}
```

3. **toolCall**: 工具调用
```json
{
  "type": "toolCall",
  "data": {
    "toolName": "工具名称",
    "arguments": {},
    "agentId": "智能体ID"
  }
}
```

4. **toolResult**: 工具结果
```json
{
  "type": "toolResult",
  "data": {
    "toolName": "工具名称",
    "result": {},
    "agentId": "智能体ID"
  }
}
```

5. **agentStart**: 智能体启动
```json
{
  "type": "agentStart",
  "data": {
    "agentId": "智能体ID",
    "agentName": "智能体名称"
  }
}
```

6. **endWork**: 结束工作
```json
{
  "type": "endWork",
  "data": {
    "workId": "工作ID"
  }
}
```

**业务逻辑**:
- 创建 AgentCluster 实例
- 动态加载智能体配置（模型、技能、MCP、子智能体）
- 建立流式连接
- 处理用户提示词
- 返回流式响应
- 自动清理资源

#### 5.2 报告

**端点**: `POST /ai/report`

**认证**: 需要

**请求体**:

```json
{
  "workId": "工作ID",
  "data": {}
}
```

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

#### 5.3 撤回消息

**端点**: `POST /ai/revokeMessage`

**认证**: 需要

**请求体**:

```json
{
  "workId": "工作ID",
  "messageId": "消息ID"
}
```

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 6. 认证 (Auth)

#### 6.1 检查认证

**端点**: `POST /auth/check`

**认证**: 需要

**请求体**: 无

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "valid": true,
    "user": {}
  }
}
```

**业务逻辑**:
- 验证 JWT token 是否有效
- 检查 token 是否过期
- 返回用户信息

## 错误处理

所有 API 在出错时都会返回统一的错误格式：

```json
{
  "code": 404,
  "message": "Agent not found",
  "data": null
}
```

### 常见错误

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 401 | 未授权 | 检查 JWT token 是否有效 |
| 404 | 资源不存在 | 检查资源 ID 是否正确 |
| 461 | 参数错误 | 检查请求参数格式 |
| 462 | 验证错误 | 检查数据验证规则 |
| 500 | 服务器内部错误 | 联系管理员 |

## 最佳实践

### 1. 认证

- 始终在请求头中包含有效的 JWT token
- 定期刷新 token 以避免过期
- 妥善保管 token，避免泄露

### 2. 错误处理

- 始终检查响应中的 `code` 字段
- 根据错误码和消息进行相应的错误处理
- 记录错误日志以便调试

### 3. 分页查询

- 合理设置 `pageSize`，避免一次请求过多数据
- 使用 `search` 参数进行模糊搜索
- 使用 `sortBy` 和 `sortOrder` 进行排序

### 4. 流式响应

- 使用 EventSource 或类似库处理 SSE 响应
- 处理连接断开的情况
- 及时清理资源

### 5. 数据验证

- 在发送请求前验证数据格式
- 检查必填字段是否提供
- 验证数据类型和范围

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | 2024-01-01 | 初始版本 |

## 联系方式

如有问题或建议，请联系：
- 作者: Mingbing-get
- 邮箱: 1508850533@qq.com
- GitHub: https://github.com/Mingbing-get/shuttleClaw