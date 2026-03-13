import { Card, Switch, Button, Space, Popconfirm, Tag } from 'antd'
import type { Table } from '../../../apis/types'

interface SkillCardProps {
  skill: Table.Skill
  onEdit: (skill: Table.Skill) => void
  onDelete: (id: string) => void
  onToggleEnabled: (id: string, enabled: boolean) => void
}

export default function SkillCard({
  skill,
  onEdit,
  onDelete,
  onToggleEnabled,
}: SkillCardProps) {
  return (
    <Card
      size="small"
      title={<Tag color="blue">{skill.skillName}</Tag>}
      extra={
        <Space>
          <Switch
            checked={skill.enabled}
            onChange={(checked) => onToggleEnabled(skill.id, checked)}
          />
        </Space>
      }
      actions={[
        <Button type="link" size="small" onClick={() => onEdit(skill)}>
          编辑
        </Button>,
        <Popconfirm
          title="确认删除"
          description="确定要删除这个技能吗？"
          onConfirm={() => onDelete(skill.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" size="small" danger>
            删除
          </Button>
        </Popconfirm>,
      ]}
    >
      {skill.describe && (
        <div style={{ marginBottom: 8 }}>
          <strong>描述：</strong>
          <span>{skill.describe}</span>
        </div>
      )}
      {skill.env && Object.keys(skill.env).length > 0 && (
        <div>
          <strong>环境变量：</strong>
          <pre style={{ margin: 0, fontSize: '12px' }}>
            {JSON.stringify(skill.env, null, 2)}
          </pre>
        </div>
      )}
    </Card>
  )
}
