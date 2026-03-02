'use client'

import { useState } from 'react'
import Link from 'next/link'
import { properties } from '@/lib/properties-data'

export default function ReservarPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    propertyId: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Reserva será processada! (Integração de pagamento em breve)')
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

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Steps */}
            <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg">
              {/* Step 1: Property & Dates */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Escolha a Propriedade e Datas</h2>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Propriedade *</label>
                    <select 
                      required
                      value={formData.propertyId}
                      onChange={(e) => setFormData({...formData, propertyId: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    >
                      <option value="">Selecione uma propriedade</option>
                      {properties.map(prop => (
                        <option key={prop.id} value={prop.id}>
                          {prop.name} - R$ {prop.pricePerNight.toLocaleString('pt-BR')}/noite
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Check-in *</label>
                      <input 
                        type="date"
                        required
                        value={formData.checkIn}
                        onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Check-out *</label>
                      <input 
                        type="date"
                        required
                        value={formData.checkOut}
                        onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Número de Hóspedes *</label>
                    <select 
                      required
                      value={formData.guests}
                      onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    >
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'hóspede' : 'hóspedes'}</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full bg-blue-900 text-white py-4 rounded-full font-semibold hover:bg-blue-800 transition"
                  >
                    Continuar
                  </button>
                </div>
              )}

              {/* Step 2: Guest Info */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Seus Dados</h2>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Nome Completo *</label>
                    <input 
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      placeholder="João Silva"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                      <input 
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                        placeholder="joao@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Telefone *</label>
                      <input 
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">CPF/CNPJ *</label>
                    <input 
                      type="text"
                      required
                      value={formData.document}
                      onChange={(e) => setFormData({...formData, document: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      placeholder="000.000.000-00"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Observações</label>
                    <textarea 
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      placeholder="Alguma informação adicional ou pedido especial?"
                    ></textarea>
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
                      className="flex-1 bg-blue-900 text-white py-4 rounded-full font-semibold hover:bg-blue-800 transition"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Confirme sua Reserva</h2>
                  
                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <div>
                      <span className="text-gray-600">Propriedade:</span>
                      <p className="font-semibold">{selectedProperty?.name}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Check-in:</span>
                        <p className="font-semibold">{formData.checkIn ? new Date(formData.checkIn).toLocaleDateString('pt-BR') : '-'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Check-out:</span>
                        <p className="font-semibold">{formData.checkOut ? new Date(formData.checkOut).toLocaleDateString('pt-BR') : '-'}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Hóspedes:</span>
                      <p className="font-semibold">{formData.guests} {formData.guests === 1 ? 'pessoa' : 'pessoas'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Nome:</span>
                      <p className="font-semibold">{formData.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="font-semibold">{formData.email}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-lg">
                    <p className="text-blue-900 font-semibold mb-2">🔒 Pagamento Seguro</p>
                    <p className="text-blue-800 text-sm">
                      A integração de pagamento será habilitada em breve. Por enquanto, nossa equipe entrará em contato para finalizar a reserva.
                    </p>
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
