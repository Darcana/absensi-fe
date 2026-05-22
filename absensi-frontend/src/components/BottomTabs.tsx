import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function BottomTabs() {
  const navigate = useNavigate()
  const location = useLocation()
  const employee = useAuth()
  const isAdmin = employee?.level === 'ADMIN_HRD'

  const tabs = [
    { label: 'Attendance', path: '/dashboard/attendance', icon: '📍', adminOnly: false },
    { label: 'Employee', path: '/dashboard/employees', icon: '👥', adminOnly: true },
    { label: 'History', path: '/dashboard/history', icon: '📋', adminOnly: false },
  ].filter(tab => !tab.adminOnly || isAdmin)

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
      {tabs.map(tab => (
        <button
          key={tab.path}
          onClick={() => navigate(tab.path)}
          className={`flex flex-col items-center px-4 py-1 text-xs ${
            location.pathname === tab.path ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <span className="text-xl">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default BottomTabs