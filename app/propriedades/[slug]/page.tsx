'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { properties as defaultProperties } from '@/lib/properties-data'

const STORAGE_KEY = 'capitolio_properties'

type Property = {
  id: string
  name: string
  slug: string
  shortDesc: string
  description: string
  address: string
  city: string
  state: string
  bedrooms: number
  bathrooms: number
  maxGuests: number
  area: number
  pricePerNight: number
  cleaningFee: number
  amenities: string[]
  images: string[]
  googleDriveLinks: string[]
  featured: boolean
  active: boolean
}

export default function PropertyPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [property, setProperty] = useState<Property | null>(null)
  const [currentImage, setCurrentImage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Try localStorage first (admin edits)
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const props: Property[] = JSON.parse(saved)
        const found = props.find(p => p.slug === slug)
        if (found) {
          setProperty(found)
          setLoading(false)
          return
        }
      }
    } catch {}
    // Fall back to static data
    const found = defaultProperties.find(p => p.slug === slug) as Property | undefined
    setProperty(found || null)
    setLoading(false)
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-4">Propriedade não encontrada</p>
          <Link href="/" className="text-blue-900 hover:underline">← Voltar ao início</Link>
        </div>
      </div>
    )
  }

  const images = property.images?.filter(img => img.startsWith('http') || img.startsWith('data:')) || []
  const hasImages = images.length > 0

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
        {hasImages ? (
          <div className="relative h-96 bg-gray-900 overflow-hidden">
            <img
              src={images[currentImage]}
              alt={property.name}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage(i => (i - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70 transition text-xl"
                >
                  ‹
                </button>
                <button
                  onClick={() => setCurrentImage(i => (i + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70 transition text-xl"
                >
                  ›
                </button>
              </>
            )}

            {/* Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-2 h-2 rounded-full transition ${i === currentImage ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            )}

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 flex gap-1 p-2 bg-black/30">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`flex-1 h-12 overflow-hidden rounded transition ${i === currentImage ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-80'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="h-96 bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 text-center text-white">
              <p className="text-xl">📸 Fotos em breve</p>
              <p className="text-sm mt-2 opacity-80">Imagens serão adicionadas em breve</p>
            </div>
          </div>
        )}

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
                  <p className="font-semibold">{property.bedrooms} quartos</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚿</span>
                  <p className="font-semibold">{property.bathrooms} banheiros</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👥</span>
                  <p className="font-semibold">até {property.maxGuests} hóspedes</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📐</span>
                  <p className="font-semibold">{property.area} m²</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Sobre a Propriedade</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>

              {/* Amenities */}
              {property.amenities?.length > 0 && (
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
              )}
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg sticky top-24">
                <div className="mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Diárias</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-blue-900">
                      R$ {property.pricePerNight.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-gray-600 text-sm">/pessoa</span>
                  </div>
                </div>

                {property.cleaningFee > 0 && (
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
