import { api } from './request'
import { API_ENDPOINTS } from './config'
import type { Table, Create, Update, QueryParams, ListResponse } from './types'

export const modelApi = {
  create: (data: Create.Model) =>
    api.post<Omit<Table.Model, 'apiKey'>>(API_ENDPOINTS.MODEL.CREATE, {
      body: data,
    }),

  query: (params?: QueryParams) =>
    api.get<ListResponse<Omit<Table.Model, 'apiKey'>>>(
      API_ENDPOINTS.MODEL.LIST,
      { params },
    ),

  queryById: (id: string) =>
    api.get<Omit<Table.Model, 'apiKey'>>(API_ENDPOINTS.MODEL.DETAIL(id)),

  update: (id: string, data: Update.Model) =>
    api.put<Omit<Table.Model, 'apiKey'>>(API_ENDPOINTS.MODEL.UPDATE(id), {
      body: data,
    }),

  delete: (id: string) => api.delete<void>(API_ENDPOINTS.MODEL.DELETE(id)),
}
