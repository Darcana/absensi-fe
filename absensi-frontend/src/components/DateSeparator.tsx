function DateSeparator({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-2 my-2">
      <div className="flex-1 h-px bg-gray-300" />
      <span className="text-xs text-gray-400 font-medium">{date}</span>
      <div className="flex-1 h-px bg-gray-300" />
    </div>
  )
}
export default DateSeparator