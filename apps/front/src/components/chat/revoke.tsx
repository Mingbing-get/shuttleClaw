import { forwardRef, Ref, useEffect, useImperativeHandle } from 'react'
import { useWork } from '@shuttle-ai/render-react'

import { useNearWork } from '../../hooks'

export interface RevokeInstance {
  revoke: (id: string) => Promise<void>
}

function Revoke(props: {}, ref: Ref<RevokeInstance | null>) {
  const nearWork = useNearWork()
  const work = useWork()

  useImperativeHandle(ref, () => ({
    revoke: (id: string) => work.revoke(id),
  }))

  useEffect(() => {
    if (!nearWork) {
      return
    }

    work.revoke(nearWork.id)
  }, [nearWork])

  return null
}

export default forwardRef(Revoke)
