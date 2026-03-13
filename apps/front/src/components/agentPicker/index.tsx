import { TreeSelect, TreeSelectProps } from 'antd'

import { useAgentTree } from '../../hooks'

export default function AgentPicker(
  props: Omit<TreeSelectProps, 'treeData' | 'loading'>,
) {
  const [agentTree, loading] = useAgentTree()

  return <TreeSelect {...props} treeData={agentTree} loading={loading} />
}
