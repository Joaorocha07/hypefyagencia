'use client'

import { useState } from 'react'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import Link from 'next/link'
import SocialLoginButton from './social-login-button'
import loginService from '@/service/login/loginService'

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um endereço de e-mail válido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
})

type LoginFormValues = z.infer<typeof loginFormSchema>

export default function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true)
    setErrorMessage(null)

    console.log(values)
    
    const response = await loginService({
      email: values.email,
      password: values.password
    })

    console.log(response)

    if (response === null) {
      setErrorMessage('Ocorreu um erro ao logar sua conta. Tente novamente.')
    } else if (!response.error) {
      const userData = {
        isAuthenticated: true,
        jwt: response.jwt,
        email: response.email,
        nome: response.nome
      }

      localStorage.setItem('authData', JSON.stringify(userData))
      localStorage.setItem('isAuthenticated', 'true')
      router.push('/dashboard')
    } else {
      setErrorMessage(response?.msgUser)
    }

    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold">Bem vindo de volta</CardTitle>
        <CardDescription>
          Entre na sua conta para continuar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {errorMessage && (
          <div className="text-red-600 bg-red-100 p-4 rounded-md mt-4">
            <strong></strong> {errorMessage}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="email@example.com"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                        onClick={toggleShowPassword}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? 'Hide password' : 'Show password'}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                variant="link"
                className="h-auto p-0 text-sm font-normal text-primary"
                asChild
              >
                <Link href="/forgot-password">Esqueceu sua senha?</Link>
              </Button>
            </div>
            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isLoading}
            >
              {isLoading ? 'Fazendo login...' : 'Entrar'}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
        </Form>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
          <span className="relative bg-card px-2 text-xs uppercase text-muted-foreground">
            Ou continue com
          </span>
        </div>

        <SocialLoginButton />
      </CardContent>
      <CardFooter className="flex justify-center border-t p-6">
        <p className="text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Button
            variant="link"
            className="h-auto p-0 text-primary"
            asChild
          >
            <Link href="/register">Crie uma conta</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  )
}