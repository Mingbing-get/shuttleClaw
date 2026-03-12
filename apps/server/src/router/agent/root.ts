import { Middleware } from '@koa/router'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types/table'
import db from '../../config/db'
import { AGENT_TABLE_NAME } from '../../config/consts'

const queryRootAgents: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const records = await db<Table.Agent>(AGENT_TABLE_NAME)
    .where('parentId', '=', null)
    .select()

  resModel.setData(records)
}

export default queryRootAgents
