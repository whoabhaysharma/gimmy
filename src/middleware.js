import { NextResponse } from 'next/server'
import { createClient } from './utils/supabase/server'

export async function middleware(request) {
    // Create a response object that we'll use to handle the response
    const res = NextResponse.next()
    
    // Create the Supabase client
    const supabase = createClient()

    // Check if we have a session
    const { data: { session } } = await supabase.auth.getSession()

    const path = request.nextUrl.pathname

    // Define public paths
    const isPublicPath = path === '/login' || path === '/register'

    if (!session && !isPublicPath) {
        // If there's no session and it's not a public path, redirect to login
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (session && isPublicPath) {
        // If there's a session and it's a public path, redirect to home
        return NextResponse.redirect(new URL('/', request.url))
    }

    // For all other cases, continue with the request
    return res
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}