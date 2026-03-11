import { ShuttleAi } from '@shuttle-ai/type'

import db from '../../../db'
import { MESSAGE_TABLE_NAME } from '../../../consts'
import { Table } from '../../../types'

export default class MessageCollector
  implements ShuttleAi.Cluster.MessageCollector
{
  async saveMessage(message: ShuttleAi.Message.Define) {
    const { workId, agentId, id, role, ...extra } = message

    await db<Table.Message>(MESSAGE_TABLE_NAME).insert({
      workId,
      runAgentId: agentId,
      id,
      role,
      extra: extra,
      createdAt: new Date() as any,
    })
  }

  async getMessagesByAgentId(
    workId: string,
    agentId: string,
  ): Promise<ShuttleAi.Message.Define[]> {
    const messages = await db<Table.Message>(MESSAGE_TABLE_NAME)
      .where({ workId, runAgentId: agentId })
      .orderBy('createdAt', 'asc')

    return messages.map(
      (message) =>
        ({
          workId: message.workId,
          agentId: message.runAgentId,
          id: message.id,
          role: message.role,
          ...message.extra,
        }) as ShuttleAi.Message.Define,
    )
  }

  async getSubAgentTasks(workId: string, subAgentIds: string[]) {
    const messages = await db<Table.Message>(MESSAGE_TABLE_NAME)
      .where({ workId, role: 'user' })
      .and.whereIn('runAgentId', subAgentIds)
      .orderBy('createdAt', 'asc')

    return messages.map(
      (message) =>
        ({
          workId: message.workId,
          agentId: message.runAgentId,
          id: message.id,
          role: message.role,
          ...message.extra,
        }) as ShuttleAi.Message.Define,
    )
  }
}
