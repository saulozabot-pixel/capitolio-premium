'use client'

import { useState, useEffect } from 'react'
import AdminNav from '@/components/AdminNav'
import Link from 'next/link'
import { properties as defaultProperties } from '@/lib/properties-data'

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

const STORAGE_KEY = 'capitolio_properties'

function emptyProperty(): Property {
  return {
    id: '',
    name: '',
    slug: '',
    shortDesc: '',
    description: '',
    address: 'Capitólio, MG',
    city: 'Capitólio',
    state: 'MG',
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 8,
    area: 300,
    pricePerNight: 2000,
    cleaningFee: 400,
    amenities: ['Piscina aquecida', 'Wi-Fi', 'Churrasqueira', 'Ar condicionado'],
    images: [],
    googleDriveLinks: [],
    featured: true,
    active: true,
  }
}

function PropertyModal({
  property,
  title,
  onSave,
  onClose,
}: {
  property: Property
  title: string
  onSave: (p: Property) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<Property>({ ...property })
  const [amenitiesText, setAmenitiesText] = useState(property.amenities.join('\n'))
  const [imagesText, setImagesText] = useState(property.images.join('\n'))
  const [driveText, setDriveText] = useState(property.googleDriveLinks.join('\n'))

  const set = (field: keyof Property, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSave = () => {
    const updated: Property = {
      ...form,
      amenities: amenitiesText.split('\n').map(s => s.trim()).filter(Boolean),
      images: imagesText.split('\n').map(s => s.trim()).filter(Boolean),
      googleDriveLinks: driveText.split('\n').map(s => s.trim()).filter(Boolean),
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      id: form.id || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    }
    onSave(updated)
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome da Propriedade *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Rancho à Beira da Represa"
            />
          </div>

          {/* Descrição curta */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição Curta</label>
            <input
              type="text"
              value={form.shortDesc}
              onChange={e => set('shortDesc', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Breve descrição para listagem"
            />
          </div>

          {/* Descrição completa */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição Completa</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descrição detalhada da propriedade..."
            />
          </div>

          {/* Valores */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Preço por Noite (R$)</label>
              <input
                type="number"
                value={form.pricePerNight}
                onChange={e => set('pricePerNight', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Taxa de Limpeza (R$)</label>
              <input
                type="number"
                value={form.cleaningFee}
                onChange={e => set('cleaningFee', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Capacidade */}
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Quartos</label>
              <input
                type="number"
                value={form.bedrooms}
                onChange={e => set('bedrooms', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Banheiros</label>
              <input
                type="number"
                value={form.bathrooms}
                onChange={e => set('bathrooms', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hóspedes</label>
              <input
                type="number"
                value={form.maxGuests}
                onChange={e => set('maxGuests', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Área (m²)</label>
              <input
                type="number"
                value={form.area}
                onChange={e => set('area', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Fotos */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              URLs das Fotos <span className="text-gray-400 font-normal">(uma por linha)</span>
            </label>
            <textarea
              value={imagesText}
              onChange={e => setImagesText(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://images.unsplash.com/photo-...&#10;https://drive.google.com/..."
            />
            <p className="text-xs text-gray-400 mt-1">Cole URLs de imagens (Unsplash, Google Drive, etc.)</p>
            {/* Preview das imagens */}
            {imagesText.split('\n').filter(u => u.trim().startsWith('http')).length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {imagesText.split('\n').filter(u => u.trim().startsWith('http')).slice(0, 4).map((url, i) => (
                  <img
                    key={i}
                    src={url.trim()}
                    alt={`preview ${i + 1}`}
                    className="w-20 h-16 object-cover rounded-lg border"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Google Drive Links */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Links do Google Drive <span className="text-gray-400 font-normal">(um por linha)</span>
            </label>
            <textarea
              value={driveText}
              onChange={e => setDriveText(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://drive.google.com/drive/folders/..."
            />
          </div>

          {/* Comodidades */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Comodidades <span className="text-gray-400 font-normal">(uma por linha)</span>
            </label>
            <textarea
              value={amenitiesText}
              onChange={e => setAmenitiesText(e.target.value)}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Piscina aquecida&#10;Wi-Fi&#10;Churrasqueira&#10;Ar condicionado"
            />
          </div>

          {/* Endereço */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Endereço</label>
            <input
              type="text"
              value={form.address}
              onChange={e => set('address', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={e => set('active', e.target.checked)}
                className="w-4 h-4 accent-blue-900"
              />
              <span className="text-sm font-medium text-gray-700">Propriedade Ativa</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={e => set('featured', e.target.checked)}
                className="w-4 h-4 accent-blue-900"
              />
              <span className="text-sm font-medium text-gray-700">Destaque na Home</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-900 text-white py-2.5 rounded-full text-sm font-semibold hover:bg-blue-800 transition"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminPropriedades() {
  const [properties, setProperties] = useState<Property[]>([])
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState('')

  // Load from localStorage or default data
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setProperties(JSON.parse(saved))
      } else {
        setProperties(defaultProperties as Property[])
      }
    } catch {
      setProperties(defaultProperties as Property[])
    }
  }, [])

  const saveToStorage = (updated: Property[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setProperties(updated)
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleEdit = (property: Property) => {
    setEditingProperty(property)
  }

  const handleSaveEdit = (updated: Property) => {
    const newList = properties.map(p => p.id === updated.id ? updated : p)
    saveToStorage(newList)
    setEditingProperty(null)
    showToast('✅ Propriedade atualizada com sucesso!')
  }

  const handleAdd = (newProp: Property) => {
    const newList = [...properties, newProp]
    saveToStorage(newList)
    setShowAddModal(false)
    showToast('✅ Nova propriedade adicionada!')
  }

  const handleDelete = (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta propriedade?')) return
    const newList = properties.filter(p => p.id !== id)
    saveToStorage(newList)
    showToast('🗑️ Propriedade removida.')
  }

  const toggleActive = (id: string) => {
    const newList = properties.map(p => p.id === id ? { ...p, active: !p.active } : p)
    saveToStorage(newList)
  }

  const getImageSrc = (property: Property) => {
    const firstImage = property.images?.[0]
    if (firstImage?.startsWith('http')) return firstImage
    if (property.id === 'rancho-beira-represa') {
      return 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80'
    }
    return 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-pulse">
          {toast}
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Gerenciar Propriedades</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-900 text-white px-6 py-2 rounded-full hover:bg-blue-800 transition text-sm font-semibold"
          >
            + Nova Propriedade
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow overflow-hidden">
              {/* Property Image */}
              <div className="h-48 relative overflow-hidden">
                <img
                  src={getImageSrc(property)}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <button
                    onClick={() => toggleActive(property.id)}
                    className={`text-xs font-bold px-2 py-1 rounded-full cursor-pointer transition ${
                      property.active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}
                  >
                    {property.active ? 'Ativa' : 'Inativa'}
                  </button>
                  {property.featured && (
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-yellow-500 text-white">
                      ⭐ Destaque
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{property.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{property.shortDesc}</p>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <p className="font-bold text-blue-900 text-sm">{property.bedrooms}</p>
                    <p className="text-xs text-gray-500">Quartos</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <p className="font-bold text-blue-900 text-sm">{property.bathrooms}</p>
                    <p className="text-xs text-gray-500">Banheiros</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <p className="font-bold text-blue-900 text-sm">{property.maxGuests}</p>
                    <p className="text-xs text-gray-500">Hóspedes</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <p className="font-bold text-blue-900 text-sm">R$ {(property.pricePerNight / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-gray-500">/noite</p>
                  </div>
                </div>

                {/* Google Drive Links */}
                {property.googleDriveLinks?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Links do Google Drive:</p>
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
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Link
                    href={`/propriedades/${property.slug}`}
                    className="flex-1 text-center bg-gray-100 text-gray-800 py-2 rounded-full text-sm hover:bg-gray-200 transition font-medium"
                  >
                    Ver Página
                  </Link>
                  <button
                    onClick={() => handleEdit(property)}
                    className="flex-1 bg-blue-900 text-white py-2 rounded-full text-sm hover:bg-blue-800 transition font-medium"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="bg-red-100 text-red-600 px-3 py-2 rounded-full text-sm hover:bg-red-200 transition"
                    title="Remover"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Property Card */}
          <div
            onClick={() => setShowAddModal(true)}
            className="bg-white rounded-xl shadow border-2 border-dashed border-gray-300 flex items-center justify-center min-h-64 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
          >
            <div className="text-center p-8">
              <p className="text-5xl mb-4 text-gray-300">+</p>
              <p className="text-gray-600 font-semibold mb-2">Adicionar Nova Propriedade</p>
              <p className="text-gray-400 text-sm mb-4">Cadastre uma nova mansão no sistema</p>
              <button
                onClick={e => { e.stopPropagation(); setShowAddModal(true) }}
                className="bg-blue-900 text-white px-6 py-2 rounded-full text-sm hover:bg-blue-800 transition"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingProperty && (
        <PropertyModal
          property={editingProperty}
          title={`Editar: ${editingProperty.name}`}
          onSave={handleSaveEdit}
          onClose={() => setEditingProperty(null)}
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <PropertyModal
          property={emptyProperty()}
          title="Adicionar Nova Propriedade"
          onSave={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}
