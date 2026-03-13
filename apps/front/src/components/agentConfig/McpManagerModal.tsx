import { useCallback, useEffect, useState } from 'react'
import {
  Button,
  Modal,
  Table as AntTable,
  Switch,
  message,
  Popconfirm,
  Space,
  Form,
  Input,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { mcpApi } from '../../apis'
import type { Table } from '../../apis/types'

interface McpManagerModalProps {
  open: boolean
  agentId: string
  agentName: string
  onCancel?: () => void
}

interface McpFormData {
  config: string
}

export default function McpManagerModal({
  open,
  agentId,
  agentName,
  onCancel,
}: McpManagerModalProps) {
  const [mcps, setMcps] = useState<Table.MCP[]>([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm<McpFormData>()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    form.resetFields()
    setIsModalOpen(true)
  }, [form])

  const handleEdit = useCallback(
    (mcp: Table.MCP) => {
      setEditingId(mcp.id)
      form.setFieldsValue({
        config: JSON.stringify(mcp.config, null, 2),
      })
      setIsModalOpen(true)
    },
    [form],
  )

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

  const handleFormOk = useCallback(async () => {
    try {
      const values = await form.validateFields()
      const config = JSON.parse(values.config)

      let res
      if (editingId) {
        res = await mcpApi.update(editingId, { config })
      } else {
        res = await mcpApi.create({ agentId, config, enabled: true })
      }

      if (res.code === 200) {
        message.success(editingId ? '更新成功' : '添加成功')
        setIsModalOpen(false)
        loadMcps()
      } else {
        message.error(res.message || '操作失败')
      }
    } catch (error) {
      message.error('配置格式错误，请检查 JSON 格式')
    }
  }, [form, editingId, agentId, loadMcps])

  const columns = [
    {
      title: '配置',
      dataIndex: 'config',
      key: 'config',
      render: (config: Record<string, any>) => (
        <pre style={{ margin: 0, fontSize: '12px' }}>
          {JSON.stringify(config, null, 2)}
        </pre>
      ),
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: Table.MCP) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleToggleEnabled(record.id, checked)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Table.MCP) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个 MCP 吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Modal
        title={`管理 ${agentName} 的 MCP`}
        open={open}
        onCancel={onCancel}
        footer={null}
        width={800}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          style={{ marginBottom: 16 }}
        >
          添加 MCP
        </Button>
        <AntTable
          columns={columns}
          dataSource={mcps}
          rowKey="id"
          loading={loading}
          pagination={false}
          size="small"
        />
      </Modal>

      <Modal
        title={editingId ? '编辑 MCP' : '添加 MCP'}
        open={isModalOpen}
        onOk={handleFormOk}
        onCancel={() => setIsModalOpen(false)}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="配置 (JSON 格式)"
            name="config"
            rules={[
              { required: true, message: '请输入配置' },
              {
                validator: (_, value) => {
                  try {
                    JSON.parse(value)
                    return Promise.resolve()
                  } catch {
                    return Promise.reject(new Error('请输入有效的 JSON 格式'))
                  }
                },
              },
            ]}
          >
            <Input.TextArea
              placeholder='请输入 MCP 配置，例如：{"name": "example", "type": "streamable_http", "url": "http://example.com"}'
              rows={10}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
