'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { User } from 'lucide-react'

const data = [
  { name: 'Jan', pedidos: 4, gastos: 400 },
  { name: 'Fev', pedidos: 3, gastos: 300 },
  { name: 'Mar', pedidos: 6, gastos: 600 },
  { name: 'Abr', pedidos: 8, gastos: 800 },
  { name: 'Mai', pedidos: 5, gastos: 500 },
  { name: 'Jun', pedidos: 7, gastos: 700 },
]

export default function DashboardPage() {
  const [timeFilter, setTimeFilter] = useState('month')
  const userName = 'João Silva'

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-none">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Bem-vindo, {userName}!</h1>
            <p className="text-muted-foreground">
              Acompanhe suas estatísticas e faça novos pedidos
            </p>
          </div>
        </div>
      </Card>

      {/* Filter */}
      <div className="flex justify-end">
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Últimos 7 dias</SelectItem>
            <SelectItem value="month">Últimos 6 meses</SelectItem>
            <SelectItem value="year">Último ano</SelectItem>
            <SelectItem value="all">Todo histórico</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Pedidos Realizados</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="pedidos" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Expenses Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Gastos na Plataforma</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="gastos" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}