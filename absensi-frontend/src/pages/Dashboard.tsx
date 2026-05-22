import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import BottomTabs from '../components/BottomTabs'
import { useAuth } from '../hooks/useAuth'

function Dashboard() {
  const employee = useAuth()
  const navigate = useNavigate()

  if (!employee) return <Navigate to="/" />

  const handleLogout = () => {
    localStorage.removeItem('employee')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div>
          <p className="text-sm">Welcome,</p>
          <p className="font-bold">{employee.name}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm bg-white text-blue-600 px-3 py-1 rounded-lg font-medium hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
      <div className="p-4">
        <Outlet />
      </div>
      <BottomTabs />
    </div>
  )
}

export default Dashboard