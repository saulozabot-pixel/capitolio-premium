import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params

  try {
    const property = await prisma.property.findUnique({
      where: { slug },
      select: { id: true }
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    const bookings = await prisma.booking.findMany({
      where: {
        propertyId: property.id,
        status: { in: ['confirmed', 'paid', 'completed', 'pending'] },
        checkOut: { gte: new Date() }
      },
      select: {
        checkIn: true,
        checkOut: true
      }
    })

    const occupiedDates = bookings.map(booking => ({
      from: booking.checkIn,
      to: booking.checkOut
    }))

    return NextResponse.json(occupiedDates)
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
