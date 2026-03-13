import { Form, Input, Modal, Select } from 'antd'
import { useEffect, useMemo, useState } from 'react'

interface McpFormProps {
  open: boolean
  editingId: string | null
  initialValues?: {
    config: string
    envKeys?: string[]
  }
  onOk: (data: {
    config: string
    envKeys?: string[]
  }) => Promise<boolean | undefined | void>
  onCancel: () => void
}

export default function McpForm({
  open,
  editingId,
  initialValues,
  onOk,
  onCancel,
}: McpFormProps) {
  const [form] = Form.useForm<{ config: string; envKeys?: string[] }>()
  const [loading, setLoading] = useState(false)

  const handleOk = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const reset = await onOk(values)
      if (reset) {
        form.resetFields()
      }
    } catch (error) {
      console.error('Validation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const envOptions = useMemo(() => {
    return (
      initialValues?.envKeys?.map((key) => ({
        label: key,
        value: key,
      })) || []
    )
  }, [initialValues])

  useEffect(() => {
    if (!initialValues) {
      form.resetFields()
      return
    }

    form.setFieldsValue(initialValues)
  }, [initialValues, form])

  return (
    <Modal
      title={editingId ? '编辑 MCP' : '添加 MCP'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="确定"
      okButtonProps={{
        loading,
      }}
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
                  const config = JSON.parse(value)
                  if (!config.name || !config.type || !config.url) {
                    return Promise.reject('配置必须包含 name、type 和 url 字段')
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
        {editingId && (
          <Form.Item label="环境变量" name="envKeys">
            <Select
              mode="multiple"
              placeholder="保留环境变量"
              options={envOptions}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}
