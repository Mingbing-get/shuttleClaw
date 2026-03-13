import { Form, Input, Modal, message } from 'antd'
import { modelApi, Table } from '../../apis'
import { useCallback, useMemo } from 'react'

interface ModelFormProps {
  open: boolean
  title: string
  initialValues?: Omit<Table.Model, 'apiKey'>
  onOk?: (data: Omit<Table.Model, 'apiKey'>) => void
  onCancel?: () => void
}

export default function ModelForm({
  open,
  title,
  initialValues,
  onOk,
  onCancel,
}: ModelFormProps) {
  const [form] = Form.useForm<Partial<Table.Model>>()

  const isEdit = useMemo(() => !!initialValues?.id, [initialValues?.id])

  const handleOk = useCallback(async () => {
    const values = await form.validateFields()

    let response
    if (initialValues?.id) {
      response = await modelApi.update(initialValues.id, values)
    } else {
      response = await modelApi.create(values as any)
    }

    if (response.code === 200) {
      message.success(initialValues?.id ? '模型更新成功' : '模型添加成功')
      onOk?.(response.data!)
      if (!initialValues?.id) {
        form.resetFields()
      }
    } else {
      message.error(response.message || '操作失败')
    }
  }, [initialValues?.id])

  const handleCancel = useCallback(() => {
    onCancel?.()
    form.resetFields()
  }, [onCancel])

  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
      getContainer={() => document.body}
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          label="模型名称"
          name="model"
          rules={[{ required: true, message: '请输入模型名称' }]}
        >
          <Input placeholder="请输入模型名称" />
        </Form.Item>
        <Form.Item
          label="模型地址"
          name="url"
          rules={[
            { required: true, message: '请输入模型地址' },
            { type: 'url', message: '请输入有效的URL地址' },
          ]}
        >
          <Input placeholder="请输入模型地址" />
        </Form.Item>
        <Form.Item
          label="API Key"
          name="apiKey"
          rules={[isEdit ? {} : { required: true, message: '请输入API Key' }]}
        >
          <Input.Password placeholder="请输入API Key" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
