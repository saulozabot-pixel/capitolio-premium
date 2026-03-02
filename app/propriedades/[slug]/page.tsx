import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPropertyBySlug } from '@/lib/properties-data'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params
  const property = getPropertyBySlug(slug)

  if (!property) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-900">
            Capitólio Premium
          </Link>
          <Link href="/" className="text-gray-700 hover:text-blue-900">
            ← Voltar
          </Link>
        </nav>
      </header>

      <div className="pt-20">
        {/* Image Gallery */}
        <div className="h-96 bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 text-center text-white">
            <p className="text-xl">📸 Fotos em breve</p>
            <p className="text-sm mt-2 opacity-80">Imagens do Google Drive serão adicionadas</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Property Details */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{property.name}</h1>
              <p className="text-gray-600 text-lg mb-6">{property.address}</p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🛏️</span>
                  <div>
                    <p className="font-semibold">{property.bedrooms} quartos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚿</span>
                  <div>
                    <p className="font-semibold">{property.bathrooms} banheiros</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👥</span>
                  <div>
                    <p className="font-semibold">até {property.maxGuests} hóspedes</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📐</span>
                  <div>
                    <p className="font-semibold">{property.area} m²</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Sobre a Propriedade</h2>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">Comodidades</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-green-500 font-bold">✓</span>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg sticky top-24">
                <div className="mb-6">
                  <span className="text-3xl font-bold text-blue-900">
                    R$ {property.pricePerNight.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-gray-600">/noite</span>
                </div>

                {property.cleaningFee && (
                  <div className="flex justify-between text-sm text-gray-600 mb-4 pb-4 border-b">
                    <span>Taxa de limpeza</span>
                    <span>R$ {property.cleaningFee.toLocaleString('pt-BR')}</span>
                  </div>
                )}

                <Link
                  href={`/reservar?property=${property.id}`}
                  className="block w-full text-center bg-blue-900 text-white py-4 rounded-full font-semibold hover:bg-blue-800 transition text-lg mb-4"
                >
                  Reservar Agora
                </Link>

                <a
                  href="https://wa.me/5500000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-green-500 text-white py-4 rounded-full font-semibold hover:bg-green-600 transition"
                >
                  💬 Consultar via WhatsApp
                </a>

                <p className="text-center text-gray-500 text-sm mt-4">
                  Sem cobrança até confirmar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return [
    { slug: 'rancho-beira-represa' },
    { slug: 'casa-premium-capitolio' },
  ]
}
