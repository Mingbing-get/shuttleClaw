import { Middleware } from '@koa/router'

import { encrypt } from '../../utils/secret'
import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types'
import db from '../../config/db'
import { MODEL_TABLE_NAME } from '../../config/consts'

const updateModel: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const { id } = ctx.params
  const data = ctx.request.body as any as Table.UpdateRecord<Table.Model>

  const updateData = {
    ...data,
    id,
    updatedAt: new Date() as any,
  }
  if (updateData.apiKey) {
    updateData.apiKey = encrypt(updateData.apiKey)
  }

  const result = await db<Table.Model>(MODEL_TABLE_NAME)
    .where({ id })
    .update(updateData)

  if (result === 0) {
    resModel.setError(ResponseModel.CODE.NOT_FOUND, 'Model not found')
    return
  }

  const record = await db<Table.Model>(MODEL_TABLE_NAME)
    .where({ id })
    .first()
    .select('createdAt', 'updatedAt', 'model', 'url', 'id')
  resModel.setData(record)
}

export default updateModel
