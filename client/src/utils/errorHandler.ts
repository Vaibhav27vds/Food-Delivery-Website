import { NextResponse } from 'next/server'

export function handleApiError(error: any) {
  console.error('API Error:', error)

  if (error.code === 'P2002') {
    return NextResponse.json(
      { error: 'Unique constraint violation', details: error.meta },
      { status: 409 }
    )
  }

  if (error.code === 'P2025') {
    return NextResponse.json(
      { error: 'Record not found', details: error.meta },
      { status: 404 }
    )
  }

  return NextResponse.json(
    { error: 'Internal Server Error', details: error.message },
    { status: 500 }
  )
}

export function validateRequest(data: any, schema: any) {
  try {
    schema.parse(data)
  } catch (error) {
    throw new Error('Validation failed')
  }
}