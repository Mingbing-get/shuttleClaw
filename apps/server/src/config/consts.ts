import dotenv from 'dotenv'

dotenv.config()

export const DB_TABLE_PREFIX = process.env.DB_TABLE_PREFIX || ''
export const MODEL_TABLE_NAME = `${DB_TABLE_PREFIX}model`
export const AGENT_TABLE_NAME = `${DB_TABLE_PREFIX}agent`
export const SKILL_TABLE_NAME = `${DB_TABLE_PREFIX}skill`
export const MCP_TABLE_NAME = `${DB_TABLE_PREFIX}mcp`
export const WORK_TABLE_NAME = `${DB_TABLE_PREFIX}work`
export const MESSAGE_TABLE_NAME = `${DB_TABLE_PREFIX}message`

export const AGENT_DIR = '.agents'
export const SKILL_DIR = 'skills'
