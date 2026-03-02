import Link from 'next/link'

const mockReservas = [
  {
    id: '1',
    guestName: 'João Silva',
    guestEmail: 'joao@email.com',
    guestPhone: '(35) 99999-0001',
    property: 'Rancho à Beira da Represa',
    checkIn: '2026-03-15',
    checkOut: '2026-03-18',
    guests: 8,
    totalPrice: 8000,
    status: 'confirmed',
    paymentStatus: 'paid',
  },
  {
    id: '2',
    guestName: 'Maria Santos',
    guestEmail: 'maria@email.com',
    guestPhone: '(35) 99999-0002',
    property: 'Casa Premium Capitólio',
    checkIn: '2026-03-20',
    checkOut: '2026-03-22',
    guests: 6,
    totalPrice: 4800,
    status: 'pending',
    paymentStatus: 'pending',
  },
  {
    id: '3',
    guestName: 'Carlos Oliveira',
    guestEmail: 'carlos@email.com',
    guestPhone: '(35) 99999-0003',
    property: 'Rancho à Beira da Represa',
    checkIn: '2026-03-25',
    checkOut: '2026-03-30',
    guests: 12,
    totalPrice: 13000,
    status: 'confirmed',
    paymentStatus: 'paid',
  },
  {
    id: '4',
    guestName: 'Ana Pereira',
    guestEmail: 'ana@email.com',
    guestPhone: '(35) 99999-0004',
    property: 'Casa Premium Capitólio',
    checkIn: '2026-04-05',
    checkOut: '2026-04-08',
    guests: 4,
    totalPrice: 7200,
    status: 'pending',
    paymentStatus: 'pending',
  },
]

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

export default function AdminReservas() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Capitólio Premium - Admin</h1>
            <Link href="/" className="text-blue-200 hover:text-white">
              Ver Site →
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-8 py-4">
            <Link href="/admin" className="text-gray-600 hover:text-blue-900">
              Dashboard
            </Link>
            <Link href="/admin/reservas" className="font-semibold text-blue-900 border-b-2 border-blue-900 pb-2">
              Reservas
            </Link>
            <Link href="/admin/propriedades" className="text-gray-600 hover:text-blue-900">
              Propriedades
            </Link>
            <Link href="/admin/servicos" className="text-gray-600 hover:text-blue-900">
              Serviços
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Gerenciar Reservas</h2>
          <div className="flex gap-3">
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm" title="Filtrar por status">
              <option value="">Todos os status</option>
              <option value="confirmed">Confirmadas</option>
              <option value="pending">Pendentes</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-blue-900">{mockReservas.length}</p>
            <p className="text-gray-600 text-sm">Total</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-green-600">
              {mockReservas.filter(r => r.status === 'confirmed').length}
            </p>
            <p className="text-gray-600 text-sm">Confirmadas</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {mockReservas.filter(r => r.status === 'pending').length}
            </p>
            <p className="text-gray-600 text-sm">Pendentes</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-blue-900">
              R$ {mockReservas.reduce((acc, r) => acc + r.totalPrice, 0).toLocaleString('pt-BR')}
            </p>
            <p className="text-gray-600 text-sm">Faturamento Total</p>
          </div>
        </div>

        {/* Reservations Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600 text-sm">
                  <th className="px-6 py-4">Hóspede</th>
                  <th className="px-6 py-4">Propriedade</th>
                  <th className="px-6 py-4">Check-in</th>
                  <th className="px-6 py-4">Check-out</th>
                  <th className="px-6 py-4">Hóspedes</th>
                  <th className="px-6 py-4">Valor</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Pagamento</th>
                  <th className="px-6 py-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {mockReservas.map((reserva, index) => {
                  const status = statusLabels[reserva.status]
                  const payment = paymentLabels[reserva.paymentStatus]
                  return (
                    <tr key={reserva.id} className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4">
                        <p className="font-semibold">{reserva.guestName}</p>
                        <p className="text-sm text-gray-500">{reserva.guestEmail}</p>
                      </td>
                      <td className="px-6 py-4 text-sm">{reserva.property}</td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(reserva.checkIn).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(reserva.checkOut).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">{reserva.guests}</td>
                      <td className="px-6 py-4 font-semibold text-sm">
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
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Ver
                          </button>
                          <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                            Confirmar
                          </button>
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
    </div>
  )
}
