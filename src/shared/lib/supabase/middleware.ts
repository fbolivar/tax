
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
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

    // IMPORTANT: Avoid throwing errors here which might halt the middleware
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser()

        const pathname = request.nextUrl.pathname
        const isAuthRoute = pathname === '/login'
        const isProtectedRoute = pathname.startsWith('/transactions') ||
            pathname.startsWith('/reports')

        if (isProtectedRoute && !user) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            const response = NextResponse.redirect(url)
            // Transfer cookies from supabaseResponse to the redirect response
            supabaseResponse.cookies.getAll().forEach((cookie) => {
                response.cookies.set(cookie.name, cookie.value, cookie.options)
            })
            return response
        }

        if (isAuthRoute && user) {
            const url = request.nextUrl.clone()
            url.pathname = '/transactions'
            const response = NextResponse.redirect(url)
            // Transfer cookies from supabaseResponse to the redirect response
            supabaseResponse.cookies.getAll().forEach((cookie) => {
                response.cookies.set(cookie.name, cookie.value, cookie.options)
            })
            return response
        }
    } catch (e) {
        console.error('Middleware Auth Error:', e)
    }

    return supabaseResponse
}
