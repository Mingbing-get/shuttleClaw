import { Middleware } from '@koa/router'
import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types'
import db from '../../config/db'
import { WORK_TABLE_NAME, AGENT_TABLE_NAME } from '../../config/consts'

const getMonthlyStats: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)

  const stats = await db<Table.Work>(WORK_TABLE_NAME)
    .join(
      AGENT_TABLE_NAME,
      `${WORK_TABLE_NAME}.mainAgentId`,
      '=',
      `${AGENT_TABLE_NAME}.id`,
    )
    .where(`${WORK_TABLE_NAME}.createdAt`, '>=', startOfMonth.toISOString())
    .andWhere(`${WORK_TABLE_NAME}.createdAt`, '<', endOfMonth.toISOString())
    .select(
      `${AGENT_TABLE_NAME}.name as agentName`,
      db.raw(`DATE(${WORK_TABLE_NAME}.createdAt) as date`),
      db.raw('SUM(inputTokens + outputTokens) as totalTokens'),
    )
    .groupBy(`${AGENT_TABLE_NAME}.name`)
    .groupByRaw(`DATE(${WORK_TABLE_NAME}.createdAt)`)
    .orderByRaw(`DATE(${WORK_TABLE_NAME}.createdAt) ASC`)
    .orderBy(`${AGENT_TABLE_NAME}.name`, 'ASC')

  const result: Record<string, Record<string, number>> = {}
  const dates: string[] = []
  const agents: string[] = []

  stats.forEach((stat: any) => {
    const date = stat.date
    const agentName = stat.agentName
    const totalTokens = Number(stat.totalTokens)

    if (!dates.includes(date)) {
      dates.push(date)
    }

    if (!agents.includes(agentName)) {
      agents.push(agentName)
    }

    if (!result[agentName]) {
      result[agentName] = {}
    }

    result[agentName][date] = totalTokens
  })

  resModel.setData({
    dates,
    agents,
    data: result,
  })
}

export default getMonthlyStats
