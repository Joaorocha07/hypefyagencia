'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera, Mail, User, Lock, Check, Trash2 } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useRouter } from 'next/navigation'
import PasswordChangeModal from '@/components/profile/password-change-modal'
import AnimatedAlert from '@/components/ui/animated-alert'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const router = useRouter()
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
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

  const storedAuth = localStorage.getItem('authData')
  const parsedAuth = storedAuth ? JSON.parse(storedAuth) : {}

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: parsedAuth.nome || '',
      email: parsedAuth.email || ''
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

  async function onSubmit(values: ProfileFormValues) {
    setIsLoading(true)

    console.log(values)

    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    showAlert('success', 'Perfil Atualizado', 'Suas informações foram salvas com sucesso!')
    setIsLoading(false)
  }

  const handleDeleteAccount = async () => {
    setIsDeleteDialogOpen(false)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    showAlert('success', 'Conta Deletada', 'Sua conta foi deletada com sucesso. Você será redirecionado em breve.')
    
    // Redirect after showing success message
    setTimeout(() => {
      localStorage.removeItem('authData')
      localStorage.removeItem('isAuthenticated')
      router.push('/')
    }, 2000)
  }

  const handlePhotoChange = () => {
    showAlert('warning', 'Funcionalidade em Desenvolvimento', 'A alteração de foto de perfil estará disponível em breve.')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Meu Perfil</h2>
      </div>

      <div className="grid lg:grid-cols-[1fr,2fr] gap-6">
        {/* Profile Picture Section */}
        <Card className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                <AvatarFallback className="text-2xl">
                  {parsedAuth.nome ? parsedAuth.nome.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90"
                onClick={handlePhotoChange}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{parsedAuth.nome || ''}</h3>
              <p className="text-sm text-muted-foreground">{parsedAuth.email || ''}</p>
            </div>
            <div className="w-full space-y-3">
              <Button variant="outline" className="w-full" onClick={handlePhotoChange}>
                Alterar Foto
              </Button>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Deletar Conta
              </Button>
            </div>
          </div>
        </Card>

        {/* Profile Information */}
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              disabled={true}
                              placeholder="Seu nome completo"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              disabled={true}
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
                    {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </form>
              </Form>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Segurança</h3>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Lock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Senha</p>
                      <p className="text-sm text-muted-foreground">
                        Última alteração há 30 dias
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="w-full sm:w-auto"
                  >
                    Alterar Senha
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Account Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3">
                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Membro desde</p>
                <h3 className="text-2xl font-bold">Jan 2024</h3>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pedidos Concluídos</p>
                <h3 className="text-2xl font-bold">47</h3>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-yellow-100 dark:bg-yellow-900 p-3">
                <Mail className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status da Conta</p>
                <h3 className="text-2xl font-bold text-green-600">Ativo</h3>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Modals and Alerts */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Deletar Conta"
        message="Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita e todos os seus dados serão permanentemente removidos."
        confirmText="Sim, deletar"
        cancelText="Cancelar"
        type="danger"
      />

      <AnimatedAlert
        isOpen={alert.isOpen}
        onClose={closeAlert}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        autoClose={alert.type === 'success'}
        autoCloseDelay={3000}
      />
    </div>
  )
}