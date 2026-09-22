import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  ArrowLeft, 
  Building2, 
  UserCheck, 
  ExternalLink, 
  Eye, 
  Trash2, 
  Settings, 
  RefreshCw, 
  Phone, 
  Mail, 
  Target, 
  CheckCircle2, 
  X,
  Lock,
  Calendar,
  Sparkles,
  LogOut,
  KeyRound,
  Link2,
  Copy,
  Check,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DIMENSIONS } from '../data/dimensions';
import type { SubmissionRecord } from '../types';

interface AdminDashboardProps {
  onBackToApp: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProfile, setFilterProfile] = useState<'all' | 'cnpj' | 'pf'>('all');
  const [filterStage, setFilterStage] = useState<string>('all');

  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionRecord | null>(null);
  const [showDetailedAnswers, setShowDetailedAnswers] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [whatsappConfig, setWhatsappConfig] = useState('5571999999999');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<'public' | 'gestora' | null>(null);

  const handleCopyLink = (type: 'public' | 'gestora') => {
    const origin = window.location.origin;
    const link = type === 'public' ? `${origin}/` : `${origin}/?gestora=true`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(type);
      setTimeout(() => setCopiedLink(null), 2500);
    }).catch(() => {});
  };

  // Check existing session token
  useEffect(() => {
    const token = sessionStorage.getItem('mil_admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('mil_admin_token') || '';
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch submissions and settings when authenticated
  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/submissions', {
        headers: getAuthHeaders()
      });
      if (res.status === 401) {
        sessionStorage.removeItem('mil_admin_token');
        setIsAuthenticated(false);
        setAuthError('Sessão expirada. Digite sua senha novamente.');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (err) {
      console.error('Erro ao buscar respostas:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.whatsappNumber) {
          setWhatsappConfig(data.whatsappNumber);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar configurações:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
      fetchSettings();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        sessionStorage.setItem('mil_admin_token', data.token);
        setIsAuthenticated(true);
        setPasswordInput('');
      } else {
        setAuthError(data.error || 'Senha incorreta.');
      }
    } catch {
      setAuthError('Erro ao comunicar com o servidor de autenticação.');
    }
  };

  const handleLogout = async () => {
    const token = sessionStorage.getItem('mil_admin_token');
    if (token) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: getAuthHeaders()
      }).catch(() => {});
    }
    sessionStorage.removeItem('mil_admin_token');
    setIsAuthenticated(false);
    onBackToApp();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o registro de ${name}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/submissions/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      setSubmissions(prev => prev.filter(s => s.id !== id));
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
    } catch (err) {
      console.error('Erro ao excluir:', err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { whatsappNumber: whatsappConfig };
      if (newAdminPassword.trim()) {
        payload.adminPassword = newAdminPassword.trim();
      }

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      if (res.ok) {
        setSaveSuccessMsg('Configurações atualizadas com sucesso!');
        setNewAdminPassword('');
        setTimeout(() => {
          setSaveSuccessMsg(null);
          setIsSettingsOpen(false);
        }, 1800);
      }
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
    }
  };

  // Export to CSV formatted specifically for Microsoft Excel (Brazil standard with UTF-8 BOM)
  const handleExportCSV = () => {
    if (submissions.length === 0) {
      alert('Nenhum registro para exportar.');
      return;
    }

    const headers = [
      'Data e Hora',
      'Nome Completo',
      'E-mail',
      'WhatsApp',
      'Perfil',
      'Objetivo Principal',
      'Renda (Nota)',
      'Estrutura (Nota)',
      'Seguranca (Nota)',
      'Patrimonio (Nota)',
      'Expansao (Nota)',
      'Lideranca (Nota)',
      'Media Geral',
      'Recomendacao',
      'CNPJ - Criterios Atendidos'
    ];

    const rows = submissions.map(sub => {
      const dateStr = new Date(sub.createdAt).toLocaleString('pt-BR');
      const isCnpj = sub.businessChoice === 'yes';
      const cnpjYesCount = isCnpj ? Object.values(sub.businessAns || {}).filter(v => v === 'Sim').length : 0;
      
      const r = sub.dimensionResults?.['renda']?.avg?.toFixed(1) || '-';
      const e = sub.dimensionResults?.['estrutura']?.avg?.toFixed(1) || '-';
      const s = sub.dimensionResults?.['seguranca']?.avg?.toFixed(1) || '-';
      const p = sub.dimensionResults?.['patrimonio']?.avg?.toFixed(1) || '-';
      const x = sub.dimensionResults?.['expansao']?.avg?.toFixed(1) || '-';
      const l = sub.dimensionResults?.['lideranca']?.avg?.toFixed(1) || '-';

      return [
        `"${dateStr}"`,
        `"${sub.lead?.name || ''}"`,
        `"${sub.lead?.email || ''}"`,
        `"${sub.lead?.phone || ''}"`,
        `"${isCnpj ? 'Empresario / CNPJ' : 'Pessoa Fisica'}"`,
        `"${sub.lead?.primaryGoal || ''}"`,
        `"${r}"`,
        `"${e}"`,
        `"${s}"`,
        `"${p}"`,
        `"${x}"`,
        `"${l}"`,
        `"${sub.overallAvg?.toFixed(1) || ''}"`,
        `"${sub.recommendation?.product || sub.recommendation?.title || ''}"`,
        `"${isCnpj ? `${cnpjYesCount}/6` : 'N/A'}"`
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_mapa_prosperidade_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered list
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      // Search term
      const term = searchTerm.toLowerCase();
      const matchSearch = 
        !term ||
        sub.lead?.name?.toLowerCase().includes(term) ||
        sub.lead?.email?.toLowerCase().includes(term) ||
        sub.lead?.phone?.includes(term);

      // Profile filter
      const matchProfile = 
        filterProfile === 'all' ||
        (filterProfile === 'cnpj' && sub.businessChoice === 'yes') ||
        (filterProfile === 'pf' && sub.businessChoice !== 'yes');

      // Stage filter
      const matchStage = 
        filterStage === 'all' ||
        Object.values(sub.dimensionResults || {}).some(d => d.stageName === filterStage);

      return matchSearch && matchProfile && matchStage;
    });
  }, [submissions, searchTerm, filterProfile, filterStage]);

  // Executive KPIs
  const stats = useMemo(() => {
    const total = submissions.length;
    const cnpjCount = submissions.filter(s => s.businessChoice === 'yes').length;
    const pfCount = total - cnpjCount;

    const overallAvgs = submissions.map(s => s.overallAvg || 2.5);
    const globalAvg = total > 0 ? (overallAvgs.reduce((a, b) => a + b, 0) / total).toFixed(1) : '0.0';

    return { total, cnpjCount, pfCount, globalAvg };
  }, [submissions]);

  // If not authenticated, show password screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF6EE] text-[#8C6934] border border-[#E9D7BC] mx-auto flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 text-[#C59B68]" />
          </div>
          <h2 className="text-2xl font-bold text-[#0E1B33]">Área da Gestora</h2>
          <p className="text-xs text-slate-500 mt-1">
            Painel Exclusivo de Controle e Respostas do Método MIL
          </p>
        </div>

        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
            {authError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0E1B33] uppercase tracking-wider mb-1.5">
              Senha de Acesso
            </label>
            <input 
              type="password"
              placeholder="Digite sua senha da gestora"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B68]"
              autoFocus
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              Acesso restrito à equipe Inspirar Finanças. Digite sua senha de gestora.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#0E1B33] hover:bg-[#182C50] text-white font-bold text-sm transition-all cursor-pointer shadow-md"
          >
            Entrar no Painel
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={onBackToApp}
            className="text-xs text-slate-600 hover:text-[#0E1B33] font-semibold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Diagnóstico Público
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-container" className="space-y-6">
      {/* Top Admin Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C6934] bg-[#FAF6EE] px-2.5 py-1 rounded-md border border-[#E9D7BC]">
              Inspirar Finanças — Painel da Gestora
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Online
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#0E1B33]">
            Gerenciador de Diagnósticos e Leads
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={fetchSubmissions}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            title="Atualizar lista"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#C59B68]' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-[#C59B68]" />
            Configurações
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] text-[#8C6934] border border-[#E9D7BC] text-xs font-bold hover:bg-[#F5EEDF] transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#C59B68]" />
            Exportar Excel (CSV)
          </button>

          <button
            type="button"
            onClick={onBackToApp}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0E1B33] hover:bg-[#182C50] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C59B68]" />
            Ver Diagnóstico
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
            title="Encerrar sessão de segurança"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </button>
        </div>
      </div>

      {/* Link de Compartilhamento & Acesso Exclusivo da Gestora */}
      <div className="bg-gradient-to-r from-[#FAF6EE] to-white p-4 rounded-2xl border border-[#E9D7BC] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-white border border-[#E9D7BC] text-[#C59B68] shrink-0 mt-0.5">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0E1B33] uppercase tracking-wider">
                Gestão de Links (Método 1 — Link Exclusivo)
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Envie o <strong>Link Público</strong> para seus clientes e use o <strong>Link Exclusivo</strong> para acessar este painel.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopyLink('public')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              {copiedLink === 'public' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copiar Link Público (Clientes)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleCopyLink('gestora')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0E1B33] hover:bg-[#182C50] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              {copiedLink === 'gestora' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#C59B68]" />
                  <span className="text-[#C59B68]">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#C59B68]" />
                  <span>Copiar Link Exclusivo (Gestora)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total de Leads</span>
            <Users className="w-4 h-4 text-[#C59B68]" />
          </div>
          <div className="text-3xl font-extrabold text-[#0E1B33]">{stats.total}</div>
          <p className="text-[11px] text-slate-500 mt-1">Diagnósticos preenchidos</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Empresários (PJ)</span>
            <Building2 className="w-4 h-4 text-[#C59B68]" />
          </div>
          <div className="text-3xl font-extrabold text-[#0E1B33]">
            {stats.cnpjCount}
            <span className="text-xs font-normal text-slate-500 ml-1.5">
              ({stats.total > 0 ? Math.round((stats.cnpjCount / stats.total) * 100) : 0}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Com módulo CPF ⇄ CNPJ</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pessoa Física</span>
            <UserCheck className="w-4 h-4 text-[#0E1B33]" />
          </div>
          <div className="text-3xl font-extrabold text-[#0E1B33]">
            {stats.pfCount}
            <span className="text-xs font-normal text-slate-500 ml-1.5">
              ({stats.total > 0 ? Math.round((stats.pfCount / stats.total) * 100) : 0}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Sem empresa vinculada</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Média de Índice</span>
            <Sparkles className="w-4 h-4 text-[#C59B68]" />
          </div>
          <div className="text-3xl font-extrabold text-[#0E1B33]">
            {stats.globalAvg} <span className="text-xs font-normal text-slate-400">/ 4.0</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Nível geral dos participantes</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input 
            type="text"
            placeholder="Buscar por nome, e-mail ou WhatsApp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#C59B68]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {/* Profile Filter */}
          <select
            value={filterProfile}
            onChange={(e) => setFilterProfile(e.target.value as any)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C59B68]"
          >
            <option value="all">Todos os Perfis (PF e PJ)</option>
            <option value="cnpj">Apenas Empresários (PJ)</option>
            <option value="pf">Apenas Pessoa Física</option>
          </select>

          {/* Stage Filter */}
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C59B68]"
          >
            <option value="all">Todos os Estágios</option>
            <option value="Sustentar">Possui dimensão em Sustentar</option>
            <option value="Organizar">Possui dimensão em Organizar</option>
            <option value="Construir">Possui dimensão em Construir</option>
            <option value="Expandir">Possui dimensão em Expandir</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Data / Hora</th>
                <th className="py-3.5 px-4">Lead</th>
                <th className="py-3.5 px-4">Perfil</th>
                <th className="py-3.5 px-4">Objetivo Principal</th>
                <th className="py-3.5 px-4">Média / Índice</th>
                <th className="py-3.5 px-4">Recomendação</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#C59B68]" />
                    Carregando diagnósticos...
                  </td>
                </tr>
              ) : filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Nenhum diagnóstico encontrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map(sub => {
                  const dateFormatted = new Date(sub.createdAt).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  const isCnpj = sub.businessChoice === 'yes';
                  const cleanPhone = (sub.lead?.phone || '').replace(/\D/g, '');
                  const waUrl = cleanPhone 
                    ? `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(`Olá, ${sub.lead.name}! Vi que você realizou o diagnóstico do Mapa da Prosperidade no Método MIL da Inspirar Finanças. Como posso te apoiar com o seu resultado?`)}`
                    : null;

                  return (
                    <tr key={sub.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {dateFormatted}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#0E1B33]">{sub.lead?.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" /> {sub.lead?.email}
                        </div>
                        {sub.lead?.phone && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" /> {sub.lead?.phone}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isCnpj ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FAF6EE] text-[#8C6934] border border-[#E9D7BC]">
                            <Building2 className="w-3 h-3" /> PJ / Autônomo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                            <UserCheck className="w-3 h-3" /> Pessoa Física
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 max-w-[200px] truncate" title={sub.lead?.primaryGoal}>
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3 text-[#C59B68] shrink-0" />
                          <span className="truncate">{sub.lead?.primaryGoal}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-[#0E1B33]">
                          {sub.overallAvg?.toFixed(1) || '2.5'} <span className="text-[10px] text-slate-400">/ 4.0</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-[#0E1B33]">
                        {sub.recommendation?.product || sub.recommendation?.title || '-'}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {waUrl && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-[#8C6934] hover:bg-[#FAF6EE] rounded-lg transition-colors"
                              title="Iniciar conversa no WhatsApp do cliente"
                            >
                              <Phone className="w-4 h-4 text-[#C59B68]" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedSubmission(sub)}
                            className="p-1.5 text-slate-600 hover:text-[#0E1B33] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Ver detalhes do diagnóstico"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(sub.id, sub.lead?.name || 'Cliente')}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Excluir registro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Complete Diagnosis Details */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6934] bg-[#FAF6EE] px-2 py-0.5 rounded border border-[#E9D7BC]">
                  Raio-X do Diagnóstico
                </span>
                <h3 className="text-xl font-bold text-[#0E1B33] mt-1">
                  {selectedSubmission.lead?.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Contact info card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">E-mail:</span>
                  <strong className="text-[#0E1B33]">{selectedSubmission.lead?.email}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">WhatsApp:</span>
                  <strong className="text-[#0E1B33]">{selectedSubmission.lead?.phone || 'Não informado'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Perfil:</span>
                  <strong className="text-[#0E1B33]">{selectedSubmission.businessChoice === 'yes' ? 'Empresário / PJ' : 'Pessoa Física'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Objetivo:</span>
                  <strong className="text-[#0E1B33]">{selectedSubmission.lead?.primaryGoal}</strong>
                </div>
              </div>

              {/* Dimension scores */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0E1B33] mb-3">
                  Notas das 6 Dimensões
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(selectedSubmission.dimensionResults || {}).map(([key, dim]) => (
                    <div key={key} className="p-3.5 rounded-xl border border-slate-200 bg-white">
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-xs text-[#0E1B33]">{dim.title}</strong>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FAF6EE] text-[#8C6934] border border-[#E9D7BC]">
                          {dim.stageName} ({dim.avg.toFixed(1)})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{dim.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business module answers if PJ */}
              {selectedSubmission.businessChoice === 'yes' && (
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EFE5D5]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C6934] mb-2 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#C59B68]" /> Módulo Empresarial (CPF ⇄ CNPJ)
                  </h4>
                  <p className="text-xs text-slate-700 mb-3">
                    Respostas do teste de viabilidade entre a empresa e as finanças da casa:
                  </p>
                  <div className="space-y-1.5 text-xs">
                    {Object.entries(selectedSubmission.businessAns || {}).map(([idx, val]) => (
                      <div key={idx} className="flex justify-between items-center py-1 border-b border-[#EFE5D5] last:border-0">
                        <span className="text-slate-600">Critério {Number(idx) + 1}</span>
                        <span className={`font-bold px-2 py-0.5 rounded ${val === 'Sim' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Questionnaire Answers */}
              {selectedSubmission.answers && Object.keys(selectedSubmission.answers).length > 0 && (
                <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setShowDetailedAnswers(!showDetailedAnswers)}
                    className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left cursor-pointer"
                  >
                    <span className="text-xs font-bold text-[#0E1B33] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#C59B68]" />
                      Respostas das 12 Perguntas do Método MIL
                    </span>
                    <span className="text-xs text-[#8C6934] font-semibold flex items-center gap-1">
                      {showDetailedAnswers ? 'Recolher' : 'Ver todas as respostas'}
                      {showDetailedAnswers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {showDetailedAnswers && (
                    <div className="p-4 space-y-4 max-h-72 overflow-y-auto border-t border-slate-200">
                      {DIMENSIONS.map((dim) => (
                        <div key={dim.id} className="space-y-2">
                          <h5 className="text-[11px] font-black uppercase tracking-wider text-[#8C6934] border-b border-slate-100 pb-1">
                            {dim.title}
                          </h5>
                          {dim.questions.map((q) => {
                            const ansIdx = selectedSubmission.answers?.[q.id];
                            const chosenOpt = ansIdx !== undefined ? q.options[ansIdx] : null;
                            return (
                              <div key={q.id} className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EFE5D5] text-xs">
                                <p className="font-semibold text-slate-800 text-[11px] mb-1">{q.title}</p>
                                <p className="text-[#8C6934] font-medium flex items-center gap-1.5 text-[11px]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#C59B68]" />
                                  {chosenOpt ? `${chosenOpt.label} (${chosenOpt.score} pts)` : 'Não respondida'}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Recommendation card */}
              <div className="p-4 rounded-xl bg-[#0E1B33] text-white">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#C59B68] mb-1">
                  Recomendação do Método MIL
                </div>
                <div className="text-base font-bold text-white mb-1">
                  {selectedSubmission.recommendation?.title} ({selectedSubmission.recommendation?.product})
                </div>
                <p className="text-xs text-slate-300">
                  {selectedSubmission.recommendation?.desc}
                </p>
              </div>

              {/* Actions inside modal */}
              <div className="flex justify-end gap-2 pt-2">
                {selectedSubmission.lead?.phone && (
                  <a
                    href={`https://wa.me/55${selectedSubmission.lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá, ${selectedSubmission.lead.name}! Sou da Inspirar Finanças. Analisei seu Mapa da Prosperidade e gostaria de falar sobre seu objetivo de ${selectedSubmission.lead.primaryGoal}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C59B68] hover:bg-[#D4AF7A] text-[#0E1B33] font-bold text-xs"
                  >
                    <Phone className="w-3.5 h-3.5" /> Chamar no WhatsApp
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Settings */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-[#0E1B33] flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#C59B68]" /> Configurações do App
              </h3>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccessMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {saveSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0E1B33] uppercase tracking-wider mb-1">
                  WhatsApp Oficial da Inspirar Finanças
                </label>
                <input 
                  type="text"
                  placeholder="Ex: 5571999999999"
                  value={whatsappConfig}
                  onChange={(e) => setWhatsappConfig(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#C59B68]"
                />
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Para onde o cliente é direcionado quando clica no botão <em>"Quero conversar sobre meu resultado no WhatsApp"</em>. Digite com DDI (55) e DDD.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-[#0E1B33] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#C59B68]" />
                  Alterar Senha da Gestora (Opcional)
                </label>
                <input 
                  type="password"
                  placeholder="Deixe em branco para manter a atual"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#C59B68]"
                />
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Defina uma nova senha segura para o acesso ao painel (mínimo de 4 caracteres).
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0E1B33] hover:bg-[#182C50] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
