import Koa from 'koa'
import cors from '@koa/cors'
import koaBody from 'koa-body'
import mount from 'koa-mount'
import koaStatic from 'koa-static'
import { join } from 'path'
import { createReadStream } from 'fs'

import errorHandle from './middleware/errorHandle'
import aiRouter from './router/ai'
import authRouter from './router/auth'

import init from './init'

main()

async function main() {
  console.log('------初始化------')
  await init()
  console.log('------初始化完成------')

  // 创建Koa应用实例
  const app = new Koa()

  // 配置CORS中间件
  app.use(cors())

  // 配置koa-body中间件
  app.use(koaBody())

  // 配置错误处理中间件
  app.use(errorHandle)
  app.use(
    mount(
      '/public',
      koaStatic(join(process.cwd(), 'public'), {
        maxAge: 365 * 24 * 60 * 60 * 1000,
      }),
    ),
  )
  app.use(
    mount(
      '/assets',
      koaStatic(join(process.cwd(), 'public/assets'), {
        maxAge: 365 * 24 * 60 * 60 * 1000,
      }),
    ),
  )
  app.use(mount('/auth', authRouter.routes()))
  app.use(mount('/ai', aiRouter.routes()))

  // 返回public/index.html
  app.use(async (ctx) => {
    ctx.type = 'html'
    ctx.body = createReadStream(join(process.cwd(), 'public/index.html'))
  })

  // 启动服务器
  const PORT = process.env.PORT || 3100
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}
