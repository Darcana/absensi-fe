import axios from 'axios'

const employeeApi = axios.create({
  baseURL: 'http://localhost:3001'
})

export const login = async (email: string, password: string) => {
  const response = await employeeApi.post('/employee/login', { email, password })
  return response.data
}