import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import type { Patient } from '../App';

interface ImportPatientsProps {
  onImport: (patients: Patient[]) => void;
}

export function ImportPatients({ onImport }: ImportPatientsProps) {
  const [inputData, setInputData] = useState('');
  const [previewPatients, setPreviewPatients] = useState<Patient[]>([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('');

  const parseHTML = (html: string): Patient[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const patients: Patient[] = [];

    const rows = doc.querySelectorAll('table tbody tr, table tr');

    if (rows.length > 0) {
      rows.forEach((row, index) => {
        const cells = row.querySelectorAll('td, th');
        if (cells.length >= 5) {
          const name = cells[0]?.textContent?.trim() ?? '';
          const phone = cells[2]?.textContent?.trim().replace(/\D/g, '') ?? '';
          const birthOrVisit = cells[3]?.textContent?.trim() ?? new Date().toISOString().split('T')[0];
          const ageText = cells[4]?.textContent?.trim() ?? '0';

          if (
            name &&
            phone &&
            !name.toLowerCase().includes('nome') &&
            !name.toLowerCase().includes('paciente')
          ) {
            patients.push({
              id: `imported-${Date.now()}-${index}`,
              name,
              age: Number.parseInt(ageText, 10) || 0,
              phone: phone.startsWith('55') ? phone : `55${phone}`,
              lastVisit: birthOrVisit,
            });
          }
        }
      });
    }

    if (patients.length === 0) {
      const listItems = doc.querySelectorAll('ul li, ol li');

      listItems.forEach((item, index) => {
        const text = item.textContent?.trim() ?? '';
        const matches = text.match(/(.+?)\s*[-–—]\s*(\d+)\s*[-–—]\s*([\d\s()+-]+)/);

        if (matches) {
          const [, name, age, phone] = matches;
          const normalizedPhone = phone.replace(/\D/g, '');

          patients.push({
            id: `imported-${Date.now()}-${index}`,
            name: name.trim(),
            age: Number.parseInt(age, 10) || 0,
            phone: normalizedPhone.startsWith('55') ? normalizedPhone : `55${normalizedPhone}`,
            lastVisit: new Date().toISOString().split('T')[0],
          });
        }
      });
    }

    if (patients.length === 0) {
      const patientDivs = doc.querySelectorAll('[data-patient], .patient, .paciente');

      patientDivs.forEach((div, index) => {
        const name = div.querySelector('[data-name], .name, .nome')?.textContent?.trim() ?? '';
        const ageText = div.querySelector('[data-age], .age, .idade')?.textContent?.trim() ?? '0';
        const phone = div.querySelector('[data-phone], .phone, .telefone')?.textContent?.trim().replace(/\D/g, '') ?? '';

        if (name && phone) {
          patients.push({
            id: `imported-${Date.now()}-${index}`,
            name,
            age: Number.parseInt(ageText, 10) || 0,
            phone: phone.startsWith('55') ? phone : `55${phone}`,
            lastVisit: new Date().toISOString().split('T')[0],
          });
        }
      });
    }

    return patients;
  };

  const parseCSV = (csv: string): Patient[] => {
    const lines = csv.split('\n').filter((line) => line.trim().length > 0);
    const patients: Patient[] = [];

    if (lines.length === 0) {
      return patients;
    }

    const startIndex = lines[0].toLowerCase().includes('nome') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i += 1) {
      const cells = lines[i]
        .split(/[,;]/)
        .map((cell) => cell.trim().replace(/^['"]|['"]$/g, ''));

      if (cells.length >= 3) {
        const [name, ageText, phoneRaw, lastVisitRaw] = cells;
        const phone = (phoneRaw ?? '').replace(/\D/g, '');
        const lastVisit = lastVisitRaw && lastVisitRaw.trim().length > 0
          ? lastVisitRaw
          : new Date().toISOString().split('T')[0];

        if (name && phone) {
          patients.push({
            id: `imported-${Date.now()}-${i}`,
            name,
            age: Number.parseInt(ageText ?? '0', 10) || 0,
            phone: phone.startsWith('55') ? phone : `55${phone}`,
            lastVisit,
          });
        }
      }
    }

    return patients;
  };

  const parseJSON = (json: string): Patient[] => {
    const data = JSON.parse(json);
    const array = Array.isArray(data) ? data : [data];
    const patients: Patient[] = [];

    array.forEach((item, index) => {
      const name = item.name ?? item.nome ?? '';
      const ageValue = item.age ?? item.idade ?? 0;
      const phoneValue = item.phone ?? item.telefone ?? '';
      const lastVisitValue = item.lastVisit ?? item.ultimaVisita ?? item.data ?? new Date().toISOString().split('T')[0];

      const phone = String(phoneValue).replace(/\D/g, '');

      if (name && phone) {
        patients.push({
          id: `imported-${Date.now()}-${index}`,
          name,
          age: Number.parseInt(String(ageValue), 10) || 0,
          phone: phone.startsWith('55') ? phone : `55${phone}`,
          lastVisit: lastVisitValue,
        });
      }
    });

    return patients;
  };

  const parseContent = (content: string): Patient[] => {
    const trimmed = content.trim();

    if (!trimmed) {
      return [];
    }

    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return parseJSON(trimmed);
    }

    if (trimmed.includes(',') || trimmed.includes(';')) {
      return parseCSV(trimmed);
    }

    return parseHTML(trimmed);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccessMessage('');
    setFileName(file.name);

    try {
      const text = await file.text();
      const parsed = file.name.endsWith('.json')
        ? parseJSON(text)
        : file.name.endsWith('.csv')
          ? parseCSV(text)
          : file.name.endsWith('.html') || file.name.endsWith('.htm')
            ? parseHTML(text)
            : parseContent(text);

      if (parsed.length === 0) {
        setError('Nenhum paciente encontrado no arquivo. Verifique o formato.');
        setPreviewPatients([]);
      } else {
        setPreviewPatients(parsed);
        setInputData(text);
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
    setSuccessMessage('');
    setIsProcessing(true);

    try {
      const parsed = parseContent(inputData);

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
    if (previewPatients.length === 0) {
      setError('Visualize os dados antes de importar.');
      return;
    }

    onImport(previewPatients);
    setSuccessMessage(`${previewPatients.length.toLocaleString('pt-BR')} paciente(s) importado(s) com sucesso.`);
    setPreviewPatients([]);
    setInputData('');
    setFileName('');
  };

  const handleClear = () => {
    setInputData('');
    setPreviewPatients([]);
    setFileName('');
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1A2332] rounded-2xl shadow-2xl w-full border border-[#2A3441] p-6 space-y-8">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #C8FF2E 0%, #78A82F 100%)',
              boxShadow: '0 4px 15px rgba(200, 255, 46, 0.2)',
            }}
          >
            <FileText className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-white text-xl">Importar Pacientes</h1>
            <p className="text-sm text-gray-400">
              Faça upload de um arquivo ou cole os dados manualmente. Visualize antes de importar.
            </p>
            {fileName && (
              <p className="text-xs text-gray-500 mt-2">
                Arquivo selecionado: <span className="text-gray-300">{fileName}</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="space-y-5">
            <div
              className="bg-[#0F1419] border-2 border-dashed rounded-xl p-6 text-center space-y-3"
              style={{ borderColor: 'rgba(200, 255, 46, 0.3)' }}
            >
              <div
                className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #C8FF2E 0%, #78A82F 100%)',
                  boxShadow: '0 4px 15px rgba(200, 255, 46, 0.2)',
                }}
              >
                <Upload className="w-6 h-6 text-black" />
              </div>
              <div className="space-y-1">
                <p className="text-white font-medium">Selecione um arquivo</p>
                <p className="text-xs text-gray-400">HTML, CSV ou JSON — até 5000 pacientes.</p>
              </div>
              <label
                className="inline-block px-5 py-2.5 text-black rounded-xl cursor-pointer transition-all"
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
                Escolher arquivo
                <input type="file" accept=".html,.htm,.csv,.json" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>

            <div className="bg-[#0F1419] border border-[#2A3441] rounded-xl p-4">
              <h2 className="text-white text-sm font-medium mb-2">Formatos aceitos</h2>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• <span className="text-[#C8FF2E] font-semibold">HTML:</span> Tabela com Nome, CPF, Telefone, Nascimento e Idade.</li>
                <li>• <span className="text-[#C8FF2E] font-semibold">CSV:</span> Nome, Idade, Telefone e Última visita.</li>
                <li>• <span className="text-[#C8FF2E] font-semibold">JSON:</span> Campos <code>name</code>, <code>age</code>, <code>phone</code> e <code>lastVisit</code>.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <label className="block text-white text-sm">Cole os dados manualmente</label>
              <textarea
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder={`HTML, CSV ou JSON...\n\nExemplo CSV:\nAna Silva,34,11987654321,2024-11-20\nCarlos Mendes,45,11976543210,2024-11-15`}
                rows={8}
                className="w-full px-4 py-3 bg-[#0F1419] border border-[#2A3441] rounded-xl focus:outline-none focus:border-transparent transition-all resize-none font-mono text-sm text-white placeholder-gray-500"
                style={{ outlineColor: '#C8FF2E' }}
                disabled={isProcessing}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handlePreview}
                disabled={!inputData.trim() || isProcessing}
                className="px-5 py-2.5 text-black rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: !inputData.trim() || isProcessing
                    ? 'rgba(100, 100, 100, 0.3)'
                    : 'linear-gradient(90deg, #C8FF2E 0%, #78A82F 100%)',
                  boxShadow: !inputData.trim() || isProcessing
                    ? 'none'
                    : '0 4px 15px rgba(200, 255, 46, 0.2)',
                }}
              >
                {isProcessing ? 'Processando...' : 'Visualizar'}
              </button>

              <button
                onClick={handleClear}
                type="button"
                className="px-5 py-2.5 rounded-xl border border-[#2A3441] text-sm text-gray-300 hover:bg-[#2A3441]/50 transition"
                disabled={isProcessing}
              >
                Limpar
              </button>
            </div>

            {isProcessing && (
              <div className="flex items-center gap-3 text-sm text-gray-400 bg-[#0F1419] border border-[#2A3441] rounded-xl p-4">
                <div className="w-3 h-3 rounded-full border-2 border-[#C8FF2E] border-t-transparent animate-spin" />
                Processando dados, aguarde...
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/40 text-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Erro ao processar dados</h3>
                  <p className="text-sm text-red-100/80">{error}</p>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Importação concluída</h3>
                  <p className="text-sm text-emerald-100/80">{successMessage}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-[#0F1419] border border-[#2A3441] rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-white text-sm font-medium">Pré-visualização</h2>
                {previewPatients.length > 0 && (
                  <span className="text-xs text-gray-400">{previewPatients.length.toLocaleString('pt-BR')} pacientes</span>
                )}
              </div>

              {previewPatients.length === 0 ? (
                <p className="text-sm text-gray-400">
                  Visualize os dados para conferir os pacientes antes de importar.
                </p>
              ) : (
                <div className="space-y-3">
                  {previewPatients.slice(0, 10).map((patient) => (
                    <div key={patient.id} className="bg-[#1F2937] rounded-xl p-3 border border-[#2A3441]">
                      <div className="flex items-center justify-between text-sm text-white">
                        <span className="font-medium">{patient.name}</span>
                        <span className="text-gray-400">{patient.age} anos</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {patient.phone} • Última visita: {patient.lastVisit}
                      </div>
                    </div>
                  ))}
                  {previewPatients.length > 10 && (
                    <p className="text-xs text-gray-500">
                      Mostrando os 10 primeiros de {previewPatients.length.toLocaleString('pt-BR')} pacientes.
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={handleImport}
                disabled={previewPatients.length === 0 || isProcessing}
                className="w-full py-2.5 text-black rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: previewPatients.length === 0 || isProcessing
                    ? 'rgba(100, 100, 100, 0.3)'
                    : 'linear-gradient(90deg, #C8FF2E 0%, #78A82F 100%)',
                  boxShadow: previewPatients.length === 0 || isProcessing
                    ? 'none'
                    : '0 4px 15px rgba(200, 255, 46, 0.2)',
                }}
              >
                Importar {previewPatients.length > 0 && `(${previewPatients.length.toLocaleString('pt-BR')})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}