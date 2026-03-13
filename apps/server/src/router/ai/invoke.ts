import 'dotenv/config'
import { Middleware } from '@koa/router'
import { ShuttleAi } from '@shuttle-ai/type'
import { AgentCluster, readableHook } from '@shuttle-ai/agent'

import resolverManager from './utils/resolverManager'
import MessageCollector from './utils/messageCollector'
import createLoadAgent from './utils/loadAgent'
import db from '../../config/db'
import { WORK_TABLE_NAME } from '../../config/consts'
import { Table } from '../../types'

const invoke: Middleware = async (ctx) => {
  const { workId, prompt, mainAgentId, autoRunScope } = ctx.request.body as {
    workId: string
    prompt: string
    mainAgentId?: string
    autoRunScope?: ShuttleAi.Cluster.AutoRunScope
  }

  // 设置响应头为Server-Sent Events格式
  ctx.type = 'application/octet-stream'
  ctx.set('Cache-Control', 'no-cache')
  ctx.set('Connection', 'keep-alive')
  ctx.status = 200

  const { stream, hooks, send, close, resolveConfirmTool, resolveAgentStart } =
    readableHook(createLoadAgent(mainAgentId))

  const agentCluster = new AgentCluster({
    id: workId,
    hooks: hooks,
    autoRunScope,
    messageCollector: new MessageCollector(),
  })

  await db<Table.Work>(WORK_TABLE_NAME).insert({
    id: agentCluster.id,
    mainAgentId,
    prompt,
    autoRunScope,
    trigger: 'user',
    status: 'running',
    createdAt: new Date() as any,
  })

  resolverManager.addAgentResolver(agentCluster.id, {
    resolveConfirmTool,
    resolveAgentStart,
  })

  async function closeAll() {
    send({ type: 'endWork', data: { workId: agentCluster.id } })
    close()
    agentCluster.stop()
    resolverManager.removeAgentResolver(agentCluster.id)
    await db<Table.Work>(WORK_TABLE_NAME)
      .where({ id: agentCluster.id })
      .update({
        status: 'completed',
        endedAt: new Date() as any,
      })
  }

  // ctx.req.on('close', closeAll)

  // 由于是流式响应，不返回常规的响应体
  ctx.body = stream

  send({ type: 'startWork', data: { workId: agentCluster.id } })
  agentCluster.invoke(prompt).then(closeAll)
}

export default invoke
