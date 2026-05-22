import axios from 'axios'

const employeeApi = axios.create({
  baseURL: 'http://localhost:3001'
})

export const allEmployee = async () => {
  const response = await employeeApi.get('/employee')
  return response.data
}

export const getEmployee = async (id: number) => {
  const response = await employeeApi.get(`/employee/${id}`)
  return response.data
}

export const updateEmployee = async (id: number, data: any) => {
  const response = await employeeApi.patch(`/employee/${id}`, data)
  return response.data
}