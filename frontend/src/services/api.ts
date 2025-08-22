import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { 
  ApiResponse, 
  ValidationReport,
  MarginRow, 
  MarginSummary,
  AskRequest, 
  AskResponse 
} from '@/types'

// TODO: Move to environment variables
// ...existing code...
// ...existing code...
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
// ...existing code...
class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: BACKEND_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor for auth tokens
    this.api.interceptors.request.use(
      (config) => {
        // TODO: Add JWT token to headers
        // - Get token from localStorage or auth context
        // - Add Authorization header
        // - Handle token refresh if needed
        
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        // TODO: Handle global errors
        // - 401: Redirect to login
        // - 403: Show access denied
        // - 500: Show server error
        // - Network errors: Show offline message
        
        if (error.response?.status === 401) {
          // Redirect to login
          localStorage.removeItem('auth_token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // File Upload APIs
  async uploadFiles(
    timecardFile?: File,
    employeeFile?: File,
    projectFile?: File
  ): Promise<ApiResponse<ValidationReport>> {
    // TODO: Implement file upload
    // - Create FormData with files
    // - Add proper error handling
    // - Show upload progress
    // - Handle file validation errors
    
    const formData = new FormData()
    
    if (timecardFile) {
      formData.append('timecard_file', timecardFile)
    }
    if (employeeFile) {
      formData.append('employee_file', employeeFile)
    }
    if (projectFile) {
      formData.append('project_file', projectFile)
    }
    
    try {
      const response = await this.api.post('/api/v1/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    } catch (error) {
      // TODO: Better error handling
      console.error('Upload failed:', error)
      throw error
    }
  }

  async ingestValidatedData(): Promise<ApiResponse<any>> {
    // TODO: Implement data ingestion
    // - Call ingest endpoint
    // - Handle ingestion errors
    // - Show progress feedback
    
    try {
      const response = await this.api.post('/api/v1/ingest')
      return response.data
    } catch (error) {
      console.error('Ingestion failed:', error)
      throw error
    }
  }

  // Margin APIs
  async fetchMargins(): Promise<ApiResponse<MarginRow[]>> {
    // TODO: Implement margin data fetching
    // - Call margins endpoint
    // - Handle data formatting
    // - Add caching if needed
    
    try {
      const response = await this.api.get('/api/v1/margins')
      return response.data
    } catch (error) {
      console.error('Failed to fetch margins:', error)
      throw error
    }
  }

  async fetchMarginSummary(): Promise<ApiResponse<MarginSummary>> {
    // TODO: Implement margin summary fetching
    // - Call summary endpoint
    // - Handle summary calculations
    // - Add error handling
    
    try {
      const response = await this.api.get('/api/v1/margins/summary')
      return response.data
    } catch (error) {
      console.error('Failed to fetch margin summary:', error)
      throw error
    }
  }

  async fetchProjects(): Promise<ApiResponse<any[]>> {
    // TODO: Implement projects fetching
    // - Call projects endpoint
    // - Handle project data
    // - Add filtering options
    
    try {
      const response = await this.api.get('/api/v1/projects')
      return response.data
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      throw error
    }
  }

  // AI APIs
  async askAI(request: AskRequest): Promise<ApiResponse<AskResponse>> {
    // TODO: Implement AI question processing
    // - Call ask endpoint
   // - Handle AI responses
    // - Add error handling for AI failures
    // - Show processing feedback
    
    try {
      const response = await this.api.post('/api/v1/ask', request)
      return response.data
    } catch (error) {
      console.error('AI request failed:', error)
      throw error
    }
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<any>> {
    // TODO: Implement health check
    // - Call health endpoint
    // - Monitor API status
    // - Handle health check failures
    
    try {
      const response = await this.api.get('/api/v1/health')
      return response.data
    } catch (error) {
      console.error('Health check failed:', error)
      throw error
    }
  }

  // Utility Methods
  getBackendUrl(): string {
    return BACKEND_URL
  }

  isOnline(): boolean {
    // TODO: Implement online status check
    // - Check network connectivity
    // - Monitor API availability
    // - Return connection status
    
    return navigator.onLine
  }

  // TODO: Add more utility methods
  // - Token management
  // - Request retry logic
  // - Offline support
  // - Request caching
}

export const apiService = new ApiService()
export default apiService 