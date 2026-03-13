import Router from '@koa/router'

import { jwtVerify } from '../../middleware/jwt'
import queryWork from './query'
import findNearOneWork from './findNearOne'

const workRouter = new Router()
workRouter.use(jwtVerify)
workRouter.get('/', queryWork)
workRouter.get('/nearOne', findNearOneWork)

export default workRouter
