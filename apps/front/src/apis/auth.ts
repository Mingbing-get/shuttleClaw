import { API_BASE_URL } from './config'

export const authApi = {
  check: async (apiKey: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user': '',
      },
      body: JSON.stringify({ apiKey }),
    })

    const result = await response.json()
    const token = response.headers.get('x-user')

    if (result.code === 200 && token) {
      localStorage.setItem('token', token)
    }

    return result
  },
}
