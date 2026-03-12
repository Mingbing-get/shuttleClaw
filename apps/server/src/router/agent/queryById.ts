import { Middleware } from '@koa/router'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types/table'
import db from '../../config/db'
import {
  AGENT_TABLE_NAME,
  SKILL_TABLE_NAME,
  MCP_TABLE_NAME,
} from '../../config/consts'

const queryAgentById: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const { id } = ctx.params

  const record = await db<Table.Agent>(AGENT_TABLE_NAME).where({ id }).first()

  if (!record) {
    resModel.setError(ResponseModel.CODE.NOT_FOUND, 'Agent not found')
    return
  }

  const subAgents = await db<Table.Agent>(AGENT_TABLE_NAME)
    .where({ parentId: id })
    .select()
  const skills = await db<Table.Skill>(SKILL_TABLE_NAME)
    .where({ agentId: id })
    .select()
  const mcps = await db<Table.MCP>(MCP_TABLE_NAME)
    .where({ agentId: id })
    .select()

  resModel.setData({
    ...record,
    subAgents,
    skills,
    mcps,
  })
}

export default queryAgentById
