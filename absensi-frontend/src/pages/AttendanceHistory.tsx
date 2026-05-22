import { useState, useEffect, useRef, useCallback } from 'react'
import { allAttendance, specificAttendance } from '../services/attendance.service'
import { allEmployee, getEmployee } from '../services/employee.service'
import { formatDate } from '../components/DateTimeFormat'

function AttendanceHistory() {
  const [records, setRecords] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const observerRef = useRef<HTMLDivElement | null>(null)

const fetchRecords = useCallback(async (pageNum: number, reset: boolean = false, empId?: string) => {
  setLoading(true)
  const employeeCache: Record<number, string> = {}  // cache here

  try {
    let result

    if (empId) {
      const data = await specificAttendance(Number(empId))
      result = { data, totalPages: 1 }
    } else {
      result = await allAttendance(pageNum)
    }

    setTotalPages(result.totalPages ?? 1)

const enriched = []
for (const record of result.data) {
  if (!employeeCache[record.employeeId]) {
    try {
      const employee = await getEmployee(record.employeeId)
      employeeCache[record.employeeId] = employee.name
    } catch (_err) {
      employeeCache[record.employeeId] = 'Unknown'
    }
  }
  enriched.push({ ...record, employeeName: employeeCache[record.employeeId] })
}

    setRecords(prev => reset ? enriched : [...prev, ...enriched])
  } catch (_err) {
  } finally {
    setLoading(false)
    setInitialLoad(false)
  }
}, [])

  // initial load
  useEffect(() => {
    allEmployee().then(setEmployees)
    fetchRecords(1, true)
  }, [])

  // infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loading && page < totalPages) {
        const nextPage = page + 1
        setPage(nextPage)
        fetchRecords(nextPage)
      }
    })

    if (observerRef.current) observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [loading, page, totalPages])

  // reset when filter changes
const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const empId = e.target.value
  setSelectedEmployeeId(empId)
  setPage(1)
  setRecords([])
  fetchRecords(1, true, empId)
}

const filtered = records

  if (initialLoad) return <div className="text-center mt-10">Loading...</div>

  return (
    <div className="flex flex-col items-center px-4">
      <div className="w-full max-w-md flex flex-col gap-3 mt-4">
        <div className="text-xl font-bold">Attendance History</div>

        <select
          value={selectedEmployeeId}
          onChange={handleFilterChange}
          className="w-full border border-gray-300 p-2 rounded-lg text-sm"
        >
          <option value="">All Employees</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>

        {filtered.length === 0 && (
          <div className="text-sm text-gray-500">No records found</div>
        )}

        {filtered.map(record => (
          <div key={record.id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{record.employeeName}</p>
              <p className="text-xs text-gray-400">{formatDate(record.timestamp)}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              record.type === 'CHECKIN'
                ? 'bg-green-100 text-green-600'
                : 'bg-red-100 text-red-600'
            }`}>
              {record.type}
            </span>
          </div>
        ))}

        {/* this invisible div triggers loading when scrolled into view */}
        <div ref={observerRef} className="h-4" />

        {loading && (
          <div className="text-center text-sm text-gray-400 py-2">Loading more...</div>
        )}

        {page >= totalPages && records.length > 0 && (
          <div className="text-center text-sm text-gray-400 py-2">No more records</div>
        )}
      </div>
    </div>
  )
}

export default AttendanceHistory