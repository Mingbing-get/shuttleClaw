import { Middleware } from '@koa/router'
import { resolve } from 'path'
import { rm } from 'fs/promises'
import { existsSync } from 'fs'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types/table'
import db from '../../config/db'
import {
  AGENT_TABLE_NAME,
  SKILL_TABLE_NAME,
  MCP_TABLE_NAME,
  AGENT_DIR,
} from '../../config/consts'

const deleteAgent: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const { id } = ctx.params

  const record = await db<Table.Agent>(AGENT_TABLE_NAME).where({ id }).first()

  if (!record) {
    resModel.setError(ResponseModel.CODE.NOT_FOUND, 'Agent not found')
    return
  }

  const subAgents = await loopFindAgent([id])
  const willRemoveAgents = [...subAgents, record]
  const willRemoveIds = [...subAgents.map((item) => item.id), id]

  await db.transaction(async (trx) => {
    await trx<Table.Agent>(AGENT_TABLE_NAME)
      .whereIn('id', willRemoveIds)
      .delete()
    await trx<Table.Skill>(SKILL_TABLE_NAME)
      .whereIn('agentId', willRemoveIds)
      .delete()
    await trx<Table.MCP>(MCP_TABLE_NAME)
      .whereIn('agentId', willRemoveIds)
      .delete()

    const willRemoveAgentDirs = willRemoveAgents.map((item) => {
      return resolve(process.cwd(), AGENT_DIR, item.name)
    })

    for (const dir of willRemoveAgentDirs) {
      if (!dir) {
        continue
      }
      if (existsSync(dir)) {
        await rm(dir, { recursive: true, force: true })
      }
    }
  })

  resModel.setData({ ids: willRemoveIds })
}

async function loopFindAgent(
  ids: string[],
): Promise<Pick<Table.Agent, 'id' | 'name'>[]> {
  const subAgents = await db<Table.Agent>(AGENT_TABLE_NAME)
    .whereIn('parentId', ids)
    .select('id', 'name')

  if (subAgents.length === 0) {
    return []
  }

  const subAgentIds = subAgents.map((item) => item.id)
  const subSubAgents = await loopFindAgent(subAgentIds)
  return [...subAgents, ...subSubAgents]
}

export default deleteAgent
