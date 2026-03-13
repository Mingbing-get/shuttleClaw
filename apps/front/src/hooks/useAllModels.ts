import { useEffect, useState } from 'react'
import { message } from 'antd'

import RefreshCache from '../utils/refreshCache'
import { modelApi, Table } from '../apis'

const allModelCache = new RefreshCache(async () => {
  const res = await modelApi.query({ page: -1 })
  if (res.code !== 200) {
    message.error(res.message || '查询模型失败')
    return []
  }
  return res.data?.list || []
}, 1000 * 30)

export default function useAllModels(): [
  Omit<Table.Model, 'apiKey'>[],
  boolean,
] {
  const [modelList, setModelList] = useState<Omit<Table.Model, 'apiKey'>[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    allModelCache.use(async (cache) => {
      setLoading(true)
      try {
        const models = await cache
        setModelList(models)
      } finally {
        setLoading(false)
      }
    })
  }, [])

  return [modelList, loading]
}
