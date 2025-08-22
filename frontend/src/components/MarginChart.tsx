
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { MarginRow } from '@/types'

interface MarginChartProps {
  data: MarginRow[]
}

export default function MarginChart({ data }: MarginChartProps) {
  // TODO: Implement chart data transformation
  // - Format data for Recharts
  // - Handle empty data sets
  // - Add data validation
  // - Implement responsive design
  
  const chartData = data.map((row) => ({
    name: row.projectName,
    'Gross Margin %': row.grossMarginPercentage,
    'Total Hours': row.totalHours,
    'Budget (SOW)': row.budget,
  }))

  // TODO: Add chart customization options
  // - Color schemes
  // - Chart types (bar, line, area)
  // - Interactive features
  // - Export functionality

  return (
    <div className="space-y-4">
      {/* Chart Title and Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Project Margin Analysis</h3>
        
        {/* TODO: Add chart controls */}
        {/* - Chart type selector */}
        {/* - Data filtering options */}
        {/* - Export button */}
        {/* - Refresh button */}
      </div>

      {/* Chart Container */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                typeof value === 'number' ? 
                  (name === 'Gross Margin %' ? `${value.toFixed(2)}%` : 
                   name === 'Budget (SOW)' ? `$${value.toLocaleString()}` : 
                   value.toLocaleString()) : value,
                name
              ]}
            />
            <Legend />
            <Bar dataKey="Gross Margin %" fill="#10B981" />
            <Bar dataKey="Total Hours" fill="#3B82F6" />
            <Bar dataKey="Budget (SOW)" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {data.length}
          </div>
          <div className="text-sm text-gray-500">Total Projects</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {(data.reduce((sum, row) => sum + row.grossMarginPercentage, 0) / data.length).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500">Avg Margin %</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            ${data.reduce((sum, row) => sum + row.budget, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Total Budget</div>
        </div>
      </div>

      {/* TODO: Add chart interaction features */}
      {/* - Click to drill down */}
      {/* - Hover tooltips with detailed info */}
      {/* - Zoom and pan capabilities */}
      {/* - Data point highlighting */}
    </div>
  )
} 