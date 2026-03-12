import { Middleware } from '@koa/router'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types/table'
import db from '../../config/db'
import { MCP_TABLE_NAME } from '../../config/consts'

const deleteMcp: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const { id } = ctx.params

  const record = await db<Table.MCP>(MCP_TABLE_NAME).where({ id }).first()

  if (!record) {
    resModel.setError(ResponseModel.CODE.NOT_FOUND, 'MCP not found')
    return
  }

  await db<Table.MCP>(MCP_TABLE_NAME).where({ id }).delete()

  resModel.setData({ id })
}

export default deleteMcp