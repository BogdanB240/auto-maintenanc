'use client'

import { MaintenanceLog } from '@/lib/types'
import { Search, X } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useState } from 'react'

interface Props {
  logs: MaintenanceLog[]
}

export default function SearchLogs({ logs }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<MaintenanceLog[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (value: string) => {
    setQuery(value)
    setHasSearched(true)

    if (!value.trim()) {
      setResults([])
      setHasSearched(false)
      return
    }

    const lowerQuery = value.toLowerCase()
    const filtered = logs.filter(log =>
      log.parts.some(p => p.toLowerCase().includes(lowerQuery)) ||
      log.service_type.toLowerCase().includes(lowerQuery) ||
      (log.description && log.description.toLowerCase().includes(lowerQuery)) ||
      (log.notes && log.notes.toLowerCase().includes(lowerQuery))
    )

    setResults(filtered)
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setHasSearched(false)
  }

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Caută după piese, tip service, descriere..."
            value={query}
            onChange={e => handleSearch(e.target.value)}
            className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="space-y-2">
          {results.length > 0 ? (
            <div className="text-sm text-gray-600 mb-3">
              {results.length} rezultat{results.length !== 1 ? 'e' : ''} găsite
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nu s-au găsi rezultate pentru "{query}"</p>
            </div>
          )}

          <div className="space-y-2">
            {results.map(log => (
              <div
                key={log.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {format(parseISO(log.service_date), 'dd MMM yyyy')} • {log.service_type}
                    </p>
                    {log.mileage && (
                      <p className="text-sm text-gray-600">
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

                <div className="flex flex-wrap gap-1">
                  {log.parts.map(part => (
                    <span
                      key={part}
                      className={`text-xs px-2 py-1 rounded ${
                        part.toLowerCase().includes(query.toLowerCase())
                          ? 'bg-yellow-100 text-yellow-800 font-semibold'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {part}
                    </span>
                  ))}
                </div>

                {log.description && (
                  <p className="text-sm text-gray-600 italic mt-2">
                    {log.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
