import { ShuttleAi } from '@shuttle-ai/type'
import { OrganizeMemory } from '@shuttle-ai/memory'
import { ChatOpenAI } from '@langchain/openai'
import { resolve } from 'path'

import { decrypt } from './secret'
import db from '../config/db'
import {
  MODEL_TABLE_NAME,
  AGENT_TABLE_NAME,
  AGENT_DIR,
  MEMORY_DIR,
} from '../config/consts'
import { Table } from '../types'

export default async function saveMemory(
  messages: ShuttleAi.Message.Define[],
  agentId?: string,
) {
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

  await organizeMemory.start(messages)
}
