import { api } from './request'
import { API_ENDPOINTS } from './config'
import type {
  Table,
  Create,
  Update,
  QueryParams,
  ListResponse,
} from './types'

export const modelApi = {
  create: (data: Create.Model) =>
    api.post<Table.Model>(API_ENDPOINTS.MODEL.CREATE, { body: data }),

  query: (params?: QueryParams) =>
    api.get<ListResponse<Table.Model>>(API_ENDPOINTS.MODEL.LIST, { params }),

  queryById: (id: string) =>
    api.get<Table.Model>(API_ENDPOINTS.MODEL.DETAIL(id)),

  update: (id: string, data: Update.Model) =>
    api.put<Table.Model>(API_ENDPOINTS.MODEL.UPDATE(id), { body: data }),

  delete: (id: string) =>
    api.delete<void>(API_ENDPOINTS.MODEL.DELETE(id)),
}
