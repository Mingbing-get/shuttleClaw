import { useState, useCallback } from 'react'
import { Button, Empty, Spin, Tree, TreeProps } from 'antd'
import { PlusOutlined, CaretDownFilled } from '@ant-design/icons'

import { useAgentTree, AgentTree } from '../../hooks'
import AgentForm from './AgentForm'
import AgentNode from './AgentNode'
import { WalkForest } from '../../utils/walkForest'
import { agentApi } from '../../apis'

import './index.scss'

export default function AgentConfig() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [agentTree, loading, refreshAgentTree] = useAgentTree()

  const handleAdd = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const handleFormOk = useCallback(() => {
    refreshAgentTree()
    setIsModalOpen(false)
  }, [])

  const handleFormCancel = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleDrop = useCallback(
    async (info: Parameters<Required<TreeProps>['onDrop']>[0]) => {
      const node = info.node as any as AgentTree
      const dragNode = info.dragNode as any as AgentTree
      const dropPosition = info.dropPosition

      const newParentId = dropPosition === 0 ? node.id : node.parentId
      if (newParentId === dragNode.parentId) return

      if (newParentId) {
        const walkAgentTree = new WalkForest(agentTree, 'children', 'id')
        const parentNodeInfo = walkAgentTree.findWithPath(
          (item) => item.id === newParentId,
        )
        if (!parentNodeInfo) return

        if (parentNodeInfo.path.includes(dragNode.id)) return
      }

      await agentApi.move(dragNode.id, { parentId: newParentId })

      refreshAgentTree()
    },
    [agentTree],
  )

  return (
    <Spin spinning={loading}>
      <div className="agent-config">
        <div className="agent-config__header">
          <h2>配置智能体</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加智能体
          </Button>
        </div>

        {agentTree.length > 0 ? (
          <Tree
            treeData={agentTree}
            draggable
            blockNode
            showLine
            defaultExpandAll
            onDrop={handleDrop}
            switcherIcon={<CaretDownFilled />}
            titleRender={(node) => (
              <AgentNode
                agent={node}
                onEdit={refreshAgentTree}
                onDelete={refreshAgentTree}
              />
            )}
          />
        ) : (
          <Empty description="暂无智能体，点击右上角添加智能体" />
        )}

        <AgentForm
          open={isModalOpen}
          title={'添加智能体'}
          onOk={handleFormOk}
          onCancel={handleFormCancel}
        />
      </div>
    </Spin>
  )
}
