import { MessageCircle, Clock, TrendingUp } from 'lucide-react';

interface Response {
  id: string;
  patient: string;
  message: string;
  reply: string;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export function Responses() {
  // Dados mockados de respostas
  const responses: Response[] = [];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-black';
      case 'neutral':
        return 'text-black';
      default:
        return 'text-gray-400';
    }
  };

  const getSentimentBg = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '#C8FF2E';
      case 'neutral':
        return '#B4FF4A';
      default:
        return '#2A3441';
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '😊 Positiva';
      case 'neutral':
        return '😐 Neutra';
      default:
        return '😕 Negativa';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com Stats */}
      <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #C8FF2E 0%, #78A82F 100%)',
                boxShadow: '0 4px 15px rgba(200, 255, 46, 0.3)',
              }}
            >
              <MessageCircle className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-white">Respostas Recebidas</h2>
              <p className="text-sm text-gray-400">{responses.length} respostas</p>
            </div>
          </div>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#0E0E0E] rounded-xl p-4 border border-white/5">
            <p className="text-sm text-gray-400 mb-1">Taxa de Resposta</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: '#C8FF2E' }} />
              <p className="text-xl text-white">0%</p>
            </div>
          </div>
          <div className="bg-[#0E0E0E] rounded-xl p-4 border border-white/5">
            <p className="text-sm text-gray-400 mb-1">Tempo Médio</p>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: '#C8FF2E' }} />
              <p className="text-xl text-white">-</p>
            </div>
          </div>
          <div className="bg-[#0E0E0E] rounded-xl p-4 border border-white/5">
            <p className="text-sm text-gray-400 mb-1">Sentimento</p>
            <p className="text-xl text-white">-</p>
          </div>
        </div>
      </div>

      {/* Lista de Respostas */}
      <div className="space-y-4">
        {responses.length === 0 ? (
          <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-12 text-center">
            <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-white mb-2">Nenhuma resposta recebida ainda</p>
            <p className="text-sm text-gray-400">
              Quando seus pacientes responderem, as mensagens aparecerão aqui.
            </p>
          </div>
        ) : (
          responses.map((response) => (
            <div
              key={response.id}
              className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 transition-all"
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
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-black"
                  style={{
                    background: 'linear-gradient(135deg, #C8FF2E 0%, #78A82F 100%)',
                    boxShadow: '0 4px 15px rgba(200, 255, 46, 0.3)',
                  }}
                >
                  {response.patient.charAt(0).toUpperCase()}
                </div>

                {/* Conteúdo */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white">{response.patient}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {response.timestamp}
                      </span>
                      <span 
                        className={`text-xs px-3 py-1 rounded-lg ${getSentimentColor(response.sentiment)}`} 
                        style={{ backgroundColor: getSentimentBg(response.sentiment) }}
                      >
                        {getSentimentLabel(response.sentiment)}
                      </span>
                    </div>
                  </div>

                  {/* Mensagem enviada */}
                  <div className="bg-[#0E0E0E] rounded-xl p-3 mb-3 border border-white/5">
                    <p className="text-xs text-gray-500 mb-1">Sua mensagem:</p>
                    <p className="text-sm text-gray-400">{response.message}</p>
                  </div>

                  {/* Resposta recebida */}
                  <div 
                    className="rounded-xl p-3 border"
                    style={{
                      background: 'linear-gradient(90deg, rgba(200, 255, 46, 0.1) 0%, rgba(180, 255, 74, 0.1) 100%)',
                      borderColor: 'rgba(200, 255, 46, 0.3)',
                    }}
                  >
                    <p className="text-xs mb-1" style={{ color: '#C8FF2E' }}>Resposta:</p>
                    <p className="text-white">{response.reply}</p>
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
