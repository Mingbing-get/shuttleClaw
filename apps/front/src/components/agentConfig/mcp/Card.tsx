import { Card, Switch, Button, Space, Popconfirm, Tag, Divider } from 'antd'
import type { Table } from '../../../apis/types'

interface McpCardProps {
  mcp: Table.MCP
  onEdit: (mcp: Table.MCP) => void
  onDelete: (id: string) => void
  onToggleEnabled: (id: string, enabled: boolean) => void
}

export default function McpCard({
  mcp,
  onEdit,
  onDelete,
  onToggleEnabled,
}: McpCardProps) {
  return (
    <Card
      className="justify-card"
      size="small"
      title={mcp.config.name}
      extra={
        <Space>
          <Switch
            checked={mcp.enabled}
            onChange={(checked) => onToggleEnabled(mcp.id, checked)}
          />
        </Space>
      }
      actions={[
        <Button type="link" size="small" onClick={() => onEdit(mcp)}>
          编辑
        </Button>,
        <Popconfirm
          title="确认删除"
          description="确定要删除这个 MCP 吗？"
          onConfirm={() => onDelete(mcp.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" size="small" danger>
            删除
          </Button>
        </Popconfirm>,
      ]}
    >
      <div style={{ marginBottom: 8 }}>
        <strong>类型：</strong>
        <span>{mcp.config.type}</span>
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>URL：</strong>
        <span style={{ wordBreak: 'break-all' }}>{mcp.config.url}</span>
      </div>
      {mcp.config.description && (
        <div>
          <strong>描述：</strong>
          <span>{mcp.config.description}</span>
        </div>
      )}
      {mcp.envKeys?.length ? (
        <>
          <Divider style={{ margin: '4px 0' }} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            {mcp.envKeys.map((key) => (
              <Tag key={key}>{key}</Tag>
            ))}
          </div>
        </>
      ) : null}
    </Card>
  )
}
