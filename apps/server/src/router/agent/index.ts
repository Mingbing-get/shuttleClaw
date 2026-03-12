import Router from '@koa/router'

import { jwtVerify } from '../../middleware/jwt'
import createAgent from './create'
import updateAgent from './update'
import deleteAgent from './delete'
import queryAgent from './query'
import queryAgentById from './queryById'
import moveAgent from './move'
import queryRootAgents from './root'
import queryAllAgents from './all'

const agentRouter = new Router()

agentRouter.use(jwtVerify)
agentRouter.post('/', createAgent)
agentRouter.get('/', queryAgent)
agentRouter.get('/:id', queryAgentById)
agentRouter.put('/:id', updateAgent)
agentRouter.del('/:id', deleteAgent)
agentRouter.post('/:id/move', moveAgent)
agentRouter.get('/root', queryRootAgents)
agentRouter.get('/all', queryAllAgents)

export default agentRouter
