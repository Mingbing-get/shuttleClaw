import { useCallback, useState } from 'react'
import { Drawer } from 'antd'
import { DoubleRightOutlined } from '@ant-design/icons'

import { Table } from '../../apis/types'
import WorkList from './workList'

interface Props {
  agentId?: string
  onClick?: (work: Table.Work) => void
}

export default function DrawerWorkList({ agentId, onClick }: Props) {
  const [visible, setVisible] = useState(false)

  const handleClickWork = useCallback(
    (work: Table.Work) => {
      setVisible(false)
      onClick?.(work)
    },
    [onClick],
  )

  return (
    <>
      {!visible && (
        <div className="toggle-work-panel-wrapper">
          <span
            className="toggle-work-panel-button"
            onClick={() => setVisible(true)}
          >
            <DoubleRightOutlined />
          </span>
        </div>
      )}
      <Drawer
        placement="left"
        open={visible}
        onClose={() => setVisible(false)}
        title="历史对话"
        style={{ width: '40vw', minWidth: 350 }}
      >
        <WorkList agentId={agentId} onClick={(work) => handleClickWork(work)} />
      </Drawer>
    </>
  )
}
