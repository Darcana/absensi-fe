import axios from 'axios'

const getToken = () => localStorage.getItem('token')

export const employeeApi = axios.create({
  baseURL: 'http://localhost:3001'
})

export const attendanceApi = axios.create({
  baseURL: 'http://localhost:3000'
})

// add token to every request
employeeApi.interceptors.request.use(config => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

attendanceApi.interceptors.request.use(config => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// redirect to login if 401
employeeApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('employee')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

attendanceApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('employee')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)