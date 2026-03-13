import { Middleware } from '@koa/router'

import { ResponseModel } from '../../utils/responseModel'
import { encrypt } from '../../utils/secret'
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

  const { env = {}, ...extraConfig } = record.config
  for (const key in env) {
    env[key] = encrypt(env[key])
  }

  await db<Table.MCP>(MCP_TABLE_NAME).insert({
    ...record,
    config: JSON.stringify(extraConfig),
    env: JSON.stringify(env),
  } as any)

  resModel.setData({
    ...record,
    config: extraConfig,
    envKeys: Object.keys(env),
  })
}

export default createMcp
