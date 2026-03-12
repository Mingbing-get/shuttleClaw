import { useState, useEffect, useCallback } from 'react'
import { Button, message, Spin, Pagination } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { modelApi, Table } from '../../apis'
import ModelForm from './ModelForm'
import ModelCard from './ModelCard'

import './index.scss'

const pageSize = 12

export default function ModelConfig() {
  const [models, setModels] = useState<Omit<Table.Model, 'apiKey'>[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchModels = useCallback(async (page: number) => {
    try {
      setLoading(true)
      const response = await modelApi.query({
        page,
        pageSize,
      })
      setModels(response.data?.list || [])
      setTotal(response.data?.pagination.total || 0)
    } catch (error) {
      message.error('获取模型列表失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchModels(currentPage)
  }, [currentPage])

  const handleAdd = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const handleFormOk = useCallback((data: Omit<Table.Model, 'apiKey'>) => {
    setModels((prevModels) => [...prevModels, data])
    setIsModalOpen(false)
  }, [])

  const handleUpdated = useCallback((data: Omit<Table.Model, 'apiKey'>) => {
    setModels((prevModels) =>
      prevModels.map((model) => (model.id === data.id ? data : model)),
    )
  }, [])

  const handleDeleted = useCallback((id: string) => {
    setModels((prevModels) => prevModels.filter((model) => model.id !== id))
  }, [])

  const handleFormCancel = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  return (
    <Spin spinning={loading}>
      <div className="model-config">
        <div className="model-config__header">
          <h2>配置模型</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加模型
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {models.length === 0 ? (
            <div className="model-config__empty">
              暂无模型配置，点击右上角按钮添加模型
            </div>
          ) : (
            <div className="model-config__grid">
              {models.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  onEdit={handleUpdated}
                  onDelete={handleDeleted}
                />
              ))}
            </div>
          )}

          <Pagination
            style={{ justifyContent: 'flex-end' }}
            total={total}
            pageSize={pageSize}
            showSizeChanger={false}
            current={currentPage}
            onChange={setCurrentPage}
          />
        </div>

        <ModelForm
          open={isModalOpen}
          title={'添加模型'}
          onOk={handleFormOk}
          onCancel={handleFormCancel}
        />
      </div>
    </Spin>
  )
}
