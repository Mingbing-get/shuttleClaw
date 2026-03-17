import { ShuttleAi } from '@shuttle-ai/type'
import { OrganizeMemory } from '@shuttle-ai/memory'
import { ChatOpenAI } from '@langchain/openai'
import { resolve } from 'path'
// import '@shuttle-ai/agent/dist/types/type'

import { decrypt } from './secret'
import db from '../config/db'
import {
  WORK_TABLE_NAME,
  MODEL_TABLE_NAME,
  AGENT_TABLE_NAME,
  AGENT_DIR,
  MEMORY_DIR,
} from '../config/consts'
import { Table } from '../types'

interface Options {
  workId: string
  messages: ShuttleAi.Message.Define[]
  beforeTokenUseage: ShuttleAi.Cluster.TokenUsage
  agentId?: string
}

export default async function saveMemory({
  workId,
  messages,
  beforeTokenUseage,
  agentId,
}: Options) {
  const agentHandle = db<Table.Agent>(AGENT_TABLE_NAME)

  if (agentId) {
    agentHandle.where('id', '=', agentId)
  } else {
    agentHandle.where('parentId', '=', null)
  }

  const agent = await agentHandle.first('id', 'modelId', 'enabled', 'name')
  if (!agent?.enabled) return

  const agentModel = await db<Table.Model>(MODEL_TABLE_NAME)
    .where('id', '=', agent.modelId)
    .first('apiKey', 'model', 'url')
  if (!agentModel) return

  const model = new ChatOpenAI({
    modelName: agentModel.model,
    apiKey: decrypt(agentModel.apiKey),
    configuration: {
      baseURL: agentModel.url,
    },
  })

  const organizeMemory = new OrganizeMemory({
    model,
    dir: resolve(process.cwd(), AGENT_DIR, agent.name, MEMORY_DIR),
  })

  const tokenUseage = await organizeMemory.start(messages)
  if (!tokenUseage) return

  await db<Table.Work>(WORK_TABLE_NAME)
    .where('id', '=', workId)
    .update({
      inputTokens: tokenUseage.promptTokens + beforeTokenUseage.promptTokens,
      outputTokens:
        tokenUseage.completionTokens + beforeTokenUseage.completionTokens,
    })
}
