import { Middleware } from '@koa/router'
import { sign, decode, JwtPayload } from 'jsonwebtoken'

import { ResponseModel } from '../utils/responseModel'

export function signJwt(data: any) {
  return sign(data, process.env.JWT_SECRET || '', { expiresIn: '24h' })
}

export const jwtVerify: Middleware = async (ctx, next) => {
  const xUser = ctx.request.headers['x-user'] as string
  const jwtPayload = decode(xUser)

  if (jwtPayload && !isExp(jwtPayload as JwtPayload)) {
    await next()
  } else {
    const resModel = new ResponseModel(
      ResponseModel.CODE.UNAUTHORIZED,
      'Unauthorized',
    )
    ctx.body = resModel.getResult()
  }
}

export function isExp(jwtPayload: JwtPayload) {
  if (!jwtPayload.exp) return false

  return jwtPayload.exp * 1000 <= new Date().getTime()
}
