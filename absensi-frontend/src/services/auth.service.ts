import { employeeApi } from './api';

export const login = async (email: string, password: string) => {
  const response = await employeeApi.post('/employee/login', { email, password })
  return response.data
}