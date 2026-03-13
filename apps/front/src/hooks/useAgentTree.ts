import { useEffect, useState } from 'react'
import { message } from 'antd'

import RefreshCache from '../utils/refreshCache'
import { agentApi, Table } from '../apis'

export interface AgentTree extends Table.Agent {
  children?: AgentTree[]
  value: string
  key: string
  title: string
}

const allAgentCache = new RefreshCache(async () => {
  const res = await agentApi.queryAll()
  if (res.code !== 200) {
    message.error(res.message || '查询智能体失败')
    return []
  }
  return res.data || []
}, 1000 * 30)

export default function useAgentTree(): [AgentTree[], boolean, () => void] {
  const [agentTree, setAgentTree] = useState<AgentTree[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    allAgentCache.use(async (cache) => {
      setLoading(true)
      try {
        const agents = await cache
        setAgentTree(agentListToTree(agents))
      } finally {
        setLoading(false)
      }
    })
  }, [])

  return [agentTree, loading, () => allAgentCache.refresh()]
}

function agentListToTree(agents: Table.Agent[]) {
  const tree: AgentTree[] = []
  const map: Record<string, AgentTree> = {}

  agents.forEach((agent) => {
    map[agent.id] = {
      ...agent,
      key: agent.id,
      value: agent.id,
      title: agent.name,
      children: [],
    }
  })

  agents.forEach((agent) => {
    if (agent.parentId) {
      map[agent.parentId].children?.push(map[agent.id])
    } else {
      tree.push(map[agent.id])
    }
  })

  return tree
}
