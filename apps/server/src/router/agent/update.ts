import { Middleware } from '@koa/router'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types/table'
import db from '../../config/db'
import { AGENT_TABLE_NAME } from '../../config/consts'

const updateAgent: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const { id } = ctx.params
  const data = ctx.request.body as any as Table.UpdateRecord<
    Omit<Table.Agent, 'name' | 'parentId'>
  >

  const canUpdate: (keyof Table.UpdateRecord<
    Omit<Table.Agent, 'name' | 'parentId'>
  >)[] = ['describe', 'enabled', 'isLazy', 'modelId']

  const updateData: Partial<Table.Agent> = {
    updatedAt: new Date() as any,
  }
  canUpdate.forEach((key) => {
    if (data[key] !== undefined) {
      updateData[key] = data[key] as any
    }
  })

  const result = await db<Table.Agent>(AGENT_TABLE_NAME)
    .where({ id })
    .update(updateData)

  if (result === 0) {
    resModel.setError(ResponseModel.CODE.NOT_FOUND, 'Agent not found')
    return
  }

  const record = await db<Table.Agent>(AGENT_TABLE_NAME).where({ id }).first()
  resModel.setData(record)
}

export default updateAgent
