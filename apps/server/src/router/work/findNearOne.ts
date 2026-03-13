import { Middleware } from '@koa/router'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types'
import db from '../../config/db'
import { WORK_TABLE_NAME } from '../../config/consts'

const findNearOneWork: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const record = await db<Table.Work>(WORK_TABLE_NAME)
    .orderBy('createdAt', 'desc')
    .first()

  resModel.setData(record)
}

export default findNearOneWork
