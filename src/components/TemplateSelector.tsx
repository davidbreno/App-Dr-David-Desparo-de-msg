import { FileText, Sparkles, Bell, Calendar } from 'lucide-react';

interface TemplateSelectorProps {
  onSelectTemplate: (message: string) => void;
}

const templates = [
  {
    id: 'review',
    icon: FileText,
    label: 'Revisão',
    message: 'Olá! 😊\n\nEstá na hora da sua revisão periódica. Gostaria de agendar uma consulta?\n\nEstou à disposição!',
  },
  {
    id: 'promo',
    icon: Sparkles,
    label: 'Promoção',
    message: 'Oi! ✨\n\nTemos uma promoção especial este mês! Entre em contato para saber mais sobre nossos serviços.\n\nAproveite!',
  },
  {
    id: 'reminder',
    icon: Bell,
    label: 'Lembrete',
    message: 'Olá! 🔔\n\nEste é um lembrete amigável sobre sua próxima consulta. Confirma presença?\n\nQualquer dúvida, estou aqui!',
  },
  {
    id: 'return',
    icon: Calendar,
    label: 'Retorno',
    message: 'Oi! 📅\n\nGostaria de saber como você está se sentindo após a última consulta. Precisando de algo?\n\nEstou à disposição!',
  },
];

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-6 border border-white/10 shadow-lg">
      <label className="block mb-4 text-white">Mensagens Prontas</label>
      
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.message)}
              className="p-4 rounded-xl text-black transition-all group"
              style={{
                background: 'linear-gradient(135deg, #C8FF2E 0%, #78A82F 100%)',
                boxShadow: '0 4px 15px rgba(200, 255, 46, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(200, 255, 46, 0.4)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(200, 255, 46, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Icon className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm block">{template.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}