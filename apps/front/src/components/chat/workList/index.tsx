import { useCallback, useEffect, useRef, useState } from 'react'
import { Card, Empty, Select, Spin, Tag } from 'antd'
import { Table, workApi } from '../../../apis'
import type { QueryWorkParams } from '../../../apis/types'

interface Props {
  onClick?: (work: Table.Work) => void
}

const PAGE_SIZE = 20

export default function WorkList({ onClick }: Props) {
  const [works, setWorks] = useState<Table.Work[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<Partial<QueryWorkParams>>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const fetchWorks = useCallback(
    async (
      pageNum: number,
      currentFilters: Partial<QueryWorkParams> = filters,
    ) => {
      if (loading) return

      try {
        setLoading(true)
        const params: any = {
          page: pageNum,
          pageSize: PAGE_SIZE,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        }

        if (currentFilters.trigger !== undefined) {
          params.trigger = currentFilters.trigger
        }
        if (currentFilters.status !== undefined) {
          params.status = currentFilters.status
        }
        if (currentFilters.autoRunScope !== undefined) {
          params.autoRunScope = currentFilters.autoRunScope
        }
        if (currentFilters.mainAgentId !== undefined) {
          params.mainAgentId = currentFilters.mainAgentId
        }

        const response = await workApi.query(params)

        const newWorks = response.data?.list || []
        const pagination = response.data?.pagination

        if (pageNum === 1) {
          setWorks(newWorks)
        } else {
          setWorks((prev: Table.Work[]) => [...prev, ...newWorks])
        }

        setHasMore(
          pagination
            ? pagination.page < pagination.totalPages
            : newWorks.length >= PAGE_SIZE,
        )
        setPage(pageNum)
      } catch (error) {
        console.error('Failed to fetch works:', error)
      } finally {
        setLoading(false)
      }
    },
    [loading, filters],
  )

  useEffect(() => {
    setPage(1)
    setHasMore(true)
    fetchWorks(1, filters)
  }, [filters])

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
      if (
        scrollHeight - scrollTop <= clientHeight + 100 &&
        hasMore &&
        !loading
      ) {
        fetchWorks(page + 1)
      }
    },
    [hasMore, loading, page, fetchWorks],
  )

  const handleFilterChange = useCallback(
    (key: keyof QueryWorkParams, value: any) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value === undefined ? undefined : value,
      }))
    },
    [],
  )

  const getTriggerTagColor = (trigger?: string) => {
    switch (trigger) {
      case 'user':
        return 'blue'
      case 'agent':
        return 'green'
      case 'scheduled':
        return 'orange'
      default:
        return 'default'
    }
  }

  const getStatusTagColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'processing'
      case 'completed':
        return 'success'
      case 'failed':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running':
        return '运行中'
      case 'completed':
        return '已完成'
      case 'failed':
        return '失败'
      default:
        return status
    }
  }

  const getTriggerText = (trigger?: string) => {
    switch (trigger) {
      case 'user':
        return '用户触发'
      case 'agent':
        return '智能体触发'
      case 'scheduled':
        return '定时任务'
      default:
        return trigger || '未知'
    }
  }

  const getAutoRunScopeText = (scope?: string) => {
    switch (scope) {
      case 'always':
        return '自动所有'
      case 'read':
        return '自动只读'
      case 'none':
        return '手动运行'
      default:
        return scope || '未设置'
    }
  }

  return (
    <div
      className="work-list"
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Select
            placeholder="触发方式"
            allowClear
            style={{ width: 120 }}
            value={filters.trigger}
            onChange={(value) => handleFilterChange('trigger', value)}
            options={[
              { label: '用户触发', value: 'user' },
              { label: '智能体触发', value: 'agent' },
              { label: '定时任务', value: 'scheduled' },
            ]}
          />
          <Select
            placeholder="状态"
            allowClear
            style={{ width: 120 }}
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
            options={[
              { label: '运行中', value: 'running' },
              { label: '已完成', value: 'completed' },
              { label: '失败', value: 'failed' },
            ]}
          />
          <Select
            placeholder="自动运行范围"
            allowClear
            style={{ width: 140 }}
            value={filters.autoRunScope}
            onChange={(value) => handleFilterChange('autoRunScope', value)}
            options={[
              { label: '自动所有', value: 'always' },
              { label: '自动只读', value: 'read' },
              { label: '手动运行', value: 'none' },
            ]}
          />
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
        }}
      >
        {works.length === 0 && !loading ? (
          <Empty description="暂无任务记录" />
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {works.map((work) => (
              <Card
                key={work.id}
                hoverable
                size="small"
                onClick={() => onClick?.(work)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {work.prompt}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {new Date(work.createdAt).toLocaleString('zh-CN')}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Tag color={getTriggerTagColor(work.trigger)}>
                    {getTriggerText(work.trigger)}
                  </Tag>
                  <Tag color={getStatusTagColor(work.status)}>
                    {getStatusText(work.status)}
                  </Tag>
                  {work.autoRunScope && (
                    <Tag>{getAutoRunScopeText(work.autoRunScope)}</Tag>
                  )}
                </div>
              </Card>
            ))}
            {loading && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin />
              </div>
            )}
            {!hasMore && works.length > 0 && (
              <div
                style={{ textAlign: 'center', color: '#999', padding: '10px' }}
              >
                已加载全部数据
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
