import { AgentWorkProvider, AgentWorkRender } from '@shuttle-ai/render-react'
import { useCallback, useEffect, useState } from 'react'

import transporter from '../../config/transporter'
import AgentPicker from '../agentPicker'
import { useAgentTree } from '../../hooks'
import { WalkForest } from '../../utils/walkForest'
import { AGENT_ID_KEY } from '../../config/const'

import '@shuttle-ai/render-react/style.css'

export default function Chat() {
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
      handlePickAgent(newAgentId, false)
      return newAgentId
    })
  }, [agentTree, loading])

  const handlePickAgent = useCallback(
    (agentId: string, triggerUpdate: boolean = true) => {
      if (triggerUpdate) {
        setSelectedAgentId(agentId)
      }
      localStorage.setItem(AGENT_ID_KEY, agentId)
    },
    [],
  )

  return (
    <AgentWorkProvider transporter={transporter} context={{}}>
      <AgentWorkRender
        disabled={!selectedAgentId}
        style={{
          boxSizing: 'border-box',
          height: '100%',
        }}
        extraActions={
          <AgentPicker
            style={{ minWidth: 180 }}
            value={selectedAgentId}
            onSelect={(v) => handlePickAgent(v)}
          />
        }
      />
    </AgentWorkProvider>
  )
}
