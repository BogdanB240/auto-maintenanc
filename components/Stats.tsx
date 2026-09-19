'use client'

import { MaintenanceLog } from '@/lib/types'
import { Wrench, DollarSign, BarChart3, TrendingUp } from 'lucide-react'

interface Props {
  logs: MaintenanceLog[]
}

export default function Stats({ logs }: Props) {
  const totalServices = logs.length
  const totalCost = logs.reduce((sum, log) => sum + (log.cost || 0), 0)

  // Count parts frequency
  const partFrequency: Record<string, number> = {}
  logs.forEach(log => {
    log.parts.forEach(part => {
      partFrequency[part] = (partFrequency[part] || 0) + 1
    })
  })

  const topParts = Object.entries(partFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  // Average cost per service
  const logsWithCost = logs.filter(l => l.cost)
  const avgCost = logsWithCost.length > 0 ? totalCost / logsWithCost.length : 0

  // Total mileage tracked
  const mileages = logs.map(l => l.mileage).filter((m): m is number => m !== null)
  const mileageRange = mileages.length > 0
    ? `${Math.min(...mileages).toLocaleString()} - ${Math.max(...mileages).toLocaleString()} km`
    : 'N/A'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Services */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Servicii</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{totalServices}</p>
          </div>
          <Wrench className="text-blue-500" size={32} />
        </div>
      </div>

      {/* Total Cost */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Cost Total</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {totalCost.toFixed(2)} RON
            </p>
          </div>
          <DollarSign className="text-green-500" size={32} />
        </div>
      </div>

      {/* Average Cost */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Cost Mediu</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {avgCost.toFixed(2)} RON
            </p>
          </div>
          <BarChart3 className="text-orange-500" size={32} />
        </div>
      </div>

      {/* Mileage Range */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Interval Km</p>
            <p className="text-lg font-bold text-purple-600 mt-2">
              {mileageRange}
            </p>
          </div>
          <TrendingUp className="text-purple-500" size={32} />
        </div>
      </div>

      {/* Top Parts */}
      {topParts.length > 0 && (
        <div className="md:col-span-2 lg:col-span-4 bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600 text-sm font-medium mb-4">Piese Schimbate Frecvent</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topParts.map(([part, count]) => (
              <div key={part} className="bg-blue-50 rounded-lg p-4">
                <p className="font-semibold text-gray-800">{part}</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{count}x</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
