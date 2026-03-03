'use client'

import { useState, useEffect, useRef } from 'react'
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

// Compress image using Canvas API
async function compressImage(file: File, maxWidth = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
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
  const [amenitiesText, setAmenitiesText] = useState((property.amenities || []).join('\n'))
  // URL-based images (one per line)
  const [urlImagesText, setUrlImagesText] = useState(
    (property.images || []).filter(img => img.startsWith('http')).join('\n')
  )
  // Uploaded images (base64 data URLs)
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    (property.images || []).filter(img => img.startsWith('data:'))
  )
  const [driveText, setDriveText] = useState((property.googleDriveLinks || []).join('\n'))
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const set = (field: keyof Property, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    setUploadError('')

    try {
      const compressed = await Promise.all(files.map(f => compressImage(f)))
      setUploadedImages(prev => [...prev, ...compressed])
    } catch {
      setUploadError('Erro ao processar imagens. Tente novamente.')
    } finally {
      setUploading(false)
      // Reset file input so same files can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeUrlImage = (index: number) => {
    const lines = urlImagesText.split('\n').filter(u => u.trim())
    lines.splice(index, 1)
    setUrlImagesText(lines.join('\n'))
  }

  const handleSave = () => {
    const urlImages = urlImagesText.split('\n').map(s => s.trim()).filter(Boolean)
    const allImages = [...urlImages, ...uploadedImages]

    const updated: Property = {
      ...form,
      amenities: amenitiesText.split('\n').map(s => s.trim()).filter(Boolean),
      images: allImages,
      googleDriveLinks: driveText.split('\n').map(s => s.trim()).filter(Boolean),
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      id: form.id || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    }
    onSave(updated)
  }

  const urlImageList = urlImagesText.split('\n').filter(u => u.trim().startsWith('http'))

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

          {/* ===== SEÇÃO DE FOTOS ===== */}
          <div className="border border-gray-200 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              📸 Fotos da Propriedade
            </h3>

            {/* Upload do Computador */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📁 Selecionar do Computador
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-blue-600">Processando imagens...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">🖼️</span>
                    <p className="text-sm font-semibold text-blue-700">Clique para abrir o explorador de arquivos</p>
                    <p className="text-xs text-gray-400">JPG, PNG, WEBP — múltiplas imagens permitidas</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              {uploadError && (
                <p className="text-xs text-red-500 mt-1">{uploadError}</p>
              )}
            </div>

            {/* Preview das imagens carregadas do computador */}
            {uploadedImages.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  ✅ {uploadedImages.length} imagem(ns) do computador:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {uploadedImages.map((img, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={img}
                        alt={`upload ${i + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => removeUploadedImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        title="Remover"
                      >
                        ×
                      </button>
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1 rounded">
                        {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* URLs de imagens externas */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                🔗 URLs de Imagens Externas <span className="text-gray-400 font-normal">(uma por linha)</span>
              </label>
              <textarea
                value={urlImagesText}
                onChange={e => setUrlImagesText(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://images.unsplash.com/photo-...&#10;https://drive.google.com/..."
              />
              <p className="text-xs text-gray-400 mt-1">Cole URLs de imagens (Unsplash, Google Drive, etc.)</p>

              {/* Preview das imagens por URL */}
              {urlImageList.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {urlImageList.map((url, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={url.trim()}
                        alt={`url ${i + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                      <button
                        onClick={() => removeUrlImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        title="Remover"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resumo total de imagens */}
            {(uploadedImages.length + urlImageList.length) > 0 && (
              <div className="bg-blue-50 rounded-lg px-3 py-2 text-xs text-blue-700">
                📊 Total: <strong>{uploadedImages.length + urlImageList.length}</strong> imagem(ns) —
                {uploadedImages.length > 0 && ` ${uploadedImages.length} do computador`}
                {uploadedImages.length > 0 && urlImageList.length > 0 && ' +'}
                {urlImageList.length > 0 && ` ${urlImageList.length} por URL`}
              </div>
            )}
          </div>

          {/* Google Drive Links */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              📁 Links do Google Drive <span className="text-gray-400 font-normal">(um por linha)</span>
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
            disabled={!form.name}
            className="flex-1 bg-blue-900 text-white py-2.5 rounded-full text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
        const parsed = JSON.parse(saved)
        // Ensure all properties have required array fields
        const normalized = parsed.map((p: Partial<Property>) => ({
          ...p,
          amenities: p.amenities || [],
          images: p.images || [],
          googleDriveLinks: p.googleDriveLinks || [],
        }))
        setProperties(normalized)
      } else {
        setProperties(defaultProperties as Property[])
      }
    } catch {
      setProperties(defaultProperties as Property[])
    }
  }, [])

  const saveToStorage = (updated: Property[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // localStorage quota exceeded (large base64 images)
      showToast('⚠️ Armazenamento cheio. Reduza o número de imagens do computador.')
      return
    }
    setProperties(updated)
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
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
    if (firstImage?.startsWith('http') || firstImage?.startsWith('data:')) return firstImage
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
        <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
          toast.startsWith('⚠️') ? 'bg-yellow-500 text-white' : 'bg-green-600 text-white'
        }`}>
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
                {/* Image count badge */}
                {property.images?.length > 0 && (
                  <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    📸 {property.images.length}
                  </div>
                )}
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
