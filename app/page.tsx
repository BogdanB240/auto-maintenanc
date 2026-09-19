'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { MaintenanceLog } from '@/lib/types'
import Auth from '@/components/Auth'
import AddMaintenanceForm from '@/components/AddMaintenanceForm'
import TimelineView from '@/components/TimelineView'
import SearchLogs from '@/components/SearchLogs'
import Stats from '@/components/Stats'
import { Plus, LogOut, Calendar, Search } from 'lucide-react'

type TabType = 'timeline' | 'search'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [logs, setLogs] = useState<MaintenanceLog[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('timeline')

  // Check auth state
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  // Fetch logs
  useEffect(() => {
    if (user) {
      fetchLogs()
    }
  }, [user])

  const fetchLogs = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('maintenance_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('service_date', { ascending: false })

      if (error) throw error
      setLogs(data || [])
    } catch (err) {
      console.error('Error fetching logs:', err)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Conectare...</p>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🚗 Auto Maintenance
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {user.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <Plus size={20} />
                Adaugă Service
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg transition"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <Stats logs={logs} />

        {/* Tabs */}
        <div className="mt-8 border-b border-gray-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-2 px-4 py-4 font-medium transition border-b-2 ${
                activeTab === 'timeline'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar size={20} />
              Timeline
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-4 py-4 font-medium transition border-b-2 ${
                activeTab === 'search'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Search size={20} />
              Căutare
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8">
          {activeTab === 'timeline' && <TimelineView logs={logs} />}
          {activeTab === 'search' && <SearchLogs logs={logs} />}
        </div>
      </main>

      {/* Modal form */}
      {showForm && (
        <AddMaintenanceForm
          userId={user.id}
          onSuccess={() => {
            setShowForm(false)
            fetchLogs()
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
