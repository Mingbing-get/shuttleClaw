import { useMemo, useState } from 'react'
import { Layout, Menu, Button, MenuProps } from 'antd'
import classNames from 'classnames'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  MessageFilled,
  SettingFilled,
  RobotFilled,
} from '@ant-design/icons'

import AuthRouter from './components/authRouter'
import Chat from './components/chat'
import ModelConfig from './components/modelConfig'
import AgentConfig from './components/agentConfig'

export default function Main() {
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState(['chat'])

  const menuItems: MenuProps['items'] = useMemo(
    () => [
      {
        key: 'chat_group',
        label: '聊天',
        type: 'group',
        children: [
          {
            key: 'chat',
            label: '聊天',
            icon: <MessageFilled />,
          },
        ],
      },
      {
        key: 'agent_group',
        label: '智能体',
        type: 'group',
        children: [
          {
            key: 'model',
            label: '模型',
            icon: <SettingFilled />,
          },
          {
            key: 'agent',
            label: '智能体',
            icon: <RobotFilled />,
          },
        ],
      },
    ],
    [],
  )

  const content = useMemo(() => {
    if (selectedKeys.includes('chat')) {
      return <Chat />
    }
    if (selectedKeys.includes('model')) {
      return <ModelConfig />
    }
    if (selectedKeys.includes('agent')) {
      return <AgentConfig />
    }
    return null
  }, [selectedKeys])

  return (
    <AuthRouter>
      <Layout style={{ height: '100vh' }}>
        <Layout.Sider
          theme="light"
          style={{
            borderRight: '1px solid #d9d9d9',
          }}
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <div
            className={classNames('shuttle-claw-logo', {
              'is-collapsed': collapsed,
            })}
          >
            <img className="shuttle-claw-logo-image" src="/logo.svg" />
            <span className="shuttle-claw-logo-text">shuttle claw</span>
          </div>
          <Menu
            theme="light"
            items={menuItems}
            selectedKeys={selectedKeys}
            onSelect={(e) => setSelectedKeys([e.key])}
          />
        </Layout.Sider>

        <Layout>
          <Layout.Header
            style={{
              backgroundColor: 'white',
              borderBottom: '1px solid #d9d9d9',
              paddingLeft: 0,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </Layout.Header>
          <Layout.Content style={{ padding: 20, backgroundColor: 'white' }}>
            {content}
          </Layout.Content>
        </Layout>
      </Layout>
    </AuthRouter>
  )
}
