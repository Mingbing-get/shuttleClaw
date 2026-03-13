import { Form, Input, Modal } from 'antd'

interface SkillFormProps {
  open: boolean
  editingId: string | null
  initialValues?: {
    skillName?: string
    describe?: string
    env?: string
  }
  onOk: (values: { skillName?: string; env?: string }) => void
  onCancel: () => void
}

export default function SkillForm({
  open,
  editingId,
  initialValues,
  onOk,
  onCancel,
}: SkillFormProps) {
  const [form] = Form.useForm<{ skillName?: string; env?: string }>()

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
      title={editingId ? '编辑技能' : '安装技能'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
      width={600}
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        {!editingId && (
          <Form.Item
            label="技能名称 (GitHub 仓库路径)"
            name="skillName"
            rules={[{ required: true, message: '请输入技能名称' }]}
            tooltip="例如：https://github.com/username/repository-name"
          >
            <Input placeholder="请输入技能名称，例如：https://github.com/username/repository-name" />
          </Form.Item>
        )}
        {editingId && (
          <Form.Item label="技能名称">
            <Input disabled />
          </Form.Item>
        )}
        <Form.Item
          label="环境变量 (JSON 格式)"
          name="env"
          tooltip="可选：为技能配置环境变量"
        >
          <Input.TextArea
            placeholder='请输入环境变量，例如：{"API_KEY": "your-key"}'
            rows={6}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
