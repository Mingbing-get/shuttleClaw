import { Middleware } from '@koa/router'
import { resolve } from 'path'
import { rm } from 'fs/promises'
import { existsSync } from 'fs'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types/table'
import db from '../../config/db'
import {
  SKILL_TABLE_NAME,
  AGENT_TABLE_NAME,
  AGENT_DIR,
  SKILL_DIR,
} from '../../config/consts'

const deleteSkill: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const { id } = ctx.params

  const record = await db<Table.Skill>(SKILL_TABLE_NAME).where({ id }).first()

  if (!record) {
    resModel.setError(ResponseModel.CODE.NOT_FOUND, 'Skill not found')
    return
  }

  const agent = await db<Table.Agent>(AGENT_TABLE_NAME)
    .where({ id: record.agentId })
    .first()

  if (!agent) {
    resModel.setError(ResponseModel.CODE.NOT_FOUND, 'Agent not found')
    return
  }

  const skillDir = resolve(
    process.cwd(),
    AGENT_DIR,
    agent.name,
    SKILL_DIR,
    record.skillName,
  )
  if (existsSync(skillDir)) {
    // 深度删除目录
    await rm(skillDir, { recursive: true, force: true })
  }

  await db<Table.Skill>(SKILL_TABLE_NAME).where({ id }).delete()

  resModel.setData({ id })
}

export default deleteSkill
