import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { allEmployee } from '../services/employee.service'
import LoadingSpinner from '../components/LoadingSpinner'
import StatusBadge from '../components/StatusBadge'

function EmployeeList() {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await allEmployee()
        setEmployees(data)
      } catch {}
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="flex flex-col items-center px-4">
      <div className="w-full max-w-md flex flex-col gap-3 mt-4">
        <div className="text-xl font-bold">Employee List</div>
        {employees.map(emp => (
          <div
            key={emp.id}
            onClick={() => navigate(`/dashboard/employees/${emp.id}`)}
            className="bg-white rounded-xl shadow p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
          >
            <div>
              <p className="font-bold">{emp.name}</p>
              <p className="text-sm text-gray-500">{emp.email}</p>
            </div>
            <StatusBadge label={emp.level} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default EmployeeList