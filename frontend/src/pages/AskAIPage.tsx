import React, { useState } from 'react'
import { useMutation } from 'react-query'
import Table from '@/components/Table'
import apiService from '@/services/api'
import { AskRequest, AskResponse } from '@/types'

export default function AskAIPage() {
  const [question, setQuestion] = useState('')
  const [lastResponse, setLastResponse] = useState<AskResponse | null>(null)

  // TODO: Add question history
  // TODO: Add question templates
  // TODO: Add question validation
  // TODO: Add response caching

  const askMutation = useMutation({
    mutationFn: (request: AskRequest) => apiService.askAI(request),
    onSuccess: (data) => {
      setLastResponse(data.data)
      // TODO: Show success notification
    },
    onError: (error) => {
      console.error('AI request failed:', error)
      // TODO: Show error notification
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    askMutation.mutate({ question: question.trim() })
  }

  const copyToClipboard = (text: string, _type: 'sql' | 'results') => {
    navigator.clipboard.writeText(text).then(() => {
      // TODO: Show copy success notification
    }).catch(() => {
      // TODO: Show copy error notification
    })
  }

  // TODO: Implement results table columns
  // TODO: Add data formatting
  // TODO: Add export functionality

  const resultsColumns = lastResponse?.results && lastResponse.results.length > 0 ? 
    Object.keys(lastResponse.results[0]).map(key => ({
      key,
      header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      sortable: true,
    })) : []

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Ask AI Assistant</h1>
        <p className="text-lg text-gray-600">
          Ask natural language questions about your data and get SQL insights
        </p>
      </div>

      {/* Question Input Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
              What would you like to know about your data?
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., What is the average gross margin for projects with more than 100 hours?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              disabled={askMutation.isLoading}
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={!question.trim() || askMutation.isLoading}
              className={`
                px-6 py-2 text-sm font-medium rounded-md transition-colors duration-200
                ${question.trim() && !askMutation.isLoading
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {askMutation.isLoading ? 'Processing...' : 'Ask AI'}
            </button>

            {/* Example Questions */}
            <div className="text-sm text-gray-500">
              <span className="font-medium">Examples:</span>
              <button
                type="button"
                onClick={() => setQuestion("What is the average gross margin?")}
                className="ml-2 text-blue-600 hover:text-blue-800 underline"
              >
                Average margin
              </button>
              <span className="mx-2">•</span>
              <button
                type="button"
                onClick={() => setQuestion("Which projects have the highest hours?")}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Top projects
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* AI Response */}
      {lastResponse && (
        <div className="space-y-6">
          {/* Generated SQL Query */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Generated SQL Query</h3>
              <button
                onClick={() => copyToClipboard(lastResponse.sql_query, 'sql')}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Copy SQL
              </button>
            </div>
            <div className="bg-gray-50 border rounded-md p-4 font-mono text-sm overflow-x-auto">
              {lastResponse.sql_query}
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Explanation</h3>
            <p className="text-gray-700">{lastResponse.explanation}</p>
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Results ({lastResponse.row_count} rows)
              </h3>
              {lastResponse.results && lastResponse.results.length > 0 && (
                <button
                  onClick={() => copyToClipboard(JSON.stringify(lastResponse.results, null, 2), 'results')}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Copy Results
                </button>
              )}
            </div>

            {lastResponse.results && lastResponse.results.length > 0 ? (
              <Table
                data={lastResponse.results}
                columns={resultsColumns}
                className="mt-4"
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No results returned
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Security Notice</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  {lastResponse.security_note}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TODO: Add features */}
      {/* - Question history */}
      {/* - Question templates */}
      {/* - Response export */}
      {/* - SQL query validation */}
      {/* - Result visualization */}
      {/* - Query optimization suggestions */}
      {/* - Usage analytics */}
    </div>
  )
} 