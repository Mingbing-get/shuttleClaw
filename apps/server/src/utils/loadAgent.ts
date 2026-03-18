import { resolve } from 'path'
import { ChatOpenAI } from '@langchain/openai'
import { ShuttleAi } from '@shuttle-ai/type'
import { AgentCluster } from '@shuttle-ai/agent'
import { SkillLoader } from '@shuttle-ai/skill'
import { createUseMemoryTools } from '@shuttle-ai/memory'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import 'dotenv/config'

import { decrypt } from './secret'
import db from '../config/db'
import {
  MODEL_TABLE_NAME,
  AGENT_TABLE_NAME,
  SKILL_TABLE_NAME,
  MCP_TABLE_NAME,
  AGENT_DIR,
  SKILL_DIR,
  MEMORY_DIR,
} from '../config/consts'
import { Table } from '../types'

export default function createLoadAgent(mainAgentId?: string) {
  async function loadAgent(
    name: string,
  ): Promise<ShuttleAi.Cluster.AgentStartReturn> {
    const agentName = name.split('_').slice(0, -1).join('_')

    const agentHandle = db<Table.Agent>(AGENT_TABLE_NAME)
    if (name === AgentCluster.MAIN_AGENT_NAME) {
      if (mainAgentId) {
        agentHandle.where('id', '=', mainAgentId)
      } else {
        agentHandle.where('parentId', '=', null)
      }
    } else {
      agentHandle.where('name', '=', agentName)
    }

    const agent = await agentHandle.first(
      'id',
      'modelId',
      'name',
      'enabled',
      'describe',
    )
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

    const subAgents = await db<Table.Agent>(AGENT_TABLE_NAME)
      .where('parentId', '=', agent.id)
      .andWhere('enabled', '=', true)
      .select('id', 'name', 'describe', 'isLazy')

    const skills = await db<Table.Skill>(SKILL_TABLE_NAME)
      .where('agentId', '=', agent.id)
      .andWhere('enabled', '=', true)
      .select('skillName', 'env')

    const mpcs = await db<Table.MCP>(MCP_TABLE_NAME)
      .where('agentId', '=', agent.id)
      .andWhere('enabled', '=', true)
      .select('config', 'env')

    let skillLoader: SkillLoader | undefined
    if (skills.length > 0) {
      skillLoader = new SkillLoader({
        dir: resolve(process.cwd(), AGENT_DIR, agent.name, SKILL_DIR),
        pickSkillNames: skills.map((skill) => skill.skillName),
        runInDocker: {
          sharedVolumeName:
            process.env.SHARED_VOLUME_NAME || 'shared_shuttle_claw_data',
          workDir: process.env.WORK_DIR || '/app',
        },
        async getEnv(skillName) {
          const skill = skills.find((s) => s.skillName === skillName)
          const factEnv: Record<string, string> = {}
          for (const key in skill?.env) {
            factEnv[key] = decrypt(skill.env[key])
          }
          return factEnv
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

    const memoryTools = createUseMemoryTools({
      dir: resolve(process.cwd(), AGENT_DIR, agent.name, MEMORY_DIR),
    })
    const indexMemoryFilePath = resolve(
      process.cwd(),
      AGENT_DIR,
      agent.name,
      MEMORY_DIR,
      'index.md',
    )
    const indexMemory = existsSync(indexMemoryFilePath)
      ? await readFile(indexMemoryFilePath, 'utf-8')
      : ''

    return {
      model,
      systemPrompt: [
        agent.describe || '',
        `**当前时间**: ${new Date().toLocaleString()}`,
        `你拥有长期的**记忆系统**，在需要回忆之前的对话内容或借鉴以前的经验时，可以使用${memoryTools.map((tool) => tool.name).join('、')}等方法
**已有记忆大纲**: ${indexMemory || '无'}`,
      ].join('\n'),
      mcps: mpcs.map((mcp) => {
        const factEnv: Record<string, string> = {}
        for (const key in mcp.env) {
          factEnv[key] = decrypt(mcp.env[key])
        }

        return {
          ...mcp.config,
          env: factEnv,
        } as any
      }),
      tools: memoryTools,
      subAgents: subAgents
        .filter((subAgent) => !subAgent.isLazy)
        .map((subAgent) => ({
          name: subAgent.name,
          description: subAgent.describe,
        })),
      lazyAgents: subAgents
        .filter((subAgent) => subAgent.isLazy)
        .map((subAgent) => ({
          name: subAgent.name,
          description: subAgent.describe,
        })),
      skillConfig: skillLoader
        ? {
            loader: skillLoader,
          }
        : undefined,
    }
  }

  return loadAgent
}
