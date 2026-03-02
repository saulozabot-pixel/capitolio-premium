import Link from 'next/link'

export default function AdminDashboard() {
  // Mock data
  const stats = {
    totalReservas: 12,
    reservasHoje: 2,
    faturamentoMes: 45000,
    ocupacaoMedia: 78
  }

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
            <Link href="/admin" className="font-semibold text-blue-900 border-b-2 border-blue-900 pb-2">
              Dashboard
            </Link>
            <Link href="/admin/reservas" className="text-gray-600 hover:text-blue-900">
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
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Reservas</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalReservas}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Reservas Hoje</p>
                <p className="text-3xl font-bold text-green-600">{stats.reservasHoje}</p>
              </div>
              <div className="text-4xl">✨</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Faturamento Mês</p>
                <p className="text-3xl font-bold text-blue-900">
                  R$ {stats.faturamentoMes.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Ocupação Média</p>
                <p className="text-3xl font-bold text-purple-600">{stats.ocupacaoMedia}%</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Últimas Reservas</h2>
          </div>
          <div className="p-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="pb-3">Hóspede</th>
                  <th className="pb-3">Propriedade</th>
                  <th className="pb-3">Check-in</th>
                  <th className="pb-3">Check-out</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4">João Silva</td>
                  <td>Rancho à Beira da Represa</td>
                  <td>15/03/2026</td>
                  <td>18/03/2026</td>
                  <td><span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Confirmada</span></td>
                  <td className="font-semibold">R$ 8.000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4">Maria Santos</td>
                  <td>Casa Premium Capitólio</td>
                  <td>20/03/2026</td>
                  <td>22/03/2026</td>
                  <td><span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Pendente</span></td>
                  <td className="font-semibold">R$ 4.800</td>
                </tr>
                <tr>
                  <td className="py-4">Carlos Oliveira</td>
                  <td>Rancho à Beira da Represa</td>
                  <td>25/03/2026</td>
                  <td>30/03/2026</td>
                  <td><span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Confirmada</span></td>
                  <td className="font-semibold">R$ 13.000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/admin/reservas" className="bg-blue-900 text-white p-6 rounded-lg hover:bg-blue-800 transition">
            <div className="text-4xl mb-2">📝</div>
            <h3 className="text-xl font-bold mb-2">Nova Reserva</h3>
            <p className="text-blue-200">Criar uma nova reserva manualmente</p>
          </Link>

          <Link href="/admin/propriedades" className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition">
            <div className="text-4xl mb-2">🏠</div>
            <h3 className="text-xl font-bold mb-2">Gerenciar Propriedades</h3>
            <p className="text-purple-200">Adicionar ou editar propriedades</p>
          </Link>

          <Link href="/admin/servicos" className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition">
            <div className="text-4xl mb-2">⭐</div>
            <h3 className="text-xl font-bold mb-2">Serviços</h3>
            <p className="text-green-200">Gerenciar serviços de concierge</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
