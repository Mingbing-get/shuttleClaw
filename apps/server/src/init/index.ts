import { initDb } from './db'

export default async function init() {
  // 初始化数据库
  await initDb()
}
