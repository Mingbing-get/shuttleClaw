import { ShuttleAi } from '@shuttle-ai/type'

export namespace Table {
  export type CreateRecord<T extends Record<string, any>> = Omit<
    T,
    'id' | 'createdAt' | 'updatedAt'
  >

  export type UpdateRecord<T extends Record<string, any>> = Omit<
    Partial<T>,
    'id' | 'createdAt' | 'updatedAt'
  > & {
    id: string
  }

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
    env?: Record<string, string> | null
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
    enabled: boolean
    createdAt: string
    updatedAt: string
  }
}
