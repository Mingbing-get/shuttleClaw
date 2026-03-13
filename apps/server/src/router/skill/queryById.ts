import { Middleware } from '@koa/router'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types/table'
import db from '../../config/db'
import { SKILL_TABLE_NAME } from '../../config/consts'

const querySkillById: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const { id } = ctx.params

  const record = await db<Table.Skill>(SKILL_TABLE_NAME).where({ id }).first()

  if (!record) {
    resModel.setError(ResponseModel.CODE.NOT_FOUND, 'Skill not found')
    return
  }

  const { env = {}, ...extra } = record

  resModel.setData({
    ...extra,
    envKeys: Object.keys(env || {}),
  })
}

export default querySkillById
