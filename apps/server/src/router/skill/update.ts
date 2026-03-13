import { Middleware } from '@koa/router'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types/table'
import db from '../../config/db'
import { SKILL_TABLE_NAME } from '../../config/consts'
import { encrypt } from '../../utils/secret'

const updateSkill: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const { id } = ctx.params
  const data = ctx.request.body as any as Pick<
    Table.Skill,
    'enabled' | 'env'
  > & {
    envKeys?: string[]
  }

  const oldRecord = await db<Table.Skill>(SKILL_TABLE_NAME)
    .where({ id })
    .first()

  if (!oldRecord) {
    resModel.setError(ResponseModel.CODE.NOT_FOUND, 'Skill not found')
    return
  }

  const newEnv =
    data.envKeys?.reduce((acc: Record<string, string>, key) => {
      const oldV = oldRecord.env?.[key]
      if (oldV) {
        acc[key] = oldV
      }

      return acc
    }, {}) ||
    oldRecord.env ||
    {}

  for (const key in data.env) {
    newEnv[key] = encrypt(data.env[key])
  }

  const updateData = {
    enabled: data.enabled,
    env: JSON.stringify(newEnv),
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
  const { env, ...extra } = record || {}
  resModel.setData({
    ...extra,
    envKeys: Object.keys(env || {}),
  })
}

export default updateSkill
