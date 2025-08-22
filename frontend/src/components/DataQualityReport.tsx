
import { ValidationReport } from '@/types'

interface DataQualityReportProps {
  report: ValidationReport
}

export default function DataQualityReport({ report }: DataQualityReportProps) {
  const totalFiles = report.total_files
  const totalValidRows = report.total_valid_rows
  const totalInvalidRows = report.total_invalid_rows
  const hasErrors = report.has_errors

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Data Quality Report
      </h3>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{totalFiles}</div>
          <div className="text-sm text-gray-500">Files Processed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{totalValidRows}</div>
          <div className="text-sm text-gray-500">Valid Rows</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{totalInvalidRows}</div>
          <div className="text-sm text-gray-500">Invalid Rows</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${hasErrors ? 'text-red-600' : 'text-green-600'}`}>
            {hasErrors ? 'Issues Found' : 'No Issues'}
          </div>
          <div className="text-sm text-gray-500">Status</div>
        </div>
      </div>

      {/* File Details */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">File Details</h4>
        {report.uploads.map((upload, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-gray-900">{upload.filename}</h5>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                upload.invalid_rows > 0 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {upload.invalid_rows > 0 ? 'Has Issues' : 'Valid'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Type:</span>
                <span className="ml-2 font-medium">{upload.file_type}</span>
              </div>
              <div>
                <span className="text-gray-500">Total Rows:</span>
                <span className="ml-2 font-medium">{upload.total_rows}</span>
              </div>
              <div>
                <span className="text-gray-500">Valid:</span>
                <span className="ml-2 font-medium text-green-600">{upload.valid_rows}</span>
              </div>
              <div>
                <span className="text-gray-500">Invalid:</span>
                <span className="ml-2 font-medium text-red-600">{upload.invalid_rows}</span>
              </div>
            </div>

            {/* Validation Issues */}
            {upload.validation_issues.length > 0 && (
              <div className="mt-4">
                <h6 className="font-medium text-gray-900 mb-2">Validation Issues:</h6>
                <div className="space-y-2">
                  {upload.validation_issues.map((issue, issueIndex) => (
                    <div key={issueIndex} className="bg-red-50 border-l-4 border-red-400 p-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-800">
                            <span className="font-medium">Row {issue.row}</span>
                            {issue.column && (
                              <span className="ml-2">• Column: <span className="font-medium">{issue.column}</span></span>
                            )}
                            {issue.value && (
                              <span className="ml-2">• Value: <span className="font-medium">{issue.value}</span></span>
                            )}
                          </p>
                          <p className="text-sm text-red-700 mt-1">{issue.error}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overall Status */}
      <div className={`mt-6 p-4 rounded-lg ${
        hasErrors ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
      }`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {hasErrors ? (
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM16.707 7.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L9 12.586l5.293-5.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3">
            <h3 className={`text-sm font-medium ${
              hasErrors ? 'text-red-800' : 'text-green-800'
            }`}>
              {hasErrors 
                ? 'Validation Issues Found' 
                : 'All Files Validated Successfully'
              }
            </h3>
            <div className={`mt-2 text-sm ${
              hasErrors ? 'text-red-700' : 'text-green-700'
            }`}>
              {hasErrors 
                ? `Found ${totalInvalidRows} invalid rows across ${totalFiles} files. Please fix the issues before proceeding.`
                : `All ${totalValidRows} rows across ${totalFiles} files are valid and ready for ingestion.`
              }
            </div>
          </div>
        </div>
      </div>

      {/* TODO: Add export functionality for validation report */}
      {/* TODO: Add detailed issue filtering and search */}
      {/* TODO: Add issue resolution tracking */}
    </div>
  )
} 