import { useState } from 'react'
import { Flex, Spin } from 'antd'
import { AgentWorkRenderMultiple } from '@shuttle-ai/render-react'
import { ShuttleAi } from '@shuttle-ai/type'

import transporter from '../../config/transporter'
import AgentPicker from '../agentPicker'
import {
  useEffectAgentId,
  useByOneWork,
  useLocalstorageState,
} from '../../hooks'
import DrawerWorkList from './drawerWorkList'
import initAgent from './initAgent'

import '@shuttle-ai/render-react/style.css'
import './index.scss'

export default function Chat() {
  const [status, setStatus] = useState<ShuttleAi.Client.Work.Status>('idle')
  const { selectedAgentId, pickAgent } = useEffectAgentId()
  const [autoRunScope, setAutoRunScope] =
    useLocalstorageState<ShuttleAi.Client.Work.AutoRunScope>(
      'autoRunScope',
      'none',
    )
  const { works, nextWork, loading, hasMore, forceToWork, setWorks } =
    useByOneWork({ transporter }, selectedAgentId)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <AgentWorkRenderMultiple
        transporter={transporter}
        context={{}}
        works={works}
        initAgent={initAgent}
        disabled={!selectedAgentId}
        style={{
          boxSizing: 'border-box',
          height: '100%',
        }}
        extraActions={
          <AgentPicker
            disabled={status !== 'idle'}
            style={{ minWidth: 180 }}
            value={selectedAgentId}
            onSelect={(v) => pickAgent(v)}
          />
        }
        onTouchTop={() => nextWork(selectedAgentId)}
        topLoading={
          <Flex justify="center" style={{ paddingBottom: 8 }}>
            {loading && <Spin spinning />}
            {!hasMore && <div>没有更多了</div>}
          </Flex>
        }
        autoRunScope={autoRunScope}
        onWorksChange={setWorks}
        onStatusChange={setStatus}
        onAutoRunScopeChange={setAutoRunScope}
      />
      <DrawerWorkList agentId={selectedAgentId} onClick={forceToWork} />
    </div>
  )
}
