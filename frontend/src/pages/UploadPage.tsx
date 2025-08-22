import  { useState } from 'react'
import { useMutation } from 'react-query'
import FileDrop from '@/components/FileDrop'
import DataQualityReport from '@/components/DataQualityReport'
import apiService from '@/services/api'
import { ValidationReport } from '@/types'

export default function UploadPage() {
const [timecardFile, setTimecardFile] = useState<File | undefined>(undefined)
const [employeeFile, setEmployeeFile] = useState<File | undefined>(undefined)
const [projectFile, setProjectFile] = useState<File | undefined>(undefined)
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null)

  // TODO: Add file validation
  // TODO: Add file type detection
  // TODO: Add file size validation
  // TODO: Add duplicate file prevention

  const uploadMutation = useMutation({
    mutationFn: () => apiService.uploadFiles(timecardFile, employeeFile, projectFile),
    onSuccess: (data) => {
      setValidationReport(data.data)
      // TODO: Show success notification
    },
    onError: (error) => {
      console.error('Upload failed:', error)
      // TODO: Show error notification
    }
  })

  const ingestMutation = useMutation({
    mutationFn: () => apiService.ingestValidatedData(),
    onSuccess: (_data) => {
      // TODO: Show success notification
      // TODO: Redirect to dashboard or show results
    },
    onError: (error) => {
      console.error('Ingestion failed:', error)
      // TODO: Show error notification
    }
  })

  const handleFileSelect = (file: File, type: 'timecard' | 'employee' | 'project') => {
    // TODO: Implement file type detection
    // TODO: Add file validation
    // TODO: Show file preview
    
    switch (type) {
      case 'timecard':
        setTimecardFile(file)
        break
      case 'employee':
        setEmployeeFile(file)
        break
      case 'project':
        setProjectFile(file)
        break
    }
  }

  const handleUpload = () => {
    if (!timecardFile && !employeeFile && !projectFile) {
      // TODO: Show error - no files selected
      return
    }
    
    uploadMutation.mutate()
  }

  const handleIngest = () => {
    if (!validationReport || validationReport.has_errors) {
      // TODO: Show error - cannot ingest invalid data
      return
    }
    
    ingestMutation.mutate()
  }

  const canUpload = timecardFile || employeeFile || projectFile
  const canIngest = validationReport && !validationReport.has_errors

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Data Files</h1>
        <p className="text-lg text-gray-600">
          Upload your TimeCard, Employee, and Project files for validation and processing
        </p>
      </div>

      {/* File Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TimeCard File */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">TimeCard Data</h3>
          <FileDrop
            onFileSelect={(file) => handleFileSelect(file, 'timecard')}
            acceptedTypes={['.xlsx', '.xls', '.csv']}
            maxSize={10 * 1024 * 1024} // 10MB
          />
          {timecardFile && (
            <div className="text-sm text-gray-600">
              Selected: {timecardFile.name}
            </div>
          )}
        </div>

        {/* Employee File */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Employee Data</h3>
          <FileDrop
            onFileSelect={(file) => handleFileSelect(file, 'employee')}
            acceptedTypes={['.xlsx', '.xls', '.csv']}
            maxSize={10 * 1024 * 1024} // 10MB
          />
          {employeeFile && (
            <div className="text-sm text-gray-600">
              Selected: {employeeFile.name}
            </div>
          )}
        </div>

        {/* Project File */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Project Data</h3>
          <FileDrop
            onFileSelect={(file) => handleFileSelect(file, 'project')}
            acceptedTypes={['.xlsx', '.xls', '.csv']}
            maxSize={10 * 1024 * 1024} // 10MB
          />
          {projectFile && (
            <div className="text-sm text-gray-600">
              Selected: {projectFile.name}
            </div>
          )}
        </div>
      </div>

      {/* Upload Button */}
      <div className="text-center">
        <button
          onClick={handleUpload}
          disabled={!canUpload || uploadMutation.isLoading}
          className={`
            px-8 py-3 text-lg font-medium rounded-lg transition-colors duration-200
            ${canUpload
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
            ${uploadMutation.isLoading ? 'opacity-75 cursor-wait' : ''}
          `}
        >
          {uploadMutation.isLoading ? 'Validating...' : 'Validate Files'}
        </button>
      </div>

      {/* File Requirements */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-4">File Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-blue-900 mb-2">TimeCard File</h4>
            <ul className="text-blue-800 space-y-1">
              <li>• Required columns: EMPLOYEE_ID, EMPLOYEE_NAME, DAILY_DATE, TIME_WORKED, PROJECT_NAME</li>
              <li>• Optional: TIME_CARD_STATE, TASK_TYPE</li>
              <li>• TIME_WORKED: 0.1 to 999.9 hours</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Employee File</h4>
            <ul className="text-blue-800 space-y-1">
              <li>• Required columns: EMPLOYEE_ID, EMPLOYEE_NAME, CTC</li>
              <li>• Optional: CTCPHR</li>
              <li>• CTC values will be encrypted automatically</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Project File</h4>
            <ul className="text-blue-800 space-y-1">
              <li>• Required columns: PROJECT_NAME, SOW</li>
              <li>• Optional: PROJECT_ID</li>
              <li>• SOW: Project budget value</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Validation Report */}
      {validationReport && (
        <div className="space-y-4">
          <DataQualityReport report={validationReport} />
          
          {canIngest && (
            <div className="text-center">
              <button
                onClick={handleIngest}
                disabled={ingestMutation.isLoading}
                className={`
                  px-8 py-3 text-lg font-medium rounded-lg transition-colors duration-200
                  bg-green-600 text-white hover:bg-green-700
                  ${ingestMutation.isLoading ? 'opacity-75 cursor-wait' : ''}
                `}
              >
                {ingestMutation.isLoading ? 'Ingesting...' : 'Ingest Valid Data'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TODO: Add features */}
      {/* - File preview */}
      {/* - File validation feedback */}
      {/* - Upload progress indicators */}
      {/* - Error handling and retry */}
      {/* - File removal */}
      {/* - Batch upload history */}
    </div>
  )
} 