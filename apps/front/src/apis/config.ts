const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const API_BASE_URL = BASE_URL

export const API_ENDPOINTS = {
  AUTH: {
    CHECK: '/auth/check',
  },
  AGENT: {
    LIST: '/agent',
    DETAIL: (id: string) => `/agent/${id}`,
    CREATE: '/agent',
    UPDATE: (id: string) => `/agent/${id}`,
    DELETE: (id: string) => `/agent/${id}`,
    MOVE: (id: string) => `/agent/${id}/move`,
    ROOT: '/agent/root',
    ALL: '/agent/all',
  },
  AI: {
    INVOKE: '/ai/invoke',
    REPORT: '/ai/report',
    REVOKE_MESSAGE: '/ai/revokeMessage',
  },
  MCP: {
    LIST: '/mcp',
    DETAIL: (id: string) => `/mcp/${id}`,
    CREATE: '/mcp',
    UPDATE: (id: string) => `/mcp/${id}`,
    DELETE: (id: string) => `/mcp/${id}`,
  },
  MODEL: {
    LIST: '/model',
    DETAIL: (id: string) => `/model/${id}`,
    CREATE: '/model',
    UPDATE: (id: string) => `/model/${id}`,
    DELETE: (id: string) => `/model/${id}`,
  },
  SKILL: {
    LIST: '/skill',
    DETAIL: (id: string) => `/skill/${id}`,
    INSTALL: '/skill',
    UPDATE: (id: string) => `/skill/${id}`,
    DELETE: (id: string) => `/skill/${id}`,
  },
}
