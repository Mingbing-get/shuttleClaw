import { Middleware } from '@koa/router'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types/table'
import db from '../../config/db'
import { SKILL_TABLE_NAME } from '../../config/consts'

const updateSkill: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const { id } = ctx.params
  const data = ctx.request.body as any as Pick<Table.Skill, 'enabled' | 'env'>

  const updateData = {
    enabled: data.enabled,
    env: JSON.stringify(data.env),
    updatedAt: new Date(),
  }

  const result = await db<Table.Skill>(SKILL_TABLE_NAME)
    .where({ id })
    .update(updateData as any)

  if (result === 0) {
    resModel.setError(ResponseModel.CODE.NOT_FOUND, 'Skill not found')
    return
  }

  const record = await db<Table.Skill>(SKILL_TABLE_NAME).where({ id }).first()
  resModel.setData(record)
}

export default updateSkill
