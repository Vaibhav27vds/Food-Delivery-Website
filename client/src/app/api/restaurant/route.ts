import { NextRequest, NextResponse } from 'next/server'
import { Prisma, PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { handleApiError, validateRequest } from '@/utils/errorHandler'

const prisma = new PrismaClient();

// Validation Schemas
const restaurantCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  logo: z.string().url().optional(),
  coverImage: z.string().url().optional(),
  contactNumber: z.string().min(10, 'Contact number must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
  openingTime: z.string().datetime(),
  closingTime: z.string().datetime(),
  priceRange: z.enum(['LOW', 'MEDIUM', 'HIGH', 'PREMIUM']).default('MEDIUM'),
  deliveryFee: z.number().min(0).optional(),
  minOrderAmount: z.number().min(0).optional(),
  addressId: z.number()
})

const restaurantUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  description: z.string().optional(),
  logo: z.string().url().optional(),
  coverImage: z.string().url().optional(),
  contactNumber: z.string().min(10, 'Contact number must be at least 10 digits').optional(),
  email: z.string().email('Invalid email address').optional(),
  openingTime: z.string().datetime().optional(),
  closingTime: z.string().datetime().optional(),
  priceRange: z.enum(['LOW', 'MEDIUM', 'HIGH', 'PREMIUM']).optional(),
  deliveryFee: z.number().min(0).optional(),
  minOrderAmount: z.number().min(0).optional(),
  isActive: z.boolean().optional()
})

// GET All Restaurants
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Optional filters
    const category = searchParams.get('category')
    const priceRange = searchParams.get('priceRange')
    const minRating = parseFloat(searchParams.get('minRating') || '0')

    const where: any = {
      isActive: true,
      avgRating: { gte: minRating }
    }

    if (category) {
      where.categories = {
        some: {
          category: {
            name: category
          }
        }
      }
    }

    if (priceRange) {
      where.priceRange = priceRange
    }

    const restaurants = await prisma.restaurant.findMany({
      where,
      skip,
      take: limit,
      include: {
        address: true,
        categories: {
          include: {
            category: true
          }
        },
        products: {
          take: 5 // Limit to first 5 products
        }
      },
      orderBy: {
        avgRating: 'desc'
      }
    })

    const total = await prisma.restaurant.count({ where })

    return NextResponse.json({
      restaurants,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// POST Create Restaurant
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate input
    validateRequest(body, restaurantCreateSchema)

    const restaurant = await prisma.restaurant.create({
      data: {
        ...body,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    return NextResponse.json(restaurant, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT Update Restaurant
export async function PUT(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const restaurantId = parseInt(params.id)

    // Validate input
    validateRequest(body, restaurantUpdateSchema)

    const restaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        ...body,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(restaurant)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE Restaurant
export async function DELETE(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const restaurantId = parseInt(params.id)

    await prisma.restaurant.delete({
      where: { id: restaurantId }
    })

    return NextResponse.json({ message: 'Restaurant deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

// GET Restaurant by ID
export async function GET_ID(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const restaurantId = parseInt(params.id)

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: {
        address: true,
        categories: {
          include: {
            category: true
          }
        },
        products: {
          include: {
            category: true,
            customizations: {
              include: {
                options: true
              }
            }
          }
        },
        reviews: {
          include: {
            user: true
          },
          take: 10,
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    return NextResponse.json(restaurant)
  } catch (error) {
    return handleApiError(error)
  }
}