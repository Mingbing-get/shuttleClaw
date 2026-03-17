import { api } from './request'

export interface TodayStats {
  totalInputTokens: number
  totalOutputTokens: number
  requestCount: number
}

export interface MonthlyStats {
  dates: string[]
  agents: string[]
  data: Record<string, Record<string, number>>
}

export const dashboardApi = {
  getTodayStats: () => api.get<TodayStats>('/dashboard/todayStats'),
  getMonthlyStats: () => api.get<MonthlyStats>('/dashboard/monthlyStats'),
}
