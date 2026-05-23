import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEmployee, updateEmployee } from '../services/employee.service'

function EmployeeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', level: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getEmployee(String(id))
        setEmployee(data)
        setForm({ name: data.name, email: data.email, level: data.level })
      } catch (_err) {
        setError("Something went wrong")
      } 
      finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

const handleUpdate = async () => {
  try {
    await updateEmployee(String(id), form)
    setEmployee({ ...employee, ...form })
    setEditing(false)
    setError('')
  } catch (err: any) {
    setError(err.response?.data?.message || 'Something went wrong')
  }
}

  if (loading) return <div className="text-center mt-10">Loading...</div>
  if (!employee) return <div className="text-center mt-10">Employee not found</div>

  return (
    <div className="flex flex-col items-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6 mt-4 flex flex-col gap-4">
        
        <div className="flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="text-blue-600 text-sm">← Back</button>
          <button
            onClick={() => setEditing(!editing)}
            className="text-sm text-blue-600 font-medium"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="text-xl font-bold">Employee Detail</div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-gray-500">Name</label>
            {editing ? (
              <input
                value={form.name}
                onChange={e => {
                setForm({ ...form, name: e.target.value })
                setError('')
                }}
                className="w-full border border-gray-300 p-2 rounded-lg text-sm mt-1"
              />
            ) : (
              <p className="font-medium">{employee.name}</p>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-500">Email</label>
            {editing ? (
              <input
                value={form.email}
                onChange={e => 
                    { setForm({ ...form, email: e.target.value })
                    setError('')
                    }}
                className="w-full border border-gray-300 p-2 rounded-lg text-sm mt-1"
              />
            ) : (
              <p className="font-medium">{employee.email}</p>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-500">Level</label>
            {editing ? (
              <select
                value={form.level}
                onChange={e => 
                    {
                        setForm({ ...form, level: e.target.value })
                    setError('')
                    }}
                className="w-full border border-gray-300 p-2 rounded-lg text-sm mt-1"
              >
                <option value="EMPLOYEE">EMPLOYEE</option>
                <option value="ADMIN_HRD">ADMIN_HRD</option>
              </select>
            ) : (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                employee.level === 'ADMIN_HRD'
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-blue-100 text-blue-600'
              }`}>
                {employee.level}
              </span>
            )}
          </div>
        </div>

        {editing && (
          <button
            onClick={handleUpdate}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
          >
            Save Changes
          </button>
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  )
}

export default EmployeeDetail