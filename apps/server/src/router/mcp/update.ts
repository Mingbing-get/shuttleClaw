import { Middleware } from '@koa/router'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types/table'
import db from '../../config/db'
import { MCP_TABLE_NAME } from '../../config/consts'

const updateMcp: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const { id } = ctx.params
  const data = ctx.request.body as any as Table.UpdateRecord<
    Omit<Table.MCP, 'agentId'>
  >

  const updateData = {
    config: JSON.stringify(data.config),
    enabled: data.enabled,
    updatedAt: new Date() as any,
  }

  const result = await db<Table.MCP>(MCP_TABLE_NAME)
    .where({ id })
    .update(updateData as any)

  if (result === 0) {
    resModel.setError(ResponseModel.CODE.NOT_FOUND, 'MCP not found')
    return
  }

  const record = await db<Table.MCP>(MCP_TABLE_NAME).where({ id }).first()
  resModel.setData(record)
}

export default updateMcp
