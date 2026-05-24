import { useState, useEffect, useRef, useCallback } from 'react'
import { specificAttendance } from '../services/attendance.service'
import { formatDate } from '../components/DateTimeFormat'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import DateSeparator from '../components/DateSeparator'
import StatusBadge from '../components/StatusBadge'
import AttendancePhotoModal from '../components/AttendancePhotoModal'
import useInfiniteScroll from '../hooks/useInfiniteScroll'

function MyHistory() {
  const employee = useAuth()
  const [records, setRecords] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  
  if (!employee) return <Navigate to="/" />

  const fetchRecords = useCallback(async (_pageNum: number, reset = false) => {
    setLoading(true)
    try {
      const data = await specificAttendance(employee.id)
      setTotalPages(1)
      setRecords(prev => reset ? data : [...prev, ...data])
    } catch {}
    finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }, [])

  useEffect(() => { fetchRecords(1, true) }, [])

const observerRef = useInfiniteScroll(
  () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchRecords(nextPage)
  },
  loading,
  page < totalPages
)

  if (initialLoad) return <LoadingSpinner />

  return (
    <div className="flex flex-col items-center px-4">
      <div className="w-full max-w-md flex flex-col gap-3 mt-4">
        <div className="text-xl font-bold">My History</div>

        {records.length === 0 && (
          <div className="text-sm text-gray-500">No records found</div>
        )}

        {records.map((record, index) => {
          const recordDate = record.timestamp.split('T')[0]
          const prevDate = records[index - 1]?.timestamp.split('T')[0]
          const showSeparator = index === 0 || prevDate !== recordDate

          return (
            <div key={record.id}>
              {showSeparator && <DateSeparator date={recordDate} />}
              <div
                className="bg-white rounded-xl shadow p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedRecord(record)}
              >
                <div className="flex flex-col gap-1">
                  <StatusBadge label={record.type} />
                  <p className="text-sm text-gray-500 mt-1">{formatDate(record.timestamp)}</p>
                </div>
                {record.imagePath && (
                  <img
                    src={`http://localhost:3000/${record.imagePath}`}
                    className="w-12 h-12 rounded-lg object-cover"
                    alt="photo"
                  />
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
        />
      )}
    </div>
  )
}

export default MyHistory