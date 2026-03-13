import { Middleware } from '@koa/router'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types/table'
import db from '../../config/db'
import { MCP_TABLE_NAME } from '../../config/consts'
import { encrypt } from '../../utils/secret'

const updateMcp: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const { id } = ctx.params
  const data = ctx.request.body as any as Table.UpdateRecord<
    Omit<Table.MCP, 'agentId'>
  > & {
    envKeys?: string[]
  }

  const oldRecord = await db<Table.MCP>(MCP_TABLE_NAME)
    .where({ id })
    .first('env')

  if (!oldRecord) {
    resModel.setError(ResponseModel.CODE.NOT_FOUND, 'MCP not found')
    return
  }

  const { env = {}, ...extraConfig } = data.config || {}
  const newEnvs =
    data.envKeys?.reduce((prev: Record<string, string>, key) => {
      const oldV = oldRecord.env?.[key]
      if (oldV) {
        prev[key] = oldV
      }
      return prev
    }, {}) ||
    oldRecord.env ||
    {}
  for (const key in env) {
    newEnvs[key] = encrypt(env[key])
  }

  const updateData = {
    config: data.config ? JSON.stringify(extraConfig) : undefined,
    env: JSON.stringify(newEnvs),
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
  const { env: queryEnv, ...extra } = record || {}
  resModel.setData({
    ...extra,
    envKeys: Object.keys(queryEnv || {}),
  })
}

export default updateMcp
