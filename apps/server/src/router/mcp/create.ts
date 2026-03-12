import { Middleware } from '@koa/router'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types/table'
import snowFlake from '../../config/snowFlake'
import db from '../../config/db'
import { AGENT_TABLE_NAME, MCP_TABLE_NAME } from '../../config/consts'

const createMcp: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const data = ctx.request.body as any as Table.CreateRecord<Table.MCP>

  const agent = await db<Table.Agent>(AGENT_TABLE_NAME)
    .where('id', '=', data.agentId)
    .first()

  if (!agent) {
    resModel.setError(ResponseModel.CODE.NOT_FOUND, 'Agent not found')
    return
  }

  const record = {
    ...data,
    id: snowFlake.next(),
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  }

  await db<Table.MCP>(MCP_TABLE_NAME).insert({
    ...record,
    config: JSON.stringify(record.config),
  } as any)

  resModel.setData(record)
}

export default createMcp
