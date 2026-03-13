import { Card, Switch, Button, Space, Popconfirm, Tag } from 'antd'
import type { Table } from '../../../apis/types'
import { useMemo } from 'react'

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
  const actions = useMemo(() => {
    const actions = [
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
    ]

    if (skill.envDefine) {
      actions.unshift(
        <Button type="link" size="small" onClick={() => onEdit(skill)}>
          环境变量
        </Button>,
      )
    }

    return actions
  }, [skill, onEdit, onDelete])

  return (
    <Card
      className="justify-card"
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
      actions={actions}
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
