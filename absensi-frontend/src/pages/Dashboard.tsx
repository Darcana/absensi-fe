import { Outlet, Navigate } from 'react-router-dom'
import BottomTabs from '../components/BottomTabs'
import { useAuth } from '../hooks/useAuth'

function Dashboard() {
  const employee = useAuth()
  if (!employee) return <Navigate to="/" />

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <div className="bg-blue-600 text-white p-4">
        <p className="text-sm">Welcome,</p>
        <p className="font-bold">{employee.name}</p>
      </div>
      <div className="p-4">
        <Outlet />
      </div>
      <BottomTabs />
    </div>
  )
}

export default Dashboard