import { NextResponse } from 'next/server'

export async function middleware(request) {
    // Create a response object that we'll use to handle the response
    const res = NextResponse.next()
    return res
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}