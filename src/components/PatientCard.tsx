import { useState } from 'react';
import { User, Calendar, Check, Send, UserPlus, Ghost, MoreVertical } from 'lucide-react';
import type { Patient } from '../App';


interface PatientCardProps {
  patient: Patient;
  isSelected: boolean;
  isGhost?: boolean;
  onToggle: () => void;
  onSend?: (patient: Patient) => void;
  onToggleGhost?: (patientId: string) => void;
}

export function PatientCard({ patient, isSelected, isGhost, onToggle, onSend, onToggleGhost }: PatientCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleAction = (action: 'select' | 'send' | 'ghost', e: React.MouseEvent) => {
    e.stopPropagation();
    switch (action) {
      case 'select':
        onToggle();
        break;
      case 'send':
        if (onSend) {
          onSend(patient);
        }
        break;
      case 'ghost':
        if (onToggleGhost) {
          onToggleGhost(patient.id);
        }
        break;
    }
    setShowMenu(false);
  };

  return (
    <div className="relative">
      {/* ...restante do componente... */}
    </div>
  );
}
