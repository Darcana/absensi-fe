import { useState, useEffect, useCallback } from 'react'
import { allAttendance, specificAttendance } from '../services/attendance.service'
import { allEmployee, getEmployee } from '../services/employee.service'
import { formatDate } from '../components/DateTimeFormat'
import LoadingSpinner from '../components/LoadingSpinner'
import DateSeparator from '../components/DateSeparator'
import StatusBadge from '../components/StatusBadge'
import AttendancePhotoModal from '../components/AttendancePhotoModal'
import EmployeeSearch from '../components/EmployeeSearch'
import useInfiniteScroll from '../hooks/useInfiniteScroll'

function AttendanceHistory() {
  const [records, setRecords] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [search, setSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)

  const fetchRecords = useCallback(async (pageNum: number, reset = false, empId?: string) => {
    setLoading(true)
    const employeeCache: Record<string, string> = {}
    try {
      let result
      if (empId) {
        const data = await specificAttendance(empId)
        result = { data, totalPages: 1 }
      } else {
        result = await allAttendance(pageNum)
      }
      setTotalPages(result.totalPages ?? 1)
      const enriched = []
      for (const record of result.data) {
        if (!employeeCache[record.employeeId]) {
          try {
            const emp = await getEmployee(record.employeeId)
            employeeCache[record.employeeId] = emp.name
          } catch {
            employeeCache[record.employeeId] = 'Unknown'
          }
        }
        enriched.push({ ...record, employeeName: employeeCache[record.employeeId] })
      }
      setRecords(prev => reset ? enriched : [...prev, ...enriched])
    } catch {}
    finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }, [])

  useEffect(() => {
    allEmployee().then(setEmployees)
    fetchRecords(1, true)
  }, [])

const observerRef = useInfiniteScroll(
  () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchRecords(nextPage)
  },
  loading,
  page < totalPages
)

  const getWorkHours = (record: any) => {
    if (!record.checkIn || !record.checkOut) return null
    const diffMs = new Date(record.checkOut.timestamp).getTime() - new Date(record.checkIn.timestamp).getTime()
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const getStatuses = (record: any) => {
    const statuses = []
    if (record.checkIn && new Date(record.checkIn.timestamp).getHours() >= 9)
      statuses.push('Late')
    if (record.checkOut && new Date(record.checkOut.timestamp).getHours() >= 18)
      statuses.push('Overtime')
    return statuses
  }

  if (initialLoad) return <LoadingSpinner />

  return (
    <div className="flex flex-col items-center px-4">
      <div className="w-full max-w-md flex flex-col gap-3 mt-4">
        <div className="text-xl font-bold">Attendance History</div>

        <EmployeeSearch
          search={search}
          employees={employees}
          showDropdown={showDropdown}
          onSearch={value => {
            setSearch(value)
            setShowDropdown(true)
            if (!value) {
              setSelectedEmployeeId('')
              setPage(1)
              setRecords([])
              fetchRecords(1, true)
            }
          }}
          onSelect={emp => {
            setSearch(emp.name)
            setSelectedEmployeeId(emp.id)
            setShowDropdown(false)
            setPage(1)
            setRecords([])
            fetchRecords(1, true, emp.id)
          }}
          onDropdownClose={() => setShowDropdown(false)}
        />

        {records.length === 0 && (
          <div className="text-sm text-gray-500">No records found</div>
        )}

        {records.map((record, index) => {
          const prevRecord = records[index - 1]
          const showSeparator = index === 0 || prevRecord.date !== record.date
          const statuses = getStatuses(record)
          const workHours = getWorkHours(record)

          return (
            <div key={`${record.employeeId}-${record.date}`}>
              {showSeparator && <DateSeparator date={record.date} />}
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
                {workHours && (
                  <p className="text-xs text-gray-500">🕐 Work duration: <span className="font-medium text-gray-700">{workHours}</span></p>
                )}
                {statuses.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {statuses.map(s => <StatusBadge key={s} label={s} />)}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        <div ref={observerRef} className="h-4" />
        {loading && <div className="text-center text-sm text-gray-400 py-2">Loading more...</div>}
        {page >= totalPages && records.length > 0 && (
          <div className="text-center text-sm text-gray-400 py-2">No more records</div>
        )}
      </div>

      {selectedRecord && (
        <AttendancePhotoModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          showEmployeeName
        />
      )}
    </div>
  )
}

export default AttendanceHistory