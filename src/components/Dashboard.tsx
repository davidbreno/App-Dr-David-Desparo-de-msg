import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Users, Send, MessageCircle, Calendar } from 'lucide-react';
import type { Patient } from '../App';

interface DashboardProps {
  patients: Patient[];
  selectedPatients: Set<string>;
  sentMessages: number;
  responses: number;
}

export function Dashboard({ patients, selectedPatients, sentMessages, responses }: DashboardProps) {
  // Dados para gráfico de pacientes por faixa etária
  const ageDistribution = [
    { age: '18-25', count: patients.filter(p => p.age >= 18 && p.age <= 25).length },
    { age: '26-35', count: patients.filter(p => p.age >= 26 && p.age <= 35).length },
    { age: '36-45', count: patients.filter(p => p.age >= 36 && p.age <= 45).length },
    { age: '46-55', count: patients.filter(p => p.age >= 46 && p.age <= 55).length },
    { age: '56+', count: patients.filter(p => p.age >= 56).length },
  ];

  // Dados para gráfico de visitas por mês
  const visitsByMonth = [
    { month: 'Jun', visits: 45 },
    { month: 'Jul', visits: 52 },
    { month: 'Ago', visits: 61 },
    { month: 'Set', visits: 58 },
    { month: 'Out', visits: 73 },
    { month: 'Nov', visits: patients.length },
  ];

  // Dados para gráfico de engajamento
  const engagementData = [
    { day: 'Seg', sent: 12, responses: 8 },
    { day: 'Ter', sent: 15, responses: 11 },
    { day: 'Qua', sent: 8, responses: 6 },
    { day: 'Qui', sent: 20, responses: 14 },
    { day: 'Sex', sent: 18, responses: 13 },
    { day: 'Sáb', sent: 5, responses: 3 },
    { day: 'Dom', sent: 3, responses: 2 },
  ];

  // Taxa de resposta
  const responseRate = sentMessages > 0 ? Math.round((responses / sentMessages) * 100) : 0;

  const stats = [
    {
      icon: Users,
      label: 'Total de Pacientes',
      value: patients.length,
      change: '+12%',
    },
    {
      icon: Users,
      label: 'Pacientes Selecionados',
      value: selectedPatients.size,
      change: `${Math.round((selectedPatients.size / patients.length) * 100)}%`,
    },
    {
      icon: Send,
      label: 'Mensagens Enviadas',
      value: sentMessages,
      change: '+8%',
    },
    {
      icon: MessageCircle,
      label: 'Taxa de Resposta',
      value: `${responseRate}%`,
      change: '+5%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 transition-all"
              style={{
                boxShadow: '0 4px 20px rgba(200, 255, 46, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(200, 255, 46, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(200, 255, 46, 0.1)';
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #C8FF2E 0%, #78A82F 100%)',
                    boxShadow: '0 4px 15px rgba(200, 255, 46, 0.3)',
                  }}
                >
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <span 
                  className="text-xs px-2 py-1 rounded-lg"
                  style={{
                    backgroundColor: 'rgba(200, 255, 46, 0.1)',
                    color: '#C8FF2E',
                  }}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
              <p className="text-3xl text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Gráfico de Visitas por Mês */}
        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5" style={{ color: '#C8FF2E' }} />
            <h3 className="text-white">Crescimento de Pacientes</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={visitsByMonth}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8FF2E" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#C8FF2E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0E0E0E',
                  border: '1px solid rgba(200, 255, 46, 0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="#C8FF2E"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorVisits)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Distribuição por Idade */}
        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5" style={{ color: '#C8FF2E' }} />
            <h3 className="text-white">Distribuição por Idade</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={ageDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="age" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0E0E0E',
                  border: '1px solid rgba(200, 255, 46, 0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="count" fill="#C8FF2E" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Engajamento Semanal */}
      <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="w-5 h-5" style={{ color: '#C8FF2E' }} />
          <h3 className="text-white">Engajamento Semanal</h3>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="day" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0E0E0E',
                border: '1px solid rgba(200, 255, 46, 0.3)',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sent"
              stroke="#C8FF2E"
              strokeWidth={3}
              dot={{ fill: '#C8FF2E', r: 6 }}
              name="Enviadas"
            />
            <Line
              type="monotone"
              dataKey="responses"
              stroke="#B4FF4A"
              strokeWidth={3}
              dot={{ fill: '#B4FF4A', r: 6 }}
              name="Respostas"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Últimas Atividades */}
      <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5" style={{ color: '#C8FF2E' }} />
          <h3 className="text-white">Últimas Atividades</h3>
        </div>
        <div className="space-y-3">
          {patients.slice(0, 5).map((patient) => (
            <div
              key={patient.id}
              className="flex items-center justify-between p-3 bg-[#0E0E0E] rounded-xl border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-black"
                  style={{
                    background: 'linear-gradient(135deg, #C8FF2E 0%, #78A82F 100%)',
                  }}
                >
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white">{patient.name}</p>
                  <p className="text-sm text-gray-400">
                    Última visita: {new Date(patient.lastVisit).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <span 
                className="text-xs px-3 py-1 rounded-lg"
                style={{
                  backgroundColor: 'rgba(200, 255, 46, 0.1)',
                  color: '#C8FF2E',
                }}
              >
                Ativo
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}