import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/admin/bookings/[id] — atualiza status/pagamento
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, paymentStatus, guestName, guestEmail, guestPhone, checkIn, checkOut, guests, totalPrice, notes } = body

    const data: Record<string, unknown> = {}
    if (status !== undefined) data.status = status
    if (paymentStatus !== undefined) data.paymentStatus = paymentStatus
    if (guestName !== undefined) data.guestName = guestName
    if (guestEmail !== undefined) data.guestEmail = guestEmail
    if (guestPhone !== undefined) data.guestPhone = guestPhone
    if (checkIn !== undefined) data.checkIn = new Date(checkIn)
    if (checkOut !== undefined) data.checkOut = new Date(checkOut)
    if (guests !== undefined) data.guests = Number(guests)
    if (totalPrice !== undefined) data.totalPrice = Number(totalPrice)
    if (notes !== undefined) data.notes = notes

    const booking = await prisma.booking.update({
      where: { id },
      data,
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
    console.error('PATCH /api/admin/bookings/[id] error:', error)
    return NextResponse.json({ error: 'Erro ao atualizar reserva' }, { status: 500 })
  }
}
