import Router from '@koa/router'

import { jwtVerify } from '../../middleware/jwt'
import invoke from './invoke'
import report from './report'
import revokeMessage from './revokeMessage'

const aiRouter = new Router()

aiRouter.use(jwtVerify)
aiRouter.post('/invoke', invoke)
aiRouter.post('/report', report)
aiRouter.post('/revokeMessage', revokeMessage)

export default aiRouter
