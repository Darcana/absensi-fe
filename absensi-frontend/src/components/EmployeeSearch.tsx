import { useRef, useEffect } from 'react'

interface Props {
  search: string
  employees: any[]
  showDropdown: boolean
  onSearch: (value: string) => void
  onSelect: (emp: any) => void
  onDropdownClose: () => void
}

function EmployeeSearch({ search, employees, showDropdown, onSearch, onSelect, onDropdownClose }: Props) {
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onDropdownClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        placeholder="Search employee..."
        value={search}
        onChange={e => onSearch(e.target.value)}
        onFocus={() => onSearch(search)}
        className="w-full border border-gray-300 p-2 rounded-lg text-sm"
      />
      {showDropdown && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
          {filtered.map(emp => (
            <button
              key={emp.id}
              onClick={() => onSelect(emp)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600"
            >
              {emp.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default EmployeeSearch