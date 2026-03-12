import { Middleware } from '@koa/router'
import { SkillHub, NSkillHub, SkillLoader } from '@shuttle-ai/skill'
import { resolve } from 'path'

import { ResponseModel } from '../../utils/responseModel'
import { Table } from '../../types/table'
import snowFlake from '../../config/snowFlake'
import db from '../../config/db'
import {
  SKILL_TABLE_NAME,
  AGENT_TABLE_NAME,
  AGENT_DIR,
  SKILL_DIR,
} from '../../config/consts'

type InstallSource = {
  type: 'github'
  url: string
}

const installSkill: Middleware = async (ctx) => {
  const resModel = new ResponseModel()
  ctx.body = resModel.getResult()

  const data = ctx.request.body as any as Pick<
    Table.Skill,
    'agentId' | 'enabled'
  > & {
    installSource: InstallSource
  }

  const agent = await db<Table.Agent>(AGENT_TABLE_NAME)
    .where({ id: data.agentId })
    .first()

  if (!agent) {
    resModel.setError(ResponseModel.CODE.NOT_FOUND, 'Agent not found')
    return
  }

  const installSource = parseInstallSource(data.installSource)
  const skillHub = new SkillHub()
  const skillNames = await skillHub.install(installSource, {
    targetDir: resolve(process.cwd(), AGENT_DIR, agent.name, SKILL_DIR),
    force: true,
  })

  if (skillNames.length === 0) {
    resModel.setError(ResponseModel.CODE.CHECK_PARAMS_ERROR, 'Skill not found')
    return
  }

  const skillLoader = new SkillLoader({
    dir: resolve(process.cwd(), AGENT_DIR, agent.name, SKILL_DIR),
    pickSkillNames: skillNames,
  })
  await skillLoader.loadAll()

  const records = skillNames.reduce((total: Table.Skill[], skillName) => {
    const skill = skillLoader.getSkillByName(skillName)

    if (skill) {
      total.push({
        id: snowFlake.next(),
        agentId: data.agentId,
        skillName,
        describe: skill.metadata?.description || '',
        envDefine: skill.metadata?.env,
        enabled: data.enabled,
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
      })
    }

    return total
  }, [])

  await db<Table.Skill>(SKILL_TABLE_NAME).insert(
    records.map((record) => ({
      ...record,
      envDefine: JSON.stringify(record.envDefine),
    })) as any,
  )

  resModel.setData(records)
}

function parseInstallSource(
  installSource: InstallSource,
): NSkillHub.SkillSource {
  if (installSource.type === 'github') {
    return SkillHub.parseGitHubUrl(installSource.url)
  }

  throw new Error(`Unsupported install source type: ${installSource.type}`)
}

export default installSkill
