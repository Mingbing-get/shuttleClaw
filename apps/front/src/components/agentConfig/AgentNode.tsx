import { useCallback, useState } from 'react'
import { Button, Popconfirm, message, Tag } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  ApiOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'

import { agentApi } from '../../apis'
import type { Table } from '../../apis/types'
import AgentForm from './AgentForm'
import McpManagerModal from './mcp/ManagerModal'
import SkillManagerModal from './skill/ManagerModal'

interface AgentNodeProps {
  agent: Table.Agent
  onEdit?: (agent: Table.Agent) => void
  onDelete?: (id: string) => void
}

export default function AgentNode({ agent, onEdit, onDelete }: AgentNodeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMcpModalOpen, setIsMcpModalOpen] = useState(false)
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false)

  const handleDelete = useCallback(async () => {
    const res = await agentApi.delete(agent.id)
    if (res.code === 200) {
      message.success('删除成功')
      onDelete?.(agent.id)
    } else {
      message.error(res.message || '删除失败')
    }
  }, [onDelete, agent.id])

  const handleFormOk = useCallback(
    async (values: Table.Agent) => {
      onEdit?.(values)
      setIsModalOpen(false)
    },
    [onEdit],
  )

  return (
    <>
      <div className="agent-config__tree-node">
        <div className="agent-config__tree-node__main">
          <div className="agent-config__tree-node__header">
            <div className="agent-config__tree-node__title">{agent.name}</div>
            {agent.isLazy ? <Tag color="blue">懒加载</Tag> : null}
            {agent.enabled ? (
              <Tag color="green">已启用</Tag>
            ) : (
              <Tag color="red">已禁用</Tag>
            )}
          </div>
          <div className="agent-config__tree-node__describe">
            {agent.describe}
          </div>
        </div>
        <div className="agent-config__tree-node__actions">
          <Button
            type="text"
            icon={<ApiOutlined />}
            onClick={() => {
              setIsMcpModalOpen(true)
            }}
            title="管理 MCP"
          />
          <Button
            type="text"
            icon={<AppstoreOutlined />}
            onClick={() => {
              setIsSkillModalOpen(true)
            }}
            title="管理技能"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setIsModalOpen(true)
            }}
          />
          <Popconfirm
            title="确认删除"
            description="确定要删除这个智能体吗？"
            onConfirm={handleDelete}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      </div>

      <AgentForm
        open={isModalOpen}
        title={'修改智能体'}
        initialValues={agent}
        onOk={handleFormOk}
        onCancel={() => {
          setIsModalOpen(false)
        }}
      />

      <McpManagerModal
        open={isMcpModalOpen}
        agentId={agent.id}
        agentName={agent.name}
        onCancel={() => {
          setIsMcpModalOpen(false)
        }}
      />

      <SkillManagerModal
        open={isSkillModalOpen}
        agentId={agent.id}
        agentName={agent.name}
        onCancel={() => {
          setIsSkillModalOpen(false)
        }}
      />
    </>
  )
}
