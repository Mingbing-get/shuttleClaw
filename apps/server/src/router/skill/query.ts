import { Middleware } from '@koa/router'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types/table'
import db from '../../config/db'
import { SKILL_TABLE_NAME } from '../../config/consts'

interface QueryParams {
  page?: string | number
  pageSize?: string | number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  agentId?: string
}

const querySkill: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const {
    page = 1,
    pageSize = 10,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    agentId,
  } = ctx.query as any as QueryParams

  let query = db<Table.Skill>(SKILL_TABLE_NAME)

  if (agentId) {
    query = query.where({ agentId })
  }

  if (search) {
    query = query.where('skillName', 'like', `%${search}%`)
  }

  const totalQuery = query.clone()
  const total = await totalQuery.count('* as count').first()
  const totalCount = Number((total as any)?.count || 0)

  if (Number(page) > 0) {
    const offset = (Number(page) - 1) * Number(pageSize)
    query = query.limit(Number(pageSize)).offset(offset)
  }

  const records = await query.orderBy(sortBy, sortOrder)
  const hiddenEnvRecords = records.map((record) => {
    const { env = {}, ...extra } = record
    return {
      ...extra,
      envKeys: Object.keys(env || {}),
    }
  })

  resModel.setData({
    list: hiddenEnvRecords,
    pagination: {
      page: Number(page),
      pageSize: Number(pageSize),
      total: totalCount,
      totalPages: Math.ceil(totalCount / Number(pageSize)),
    },
  })
}

export default querySkill
