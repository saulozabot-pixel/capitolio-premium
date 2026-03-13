import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const services = await prisma.serviceCatalog.findMany({ orderBy: { createdAt: 'asc' } })
    return NextResponse.json(services)
  } catch (error) {
    console.error('GET /api/admin/services error:', error)
    return NextResponse.json({ error: 'Erro ao buscar serviços' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, name, description, price, unit, emoji, active } = body
    const service = await prisma.serviceCatalog.create({
      data: {
        type: type || name.toLowerCase(),
        name,
        description: description || '',
        price: Number(price),
        unit: unit || 'hora',
        emoji: emoji || '⭐',
        active: active !== false,
      },
    })
    return NextResponse.json(service)
  } catch (error) {
    console.error('POST /api/admin/services error:', error)
    return NextResponse.json({ error: 'Erro ao criar serviço' }, { status: 500 })
  }
}
