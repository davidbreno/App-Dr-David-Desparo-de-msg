import { Send, Check, Clock, Calendar } from 'lucide-react';

interface Message {
  id: string;
  patient: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export function SentMessages() {
  // Dados mockados de mensagens enviadas
  const messages: Message[] = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'read':
        return '#C8FF2E';
      case 'delivered':
        return '#B4FF4A';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read':
        return <Check className="w-4 h-4" />;
      case 'delivered':
        return <Check className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'read':
        return 'Lida';
      case 'delivered':
        return 'Entregue';
      default:
        return 'Enviada';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #C8FF2E 0%, #78A82F 100%)',
                boxShadow: '0 4px 15px rgba(200, 255, 46, 0.3)',
              }}
            >
              <Send className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-white">Mensagens Enviadas</h2>
              <p className="text-sm text-gray-400">{messages.length} mensagens</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Lidas</p>
              <p className="text-white">
                {messages.filter((m) => m.status === 'read').length}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Entregues</p>
              <p className="text-white">
                {messages.filter((m) => m.status === 'delivered').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Mensagens */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-12 text-center">
            <Send className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-white mb-2">Nenhuma mensagem enviada ainda</p>
            <p className="text-sm text-gray-400">
              Comece selecionando pacientes e enviando mensagens!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 transition-all"
              style={{
                boxShadow: '0 4px 20px rgba(200, 255, 46, 0.05)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 8px 30px rgba(200, 255, 46, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 4px 20px rgba(200, 255, 46, 0.05)';
              }}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-black"
                  style={{
                    background: 'linear-gradient(135deg, #C8FF2E 0%, #78A82F 100%)',
                    boxShadow: '0 4px 15px rgba(200, 255, 46, 0.3)',
                  }}
                >
                  {message.patient.charAt(0).toUpperCase()}
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white">{message.patient}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {message.timestamp}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {message.message}
                  </p>

                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center gap-1 px-3 py-1 rounded-lg text-black text-xs"
                      style={{
                        backgroundColor: getStatusColor(message.status),
                      }}
                    >
                      {getStatusIcon(message.status)}
                      <span>{getStatusText(message.status)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}