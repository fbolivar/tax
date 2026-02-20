
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
                setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
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
            pathname.startsWith('/reports') ||
            pathname.startsWith('/settings')

        if (isProtectedRoute && !user) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            const response = NextResponse.redirect(url)
            supabaseResponse.cookies.getAll().forEach((cookie) => {
                const { name, value, ...options } = cookie
                response.cookies.set(name, value, options)
            })
            return response
        }

        // Role-based protection for /settings
        if (pathname.startsWith('/settings') && user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile?.role !== 'admin') {
                const url = request.nextUrl.clone()
                url.pathname = '/transactions'
                const response = NextResponse.redirect(url)
                supabaseResponse.cookies.getAll().forEach((cookie) => {
                    const { name, value, ...options } = cookie
                    response.cookies.set(name, value, options)
                })
                return response
            }
        }

        if (isAuthRoute && user) {
            const url = request.nextUrl.clone()
            url.pathname = '/transactions'
            const response = NextResponse.redirect(url)
            supabaseResponse.cookies.getAll().forEach((cookie) => {
                const { name, value, ...options } = cookie
                response.cookies.set(name, value, options)
            })
            return response
        }
    } catch (e) {
        console.error('Middleware Auth Error:', e)
    }

    return supabaseResponse
}
