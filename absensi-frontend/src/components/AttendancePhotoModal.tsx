import { X } from 'lucide-react'
import { formatDate } from './DateTimeFormat'

interface Props {
  record: any
  onClose: () => void
  showEmployeeName?: boolean
}

function AttendancePhotoModal({ record, onClose, showEmployeeName = false }: Props) {
  const isGrouped = record.checkIn !== undefined || record.checkOut !== undefined

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-4 w-full max-w-md flex flex-col gap-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          {showEmployeeName ? (
            <p className="font-bold">{record.employeeName}</p>
          ) : (
            <span className={`text-sm px-2 py-1 rounded-full font-medium ${
              record.type === 'CHECKIN' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {record.type}
            </span>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {isGrouped ? (
          <>
            <p className="text-xs text-gray-400">{record.date}</p>
            <PhotoSlot
              label="Check In Photo"
              imagePath={record.checkIn?.imagePath}
              timestamp={record.checkIn?.timestamp}
              timeColor="text-green-600"
            />
            <PhotoSlot
              label="Check Out Photo"
              imagePath={record.checkOut?.imagePath}
              timestamp={record.checkOut?.timestamp}
              timeColor="text-red-500"
            />
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500">{formatDate(record.timestamp)}</p>
            {record.imagePath ? (
              <img
                src={`http://localhost:3000/${record.imagePath}`}
                className="w-full rounded-lg object-cover max-h-72"
                alt="photo"
              />
            ) : (
              <NoPhoto />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function PhotoSlot({ label, imagePath, timestamp, timeColor }: {
  label: string
  imagePath?: string
  timestamp?: string
  timeColor: string
}) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      {imagePath ? (
        <img
          src={`http://localhost:3000/${imagePath}`}
          className="w-full rounded-lg object-cover max-h-48"
          alt={label}
        />
      ) : (
        <NoPhoto />
      )}
      {timestamp && (
        <p className={`text-xs mt-1 ${timeColor}`}>{formatDate(timestamp)}</p>
      )}
    </div>
  )
}

function NoPhoto() {
  return (
    <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
      No photo
    </div>
  )
}

export default AttendancePhotoModal