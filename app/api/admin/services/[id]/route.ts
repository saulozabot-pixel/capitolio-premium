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
    const strFields = ['type', 'name', 'description', 'unit', 'emoji']
    for (const f of strFields) { if (body[f] !== undefined) data[f] = body[f] }
    if (body.price !== undefined) data.price = Number(body.price)
    if (body.active !== undefined) data.active = body.active
    const service = await prisma.serviceCatalog.update({ where: { id }, data })
    return NextResponse.json(service)
  } catch (error) {
    console.error('PATCH /api/admin/services/[id] error:', error)
    return NextResponse.json({ error: 'Erro ao atualizar serviço' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.serviceCatalog.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/admin/services/[id] error:', error)
    return NextResponse.json({ error: 'Erro ao remover serviço' }, { status: 500 })
  }
}
