import { useCallback, useEffect, useState } from 'react'
import { Button, Modal, message, Row, Col, Spin, Empty } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { mcpApi } from '../../../apis'
import type { Table } from '../../../apis/types'
import McpCard from './Card'
import McpForm from './Form'

interface McpManagerModalProps {
  open: boolean
  agentId: string
  agentName: string
  onCancel?: () => void
}

export default function McpManagerModal({
  open,
  agentId,
  agentName,
  onCancel,
}: McpManagerModalProps) {
  const [mcps, setMcps] = useState<Table.MCP[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formInitialValues, setFormInitialValues] = useState<{
    config: string
    envKeys?: string[]
  }>()

  const loadMcps = useCallback(async () => {
    setLoading(true)
    try {
      const res = await mcpApi.queryByAgentId(agentId)
      if (res.code === 200) {
        setMcps(res.data?.list ?? [])
      }
    } catch (error) {
      message.error('加载 MCP 失败')
    } finally {
      setLoading(false)
    }
  }, [agentId])

  useEffect(() => {
    if (open) {
      loadMcps()
    }
  }, [open, loadMcps])

  const handleAdd = useCallback(() => {
    setEditingId(null)
    setFormInitialValues(undefined)
    setIsModalOpen(true)
  }, [])

  const handleEdit = useCallback((mcp: Table.MCP) => {
    setEditingId(mcp.id)
    setFormInitialValues({
      config: JSON.stringify(mcp.config, null, 2),
      envKeys: mcp.envKeys,
    })
    setIsModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (id: string) => {
      const res = await mcpApi.delete(id)
      if (res.code === 200) {
        message.success('删除成功')
        loadMcps()
      } else {
        message.error(res.message || '删除失败')
      }
    },
    [loadMcps],
  )

  const handleToggleEnabled = useCallback(
    async (id: string, enabled: boolean) => {
      const res = await mcpApi.update(id, { enabled })
      if (res.code === 200) {
        message.success(enabled ? '启用成功' : '禁用成功')
        loadMcps()
      } else {
        message.error(res.message || '操作失败')
      }
    },
    [loadMcps],
  )

  const handleFormOk = useCallback(
    async (values: { config: string; envKeys?: string[] }) => {
      try {
        const config = JSON.parse(values.config)

        let res
        if (editingId) {
          res = await mcpApi.update(editingId, {
            config,
            envKeys: values.envKeys,
          })
        } else {
          res = await mcpApi.create({ agentId, config, enabled: true })
        }

        if (res.code === 200) {
          message.success(editingId ? '更新成功' : '添加成功')
          setIsModalOpen(false)
          loadMcps()
          return true
        } else {
          message.error(res.message || '操作失败')
        }
      } catch (error) {
        message.error('配置格式错误，请检查 JSON 格式')
      }
    },
    [editingId, agentId, loadMcps],
  )

  return (
    <>
      <Modal
        title={`管理 ${agentName} 的 MCP`}
        open={open}
        onCancel={onCancel}
        footer={null}
        width={900}
      >
        <Spin spinning={loading}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            style={{ marginBottom: 16 }}
          >
            添加 MCP
          </Button>
          {mcps.length > 0 ? (
            <Row gutter={[16, 16]}>
              {mcps.map((mcp) => (
                <Col key={mcp.id} xs={24} sm={12} lg={8}>
                  <McpCard
                    mcp={mcp}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleEnabled={handleToggleEnabled}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Empty description="暂无 MCP，点击左上角添加 MCP" />
          )}
        </Spin>
      </Modal>

      <McpForm
        open={isModalOpen}
        editingId={editingId}
        initialValues={formInitialValues}
        onOk={handleFormOk}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  )
}
