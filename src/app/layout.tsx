import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BC TaxFlow',
  description: 'Inteligencia Fiscal y Gestión de Datos Financieros',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%234F46E5%22/><text y=%22.9em%22 font-size=%2260%22 x=%2250%25%22 text-anchor=%22middle%22 fill=%22white%22 font-family=%22serif%22 font-weight=%22900%22>TX</text></svg>',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
