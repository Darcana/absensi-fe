export const useAuth = () => {
  const employee = localStorage.getItem('employee')
  if (!employee) return null
  return JSON.parse(employee)
}