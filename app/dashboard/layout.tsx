'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useTheme } from 'next-themes'
import { 
  Home,
  Plus,
  Wallet,
  ClipboardList,
  RotateCcw,
  HeadphonesIcon,
  Settings,
  LogOut,
  MenuIcon,
  Sun,
  Moon,
  MessageCircle,
  User
} from 'lucide-react'
import Link from 'next/link'

const menuItems = [
  {
    title: 'Novo Pedido',
    icon: Home,
    href: '/dashboard/new-order'
  },
  {
    title: 'Multi Pedidos',
    icon: Plus,
    href: '/dashboard/multi-orders'
  },
  {
    title: 'Adicionar Saldo',
    icon: Wallet,
    href: '/dashboard/add-balance'
  },
  {
    title: 'Pedidos',
    icon: ClipboardList,
    href: '/dashboard/orders'
  },
  {
    title: 'Reembolsos',
    icon: RotateCcw,
    href: '/dashboard/refunds'
  },
  {
    title: 'Suporte',
    icon: HeadphonesIcon,
    href: '/dashboard/support'
  },
  {
    title: 'Serviços',
    icon: Settings,
    href: '/dashboard/services'
  },
  {
    title: 'Meu Perfil',
    icon: User,
    href: '/dashboard/profile'
  },
  {
    title: 'Sair',
    icon: LogOut,
    href: '/'
  }
]

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)



  useEffect(() => {
    const user = localStorage.getItem('isAuthenticated')

    console.log(user)

    if (user) {
      console.log('User is authenticated')
    } else {
      router.push('/login')
    }
    
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return null 
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center gap-4 flex-1">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80vw] sm:w-72 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <img
                      src="/images/logo-preto.png"
                      alt="Hype Fy Logo"
                      className="h-8 w-auto dark:hidden"
                    />
                    <img
                      src="/images/logo-branco.png"
                      alt="Hype Fy Logo"
                      className="h-8 w-auto hidden dark:block"
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <nav className="space-y-1 p-2">
                      {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center space-x-3 rounded-lg px-3 py-3 text-sm transition-all hover:bg-accent ${
                              isActive ? 'bg-accent' : ''
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{item.title}</span>
                          </Link>
                        )
                      })}
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <div className="hidden md:block">
              <img
                src="/images/logo-preto.png"
                alt="Hype Fy Logo"
                className="h-8 w-auto dark:hidden"
              />
              <img
                src="/images/logo-branco.png"
                alt="Hype Fy Logo"
                className="h-8 w-auto hidden dark:block"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="ghost" size="icon" asChild className="rounded-full">
              <Link href="/dashboard/profile">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container grid md:grid-cols-[250px_1fr] gap-4">
        {/* Sidebar */}
        <aside className="hidden border-r md:block">
          <div className="sticky top-16 overflow-y-auto py-6 pr-4" style={{ height: 'calc(100vh - 4rem)' }}>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent ${
                      isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-foreground' : ''
                    }`} />
                    {item.title}
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-6 px-4 md:pl-4">{children}</main>
      </div>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  )
}