'use client'

import { useState, useEffect } from 'react'
import AdminNav from '@/components/AdminNav'

type Reserva = {
  id: string
  guestName: string
  guestEmail: string
  guestPhone: string
  property: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  paymentStatus: 'paid' | 'pending' | 'refunded'
  notes?: string
}


const statusLabels: Record<string, { label: string; className: string }> = {
  confirmed: { label: 'Confirmada', className: 'bg-green-100 text-green-800' },
  pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
  cancelled: { label: 'Cancelada', className: 'bg-red-100 text-red-800' },
  completed: { label: 'Concluída', className: 'bg-blue-100 text-blue-800' },
}

const paymentLabels: Record<string, { label: string; className: string }> = {
  paid: { label: 'Pago', className: 'bg-green-100 text-green-800' },
  pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
  refunded: { label: 'Reembolsado', className: 'bg-gray-100 text-gray-800' },
}

const propertyOptions = [
  'Rancho à Beira da Represa',
  'Casa Premium Capitólio',
]

function emptyReserva(): Reserva {
  return {
    id: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    property: propertyOptions[0],
    checkIn: '',
    checkOut: '',
    guests: 2,
    totalPrice: 0,
    status: 'pending',
    paymentStatus: 'pending',
    notes: '',
  }
}

// ─── Modal: Ver Detalhes ───────────────────────────────────────────────────────
function ViewModal({ reserva, onClose }: { reserva: Reserva; onClose: () => void }) {
  const nights =
    reserva.checkIn && reserva.checkOut
      ? Math.ceil(
          (new Date(reserva.checkOut).getTime() - new Date(reserva.checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Detalhes da Reserva #{reserva.id}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          {/* Status badges */}
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusLabels[reserva.status].className}`}>
              {statusLabels[reserva.status].label}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentLabels[reserva.paymentStatus].className}`}>
              Pagamento: {paymentLabels[reserva.paymentStatus].label}
            </span>
          </div>

          {/* Hóspede */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Hóspede</p>
            <p className="font-bold text-gray-900">{reserva.guestName}</p>
            <p className="text-sm text-gray-600">{reserva.guestEmail}</p>
            <p className="text-sm text-gray-600">{reserva.guestPhone}</p>
          </div>

          {/* Reserva */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Reserva</p>
            <p className="font-semibold text-gray-900">{reserva.property}</p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
              <div>
                <span className="text-gray-400">Check-in:</span>
                <p className="font-medium">{new Date(reserva.checkIn).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <span className="text-gray-400">Check-out:</span>
                <p className="font-medium">{new Date(reserva.checkOut).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <span className="text-gray-400">Hóspedes:</span>
                <p className="font-medium">{reserva.guests} pessoas</p>
              </div>
              <div>
                <span className="text-gray-400">Noites:</span>
                <p className="font-medium">{nights} noite(s)</p>
              </div>
            </div>
          </div>

          {/* Valor */}
          <div className="flex justify-between items-center bg-blue-50 rounded-xl p-4">
            <span className="font-semibold text-gray-700">Total</span>
            <span className="text-2xl font-bold text-blue-900">
              R$ {reserva.totalPrice.toLocaleString('pt-BR')}
            </span>
          </div>

          {/* Observações */}
          {reserva.notes && (
            <div className="bg-yellow-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Observações</p>
              <p className="text-sm text-gray-700">{reserva.notes}</p>
            </div>
          )}
        </div>
        <div className="p-6 border-t">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-800 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Modal: Nova / Editar Reserva ─────────────────────────────────────────────
function ReservaFormModal({
  reserva,
  title,
  onSave,
  onClose,
}: {
  reserva: Reserva
  title: string
  onSave: (r: Reserva) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<Reserva>({ ...reserva })
  const set = (field: keyof Reserva, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }))

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Hóspede */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do Hóspede *</label>
            <input
              type="text"
              value={form.guestName}
              onChange={e => set('guestName', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome completo"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                value={form.guestEmail}
                onChange={e => set('guestEmail', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Telefone</label>
              <input
                type="tel"
                value={form.guestPhone}
                onChange={e => set('guestPhone', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(35) 99999-0000"
              />
            </div>
          </div>

          {/* Propriedade */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Propriedade *</label>
            <select
              value={form.property}
              onChange={e => set('property', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {propertyOptions.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Check-in *</label>
              <input
                type="date"
                value={form.checkIn}
                onChange={e => set('checkIn', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Check-out *</label>
              <input
                type="date"
                value={form.checkOut}
                onChange={e => set('checkOut', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hóspedes</label>
              <input
                type="number"
                min={1}
                value={form.guests}
                onChange={e => set('guests', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Valor Total (R$)</label>
              <input
                type="number"
                min={0}
                value={form.totalPrice}
                onChange={e => set('totalPrice', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => set('status', e.target.value as Reserva['status'])}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pendente</option>
                <option value="confirmed">Confirmada</option>
                <option value="completed">Concluída</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Pagamento</label>
              <select
                value={form.paymentStatus}
                onChange={e => set('paymentStatus', e.target.value as Reserva['paymentStatus'])}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pendente</option>
                <option value="paid">Pago</option>
                <option value="refunded">Reembolsado</option>
              </select>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Observações</label>
            <textarea
              value={form.notes || ''}
              onChange={e => set('notes', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Pedidos especiais, informações adicionais..."
            />
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={!form.guestName || !form.checkIn || !form.checkOut}
            className="flex-1 bg-blue-900 text-white py-2.5 rounded-full text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Página Principal ─────────────────────────────────────────────────────────
export default function AdminReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [viewingReserva, setViewingReserva] = useState<Reserva | null>(null)
  const [editingReserva, setEditingReserva] = useState<Reserva | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  // Carrega reservas do banco ao montar
  useEffect(() => {
    fetch('/api/admin/bookings')
      .then(r => r.json())
      .then(data => { setReservas(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleConfirm = async (id: string) => {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'confirmed' }),
    })
    if (res.ok) {
      const updated = await res.json()
      setReservas(prev => prev.map(r => r.id === id ? updated : r))
      showToast('✅ Reserva confirmada!')
    }
  }

  const handleCancel = async (id: string) => {
    if (!confirm('Cancelar esta reserva?')) return
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    })
    if (res.ok) {
      const updated = await res.json()
      setReservas(prev => prev.map(r => r.id === id ? updated : r))
      showToast('🚫 Reserva cancelada.')
    }
  }

  const handleSaveEdit = async (updated: Reserva) => {
    const res = await fetch(`/api/admin/bookings/${updated.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    if (res.ok) {
      const saved = await res.json()
      setReservas(prev => prev.map(r => r.id === saved.id ? saved : r))
      setEditingReserva(null)
      showToast('✅ Reserva atualizada!')
    }
  }

  const handleAdd = async (nova: Reserva) => {
    const res = await fetch('/api/admin/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nova),
    })
    if (res.ok) {
      const saved = await res.json()
      setReservas(prev => [saved, ...prev])
      setShowAddModal(false)
      showToast('✅ Nova reserva adicionada!')
    } else {
      const err = await res.json()
      showToast(`❌ ${err.error}`)
    }
  }

  const filtered = filterStatus === 'all'
    ? reservas
    : reservas.filter(r => r.status === filterStatus)

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          {toast}
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reservas</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-900 text-white px-6 py-2 rounded-full hover:bg-blue-800 transition text-sm font-semibold"
          >
            + Nova Reserva
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-2xl font-bold text-blue-900">{reservas.length}</p>
            <p className="text-gray-500 text-sm">Total</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-2xl font-bold text-green-600">
              {reservas.filter(r => r.status === 'confirmed').length}
            </p>
            <p className="text-gray-500 text-sm">Confirmadas</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {reservas.filter(r => r.status === 'pending').length}
            </p>
            <p className="text-gray-500 text-sm">Pendentes</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-2xl font-bold text-purple-600">
              R$ {reservas.reduce((acc, r) => acc + r.totalPrice, 0).toLocaleString('pt-BR')}
            </p>
            <p className="text-gray-500 text-sm">Total Faturado</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[
            { key: 'all', label: 'Todas' },
            { key: 'pending', label: 'Pendentes' },
            { key: 'confirmed', label: 'Confirmadas' },
            { key: 'completed', label: 'Concluídas' },
            { key: 'cancelled', label: 'Canceladas' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                filterStatus === tab.key
                  ? 'bg-blue-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Hóspede</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Propriedade</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Check-in</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Check-out</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Hóspedes</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Valor</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Pagamento</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-400">
                      Carregando reservas...
                    </td>
                  </tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-400">
                      Nenhuma reserva encontrada.
                    </td>
                  </tr>
                )}
                {filtered.map((reserva, index) => {
                  const status = statusLabels[reserva.status]
                  const payment = paymentLabels[reserva.paymentStatus]
                  return (
                    <tr
                      key={reserva.id}
                      className={`border-t hover:bg-gray-50 transition ${index % 2 === 0 ? '' : 'bg-gray-50/50'}`}
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{reserva.guestName}</p>
                        <p className="text-xs text-gray-500">{reserva.guestEmail}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{reserva.property}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(reserva.checkIn).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(reserva.checkOut).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-600">{reserva.guests}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900 text-sm">
                        R$ {reserva.totalPrice.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${payment.className}`}>
                          {payment.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => setViewingReserva(reserva)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium bg-blue-50 px-2 py-1 rounded-lg hover:bg-blue-100 transition"
                          >
                            Ver
                          </button>
                          <button
                            onClick={() => setEditingReserva(reserva)}
                            className="text-gray-600 hover:text-gray-800 text-xs font-medium bg-gray-100 px-2 py-1 rounded-lg hover:bg-gray-200 transition"
                          >
                            Editar
                          </button>
                          {reserva.status === 'pending' && (
                            <button
                              onClick={() => handleConfirm(reserva.id)}
                              className="text-green-600 hover:text-green-800 text-xs font-medium bg-green-50 px-2 py-1 rounded-lg hover:bg-green-100 transition"
                            >
                              Confirmar
                            </button>
                          )}
                          {reserva.status !== 'cancelled' && reserva.status !== 'completed' && (
                            <button
                              onClick={() => handleCancel(reserva.id)}
                              className="text-red-500 hover:text-red-700 text-xs font-medium bg-red-50 px-2 py-1 rounded-lg hover:bg-red-100 transition"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewingReserva && (
        <ViewModal reserva={viewingReserva} onClose={() => setViewingReserva(null)} />
      )}

      {/* Edit Modal */}
      {editingReserva && (
        <ReservaFormModal
          reserva={editingReserva}
          title={`Editar Reserva #${editingReserva.id}`}
          onSave={handleSaveEdit}
          onClose={() => setEditingReserva(null)}
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <ReservaFormModal
          reserva={emptyReserva()}
          title="Nova Reserva"
          onSave={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}
