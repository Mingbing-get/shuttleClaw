import { useEffect, useState } from 'react'

import { Table, workApi } from '../apis'

export default function useNearWork() {
  const [nearWork, setNearWork] = useState<Table.Work>()

  const fetchNearWork = async () => {
    const res = await workApi.nearest()
    setNearWork(res.data)
  }

  useEffect(() => {
    fetchNearWork()
  }, [])

  return nearWork
}
