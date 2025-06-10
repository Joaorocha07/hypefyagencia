import './globals.css'

import type { Metadata } from 'next'
import { Providers } from './providers'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hype Fy Agência',
  description: 'Painel de controle Hype Fy',
  icons: {
    icon: '/images/logo.ico',
    shortcut: '/images/logo.ico',
    apple: '/images/logo.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}