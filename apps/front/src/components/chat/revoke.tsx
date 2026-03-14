import {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { useWork } from '@shuttle-ai/render-react'
import { Drawer } from 'antd'
import { DoubleRightOutlined } from '@ant-design/icons'

import { useNearWork } from '../../hooks'
import WorkList from './workList'

export interface RevokeInstance {
  revoke: (id: string) => Promise<void>
}

function Revoke(props: {}, ref: Ref<RevokeInstance | null>) {
  const [visible, setVisible] = useState(false)
  const nearWork = useNearWork()
  const work = useWork()

  const handleRevoke = useCallback(async (id: string) => {
    if (work.id === id) return

    return work.revoke(id)
  }, [])

  useImperativeHandle(ref, () => ({
    revoke: handleRevoke,
  }))

  useEffect(() => {
    if (!nearWork) {
      return
    }

    work.revoke(nearWork.id)
  }, [nearWork])

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
        <WorkList onClick={(_work) => handleRevoke(_work.id)} />
      </Drawer>
    </>
  )
}

export default forwardRef(Revoke)
