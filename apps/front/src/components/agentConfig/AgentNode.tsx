import { useCallback, useState } from 'react'
import { Button, Popconfirm, message, Tag } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import { agentApi, Table } from '../../apis'
import AgentForm from './AgentForm'

interface AgentNodeProps {
  agent: Table.Agent
  onEdit?: (agent: Table.Agent) => void
  onDelete?: (id: string) => void
}

export default function AgentNode({ agent, onEdit, onDelete }: AgentNodeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

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
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  )
}
