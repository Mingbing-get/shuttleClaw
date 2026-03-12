import { useCallback, useState } from 'react'
import { Card, Button, Popconfirm, Space, message } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import { modelApi, Table } from '../../apis'
import ModelForm from './ModelForm'

interface ModelCardProps {
  model: Omit<Table.Model, 'apiKey'>
  onEdit?: (model: Omit<Table.Model, 'apiKey'>) => void
  onDelete?: (id: string) => void
}

export default function ModelCard({ model, onEdit, onDelete }: ModelCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDelete = useCallback(async () => {
    const res = await modelApi.delete(model.id)
    if (res.code === 200) {
      message.success('删除成功')
      onDelete?.(model.id)
    } else {
      message.error(res.message || '删除失败')
    }
  }, [onDelete, model.id])

  const handleFormOk = useCallback(
    async (values: Omit<Table.Model, 'apiKey'>) => {
      onEdit?.(values)
      setIsModalOpen(false)
    },
    [onEdit],
  )

  return (
    <>
      <Card
        title={model.model}
        extra={
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => setIsModalOpen(true)}
            />
            <Popconfirm
              title="确认删除"
              description="确定要删除这个模型吗？"
              onConfirm={handleDelete}
              okText="确定"
              cancelText="取消"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        }
        className="model-config__card"
      >
        <div className="model-config__card-info">
          <div className="model-config__card-info-item">
            <span className="model-config__card-info-item-label">名称：</span>
            <span className="model-config__card-info-item-value">
              {model.model}
            </span>
          </div>
          <div className="model-config__card-info-item">
            <span className="model-config__card-info-item-label">地址：</span>
            <span className="model-config__card-info-item-value break-all">
              {model.url}
            </span>
          </div>
        </div>
      </Card>

      <ModelForm
        open={isModalOpen}
        title={'修改模型'}
        initialValues={model}
        onOk={handleFormOk}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  )
}
