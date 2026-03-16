import { message } from 'antd'
import { useCallback, useEffect, useRef, useState } from 'react'

import { AgentWork } from '@shuttle-ai/client'
import { ShuttleAi } from '@shuttle-ai/type'

import { workApi, Table } from '../apis'

export default function useByOneWork(
  options: ShuttleAi.Client.Work.Options,
  agentId?: string,
) {
  const [works, setWorks] = useState<AgentWork[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const lastIdRef = useRef<string | undefined>()
  const hasMoreRef = useRef<boolean>(hasMore)
  const exitWorkIdsRef = useRef<string[]>([])

  useEffect(() => {
    hasMoreRef.current = hasMore
  }, [hasMore])

  const nextWork = useCallback(async (agentId?: string) => {
    if (!hasMoreRef.current || !agentId) {
      return
    }

    setLoading(true)
    const res = await workApi.nearest({
      mainAgentId: agentId,
      lastId: lastIdRef.current,
    })

    if (res.code !== 200) {
      message.error(res.message || '获取历史记录失败')
      setLoading(false)
      return
    }

    if (!res.data) {
      setHasMore(false)
      setLoading(false)
      return
    }

    if (exitWorkIdsRef.current.includes(res.data.id)) {
      setLoading(false)
      return
    }

    const newWork = new AgentWork(options)
    setWorks((old) => [newWork, ...old])
    lastIdRef.current = res.data.id
    exitWorkIdsRef.current.push(res.data.id)

    try {
      await newWork.revoke(res.data.id)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setWorks([])
    exitWorkIdsRef.current = []
    setHasMore(true)
    lastIdRef.current = undefined
    nextWork(agentId)
  }, [agentId])

  const forceToWork = useCallback(async (work: Table.Work) => {
    const newWork = new AgentWork(options)
    setWorks([newWork])
    exitWorkIdsRef.current = [work.id]
    setHasMore(true)
    lastIdRef.current = work.id

    setLoading(true)
    try {
      await newWork.revoke(work.id)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    works,
    nextWork,
    loading,
    hasMore,
    forceToWork,
    setWorks,
  }
}
