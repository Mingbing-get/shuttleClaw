import Router from '@koa/router'

import { jwtVerify } from '../../middleware/jwt'
import installSkill from './install'
import updateSkill from './update'
import deleteSkill from './delete'
import querySkill from './query'
import querySkillById from './queryById'

const skillRouter = new Router()

skillRouter.use(jwtVerify)
skillRouter.post('/', installSkill)
skillRouter.get('/', querySkill)
skillRouter.get('/:id', querySkillById)
skillRouter.put('/:id', updateSkill)
skillRouter.del('/:id', deleteSkill)

export default skillRouter
