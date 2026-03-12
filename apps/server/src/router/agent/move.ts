import { Middleware } from '@koa/router'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types/table'
import db from '../../config/db'
import { AGENT_TABLE_NAME } from '../../config/consts'

const moveAgent: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const { id } = ctx.params
  if (!id) {
    resModel.setError(
      ResponseModel.CODE.CHECK_PARAMS_ERROR,
      'Agent id is required',
    )
    return
  }

  const { parentId } = ctx.request.body as { parentId?: string }

  if (parentId === id) {
    resModel.setError(
      ResponseModel.CODE.CHECK_PARAMS_ERROR,
      'Agent cannot be its own parent',
    )
    return
  }

  const agentRecord = await db<Table.Agent>(AGENT_TABLE_NAME)
    .where({ id })
    .first()
  if (!agentRecord) {
    resModel.setError(ResponseModel.CODE.NOT_FOUND, 'Agent not found')
    return
  }

  if (parentId !== undefined && parentId !== null) {
    const parentRecord = await db<Table.Agent>(AGENT_TABLE_NAME)
      .where({ id: parentId })
      .first()
    if (!parentRecord) {
      resModel.setError(ResponseModel.CODE.NOT_FOUND, 'Parent agent not found')
      return
    }

    let currentParentId = parentId
    const visitedIds = new Set<string>()
    visitedIds.add(id)

    while (currentParentId) {
      if (visitedIds.has(currentParentId)) {
        resModel.setError(
          ResponseModel.CODE.CHECK_PARAMS_ERROR,
          'Cannot move agent to its own descendant',
        )
        return
      }
      visitedIds.add(currentParentId)

      const currentParent = await db<Table.Agent>(AGENT_TABLE_NAME)
        .where({ id: currentParentId })
        .first()
      if (!currentParent?.parentId) {
        break
      }
      currentParentId = currentParent.parentId
    }
  }

  const updateData: Partial<Table.Agent> = {
    parentId: parentId || (null as any),
    updatedAt: new Date() as any,
  }

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

export default moveAgent
