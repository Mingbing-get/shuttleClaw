import dotenv from 'dotenv'
import { Knex } from 'knex'

import db from '../config/db'
import {
  MODEL_TABLE_NAME,
  AGENT_TABLE_NAME,
  SKILL_TABLE_NAME,
  MCP_TABLE_NAME,
  MESSAGE_TABLE_NAME,
} from '../config/consts'

dotenv.config()

export async function initDb() {
  await initModelTable()
  await initAgentTable()
  await initSkillTable()
  await initMCPTable()
  await initMessageTable()
}

async function initModelTable() {
  await syncTable({
    tableName: MODEL_TABLE_NAME,
    fieldMap: {
      id: (table) => table.string('id').primary(),
      url: (table) => table.string('url').notNullable(),
      model: (table) => table.string('model').notNullable(),
      apiKey: (table) => table.string('apiKey').notNullable(),
      createdAt: (table) => table.dateTime('createdAt').notNullable(),
      updatedAt: (table) => table.dateTime('updatedAt').notNullable(),
    },
  })
}

async function initAgentTable() {
  await syncTable({
    tableName: AGENT_TABLE_NAME,
    fieldMap: {
      id: (table) => table.string('id').primary(),
      modelId: (table) => table.string('modelId').notNullable(),
      name: (table) => table.string('name', 20).unique().notNullable(),
      describe: (table) => table.string('describe').notNullable(),
      parentId: (table) => table.string('parentId'),
      isLazy: (table) => table.boolean('isLazy').notNullable().defaultTo(false),
      enabled: (table) =>
        table.boolean('enabled').notNullable().defaultTo(true),
      createdAt: (table) => table.dateTime('createdAt').notNullable(),
      updatedAt: (table) => table.dateTime('updatedAt').notNullable(),
    },
  })
}

async function initSkillTable() {
  await syncTable({
    tableName: SKILL_TABLE_NAME,
    fieldMap: {
      id: (table) => table.string('id').primary(),
      agentId: (table) => table.string('agentId').notNullable(),
      skillName: (table) => table.string('skillName').notNullable(),
      describe: (table) => table.text('describe'),
      envDefine: (table) => table.json('envDefine'),
      env: (table) => table.json('env'),
      enabled: (table) =>
        table.boolean('enabled').notNullable().defaultTo(true),
      createdAt: (table) => table.dateTime('createdAt').notNullable(),
      updatedAt: (table) => table.dateTime('updatedAt').notNullable(),
    },
  })
}

async function initMCPTable() {
  await syncTable({
    tableName: MCP_TABLE_NAME,
    fieldMap: {
      id: (table) => table.string('id').primary(),
      agentId: (table) => table.string('agentId').notNullable(),
      config: (table) => table.json('config').notNullable(),
      env: (table) => table.json('env'),
      enabled: (table) =>
        table.boolean('enabled').notNullable().defaultTo(true),
      createdAt: (table) => table.dateTime('createdAt').notNullable(),
      updatedAt: (table) => table.dateTime('updatedAt').notNullable(),
    },
  })
}

async function initMessageTable() {
  await syncTable({
    tableName: MESSAGE_TABLE_NAME,
    fieldMap: {
      id: (table) => table.string('id').primary(),
      role: (table) => table.string('role', 20).notNullable(),
      workId: (table) => table.string('workId').notNullable(),
      runAgentId: (table) => table.string('runAgentId').notNullable(),
      extra: (table) => table.json('extra').notNullable(),
      createdAt: (table) => table.dateTime('createdAt').notNullable(),
    },
  })
}

interface Options {
  tableName: string
  fieldMap: Record<
    string,
    (table: Knex.CreateTableBuilder) => Knex.ColumnBuilder
  >
}
async function syncTable({ tableName, fieldMap }: Options) {
  const hasTable = await db.schema.hasTable(tableName)
  if (!hasTable) {
    await db.schema.createTable(tableName, (table) => {
      Object.entries(fieldMap).forEach(([fieldName, fieldBuilder]) => {
        fieldBuilder(table)
      })
    })
  } else {
    const result = await db.raw(`SHOW COLUMNS FROM \`${tableName}\``)
    const columnNames: string[] = result[0].map((item: any) => item.Field)

    await db.schema.alterTable(tableName, (table) => {
      Object.entries(fieldMap).forEach(([fieldName, fieldBuilder]) => {
        if (!columnNames.includes(fieldName)) {
          fieldBuilder(table)
        }
      })

      columnNames.forEach((columnName) => {
        if (!Object.keys(fieldMap).includes(columnName)) {
          table.dropColumn(columnName)
        }
      })
    })
  }
}
