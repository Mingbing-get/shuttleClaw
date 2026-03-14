import { AgentWorkProvider, AgentWorkRender } from '@shuttle-ai/render-react'

import transporter from '../../config/transporter'
import AgentPicker from '../agentPicker'
import { useEffectAgentId } from '../../hooks'
import Revoke from './revoke'

import '@shuttle-ai/render-react/style.css'
import './index.scss'

export default function Chat() {
  const { selectedAgentId, pickAgent } = useEffectAgentId()

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
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
              onSelect={(v) => pickAgent(v)}
            />
          }
        />
        <Revoke />
      </AgentWorkProvider>
    </div>
  )
}
