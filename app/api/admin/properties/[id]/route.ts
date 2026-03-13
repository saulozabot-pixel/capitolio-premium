import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const data: Record<string, unknown> = {}
    const fields = ['name', 'slug', 'shortDesc', 'description', 'address', 'city', 'state', 'amenities', 'images', 'featured', 'active']
    for (const f of fields) {
      if (body[f] !== undefined) data[f] = body[f]
    }
    const numFields = ['bedrooms', 'bathrooms', 'maxGuests', 'area', 'pricePerNight', 'cleaningFee']
    for (const f of numFields) {
      if (body[f] !== undefined) data[f] = Number(body[f])
    }

    const property = await prisma.property.update({ where: { id }, data })
    return NextResponse.json(property)
  } catch (error) {
    console.error('PATCH /api/admin/properties/[id] error:', error)
    return NextResponse.json({ error: 'Erro ao atualizar propriedade' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.property.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/admin/properties/[id] error:', error)
    return NextResponse.json({ error: 'Erro ao remover propriedade' }, { status: 500 })
  }
}
