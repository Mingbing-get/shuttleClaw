import { HttpTransporter } from '@shuttle-ai/client'

import { TOKEN_KEY, AGENT_ID_KEY } from './const'
import { API_BASE_URL } from '../apis/config'

const transporter = new HttpTransporter({
  baseUrl: `${API_BASE_URL}/ai`,
  requestHeaders: {
    'content-type': 'application/json',
    'x-user': localStorage.getItem(TOKEN_KEY) || '',
  },
  revokeMessage: {
    afterSend: async (response) => {
      response.data = response.data.data
    },
  },
  invoke: {
    async beforeSend(data) {
      return {
        ...data,
        mainAgentId: localStorage.getItem(AGENT_ID_KEY),
      }
    },
  },
})

export default transporter
