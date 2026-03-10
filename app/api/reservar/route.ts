import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      propertyId, 
      checkIn, 
      checkOut, 
      guests, 
      name, 
      email, 
      phone, 
      document,
      notes 
    } = body

    // 1. Validar se a propriedade existe
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    })

    if (!property) {
      return NextResponse.json({ error: 'Propriedade não encontrada' }, { status: 404 })
    }

    // 2. Verificar disponibilidade (evitar overbooking no server-side)
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        propertyId,
        status: { in: ['confirmed', 'paid', 'completed', 'pending'] },
        OR: [
          {
            // Nova reserva começa dentro de uma existente
            checkIn: { lte: new Date(checkIn) },
            checkOut: { gt: new Date(checkIn) }
          },
          {
            // Nova reserva termina dentro de uma existente
            checkIn: { lt: new Date(checkOut) },
            checkOut: { gte: new Date(checkOut) }
          },
          {
            // Nova reserva envolve totalmente uma existente
            checkIn: { gte: new Date(checkIn) },
            checkOut: { lte: new Date(checkOut) }
          }
        ]
      }
    })

    if (conflictingBooking) {
      return NextResponse.json({ error: 'As datas selecionadas já estão ocupadas.' }, { status: 400 })
    }

    // 3. Calcular preço total
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    const subtotal = Number(property.pricePerNight) * nights
    const cleaningFee = Number(property.cleaningFee || 0)
    const totalPrice = subtotal + cleaningFee

    // 4. Criar a reserva
    // Nota: Como não temos um sistema de Auth obrigatório no formulário atual, 
    // vamos usar um usuário admin padrão ou criar/buscar um usuário por e-mail.
    // Para simplificar e garantir o funcionamento do calendário, vamos buscar o primeiro admin.
    let adminUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    })

    if (!adminUser) {
      // Create a default admin user to attach bookings to
      adminUser = await prisma.user.create({
        data: {
          name: 'Admin do Sistema',
          email: 'admin@capitoliopremium.com',
          password: 'senha_segura_hash_aqui', // Em um sistema real, seria um hash real
          role: 'admin'
        }
      })
    }

    const booking = await prisma.booking.create({
      data: {
        propertyId,
        userId: adminUser.id,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests: Number(guests),
        totalPrice,
        status: 'confirmed', // Marcamos como confirmado para aparecer no calendário imediatamente
        guestName: name,
        guestEmail: email,
        guestPhone: phone,
        guestDocument: document,
        notes
      }
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: 'Erro ao processar a reserva' }, { status: 500 })
  }
}
