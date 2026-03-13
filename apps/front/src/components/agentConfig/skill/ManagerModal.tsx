import { useCallback, useEffect, useState } from 'react'
import { Button, Modal, message, Row, Col, Spin, Empty } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { skillApi } from '../../../apis'
import type { Table } from '../../../apis/types'
import SkillCard from './Card'
import SkillForm from './Form'
import EnvSetting from './envSetting'

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editEnvSkill, setEditEnvSkill] = useState<Table.Skill>()

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
    setIsModalOpen(true)
  }, [])

  const handleEdit = useCallback((skill: Table.Skill) => {
    setEditEnvSkill(skill)
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
    async (values: { skillName?: string }) => {
      try {
        const res = await skillApi.install({
          agentId,
          installSource: {
            type: 'github',
            url: values.skillName || '',
          },
          enabled: true,
        })

        if (res.code === 200) {
          message.success('安装成功')
          setIsModalOpen(false)
          loadSkills()
          return true
        } else {
          message.error(res.message || '操作失败')
        }
      } catch (error) {
        message.error('配置格式错误，请检查 JSON 格式')
      }
    },
    [agentId, loadSkills],
  )

  const handleSettingEnvOk = useCallback(() => {
    setEditEnvSkill(undefined)
    loadSkills()
  }, [loadSkills])

  return (
    <>
      <Modal
        title={`管理 ${agentName} 的技能`}
        open={open}
        onCancel={onCancel}
        footer={null}
        width={900}
      >
        <Spin spinning={loading}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            style={{ marginBottom: 16 }}
          >
            安装技能
          </Button>
          {skills.length > 0 ? (
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
          ) : (
            <Empty description="暂无技能，点击左上角安装技能" />
          )}
        </Spin>
      </Modal>

      <SkillForm
        open={isModalOpen}
        onOk={handleFormOk}
        onCancel={() => setIsModalOpen(false)}
      />

      <EnvSetting
        open={!!editEnvSkill}
        id={editEnvSkill?.id || ''}
        envDefine={editEnvSkill?.envDefine}
        envKeys={editEnvSkill?.envKeys}
        onOk={handleSettingEnvOk}
        onCancel={() => setEditEnvSkill(undefined)}
      />
    </>
  )
}
