import AdminNav from '@/components/AdminNav'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000)

  const [totalReservas, reservasHoje, faturamentoMes, recentBookings] = await Promise.all([
    prisma.booking.count({ where: { status: { not: 'cancelled' } } }),
    prisma.booking.count({ where: { createdAt: { gte: startOfToday, lt: endOfToday } } }),
    prisma.booking.aggregate({
      _sum: { totalPrice: true },
      where: { createdAt: { gte: startOfMonth }, status: { in: ['confirmed', 'paid', 'completed'] } },
    }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      where: { status: { not: 'cancelled' } },
      include: { property: true },
    }),
  ])

  const faturamento = Number(faturamentoMes._sum.totalPrice ?? 0)

  const statusConfig: Record<string, { label: string; className: string }> = {
    confirmed: { label: 'Confirmada', className: 'bg-green-100 text-green-800' },
    pending:   { label: 'Pendente',   className: 'bg-yellow-100 text-yellow-800' },
    paid:      { label: 'Pago',       className: 'bg-blue-100 text-blue-800' },
    completed: { label: 'Concluída',  className: 'bg-gray-100 text-gray-800' },
    cancelled: { label: 'Cancelada',  className: 'bg-red-100 text-red-800' },
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total de Reservas</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">{totalReservas}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Reservas Hoje</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{reservasHoje}</p>
              </div>
              <div className="text-4xl">✨</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Faturamento do Mês</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">
                  {faturamento >= 1000
                    ? `R$ ${(faturamento / 1000).toFixed(0)}k`
                    : `R$ ${faturamento.toLocaleString('pt-BR')}`}
                </p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Reservas Ativas</p>
                <p className="text-3xl font-bold text-orange-500 mt-1">
                  {recentBookings.filter(b => b.status === 'confirmed' || b.status === 'paid').length}
                </p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="bg-white rounded-xl shadow mb-8">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Reservas Recentes</h2>
            <Link href="/admin/reservas" className="text-blue-900 text-sm font-medium hover:underline">
              Ver todas →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Hóspede</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Propriedade</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Check-in</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Check-out</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Valor</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">
                      Nenhuma reserva ainda.
                    </td>
                  </tr>
                )}
                {recentBookings.map((b) => {
                  const s = statusConfig[b.status] ?? statusConfig.pending
                  return (
                    <tr key={b.id} className="border-t hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">{b.guestName}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{b.property.name}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {b.checkIn.toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {b.checkOut.toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s.className}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        R$ {Number(b.totalPrice).toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/admin/reservas" className="bg-blue-900 text-white p-6 rounded-xl hover:bg-blue-800 transition">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-xl font-bold mb-1">Reservas</h3>
            <p className="text-blue-200 text-sm">Gerenciar todas as reservas</p>
          </Link>
          <Link href="/admin/propriedades" className="bg-purple-600 text-white p-6 rounded-xl hover:bg-purple-700 transition">
            <div className="text-4xl mb-3">🏠</div>
            <h3 className="text-xl font-bold mb-1">Propriedades</h3>
            <p className="text-purple-200 text-sm">Gerenciar propriedades</p>
          </Link>
          <Link href="/admin/servicos" className="bg-green-600 text-white p-6 rounded-xl hover:bg-green-700 transition">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="text-xl font-bold mb-1">Serviços</h3>
            <p className="text-green-200 text-sm">Gerenciar serviços de concierge</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
