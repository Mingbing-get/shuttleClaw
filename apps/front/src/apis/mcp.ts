import { api } from './request'
import { API_ENDPOINTS } from './config'
import type { Table, Create, Update, QueryParams, ListResponse } from './types'

export const mcpApi = {
  create: (data: Create.MCP) =>
    api.post<Table.MCP>(API_ENDPOINTS.MCP.CREATE, { body: data }),

  query: (params?: QueryParams) =>
    api.get<ListResponse<Table.MCP>>(API_ENDPOINTS.MCP.LIST, { params }),

  queryByAgentId: (agentId: string) =>
    api.get<ListResponse<Table.MCP>>(API_ENDPOINTS.MCP.LIST, {
      params: { agentId, page: -1 },
    }),

  queryById: (id: string) => api.get<Table.MCP>(API_ENDPOINTS.MCP.DETAIL(id)),

  update: (id: string, data: Update.MCP) =>
    api.put<Table.MCP>(API_ENDPOINTS.MCP.UPDATE(id), { body: data }),

  delete: (id: string) => api.delete<void>(API_ENDPOINTS.MCP.DELETE(id)),
}
