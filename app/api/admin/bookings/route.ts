import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/bookings — lista todas as reservas
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: { property: true },
      orderBy: { createdAt: 'desc' },
    })

    const result = bookings.map(b => ({
      id: b.id,
      guestName: b.guestName,
      guestEmail: b.guestEmail,
      guestPhone: b.guestPhone,
      property: b.property.name,
      propertyId: b.propertyId,
      checkIn: b.checkIn.toISOString().split('T')[0],
      checkOut: b.checkOut.toISOString().split('T')[0],
      guests: b.guests,
      totalPrice: Number(b.totalPrice),
      status: b.status,
      paymentStatus: b.paymentStatus,
      notes: b.notes ?? '',
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/admin/bookings error:', error)
    return NextResponse.json({ error: 'Erro ao buscar reservas' }, { status: 500 })
  }
}

// POST /api/admin/bookings — cria nova reserva
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { guestName, guestEmail, guestPhone, property, checkIn, checkOut, guests, totalPrice, status, paymentStatus, notes } = body

    // Busca a propriedade pelo nome
    const prop = await prisma.property.findFirst({ where: { name: property } })
    if (!prop) {
      return NextResponse.json({ error: `Propriedade "${property}" não encontrada` }, { status: 404 })
    }

    // Busca ou cria usuário admin para vincular a reserva
    let adminUser = await prisma.user.findFirst({ where: { role: 'admin' } })
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          name: 'Admin do Sistema',
          email: 'admin@capitoliopremium.com',
          password: 'admin_hash',
          role: 'admin',
        },
      })
    }

    const booking = await prisma.booking.create({
      data: {
        propertyId: prop.id,
        userId: adminUser.id,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests: Number(guests),
        totalPrice: Number(totalPrice),
        status: status || 'pending',
        paymentStatus: paymentStatus || 'pending',
        guestName,
        guestEmail: guestEmail || '',
        guestPhone: guestPhone || '',
        notes: notes || null,
      },
      include: { property: true },
    })

    return NextResponse.json({
      id: booking.id,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      property: booking.property.name,
      propertyId: booking.propertyId,
      checkIn: booking.checkIn.toISOString().split('T')[0],
      checkOut: booking.checkOut.toISOString().split('T')[0],
      guests: booking.guests,
      totalPrice: Number(booking.totalPrice),
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      notes: booking.notes ?? '',
    })
  } catch (error) {
    console.error('POST /api/admin/bookings error:', error)
    return NextResponse.json({ error: 'Erro ao criar reserva' }, { status: 500 })
  }
}
