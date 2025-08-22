import  { useState } from 'react'
import { useQuery } from 'react-query'
import MarginChart from '@/components/MarginChart'
import Table from '@/components/Table'
import apiService from '@/services/api'
import { MarginRow } from '@/types'

export default function DashboardPage() {
  
const [sortBy, setSortBy] = useState<keyof MarginRow>('grossMarginPercentage')
const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  // TODO: Add filtering options
  // TODO: Add date range selection
  // TODO: Add project search
  // TODO: Add margin range filters

  // Fetch margin data
  const { data: marginData, isLoading: marginsLoading, error: marginsError } = useQuery({
    queryKey: ['margins'],
    queryFn: () => apiService.fetchMargins(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Fetch margin summary
  const { data: marginSummary, error: summaryError } = useQuery({
    queryKey: ['marginSummary'],
    queryFn: () => apiService.fetchMarginSummary(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const handleSort = (key: keyof MarginRow) => {
    if (sortBy === key) {
     setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(key)
      setSortOrder('asc')
    }
  }

  // TODO: Implement data sorting
  // TODO: Add data filtering
  // TODO: Add data export
  // TODO: Add refresh functionality

  const sortedData = marginData?.data || []
  const summary = marginSummary?.data

  // Table columns configuration
  const columns = [
    {
      key: 'projectName' as keyof MarginRow,
      header: 'Project Name',
      sortable: true,
    },
    {
      key: 'totalHours' as keyof MarginRow,
      header: 'Total Hours',
      sortable: true,
      render: (value: number) => value.toLocaleString(),
    },
    {
      key: 'budget' as keyof MarginRow,
      header: 'Budget (SOW)',
      sortable: true,
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'grossMarginPercentage' as keyof MarginRow,
      header: 'Gross Margin %',
      sortable: true,
      render: (value: number) => `${value.toFixed(2)}%`,
    },
  ]

  if (marginsError || summaryError) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
        <p className="text-gray-500">
         {(marginsError as any)?.message || (summaryError as any)?.message || 'Failed to load dashboard data'}
        </p>
        {/* TODO: Add retry button */}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Gross Margin Dashboard</h1>
        <p className="text-lg text-gray-600">
          Monitor project profitability and performance metrics
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {summary?.totalProjects || 0}
          </div>
          <div className="text-sm text-gray-500">Total Projects</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-green-600">
            {summary?.totalHours?.toLocaleString() || 0}
          </div>
          <div className="text-sm text-gray-500">Total Hours</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-orange-600">
            ${summary?.totalBudget?.toLocaleString() || 0}
          </div>
          <div className="text-sm text-gray-500">Total Budget</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {summary?.averageMarginPercentage?.toFixed(1) || 0}%
          </div>
          <div className="text-sm text-gray-500">Avg Margin %</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Margin Analysis Chart</h2>
        {marginsLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-gray-500">Loading chart data...</div>
          </div>
        ) : (
          <MarginChart data={sortedData} />
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Project Details</h2>
          
          {/* TODO: Add table controls */}
          {/* - Export button */}
          {/* - Filter options */}
          {/* - Refresh button */}
          {/* - View options */}
        </div>

        {marginsLoading ? (
          <div className="py-12 text-center">
            <div className="text-gray-500">Loading project data...</div>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-500">
              Upload data files to see project margin analysis
            </p>
          </div>
        ) : (
          <Table
            data={sortedData}
            columns={columns}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        )}
      </div>

      {/* TODO: Add features */}
      {/* - Data refresh controls */}
      {/* - Export functionality */}
      {/* - Advanced filtering */}
      {/* - Date range selection */}
      {/* - Project search */}
      {/* - Margin trend analysis */}
      {/* - Performance metrics */}
    </div>
  )
} 