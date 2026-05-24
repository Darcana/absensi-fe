import { attendanceApi } from './api';

export const checkIn = async (employeeId: number, photo: File) => {
  const formData = new FormData()
  formData.append('employeeId', employeeId.toString())
  formData.append('photo', photo)
  const response = await attendanceApi.post('/attendance/checkin', formData)
  return response.data
}

export const checkOut = async (employeeId: number, photo: File) => {
  const formData = new FormData()
  formData.append('employeeId', employeeId.toString())
  formData.append('photo', photo)
  const response = await attendanceApi.post('/attendance/checkout', formData)
  return response.data
}

export const attendance = async (employeeId: number) => {
  const response = await attendanceApi.get(`/attendance/latest/${employeeId}`)
  return response.data
}

export const allAttendance = async (page: number = 1, limit: number = 10) => {
  const response = await attendanceApi.get(`/attendance?page=${page}&limit=${limit}`)
  return response.data
}

export const specificAttendance = async (employeeId: number) => {
  const response = await attendanceApi.get(`/attendance/${employeeId}`)
  return response.data
}