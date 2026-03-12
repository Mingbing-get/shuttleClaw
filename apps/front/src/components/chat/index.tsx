import { AgentWorkProvider, AgentWorkRender } from '@shuttle-ai/render-react'

import transporter from '../../config/transporter'

import '@shuttle-ai/render-react/style.css'

export default function Chat() {
  return (
    <AgentWorkProvider transporter={transporter} context={{}}>
      <AgentWorkRender
        style={{
          boxSizing: 'border-box',
          height: '100%',
        }}
      />
    </AgentWorkProvider>
  )
}
