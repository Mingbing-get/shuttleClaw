import { Middleware } from '@koa/router'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types'
import db from '../../config/db'
import { AGENT_TABLE_NAME, MODEL_TABLE_NAME } from '../../config/consts'

const deleteModel: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const { id } = ctx.params

  const record = await db<Table.Model>(MODEL_TABLE_NAME).where({ id }).first()

  if (!record) {
    resModel.setError(ResponseModel.CODE.NOT_FOUND, 'Model not found')
    return
  }

  const agent = await db<Table.Agent>(AGENT_TABLE_NAME)
    .where({ modelId: id })
    .first()

  if (agent) {
    resModel.setError(
      ResponseModel.CODE.VALIDATE_ERROR,
      'Model is used by agent',
    )
    return
  }

  await db<Table.Model>(MODEL_TABLE_NAME).where({ id }).delete()

  resModel.setData({ id })
}

export default deleteModel
