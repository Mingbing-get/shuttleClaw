import { Middleware } from '@koa/router'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types'
import snowFlake from '../../config/snowFlake'
import db from '../../config/db'
import { MODEL_TABLE_NAME } from '../../config/consts'

const createModel: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const data = ctx.request.body as any as Table.CreateRecord<Table.Model>

  const record = {
    ...data,
    id: snowFlake.next(),
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  }

  await db<Table.Model>(MODEL_TABLE_NAME).insert(record)

  resModel.setData(record)
}

export default createModel
