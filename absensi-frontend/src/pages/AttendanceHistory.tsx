import { useState, useEffect, useRef, useCallback } from 'react'
import { allAttendance, specificAttendance } from '../services/attendance.service'
import { allEmployee, getEmployee } from '../services/employee.service'
import { formatDate } from '../components/DateTimeFormat'
import { X } from 'lucide-react'

function AttendanceHistory() {
  const [records, setRecords] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const observerRef = useRef<HTMLDivElement | null>(null)
  const [search, setSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
const [selectedRecord, setSelectedRecord] = useState<any>(null)

  const filteredEmployees = employees.filter(emp =>
  emp.name.toLowerCase().includes(search.toLowerCase())
)

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

const filtered = records

const dropdownRef = useRef<HTMLDivElement | null>(null)

useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setShowDropdown(false)
    }
  }
  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [])

const getStatus = (record: any) => {
  const statuses = []

  if (record.checkIn) {
    const checkInHour = new Date(record.checkIn.timestamp).getHours()
    if (checkInHour >= 9) statuses.push({ label: 'Late', color: 'bg-yellow-100 text-yellow-600' })
  }

  if (record.checkOut) {
    const checkOutHour = new Date(record.checkOut.timestamp).getHours()
    if (checkOutHour >= 18) statuses.push({ label: 'Overtime', color: 'bg-purple-100 text-purple-600' })
  }

  return statuses
}

const getWorkHours = (record: any) => {
  if (!record.checkIn || !record.checkOut) return null

  const checkIn = new Date(record.checkIn.timestamp)
  const checkOut = new Date(record.checkOut.timestamp)
  const diffMs = checkOut.getTime() - checkIn.getTime()
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  return `${hours}h ${minutes}m`
}

  if (initialLoad) return <div className="text-center mt-10">Loading...</div>

  return (
    <div className="flex flex-col items-center px-4">
      <div className="w-full max-w-md flex flex-col gap-3 mt-4">
        <div className="text-xl font-bold">Attendance History</div>

<div className="relative" ref={dropdownRef}>
  <input
    type="text"
    placeholder="Search employee..."
    value={search}
    onChange={e => {
      setSearch(e.target.value)
      setShowDropdown(true)
      if (!e.target.value) {
        setSelectedEmployeeId('')
        setPage(1)
        setRecords([])
        fetchRecords(1, true)
      }
    }}
    onFocus={() => setShowDropdown(true)}
    className="w-full border border-gray-300 p-2 rounded-lg text-sm"
  />
  
  {showDropdown && filteredEmployees.length > 0 && (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
      {filteredEmployees.map(emp => (
        <button
          key={emp.id}
          onClick={() => {
            setSearch(emp.name)
            setSelectedEmployeeId(emp.id.toString())
            setShowDropdown(false)
            setPage(1)
            setRecords([])
            fetchRecords(1, true, emp.id.toString())
          }}
          className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600"
        >
          {emp.name}
        </button>
      ))}
    </div>
  )}
</div>

        {filtered.length === 0 && (
          <div className="text-sm text-gray-500">No records found</div>
        )}

{filtered.map((record, index) => {
  const statuses = getStatus(record)
  const prevRecord = filtered[index - 1]
  const showDateSeparator = index === 0 || prevRecord.date !== record.date

  return (
    <div key={`${record.employeeId}-${record.date}`}>
      
      {showDateSeparator && (
        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-xs text-gray-400 font-medium">{record.date}</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
      )}

      <div
        className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 cursor-pointer hover:bg-gray-50"
        onClick={() => setSelectedRecord(record)}
      >
        <div className="flex justify-between items-center">
          <p className="font-medium">{record.employeeName}</p>
          <p className="text-xs text-gray-400">{record.date}</p>
        </div>

        <div className="flex justify-between text-sm">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Check In</span>
            <span className="text-green-600 font-medium">
              {record.checkIn ? formatDate(record.checkIn.timestamp) : '-'}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400">Check Out</span>
            <span className="text-red-500 font-medium">
              {record.checkOut ? formatDate(record.checkOut.timestamp) : '-'}
            </span>
          </div>
        </div>
        {getWorkHours(record) && (
          <div className="text-xs text-gray-500">
            🕐 Work duration: <span className="font-medium text-gray-700">{getWorkHours(record)}</span>
          </div>
        )}
        {statuses.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {statuses.map(status => (
              <span key={status.label} className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>
                {status.label}
              </span>
            ))}
          </div>
        )}
      </div>

    </div>
  )
})}

        {/* this invisible div triggers loading when scrolled into view */}
        <div ref={observerRef} className="h-4" />

        {loading && (
          <div className="text-center text-sm text-gray-400 py-2">Loading more...</div>
        )}

        {page >= totalPages && records.length > 0 && (
          <div className="text-center text-sm text-gray-400 py-2">No more records</div>
        )}
      </div>

      {selectedRecord && (
  <div
    className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
    onClick={() => setSelectedRecord(null)}
  >
    <div
      className="bg-white rounded-xl p-4 w-full max-w-md flex flex-col gap-4"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex justify-between items-center">
        <p className="font-bold">{selectedRecord.employeeName}</p>
        <button onClick={() => setSelectedRecord(null)} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <p className="text-xs text-gray-400">{selectedRecord.date}</p>

      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Check In Photo</p>
          {selectedRecord.checkIn?.imagePath ? (
            <img
              src={`http://localhost:3000/${selectedRecord.checkIn.imagePath}`}
              className="w-full rounded-lg object-cover max-h-48"
              alt="Check in photo"
            />
          ) : (
            <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
              No photo
            </div>
          )}
          <p className="text-xs text-green-600 mt-1">{selectedRecord.checkIn ? formatDate(selectedRecord.checkIn.timestamp) : '-'}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Check Out Photo</p>
          {selectedRecord.checkOut?.imagePath ? (
            <img
              src={`http://localhost:3000/${selectedRecord.checkOut.imagePath}`}
              className="w-full rounded-lg object-cover max-h-48"
              alt="Check out photo"
            />
          ) : (
            <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
              No photo
            </div>
          )}
          <p className="text-xs text-red-500 mt-1">{selectedRecord.checkOut ? formatDate(selectedRecord.checkOut.timestamp) : '-'}</p>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  )
}

export default AttendanceHistory