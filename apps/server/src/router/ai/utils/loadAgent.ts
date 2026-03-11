import { resolve } from 'path'
import { ChatOpenAI } from '@langchain/openai'
import { ShuttleAi } from '@shuttle-ai/type'
import { AgentCluster } from '@shuttle-ai/agent'
import { SkillLoader } from '@shuttle-ai/skill'

import { decrypt } from '../../../utils/secret'
import db from '../../../db'
import {
  MODEL_TABLE_NAME,
  AGENT_TABLE_NAME,
  SKILL_TABLE_NAME,
  MCP_TABLE_NAME,
  AGENT_DIR,
  SKILL_DIR,
} from '../../../consts'
import { Table } from '../../../types'

export default async function loadAgent(
  name: string,
): Promise<ShuttleAi.Cluster.AgentStartReturn> {
  const agentName = name.split('_').slice(0, -1).join('_')

  const agentHandle = db<Table.Agent>(AGENT_TABLE_NAME)
  if (name === AgentCluster.MAIN_AGENT_NAME) {
    agentHandle.where('isMain', '=', true)
  } else {
    agentHandle.where('name', '=', agentName)
  }

  const agent = await agentHandle.first('id', 'modelId', 'enabled')
  if (!agent) {
    throw new Error(`Agent ${name} not found`)
  }

  if (!agent.enabled) {
    throw new Error(`Agent ${name} is disabled`)
  }

  const agentModel = await db<Table.Model>(MODEL_TABLE_NAME)
    .where('id', '=', agent.modelId)
    .first('apiKey', 'model', 'url')

  if (!agentModel) {
    throw new Error(`Agent ${name} model not found`)
  }

  const skills = await db<Table.Skill>(SKILL_TABLE_NAME)
    .where('agentId', '=', agent.id)
    .andWhere('enabled', '=', true)
    .select('skillName', 'env')

  const mpcs = await db<Table.MCP>(MCP_TABLE_NAME)
    .where('agentId', '=', agent.id)
    .andWhere('enabled', '=', true)
    .select('config')

  let skillLoader: SkillLoader | undefined
  if (skills.length > 0) {
    skillLoader = new SkillLoader({
      dir: resolve(process.cwd(), AGENT_DIR, agentName, SKILL_DIR),
      pickSkillNames: skills.map((skill) => skill.skillName),
      async getEnv(skillName) {
        const skill = skills.find((s) => s.skillName === skillName)
        return skill?.env || {}
      },
    })
  }

  const model = new ChatOpenAI({
    modelName: agentModel.model,
    apiKey: decrypt(agentModel.apiKey),
    configuration: {
      baseURL: agentModel.url,
    },
    streaming: true,
  })

  return {
    model,
    mcps: mpcs.map((mcp) => mcp.config as ShuttleAi.MCP.ServerConfig),
    skillConfig: skillLoader
      ? {
          loader: skillLoader,
        }
      : undefined,
  }
}
