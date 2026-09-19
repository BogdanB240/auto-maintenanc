'use client'

import { MaintenanceLog } from '@/lib/types'
import { format, parseISO, getYear, getMonth } from 'date-fns'
import { roLocale } from '@/lib/ro-locale'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface Props {
  logs: MaintenanceLog[]
}

export default function TimelineView({ logs }: Props) {
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set())
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set())

  const toggleYear = (year: number) => {
    const newSet = new Set(expandedYears)
    if (newSet.has(year)) {
      newSet.delete(year)
    } else {
      newSet.add(year)
    }
    setExpandedYears(newSet)
  }

  const toggleMonth = (key: string) => {
    const newSet = new Set(expandedMonths)
    if (newSet.has(key)) {
      newSet.delete(key)
    } else {
      newSet.add(key)
    }
    setExpandedMonths(newSet)
  }

  // Group by year then month
  const grouped = logs.reduce((acc, log) => {
    const date = parseISO(log.service_date)
    const year = getYear(date)
    const monthNum = getMonth(date)

    if (!acc[year]) {
      acc[year] = {}
    }
    if (!acc[year][monthNum]) {
      acc[year][monthNum] = []
    }
    acc[year][monthNum].push(log)
    return acc
  }, {} as Record<number, Record<number, MaintenanceLog[]>>)

  const sortedYears = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a)

  const monthNames = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
  ]

  return (
    <div className="space-y-4">
      {sortedYears.map(year => (
        <div key={year} className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Year header */}
          <button
            onClick={() => toggleYear(year)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 font-bold text-lg flex items-center justify-between hover:from-blue-700 hover:to-blue-600 transition"
          >
            <span>{year}</span>
            {expandedYears.has(year) ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>

          {/* Months */}
          {expandedYears.has(year) && (
            <div className="divide-y divide-gray-200 bg-white">
              {Object.keys(grouped[year])
                .map(Number)
                .sort((a, b) => b - a)
                .map(monthNum => {
                  const monthKey = `${year}-${monthNum}`
                  const logs = grouped[year][monthNum]
                  const isExpanded = expandedMonths.has(monthKey)

                  return (
                    <div key={monthKey}>
                      <button
                        onClick={() => toggleMonth(monthKey)}
                        className="w-full px-6 py-3 bg-gray-50 font-semibold text-gray-700 flex items-center justify-between hover:bg-gray-100 transition"
                      >
                        <span>{monthNames[monthNum]} ({logs.length})</span>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>

                      {isExpanded && (
                        <div className="divide-y divide-gray-100">
                          {logs
                            .sort((a, b) => new Date(b.service_date).getTime() - new Date(a.service_date).getTime())
                            .map(log => (
                              <div key={log.id} className="px-6 py-4 hover:bg-blue-50 transition">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-800">
                                      {format(parseISO(log.service_date), 'd MMM', { locale: roLocale })}
                                      <span className="text-blue-600 font-bold"> • {log.service_type}</span>
                                    </p>
                                    {log.mileage && (
                                      <p className="text-sm text-gray-600 mt-1">
                                        📍 {log.mileage.toLocaleString()} km
                                      </p>
                                    )}
                                  </div>
                                  {log.cost && (
                                    <p className="text-green-600 font-semibold">
                                      {log.cost.toFixed(2)} RON
                                    </p>
                                  )}
                                </div>

                                {/* Piese */}
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {log.parts.map(part => (
                                    <span
                                      key={part}
                                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                                    >
                                      {part}
                                    </span>
                                  ))}
                                </div>

                                {log.description && (
                                  <p className="text-sm text-gray-600 italic">
                                    {log.description}
                                  </p>
                                )}
                                {log.notes && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    📝 {log.notes}
                                  </p>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      ))}

      {logs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Nu ai nicio înregistrare încă</p>
          <p className="text-sm">Adaugă o nouă intrare pentru a o vedea aici</p>
        </div>
      )}
    </div>
  )
}
