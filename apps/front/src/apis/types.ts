import { ShuttleAi } from '@shuttle-ai/type'

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

  export interface MCP {
    id: string
    agentId: string
    config: Record<string, any>
    envKeys?: string[]
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
    envDefine?: {
      requires?: string[]
      variables?: string[]
    } | null
    env?: Record<string, string> | null
    envKeys?: string[]
    enabled: boolean
    createdAt: string
    updatedAt: string
  }

  export interface Work {
    id: string
    mainAgentId: string
    prompt: string
    autoRunScope?: ShuttleAi.Cluster.AutoRunScope
    trigger?: 'user' | 'agent' | 'scheduled'
    status: 'running' | 'completed' | 'failed'
    createdAt: string
    endedAt?: string
  }
}

export namespace Create {
  type InstallSource = {
    type: 'github'
    url: string
  }

  export type Agent = Omit<Table.Agent, 'id' | 'createdAt' | 'updatedAt'>
  export type MCP = Omit<Table.MCP, 'id' | 'createdAt' | 'updatedAt'>
  export type Model = Omit<Table.Model, 'id' | 'createdAt' | 'updatedAt'>
  export type Skill = Pick<Table.Skill, 'agentId' | 'enabled'> & {
    installSource: InstallSource
  }
}

export namespace Update {
  export type Agent = Partial<
    Omit<Table.Agent, 'id' | 'name' | 'parentId' | 'createdAt' | 'updatedAt'>
  >
  export type MCP = Partial<
    Omit<Table.MCP, 'id' | 'agentId' | 'createdAt' | 'updatedAt'>
  >
  export type Model = Partial<
    Omit<Table.Model, 'id' | 'createdAt' | 'updatedAt'>
  >
  export type Skill = Partial<Pick<Table.Skill, 'enabled' | 'env' | 'envKeys'>>
}

export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface ListResponse<T> {
  list: T[]
  pagination: Pagination
}

export interface QueryParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface InvokeParams {
  workId: string
  prompt: string
  mainAgentId?: string
  autoRunScope?: any
}

export interface ReportParams {
  workId: string
  data: any
}

export interface RevokeMessageParams {
  workId: string
  messageId: string
}

export interface MoveAgentParams {
  parentId?: string
}

export interface QueryWorkParams extends Pick<
  Table.Work,
  'trigger' | 'status' | 'autoRunScope' | 'mainAgentId'
> {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
