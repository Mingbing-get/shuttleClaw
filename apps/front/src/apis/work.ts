import { api } from './request'
import { API_ENDPOINTS } from './config'
import type {
  Table,
  QueryWorkParams,
  QueryNearOneParams,
  ListResponse,
} from './types'

export const workApi = {
  query: (params?: QueryWorkParams) =>
    api.get<ListResponse<Table.Work>>(API_ENDPOINTS.WORK.LIST, { params }),

  nearest: (params?: QueryNearOneParams) =>
    api.get<Table.Work | undefined>(API_ENDPOINTS.WORK.NEAREST, { params }),
}
