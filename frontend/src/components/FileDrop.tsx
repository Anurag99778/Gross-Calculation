import  { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileDropProps {
  onFileSelect: (file: File) => void
  acceptedTypes: string[]
  maxSize?: number
  multiple?: boolean
  disabled?: boolean
}

export default function FileDrop({
  onFileSelect,
  acceptedTypes,
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
  disabled = false
}: FileDropProps) {
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // TODO: Implement file validation
    // - Check file size limits
    // - Validate file types
    // - Handle multiple files if enabled
    // - Call onFileSelect for each valid file
    
    acceptedFiles.forEach(file => {
      onFileSelect(file)
    })
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    maxSize,
    multiple,
    disabled
  })

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200
        ${isDragActive || dragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onDragEnter={() => setDragActive(true)}
      onDragLeave={() => setDragActive(false)}
    >
      <input {...getInputProps()} />
      
      <div className="space-y-4">
        {/* Icon */}
        <div className="text-4xl">
          {isDragActive ? '📁' : '📄'}
        </div>
        
        {/* Text */}
        <div>
          {isDragActive ? (
            <p className="text-blue-600 font-medium">Drop files here</p>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-600">
                Drag and drop files here, or <span className="text-blue-600">click to browse</span>
              </p>
              <p className="text-sm text-gray-500">
                Accepted types: {acceptedTypes.join(', ')}
              </p>
              <p className="text-sm text-gray-500">
                Max size: {(maxSize / (1024 * 1024)).toFixed(1)}MB
              </p>
            </div>
          )}
        </div>
        
        {/* TODO: Add file validation feedback */}
        {/* TODO: Show selected file names */}
        {/* TODO: Add file removal functionality */}
      </div>
    </div>
  )
} 