import { useState, useEffect, useRef, useCallback } from 'react'
import { specificAttendance } from '../services/attendance.service'
import { formatDate } from '../components/DateTimeFormat'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'
import { X } from 'lucide-react'

function MyHistory() {
  const employee = useAuth()
  const [records, setRecords] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const observerRef = useRef<HTMLDivElement | null>(null)

  if (!employee) return <Navigate to="/" />

const fetchRecords = useCallback(async (pageNum: number, reset: boolean = false) => {
  setLoading(true)
  try {
    const data = await specificAttendance(employee.id)
    setTotalPages(1)
    setRecords(prev => reset ? data : [...prev, ...data])
  } catch (_err) {
  } finally {
    setLoading(false)
    setInitialLoad(false)
  }
}, [])

  useEffect(() => {
    fetchRecords(1, true)
  }, [])

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

  if (initialLoad) return <div className="text-center mt-10">Loading...</div>

  return (
    <div className="flex flex-col items-center px-4">
      <div className="w-full max-w-md flex flex-col gap-3 mt-4">
        <div className="text-xl font-bold">My History</div>

        {records.length === 0 && (
          <div className="text-sm text-gray-500">No records found</div>
        )}

        {records.map((record, index) => {
  const prevRecord = records[index - 1]
  const recordDate = record.timestamp.split('T')[0]
  const prevDate = prevRecord?.timestamp.split('T')[0]
  const showDateSeparator = index === 0 || prevDate !== recordDate

  return (
    <div key={record.id}>
      {showDateSeparator && (
        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-xs text-gray-400 font-medium">{recordDate}</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
      )}
      <div
        className="bg-white rounded-xl shadow p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={() => setSelectedRecord(record)}
      >
        <div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            record.type === 'CHECKIN' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
            {record.type}
          </span>
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
  <div
    className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
    onClick={() => setSelectedRecord(null)}
  >
    <div
      className="bg-white rounded-xl p-4 w-full max-w-md flex flex-col gap-4"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex justify-between items-center">
        <span className={`text-sm px-2 py-1 rounded-full font-medium ${
          selectedRecord.type === 'CHECKIN' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          {selectedRecord.type}
        </span>
        <button onClick={() => setSelectedRecord(null)} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <p className="text-sm text-gray-500">{formatDate(selectedRecord.timestamp)}</p>

      {selectedRecord.imagePath ? (
        <img
          src={`http://localhost:3000/${selectedRecord.imagePath}`}
          className="w-full rounded-lg object-cover max-h-72"
          alt="photo"
        />
      ) : (
        <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
          No photo
        </div>
      )}
    </div>
  </div>
)}
    </div>
  )
}

export default MyHistory