export default class SnowFlake {
  static MAX_SEQUENCE_AND = 4095 // 每秒可生成4096个ID，占12位

  private workerId: number
  private startTimestamp: number
  private lastTimeStamp = -1
  private sequence = 0

  constructor(workerId: number, startTimestamp: number) {
    // 机器ID占10位，最大1023，支持部署1024个节点
    if (workerId < 0 || workerId > 1023) {
      throw new Error('机器ID只能在0-1023之间（包含0和1023）')
    }

    if (startTimestamp >= Date.now()) {
      throw new Error('开始时间必须小于当前时间')
    }

    this.workerId = workerId
    this.startTimestamp = startTimestamp
  }

  next() {
    let timestamp = Date.now()

    if (timestamp < this.lastTimeStamp) {
      timestamp = this.waitToAfterLastTime()
      this.sequence = 0
    } else if (timestamp === this.lastTimeStamp) {
      this.sequence = (this.sequence + 1) & SnowFlake.MAX_SEQUENCE_AND

      if (this.sequence === 0) {
        timestamp = this.waitToAfterLastTime()
      }
    } else {
      this.sequence = 0
    }

    this.lastTimeStamp = timestamp

    return (
      (BigInt(timestamp - this.startTimestamp) << BigInt(22)) |
      (BigInt(this.workerId) << BigInt(12)) |
      BigInt(this.sequence)
    ).toString()
  }

  private waitToAfterLastTime() {
    let timestamp = Date.now()

    while (timestamp <= this.lastTimeStamp) {
      timestamp = Date.now()
    }

    return timestamp
  }
}
