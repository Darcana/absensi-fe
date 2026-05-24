import { employeeApi } from './api';

export const allEmployee = async () => {
  const response = await employeeApi.get('/employee')
  return response.data
}

export const getEmployee = async (id: string) => {
  const response = await employeeApi.get(`/employee/${id}`)
  return response.data
}

export const updateEmployee = async (id: string, data: any) => {
  const response = await employeeApi.patch(`/employee/${id}`, data)
  return response.data
}

export const register = async (name: string, email: string, password: string) => {
  const response = await employeeApi.post('/employee/register', { name, email, password })
  return response.data
}
