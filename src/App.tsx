import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Send, Users, Sparkles, LogOut, BarChart3, Settings as SettingsIcon, MessageSquare, CheckSquare, MessageCircle, Zap } from 'lucide-react';
import { PatientCard } from './components/PatientCard';
import { MessageComposer } from './components/MessageComposer';
import { AgeSlider } from './components/AgeSlider';
import { TemplateSelector } from './components/TemplateSelector';
import { ImportPatients } from './components/ImportPatients';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { PatientsList } from './components/PatientsList';
import { SentMessages } from './components/SentMessages';
import { Responses } from './components/Responses';

export interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  lastVisit: string;
}

// Dados mockados de pacientes
const mockPatients: Patient[] = [];

// Usuários autorizados
const AUTHORIZED_USERS = {
  'admin': '123456',
  'consultorio': 'senha123',
};

// Partículas flutuantes
const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full opacity-20"
          style={{
            backgroundColor: '#C8FF2E',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 80]);
  const [selectedPatients, setSelectedPatients] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('');
  const [currentView, setCurrentView] = useState<'messages' | 'dashboard' | 'selected' | 'all' | 'sent' | 'responses' | 'settings'>('messages');
  const [sentMessages] = useState(0);
  const [responses] = useState(0);
  const [ghostPatients, setGhostPatients] = useState<Set<string>>(new Set());

  useEffect(() => {
    const savedUser = localStorage.getItem('pulso_user');
    if (savedUser && AUTHORIZED_USERS[savedUser as keyof typeof AUTHORIZED_USERS]) {
      setIsAuthenticated(true);
      setCurrentUser(savedUser);
    }
  }, []);

  const handleLogin = (username: string, password: string): boolean => {
    const storedPassword = AUTHORIZED_USERS[username as keyof typeof AUTHORIZED_USERS];
    
    if (storedPassword && storedPassword === password) {
      setIsAuthenticated(true);
      setCurrentUser(username);
      localStorage.setItem('pulso_user', username);
      return true;
    }
    
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
    localStorage.removeItem('pulso_user');
  };

  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAge = patient.age >= ageRange[0] && patient.age <= ageRange[1];
      return matchesSearch && matchesAge;
    });
  }, [searchTerm, ageRange, patients]);

  const handleImport = (importedPatients: Patient[]) => {
    setPatients(prev => [...prev, ...importedPatients]);
    clearSelection();
  };

  const togglePatient = (patientId: string) => {
    const newSelected = new Set(selectedPatients);
    if (newSelected.has(patientId)) {
      newSelected.delete(patientId);
    } else {
      newSelected.add(patientId);
    }
    setSelectedPatients(newSelected);
  };

  const selectAll = () => {
    const allIds = new Set(filteredPatients.map(p => p.id));
    setSelectedPatients(allIds);
  };

  const clearSelection = () => {
    setSelectedPatients(new Set());
  };

  const sendMessages = () => {
    if (selectedPatients.size === 0 || !message.trim()) {
      alert('Selecione pelo menos um paciente e escreva uma mensagem.');
      return;
    }

    const selectedPatientsData = patients.filter(p => selectedPatients.has(p.id));
    
    selectedPatientsData.forEach((patient, index) => {
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${patient.phone}?text=${encodedMessage}`;
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, index * 500);
    });
  };

  const sendToPatient = (patient: Patient) => {
    if (!message.trim()) {
      alert('Escreva uma mensagem primeiro.');
      return;
    }
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${patient.phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const toggleGhost = (patientId: string) => {
    const newGhosts = new Set(ghostPatients);
    if (newGhosts.has(patientId)) {
      newGhosts.delete(patientId);
    } else {
      newGhosts.add(patientId);
    }
    setGhostPatients(newGhosts);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at top, #0a0a0a 0%, #000000 50%, #000000 100%)',
      }}
    >
      <FloatingParticles />

      <motion.div 
        className="fixed inset-0 pointer-events-none opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, #C8FF2E 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, #78A82F 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, #B4FF4A 0%, transparent 50%)',
            'radial-gradient(circle at 20% 20%, #C8FF2E 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 backdrop-blur-2xl bg-white/5 border-b border-white/10"
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="w-14 h-14 rounded-3xl flex items-center justify-center shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #C8FF2E 0%, #78A82F 100%)',
                }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(200, 255, 46, 0.4)',
                    '0 0 40px rgba(200, 255, 46, 0.6)',
                    '0 0 20px rgba(200, 255, 46, 0.4)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Zap className="w-7 h-7 text-black" />
              </motion.div>
              <div>
                <h1 className="text-white text-2xl tracking-tight">Pulso do Consultório</h1>
                <p className="text-gray-400 text-sm">
                  Conecte-se com elegância e simplicidade
                </p>
              </div>
            </motion.div>
            
            <div className="flex items-center gap-4">
              <ImportPatients onImport={handleImport} />
              <motion.div 
                className="text-right px-4 py-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
              >
                <p className="text-sm text-white">{currentUser}</p>
                <p className="text-xs text-gray-400">{patients.length} pacientes</p>
              </motion.div>
              <motion.button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl text-white rounded-2xl border border-white/10 transition-all"
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: 'rgba(255, 77, 77, 0.8)',
                  borderColor: 'rgba(255, 77, 77, 1)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-4 h-4" />
                Sair
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6">

          {/* SIDEBAR */}
          <motion.aside 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-72 flex-shrink-0"
          >
            <motion.nav 
              className="sticky top-28 backdrop-blur-2xl bg-white/5 rounded-3xl p-6 border border-white/10"
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div className="space-y-2">
                {[
                  { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
                  { id: 'all', icon: Users, label: 'Todos Pacientes', badge: patients.length },
                  { id: 'selected', icon: CheckSquare, label: 'Selecionados', badge: selectedPatients.size || undefined },
                  { id: 'messages', icon: MessageSquare, label: 'Enviar Mensagens' },
                  { id: 'sent', icon: Send, label: 'Enviadas', badge: sentMessages },
                  { id: 'responses', icon: MessageCircle, label: 'Respostas', badge: responses },
                  { id: 'settings', icon: SettingsIcon, label: 'Configurações' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setCurrentView(item.id as any)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl transition-all relative overflow-hidden ${
                        isActive
                          ? 'text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 rounded-2xl"
                          style={{
                            background: 'linear-gradient(90deg, #C8FF2E 0%, #78A82F 100%)',
                            boxShadow: '0 4px 20px rgba(200, 255, 46, 0.4)',
                          }}
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <div className="flex items-center gap-3 relative z-10">
                        <Icon className="w-5 h-5" />
                        <span className={isActive ? 'text-white' : ''}>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <motion.span 
                          className="px-2.5 py-0.5 bg-white/20 backdrop-blur-xl rounded-full text-xs relative z-10"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring" }}
                        >
                          {item.badge}
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.nav>
          </motion.aside>

          {/* MAIN CONTENT */}
          <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex-1 min-w-0"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentView === 'dashboard' && (
                  <Dashboard
                    patients={patients}
                    selectedPatients={selectedPatients}
                    sentMessages={sentMessages}
                    responses={responses}
                  />
                )}

                {currentView === 'selected' && (
                  <PatientsList
                    patients={patients.filter((p) => selectedPatients.has(p.id))}
                    selectedPatients={selectedPatients}
                    ghostPatients={ghostPatients}
                    onToggleSelect={togglePatient}
                    onSend={sendToPatient}
                    onToggleGhost={toggleGhost}
                    title="Pacientes Selecionados"
                    emptyMessage="Nenhum paciente selecionado. Volte para 'Enviar Mensagens' e selecione alguns pacientes."
                  />
                )}

                {currentView === 'all' && (
                  <PatientsList
                    patients={patients}
                    selectedPatients={selectedPatients}
                    ghostPatients={ghostPatients}
                    onToggleSelect={togglePatient}
                    onSend={sendToPatient}
                    onToggleGhost={toggleGhost}
                    title="Todos os Pacientes"
                    emptyMessage="Nenhum paciente cadastrado"
                  />
                )}

                {currentView === 'sent' && <SentMessages />}

                {currentView === 'responses' && <Responses />}

                {currentView === 'settings' && <Settings />}

                {currentView === 'messages' && (
                  <div className="grid lg:grid-cols-2 gap-6">

                    {/* COLUNA ESQUERDA */}
                    <div className="space-y-6">
                      <motion.div 
                        className="backdrop-blur-2xl bg-white/5 rounded-3xl p-6 border border-white/10"
                        style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}
                        whileHover={{ borderColor: 'rgba(255, 77, 77, 0.3)' }}
                      >
                        <label className="block mb-3 text-white">Buscar Paciente</label>
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Digite o nome do paciente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent transition-all text-white placeholder-gray-500"
                            style={{
                              outlineColor: '#C8FF2E',
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#C8FF2E';
                              e.target.style.boxShadow = '0 0 0 2px rgba(200, 255, 46, 0.2)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                      </motion.div>

                      <AgeSlider ageRange={ageRange} setAgeRange={setAgeRange} />

                      <motion.div 
                        className="backdrop-blur-2xl bg-white/5 rounded-3xl p-6 border border-white/10"
                        style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-5 h-5" style={{ color: '#C8FF2E' }} />
                            <span className="text-white">
                              {selectedPatients.size} de {filteredPatients.length} selecionados
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <motion.button
                              onClick={selectAll}
                              className="px-4 py-2 text-sm hover:text-white rounded-xl transition-colors backdrop-blur-xl border"
                              style={{
                                color: '#C8FF2E',
                                backgroundColor: 'rgba(200, 255, 46, 0.1)',
                                borderColor: 'rgba(200, 255, 46, 0.3)',
                              }}
                              whileHover={{ 
                                scale: 1.05, 
                                borderColor: '#C8FF2E',
                                backgroundColor: 'rgba(200, 255, 46, 0.2)',
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Todos
                            </motion.button>

                            <motion.button
                              onClick={clearSelection}
                              className="px-4 py-2 text-sm hover:text-white rounded-xl transition-colors backdrop-blur-xl border"
                              style={{
                                color: '#C8FF2E',
                                backgroundColor: 'rgba(200, 255, 46, 0.1)',
                                borderColor: 'rgba(200, 255, 46, 0.3)',
                              }}
                              whileHover={{ 
                                scale: 1.05, 
                                borderColor: '#C8FF2E',
                                backgroundColor: 'rgba(200, 255, 46, 0.2)',
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Limpar
                            </motion.button>
                          </div>
                        </div>

                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                          {filteredPatients.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              Nenhum paciente encontrado
                            </div>
                          ) : (
                            filteredPatients.map((patient, index) => (
                              <motion.div
                                key={patient.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <PatientCard
                                  patient={patient}
                                  isSelected={selectedPatients.has(patient.id)}
                                  onToggle={() => togglePatient(patient.id)}
                                  onSend={() => sendToPatient(patient)}
                                  onToggleGhost={() => toggleGhost(patient.id)}
                                  isGhost={ghostPatients.has(patient.id)}
                                />
                              </motion.div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    </div>

                    {/* COLUNA DIREITA */}
                    <div className="space-y-6">
                      <TemplateSelector onSelectTemplate={setMessage} />
                      <MessageComposer message={message} setMessage={setMessage} />

                      <motion.button
                        onClick={sendMessages}
                        disabled={selectedPatients.size === 0 || !message.trim()}
                        className="w-full text-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                        style={{
                          background: selectedPatients.size > 0 && message.trim()
                            ? 'linear-gradient(90deg, #C8FF2E 0%, #B4FF4A 100%)'
                            : 'rgba(100, 100, 100, 0.3)',
                          boxShadow: selectedPatients.size > 0 && message.trim() 
                            ? '0 8px 32px rgba(200, 255, 46, 0.5), 0 0 60px rgba(200, 255, 46, 0.3)' 
                            : 'none',
                        }}
                        whileHover={{ scale: selectedPatients.size > 0 && message.trim() ? 1.02 : 1 }}
                        whileTap={{ scale: selectedPatients.size > 0 && message.trim() ? 0.98 : 1 }}
                      >
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            background: 'linear-gradient(90deg, #B4FF4A 0%, #78A82F 100%)',
                          }}
                        />
                        <Send className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">
                          Enviar para {selectedPatients.size} paciente{selectedPatients.size !== 1 ? 's' : ''}
                        </span>
                      </motion.button>

                      {selectedPatients.size > 0 && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-center text-gray-400"
                        >
                          Cada mensagem abrirá em uma nova aba do WhatsApp Web
                        </motion.p>
                      )}
                    </div>

                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </motion.main>

        </div>
      </div>
    </div>
  );
}
