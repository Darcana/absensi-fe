import { attendanceApi } from './api';

export const checkIn = async (employeeId: string, photo: File) => {
  const formData = new FormData()
  formData.append('employeeId', employeeId.toString())
  formData.append('photo', photo)
  const response = await attendanceApi.post('/attendance/checkin', formData)
  return response.data
}

export const checkOut = async (employeeId: string, photo: File) => {
  const formData = new FormData()
  formData.append('employeeId', employeeId.toString())
  formData.append('photo', photo)
  const response = await attendanceApi.post('/attendance/checkout', formData)
  return response.data
}

export const attendance = async (employeeId: string) => {
  const response = await attendanceApi.get(`/attendance/latest/${employeeId}`)
  return response.data
}

export const allAttendance = async (page: number = 1, limit: number = 10) => {
  const response = await attendanceApi.get(`/attendance?page=${page}&limit=${limit}`)
  return response.data
}

export const specificAttendance = async (employeeId: string) => {
  const response = await attendanceApi.get(`/attendance/${employeeId}`)
  return response.data
}

export const specificAttendanceFiltered = async (employeeId: string, page: number = 1, limit: number = 10) => {
  const response = await attendanceApi.get(`/attendance/filtered/${employeeId}?page=${page}&limit=${limit}`)
  return response.data
}