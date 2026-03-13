import { api } from './request'
import { API_ENDPOINTS } from './config'
import type { Table, Create, Update, QueryParams, ListResponse } from './types'

export const skillApi = {
  install: (data: Create.Skill) =>
    api.post<Table.Skill[]>(API_ENDPOINTS.SKILL.INSTALL, { body: data }),

  query: (params?: QueryParams) =>
    api.get<ListResponse<Table.Skill>>(API_ENDPOINTS.SKILL.LIST, { params }),

  queryByAgentId: (agentId: string) =>
    api.get<ListResponse<Table.Skill>>(API_ENDPOINTS.SKILL.LIST, {
      params: { agentId, page: -1 },
    }),

  queryById: (id: string) =>
    api.get<Table.Skill>(API_ENDPOINTS.SKILL.DETAIL(id)),

  update: (id: string, data: Update.Skill) =>
    api.put<Table.Skill>(API_ENDPOINTS.SKILL.UPDATE(id), { body: data }),

  delete: (id: string) => api.delete<void>(API_ENDPOINTS.SKILL.DELETE(id)),
}
