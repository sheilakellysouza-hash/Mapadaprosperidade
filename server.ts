import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

const DATA_DIR = path.join(process.cwd(), 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating data directory:', err);
  }
}

// Initial settings helper
function getSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading settings:', err);
  }
  return {
    whatsappNumber: '5571999999999',
    adminPassword: 'skls2026'
  };
}

function saveSettings(data: any) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving settings:', err);
  }
}

// Helper to get submissions
function getSubmissions(): any[] {
  try {
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const content = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading submissions:', err);
  }
  return [];
}

// Helper to save submissions
function saveSubmissions(list: any[]) {
  try {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving submissions:', err);
  }
}

// In-memory active authenticated tokens
const activeAdminTokens = new Set<string>();

// Rate limiting for login attempts: ip -> { attempts, blockedUntil }
const loginAttempts = new Map<string, { attempts: number; blockedUntil: number }>();

// Authentication Middleware to strictly protect gestora data
function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso restrito. Token de autenticação da gestora não fornecido.' });
  }

  const token = authHeader.substring(7);
  if (!activeAdminTokens.has(token)) {
    return res.status(401).json({ error: 'Sessão expirada ou não autorizada. Faça login novamente.' });
  }

  next();
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET Settings (Public endpoint returns ONLY public WhatsApp number for contact, nothing sensitive)
app.get('/api/settings', (req, res) => {
  const settings = getSettings();
  res.json({
    whatsappNumber: settings.whatsappNumber || '5571999999999'
  });
});

// POST Settings (Protected by Admin Token)
app.post('/api/settings', requireAdminAuth, (req, res) => {
  const { whatsappNumber, adminPassword } = req.body;
  const current = getSettings();
  
  if (whatsappNumber) {
    current.whatsappNumber = whatsappNumber.replace(/\D/g, '');
  }
  if (adminPassword && adminPassword.trim().length >= 4) {
    current.adminPassword = adminPassword.trim();
  }
  
  saveSettings(current);
  res.json({ success: true, settings: { whatsappNumber: current.whatsappNumber } });
});

// GET Submissions (Protected strictly by Admin Token)
app.get('/api/submissions', requireAdminAuth, (req, res) => {
  const list = getSubmissions();
  res.json(list);
});

// POST New Submission (Publicly accessible so respondents can submit their quiz)
app.post('/api/submissions', (req, res) => {
  const submission = req.body;
  if (!submission || !submission.lead) {
    return res.status(400).json({ error: 'Dados do diagnóstico incompletos' });
  }

  const list = getSubmissions();
  const newRecord = {
    id: submission.id || `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: submission.createdAt || new Date().toISOString(),
    ...submission
  };

  // Prepend so newest appears first
  list.unshift(newRecord);
  saveSubmissions(list);

  // Return minimal safe confirmation without exposing the database
  res.json({ success: true, id: newRecord.id });
});

// DELETE Submission (Protected by Admin Token)
app.delete('/api/submissions/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const list = getSubmissions();
  const filtered = list.filter(item => item.id !== id);
  saveSubmissions(filtered);
  res.json({ success: true, remaining: filtered.length });
});

// Verify Admin Password with Brute-Force Rate Limiting & Secure Token Generation
app.post('/api/admin/verify', (req, res) => {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || 'local';
  const now = Date.now();
  const attemptInfo = loginAttempts.get(ip) || { attempts: 0, blockedUntil: 0 };

  // Check if IP is currently blocked (auto unblock after 60 seconds)
  if (attemptInfo.blockedUntil > now) {
    const remainingSeconds = Math.ceil((attemptInfo.blockedUntil - now) / 1000);
    return res.status(429).json({ 
      error: `Muitas tentativas incorretas. Por segurança, tente novamente em ${remainingSeconds} segundos.` 
    });
  }

  const rawPassword = (req.body?.password || '').toString();
  const cleanPassword = rawPassword.trim();
  const settings = getSettings();
  const configuredPassword = (settings.adminPassword || 'skls2026').toString().trim();

  // Validate against configured password (trimmed and case-insensitive for convenience)
  const valid = 
    cleanPassword === configuredPassword ||
    cleanPassword.toLowerCase() === configuredPassword.toLowerCase();

  if (valid) {
    loginAttempts.delete(ip);
    // Generate secure session token
    const token = `adm_${Date.now()}_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    activeAdminTokens.add(token);
    res.json({ success: true, token });
  } else {
    attemptInfo.attempts += 1;
    if (attemptInfo.attempts >= 8) {
      attemptInfo.blockedUntil = now + 60 * 1000; // 1 minute lockout
    }
    loginAttempts.set(ip, attemptInfo);
    
    if (attemptInfo.attempts >= 8) {
      return res.status(429).json({ error: 'Limite de tentativas excedido. Bloqueado temporariamente por 1 minuto.' });
    }
    res.status(401).json({ 
      error: `Senha incorreta. Verifique os dados digitados e tente novamente. (Tentativa ${attemptInfo.attempts} de 8)` 
    });
  }
});

