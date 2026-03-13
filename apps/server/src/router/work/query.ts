import { Middleware } from '@koa/router'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types'
import db from '../../config/db'
import { WORK_TABLE_NAME } from '../../config/consts'

interface QueryParams extends Pick<
  Table.Work,
  'trigger' | 'status' | 'autoRunScope' | 'mainAgentId'
> {
  page?: string | number
  pageSize?: string | number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

const queryWork: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const {
    page = 1,
    pageSize = 10,
    trigger,
    status,
    autoRunScope,
    mainAgentId,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = ctx.query as any as QueryParams

  let query = db<Table.Work>(WORK_TABLE_NAME)

  if (trigger) {
    query = query.where('trigger', trigger)
  }

  if (status) {
    query = query.where('status', status)
  }

  if (autoRunScope) {
    query = query.where('autoRunScope', autoRunScope)
  }

  if (mainAgentId) {
    query = query.where('mainAgentId', mainAgentId)
  }

  const totalQuery = query.clone()
  const total = await totalQuery.count('* as count').first()
  const totalCount = Number((total as any)?.count || 0)

  if (Number(page) <= 0) {
    resModel.setError(
      ResponseModel.CODE.VALIDATE_ERROR,
      'page must be greater than 0',
    )
    return
  }

  const offset = (Number(page) - 1) * Number(pageSize)

  const records = await query
    .orderBy(sortBy, sortOrder)
    .limit(Number(pageSize))
    .offset(offset)
    .select('*')

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

export default queryWork
