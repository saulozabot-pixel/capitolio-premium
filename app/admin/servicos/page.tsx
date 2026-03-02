import Link from 'next/link'

const mockServicos = [
  {
    id: '1',
    type: 'lancha',
    name: 'Passeio de Lancha',
    description: 'Explore os cânions e praias da represa com lancha privativa',
    price: 800,
    unit: 'hora',
    active: true,
    emoji: '🚤',
  },
  {
    id: '2',
    type: 'jetski',
    name: 'Jet Ski',
    description: 'Adrenalina e diversão nas águas cristalinas de Capitólio',
    price: 400,
    unit: 'hora',
    active: true,
    emoji: '🏄',
  },
  {
    id: '3',
    type: 'chef',
    name: 'Personal Chef',
    description: 'Chef particular para preparar refeições gourmet na casa',
    price: 1200,
    unit: 'dia',
    active: true,
    emoji: '👨‍🍳',
  },
  {
    id: '4',
    type: 'transfer',
    name: 'Transfer Aeroporto',
    description: 'Transporte confortável do aeroporto até sua mansão',
    price: 350,
    unit: 'trecho',
    active: true,
    emoji: '🚗',
  },
  {
    id: '5',
    type: 'massagem',
    name: 'Massagem Relaxante',
    description: 'Massagem profissional no conforto da sua mansão',
    price: 250,
    unit: 'sessão',
    active: false,
    emoji: '💆',
  },
  {
    id: '6',
    type: 'decoracao',
    name: 'Decoração Especial',
    description: 'Decoração romântica ou temática para ocasiões especiais',
    price: 600,
    unit: 'evento',
    active: true,
    emoji: '🌹',
  },
]

export default function AdminServicos() {
  const totalAtivos = mockServicos.filter(s => s.active).length

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
            <Link href="/admin/reservas" className="text-gray-600 hover:text-blue-900">
              Reservas
            </Link>
            <Link href="/admin/propriedades" className="text-gray-600 hover:text-blue-900">
              Propriedades
            </Link>
            <Link href="/admin/servicos" className="font-semibold text-blue-900 border-b-2 border-blue-900 pb-2">
              Serviços
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Catálogo de Serviços</h2>
            <p className="text-gray-600 text-sm mt-1">{totalAtivos} serviços ativos de {mockServicos.length} cadastrados</p>
          </div>
          <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition text-sm font-semibold">
            + Novo Serviço
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-green-600">{totalAtivos}</p>
            <p className="text-gray-600 text-sm">Serviços Ativos</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-red-500">{mockServicos.length - totalAtivos}</p>
            <p className="text-gray-600 text-sm">Serviços Inativos</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-blue-900">
              R$ {Math.min(...mockServicos.map(s => s.price)).toLocaleString('pt-BR')} - R$ {Math.max(...mockServicos.map(s => s.price)).toLocaleString('pt-BR')}
            </p>
            <p className="text-gray-600 text-sm">Faixa de Preços</p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockServicos.map((servico) => (
            <div key={servico.id} className={`bg-white rounded-xl shadow p-6 ${!servico.active ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{servico.emoji}</span>
                  <div>
                    <h3 className="font-bold text-lg">{servico.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      servico.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {servico.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{servico.description}</p>

              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div>
                  <span className="text-2xl font-bold text-blue-900">
                    R$ {servico.price.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-gray-500 text-sm">/{servico.unit}</span>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
                  {servico.type}
                </span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-blue-900 text-white py-2 rounded-full text-sm hover:bg-blue-800 transition">
                  Editar
                </button>
                <button className={`flex-1 py-2 rounded-full text-sm transition ${
                  servico.active
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}>
                  {servico.active ? 'Desativar' : 'Ativar'}
                </button>
              </div>
            </div>
          ))}

          {/* Add New Service Card */}
          <div className="bg-white rounded-xl shadow border-2 border-dashed border-gray-300 flex items-center justify-center min-h-48">
            <div className="text-center p-6">
              <p className="text-4xl mb-3">+</p>
              <p className="text-gray-600 font-semibold text-sm mb-3">Novo Serviço</p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-full text-sm hover:bg-green-700 transition">
                Adicionar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
