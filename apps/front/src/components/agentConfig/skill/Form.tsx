import { Form, Input, Modal } from 'antd'
import { useState } from 'react'

interface SkillFormProps {
  open: boolean
  onOk: (values: { skillName?: string }) => Promise<boolean | undefined | void>
  onCancel: () => void
}

export default function SkillForm({ open, onOk, onCancel }: SkillFormProps) {
  const [form] = Form.useForm<{ skillName?: string }>()
  const [loading, setLoading] = useState(false)

  const handleOk = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const success = await onOk(values)
      if (success) {
        form.resetFields()
      }
    } catch (error) {
      console.error('Validation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="安装技能"
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
          label="技能名称 (GitHub 仓库路径)"
          name="skillName"
          rules={[{ required: true, message: '请输入技能名称' }]}
          tooltip="例如：https://github.com/username/repository-name"
        >
          <Input placeholder="请输入技能名称，例如：https://github.com/username/repository-name" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
