import { AgentWorkProvider, AgentWorkRender } from '@shuttle-ai/render-react'
import transporter from './config/transporter'

export default function Main() {
  return (
    <AgentWorkProvider transporter={transporter} context={{}}>
      <AgentWorkRender
        style={{
          boxSizing: 'border-box',
          height: '100vh',
          padding: '20px 60px',
        }}
      />
    </AgentWorkProvider>
  )
}