// Admin Logout
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    activeAdminTokens.delete(token);
  }
  res.json({ success: true });
});

// Seed mock/demo lead if empty so the gestora can immediately see how it looks
const existingSubmissions = getSubmissions();
if (existingSubmissions.length === 0) {
  const sampleLead = {
    id: `sub_demo_${Date.now()}`,
    createdAt: new Date().toISOString(),
    lead: {
      name: 'Dra. Camila Vasconcelos',
      email: 'camila.vasconcelos@exemplo.com.br',
      phone: '(71) 99876-5432',
      primaryGoal: 'Construir patrimônio sólido'
    },
    answers: {
      'r1': 1, 'r2': 2,
      'e1': 1, 'e2': 2,
      's1': 2, 's2': 1,
      'p1': 2, 'p2': 1,
      'x1': 1, 'x2': 2,
      'l1': 2, 'l2': 2
    },
    businessChoice: 'yes',
    businessAns: {
      0: 'Sim', 1: 'Sim', 2: 'Não', 3: 'Sim', 4: 'Não', 5: 'Sim'
    },
    dimensionResults: {
      renda: { title: 'Renda & Geração', subtitle: 'Capacidade de produção', avg: 2.5, stageNum: 3, stageName: 'Construir', description: 'Geração consistente com oportunidade de escala.' },
      estrutura: { title: 'Estrutura de Vida', subtitle: 'Padrão de vida x renda', avg: 2.0, stageNum: 2, stageName: 'Organizar', description: 'Falta estruturação no direcionamento dos gastos.' },
      seguranca: { title: 'Segurança & Reserva', subtitle: 'Blindagem contra imprevistos', avg: 2.5, stageNum: 3, stageName: 'Construir', description: 'Reserva básica formada.' },
      patrimonio: { title: 'Patrimônio Líquido', subtitle: 'Ativos reais gerando valor', avg: 2.0, stageNum: 2, stageName: 'Organizar', description: 'Início da formação patrimonial.' },
      expansao: { title: 'Expansão & Escala', subtitle: 'Múltiplas fontes e alavancagem', avg: 2.5, stageNum: 3, stageName: 'Construir', description: 'Buscando novos canais de crescimento.' },
      lideranca: { title: 'Decisão & Liderança', subtitle: 'Governança e clareza', avg: 3.0, stageNum: 3, stageName: 'Construir', description: 'Boa governança sobre decisões financeiras.' }
    },
    recommendation: {
      title: 'Jornada com Módulo de Viabilidade CPF ⇄ CNPJ',
      desc: 'Seu negócio e suas finanças pessoais estão misturados ou estrangulando o caixa pessoal.',
      product: 'Jornada Prosperidade MIL + CPF/CNPJ'
    },
    overallAvg: 2.4
  };
  saveSubmissions([sampleLead]);
}

// Vite middleware / production serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
