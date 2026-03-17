import { Middleware } from '@koa/router'
import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types'
import db from '../../config/db'
import { WORK_TABLE_NAME } from '../../config/consts'

const getTodayStats: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const today = new Date()
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  )

  const stats = (await db<Table.Work>(WORK_TABLE_NAME)
    .where('createdAt', '>=', startOfDay.toISOString())
    .andWhere('createdAt', '<', endOfDay.toISOString())
    .select(
      db.raw('SUM(inputTokens) as totalInputTokens'),
      db.raw('SUM(outputTokens) as totalOutputTokens'),
      db.raw('COUNT(*) as requestCount'),
    )
    .first()) as any

  resModel.setData({
    totalInputTokens: Number(stats?.totalInputTokens || 0),
    totalOutputTokens: Number(stats?.totalOutputTokens || 0),
    requestCount: Number(stats?.requestCount || 0),
  })
}

export default getTodayStats
