import 'dotenv/config'
import { Middleware } from '@koa/router'
import { ShuttleAi } from '@shuttle-ai/type'
import { AgentCluster, readableHook } from '@shuttle-ai/agent'

import resolverManager from './utils/resolverManager'
import MessageCollector from './utils/messageCollector'
import loadAgent from './utils/loadAgent'

const invoke: Middleware = async (ctx) => {
  const { workId, prompt, autoRunScope } = ctx.request.body as {
    workId: string
    prompt: string
    autoRunScope?: ShuttleAi.Cluster.AutoRunScope
  }

  // 设置响应头为Server-Sent Events格式
  ctx.type = 'application/octet-stream'
  ctx.set('Cache-Control', 'no-cache')
  ctx.set('Connection', 'keep-alive')
  ctx.status = 200

  const { stream, hooks, send, close, resolveConfirmTool, resolveAgentStart } =
    readableHook(loadAgent)

  const agentCluster = new AgentCluster({
    id: workId,
    hooks: hooks,
    autoRunScope,
    messageCollector: new MessageCollector(),
  })

  resolverManager.addAgentResolver(agentCluster.id, {
    resolveConfirmTool,
    resolveAgentStart,
  })

  function closeAll() {
    send({ type: 'endWork', data: { workId: agentCluster.id } })
    close()
    agentCluster.stop()
    resolverManager.removeAgentResolver(agentCluster.id)
  }

  ctx.req.on('close', closeAll)

  // 由于是流式响应，不返回常规的响应体
  ctx.body = stream

  send({ type: 'startWork', data: { workId: agentCluster.id } })
  agentCluster.invoke(prompt).then(closeAll)
}

export default invoke
