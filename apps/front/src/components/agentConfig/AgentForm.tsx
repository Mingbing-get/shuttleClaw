import { useCallback, useMemo } from 'react'
import { Form, Input, Modal, Radio, message } from 'antd'

import { agentApi, Table } from '../../apis'
import AgentPicker from '../agentPicker'
import ModelPicker from '../modelPicker'

interface AgentFormProps {
  open: boolean
  title: string
  initialValues?: Partial<Table.Agent>
  onOk?: (data: Table.Agent) => void
  onCancel?: () => void
}

export default function AgentForm({
  open,
  title,
  initialValues,
  onOk,
  onCancel,
}: AgentFormProps) {
  const [form] = Form.useForm<Partial<Table.Agent>>()

  const isEdit = useMemo(() => !!initialValues?.id, [initialValues?.id])

  const handleOk = useCallback(async () => {
    const values = await form.validateFields()

    let response
    if (initialValues?.id) {
      response = await agentApi.update(initialValues.id, values)
    } else {
      response = await agentApi.create(values as any)
    }

    if (response.code === 200) {
      message.success(initialValues?.id ? '智能体更新成功' : '智能体添加成功')
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
          label="智能体名称"
          name="name"
          rules={[{ required: true, message: '请输入智能体名称' }]}
        >
          <Input placeholder="请输入智能体名称" />
        </Form.Item>
        <Form.Item
          label="描述"
          name="describe"
          rules={[{ required: true, message: '请输入描述' }]}
        >
          <Input.TextArea placeholder="请输入描述" rows={4} />
        </Form.Item>
        <Form.Item
          label="大模型"
          name="modelId"
          rules={[{ required: true, message: '请选择大模型' }]}
        >
          <ModelPicker placeholder="请选择大模型" />
        </Form.Item>
        {!isEdit && (
          <Form.Item label="父级智能体" name="parentId">
            <AgentPicker placeholder="请选择父级智能体（可选）" allowClear />
          </Form.Item>
        )}
        <Form.Item label="是否懒加载" name="isLazy">
          <Radio.Group defaultValue={true}>
            <Radio.Button value={true}>是</Radio.Button>
            <Radio.Button value={false}>否</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="是否启用" name="enabled">
          <Radio.Group defaultValue={true}>
            <Radio.Button value={true}>启用</Radio.Button>
            <Radio.Button value={false}>禁用</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}
