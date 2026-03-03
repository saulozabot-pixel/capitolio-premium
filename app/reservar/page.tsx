'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { properties } from '@/lib/properties-data'

function ReservarForm() {
  const searchParams = useSearchParams()
  const propertyParam = searchParams.get('property') || ''

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    propertyId: propertyParam,
    checkIn: '',
    checkOut: '',
    guests: 1,
    name: '',
    email: '',
    phone: '',
    document: '',
    services: [] as string[],
    notes: ''
  })

  // Sync if URL param changes after mount
  useEffect(() => {
    if (propertyParam) {
      setFormData(prev => ({ ...prev, propertyId: propertyParam }))
    }
  }, [propertyParam])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Build WhatsApp message with reservation details
    const prop = properties.find(p => p.id === formData.propertyId)
    const msg = encodeURIComponent(
      `Olá! Gostaria de confirmar minha reserva:\n\n` +
      `🏡 Propriedade: ${prop?.name || formData.propertyId}\n` +
      `📅 Check-in: ${formData.checkIn}\n` +
      `📅 Check-out: ${formData.checkOut}\n` +
      `👥 Hóspedes: ${formData.guests}\n` +
      `👤 Nome: ${formData.name}\n` +
      `📧 E-mail: ${formData.email}\n` +
      `📱 Telefone: ${formData.phone}\n` +
      (formData.notes ? `📝 Obs: ${formData.notes}` : '')
    )
    window.open(`https://wa.me/5535999999999?text=${msg}`, '_blank')
  }

  const selectedProperty = properties.find(p => p.id === formData.propertyId)
  const nights = formData.checkIn && formData.checkOut
    ? Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const subtotal = selectedProperty && nights > 0 ? selectedProperty.pricePerNight * nights : 0
  const cleaningFee = selectedProperty?.cleaningFee || 0
  const total = subtotal + cleaningFee

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-900">
            Capitólio Premium
          </Link>
          <Link href="/" className="text-gray-700 hover:text-blue-900">
            ← Voltar para Home
          </Link>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Fazer Reserva</h1>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-900' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-900 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2 hidden sm:inline">Propriedade & Datas</span>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-blue-900' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-900 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2 hidden sm:inline">Seus Dados</span>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className={`flex items-center ${step >= 3 ? 'text-blue-900' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-blue-900 text-white' : 'bg-gray-300'}`}>
                3
              </div>
              <span className="ml-2 hidden sm:inline">Confirmação</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Form Steps */}
            <div className="lg:col-span-2">
              {/* Step 1: Property & Dates */}
              {step === 1 && (
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <h2 className="text-2xl font-bold mb-6">Escolha a Propriedade e Datas</h2>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Propriedade *
                    </label>
                    <select
                      value={formData.propertyId}
                      onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecione uma propriedade</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} - R$ {p.pricePerNight.toLocaleString('pt-BR')}/noite
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Check-in *
                      </label>
                      <input
                        type="date"
                        value={formData.checkIn}
                        onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Check-out *
                      </label>
                      <input
                        type="date"
                        value={formData.checkOut}
                        onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Número de Hóspedes *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedProperty?.maxGuests || 20}
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!formData.propertyId || !formData.checkIn || !formData.checkOut}
                    className="w-full bg-blue-900 text-white py-4 rounded-full font-semibold hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuar →
                  </button>
                </div>
              )}

              {/* Step 2: Guest Info */}
              {step === 2 && (
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <h2 className="text-2xl font-bold mb-6">Seus Dados</h2>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">CPF *</label>
                      <input
                        type="text"
                        value={formData.document}
                        onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Observações</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Alguma necessidade especial ou pedido?"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-200 text-gray-800 py-4 rounded-full font-semibold hover:bg-gray-300 transition"
                    >
                      Voltar
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={!formData.name || !formData.email || !formData.phone}
                      className="flex-1 bg-blue-900 text-white py-4 rounded-full font-semibold hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continuar →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <h2 className="text-2xl font-bold mb-6">Confirmar Reserva</h2>

                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-lg mb-4">Resumo</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Propriedade:</span>
                        <span className="font-semibold">{selectedProperty?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-in:</span>
                        <span className="font-semibold">{formData.checkIn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-out:</span>
                        <span className="font-semibold">{formData.checkOut}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hóspedes:</span>
                        <span className="font-semibold">{formData.guests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nome:</span>
                        <span className="font-semibold">{formData.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 bg-gray-200 text-gray-800 py-4 rounded-full font-semibold hover:bg-gray-300 transition"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-900 text-white py-4 rounded-full font-semibold hover:bg-blue-800 transition"
                    >
                      Confirmar Reserva
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-4">
                <h3 className="text-xl font-bold mb-4">Resumo da Reserva</h3>

                {selectedProperty ? (
                  <>
                    <div className="mb-4 pb-4 border-b">
                      <p className="font-semibold">{selectedProperty.name}</p>
                      <p className="text-sm text-gray-600">{selectedProperty.shortDesc}</p>
                    </div>

                    {nights > 0 && (
                      <div className="space-y-3 mb-4 pb-4 border-b">
                        <div className="flex justify-between text-sm">
                          <span>R$ {selectedProperty.pricePerNight.toLocaleString('pt-BR')} x {nights} {nights === 1 ? 'noite' : 'noites'}</span>
                          <span className="font-semibold">R$ {subtotal.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Taxa de limpeza</span>
                          <span className="font-semibold">R$ {cleaningFee.toLocaleString('pt-BR')}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span className="text-blue-900 text-2xl">
                        R$ {total.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Selecione uma propriedade para ver o resumo
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ReservarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ReservarForm />
    </Suspense>
  )
}
