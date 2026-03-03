'use client'

import { useState } from 'react'
import AdminNav from '@/components/AdminNav'

type Servico = {
  id: string
  type: string
  name: string
  description: string
  price: number
  unit: string
  active: boolean
  emoji: string
}

const initialServicos: Servico[] = [
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

const unitOptions = ['hora', 'dia', 'sessão', 'trecho', 'evento', 'pessoa', 'pacote']

const emojiOptions = [
  '🚤', '🏄', '👨‍🍳', '🚗', '💆', '🌹', '🚁', '🍷', '📸',
  '⛵', '🎣', '🏊', '🎉', '🌅', '🏡', '🎸', '🍽️', '🛁',
]

function emptyServico(): Servico {
  return {
    id: '',
    type: '',
    name: '',
    description: '',
    price: 0,
    unit: 'hora',
    active: true,
    emoji: '⭐',
  }
}

// ─── Modal: Editar / Novo Serviço ─────────────────────────────────────────────
function ServicoModal({
  servico,
  title,
  onSave,
  onClose,
}: {
  servico: Servico
  title: string
  onSave: (s: Servico) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<Servico>({ ...servico })
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const set = (field: keyof Servico, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }))

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Emoji picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ícone</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(v => !v)}
                className="text-4xl w-16 h-16 border-2 border-gray-200 rounded-xl hover:border-blue-400 transition flex items-center justify-center"
                title="Selecionar emoji"
              >
                {form.emoji}
              </button>
              <span className="text-sm text-gray-500">Clique para escolher o ícone</span>
            </div>
            {showEmojiPicker && (
              <div className="mt-2 p-3 border border-gray-200 rounded-xl bg-gray-50 flex flex-wrap gap-2">
                {emojiOptions.map(e => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => { set('emoji', e); setShowEmojiPicker(false) }}
                    className={`text-2xl w-10 h-10 rounded-lg hover:bg-blue-100 transition flex items-center justify-center ${
                      form.emoji === e ? 'bg-blue-100 ring-2 ring-blue-400' : ''
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do Serviço *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Passeio de Lancha"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo / Categoria</label>
            <input
              type="text"
              value={form.type}
              onChange={e => set('type', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: lancha, chef, transfer..."
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva o serviço oferecido..."
            />
          </div>

          {/* Preço e Unidade */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Preço (R$) *</label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={e => set('price', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Unidade</label>
              <select
                value={form.unit}
                onChange={e => set('unit', e.target.value)}
                title="Unidade de cobrança"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {unitOptions.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ativo */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={e => set('active', e.target.checked)}
              className="w-4 h-4 accent-blue-900"
            />
            <span className="text-sm font-medium text-gray-700">Serviço Ativo</span>
          </label>
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
            onClick={() => onSave(form)}
            disabled={!form.name || form.price <= 0}
            className="flex-1 bg-green-600 text-white py-2.5 rounded-full text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar Serviço
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Página Principal ─────────────────────────────────────────────────────────
export default function AdminServicos() {
  const [servicos, setServicos] = useState<Servico[]>(initialServicos)
  const [editingServico, setEditingServico] = useState<Servico | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const toggleActive = (id: string) => {
    setServicos(prev =>
      prev.map(s => s.id === id ? { ...s, active: !s.active } : s)
    )
  }

  const handleSaveEdit = (updated: Servico) => {
    setServicos(prev => prev.map(s => s.id === updated.id ? updated : s))
    setEditingServico(null)
    showToast('✅ Serviço atualizado!')
  }

  const handleAdd = (novo: Servico) => {
    const newId = String(Date.now())
    setServicos(prev => [...prev, { ...novo, id: newId }])
    setShowAddModal(false)
    showToast('✅ Novo serviço adicionado!')
  }

  const handleDelete = (id: string) => {
    if (!confirm('Remover este serviço?')) return
    setServicos(prev => prev.filter(s => s.id !== id))
    showToast('🗑️ Serviço removido.')
  }

  const totalAtivos = servicos.filter(s => s.active).length

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          {toast}
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Catálogo de Serviços</h2>
            <p className="text-gray-600 text-sm mt-1">
              {totalAtivos} serviços ativos de {servicos.length} cadastrados
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition text-sm font-semibold"
          >
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
            <p className="text-2xl font-bold text-red-500">{servicos.length - totalAtivos}</p>
            <p className="text-gray-600 text-sm">Serviços Inativos</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-blue-900">
              {servicos.length > 0
                ? `R$ ${Math.min(...servicos.map(s => s.price)).toLocaleString('pt-BR')} - R$ ${Math.max(...servicos.map(s => s.price)).toLocaleString('pt-BR')}`
                : '—'}
            </p>
            <p className="text-gray-600 text-sm">Faixa de Preços</p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicos.map((servico) => (
            <div
              key={servico.id}
              className={`bg-white rounded-xl shadow p-6 transition ${!servico.active ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{servico.emoji}</span>
                  <div>
                    <h3 className="font-bold text-lg">{servico.name}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        servico.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {servico.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
                {/* Delete button */}
                <button
                  onClick={() => handleDelete(servico.id)}
                  className="text-gray-300 hover:text-red-400 transition text-lg leading-none"
                  title="Remover serviço"
                >
                  ×
                </button>
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
                <button
                  onClick={() => setEditingServico(servico)}
                  className="flex-1 bg-blue-900 text-white py-2 rounded-full text-sm hover:bg-blue-800 transition"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => toggleActive(servico.id)}
                  className={`flex-1 py-2 rounded-full text-sm transition ${
                    servico.active
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {servico.active ? 'Desativar' : 'Ativar'}
                </button>
              </div>
            </div>
          ))}

          {/* Add New Service Card */}
          <div
            onClick={() => setShowAddModal(true)}
            className="bg-white rounded-xl shadow border-2 border-dashed border-gray-300 flex items-center justify-center min-h-48 cursor-pointer hover:border-green-400 hover:bg-green-50 transition"
          >
            <div className="text-center p-6">
              <p className="text-4xl mb-3 text-gray-300">+</p>
              <p className="text-gray-600 font-semibold text-sm mb-3">Novo Serviço</p>
              <button
                onClick={e => { e.stopPropagation(); setShowAddModal(true) }}
                className="bg-green-600 text-white px-4 py-2 rounded-full text-sm hover:bg-green-700 transition"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingServico && (
        <ServicoModal
          servico={editingServico}
          title={`Editar: ${editingServico.name}`}
          onSave={handleSaveEdit}
          onClose={() => setEditingServico(null)}
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <ServicoModal
          servico={emptyServico()}
          title="Novo Serviço"
          onSave={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}
