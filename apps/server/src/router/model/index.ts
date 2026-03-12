import Router from '@koa/router'

import { jwtVerify } from '../../middleware/jwt'
import createModel from './create'
import updateModel from './update'
import deleteModel from './delete'
import queryModel from './query'
import queryModelById from './queryById'

const modelRouter = new Router()

modelRouter.use(jwtVerify)
modelRouter.post('/', createModel)
modelRouter.get('/', queryModel)
modelRouter.get('/:id', queryModelById)
modelRouter.put('/:id', updateModel)
modelRouter.del('/:id', deleteModel)

export default modelRouter
