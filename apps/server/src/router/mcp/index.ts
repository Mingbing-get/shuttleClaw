import Router from '@koa/router'

import { jwtVerify } from '../../middleware/jwt'
import createMcp from './create'
import updateMcp from './update'
import deleteMcp from './delete'
import queryMcp from './query'
import queryMcpById from './queryById'

const mcpRouter = new Router()

mcpRouter.use(jwtVerify)
mcpRouter.post('/', createMcp)
mcpRouter.get('/', queryMcp)
mcpRouter.get('/:id', queryMcpById)
mcpRouter.put('/:id', updateMcp)
mcpRouter.del('/:id', deleteMcp)

export default mcpRouter
