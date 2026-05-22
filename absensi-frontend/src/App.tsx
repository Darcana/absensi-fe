import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Attendance from './pages/Attendance'
import EmployeeList from './pages/EmployeeList'
import AttendanceHistory from './pages/AttendanceHistory'
import EmployeeDetail from './pages/EmployeeDetail'
import Register from './pages/Register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="/dashboard/attendance" />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="history" element={<AttendanceHistory />} />
          <Route path="employees/:id" element={<EmployeeDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App