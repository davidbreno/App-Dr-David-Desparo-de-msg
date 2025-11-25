import { useState } from 'react';
import { Users, Calendar, Phone, Send, UserPlus, Ghost, MoreVertical, Check, Search } from 'lucide-react';
import type { Patient } from '../App';
import { AgeSlider } from './AgeSlider';

interface PatientsListProps {
  patients: Patient[];
  selectedPatients: Set<string>;
  ghostPatients: Set<string>;
  onToggleSelect: (patientId: string) => void;
  onSend: (patient: Patient) => void;
  onToggleGhost: (patientId: string) => void;
  title: string;
  emptyMessage: string;
}

export function PatientsList({ 
  patients, 
  selectedPatients,
  ghostPatients,
  onToggleSelect,
  onSend,
  onToggleGhost,
  title, 
  emptyMessage 
}: PatientsListProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 80]);

  // Filtrar pacientes baseado na busca e idade
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAge = patient.age >= ageRange[0] && patient.age <= ageRange[1];
    return matchesSearch && matchesAge;
  });

  const handleAction = (action: 'select' | 'send' | 'ghost', patient: Patient, e: React.MouseEvent) => {
    e.stopPropagation();
    
    switch (action) {
      case 'select':
        onToggleSelect(patient.id);
        break;
      case 'send':
        onSend(patient);
        break;
      case 'ghost':
        onToggleGhost(patient.id);
        break;
    }
    
    setOpenMenuId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{
              background: 'linear-gradient(135deg, #C8FF2E 0%, #78A82F 100%)',
              boxShadow: '0 4px 15px rgba(200, 255, 46, 0.3)',
            }}>
              <Users className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-white">{title}</h2>
              <p className="text-sm text-gray-400">{filteredPatients.length} de {patients.length} pacientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Busca */}
      <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
        <label className="block mb-3 text-white">Buscar Paciente</label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Digite o nome do paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#0E0E0E] border border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8FF2E] focus:border-transparent transition-all text-white placeholder-gray-500"
          />
        </div>
      </div>

      {/* Filtro de Idade */}
      <AgeSlider ageRange={ageRange} setAgeRange={setAgeRange} />

      {/* Lista */}
      {filteredPatients.length === 0 ? (
        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-12 text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPatients.map((patient) => {
            const isSelected = selectedPatients.has(patient.id);
            const isGhost = ghostPatients.has(patient.id);
            const isMenuOpen = openMenuId === patient.id;

            return (
              <div key={patient.id} className="relative">
                <button
                  onClick={() => setOpenMenuId(isMenuOpen ? null : patient.id)}
                  className={`w-full bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 hover:shadow-lg transition-all text-left ${
                    isGhost ? 'opacity-40' : 'opacity-100'
                  }`}
                  style={{
                    boxShadow: '0 4px 20px rgba(200, 255, 46, 0.05)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(200, 255, 46, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(200, 255, 46, 0.05)';
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl ${
                      isSelected 
                        ? 'text-black' 
                        : 'bg-[#0E0E0E] text-gray-400'
                    }`} style={isSelected ? {
                      background: 'linear-gradient(135deg, #C8FF2E 0%, #78A82F 100%)',
                      boxShadow: '0 4px 15px rgba(200, 255, 46, 0.3)',
                    } : {}}>
                      {isGhost ? <Ghost className="w-6 h-6" /> : patient.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white">{patient.name}</h3>
                        {isSelected && (
                          <span className="px-2 py-1 rounded-lg text-xs flex items-center gap-1" style={{
                            backgroundColor: 'rgba(200, 255, 46, 0.1)',
                            color: '#C8FF2E',
                          }}>
                            <Check className="w-3 h-3" />
                            Selecionado
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>{patient.age} anos</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Phone className="w-4 h-4" />
                          <span>{patient.phone}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Última visita: {new Date(patient.lastVisit).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Icon */}
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </div>
                </button>

                {/* Menu de Ações */}
                {isMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setOpenMenuId(null)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden">
                      <button
                        onClick={(e) => handleAction('select', patient, e)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#0E0E0E] transition-colors text-left"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected ? 'text-black' : 'bg-[#0E0E0E]'
                        }`} style={isSelected ? {
                          background: 'rgba(200, 255, 46, 0.2)',
                        } : {}}>
                          {isSelected ? <Check className="w-4 h-4" style={{ color: '#C8FF2E' }} /> : <UserPlus className="w-4 h-4 text-gray-400" />}
                        </div>
                        <div>
                          <p className="text-white text-sm">
                            {isSelected ? 'Remover da Seleção' : 'Adicionar à Seleção'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {isSelected ? 'Desmarcar paciente' : 'Marcar para envio'}
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={(e) => handleAction('send', patient, e)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#0E0E0E] transition-colors text-left border-t border-white/5"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                          background: 'linear-gradient(135deg, #C8FF2E 0%, #78A82F 100%)',
                          boxShadow: '0 4px 15px rgba(200, 255, 46, 0.3)',
                        }}>
                          <Send className="w-4 h-4 text-black" />
                        </div>
                        <div>
                          <p className="text-white text-sm">Enviar Mensagem</p>
                          <p className="text-xs text-gray-400">Enviar diretamente</p>
                        </div>
                      </button>

                      <button
                        onClick={(e) => handleAction('ghost', patient, e)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#0E0E0E] transition-colors text-left border-t border-white/5"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isGhost ? '' : 'bg-[#0E0E0E]'
                        }`} style={isGhost ? {
                          background: 'rgba(200, 255, 46, 0.2)',
                        } : {}}>
                          <Ghost className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-white text-sm">
                            {isGhost ? 'Remover Fantasma' : 'Marcar como Fantasma'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {isGhost ? 'Tornar visível' : 'Ocultar parcialmente'}
                          </p>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
