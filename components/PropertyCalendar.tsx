'use client'

import { useState, useEffect } from 'react'
import { DateRange, DayPicker } from 'react-day-picker'
import { ptBR } from 'date-fns/locale'
import { parseISO } from 'date-fns'
import 'react-day-picker/dist/style.css'

interface OccupiedRange {
  from: string
  to: string
}

interface PropertyCalendarProps {
  slug: string
  selectedRange?: DateRange
  onSelectRange?: (range: DateRange | undefined) => void
  mode?: 'view' | 'range'
  className?: string
}

export default function PropertyCalendar({ 
  slug, 
  selectedRange, 
  onSelectRange, 
  className = ''
}: PropertyCalendarProps) {
  const [occupiedRanges, setOccupiedRanges] = useState<OccupiedRange[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const res = await fetch(`/api/properties/${slug}/availability`, { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          console.log('Occupied ranges fetched:', data)
          setOccupiedRanges(data)
        }
      } catch (error) {
        console.error('Error fetching availability:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAvailability()
  }, [slug])

  // Desabilitar datas ocupadas
  const disabledDays = occupiedRanges.map(range => ({
    from: parseISO(range.from),
    to: parseISO(range.to)
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50 rounded-xl">
        <div className="w-6 h-6 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl p-2 border border-blue-50 shadow-sm ${className}`}>
      <style>{`
        .rdp-root {
          --rdp-accent-color: #22c55e !important;
          --rdp-range_start-date-background-color: #22c55e !important;
          --rdp-range_end-date-background-color: #22c55e !important;
          --rdp-range_middle-background-color: #dcfce7 !important;
          --rdp-range_middle-font-color: #166534 !important;
          margin: 0;
        }
        
        /* Selected days text color */
        .rdp-day_selected {
          color: white !important;
        }

        /* Occupied dates styling */
        .rdp-day_occupied .rdp-day_button,
        .rdp-day_occupied[disabled] .rdp-day_button {
          background-color: #fee2e2 !important;
          color: #991b1b !important;
          text-decoration: line-through;
          cursor: not-allowed;
          opacity: 1 !important;
          border-radius: 4px;
        }

        /* Hover effect */
        .rdp-day_button:hover:not([disabled]):not(.rdp-day_selected) {
          background-color: #f0fdf4 !important;
        }
      `}</style>
      <DayPicker
        mode="range"
        selected={selectedRange}
        onSelect={onSelectRange}
        locale={ptBR}
        disabled={[{ before: new Date() }, ...disabledDays]}
        modifiers={{ occupied: disabledDays }}
        modifiersStyles={{
          occupied: {
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            textDecoration: 'line-through',
            opacity: 1,
          }
        }}
        showOutsideDays
      />
      <div className="mt-4 px-2 flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Selecionado</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <span>Ocupado</span>
        </div>
      </div>
    </div>
  )
}
