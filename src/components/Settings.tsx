import { useState } from 'react';
import { Bell, Lock, Palette, Globe, Save, Check } from 'lucide-react';

export function Settings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: false,
    autoResponse: true,
    darkMode: true,
    language: 'pt-BR',
    messageDelay: '500',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Notificações */}
      <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5" style={{ color: '#C8FF2E' }} />
          <h3 className="text-white">Notificações</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#0E0E0E] rounded-xl border border-white/5">
            <div>
              <p className="text-white">Notificações Push</p>
              <p className="text-sm text-gray-400">Receber notificações de novas respostas</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#2A3441] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C8FF2E]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0E0E0E] rounded-xl border border-white/5">
            <div>
              <p className="text-white">Alertas por Email</p>
              <p className="text-sm text-gray-400">Receber resumo diário por email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailAlerts}
                onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#2A3441] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C8FF2E]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0E0E0E] rounded-xl border border-white/5">
            <div>
              <p className="text-white">Resposta Automática</p>
              <p className="text-sm text-gray-400">Enviar confirmação de recebimento</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoResponse}
                onChange={(e) => setSettings({ ...settings, autoResponse: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#2A3441] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C8FF2E]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Aparência */}
      <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Palette className="w-5 h-5" style={{ color: '#C8FF2E' }} />
          <h3 className="text-white">Aparência</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#0E0E0E] rounded-xl border border-white/5">
            <div>
              <p className="text-white">Modo Escuro</p>
              <p className="text-sm text-gray-400">Interface com tema escuro</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#2A3441] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C8FF2E]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Idioma e Região */}
      <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5" style={{ color: '#C8FF2E' }} />
          <h3 className="text-white">Idioma e Região</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-white">Idioma</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-4 py-3 bg-[#0E0E0E] border border-white/10 rounded-xl focus:outline-none focus:border-transparent transition-all text-white"
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
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-white">Delay entre Mensagens (ms)</label>
            <input
              type="number"
              value={settings.messageDelay}
              onChange={(e) => setSettings({ ...settings, messageDelay: e.target.value })}
              className="w-full px-4 py-3 bg-[#0E0E0E] border border-white/10 rounded-xl focus:outline-none focus:border-transparent transition-all text-white"
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
              min="100"
              max="5000"
              step="100"
            />
            <p className="text-sm text-gray-400 mt-2">
              Tempo de espera entre abrir cada conversa no WhatsApp
            </p>
          </div>
        </div>
      </div>

      {/* Segurança */}
      <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5" style={{ color: '#C8FF2E' }} />
          <h3 className="text-white">Segurança</h3>
        </div>
        
        <div className="space-y-4">
          <button 
            className="w-full p-4 bg-[#0E0E0E] rounded-xl border border-white/10 text-left transition-colors"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#C8FF2E';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <p className="text-white">Alterar Senha</p>
            <p className="text-sm text-gray-400">Última alteração: 30 dias atrás</p>
          </button>

          <button 
            className="w-full p-4 bg-[#0E0E0E] rounded-xl border border-white/10 text-left transition-colors"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#C8FF2E';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <p className="text-white">Autenticação em Dois Fatores</p>
            <p className="text-sm text-gray-400">Adicionar camada extra de segurança</p>
          </button>
        </div>
      </div>

      {/* Botão Salvar */}
      <button
        onClick={handleSave}
        className="w-full py-4 text-black rounded-xl transition-all flex items-center justify-center gap-2"
        style={{
          background: 'linear-gradient(90deg, #C8FF2E 0%, #B4FF4A 100%)',
          boxShadow: '0 8px 32px rgba(200, 255, 46, 0.5)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(200, 255, 46, 0.6)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(200, 255, 46, 0.5)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {saved ? (
          <>
            <Check className="w-5 h-5" />
            Configurações Salvas!
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Salvar Configurações
          </>
        )}
      </button>
    </div>
  );
}