'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Mail, Lock, Check, ArrowLeft } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import ConfettiAnimation from './confetti-animation'
import AnimatedAlert from '@/components/ui/animated-alert'
import passwordService from '@/service/password/passwordService'

const emailSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
})

const passwordSchema = z.object({
  password: z.string().min(8, { message: 'Senha deve ter pelo menos 8 caracteres' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
})

type EmailFormValues = z.infer<typeof emailSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>

interface PasswordChangeModalProps {
  isOpen: boolean
  onClose: () => void
}

type Step = 'email' | 'verification' | 'password' | 'success'

export default function PasswordChangeModal({ isOpen, onClose }: PasswordChangeModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [email, setEmail] = useState('')
  const [alert, setAlert] = useState<{
    isOpen: boolean
    type: 'success' | 'error' | 'warning'
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  })
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const storedAuth = localStorage.getItem('authData')
  const parsedAuth = storedAuth ? JSON.parse(storedAuth) : {}

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  })

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const showAlert = (type: 'success' | 'error' | 'warning', title: string, message: string) => {
    setAlert({
      isOpen: true,
      type,
      title,
      message
    })
  }

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }))
  }

  const handleClose = () => {
    setCurrentStep('email')
    setVerificationCode(['', '', '', '', '', ''])
    setEmail('')
    emailForm.reset()
    passwordForm.reset()
    closeAlert()
    onClose()
  }

  const handleEmailSubmit = async (values: EmailFormValues) => {
    setIsLoading(true)
    setEmail(values.email)

    const response = await passwordService({
      email: values.email,
      jwt: parsedAuth.jwt
    })

    if (response === null) {
      showAlert('error', 'Erro no Servidor', 'Ocorreu um erro ao enviar o código. Tente novamente.')
    } else if (!response.error) {
      showAlert('success', 'Código Enviado', `Código enviado com sucesso para o email: ${response?.msgUser}`)
      setTimeout(() => {
        closeAlert()
        setCurrentStep('verification')
      }, 2000)
    } else {
      showAlert('error', 'Erro ao Enviar', response?.msgUser || 'Erro desconhecido')
    }
    
    setIsLoading(false)
  }

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newCode = [...verificationCode]
    newCode[index] = value

    setVerificationCode(newCode)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerificationSubmit = async () => {
    const code = verificationCode.join('')

    setIsLoading(true)

    const response = await passwordService({
      email,
      code,
      jwt: parsedAuth.jwt
    })

    if (response === null) {
      showAlert('error', 'Erro no Servidor', 'Ocorreu um erro ao verificar o código. Tente novamente.')
    } else if (!response.error) {
      showAlert('success', 'Código Verificado', 'Código verificado com sucesso!')
      setTimeout(() => {
        closeAlert()
        setCurrentStep('password')
      }, 1500)
    } else {
      showAlert('error', 'Código Inválido', 'O código inserido é inválido. Verifique e tente novamente.')
    }

    setIsLoading(false)
  }

  const handlePasswordSubmit = async (values: PasswordFormValues) => {
    setIsLoading(true)

    const response = await passwordService({
      email,
      new_password: values.password,
      jwt: parsedAuth.jwt
    })

    if (response === null) {
      showAlert('error', 'Erro no Servidor', 'Ocorreu um erro ao alterar a senha. Tente novamente.')
    } else if (!response.error) {
      setCurrentStep('success')
    } else {
      showAlert('error', 'Erro ao Alterar Senha', response?.msgUser || 'Erro desconhecido')
    }
    
    setIsLoading(false)
  }

  const handleSuccessClose = () => {
    setTimeout(() => {
      handleClose()
    }, 3000)
  }

  useEffect(() => {
    if (currentStep === 'success') {
      handleSuccessClose()
    }
  }, [currentStep])

  const isCodeComplete = verificationCode.every(digit => digit !== '')

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <AnimatePresence mode="wait">
            {currentStep === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DialogHeader>
                  <DialogTitle className="text-center">Mude a sua senha</DialogTitle>
                  <p className="text-center text-sm text-muted-foreground">
                    Por favor, coloque seu e-mail para verificarmos
                  </p>
                </DialogHeader>
                
                <div className="mt-6">
                  <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                      <FormField
                        control={emailForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                  placeholder="seu@email.com"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Enviando código...' : 'Enviar código de verificação'}
                      </Button>
                    </form>
                  </Form>
                </div>
              </motion.div>
            )}

            {currentStep === 'verification' && (
              <motion.div
                key="verification"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentStep('email')}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <DialogTitle>Verificação de Email</DialogTitle>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Digite o código de 6 dígitos enviado para {email}
                  </p>
                </DialogHeader>
                
                <div className="mt-6 space-y-6">
                  <div className="flex justify-center gap-2">
                    {verificationCode.map((digit, index) => (
                      <Input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg font-semibold"
                      />
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Código de teste: <span className="font-mono font-bold">123456</span>
                    </p>
                    <Button
                      variant="link"
                      className="text-sm"
                      onClick={() => setCurrentStep('email')}
                    >
                      Não recebeu o código? Reenviar
                    </Button>
                  </div>
                  
                  <Button
                    onClick={handleVerificationSubmit}
                    className="w-full"
                    disabled={!isCodeComplete || isLoading}
                  >
                    {isLoading ? 'Verificando...' : 'Verificar código'}
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === 'password' && (
              <motion.div
                key="password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentStep('verification')}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <DialogTitle>Nova Senha</DialogTitle>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Crie uma nova senha segura para sua conta
                  </p>
                </DialogHeader>
                
                <div className="mt-6">
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nova Senha</FormLabel>
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
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar Nova Senha</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                  type={showConfirmPassword ? 'text' : 'password'}
                                  placeholder="••••••••"
                                  className="pl-10 pr-10"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Alterando senha...' : 'Alterar senha'}
                      </Button>
                    </form>
                  </Form>
                </div>
              </motion.div>
            )}

            {currentStep === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="text-center py-8"
              >
                <ConfettiAnimation />
                
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-4">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                
                <DialogTitle className="text-2xl mb-2">Senha alterada com sucesso!</DialogTitle>
                <p className="text-muted-foreground mb-6">
                  Sua nova senha foi definida. Esta janela será fechada automaticamente.
                </p>
                
                <Button onClick={handleClose} className="w-full">
                  Fechar
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Animated Alert */}
      <AnimatedAlert
        isOpen={alert.isOpen}
        onClose={closeAlert}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        autoClose={alert.type === 'success'}
        autoCloseDelay={alert.type === 'success' ? 2000 : undefined}
      />
    </>
  )
}