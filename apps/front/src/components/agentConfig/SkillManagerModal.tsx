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
  InputNumber,
  Tag,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { skillApi } from '../../apis'
import type { Table } from '../../apis/types'

interface SkillManagerModalProps {
  open: boolean
  agentId: string
  agentName: string
  onCancel?: () => void
}

interface SkillFormData {
  skillName: string
  describe?: string
  env?: string
}

export default function SkillManagerModal({
  open,
  agentId,
  agentName,
  onCancel,
}: SkillManagerModalProps) {
  const [skills, setSkills] = useState<Table.Skill[]>([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm<SkillFormData>()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadSkills = useCallback(async () => {
    setLoading(true)
    try {
      const res = await skillApi.queryByAgentId(agentId)
      if (res.code === 200) {
        setSkills(res.data?.list || [])
      }
    } catch (error) {
      message.error('加载技能失败')
    } finally {
      setLoading(false)
    }
  }, [agentId])

  useEffect(() => {
    if (open) {
      loadSkills()
    }
  }, [open, loadSkills])

  const handleAdd = useCallback(() => {
    setEditingId(null)
    form.resetFields()
    setIsModalOpen(true)
  }, [form])

  const handleEdit = useCallback(
    (skill: Table.Skill) => {
      setEditingId(skill.id)
      form.setFieldsValue({
        skillName: skill.skillName,
        describe: skill.describe,
        env: skill.env ? JSON.stringify(skill.env, null, 2) : '',
      })
      setIsModalOpen(true)
    },
    [form],
  )

  const handleDelete = useCallback(
    async (id: string) => {
      const res = await skillApi.delete(id)
      if (res.code === 200) {
        message.success('删除成功')
        loadSkills()
      } else {
        message.error(res.message || '删除失败')
      }
    },
    [loadSkills],
  )

  const handleToggleEnabled = useCallback(
    async (id: string, enabled: boolean) => {
      const res = await skillApi.update(id, { enabled })
      if (res.code === 200) {
        message.success(enabled ? '启用成功' : '禁用成功')
        loadSkills()
      } else {
        message.error(res.message || '操作失败')
      }
    },
    [loadSkills],
  )

  const handleFormOk = useCallback(async () => {
    try {
      const values = await form.validateFields()
      const env = values.env ? JSON.parse(values.env) : {}

      let res
      if (editingId) {
        res = await skillApi.update(editingId, { env })
      } else {
        res = await skillApi.install({
          agentId,
          installSource: {
            type: 'github',
            url: values.skillName,
          },
          enabled: true,
        })
      }

      if (res.code === 200) {
        message.success(editingId ? '更新成功' : '安装成功')
        setIsModalOpen(false)
        loadSkills()
      } else {
        message.error(res.message || '操作失败')
      }
    } catch (error) {
      message.error('配置格式错误，请检查 JSON 格式')
    }
  }, [form, editingId, agentId, loadSkills])

  const columns = [
    {
      title: '技能名称',
      dataIndex: 'skillName',
      key: 'skillName',
      render: (skillName: string) => <Tag color="blue">{skillName}</Tag>,
    },
    {
      title: '描述',
      dataIndex: 'describe',
      key: 'describe',
      ellipsis: true,
    },
    {
      title: '环境变量',
      dataIndex: 'env',
      key: 'env',
      render: (env: Record<string, any> | null) => {
        if (!env || Object.keys(env).length === 0) {
          return '-'
        }
        return (
          <pre style={{ margin: 0, fontSize: '12px' }}>
            {JSON.stringify(env, null, 2)}
          </pre>
        )
      },
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: Table.Skill) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleToggleEnabled(record.id, checked)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Table.Skill) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个技能吗？"
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
        title={`管理 ${agentName} 的技能`}
        open={open}
        onCancel={onCancel}
        footer={null}
        width={900}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          style={{ marginBottom: 16 }}
        >
          安装技能
        </Button>
        <AntTable
          columns={columns}
          dataSource={skills}
          rowKey="id"
          loading={loading}
          pagination={false}
          size="small"
        />
      </Modal>

      <Modal
        title={editingId ? '编辑技能' : '安装技能'}
        open={isModalOpen}
        onOk={handleFormOk}
        onCancel={() => setIsModalOpen(false)}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          {!editingId && (
            <Form.Item
              label="技能名称 (GitHub 仓库路径)"
              name="skillName"
              rules={[{ required: true, message: '请输入技能名称' }]}
              tooltip="例如：https://github.com/username/repository-name"
            >
              <Input placeholder="请输入技能名称，例如：https://github.com/username/repository-name" />
            </Form.Item>
          )}
          {editingId && (
            <Form.Item label="技能名称">
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item
            label="环境变量 (JSON 格式)"
            name="env"
            tooltip="可选：为技能配置环境变量"
          >
            <Input.TextArea
              placeholder='请输入环境变量，例如：{"API_KEY": "your-key"}'
              rows={6}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
