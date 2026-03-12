import { API_BASE_URL } from './config'

interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
}

interface RequestOptions {
  headers?: Record<string, string>
  params?: Record<string, any>
  body?: any
}

const getToken = (): string | null => {
  return localStorage.getItem('token')
}

const request = async <T = any>(
  url: string,
  options: RequestOptions & { method: string },
): Promise<ApiResponse<T>> => {
  const { headers = {}, params, body, method } = options

  const queryParams = params
    ? `?${new URLSearchParams(
        Object.entries(params)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(([key, value]) => [key, String(value)]),
      ).toString()}`
    : ''

  const token = getToken()

  const response = await fetch(`${API_BASE_URL}${url}${queryParams}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'x-user': token }),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const result = await response.json()

  return result as ApiResponse<T>
}

const api = {
  get: <T = any>(url: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>(url, { ...options, method: 'GET' }),

  post: <T = any>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'POST' }),

  put: <T = any>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'PUT' }),

  delete: <T = any>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'DELETE' }),
}

export { api }
export type { ApiResponse }
