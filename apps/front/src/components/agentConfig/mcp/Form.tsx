import { Form, Input, Modal } from 'antd'

interface McpFormProps {
  open: boolean
  editingId: string | null
  initialValues?: string
  onOk: (values: { config: string }) => void
  onCancel: () => void
}

export default function McpForm({
  open,
  editingId,
  initialValues,
  onOk,
  onCancel,
}: McpFormProps) {
  const [form] = Form.useForm<{ config: string }>()

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      onOk(values)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  return (
    <Modal
      title={editingId ? '编辑 MCP' : '添加 MCP'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
      width={600}
    >
      <Form form={form} layout="vertical" initialValues={{ config: initialValues }}>
        <Form.Item
          label="配置 (JSON 格式)"
          name="config"
          rules={[
            { required: true, message: '请输入配置' },
            {
              validator: (_, value) => {
                try {
                  const config = JSON.parse(value)
                  if (!config.name || !config.type || !config.url) {
                    return Promise.reject(
                      '配置必须包含 name、type 和 url 字段',
                    )
                  }
                  if (config.type !== 'streamable_http') {
                    return Promise.reject('type 必须为 streamable_http')
                  }
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
  )
}
