import { api } from './request'
import { API_ENDPOINTS } from './config'
import type {
  Table,
  Create,
  Update,
  QueryParams,
  ListResponse,
  MoveAgentParams,
} from './types'

export const agentApi = {
  create: (data: Create.Agent) =>
    api.post<Table.Agent>(API_ENDPOINTS.AGENT.CREATE, { body: data }),

  query: (params?: QueryParams) =>
    api.get<ListResponse<Table.Agent>>(API_ENDPOINTS.AGENT.LIST, { params }),

  queryById: (id: string) =>
    api.get<
      Table.Agent & {
        skills: Table.Skill[]
        mcps: Table.MCP[]
        subAgents: Table.Agent[]
      }
    >(API_ENDPOINTS.AGENT.DETAIL(id)),

  update: (id: string, data: Update.Agent) =>
    api.put<Table.Agent>(API_ENDPOINTS.AGENT.UPDATE(id), { body: data }),

  delete: (id: string) => api.delete<void>(API_ENDPOINTS.AGENT.DELETE(id)),

  move: (id: string, data: MoveAgentParams) =>
    api.post<void>(API_ENDPOINTS.AGENT.MOVE(id), { body: data }),

  queryRoot: () => api.get<Table.Agent[]>(API_ENDPOINTS.AGENT.ROOT),

  queryAll: () => api.get<Table.Agent[]>(API_ENDPOINTS.AGENT.ALL),
}
