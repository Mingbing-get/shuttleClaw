import { Form, Input, Modal } from 'antd'

interface SkillFormProps {
  open: boolean
  onOk: (values: { skillName?: string }) => Promise<boolean | undefined | void>
  onCancel: () => void
}

export default function SkillForm({ open, onOk, onCancel }: SkillFormProps) {
  const [form] = Form.useForm<{ skillName?: string }>()

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      const success = await onOk(values)
      if (success) {
        form.resetFields()
      }
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  return (
    <Modal
      title="安装技能"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="确定"
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
