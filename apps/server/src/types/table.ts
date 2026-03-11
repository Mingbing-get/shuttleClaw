export namespace Table {
  export interface Agent {
    id: string
    modelId: string
    name: string
    parentId?: string
    describe: string
    isMain: boolean
    isLazy: boolean
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
    env?: Record<string, any> | null
    enabled: boolean
    createdAt: string
    updatedAt: string
  }
}
