import { useCallback, useEffect, useState } from 'react'

import useAgentTree from './useAgentTree'
import { WalkForest } from '../utils/walkForest'
import { AGENT_ID_KEY } from '../config/const'

export default function useEffectAgentId() {
  const [selectedAgentId, setSelectedAgentId] = useState(
    localStorage.getItem(AGENT_ID_KEY) || '',
  )
  const [agentTree, loading] = useAgentTree()

  useEffect(() => {
    if (loading) {
      return
    }

    setSelectedAgentId((agentId) => {
      const walkAgent = new WalkForest(agentTree, 'children', 'id')
      const hasOldAgent = walkAgent.some((agent) => agent.id === agentId)
      if (hasOldAgent) {
        return agentId
      }

      const newAgentId = agentTree[0]?.id || ''
      pickAgent(newAgentId, false)
      return newAgentId
    })
  }, [agentTree, loading])

  const pickAgent = useCallback(
    (agentId: string, triggerUpdate: boolean = true) => {
      if (triggerUpdate) {
        setSelectedAgentId(agentId)
      }
      localStorage.setItem(AGENT_ID_KEY, agentId)
    },
    [],
  )

  return {
    selectedAgentId,
    pickAgent,
  }
}
