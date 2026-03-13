import { useCallback, useEffect, useState } from 'react'
import { Button, Modal, message, Row, Col } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { skillApi } from '../../../apis'
import type { Table } from '../../../apis/types'
import SkillCard from './Card'
import SkillForm from './Form'

interface SkillManagerModalProps {
  open: boolean
  agentId: string
  agentName: string
  onCancel?: () => void
}

export default function SkillManagerModal({
  open,
  agentId,
  agentName,
  onCancel,
}: SkillManagerModalProps) {
  const [skills, setSkills] = useState<Table.Skill[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formInitialValues, setFormInitialValues] = useState<{
    skillName?: string
    describe?: string
    env?: string
  }>()

  const loadSkills = useCallback(async () => {
    setLoading(true)
    try {
      const res = await skillApi.queryByAgentId(agentId)
      if (res.code === 200) {
        setSkills(res.data?.list || [])
      }
    } catch (error) {
      message.error('加载技能失败')
    } finally {
      setLoading(false)
    }
  }, [agentId])

  useEffect(() => {
    if (open) {
      loadSkills()
    }
  }, [open, loadSkills])

  const handleAdd = useCallback(() => {
    setEditingId(null)
    setFormInitialValues(undefined)
    setIsModalOpen(true)
  }, [])

  const handleEdit = useCallback((skill: Table.Skill) => {
    setEditingId(skill.id)
    setFormInitialValues({
      skillName: skill.skillName,
      describe: skill.describe,
      env: skill.env ? JSON.stringify(skill.env, null, 2) : '',
    })
    setIsModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (id: string) => {
      const res = await skillApi.delete(id)
      if (res.code === 200) {
        message.success('删除成功')
        loadSkills()
      } else {
        message.error(res.message || '删除失败')
      }
    },
    [loadSkills],
  )

  const handleToggleEnabled = useCallback(
    async (id: string, enabled: boolean) => {
      const res = await skillApi.update(id, { enabled })
      if (res.code === 200) {
        message.success(enabled ? '启用成功' : '禁用成功')
        loadSkills()
      } else {
        message.error(res.message || '操作失败')
      }
    },
    [loadSkills],
  )

  const handleFormOk = useCallback(
    async (values: { skillName?: string; env?: string }) => {
      try {
        const env = values.env ? JSON.parse(values.env) : {}

        let res
        if (editingId) {
          res = await skillApi.update(editingId, { env })
        } else {
          res = await skillApi.install({
            agentId,
            installSource: {
              type: 'github',
              url: values.skillName || '',
            },
            enabled: true,
          })
        }

        if (res.code === 200) {
          message.success(editingId ? '更新成功' : '安装成功')
          setIsModalOpen(false)
          loadSkills()
        } else {
          message.error(res.message || '操作失败')
        }
      } catch (error) {
        message.error('配置格式错误，请检查 JSON 格式')
      }
    },
    [editingId, agentId, loadSkills],
  )

  return (
    <>
      <Modal
        title={`管理 ${agentName} 的技能`}
        open={open}
        onCancel={onCancel}
        footer={null}
        width={900}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          style={{ marginBottom: 16 }}
        >
          安装技能
        </Button>
        <Row gutter={[16, 16]}>
          {skills.map((skill) => (
            <Col key={skill.id} xs={24} sm={12} lg={8}>
              <SkillCard
                skill={skill}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleEnabled={handleToggleEnabled}
              />
            </Col>
          ))}
        </Row>
      </Modal>

      <SkillForm
        open={isModalOpen}
        editingId={editingId}
        initialValues={formInitialValues}
        onOk={handleFormOk}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  )
}
