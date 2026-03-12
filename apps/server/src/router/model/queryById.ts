import { Middleware } from '@koa/router'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types'
import db from '../../config/db'
import { MODEL_TABLE_NAME } from '../../config/consts'

const queryModelById: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const { id } = ctx.params

  const record = await db<Table.Model>(MODEL_TABLE_NAME)
    .where({ id })
    .first()
    .select('createdAt', 'updatedAt', 'model', 'url', 'id')

  if (!record) {
    resModel.setError(ResponseModel.CODE.NOT_FOUND, 'Model not found')
    return
  }

  resModel.setData(record)
}

export default queryModelById
