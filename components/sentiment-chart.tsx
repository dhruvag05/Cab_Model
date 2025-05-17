"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface SentimentChartProps {
  data: Array<{
    time: string
    score: number
    speaker: string
  }>
}

export function SentimentChart({ data }: SentimentChartProps) {
  // Format data for the chart
  const chartData = data.map((item) => ({
    time: item.time,
    score: item.score,
    speaker: item.speaker,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={[0, 100]} label={{ value: "Sentiment Score", angle: -90, position: "insideLeft" }} />
        <Tooltip
          formatter={(value: number) => [`${value}%`, "Sentiment"]}
          labelFormatter={(label) => `Time: ${label}`}
          contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "6px" }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#10b981"
          activeDot={{ r: 8 }}
          strokeWidth={2}
          name="Sentiment Score"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
