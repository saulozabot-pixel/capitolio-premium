import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        _count: { select: { bookings: true } },
      },
    })
    return NextResponse.json(properties)
  } catch (error) {
    console.error('GET /api/admin/properties error:', error)
    return NextResponse.json({ error: 'Erro ao buscar propriedades' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, shortDesc, description, address, city, state, bedrooms, bathrooms, maxGuests, area, pricePerNight, cleaningFee, amenities, images, featured, active } = body

    const property = await prisma.property.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        shortDesc: shortDesc || '',
        description: description || '',
        address: address || 'Capitólio, MG',
        city: city || 'Capitólio',
        state: state || 'MG',
        bedrooms: Number(bedrooms) || 4,
        bathrooms: Number(bathrooms) || 3,
        maxGuests: Number(maxGuests) || 8,
        area: Number(area) || 300,
        pricePerNight: Number(pricePerNight) || 2000,
        cleaningFee: Number(cleaningFee) || 400,
        amenities: amenities || [],
        images: images || [],
        featured: Boolean(featured),
        active: active !== false,
      },
    })
    return NextResponse.json(property)
  } catch (error) {
    console.error('POST /api/admin/properties error:', error)
    return NextResponse.json({ error: 'Erro ao criar propriedade' }, { status: 500 })
  }
}
