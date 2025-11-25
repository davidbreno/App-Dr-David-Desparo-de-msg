import { useState } from 'react';
import { Lock, User, Sparkles, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string, password: string) => boolean;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular delay de autenticação
    setTimeout(() => {
      const success = onLogin(username, password);
      
      if (!success) {
        setError('Usuário ou senha incorretos');
        setPassword('');
      }
      
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div 
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'linear-gradient(135deg, #C8FF2E 0%, #78A82F 100%)',
              boxShadow: '0 8px 40px rgba(200, 255, 46, 0.4)',
            }}
          >
            <Sparkles className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-white mb-2">Pulso do Consultório</h1>
          <p className="text-gray-400">Entre com suas credenciais</p>
        </div>

        {/* Card de Login */}
        <div className="bg-[#1A1A1A] rounded-2xl shadow-2xl border border-white/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Usuário */}
            <div>
              <label className="block mb-2 text-white">Usuário</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Seu nome de usuário"
                  className="w-full pl-12 pr-4 py-3 bg-[#0E0E0E] border border-white/10 rounded-xl focus:outline-none focus:border-transparent transition-all text-white placeholder-gray-500"
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
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block mb-2 text-white">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className="w-full pl-12 pr-12 py-3 bg-[#0E0E0E] border border-white/10 rounded-xl focus:outline-none focus:border-transparent transition-all text-white placeholder-gray-500"
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
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors"
                  style={{
                    color: showPassword ? '#C8FF2E' : '#9ca3af',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#C8FF2E';
                  }}
                  onMouseLeave={(e) => {
                    if (!showPassword) {
                      e.currentTarget.style.color = '#9ca3af';
                    }
                  }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div 
                className="px-4 py-3 rounded-xl text-sm border"
                style={{
                  backgroundColor: 'rgba(200, 255, 46, 0.1)',
                  borderColor: '#C8FF2E',
                  color: '#C8FF2E',
                }}
              >
                {error}
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-black py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(90deg, #C8FF2E 0%, #B4FF4A 100%)',
                boxShadow: '0 8px 32px rgba(200, 255, 46, 0.5)',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(200, 255, 46, 0.6)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(200, 255, 46, 0.5)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {isLoading ? (
                <>
                  <div 
                    className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: '#000' }}
                  ></div>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Informação de Teste */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-400 text-center mb-2">
              Credenciais de teste:
            </p>
            <div className="bg-[#0E0E0E] rounded-lg p-3 text-sm text-gray-300 space-y-1">
              <p><strong style={{ color: '#C8FF2E' }}>Usuário:</strong> admin</p>
              <p><strong style={{ color: '#C8FF2E' }}>Senha:</strong> 123456</p>
            </div>
          </div>
        </div>

        {/* Aviso de Segurança */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            ⚠️ Este é um sistema de demonstração. Para uso em produção,<br />
            utilize autenticação segura com backend e criptografia.
          </p>
        </div>
      </div>
    </div>
  );
}