
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // Basic response to return if something fails early
    let supabaseResponse = NextResponse.next({
        request,
    })

    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        // If env vars are missing, we can't do auth, but we shouldn't crash the middleware
        if (!supabaseUrl || !supabaseAnonKey) {
            console.warn('Supabase environment variables are missing. Middleware skipping session update.')
            return supabaseResponse
        }

        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                        supabaseResponse = NextResponse.next({
                            request,
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        // Refresh session if needed
        const { data: { user } } = await supabase.auth.getUser()

        const pathname = request.nextUrl.pathname
        const isAuthRoute = pathname === '/login'
        const isProtectedRoute = pathname.startsWith('/transactions') ||
            pathname.startsWith('/reports')

        if (isProtectedRoute && !user) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        if (isAuthRoute && user) {
            const url = request.nextUrl.clone()
            url.pathname = '/transactions'
            return NextResponse.redirect(url)
        }

    } catch (error) {
        // Safe fallback - if anything fails, just continue the request
        console.error('CRITICAL MIDDLEWARE ERROR:', error)
    }

    return supabaseResponse
}
