import { attendance, checkIn, checkOut } from '../services/attendance.service'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { formatDate } from '../components/DateTimeFormat'
import { Camera } from 'lucide-react'

function Attendance() {
  const employee = useAuth()
  const [latestAttendance, setLatestAttendance] = useState<any>(null)
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoError, setPhotoError] = useState('')
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const data = await attendance(employee.id)
        setLatestAttendance(data)
      } catch (_err) {
        // no attendance record yet
      }
    }
    if (employee) fetchAttendance()
  }, [])

  if (!employee) return <Navigate to="/" />

const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    setPhotoError('File must be an image')
    return
  }

  if (file.size > 100 * 1024 * 1024) {
    setPhotoError('File size must be under 100MB')
    return
  }

  setPhotoError('')
  setPhoto(file)
}

const handleCheckIn = async () => {
  if (!photo) {
    setPhotoError('Photo is required')
    return
  }
  try {
    await checkIn(employee.id, photo)
    const data = await attendance(employee.id)
    setLatestAttendance(data)
    setPhoto(null)
  } catch (_err) {}
}

const handleCheckOut = async () => {
  if (!photo) {
    setPhotoError('Photo is required')
    return
  }
  try {
    await checkOut(employee.id, photo)
    const data = await attendance(employee.id)
    setLatestAttendance(data)
    setPhoto(null)
  } catch (_err) {}
}

return (
  <div className="flex flex-col items-center min-h-screen bg-gray-100 px-4">
    <div className="w-full max-w-md bg-white rounded-xl shadow p-6 mt-4 flex flex-col gap-4">
      
      <div className="text-xl font-bold">Check In / Out</div>
      
      {latestAttendance ? (
        <div className="text-sm text-gray-500">
          Last status: <span className="font-bold text-black">{latestAttendance.type}</span> at {formatDate(latestAttendance.timestamp)}
        </div>
      ) : (
        <div className="text-sm text-gray-500">No attendance record yet</div>
      )}

{/* bisa di adjust ke ambil foto live, instead upload file */}

<div className="flex flex-col gap-2">
  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50">
    <Camera className="text-gray-400 mb-2" size={32} />
    <span className="text-sm text-gray-500">Tap to upload photo</span>
    <input
      type="file"
      accept="image/*"
      onChange={handlePhotoChange}
      className="hidden"
    />
  </label>
  {photoError && <p className="text-red-500 text-xs">{photoError}</p>}
  {photo && <p className="text-green-600 text-xs">✓ {photo.name}</p>}
</div>

      <button
        onClick={handleCheckIn}
        disabled={latestAttendance?.type === 'CHECKIN'}
        className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 disabled:!bg-gray-400 disabled:!cursor-not-allowed"
      >
        CHECK IN
      </button>
      <button
        onClick={handleCheckOut}
        disabled={!latestAttendance || latestAttendance?.type === 'CHECKOUT'}
        className="w-full bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 disabled:!bg-gray-400 disabled:!cursor-not-allowed"
      >
        CHECK OUT
      </button>

    </div>
  </div>
)
}

export default Attendance