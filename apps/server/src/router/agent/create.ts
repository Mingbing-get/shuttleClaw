import { Middleware } from '@koa/router'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types/table'
import snowFlake from '../../config/snowFlake'
import db from '../../config/db'
import { AGENT_TABLE_NAME, MODEL_TABLE_NAME } from '../../config/consts'

const createAgent: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const data = ctx.request.body as any as Table.CreateRecord<Table.Agent>

  if (data.parentId) {
    const parentRecord = await db<Table.Agent>(AGENT_TABLE_NAME)
      .where({ id: data.parentId })
      .first()
    if (!parentRecord) {
      resModel.setError(ResponseModel.CODE.NOT_FOUND, 'Parent agent not found')
      return
    }
  }

  const modelRecord = await db<Table.Model>(MODEL_TABLE_NAME)
    .where({ id: data.modelId })
    .first()
  if (!modelRecord) {
    resModel.setError(ResponseModel.CODE.NOT_FOUND, 'Model not found')
    return
  }

  const record = {
    ...data,
    id: snowFlake.next(),
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  }

  await db<Table.Agent>(AGENT_TABLE_NAME).insert(record)

  resModel.setData(record)
}

export default createAgent
