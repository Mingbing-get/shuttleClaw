import SnowFlake from '../utils/snowFlake'
import dotenv from 'dotenv'

dotenv.config()

const snowFlake = new SnowFlake(
  Number(process.env.SNOWFLAKE_WORKER_ID),
  new Date(process.env.SNOWFLAKE_START_DATE || '2026-01-01').getTime(),
)

export default snowFlake
