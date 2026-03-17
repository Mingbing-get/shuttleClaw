import { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Spin } from 'antd'
import { Line } from '@ant-design/plots'
import { dashboardApi } from '../../apis'
import './index.scss'

interface TodayStats {
  totalInputTokens: number
  totalOutputTokens: number
  requestCount: number
}

interface MonthlyStats {
  dates: string[]
  agents: string[]
  data: Record<string, Record<string, number>>
}

export default function DashBoard() {
  const [todayStats, setTodayStats] = useState<TodayStats | null>(null)
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [todayResponse, monthlyResponse] = await Promise.all([
          dashboardApi.getTodayStats(),
          dashboardApi.getMonthlyStats(),
        ])

        setTodayStats(todayResponse.data || null)
        setMonthlyStats(monthlyResponse.data || null)
      } catch (error) {
        console.error('获取看板数据失败', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(2) + '万'
    }
    return num.toLocaleString()
  }

  const getChartData = () => {
    if (!monthlyStats) return []

    const { dates, agents, data } = monthlyStats
    const chartData: Array<{ date: string; agent: string; tokens: number }> = []

    dates.forEach((date) => {
      agents.forEach((agent) => {
        chartData.push({
          date,
          agent,
          tokens: data[agent]?.[date] || 0,
        })
      })
    })

    return chartData
  }

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="dashboard">
      <Card title="今日统计" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Statistic
              title="输入Token"
              value={todayStats?.totalInputTokens || 0}
              formatter={(value) => formatNumber(Number(value))}
              valueStyle={{ color: '#3f8600' }}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Statistic
              title="输出Token"
              value={todayStats?.totalOutputTokens || 0}
              formatter={(value) => formatNumber(Number(value))}
              valueStyle={{ color: '#cf1322' }}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Statistic
              title="请求次数"
              value={todayStats?.requestCount || 0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
        </Row>
      </Card>

      <Card title="月度Agent用量统计">
        <Line
          data={getChartData()}
          xField="date"
          yField="tokens"
          seriesField="agent"
          smooth
          animation={{
            appear: {
              animation: 'path-in',
              duration: 1000,
            },
          }}
          height={320}
          xAxis={{
            title: {
              text: '日期',
            },
          }}
          yAxis={{
            title: {
              text: 'Token数量',
            },
          }}
          legend={{
            position: 'top',
          }}
          tooltip={{
            formatter: (datum: any) => {
              return {
                name: datum.agent,
                value: `${datum.tokens.toLocaleString()} tokens`,
              }
            },
          }}
        />
      </Card>
    </div>
  )
}
