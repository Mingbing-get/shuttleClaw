import { useCallback, useEffect, useMemo } from 'react'
import { Form, Input, Modal, Select, message } from 'antd'
import { Table, skillApi } from '../../../apis'

interface SkillFormProps {
  open: boolean
  id: string
  envDefine?: Table.Skill['envDefine']
  envKeys?: Table.Skill['envKeys']
  onOk?: () => void
  onCancel?: () => void
}

export default function SkillForm({
  open,
  id,
  envDefine,
  envKeys,
  onOk,
  onCancel,
}: SkillFormProps) {
  const [form] = Form.useForm<{
    envKeys?: string[]
    env?: Record<string, string>
  }>()

  const keepKeys = Form.useWatch(['envKeys'], form)

  const handleOk = useCallback(async () => {
    try {
      const values = await form.validateFields()
      const res = await skillApi.update(id, {
        envKeys: values.envKeys,
        env: values.env,
      })

      if (res.code !== 200) {
        message.error(res.message || '更新环境变量失败')
        return
      }
      onOk?.()
      form.resetFields()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }, [id, onOk])

  useEffect(() => {
    if (envKeys) {
      form.setFieldsValue({ envKeys })
    } else {
      form.resetFields()
    }
  }, [envKeys])

  const envOptions = useMemo(() => {
    return (
      envKeys?.map((key) => ({
        label: key,
        value: key,
      })) || []
    )
  }, [envKeys])

  const editFields = useMemo(() => {
    const editFields: { key: string; required: boolean }[] = []

    envDefine?.requires?.forEach((key) => {
      if (keepKeys?.includes(key)) return

      editFields.push({
        key,
        required: true,
      })
    })

    envDefine?.variables?.forEach((key) => {
      if (keepKeys?.includes(key)) return

      editFields.push({
        key,
        required: false,
      })
    })

    return editFields
  }, [keepKeys, envDefine])

  return (
    <Modal
      title="编辑环境变量"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="保留环境变量" name="envKeys">
          <Select
            mode="multiple"
            options={envOptions}
            placeholder="请选择保留环境变量"
          />
        </Form.Item>
        {editFields.map((item) => (
          <Form.Item
            key={item.key}
            label={item.key}
            name={['env', item.key]}
            rules={[
              {
                required: item.required,
                message: `环境变量: ${item.key} ${item.required ? '不能为空' : ''}`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  )
}
