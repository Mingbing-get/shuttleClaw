import { Middleware } from '@koa/router'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types/table'
import db from '../../config/db'
import { AGENT_TABLE_NAME } from '../../config/consts'

interface QueryParams {
  page?: string | number
  pageSize?: string | number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

const queryAgent: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const {
    page = 1,
    pageSize = 10,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = ctx.query as any as QueryParams

  let query = db<Table.Agent>(AGENT_TABLE_NAME)

  if (search) {
    query = query.where((builder) => {
      builder
        .where('name', 'like', `%${search}%`)
        .orWhere('describe', 'like', `%${search}%`)
    })
  }

  const totalQuery = query.clone()
  const total = await totalQuery.count('* as count').first()
  const totalCount = Number((total as any)?.count || 0)

  const offset = (Number(page) - 1) * Number(pageSize)

  const records = await query
    .orderBy(sortBy, sortOrder)
    .limit(Number(pageSize))
    .offset(offset)

  resModel.setData({
    list: records,
    pagination: {
      page: Number(page),
      pageSize: Number(pageSize),
      total: totalCount,
      totalPages: Math.ceil(totalCount / Number(pageSize)),
    },
  })
}

export default queryAgent