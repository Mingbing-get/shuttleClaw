import { useState } from 'react'
import { Input, Button } from 'antd'

import { TOKEN_KEY } from '../config/const'
import { authApi } from '../apis/auth'

export default function AuthRouter({
  children,
}: {
  children: React.ReactNode
}) {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY))
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuthCheck = async () => {
    setLoading(true)
    try {
      await authApi.check(apiKey)
      window.location.reload()
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div
        style={{
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          maxWidth: 'calc(100vw - 40px)',
          width: 420,
          padding: 20,
          borderRadius: 8,
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <Input.Password
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <Button type="primary" onClick={handleAuthCheck} loading={loading}>
          验证
        </Button>
      </div>
    )
  }
  return children
}
