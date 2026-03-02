import Link from 'next/link'
import { properties } from '@/lib/properties-data'

export default function AdminPropriedades() {
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
            <Link href="/admin/propriedades" className="font-semibold text-blue-900 border-b-2 border-blue-900 pb-2">
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
          <h2 className="text-2xl font-bold">Gerenciar Propriedades</h2>
          <button className="bg-blue-900 text-white px-6 py-2 rounded-full hover:bg-blue-800 transition text-sm font-semibold">
            + Nova Propriedade
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow overflow-hidden">
              {/* Property Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 text-center text-white">
                  <p className="text-4xl mb-2">🏠</p>
                  <p className="text-sm opacity-80">Fotos em breve</p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold">{property.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${property.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {property.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4">{property.shortDesc}</p>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <p className="font-bold text-blue-900">{property.bedrooms}</p>
                    <p className="text-xs text-gray-600">Quartos</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <p className="font-bold text-blue-900">{property.bathrooms}</p>
                    <p className="text-xs text-gray-600">Banheiros</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <p className="font-bold text-blue-900">{property.maxGuests}</p>
                    <p className="text-xs text-gray-600">Hóspedes</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <p className="font-bold text-blue-900">R$ {(property.pricePerNight / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-gray-600">/noite</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Links do Google Drive:</p>
                  {property.googleDriveLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs text-blue-600 hover:underline truncate mb-1"
                    >
                      📁 Drive {i + 1}: {link.split('/').pop()}
                    </a>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/propriedades/${property.slug}`}
                    className="flex-1 text-center bg-gray-100 text-gray-800 py-2 rounded-full text-sm hover:bg-gray-200 transition"
                  >
                    Ver Página
                  </Link>
                  <button className="flex-1 bg-blue-900 text-white py-2 rounded-full text-sm hover:bg-blue-800 transition">
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Property Card */}
          <div className="bg-white rounded-xl shadow border-2 border-dashed border-gray-300 flex items-center justify-center min-h-64">
            <div className="text-center p-8">
              <p className="text-5xl mb-4">+</p>
              <p className="text-gray-600 font-semibold mb-2">Adicionar Nova Propriedade</p>
              <p className="text-gray-400 text-sm mb-4">Cadastre uma nova mansão no sistema</p>
              <button className="bg-blue-900 text-white px-6 py-2 rounded-full text-sm hover:bg-blue-800 transition">
                Adicionar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
