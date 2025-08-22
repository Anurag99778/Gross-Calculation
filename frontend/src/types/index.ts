// API Response wrapper
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// File Upload Types
export interface ValidationIssue {
  row: number
  column: string
  value: string | null
  error: string
}

export interface UploadResult {
  filename: string
  file_type: string
  total_rows: number
  valid_rows: number
  invalid_rows: number
  validation_issues: ValidationIssue[]
}

export interface ValidationReport {
  uploads: UploadResult[]
  total_files: number
  total_valid_rows: number
  total_invalid_rows: number
  has_errors: boolean
}

// Margin Types
export interface MarginRow {
  projectName: string
  totalHours: number
  budget: number
  grossMarginPercentage: number
}

export interface MarginSummary {
  totalProjects: number
  totalHours: number
  totalBudget: number
  averageMarginPercentage: number
}

export interface MarginFilter {
  project_name?: string
  min_margin?: number
  max_margin?: number
  min_hours?: number
  max_hours?: number
}

// AI Types
export interface AskRequest {
  question: string
  context?: string
}

export interface AskResponse {
  question: string
  sql_query: string
  explanation: string
  results: any[]
  row_count: number
  security_note: string
}

// Legacy Types (for backward compatibility)
export type FileUpload = 'timecard' | 'employee' | 'project'

export interface TimeCard {
  employeeId: string
  employeeName: string
  dailyDate: string
  timeWorked: number
  projectName: string
  timeCardState?: string
  taskType?: string
}

export interface Employee {
  employeeId: string
  employeeName: string
  ctc: number
  ctcphr?: number
}

export interface Project {
  projectId?: number
  projectName: string
  sow: number
}

// TODO: Add more types as needed
// - User authentication
// - Settings and preferences
// - Audit logs
// - Notifications
// - Error types 