import Router from '@koa/router'
import { jwtVerify } from '../../middleware/jwt'
import getTodayStats from './todayStats'
import getMonthlyStats from './monthlyStats'

const dashboardRouter = new Router()
dashboardRouter.use(jwtVerify)
dashboardRouter.get('/todayStats', getTodayStats)
dashboardRouter.get('/monthlyStats', getMonthlyStats)

export default dashboardRouter
