import { MessageSquare } from 'lucide-react';

interface MessageComposerProps {
  message: string;
  setMessage: (message: string) => void;
}

export function MessageComposer({ message, setMessage }: MessageComposerProps) {
  return (
    <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-6 border border-white/10 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5" style={{ color: '#C8FF2E' }} />
        <label className="text-white">Sua Mensagem</label>
      </div>
      
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Digite a mensagem que será enviada para os pacientes selecionados..."
        rows={8}
        className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none text-white placeholder-gray-500"
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
      
      <div className="mt-2 text-sm text-gray-400">
        {message.length} caracteres
      </div>
    </div>
  );
}