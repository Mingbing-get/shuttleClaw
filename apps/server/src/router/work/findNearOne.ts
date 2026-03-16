import { Middleware } from '@koa/router'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types'
import db from '../../config/db'
import { WORK_TABLE_NAME } from '../../config/consts'

interface QueryNearOneParams extends Pick<
  Partial<Table.Work>,
  'trigger' | 'status' | 'autoRunScope' | 'mainAgentId'
> {
  lastId?: string
}

const findNearOneWork: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const { trigger, status, autoRunScope, mainAgentId, lastId } =
    ctx.query as any as QueryNearOneParams

  let query = db<Table.Work>(WORK_TABLE_NAME)

  if (lastId) {
    query = query.where('id', '<', lastId)
  }

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

  const record = await query.orderBy('id', 'desc').first()

  resModel.setData(record)
}

export default findNearOneWork
