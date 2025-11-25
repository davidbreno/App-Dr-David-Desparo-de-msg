import { useState } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, File } from 'lucide-react';
import type { Patient } from '../App';

interface ImportPatientsProps {
  onImport: (patients: Patient[]) => void;
}

export function ImportPatients({ onImport }: ImportPatientsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [htmlInput, setHtmlInput] = useState('');
  const [previewPatients, setPreviewPatients] = useState<Patient[]>([]);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('');

  const parseHTML = (html: string): Patient[] => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const patients: Patient[] = [];

      // Tentar diferentes formatos de tabela HTML
      
      // Formato 1: Tabela com thead/tbody
      const rows = doc.querySelectorAll('table tbody tr, table tr');
      
      if (rows.length > 0) {
        rows.forEach((row, index) => {
          const cells = row.querySelectorAll('td, th');
          if (cells.length >= 3) {
            const name = cells[0]?.textContent?.trim() || '';
            const ageText = cells[1]?.textContent?.trim() || '0';
            const phone = cells[2]?.textContent?.trim().replace(/\D/g, '') || '';
            const lastVisit = cells[3]?.textContent?.trim() || new Date().toISOString().split('T')[0];

            // Pular linhas de cabeçalho
            if (name && phone && !name.toLowerCase().includes('nome') && !name.toLowerCase().includes('paciente')) {
              patients.push({
                id: `imported-${Date.now()}-${index}`,
                name,
                age: parseInt(ageText) || 0,
                phone: phone.startsWith('55') ? phone : `55${phone}`,
                lastVisit,
              });
            }
          }
        });
      } else {
        // Formato 2: Lista (ul/ol)
        const listItems = doc.querySelectorAll('ul li, ol li');
        
        listItems.forEach((item, index) => {
          const text = item.textContent?.trim() || '';
          
          // Tentar extrair: Nome - Idade - Telefone
          const matches = text.match(/(.+?)\s*[-–—]\s*(\d+)\s*[-–—]\s*([\d\s\(\)\+\-]+)/);
          
          if (matches) {
            const [, name, age, phone] = matches;
            patients.push({
              id: `imported-${Date.now()}-${index}`,
              name: name.trim(),
              age: parseInt(age) || 0,
              phone: phone.replace(/\D/g, '').startsWith('55') 
                ? phone.replace(/\D/g, '') 
                : `55${phone.replace(/\D/g, '')}`,
              lastVisit: new Date().toISOString().split('T')[0],
            });
          }
        });
      }

      // Formato 3: Divs com classes ou data attributes
      if (patients.length === 0) {
        const patientDivs = doc.querySelectorAll('[data-patient], .patient, .paciente');
        
        patientDivs.forEach((div, index) => {
          const name = div.querySelector('[data-name], .name, .nome')?.textContent?.trim() || '';
          const ageText = div.querySelector('[data-age], .age, .idade')?.textContent?.trim() || '0';
          const phone = div.querySelector('[data-phone], .phone, .telefone')?.textContent?.trim().replace(/\D/g, '') || '';
          
          if (name && phone) {
            patients.push({
              id: `imported-${Date.now()}-${index}`,
              name,
              age: parseInt(ageText) || 0,
              phone: phone.startsWith('55') ? phone : `55${phone}`,
              lastVisit: new Date().toISOString().split('T')[0],
            });
          }
        });
      }

      return patients;
    } catch (err) {
      throw new Error('Erro ao processar HTML. Verifique o formato.');
    }
  };

  const parseCSV = (csv: string): Patient[] => {
    try {
      const lines = csv.split('\n').filter(line => line.trim());
      const patients: Patient[] = [];
      
      // Pular primeira linha se for cabeçalho
      const startIndex = lines[0].toLowerCase().includes('nome') ? 1 : 0;
      
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
        // Suportar vírgula ou ponto-e-vírgula como separador
        const cells = line.split(/[,;]/).map(cell => cell.trim().replace(/^["']|["']$/g, ''));
        
        if (cells.length >= 3) {
          const name = cells[0];
          const ageText = cells[1];
          const phone = cells[2].replace(/\D/g, '');
          const lastVisit = cells[3] || new Date().toISOString().split('T')[0];
          
          if (name && phone) {
            patients.push({
              id: `imported-${Date.now()}-${i}`,
              name,
              age: parseInt(ageText) || 0,
              phone: phone.startsWith('55') ? phone : `55${phone}`,
              lastVisit,
            });
          }
        }
      }
      
      return patients;
    } catch (err) {
      throw new Error('Erro ao processar CSV. Verifique o formato.');
    }
  };

  const parseJSON = (json: string): Patient[] => {
    try {
      const data = JSON.parse(json);
      const patients: Patient[] = [];
      
      const array = Array.isArray(data) ? data : [data];
      
      array.forEach((item, index) => {
        const name = item.name || item.nome || item.Name || '';
        const age = parseInt(item.age || item.idade || item.Age || '0');
        const phone = String(item.phone || item.telefone || item.Phone || '').replace(/\D/g, '');
        const lastVisit = item.lastVisit || item.ultimaVisita || item.data || new Date().toISOString().split('T')[0];
        
        if (name && phone) {
          patients.push({
            id: `imported-${Date.now()}-${index}`,
            name,
            age,
            phone: phone.startsWith('55') ? phone : `55${phone}`,
            lastVisit,
          });
        }
      });
      
      return patients;
    } catch (err) {
      throw new Error('Erro ao processar JSON. Verifique o formato.');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError('');
    setFileName(file.name);

    try {
      const text = await file.text();
      let parsed: Patient[] = [];

      // Detectar tipo de arquivo e processar
      if (file.name.endsWith('.json')) {
        parsed = parseJSON(text);
      } else if (file.name.endsWith('.csv')) {
        parsed = parseCSV(text);
      } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        parsed = parseHTML(text);
      } else {
        // Tentar detectar automaticamente
        if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
          parsed = parseJSON(text);
        } else if (text.includes(',') || text.includes(';')) {
          parsed = parseCSV(text);
        } else {
          parsed = parseHTML(text);
        }
      }

      if (parsed.length === 0) {
        setError('Nenhum paciente encontrado no arquivo. Verifique o formato.');
        setPreviewPatients([]);
      } else {
        setPreviewPatients(parsed);
        setHtmlInput(text);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar arquivo');
      setPreviewPatients([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePreview = () => {
    setError('');
    setIsProcessing(true);
    
    try {
      let parsed: Patient[] = [];
      
      // Tentar detectar formato
      const trimmed = htmlInput.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        parsed = parseJSON(htmlInput);
      } else if (htmlInput.includes(',') || htmlInput.includes(';')) {
        parsed = parseCSV(htmlInput);
      } else {
        parsed = parseHTML(htmlInput);
      }
      
      if (parsed.length === 0) {
        setError('Nenhum paciente encontrado. Verifique o formato.');
        setPreviewPatients([]);
      } else {
        setPreviewPatients(parsed);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar dados');
      setPreviewPatients([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    if (previewPatients.length > 0) {
      onImport(previewPatients);
      setHtmlInput('');
      setPreviewPatients([]);
      setFileName('');
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setHtmlInput('');
    setPreviewPatients([]);
    setError('');
    setFileName('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-black rounded-xl transition-all"
        style={{
          background: 'linear-gradient(90deg, #C8FF2E 0%, #78A82F 100%)',
          boxShadow: '0 4px 15px rgba(200, 255, 46, 0.2)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(200, 255, 46, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(200, 255, 46, 0.2)';
        }}
      >
        <Upload className="w-4 h-4" />
        Importar Pacientes
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1A2332] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-[#2A3441]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2A3441]">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #C8FF2E 0%, #78A82F 100%)',
                boxShadow: '0 4px 15px rgba(200, 255, 46, 0.2)',
              }}
            >
              <FileText className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-white">Importar Pacientes</h2>
              <p className="text-sm text-gray-400">
                {previewPatients.length > 0 
                  ? `${previewPatients.length.toLocaleString('pt-BR')} pacientes encontrados`
                  : 'Upload de arquivo ou cole os dados'}
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2A3441] transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* File Upload */}
          <div 
            className="bg-[#0F1419] border-2 border-dashed rounded-xl p-8"
            style={{
              borderColor: 'rgba(200, 255, 46, 0.3)',
            }}
          >
            <div className="text-center space-y-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                style={{
                  background: 'linear-gradient(135deg, #C8FF2E 0%, #78A82F 100%)',
                  boxShadow: '0 4px 15px rgba(200, 255, 46, 0.2)',
                }}
              >
                <File className="w-8 h-8 text-black" />
              </div>
              <div>
                <h3 className="text-white mb-1">Escolha um arquivo</h3>
                <p className="text-sm text-gray-400">
                  Suporta HTML, CSV, JSON (até 5000+ pacientes)
                </p>
              </div>
              <label 
                className="inline-block px-6 py-3 text-black rounded-xl transition-all cursor-pointer"
                style={{
                  background: 'linear-gradient(90deg, #C8FF2E 0%, #78A82F 100%)',
                  boxShadow: '0 4px 15px rgba(200, 255, 46, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(200, 255, 46, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(200, 255, 46, 0.2)';
                }}
              >
                <input
                  type="file"
                  accept=".html,.htm,.csv,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                Selecionar Arquivo
              </label>
              {fileName && (
                <p className="text-sm" style={{ color: '#C8FF2E' }}>
                  📄 {fileName}
                </p>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-[#0F1419] border border-[#2A3441] rounded-xl p-4">
            <h3 className="text-white mb-2">Formatos aceitos:</h3>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>• <strong style={{ color: '#C8FF2E' }}>HTML:</strong> Tabelas ou listas com Nome, Idade, Telefone, Data</li>
              <li>• <strong style={{ color: '#C8FF2E' }}>CSV:</strong> Nome, Idade, Telefone, Última Visita (separado por vírgula ou ponto-e-vírgula)</li>
              <li>• <strong style={{ color: '#C8FF2E' }}>JSON:</strong> Array de objetos com campos name/nome, age/idade, phone/telefone</li>
            </ul>
          </div>

          {/* Manual Input */}
          <div>
            <label className="block mb-2 text-white">Ou cole os dados aqui:</label>
            <textarea
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              placeholder={`HTML, CSV ou JSON...\n\nExemplo CSV:\nAna Silva,34,11987654321,2024-11-20\nCarlos Mendes,45,11976543210,2024-11-15`}
              rows={8}
              className="w-full px-4 py-3 bg-[#0F1419] border border-[#2A3441] rounded-xl focus:outline-none focus:border-transparent transition-all resize-none font-mono text-sm text-white placeholder-gray-500"
              style={{
                outlineColor: '#C8FF2E',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#C8FF2E';
                e.target.style.boxShadow = '0 0 0 2px rgba(200, 255, 46, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#2A3441';
                e.target.style.boxShadow = 'none';
              }}
              disabled={isProcessing}
            />
          </div>

          {/* Preview Button */}
          {!fileName && (
            <button
              onClick={handlePreview}
              disabled={!htmlInput.trim() || isProcessing}
              className="w-full py-3 text-black rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: !htmlInput.trim() || isProcessing
                  ? 'rgba(100, 100, 100, 0.3)'
                  : 'linear-gradient(90deg, #C8FF2E 0%, #78A82F 100%)',
                boxShadow: !htmlInput.trim() || isProcessing
                  ? 'none'
                  : '0 4px 15px rgba(200, 255, 46, 0.2)',
              }}
              onMouseEnter={(e) => {
                if (!(!htmlInput.trim() || isProcessing)) {
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(200, 255, 46, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!(!htmlInput.trim() || isProcessing)) {
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(200, 255, 46, 0.2)';
                }
              }}
            >
              {isProcessing ? 'Processando...' : 'Visualizar Importação'}
            </button>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center justify-center gap-3 p-4 bg-[#0F1419] border border-[#2A3441] rounded-xl">
              <div 
                className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                style={{
                  borderColor: '#C8FF2E',
                  borderTopColor: 'transparent',
                }}
              ></div>
              <p className="text-sm text-gray-300">Processando arquivo...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div 
              className="flex items-start gap-3 p-4 rounded-xl border"
              style={{
                backgroundColor: 'rgba(200, 255, 46, 0.1)',
                borderColor: '#C8FF2E',
              }}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C8FF2E' }} />
              <p className="text-sm" style={{ color: '#C8FF2E' }}>{error}</p>
            </div>
          )}

          {/* Preview */}
          {previewPatients.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2" style={{ color: '#C8FF2E' }}>
                  <CheckCircle className="w-5 h-5" />
                  <span>{previewPatients.length.toLocaleString('pt-BR')} paciente(s) encontrado(s)</span>
                </div>
                {previewPatients.length > 10 && (
                  <span className="text-sm text-gray-400">
                    Mostrando primeiros 10
                  </span>
                )}
              </div>

              <div className="bg-[#0F1419] border border-[#2A3441] rounded-xl p-4 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {previewPatients.slice(0, 10).map((patient) => (
                    <div
                      key={patient.id}
                      className="bg-[#1A2332] p-3 rounded-lg border border-[#2A3441]"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white">{patient.name}</p>
                          <p className="text-sm text-gray-400">
                            {patient.age} anos • {patient.phone}
                          </p>
                        </div>
                        <CheckCircle className="w-5 h-5" style={{ color: '#C8FF2E' }} />
                      </div>
                    </div>
                  ))}
                  {previewPatients.length > 10 && (
                    <div className="text-center text-sm text-gray-400 pt-2">
                      + {(previewPatients.length - 10).toLocaleString('pt-BR')} pacientes adicionais
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-6 border-t border-[#2A3441] bg-[#0F1419]">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 border border-[#2A3441] text-gray-300 rounded-xl hover:bg-[#2A3441] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleImport}
            disabled={previewPatients.length === 0 || isProcessing}
            className="flex-1 py-3 text-black rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: previewPatients.length === 0 || isProcessing
                ? 'rgba(100, 100, 100, 0.3)'
                : 'linear-gradient(90deg, #C8FF2E 0%, #78A82F 100%)',
              boxShadow: previewPatients.length === 0 || isProcessing
                ? 'none'
                : '0 4px 15px rgba(200, 255, 46, 0.2)',
            }}
            onMouseEnter={(e) => {
              if (!(previewPatients.length === 0 || isProcessing)) {
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(200, 255, 46, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!(previewPatients.length === 0 || isProcessing)) {
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(200, 255, 46, 0.2)';
              }
            }}
          >
            Importar {previewPatients.length > 0 && `(${previewPatients.length.toLocaleString('pt-BR')})`}
          </button>
        </div>
      </div>
    </div>
  );
}