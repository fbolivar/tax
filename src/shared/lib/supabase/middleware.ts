
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // Create an initial response
    let supabaseResponse = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
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
        const { data: { user } } = await supabase.auth.getUser()

        // Access control
        const isAuthRoute = request.nextUrl.pathname === '/login'
        const isProtectedRect = request.nextUrl.pathname.startsWith('/transactions') ||
            request.nextUrl.pathname.startsWith('/reports')

        if (isProtectedRect && !user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        if (isAuthRoute && user) {
            return NextResponse.redirect(new URL('/transactions', request.url))
        }

    } catch (error) {
        console.error('Middleware Auth Error:', error)
    }

    return supabaseResponse
}
