import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState, useEffect, useRef } from 'react'  // add useRef
import { Menu, MapPin, Users, ClipboardList, LogOut, Clock } from 'lucide-react'

function Dashboard() {
  const employee = useAuth()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const isAdmin = employee?.level === 'ADMIN_HRD' || employee?.level === 'SUPERADMIN'
  const [time, setTime] = useState(new Date())
  const drawerRef = useRef<HTMLDivElement | null>(null)

  if (!employee) return <Navigate to="/" />

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('employee')
  navigate('/')
}

  const menuItems = [
    { label: 'Attendance', path: '/dashboard/checkin', icon: <MapPin size={18} />, adminOnly: false },
    { label: 'Employee', path: '/dashboard/employees', icon: <Users size={18} />, adminOnly: true },
    { label: 'My History', path: '/dashboard/my-history', icon: <Clock size={18} />, adminOnly: false },
    { label: 'History', path: '/dashboard/history', icon: <ClipboardList size={18} />, adminOnly: true },
  ].filter(item => !item.adminOnly || isAdmin)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setDrawerOpen(false)
      }
    }
    if (drawerOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [drawerOpen])

  return (
    <div className="min-h-screen bg-gray-100">

      {/* drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="bg-blue-600 text-white p-4">
          <p className="text-sm">Welcome,</p>
          <p className="font-bold">{employee.name}</p>
          <p className="text-xs opacity-75">{employee.level}</p>
        </div>
        <nav className="flex flex-col p-4 gap-2">
          {menuItems.map(item => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path)
                setDrawerOpen(false)
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-sm font-medium"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 w-full text-sm font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* header */}
      <div className="sticky top-0 z-10 bg-blue-600 text-white p-4 flex justify-between items-center">
        <button onClick={() => setDrawerOpen(true)}>
          <Menu size={24} />
        </button>
        <div className="flex flex-col items-center">
          <p className="font-bold">Absensi App</p>
          <p className="text-xs opacity-75">
            {time.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' })}
          </p>
        </div>
        <div className="w-6" />
      </div>

      {/* page content */}
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard