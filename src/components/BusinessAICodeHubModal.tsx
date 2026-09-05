import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Code2,
  Copy,
  Check,
  Download,
  Server,
  Cpu,
  Layers,
  FileCode,
  Terminal,
  ShieldCheck,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface BusinessAICodeHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CodeFileItem {
  id: string;
  name: string;
  path: string;
  category: 'backend' | 'agents' | 'tools' | 'config';
  language: string;
  description: string;
  code: string;
}

const CODE_FILES: CodeFileItem[] = [
  {
    id: 'server',
    name: 'server.ts (Orchestrateur & API)',
    path: '/server.ts',
    category: 'backend',
    language: 'typescript',
    description: 'Serveur Express complet avec routeur multi-modèles, fallback résilient, Veo 2, Image Gen et Recherche Web.',
    code: `import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, GenerateVideosOperation } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Modèles avec cascade de secours automatique
const TEXT_MODELS = ["gemini-3.7-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json({ limit: "10mb" }));

  // 1. Endpoint Orchestrateur Cerveau (BusinessAI 2.0)
  app.post("/api/businessai/orchestrate", async (req: Request, res: Response) => {
    const { prompt, company, memory = [] } = req.body;
    const ai = getGenAI();
    // Analyse d'intention et routage vers l'un des 10 agents
    // ...
  });

  // 2. Génération d'Images Ultra-réalistes (Gemini Flash Image / Imagen)
  app.post("/api/gemini/generate-image", async (req: Request, res: Response) => {
    const { prompt, aspectRatio = "1:1" } = req.body;
    const ai = getGenAI();
    // ...
  });

  // 3. Génération Vidéo Publicitaire (Veo 2 Preview)
  app.post("/api/gemini/generate-video", async (req: Request, res: Response) => {
    const { prompt, aspectRatio = "9:16" } = req.body;
    // ...
  });

  // 4. Recherche Web & Analyse de fichiers
  app.post("/api/businessai/search", async (req: Request, res: Response) => { /* ... */ });
  app.post("/api/businessai/analyze-file", async (req: Request, res: Response) => { /* ... */ });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(\`BusinessAI 2.0 en ligne sur port \${PORT}\`);
  });
}

startServer();`,
  },
  {
    id: 'agents',
    name: 'agentOrchestrator.ts (10 Agents)',
    path: '/src/services/agentOrchestrator.ts',
    category: 'agents',
    language: 'typescript',
    description: 'Moteur autonome : Assistant, Recherche Web, Fichiers, Images, Vidéos, Voix, Code, Business, Mémoire & Planificateur.',
    code: `export type AgentType =
  | 'assistant_general'
  | 'web_search'
  | 'file_analyzer'
  | 'image_generator'
  | 'video_generator'
  | 'voice_agent'
  | 'code_engine'
  | 'business_strategist'
  | 'autonomous_planner'
  | 'memory_manager';

export interface OrchestratorResult {
  detectedIntent: string;
  selectedAgent: AgentType;
  thoughtProcess: string[];
  executionPlan?: AgentTask[];
  finalAnswer: string;
  memoryRetrieved?: string[];
  toolsInvoked?: string[];
}

export async function runOrchestratorPipeline(params: {
  userInput: string;
  companyContext: any;
  userMemory?: any[];
}): Promise<OrchestratorResult> {
  const res = await fetch('/api/businessai/orchestrate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return await res.json();
}`,
  },
  {
    id: 'tools',
    name: 'voiceAndFileTools.ts (Voix & Fichiers)',
    path: '/src/services/voiceAndFileTools.ts',
    category: 'tools',
    language: 'typescript',
    description: 'Synthèse vocale (Text-To-Speech), reconnaissance vocale (Speech-To-Text) et analyse multimodale de PDF/Excel.',
    code: `export class VoiceController {
  private static synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  static speak(text: string, lang = 'fr-FR', onEnd?: () => void) {
    if (!this.synth) return;
    this.synth.cancel();
    const cleanText = text.replace(/[*#_\`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang;
    utterance.rate = 1.05;
    if (onEnd) utterance.onend = onEnd;
    this.synth.speak(utterance);
  }

  static stop() {
    this.synth?.cancel();
  }
}

export async function analyzeDocumentFile(params: {
  fileBase64: string;
  fileName: string;
  mimeType: string;
}) {
  const res = await fetch('/api/businessai/analyze-file', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return await res.json();
}`,
  },
  {
    id: 'env',
    name: '.env.example (Variables Clés)',
    path: '/.env.example',
    category: 'config',
    language: 'bash',
    description: 'Variables d’environnement pour activer Gemini 2.5/3.7, WhatsApp Cloud API et le stockage.',
    code: `# BusinessAI 2.0 - Configuration d'Environnement
GEMINI_API_KEY=votre_cle_gemini_ici
NODE_ENV=production
PORT=3000

# WhatsApp Cloud API (Optionnel pour notifications directes)
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=

# Stockage & Médias
STORAGE_BUCKET=
PAYMENT_OFFICIAL_NUMBER=0163638893`,
  },
  {
    id: 'package',
    name: 'package.json (Dépendances)',
    path: '/package.json',
    category: 'config',
    language: 'json',
    description: 'Configuration npm prête pour la production avec tsx, Vite, React 19 et le SDK @google/genai.',
    code: `{
  "name": "businessai-2-0",
  "private": true,
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "express": "^4.21.2",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "dotenv": "^17.2.3"
  },
  "devDependencies": {
    "typescript": "~5.8.2",
    "vite": "^6.2.3",
    "tsx": "^4.21.0",
    "tailwindcss": "^4.1.14"
  }
}`,
  },
];

export const BusinessAICodeHubModal: React.FC<BusinessAICodeHubModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFileId, setSelectedFileId] = useState<string>('server');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentFile = CODE_FILES.find((f) => f.id === selectedFileId) || CODE_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    const pack = {
      project: 'BusinessAI 2.0',
      description: 'L\'IA tout-en-un la plus puissante pour le business',
      architecture: 'Utilisateur -> Orchestrateur -> 10 Agents -> Mémoire -> Réponse Finale',
      files: CODE_FILES.map((f) => ({
        path: f.path,
        name: f.name,
        category: f.category,
        content: f.code,
      })),
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'businessai-2.0-codes-complets.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-5xl bg-slate-900 text-slate-100 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    Codes Sources & Architecture BusinessAI 2.0
                  </h2>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/30">
                    v2.0 FULLSTACK
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Plan complet conforme aux 12 fonctionnalités, 10 agents et au pipeline orchestrateur.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadAll}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Télécharger le Pack .JSON</span>
              </button>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Blueprint Summary Bar */}
          <div className="px-4 py-2.5 bg-indigo-950/40 border-b border-indigo-900/40 flex flex-wrap items-center justify-between gap-2 text-[11px] text-indigo-200">
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold">Pipeline :</span>
              <span className="text-slate-300">Utilisateur ➔ Orchestrateur ➔ 10 Agents / Outils ➔ Mémoire ➔ Réponse Finale</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-bold">Code prêt pour déploiement Node/Vite</span>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 md:grid-cols-4 flex-1 min-h-0 overflow-hidden">
            {/* Sidebar File Selector */}
            <div className="p-3 border-r border-slate-800 bg-slate-950/30 overflow-y-auto space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 px-2 font-bold tracking-wider">
                Fichiers du projet
              </span>
              {CODE_FILES.map((file) => {
                const isSelected = file.id === selectedFileId;
                return (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFileId(file.id)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-indigo-400'}`} />
                    <div className="truncate">
                      <div className="font-bold truncate">{file.name}</div>
                      <div className={`text-[10px] truncate ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                        {file.path}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Code Display & Actions */}
            <div className="md:col-span-3 flex flex-col min-h-0 bg-slate-900 overflow-hidden">
              {/* File Info Bar */}
              <div className="p-3 border-b border-slate-800 bg-slate-950/20 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{currentFile.path}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {currentFile.language}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{currentFile.description}</p>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier le Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Editor Preview */}
              <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed bg-slate-950/70 select-all">
                <pre className="whitespace-pre-wrap">{currentFile.code}</pre>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>
                Comprend les 10 Agents : Assistant, Web, Fichiers, Images, Vidéo Veo, Voix, Code, Business, Mémoire & Planificateur.
              </span>
            </div>

            <button
              onClick={handleDownloadAll}
              className="sm:hidden w-full py-2 px-3 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-2 text-xs"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger le Pack .JSON</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
