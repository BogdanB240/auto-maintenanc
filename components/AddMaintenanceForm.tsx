'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { MaintenanceFormData } from '@/lib/types'
import { format } from 'date-fns'
import { X, Plus } from 'lucide-react'

interface Props {
  onSuccess: () => void
  onCancel: () => void
  userId: string
}

const SERVICE_TYPES = [
  'Schimb ulei',
  'Revizie',
  'Schimb pernă suspensie',
  'Schimb anvelope',
  'Service general',
  'Reparație frână',
  'Schimb filtru aer',
  'Schimb filtru polen',
  'Alte servicii',
]

const COMMON_PARTS = [
  'Ulei motor',
  'Filtru aer',
  'Filtru polen',
  'Filtru ulei',
  'Pernă suspensie',
  'Anvelopă',
  'Plăcuță frână',
  'Disc frână',
  'Baterie',
  'Bujie',
  'Lanț distribuție',
]

export default function AddMaintenanceForm({ onSuccess, onCancel, userId }: Props) {
  const [form, setForm] = useState<MaintenanceFormData>({
    service_date: format(new Date(), 'yyyy-MM-dd'),
    parts: [],
    service_type: '',
    description: '',
    mileage: '',
    cost: '',
    notes: '',
  })

  const [partInput, setPartInput] = useState('')
  const [filteredParts, setFilteredParts] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePartInput = (value: string) => {
    setPartInput(value)
    if (value.trim()) {
      const filtered = COMMON_PARTS.filter(
        p => p.toLowerCase().includes(value.toLowerCase()) &&
        !form.parts.includes(p)
      )
      setFilteredParts(filtered)
    } else {
      setFilteredParts([])
    }
  }

  const addPart = (part: string) => {
    if (!form.parts.includes(part)) {
      setForm(prev => ({
        ...prev,
        parts: [...prev.parts, part],
      }))
    }
    setPartInput('')
    setFilteredParts([])
  }

  const removePart = (part: string) => {
    setForm(prev => ({
      ...prev,
      parts: prev.parts.filter(p => p !== part),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!form.service_type || form.parts.length === 0 || !form.service_date) {
        throw new Error('Completează tipul serviciu, data și cel puțin o piesă')
      }

      const { error: insertError } = await supabase
        .from('maintenance_logs')
        .insert({
          user_id: userId,
          service_date: form.service_date,
          parts: form.parts,
          service_type: form.service_type,
          description: form.description || null,
          mileage: form.mileage ? parseInt(form.mileage) : null,
          cost: form.cost ? parseFloat(form.cost) : null,
          notes: form.notes || null,
        })

      if (insertError) throw insertError
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la salvare')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Adaugă Service</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data serviciului *
            </label>
            <input
              type="date"
              value={form.service_date}
              onChange={e => setForm({ ...form, service_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Tip serviciu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tip serviciu *
            </label>
            <select
              value={form.service_type}
              onChange={e => setForm({ ...form, service_type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selectează tipul</option>
              {SERVICE_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Piese */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Piese schimbate *
            </label>
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Caută sau scrie o piesă nouă..."
                value={partInput}
                onChange={e => handlePartInput(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {filteredParts.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10">
                  {filteredParts.map(part => (
                    <button
                      key={part}
                      type="button"
                      onClick={() => addPart(part)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 transition"
                    >
                      {part}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {partInput.trim() && !filteredParts.includes(partInput.trim()) && (
              <button
                type="button"
                onClick={() => addPart(partInput.trim())}
                className="mb-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
              >
                <Plus size={18} />
                Adaugă "{partInput.trim()}"
              </button>
            )}

            {form.parts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.parts.map(part => (
                  <div
                    key={part}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                  >
                    {part}
                    <button
                      type="button"
                      onClick={() => removePart(part)}
                      className="hover:text-blue-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Kilometraj */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kilometraj (km)
            </label>
            <input
              type="number"
              value={form.mileage}
              onChange={e => setForm({ ...form, mileage: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 120000"
            />
          </div>

          {/* Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cost (RON)
            </label>
            <input
              type="number"
              step="0.01"
              value={form.cost}
              onChange={e => setForm({ ...form, cost: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 250.50"
            />
          </div>

          {/* Descriere */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descriere
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Adaugă detalii suplimentare..."
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note
            </label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="Orice observații..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Anulează
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              {loading ? 'Se salvează...' : 'Salvează'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
