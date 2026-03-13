'use client'

import { useState, useEffect, useRef } from 'react'
import AdminNav from '@/components/AdminNav'
import Link from 'next/link'

type Property = {
  id: string
  name: string
  slug: string
  shortDesc: string | null
  description: string
  address: string
  city: string
  state: string
  bedrooms: number
  bathrooms: number
  maxGuests: number
  area: number | null
  pricePerNight: number
  cleaningFee: number | null
  amenities: string[]
  images: string[]
  featured: boolean
  active: boolean
  _count?: { bookings: number }
}

type Booking = {
  id: string
  guestName: string
  guestEmail: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: string
  paymentStatus: string
}

// ─── Compress image ────────────────────────────────────────────────────────────
async function compressImage(file: File, maxWidth = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth }
        canvas.width = width; canvas.height = height
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ─── Histórico Modal ───────────────────────────────────────────────────────────
function HistoricoModal({ property, onClose }: { property: Property; onClose: () => void }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/bookings?propertyId=${property.id}`)
      .then(r => r.json())
      .then(data => { setBookings(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [property.id])

  const statusLabel: Record<string, { label: string; className: string }> = {
    confirmed: { label: 'Confirmada', className: 'bg-green-100 text-green-800' },
    pending:   { label: 'Pendente',   className: 'bg-yellow-100 text-yellow-800' },
    cancelled: { label: 'Cancelada',  className: 'bg-red-100 text-red-800' },
    completed: { label: 'Concluída',  className: 'bg-blue-100 text-blue-800' },
    paid:      { label: 'Pago',       className: 'bg-green-100 text-green-800' },
  }

  const total = bookings.reduce((sum, b) => sum + b.totalPrice, 0)

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Histórico — {property.name}</h2>
            {!loading && <p className="text-sm text-gray-500">{bookings.length} reserva(s) · R$ {total.toLocaleString('pt-BR')} faturado</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          {loading && <p className="text-center text-gray-400 py-8">Carregando...</p>}
          {!loading && bookings.length === 0 && (
            <p className="text-center text-gray-400 py-8">Nenhuma reserva para esta propriedade.</p>
          )}
          {!loading && bookings.length > 0 && (
            <div className="space-y-3">
              {bookings.map(b => {
                const s = statusLabel[b.status] ?? statusLabel.pending
                return (
                  <div key={b.id} className="border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{b.guestName}</p>
                      <p className="text-xs text-gray-500">{b.guestEmail}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(b.checkIn).toLocaleDateString('pt-BR')} → {new Date(b.checkOut).toLocaleDateString('pt-BR')} · {b.guests} hóspedes
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.className}`}>{s.label}</span>
                      <span className="font-bold text-gray-900 text-sm">R$ {b.totalPrice.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div className="p-6 border-t">
          <button onClick={onClose} className="w-full bg-gray-100 text-gray-800 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Edit/Add Modal ────────────────────────────────────────────────────────────
function PropertyModal({ property, title, onSave, onClose }: {
  property: Property; title: string; onSave: (p: Property) => void; onClose: () => void
}) {
  const [form, setForm] = useState<Property>({ ...property })
  const [amenitiesText, setAmenitiesText] = useState((property.amenities || []).join('\n'))
  const [urlImagesText, setUrlImagesText] = useState(
    (property.images || []).filter(img => img.startsWith('http')).join('\n')
  )
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    (property.images || []).filter(img => img.startsWith('data:'))
  )
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const set = (field: keyof Property, value: unknown) => setForm(prev => ({ ...prev, [field]: value }))

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    try {
      const compressed = await Promise.all(files.map(f => compressImage(f)))
      setUploadedImages(prev => [...prev, ...compressed])
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSave = () => {
    setSaving(true)
    const urlImages = urlImagesText.split('\n').map(s => s.trim()).filter(Boolean)
    const allImages = [...urlImages, ...uploadedImages]
    const updated: Property = {
      ...form,
      amenities: amenitiesText.split('\n').map(s => s.trim()).filter(Boolean),
      images: allImages,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    }
    onSave(updated)
  }

  const urlImageList = urlImagesText.split('\n').filter(u => u.trim().startsWith('http'))

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome da Propriedade *</label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Rancho à Beira da Represa" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição Curta</label>
            <input type="text" value={form.shortDesc || ''} onChange={e => set('shortDesc', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Breve descrição para listagem" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição Completa</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descrição detalhada..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Preço por Pessoa/Noite (R$)</label>
              <input type="number" value={form.pricePerNight} onChange={e => set('pricePerNight', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Taxa de Limpeza (R$)</label>
              <input type="number" value={form.cleaningFee || 0} onChange={e => set('cleaningFee', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Quartos', field: 'bedrooms' },
              { label: 'Banheiros', field: 'bathrooms' },
              { label: 'Hóspedes', field: 'maxGuests' },
              { label: 'Área (m²)', field: 'area' },
            ].map(({ label, field }) => (
              <div key={field}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                <input type="number" value={(form[field as keyof Property] as number) || 0}
                  onChange={e => set(field as keyof Property, Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
          </div>

          {/* Fotos */}
          <div className="border border-gray-200 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-bold text-gray-800">📸 Fotos da Propriedade</h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">📁 Upload do Computador</label>
              <div onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-300 rounded-xl p-5 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                {uploading ? (
                  <p className="text-sm text-blue-600">Processando...</p>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">🖼️</span>
                    <p className="text-sm font-semibold text-blue-700">Clique para selecionar fotos</p>
                    <p className="text-xs text-gray-400">JPG, PNG, WEBP — múltiplas permitidas</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
            </div>

            {uploadedImages.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">{uploadedImages.length} foto(s) do computador:</p>
                <div className="grid grid-cols-4 gap-2">
                  {uploadedImages.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt="" className="w-full h-20 object-cover rounded-lg border" />
                      <button onClick={() => setUploadedImages(prev => prev.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                🔗 URLs de Imagens <span className="text-gray-400 font-normal">(uma por linha)</span>
              </label>
              <textarea value={urlImagesText} onChange={e => setUrlImagesText(e.target.value)} rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..." />
            </div>

            {urlImageList.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {urlImageList.map((url, i) => (
                  <img key={i} src={url.trim()} alt="" className="w-full h-20 object-cover rounded-lg border"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                ))}
              </div>
            )}

            {(uploadedImages.length + urlImageList.length) > 0 && (
              <p className="text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-2">
                Total: <strong>{uploadedImages.length + urlImageList.length}</strong> foto(s)
              </p>
            )}
          </div>

          {/* Comodidades */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Comodidades <span className="text-gray-400 font-normal">(uma por linha)</span>
            </label>
            <textarea value={amenitiesText} onChange={e => setAmenitiesText(e.target.value)} rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Piscina aquecida&#10;Wi-Fi&#10;Churrasqueira" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Endereço</label>
            <input type="text" value={form.address} onChange={e => set('address', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="w-4 h-4 accent-blue-900" />
              <span className="text-sm font-medium text-gray-700">Propriedade Ativa</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 accent-blue-900" />
              <span className="text-sm font-medium text-gray-700">Destaque na Home</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t sticky bottom-0 bg-white">
          <button onClick={onClose} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={!form.name || saving}
            className="flex-1 bg-blue-900 text-white py-2.5 rounded-full text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-50">
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Página Principal ──────────────────────────────────────────────────────────
export default function AdminPropriedades() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [historicoProperty, setHistoricoProperty] = useState<Property | null>(null)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500) }

  useEffect(() => {
    fetch('/api/admin/properties')
      .then(r => r.json())
      .then(data => { setProperties(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSaveEdit = async (updated: Property) => {
    const res = await fetch(`/api/admin/properties/${updated.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    if (res.ok) {
      const saved = await res.json()
      setProperties(prev => prev.map(p => p.id === saved.id ? saved : p))
      setEditingProperty(null)
      showToast('✅ Propriedade atualizada!')
    } else {
      showToast('❌ Erro ao salvar. Tente novamente.')
    }
  }

  const handleAdd = async (newProp: Property) => {
    const res = await fetch('/api/admin/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProp),
    })
    if (res.ok) {
      const saved = await res.json()
      setProperties(prev => [...prev, saved])
      setShowAddModal(false)
      showToast('✅ Nova propriedade adicionada!')
    } else {
      showToast('❌ Erro ao criar propriedade.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remover esta propriedade? As reservas vinculadas também serão removidas.')) return
    const res = await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setProperties(prev => prev.filter(p => p.id !== id))
      showToast('🗑️ Propriedade removida.')
    }
  }

  const handleToggleActive = async (property: Property) => {
    const res = await fetch(`/api/admin/properties/${property.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !property.active }),
    })
    if (res.ok) {
      const saved = await res.json()
      setProperties(prev => prev.map(p => p.id === saved.id ? { ...p, active: saved.active } : p))
    }
  }

  const getImageSrc = (p: Property) => {
    const first = p.images?.[0]
    if (first?.startsWith('http') || first?.startsWith('data:')) return first
    return 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80'
  }

  const emptyProperty = (): Property => ({
    id: '', name: '', slug: '', shortDesc: '', description: '',
    address: 'Capitólio, MG', city: 'Capitólio', state: 'MG',
    bedrooms: 4, bathrooms: 3, maxGuests: 8, area: 300,
    pricePerNight: 2000, cleaningFee: 400,
    amenities: ['Piscina aquecida', 'Wi-Fi', 'Churrasqueira', 'Ar condicionado'],
    images: [], featured: true, active: true,
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />

      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${toast.startsWith('❌') ? 'bg-red-500 text-white' : 'bg-green-600 text-white'}`}>
          {toast}
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Gerenciar Propriedades</h2>
          <button onClick={() => setShowAddModal(true)}
            className="bg-blue-900 text-white px-6 py-2 rounded-full hover:bg-blue-800 transition text-sm font-semibold">
            + Nova Propriedade
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {properties.map(property => (
            <div key={property.id} className="bg-white rounded-xl shadow overflow-hidden">
              <div className="h-48 relative overflow-hidden">
                <img src={getImageSrc(property)} alt={property.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <button onClick={() => handleToggleActive(property)}
                    className={`text-xs font-bold px-2 py-1 rounded-full cursor-pointer transition ${property.active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {property.active ? 'Ativa' : 'Inativa'}
                  </button>
                  {property.featured && (
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-yellow-500 text-white">⭐ Destaque</span>
                  )}
                </div>
                {property.images?.length > 0 && (
                  <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    📸 {property.images.length}
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{property.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{property.shortDesc}</p>

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
                    <p className="font-bold text-blue-900 text-sm">R$ {(Number(property.pricePerNight) / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-gray-500">/pessoa</p>
                  </div>
                </div>

                {property._count && (
                  <p className="text-xs text-gray-500 mb-3">
                    📅 {property._count.bookings} reserva(s) no histórico
                  </p>
                )}

                <div className="flex gap-2">
                  <Link href={`/propriedades/${property.slug}`}
                    className="flex-1 text-center bg-gray-100 text-gray-800 py-2 rounded-full text-sm hover:bg-gray-200 transition font-medium">
                    Ver Página
                  </Link>
                  <button onClick={() => setHistoricoProperty(property)}
                    className="flex-1 bg-purple-100 text-purple-800 py-2 rounded-full text-sm hover:bg-purple-200 transition font-medium">
                    📋 Histórico
                  </button>
                  <button onClick={() => setEditingProperty({ ...property })}
                    className="flex-1 bg-blue-900 text-white py-2 rounded-full text-sm hover:bg-blue-800 transition font-medium">
                    ✏️ Editar
                  </button>
                  <button onClick={() => handleDelete(property.id)}
                    className="bg-red-100 text-red-600 px-3 py-2 rounded-full text-sm hover:bg-red-200 transition"
                    title="Remover">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!loading && (
            <div onClick={() => setShowAddModal(true)}
              className="bg-white rounded-xl shadow border-2 border-dashed border-gray-300 flex items-center justify-center min-h-64 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
              <div className="text-center p-8">
                <p className="text-5xl mb-4 text-gray-300">+</p>
                <p className="text-gray-600 font-semibold mb-1">Nova Propriedade</p>
                <p className="text-gray-400 text-sm">Cadastre uma nova mansão</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {editingProperty && (
        <PropertyModal property={editingProperty} title={`Editar: ${editingProperty.name}`}
          onSave={handleSaveEdit} onClose={() => setEditingProperty(null)} />
      )}
      {showAddModal && (
        <PropertyModal property={emptyProperty()} title="Nova Propriedade"
          onSave={handleAdd} onClose={() => setShowAddModal(false)} />
      )}
      {historicoProperty && (
        <HistoricoModal property={historicoProperty} onClose={() => setHistoricoProperty(null)} />
      )}
    </div>
  )
}
