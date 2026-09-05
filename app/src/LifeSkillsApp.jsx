import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3'; // Richiede: npm install d3
import { 
  Heart, Brain, Thermometer, ArrowLeft, History, Settings, 
  Plus, Trash2, RotateCcw, X, List, Upload, Download, Check, 
  Clock, ChevronRight, BookOpen, HeartHandshake, ZoomIn, ZoomOut, 
  Search, MapPin, Eye, EyeOff, RefreshCw, Save, Cloud, Loader2, 
  AlertTriangle, ChevronDown, ChevronUp, MessageSquare, QrCode, Lock, Unlock, LogIn,
  FolderOpen, Edit, FileJson, BarChart2, Type, Smartphone, Share2, Ban, CheckSquare,
  Maximize, Minimize, CheckCircle, XCircle, Minus, MessageCircle, Laptop, Copy, Sparkles
} from 'lucide-react';

import { initialScenarios } from './scenarios_data';
import { generateTinyUrl, getStudentBaseUrl } from './lib/shortUrl';

// --- FIREBASE IMPORTS ---
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, doc, setDoc, onSnapshot, collection, getDoc, updateDoc, arrayUnion, arrayRemove 
} from 'firebase/firestore';
import {
  getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken
} from 'firebase/auth';

// --- MODULI APPLICATIVI ---
import { getFBConfig, getAppId } from './lib/firebaseConfig';
import { EMOTION_THERMOMETER_DEFAULT } from './data/thermometerData';
import FullscreenButton from './components/FullscreenButton';
import EmotionWheelModal from './components/EmotionWheelModal';
import ScenarioManager from './components/ScenarioManager';
import EmotionThermometer from './components/EmotionThermometer';
import P2PModal from './components/P2PModal';
import SettingsModal from './components/SettingsModal';
import TeacherPinModal from './components/TeacherPinModal';
import GuideModal from './components/GuideModal';
import VisualMetaphorsView from './components/VisualMetaphorsView';
import { DEFAULT_VISUAL_METAPHORS_STATE } from './data/visualMetaphorsData';
import {
  loadAllCustomImages,
  hydrateVisualMetaphors,
  sanitizeDataForFirestore
} from './lib/customImageStorage';
import {
  isPinProtectionEnabled,
  isTeacherAuthenticated,
  logoutTeacher
} from './lib/security';
import {
  encodeFBConfig,
  decodeFBConfig,
  saveFBConfig,
  isFirebaseConfigured
} from './lib/firebaseConfig';
import { exportSessionXLSX, exportSessionImage, exportWordcloudSVG, exportQASVG, exportPollSVG } from './lib/exporters';
import { 
  ensureCategorySets, 
  getActiveItemsForCategory, 
  setActiveCategorySet, 
  getAllItemsForCategory,
  CATEGORIES 
} from './lib/sets';

// =================================================================================
// 1. CONFIGURAZIONE & DATI
// =================================================================================
// La configurazione può essere sovrascritta dalle impostazioni, così ogni
// scuola può puntare al proprio progetto Firebase senza ricompilare.
const FIREBASE_CONFIG = getFBConfig();

let db = null;
let auth = null;
// Namespace delle collection: dipende dal nome utente, e può essere
// sovrascritto dal parametro ?ns= per condividere una sessione via link.
let APP_ID = getAppId();

try {
  if (FIREBASE_CONFIG && FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey.trim()) {
    const app = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("🔥 Firebase connesso.");
  } else {
    console.log("ℹ️ Firebase non configurato: operatività in modalità locale.");
  }
} catch (e) {
  console.error("Errore inizializzazione Firebase:", e);
}

const INITIAL_DB_DATA = {
  emotions: [
    { id: 1, text: "Il professore consegna le verifiche. Tu hai studiato ogni pomeriggio, prendi 5. Il compagno accanto, che ha copiato, prende 8.", tags: ["scuola"] },
    { id: 2, text: "Vedi una foto su Instagram di tutti i tuoi amici a cena fuori. Nessuno ti ha invitato.", tags: ["esclusione"] },
    { id: 3, text: "Torni a casa e trovi tua madre che piange in cucina. Appena ti vede, smette e finge nulla.", tags: ["famiglia"] },
    { id: 4, text: "Passa la persona che ti piace, ti guarda un secondo e poi distoglie lo sguardo parlando con altri.", tags: ["relazioni"] },
    { id: 5, text: "Un amico fa una battuta pesante su di te davanti agli altri. Tutti ridono, lui incluso.", tags: ["amicizia"] }
  ],
  decisions_cold: [
    { id: 1, text: "Devi scegliere le superiori: i tuoi vogliono il Classico, tu l'Artistico. La tua famiglia ha problemi economici e l'Artistico costa molto.", tags: ["futuro"] }
  ],
  decisions_hot: [
    { id: 1, text: "Sei in auto. Chi guida ha bevuto e corre troppo. C'è una curva avanti.", tags: ["pericolo"] }
  ],
  emotion_narratives: [
    { id: 1, text: "Vulnerabile", tags: [] }, { id: 2, text: "Disperato", tags: [] }, { id: 3, text: "Colpevole", tags: [] }, { id: 4, text: "Depresso", tags: [] }
  ],
  affectivity_sexuality: [
    { id: 1, text: "Siete in intimità. Il partner prova a fare qualcosa di nuovo senza chiedertelo.", tags: ["consenso"] }
  ],
  effective_communication: initialScenarios.effective_communication || [],
  feedback_sets: [
    {
      id: "default_1",
      title: "Riflessione Emotiva Base",
      questions: [
        { id: 1, text: "Come ti senti in questo momento?", imgUrl: "" },
        { id: 2, text: "Qual è la tua opinione su quanto abbiamo visto?", imgUrl: "" }
      ]
    }
  ],
  poll_sets: [
    {
      id: "poll_1",
      title: "Gradimento Attività",
      question: "Quanto ti è piaciuta questa attività?",
      options: ["Moltissimo", "Abbastanza", "Poco", "Per nulla"],
      allowMultiple: false
    }
  ],
  emotion_thermometer: EMOTION_THERMOMETER_DEFAULT,
  visual_metaphors: DEFAULT_VISUAL_METAPHORS_STATE,
  scenario_sets: {},
  teacher_pin_hash: null
};

// =================================================================================
// 2. COMPONENTI UI BASE & HELPER
// =================================================================================

const PlayIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>;

const Card = ({ title, icon: Icon, color, onClick, description, subtitle }) => {
  const titleSize = title.length > 20 ? 'text-xl' : 'text-2xl';
  return (
    <button onClick={onClick} className={`w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-left border-4 border-black flex flex-col justify-between h-64 ${color}`}>
      <div>
        <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center border-4 border-black mb-4"><Icon size={28} className="text-black" /></div>
        <h3 className={`${titleSize} font-black text-black uppercase leading-tight mb-2 break-words`}>{title}</h3>
        <span className="inline-block px-2 py-1 bg-black text-white text-xs font-bold uppercase rounded-md">{subtitle}</span>
      </div>
      <p className="text-sm font-bold text-black/70 mt-2">{description}</p>
    </button>
  );
};

// =================================================================================
// 3. HELPER COMPONENTS (Grafici, WordCloud, Modali)
// =================================================================================

const PollChart = ({ responses, options, onManualVote }) => {
    const counts = {};
    const safeOptions = Array.isArray(options) ? options : [];
    safeOptions.forEach(opt => counts[opt] = 0);
    let total = 0;
    
    if (Array.isArray(responses)) {
        responses.forEach(r => {
            if (r.status === 'visible' || r.visible === true || (r.visible !== false && !r.status)) {
                 const answers = Array.isArray(r.text) ? r.text : [r.text];
                 answers.forEach(ans => {
                     if (counts[ans] !== undefined) counts[ans]++;
                     total++;
                 });
            }
        });
    }

    const maxCount = Math.max(...Object.values(counts), 0);
    // Palette neo-brutalista ad alto contrasto per le opzioni
    const OPTION_BAR_COLORS = [
        'bg-emerald-400',
        'bg-cyan-400',
        'bg-amber-300',
        'bg-purple-300',
        'bg-rose-300',
        'bg-indigo-300',
    ];

    return (
        <div className="w-full h-full flex flex-col justify-center gap-4 p-4 sm:p-6 max-w-3xl mx-auto">
            {safeOptions.map((opt, idx) => {
                const count = counts[opt] || 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                const isLeader = maxCount > 0 && count === maxCount;
                const barColor = OPTION_BAR_COLORS[idx % OPTION_BAR_COLORS.length];

                return (
                    <div key={idx} className="w-full bg-white p-4 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5">
                        <div className="flex flex-wrap justify-between items-center mb-2.5 gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <span className="w-7 h-7 rounded-xl bg-black text-white font-black text-xs flex items-center justify-center shrink-0">
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="font-black text-black text-base md:text-lg truncate">{opt}</span>
                                {isLeader && count > 0 && (
                                    <span className="bg-yellow-300 text-black border border-black px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 shadow-xs">
                                        👑 In testa
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Voti e percentuale */}
                                <div className="flex items-baseline gap-1.5 font-mono">
                                    <span className="text-xl font-black text-black">{pct}%</span>
                                    <span className="text-xs font-bold text-gray-500">({count} {count === 1 ? 'voto' : 'voti'})</span>
                                </div>

                                {/* Controlli manuali per il docente (es. alzata di mano) */}
                                {onManualVote && (
                                    <div className="flex items-center gap-1 border-2 border-black rounded-xl p-0.5 bg-gray-50 shadow-xs">
                                        <button 
                                            type="button"
                                            onClick={() => onManualVote(opt, -1)} 
                                            disabled={count === 0}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-rose-700 hover:bg-rose-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors" 
                                            title="Rimuovi 1 voto (-)"
                                        >
                                            <Minus size={14} className="stroke-[3]" />
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => onManualVote(opt, 1)} 
                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors" 
                                            title="Aggiungi 1 voto manuale per alzata di mano (+)"
                                        >
                                            <Plus size={14} className="stroke-[3]" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Barra di avanzamento neo-brutalista con bordo nero */}
                        <div className="w-full bg-gray-100 rounded-xl h-6 border-2 border-black overflow-hidden relative">
                            <div 
                                className={`${barColor} h-full transition-all duration-700 ease-out`} 
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>
                );
            })}

            {/* Riepilogo totale */}
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-black bg-white px-5 py-2.5 rounded-xl border-2 border-black max-w-sm mx-auto shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span>Voti totali registrati:</span>
                <span className="bg-black text-yellow-400 px-2.5 py-0.5 rounded-md font-mono text-sm">{total}</span>
            </div>
        </div>
    );
};

const ManualQAModal = ({ isOpen, onClose, onSubmit, questions }) => {
    const [answers, setAnswers] = useState({});
    const [singleText, setSingleText] = useState("");
    const [authorName, setAuthorName] = useState("");

    // Supporto per tasti Escape e Ctrl+Enter
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, answers, singleText, authorName, questions]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        const cleanAuthor = authorName && authorName.trim().length > 0 ? authorName.trim() : null;

        if (questions && questions.length > 0) {
            // Formato domande multiple
            const payload = questions.map(q => {
                const ans = answers[q.id];
                if (!ans || !ans.trim()) return null;
                return `${q.text.toUpperCase()}:\n${ans.trim()}`;
            }).filter(Boolean);
            if (payload.length > 0) {
                onSubmit(payload, cleanAuthor);
            } else {
                return;
            }
        } else {
            // Formato testo libero
            if (!singleText || !singleText.trim()) return;
            onSubmit(singleText.trim(), cleanAuthor);
        }

        setAnswers({});
        setSingleText("");
        setAuthorName("");
        onClose();
    };

    const hasValidContent = questions && questions.length > 0
        ? Object.values(answers).some(a => a && a.trim().length > 0)
        : singleText.trim().length > 0;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 w-full max-w-2xl border-4 border-black max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 border-b-2 border-black/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-yellow-300 border-2 border-black flex items-center justify-center shadow-xs">
                            <Edit size={20} className="text-black"/>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-black leading-tight">Risposta Manuale</h3>
                            <p className="text-xs font-bold text-gray-500">Annota una risposta raccolta a voce o su foglietto</p>
                        </div>
                    </div>
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="p-2.5 bg-black text-white rounded-xl hover:bg-yellow-300 hover:text-black border-2 border-black transition-colors"
                        title="Chiudi (Esc)"
                    >
                        <X size={18} className="stroke-[3]"/>
                    </button>
                </div>

                <div className="space-y-5">
                    {/* CAMPO NOME STUDENTE (OPZIONALE) */}
                    <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-300 shadow-xs">
                        <div className="flex items-center justify-between mb-1.5">
                            <label htmlFor="manual-author-input" className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                                <span>👤</span> Nome Alunno / Autore
                            </label>
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-200 text-amber-950 border border-amber-300">
                                Opzionale
                            </span>
                        </div>
                        <input 
                            id="manual-author-input"
                            type="text"
                            className="w-full px-3.5 py-2.5 bg-white border-2 border-black rounded-xl font-bold text-black outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-gray-400 placeholder:font-normal text-sm"
                            placeholder="Es. Marco, Sara, Gruppo 2 (lascia vuoto per anonimo)"
                            value={authorName}
                            onChange={e => setAuthorName(e.target.value)}
                        />
                        <p className="text-[11px] text-amber-900 mt-1.5 font-bold leading-tight">
                            Puoi lasciarlo vuoto per una risposta anonima. Quando attivi "Aula Anonima" sulla lavagna il nome viene comunque mascherato alla classe per privacy.
                        </p>
                    </div>

                    {/* CONTENUTO RISPOSTA */}
                    {questions && questions.length > 0 ? (
                        <div className="space-y-4">
                            <span className="text-xs font-black uppercase tracking-wider text-gray-700 block">
                                Risposte alle domande del set:
                            </span>
                            {questions.map((q, idx) => (
                                <div key={q.id} className="bg-gray-50 p-3.5 rounded-2xl border-2 border-black/15">
                                    <label className="block font-black text-black mb-2 text-xs uppercase tracking-wide">
                                        #{idx+1} {q.text}
                                    </label>
                                    <textarea 
                                        className="w-full p-3 bg-white border-2 border-black rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none min-h-[80px] font-medium text-black text-sm"
                                        placeholder="Scrivi la risposta data dall'alunno..."
                                        value={answers[q.id] || ""}
                                        onChange={e => setAnswers({...answers, [q.id]: e.target.value})}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <label className="block font-black text-black mb-2 text-xs uppercase tracking-wider">
                                Pensiero o Risposta dell'alunno
                            </label>
                            <textarea 
                                autoFocus
                                className="w-full p-3.5 bg-white border-2 border-black rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none min-h-[140px] font-medium text-black text-sm"
                                placeholder="Scrivi qui la risposta ascoltata in classe..."
                                value={singleText}
                                onChange={e => setSingleText(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                <div className="mt-7 pt-4 border-t-2 border-black/10 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[11px] font-bold text-gray-600 hidden sm:inline-block">
                        Scorciatoia: <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded font-mono text-black">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded font-mono text-black">Invio</kbd> per salvare subito
                    </span>
                    <div className="flex items-center gap-2.5 ml-auto">
                        <button 
                            type="button"
                            onClick={onClose} 
                            className="px-5 py-2.5 rounded-xl font-black text-xs text-gray-700 hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all"
                        >
                            Annulla
                        </button>
                        <button 
                            type="button"
                            onClick={handleSubmit} 
                            disabled={!hasValidContent}
                            className="px-6 py-2.5 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            <Plus size={16} className="stroke-[3]" />
                            <span>Aggiungi alla lavagna</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FloatingWordCloud = ({ responses, onManualAdd }) => {
    const containerRef = useRef(null);
    const [nodes, setNodes] = useState([]);
    const nodesRef = useRef([]); 
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [wordInput, setWordInput] = useState("");

    useEffect(() => {
        if (!responses) return;
        
        const f = {};
        responses.forEach(r => {
            if (r.status === 'visible' || r.visible === true || (r.visible !== false && !r.status)) {
                const wordText = Array.isArray(r.text) ? r.text.join(" ") : r.text;
                const concept = wordText ? String(wordText).trim() : ""; 
                if (concept) {
                    const key = concept.toLowerCase();
                    if (!f[key]) f[key] = { text: concept, count: 0 };
                    f[key].count += 1;
                }
            }
        });

        const sortedData = Object.values(f).sort((a, b) => b.count - a.count);

        const newNodes = sortedData.map((item, i) => {
            const existing = nodesRef.current.find(n => n.id === item.text);
            
            // --- MODIFICA DIMENSIONI ---
            const size = Math.min(1.2 + (item.count * 0.8), 6);
            
            // --- CALCOLO RAGGIO COLLISIONE ---
            const charWidth = size * 16 * 0.6; 
            const pixelWidth = item.text.length * charWidth;
            const radius = pixelWidth / 2 + 10; 

            return {
                id: item.text,
                text: item.text,
                count: item.count,
                r: radius, 
                size: size,
                color: `hsl(${(i * 65) % 360}, 85%, 26%)`,
                x: existing ? existing.x : Math.random() * 400 + 200, 
                y: existing ? existing.y : Math.random() * 300 + 150,
                vx: existing ? existing.vx : 0,
                vy: existing ? existing.vy : 0
            };
        });
        
        setNodes(newNodes);
        nodesRef.current = newNodes;

    }, [responses]);

    useEffect(() => {
        if (!containerRef.current || nodes.length === 0) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const simulation = d3.forceSimulation(nodes)
            .force("x", d3.forceX(width / 2).strength(d => 0.05 + (d.count * 0.05)))
            .force("y", d3.forceY(height / 2).strength(d => 0.05 + (d.count * 0.05)))
            .force("collide", d3.forceCollide().radius(d => d.r * 1.1).strength(1).iterations(6))
            .force("charge", d3.forceManyBody().strength(d => -d.r)) 
            .on("tick", () => {
                nodes.forEach(node => {
                    const halfHeight = node.size * 16; 
                    node.x = Math.max(node.r, Math.min(width - node.r, node.x));
                    node.y = Math.max(halfHeight, Math.min(height - halfHeight, node.y));
                });
                setNodes([...nodes]); 
            });

        simulation.alpha(1).restart();
        return () => simulation.stop();
    }, [nodes]);

    const handleWordSubmit = (e) => {
        if (e) e.preventDefault();
        if (wordInput && wordInput.trim()) {
            onManualAdd(wordInput.trim());
            setWordInput("");
            setIsAddModalOpen(false);
        }
    };

    return (
        <div className="relative w-full h-full min-h-[80vh] flex flex-col">
            {nodes.length === 0 ? (
                <div className="relative flex-1 w-full flex flex-col items-center justify-center bg-yellow-50/50 rounded-3xl border-4 border-black p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-20 h-20 bg-yellow-300 border-3 border-black rounded-3xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
                        <Cloud size={40} className="text-black" />
                    </div>
                    <h3 className="text-2xl font-black text-black mb-1">In attesa di parole e concetti...</h3>
                    <p className="text-sm font-bold text-gray-600 max-w-sm mb-6">
                        Gli studenti possono inviare idee dallo smartphone o dal Chromebook. Puoi anche aggiungerne tu a voce!
                    </p>
                    <button 
                        type="button"
                        onClick={() => setIsAddModalOpen(true)} 
                        className="px-6 py-3 bg-yellow-300 hover:bg-yellow-400 text-black font-black text-sm rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 hover:scale-105 active:translate-x-0.5 active:translate-y-0.5 transition-all"
                    >
                        <Plus size={18} className="stroke-[3]"/>
                        <span>Aggiungi parola a voce</span>
                    </button>
                </div>
            ) : (
                <div ref={containerRef} className="relative w-full flex-1 overflow-hidden bg-yellow-50/40 min-h-[80vh] rounded-3xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {nodes.map((node) => (
                        <div 
                            key={node.id}
                            className="absolute whitespace-nowrap font-black transition-all duration-300 ease-out flex items-center justify-center text-center leading-none select-none"
                            style={{
                                left: node.x,
                                top: node.y,
                                fontSize: `${node.size}rem`,
                                color: node.color,
                                transform: 'translate(-50%, -50%)', 
                                textShadow: '2px 2px 0px rgba(255,255,255,0.95), -1px -1px 0 rgba(255,255,255,0.9)',
                                zIndex: Math.floor(node.count * 100), 
                                pointerEvents: 'none' 
                            }}
                        >
                            {node.text}
                        </div>
                    ))}
                    {/* FAB sempre visibile per docente / LIM */}
                    <button 
                        type="button"
                        onClick={() => setIsAddModalOpen(true)} 
                        className="fixed sm:absolute bottom-6 right-6 z-40 px-4 py-3 bg-yellow-300 hover:bg-yellow-400 text-black font-black text-sm rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
                        title="Aggiungi una parola al brainstorming per gli studenti a voce"
                    >
                        <Plus size={18} className="stroke-[3]"/>
                        <span>Aggiungi Parola</span>
                    </button>
                </div>
            )}

            {/* MODALE INTEGRATO PER AGGIUNTA PAROLA (NO PROMPT) */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 w-full max-w-md border-4 border-black">
                        <div className="flex justify-between items-center mb-5 border-b-2 border-black/10 pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-cyan-300 border-2 border-black flex items-center justify-center">
                                    <Cloud size={18} className="text-black" />
                                </div>
                                <h3 className="text-xl font-black text-black">Aggiungi Parola</h3>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setIsAddModalOpen(false)} 
                                className="p-2 bg-black text-white rounded-xl hover:bg-yellow-300 hover:text-black border-2 border-black transition-colors"
                            >
                                <X size={16} className="stroke-[3]" />
                            </button>
                        </div>
                        <form onSubmit={handleWordSubmit}>
                            <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-2">
                                Concetto o Parola chiave:
                            </label>
                            <input 
                                autoFocus
                                type="text"
                                className="w-full px-4 py-3 bg-white border-2 border-black rounded-xl font-bold text-black outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-gray-400 placeholder:font-normal text-base mb-4"
                                placeholder="Es. Empatia, Rispetto, Emozione..."
                                value={wordInput}
                                onChange={e => setWordInput(e.target.value)}
                            />
                            <div className="flex justify-end gap-2.5">
                                <button 
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)} 
                                    className="px-4 py-2.5 rounded-xl font-black text-xs text-gray-700 hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all"
                                >
                                    Annulla
                                </button>
                                <button 
                                    type="submit"
                                    disabled={!wordInput.trim()}
                                    className="px-6 py-2.5 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                                >
                                    Aggiungi alla Nuvola
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// =================================================================================
// 4. SETTINGS MANAGERS (POLLS, SETS)
// =================================================================================

const PollManager = ({ polls, onUpdate, onClose }) => {
    const [localPolls, setLocalPolls] = useState(polls || []);
    const [title, setTitle] = useState("");
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState("");
    const [allowMultiple, setAllowMultiple] = useState(false);
    
    const handleAdd = () => {
        if (!title || !question || !options) return;
        const newPoll = {
            id: Date.now().toString(),
            title,
            question,
            options: options.split(',').map(s => s.trim()).filter(s => s),
            allowMultiple
        };
        const updated = [...localPolls, newPoll];
        setLocalPolls(updated);
        onUpdate(updated);
        setTitle(""); setQuestion(""); setOptions(""); setAllowMultiple(false);
    };

    const handleDelete = (id) => {
        const updated = localPolls.filter(p => p.id !== id);
        setLocalPolls(updated);
        onUpdate(updated);
    };

    return (
        <div className="fixed inset-0 bg-white z-50 overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="p-6 border-b-4 border-black flex justify-between items-center bg-green-50">
            <div><h2 className="text-3xl font-black uppercase text-green-900">Gestione Sondaggi</h2></div>
            <button onClick={onClose} className="p-3 bg-black text-white rounded-full"><X size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white p-6 rounded-3xl border-4 border-green-100">
                <h3 className="text-xl font-black mb-4 text-green-800">Crea Nuovo Sondaggio</h3>
                <div className="space-y-3">
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titolo (es. Gradimento)" className="w-full p-3 rounded-xl border-2 border-gray-200 outline-none font-bold" />
                    <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Domanda..." className="w-full p-3 rounded-xl border-2 border-gray-200 outline-none" />
                    <textarea value={options} onChange={e => setOptions(e.target.value)} placeholder="Opzioni (separate da virgola)" className="w-full p-3 rounded-xl border-2 border-gray-200 outline-none h-24" />
                    <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={allowMultiple} onChange={e => setAllowMultiple(e.target.checked)} className="w-5 h-5 accent-green-500" />
                        Consenti risposta multipla
                    </label>
                    <button onClick={handleAdd} disabled={!title || !question || !options} className="w-full bg-green-500 text-white py-3 rounded-xl font-bold uppercase disabled:opacity-50">Salva Sondaggio</button>
                </div>
             </div>
             <div className="space-y-4">
                <h3 className="font-bold text-gray-400 uppercase tracking-widest text-xs">Sondaggi Salvati</h3>
                {localPolls.map(poll => (
                    <div key={poll.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center group">
                        <div>
                            <p className="font-bold text-gray-800">{poll.title}</p>
                            <p className="text-xs text-gray-400">{poll.question}</p>
                            {poll.allowMultiple && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-bold">Multipla</span>}
                        </div>
                        <button onClick={() => handleDelete(poll.id)} className="text-red-300 hover:text-red-500 p-2"><Trash2 size={18}/></button>
                    </div>
                ))}
             </div>
          </div>
        </div>
    );
};

const SetManager = ({ sets, onUpdate, onClose }) => {
  const [localSets, setLocalSets] = useState(sets || []);
  const [selectedSetId, setSelectedSetId] = useState(null);
  const [newSetTitle, setNewSetTitle] = useState("");
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionImg, setNewQuestionImg] = useState("");
  
  const handleCreateSet = () => {
    if(!newSetTitle.trim()) return;
    const newSet = { id: Date.now().toString(), title: newSetTitle, questions: [] };
    const updated = [...localSets, newSet];
    setLocalSets(updated);
    onUpdate(updated);
    setNewSetTitle("");
    setSelectedSetId(newSet.id);
  };

  const handleDeleteSet = (id) => {
    if(!window.confirm("Eliminare questo set e tutte le sue domande?")) return;
    const updated = localSets.filter(s => s.id !== id);
    setLocalSets(updated);
    onUpdate(updated);
    if(selectedSetId === id) setSelectedSetId(null);
  };

  const handleAddQuestion = () => {
    if(!newQuestionText.trim()) return;
    const updated = localSets.map(s => {
      if(s.id === selectedSetId) {
        return {
          ...s,
          questions: [...s.questions, { id: Date.now(), text: newQuestionText, imgUrl: newQuestionImg }]
        };
      }
      return s;
    });
    setLocalSets(updated);
    onUpdate(updated);
    setNewQuestionText("");
    setNewQuestionImg("");
  };

  const handleDeleteQuestion = (setId, qId) => {
    const updated = localSets.map(s => {
      if(s.id === setId) {
        return { ...s, questions: s.questions.filter(q => q.id !== qId) };
      }
      return s;
    });
    setLocalSets(updated);
    onUpdate(updated);
  };

  const currentSet = localSets.find(s => s.id === selectedSetId);

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
      <div className="p-6 border-b-4 border-black flex justify-between items-center bg-yellow-50">
        <div><h2 className="text-3xl font-black uppercase">Gestione Set Domande</h2><p className="uppercase text-sm font-bold text-gray-500">Crea pacchetti per le tue lezioni</p></div>
        <button onClick={onClose} className="p-3 bg-black text-white rounded-full"><X size={24} /></button>
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row max-w-7xl mx-auto w-full">
        {/* LISTA SET (SX) */}
        <div className="w-full md:w-1/3 p-6 border-b md:border-b-0 md:border-r border-gray-200 bg-white flex flex-col overflow-y-auto">
          <div className="mb-6">
            <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-2">Nuovo Set</h4>
            <div className="flex gap-2">
              <input value={newSetTitle} onChange={e => setNewSetTitle(e.target.value)} placeholder="Es. Cyberbullismo..." className="flex-1 p-3 rounded-xl border-2 border-gray-200 outline-none" />
              <button onClick={handleCreateSet} className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600"><Plus/></button>
            </div>
          </div>
          <div className="space-y-3 mb-6">
            {localSets.map(set => (
              <div key={set.id} onClick={() => setSelectedSetId(set.id)} className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all ${selectedSetId === set.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                <span className="font-bold text-gray-700">{set.title}</span>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteSet(set.id); }} className="text-red-300 hover:text-red-500"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>
        </div>

        {/* DETTAGLIO SET (DX) */}
        <div className="flex-1 p-6 bg-gray-50 flex flex-col overflow-y-auto">
          {currentSet ? (
            <>
              <div className="bg-white p-6 rounded-3xl border-4 border-blue-100 mb-6 relative">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-black text-blue-900 flex items-center gap-2"><Edit size={20}/> Modifica: {currentSet.title}</h3>
                </div>

                <div className="space-y-3">
                  <input value={newQuestionText} onChange={e => setNewQuestionText(e.target.value)} placeholder="Scrivi la domanda..." className="w-full p-3 rounded-xl border-2 border-gray-200 outline-none" />
                  <div className="flex gap-2">
                    <input value={newQuestionImg} onChange={e => setNewQuestionImg(e.target.value)} placeholder="URL Immagine (Opzionale)..." className="flex-1 p-3 rounded-xl border-2 border-gray-200 outline-none text-sm font-mono" />
                    <button onClick={handleAddQuestion} disabled={!newQuestionText.trim()} className="bg-green-500 text-white px-6 rounded-xl font-bold uppercase disabled:opacity-50">Aggiungi</button>
                  </div>
                  {newQuestionImg && <img src={newQuestionImg} alt="Preview" className="h-20 w-auto rounded-lg border-2 border-gray-200 object-cover" onError={(e) => e.target.style.display = 'none'} />}
                </div>
              </div>

              <div className="space-y-3">
                {currentSet.questions.length === 0 && <p className="text-center text-gray-400 italic">Nessuna domanda in questo set. Aggiungine una o importale.</p>}
                {currentSet.questions.map((q, idx) => (
                  <div key={q.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex gap-4 items-start">
                    <span className="font-bold text-blue-200 text-xl">#{idx+1}</span>
                    {q.imgUrl && <img src={q.imgUrl} alt="Stimolo" className="w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0" />}
                    <p className="flex-1 font-medium text-gray-800">{q.text}</p>
                    <button onClick={() => handleDeleteQuestion(currentSet.id, q.id)} className="text-red-300 hover:text-red-500"><Trash2 size={18}/></button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 font-medium">Seleziona un set a sinistra per modificarlo.</div>
          )}
        </div>
      </div>
    </div>
  );
};

// =================================================================================
// 5. VISTE FEEDBACK (MODERATORE, DOCENTE, STUDENTE)
// =================================================================================

const FeedbackModeratorView = ({ sessionCode, user }) => {
    const [sessionData, setSessionData] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');

    useEffect(() => {
        if (!db || !user) return;
        const sessionRef = doc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'feedback_sessions'), sessionCode);
        const unsubscribe = onSnapshot(sessionRef, (snap) => { if (snap.exists()) setSessionData(snap.data()); });
        return () => unsubscribe();
    }, [sessionCode, user]);

    const toggleVisibility = async (idx, currentVal) => {
        if (!sessionData) return;
        const updatedResponses = [...sessionData.responses];
        const newStatus = currentVal ? 'hidden' : 'visible'; 
        updatedResponses[idx] = { ...updatedResponses[idx], status: newStatus, visible: newStatus === 'visible' };
        
        const sessionRef = doc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'feedback_sessions'), sessionCode);
        await updateDoc(sessionRef, { responses: updatedResponses });
    };
    
    const approveResponse = async (idx) => {
        if (!sessionData) return;
        const updatedResponses = [...sessionData.responses];
        updatedResponses[idx] = { ...updatedResponses[idx], status: 'visible', visible: true };
        const sessionRef = doc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'feedback_sessions'), sessionCode);
        await updateDoc(sessionRef, { responses: updatedResponses });
    };

    if (!sessionData) return <div className="p-8 text-center text-white">Caricamento...</div>;

    const pending = sessionData.responses.map((r, i) => ({...r, originalIdx: i})).filter(r => r.status === 'pending');
    const published = sessionData.responses.map((r, i) => ({...r, originalIdx: i})).filter(r => r.status === 'visible' || (!r.status && r.visible !== false));

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Smartphone/> Moderazione {sessionCode}</h2>
            
            {/* TABS */}
            <div className="flex gap-2 mb-4">
                <button onClick={() => setActiveTab('pending')} className={`flex-1 py-2 rounded-lg font-bold transition-colors ${activeTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white/90 hover:text-white'}`}>
                    Da Approvare ({pending.length})
                </button>
                <button onClick={() => setActiveTab('published')} className={`flex-1 py-2 rounded-lg font-bold transition-colors ${activeTab === 'published' ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-white/90 hover:text-white'}`}>
                    Pubblicati ({published.length})
                </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
                {(activeTab === 'pending' ? pending : published).slice().reverse().map((res) => {
                    const displayText = Array.isArray(res.text) ? res.text.join(", ") : res.text;
                    return (
                        <div key={res.originalIdx} className={`p-4 rounded-xl border flex justify-between items-center ${activeTab === 'published' ? 'bg-gray-800 border-gray-700' : 'bg-yellow-900/20 border-yellow-600'}`}>
                            <div className="flex-1 mr-4">
                                <p className="font-bold text-lg">{displayText}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-xs text-gray-400">{new Date(res.timestamp).toLocaleTimeString()}</p>
                                    {res.studentName && (
                                        <span className="text-xs bg-purple-900/60 text-purple-200 border border-purple-500/50 px-2 py-0.5 rounded-md font-bold">
                                            👤 {res.studentName}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {/* Tasto Nascondi (X) */}
                                <button onClick={() => toggleVisibility(res.originalIdx, true)} className="p-3 rounded-full bg-red-600/80 text-white"><X size={20}/></button>
                                
                                {/* Tasto Approva (Check) - Solo se siamo in pending */}
                                {activeTab === 'pending' && <button onClick={() => approveResponse(res.originalIdx)} className="p-3 rounded-full bg-green-600 text-white"><Check size={20}/></button>}
                            </div>
                        </div>
                    );
                })}
                
                {(activeTab === 'pending' ? pending : published).length === 0 && (
                    <p className="text-center text-gray-500 mt-10">Nessun elemento qui.</p>
                )}
            </div>
        </div>
    );
};

// VISTA INGRESSO STUDENTE
const StudentEntryView = ({ onJoin, onTeacherUnlock, canUnlock = true }) => {
    const [code, setCode] = useState("");
    // Il nome parte SEMPRE vuoto ad ogni sessione, per evitare scambi tra studenti su Chromebook condivisi
    const [name, setName] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleEnter = () => {
        if (!code.trim() || code.trim().length < 4) {
            setErrorMsg("Inserisci il codice stanza a 4 lettere.");
            return;
        }
        if (!name.trim() || name.trim().length < 2) {
            setErrorMsg("Inserisci il tuo nome e cognome per partecipare.");
            return;
        }
        setErrorMsg("");
        onJoin(code.trim().toUpperCase(), name.trim());
    };

    return (
        <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-6 relative">
            {canUnlock && onTeacherUnlock && (
                <button
                    type="button"
                    onClick={onTeacherUnlock}
                    className="absolute top-6 right-6 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-yellow-300 text-xs font-black text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                    title="Accesso riservato al docente tramite PIN"
                >
                    <Lock size={14} className="text-amber-700" /> Accesso Docente
                </button>
            )}
            <div className="bg-white p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full text-center border-4 border-black animate-in fade-in zoom-in">
                <div className="bg-yellow-100 w-20 h-20 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto mb-6">
                    <LogIn size={40} className="text-black"/>
                </div>
                <h1 className="text-3xl font-black mb-1 text-gray-900">Partecipa</h1>
                <p className="text-gray-500 text-xs font-bold mb-6">Inserisci il codice fornito dal docente e il tuo nome.</p>
                
                <div className="mb-4 text-left">
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1.5">
                        Codice Stanza (4 lettere):
                    </label>
                    <input 
                        value={code} 
                        onChange={e => { setCode(e.target.value.toUpperCase()); setErrorMsg(""); }}
                        placeholder="ABCD" 
                        className="w-full text-center text-3xl font-black tracking-widest p-3.5 border-4 border-black rounded-2xl focus:bg-yellow-50 outline-none uppercase font-mono bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        maxLength={6}
                        autoFocus
                    />
                </div>

                <div className="mb-4 text-left">
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1.5">
                        Il tuo Nome e Cognome <span className="text-red-500">*</span>:
                    </label>
                    <input 
                        value={name} 
                        onChange={e => { setName(e.target.value); setErrorMsg(""); }}
                        onKeyDown={e => { if (e.key === 'Enter') handleEnter(); }}
                        placeholder="Es. Marco Rossi, Anna..." 
                        className="w-full text-center text-base font-bold p-3 border-2 border-black rounded-xl focus:bg-yellow-50 outline-none bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        maxLength={35}
                    />
                </div>

                {errorMsg && (
                    <div className="mb-4 p-2.5 bg-red-50 border-2 border-red-300 text-red-700 text-xs font-black rounded-xl text-center">
                        ⚠️ {errorMsg}
                    </div>
                )}

                <button 
                    onClick={handleEnter}
                    disabled={code.trim().length < 4 || name.trim().length < 2}
                    className="w-full bg-yellow-300 hover:bg-yellow-400 text-black border-3 border-black py-4 rounded-2xl font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
                >
                    ENTRA NELL'ATTIVITÀ
                </button>
            </div>
        </div>
    );
};

// Livelli di dimensione font e densità griglia per le risposte Q&A
const QA_FONT_SIZES = {
  sm: {
    label: 'Compatto',
    grid: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5',
    cardPad: 'p-3',
    headerSize: 'text-[11px]',
    textSize: 'text-sm leading-snug',
    detailsText: 'text-xs',
    collapsedPad: 'py-2 px-3',
  },
  md: {
    label: 'Medio',
    grid: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5',
    cardPad: 'p-4',
    headerSize: 'text-xs',
    textSize: 'text-base leading-relaxed',
    detailsText: 'text-xs',
    collapsedPad: 'py-2.5 px-3.5',
  },
  lg: {
    label: 'Grande',
    grid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    cardPad: 'p-6',
    headerSize: 'text-xs',
    textSize: 'text-xl leading-relaxed',
    detailsText: 'text-sm',
    collapsedPad: 'py-3 px-4',
  },
  xl: {
    label: 'Molto grande',
    grid: 'grid-cols-1 md:grid-cols-2 gap-4',
    cardPad: 'p-6',
    headerSize: 'text-sm',
    textSize: 'text-2xl leading-relaxed',
    detailsText: 'text-sm',
    collapsedPad: 'py-3.5 px-5',
  }
};

const FeedbackTeacherView = ({ onClose, feedbackSets, pollSets, onUpdateSets, onUpdatePolls, user }) => {
  const [sessionCode, setSessionCode] = useState(null);
  const [sessionData, setSessionData] = useState({ active: false, responses: [], type: 'qa', pollOptions: [], allowMultiple: false });
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('config'); 
  const [sessionType, setSessionType] = useState('qa'); 
  
  const [pollOptionsInput, setPollOptionsInput] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [selectedSetId, setSelectedSetId] = useState("");
  const [selectedPollId, setSelectedPollId] = useState("");
  const [moderationEnabled, setModerationEnabled] = useState(false);
  const [allowMultipleResponses, setAllowMultipleResponses] = useState(true);

  const [showModQR, setShowModQR] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); 
  const [isManualQAOpen, setIsManualQAOpen] = useState(false); // Stato per il modale manuale QA

  useEffect(() => {
      if (selectedPollId && pollSets) {
          const poll = pollSets.find(p => p.id === selectedPollId);
          if (poll) {
              setPollQuestion(poll.question);
              setPollOptionsInput(poll.options.join(", "));
              setAllowMultiple(poll.allowMultiple);
          }
      }
  }, [selectedPollId, pollSets]);

  const createSession = async () => {
    if (!db) return alert("Database non disponibile.");
    if (sessionType === 'poll' && (!pollQuestion || !pollOptionsInput)) return alert("Inserisci domanda e opzioni.");
    
    setLoading(true);
    let questionsToLoad = [];
    if (sessionType === 'qa' && selectedSetId) {
      const set = feedbackSets.find(s => s.id === selectedSetId);
      if (set) questionsToLoad = set.questions;
    }

    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    const sessionRef = doc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'feedback_sessions'), code);
    
    const options = sessionType === 'poll' ? pollOptionsInput.split(',').map(s => s.trim()).filter(s => s) : [];

    await setDoc(sessionRef, { 
        active: true, 
        createdAt: new Date().toISOString(), 
        responses: [],
        type: sessionType,
        question: pollQuestion,
        options: options,
        allowMultiple: allowMultiple, 
        questions: questionsToLoad,
        moderationEnabled: moderationEnabled,
        allowMultipleResponses: allowMultipleResponses
    });
    setSessionCode(code);
    setViewMode('qr');
    setLoading(false);
  };

  const toggleSessionStatus = async () => {
    if (!db || !sessionCode) return;
    const sessionRef = doc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'feedback_sessions'), sessionCode);
    await updateDoc(sessionRef, { active: !sessionData.active });
  };

  useEffect(() => {
    if (!db || !sessionCode || !user) return;
    const sessionRef = doc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'feedback_sessions'), sessionCode);
    const unsubscribe = onSnapshot(sessionRef, (snap) => {
      if (snap.exists()) setSessionData(snap.data());
    });
    return () => unsubscribe();
  }, [sessionCode, user]);

  const exportResponses = () => {
    const textContent = sessionData.responses.map(r => {
        const txt = Array.isArray(r.text) ? r.text.join(", ") : r.text;
        return `- ${txt} (${new Date(r.timestamp).toLocaleTimeString()})`;
    }).join('\n');
    
    const element = document.createElement("a");
    const file = new Blob([textContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `feedback_${sessionCode}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const [showNames, setShowNames] = useState(true);
  const [qaFontSize, setQaFontSize] = useState(() => {
    try {
      return localStorage.getItem('lss_qa_font_size') || 'md';
    } catch {
      return 'md';
    }
  });

  const handleFontSizeChange = (lvl) => {
    setQaFontSize(lvl);
    try {
      localStorage.setItem('lss_qa_font_size', lvl);
    } catch {}
  };

  const [allCollapsed, setAllCollapsed] = useState(false);
  const [collapsedOverrides, setCollapsedOverrides] = useState({});

  // Stato per copia link di condivisione
  const [copiedBaseLink, setCopiedBaseLink] = useState(false);
  const [copiedDirectLink, setCopiedDirectLink] = useState(false);

  const isNoteCollapsed = (key) => {
    if (collapsedOverrides[key] !== undefined) return collapsedOverrides[key];
    return allCollapsed;
  };

  const toggleNoteCollapse = (key) => {
    setCollapsedOverrides(prev => ({
      ...prev,
      [key]: !isNoteCollapsed(key)
    }));
  };

  const toggleAllCollapse = () => {
    const next = !allCollapsed;
    setAllCollapsed(next);
    setCollapsedOverrides({});
  };

  const exportScreen = () => window.print();

  const handleManualAddWord = async (word) => {
      if (!word || !db || !sessionCode) return;
      const sessionRef = doc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'feedback_sessions'), sessionCode);
      await updateDoc(sessionRef, { 
          responses: arrayUnion({ 
              text: word, 
              timestamp: new Date().toISOString(), 
              status: 'visible',
              visible: true 
          }) 
      });
  };

  const handleManualQASubmit = async (content, authorName) => {
      if (!content || !db || !sessionCode) return;
      const cleanAuthor = (authorName && typeof authorName === 'string' && authorName.trim().length > 0)
          ? authorName.trim()
          : null;
      const sessionRef = doc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'feedback_sessions'), sessionCode);
      await updateDoc(sessionRef, { 
          responses: arrayUnion({ 
              text: content, 
              timestamp: new Date().toISOString(), 
              status: 'visible',
              visible: true,
              ...(cleanAuthor ? { studentName: cleanAuthor } : {})
          }) 
      });
  };

  // Scorciatoia rapida da tastiera per il docente: Ctrl+M per aprire l'inserimento risposta manuale
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setIsManualQAOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const handleManualPollVote = async (option, delta) => {
      if (!db || !sessionCode) return;
      const sessionRef = doc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'feedback_sessions'), sessionCode);
      
      if (delta > 0) {
          // Aggiungi voto
          await updateDoc(sessionRef, { 
              responses: arrayUnion({ 
                  text: option, 
                  timestamp: new Date().toISOString(), 
                  status: 'visible',
                  visible: true 
              }) 
          });
      } else {
          // Rimuovi ultimo voto corrispondente
          const snap = await getDoc(sessionRef);
          if (!snap.exists()) return;
          const currentData = snap.data();
          const currentResponses = currentData.responses || [];
          
          let indexToRemove = -1;
          for (let i = currentResponses.length - 1; i >= 0; i--) {
              const r = currentResponses[i];
              // Gestione semplificata: rimuove se il testo coincide o se è un array che contiene SOLO quell'opzione
              const val = Array.isArray(r.text) && r.text.length === 1 ? r.text[0] : r.text;
              if (val === option) {
                  indexToRemove = i;
                  break;
              }
          }

          if (indexToRemove !== -1) {
              const newResponses = [...currentResponses];
              newResponses.splice(indexToRemove, 1);
              await updateDoc(sessionRef, { responses: newResponses });
          }
      }
  };

  if (isSettingsOpen === 'questions') {
    return <SetManager sets={feedbackSets} onUpdate={onUpdateSets} onClose={() => setIsSettingsOpen(null)} />;
  }
  if (isSettingsOpen === 'polls') {
    return <PollManager polls={pollSets} onUpdate={onUpdatePolls} onClose={() => setIsSettingsOpen(null)} />;
  }

  if (!sessionCode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 md:p-10 bg-yellow-50 rounded-3xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="bg-yellow-300 p-5 rounded-3xl mb-4 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <MessageSquare size={48} className="text-black stroke-[2.5]" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black mb-2 text-black text-center tracking-tight">
          Feedback &amp; Sondaggi Interattivi
        </h2>
        <p className="text-gray-700 font-bold mb-8 max-w-lg text-center text-sm md:text-base">
          Scegli l'attività per la classe, configura le opzioni e proietta il codice d'accesso per raccogliere risposte in tempo reale.
        </p>
        
        {/* CARTE SELEZIONE ATTIVITÀ CON DESIGN NEO-BRUTALISTA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 w-full max-w-4xl">
            <button 
              type="button"
              onClick={() => setSessionType('qa')} 
              className={`p-6 rounded-3xl border-3 flex flex-col items-center text-center gap-3 transition-all ${
                sessionType === 'qa' 
                  ? 'bg-yellow-300 border-black scale-105 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black' 
                  : 'bg-white border-black/25 hover:border-black text-black hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
                <div className="w-14 h-14 rounded-2xl bg-black text-yellow-300 flex items-center justify-center shadow-xs">
                  <MessageSquare size={28} className="stroke-[2.5]"/>
                </div>
                <span className="font-black text-lg text-black">Domande &amp; Risposte</span>
                <span className="text-xs font-bold text-gray-700 leading-snug">Post-it a muro per riflessioni, opinioni e risposte a voce</span>
            </button>

            <button 
              type="button"
              onClick={() => setSessionType('wordcloud')} 
              className={`p-6 rounded-3xl border-3 flex flex-col items-center text-center gap-3 transition-all ${
                sessionType === 'wordcloud' 
                  ? 'bg-cyan-300 border-black scale-105 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black' 
                  : 'bg-white border-black/25 hover:border-black text-black hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
                <div className="w-14 h-14 rounded-2xl bg-black text-cyan-300 flex items-center justify-center shadow-xs">
                  <Cloud size={28} className="stroke-[2.5]"/>
                </div>
                <span className="font-black text-lg text-black">Brainstorming</span>
                <span className="text-xs font-bold text-gray-700 leading-snug">Nuvola di parole dinamica per idee e parole chiave d'aula</span>
            </button>

            <button 
              type="button"
              onClick={() => setSessionType('poll')} 
              className={`p-6 rounded-3xl border-3 flex flex-col items-center text-center gap-3 transition-all ${
                sessionType === 'poll' 
                  ? 'bg-emerald-300 border-black scale-105 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black' 
                  : 'bg-white border-black/25 hover:border-black text-black hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
                <div className="w-14 h-14 rounded-2xl bg-black text-emerald-300 flex items-center justify-center shadow-xs">
                  <BarChart2 size={28} className="stroke-[2.5]"/>
                </div>
                <span className="font-black text-lg text-black">Sondaggio</span>
                <span className="text-xs font-bold text-gray-700 leading-snug">Votazioni immediate con percentuali e supporto per alzata di mano</span>
            </button>
        </div>

        {/* OPZIONI DIDATTICHE: MODERAZIONE E RISPOSTE MULTIPLE */}
        <div className="mb-6 flex flex-wrap gap-4 justify-center max-w-2xl w-full">
             <button 
                type="button"
                onClick={() => setModerationEnabled(!moderationEnabled)} 
                className={`flex-1 min-w-[260px] p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  moderationEnabled 
                    ? 'bg-amber-100 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' 
                    : 'bg-white border-black/30 hover:border-black shadow-xs'
                }`}
             >
                <div className="text-left pr-2">
                  <span className="block font-black text-sm text-black">🛡️ Richiedi Approvazione</span>
                  <span className="block text-xs font-bold text-gray-600">Le risposte appaiono solo dopo il tuo OK</span>
                </div>
                <div className={`w-12 h-6 rounded-full border-2 border-black p-0.5 transition-colors relative ${moderationEnabled ? 'bg-amber-400' : 'bg-gray-200'}`}>
                    <div className={`w-4 h-4 bg-black rounded-full transition-transform ${moderationEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
            </button>

            <button 
                type="button"
                onClick={() => setAllowMultipleResponses(!allowMultipleResponses)} 
                className={`flex-1 min-w-[260px] p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  allowMultipleResponses 
                    ? 'bg-emerald-100 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' 
                    : 'bg-white border-black/30 hover:border-black shadow-xs'
                }`}
            >
                <div className="text-left pr-2">
                  <span className="block font-black text-sm text-black">🔄 Risposte Multiple</span>
                  <span className="block text-xs font-bold text-gray-600">Ogni studente può inviare più contributi</span>
                </div>
                <div className={`w-12 h-6 rounded-full border-2 border-black p-0.5 transition-colors relative ${allowMultipleResponses ? 'bg-emerald-400' : 'bg-gray-200'}`}>
                    <div className={`w-4 h-4 bg-black rounded-full transition-transform ${allowMultipleResponses ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
            </button>
        </div>

        {sessionType === 'qa' && (
             <div className="w-full max-w-lg bg-white p-5 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
               <div className="flex items-center justify-between mb-2">
                 <label className="text-xs font-black uppercase tracking-wider text-black">
                   Domanda o Set Domande:
                 </label>
                 <button 
                   type="button"
                   onClick={() => setIsSettingsOpen('questions')} 
                   className="px-2.5 py-1 bg-yellow-200 hover:bg-yellow-300 text-black rounded-lg border border-black text-xs font-black flex items-center gap-1 transition-colors shadow-xs" 
                   title="Crea o modifica set di domande"
                 >
                   <Settings size={13}/> Gestisci Set
                 </button>
               </div>
               <div className="relative">
                  <select 
                    className="w-full p-3 bg-gray-50 rounded-xl border-2 border-black appearance-none font-bold text-black outline-none focus:ring-2 focus:ring-yellow-400" 
                    value={selectedSetId} 
                    onChange={(e) => setSelectedSetId(e.target.value)}
                  >
                     <option value="">-- Risposte Libere (Nessuna Domanda Prefissata) --</option>
                     {feedbackSets && feedbackSets.map(set => (
                       <option key={set.id} value={set.id}>
                         Set: {set.title} ({set.questions?.length || 0} domande)
                       </option>
                     ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" size={18}/>
               </div>
             </div>
        )}

        {sessionType === 'poll' && (
            <div className="w-full max-w-lg bg-white p-6 rounded-3xl border-3 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] mb-8 animate-in slide-in-from-top-4 relative">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-black">Configura Sondaggio</span>
                  <button 
                    type="button"
                    onClick={() => setIsSettingsOpen('polls')} 
                    className="px-2.5 py-1 bg-emerald-200 hover:bg-emerald-300 text-black rounded-lg border border-black text-xs font-black flex items-center gap-1 transition-colors shadow-xs"
                    title="Gestisci sondaggi salvati"
                  >
                    <Settings size={13}/> Preset
                  </button>
                </div>
                <div className="mb-3">
                     <select 
                       className="w-full p-2.5 bg-gray-50 rounded-xl border-2 border-black text-xs font-bold text-black outline-none" 
                       value={selectedPollId} 
                       onChange={(e) => setSelectedPollId(e.target.value)}
                     >
                        <option value="">-- Crea Nuovo Sondaggio --</option>
                        {pollSets && pollSets.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                     </select>
                </div>
                <input 
                  value={pollQuestion} 
                  onChange={e => setPollQuestion(e.target.value)} 
                  placeholder="Domanda del sondaggio (es. Quanto è chiaro l'argomento?)" 
                  className="w-full p-3 mb-3 rounded-xl border-2 border-black font-bold outline-none focus:ring-2 focus:ring-emerald-300 text-sm text-black"
                />
                <textarea 
                  value={pollOptionsInput} 
                  onChange={e => setPollOptionsInput(e.target.value)} 
                  placeholder="Opzioni separate da virgola (es. Molto chiaro, Abbastanza, Poco, Per nulla)" 
                  className="w-full p-3 rounded-xl border-2 border-black outline-none focus:ring-2 focus:ring-emerald-300 h-24 mb-3 font-medium text-sm text-black"
                />
                <label className="flex items-center gap-2.5 font-black text-sm text-black cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={allowMultiple} 
                      onChange={e => setAllowMultiple(e.target.checked)} 
                      className="w-5 h-5 accent-emerald-600 rounded border-2 border-black" 
                    />
                    Consenti risposta multipla agli studenti
                </label>
            </div>
        )}

        <button 
          type="button"
          onClick={createSession} 
          disabled={loading} 
          className="bg-black hover:bg-yellow-300 text-yellow-300 hover:text-black border-3 border-black px-10 py-4 rounded-2xl font-black text-xl hover:scale-105 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-3 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
        >
          {loading ? <Loader2 className="animate-spin" size={22}/> : <PlayIcon />} 
          <span>AVVIA SESSIONE AULA</span>
        </button>
      </div>
    );
  }

  const cleanBaseUrl = window.location.origin + window.location.pathname;
  const fbEncoded = encodeFBConfig(getFBConfig());
  const joinUrl = `${cleanBaseUrl}?session=${sessionCode}${fbEncoded ? `&fb=${fbEncoded}` : ''}`;
  const modUrl = `${cleanBaseUrl}?mode=moderator&session=${sessionCode}`;

  return (
    <div className="flex flex-col h-full relative">
      {/* TOOLBAR SUPERIORE MODERNA & IMPECCABILE */}
      <div className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl border-4 border-black mb-4 flex flex-wrap items-center justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] gap-3">
         
         {/* GRUPPO 1 (SINISTRA): CODICE STANZA & STATO */}
         <div className="flex items-center gap-2.5">
             <div 
               onClick={() => {
                 navigator.clipboard.writeText(sessionCode);
                 alert(`Codice stanza ${sessionCode} copiato!`);
               }}
               className="bg-black text-yellow-400 px-3.5 py-1.5 rounded-xl font-mono font-black text-xl tracking-wider cursor-pointer hover:scale-105 transition-transform flex items-center gap-1.5 shadow-sm"
               title="Clicca per copiare il codice stanza"
             >
                 <span>{sessionCode}</span>
                 <Copy size={13} className="opacity-60 hover:opacity-100" />
             </div>

             <button 
               onClick={toggleSessionStatus} 
               className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 border-2 transition-all ${
                 sessionData.active 
                   ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200' 
                   : 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
               }`}
               title="Clicca per aprire o chiudere la ricezione delle risposte"
             >
                <span className={`w-2 h-2 rounded-full ${sessionData.active ? 'bg-emerald-600 animate-pulse' : 'bg-rose-600'}`} />
                {sessionData.active ? 'APERTA' : 'CHIUSA'}
             </button>

             <span className="hidden sm:inline-block bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider">
                 {sessionData.type === 'qa' && "Domande & Risposte"}
                 {sessionData.type === 'wordcloud' && "Brainstorming"}
                 {sessionData.type === 'poll' && "Sondaggio"}
             </span>
         </div>
         
         {/* GRUPPO 2 (CENTRO): COMMUTATORE VISTA (QR vs RISULTATI) */}
         <div className="inline-flex p-1 bg-gray-100 rounded-xl border-2 border-gray-200">
             <button 
               onClick={() => setViewMode('qr')} 
               className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all ${
                 viewMode === 'qr' 
                   ? 'bg-black text-white shadow-sm' 
                   : 'text-gray-600 hover:text-black hover:bg-gray-200'
               }`}
             >
                 <QrCode size={14}/> Istruzioni &amp; QR
             </button>
             <button 
               onClick={() => setViewMode('responses')} 
               className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all ${
                 viewMode === 'responses' 
                   ? 'bg-blue-600 text-white shadow-sm' 
                   : 'text-gray-600 hover:text-black hover:bg-gray-200'
               }`}
             >
                 <MessageSquare size={14}/> Risposte ({sessionData.responses.filter(r => r.status === 'visible' || (!r.status && r.visible !== false)).length})
             </button>
         </div>

         {/* GRUPPO 3 (DESTRA): CONTROLLI DIDATTICI & STRUMENTI */}
         <div className="flex flex-wrap items-center gap-2">
             
             {/* CONTROLLO DIDATTICO NOMI: ANONIMO VS VISIBILE */}
             <button 
               onClick={() => setShowNames(!showNames)} 
               className={`px-3 py-1.5 rounded-xl border-2 font-black text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                 showNames 
                   ? 'bg-purple-100 text-purple-900 border-purple-300 hover:bg-purple-200' 
                   : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
               }`} 
               title={showNames ? "I nomi sono visibili alla classe. Clicca per renderli anonimi." : "I nomi sono nascosti alla classe. Clicca per mostrarli."}
             >
                {showNames ? <Eye size={15} className="text-purple-700"/> : <EyeOff size={15} className="text-slate-600"/>}
                <span>{showNames ? 'Nomi Visibili' : 'Aula Anonima'}</span>
             </button>

             {/* CONTROLLI SPECIFICI Q&A */}
             {sessionData.type === 'qa' && (
                <>
                  {/* Regolazione font */}
                  <div className="flex items-center bg-gray-100 rounded-xl border-2 border-gray-200 p-0.5" title="Regola dimensione testo delle note">
                    <button
                      type="button"
                      onClick={() => {
                        const lvls = ['sm', 'md', 'lg', 'xl'];
                        const curIdx = lvls.indexOf(qaFontSize);
                        if (curIdx > 0) setQaFontSize(lvls[curIdx - 1]);
                      }}
                      disabled={qaFontSize === 'sm'}
                      className="px-2 py-1 font-black text-xs text-gray-700 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title="Testo più piccolo"
                    >
                      A-
                    </button>
                    <span className="px-1.5 font-black text-[10px] text-gray-500 uppercase select-none">
                      {QA_FONT_SIZES[qaFontSize]?.label || 'Testo'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const lvls = ['sm', 'md', 'lg', 'xl'];
                        const curIdx = lvls.indexOf(qaFontSize);
                        if (curIdx < lvls.length - 1) setQaFontSize(lvls[curIdx + 1]);
                      }}
                      disabled={qaFontSize === 'xl'}
                      className="px-2 py-1 font-black text-xs text-gray-700 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title="Testo più grande"
                    >
                      A+
                    </button>
                  </div>

                  {/* Espandi / Collassa note (visibile solo se i nomi sono attivi) */}
                  {showNames && (
                    <button
                      type="button"
                      onClick={toggleAllCollapse}
                      className={`px-3 py-1.5 rounded-xl border-2 transition-all flex items-center gap-1.5 text-xs font-black ${
                        allCollapsed 
                          ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900' 
                          : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700'
                      }`}
                      title={allCollapsed ? "Espandi tutte le note (mostra risposte)" : "Collassa tutte (mostra solo nomi)"}
                    >
                      {allCollapsed ? <ChevronDown size={14}/> : <ChevronUp size={14}/>}
                      <span>{allCollapsed ? "Espandi" : "Solo nomi"}</span>
                    </button>
                  )}

                  {/* Pulsante rapido inserimento a voce */}
                  <button
                    type="button"
                    onClick={() => setIsManualQAOpen(true)}
                    className="px-3 py-1.5 rounded-xl border-2 border-black bg-yellow-300 hover:bg-yellow-400 text-black font-black text-xs flex items-center gap-1.5 transition-all shadow-xs active:translate-x-0.5 active:translate-y-0.5"
                    title="Aggiungi una risposta raccolta a voce dallo studente (o premi Ctrl+M)"
                  >
                    <Plus size={14} className="stroke-[3]"/>
                    <span>Aggiungi a voce</span>
                  </button>
                </>
             )}

             {/* GRUPPO ESPORTAZIONE */}
             <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200">
                 <button 
                   onClick={() => exportSessionImage(sessionData, sessionCode, showNames)} 
                   className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 font-black text-xs rounded-lg flex items-center gap-1 border border-purple-200 transition-all shadow-xs" 
                   title="Salva screenshot SVG zoomabile di tutta l'area"
                 >
                    <Download size={13} /> SVG
                 </button>
                 <button 
                   onClick={() => exportSessionXLSX(sessionData, sessionCode)} 
                   className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-black text-xs rounded-lg flex items-center gap-1 border border-emerald-200 transition-all shadow-xs" 
                   title="Esporta foglio Excel con tutti i nomi e risposte"
                 >
                    <Download size={13} /> XLS
                 </button>
             </div>

             {/* TELECOMANDO MODERATORE */}
             <button 
               onClick={() => setShowModQR(!showModQR)} 
               className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl border-2 border-gray-200 transition-all" 
               title="Telecomando smartphone per moderare da remoto"
             >
                <Smartphone size={16}/>
             </button>

             {/* CHIUSURA SESSIONE */}
             <button 
               onClick={() => {
                 if (confirm("Vuoi chiudere questa sessione e tornare alla configurazione?")) {
                   setSessionCode(null);
                 }
               }} 
               className="p-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl border-2 border-rose-300 transition-all"
               title="Termina sessione"
             >
                <X size={16}/>
             </button>
         </div>
      </div>

      {showModQR && (
        <div className="absolute top-20 right-4 z-50 bg-white p-6 rounded-2xl shadow-2xl border-4 border-gray-800 animate-in zoom-in origin-top-right">
             <h4 className="font-bold text-center mb-4">Scansiona col tuo telefono<br/>per moderare</h4>
             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(modUrl)}`} alt="Mod QR" className="rounded-lg border-2 border-gray-100 mx-auto"/>
             <button onClick={() => setShowModQR(false)} className="mt-4 w-full bg-gray-100 py-2 rounded-lg font-bold text-sm">Chiudi</button>
        </div>
      )}

      {viewMode === 'qr' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 py-4 max-w-5xl mx-auto w-full">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-stretch">
                
                {/* COLONNA 1: SMARTPHONE & TABLET (QR CODE) */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border-4 border-black flex flex-col items-center justify-center text-center">
                   <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs font-black uppercase px-3.5 py-1.5 rounded-full mb-4">
                     <Smartphone size={15} /> Da Smartphone / Tablet
                   </div>
                   <div className="p-3 bg-white rounded-2xl border-2 border-gray-200 shadow-inner mb-3">
                     <img 
                       src={`https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(joinUrl)}`} 
                       alt="QR Code per Smartphone" 
                       className="w-44 h-44 md:w-56 md:h-56 object-contain"
                     />
                   </div>
                   <p className="text-xs font-bold text-gray-500">Inquadra con la fotocamera per partecipare</p>
                </div>

                {/* COLONNA 2: CHROMEBOOK / PC / LIM (CODICE PIN & LINK) */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border-4 border-black flex flex-col justify-between text-left relative overflow-hidden">
                   <div>
                     <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 text-xs font-black uppercase px-3.5 py-1.5 rounded-full mb-4">
                       <Laptop size={15} /> Da Chromebook o PC
                     </div>

                     <h3 className="text-xl font-black text-gray-900 mb-2">Come collegarsi:</h3>
                     <ol className="space-y-4 my-4">
                       <li className="flex items-start gap-2.5">
                         <span className="w-6 h-6 rounded-full bg-black text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                         <div className="text-sm font-bold text-gray-700 flex-1 min-w-0">
                           Apri il browser su:
                           <div className="mt-1 font-mono font-black text-sm md:text-base text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 select-all inline-block break-all">
                             {cleanBaseUrl}
                           </div>
                         </div>
                       </li>

                       <li className="flex items-start gap-2.5">
                         <span className="w-6 h-6 rounded-full bg-black text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                         <div className="text-sm font-bold text-gray-700">
                           Digita il codice stanza:
                           <div className="mt-1.5 text-4xl md:text-5xl font-mono font-black tracking-widest text-black bg-yellow-300 px-5 py-2 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block select-all">
                             {sessionCode}
                           </div>
                         </div>
                       </li>
                     </ol>
                   </div>

                   {/* Pulsanti rapidi per il docente */}
                   <div className="pt-4 border-t-2 border-gray-100 flex flex-col sm:flex-row gap-2">
                     <button
                       type="button"
                       onClick={() => {
                         navigator.clipboard.writeText(cleanBaseUrl);
                         setCopiedBaseLink(true);
                         setTimeout(() => setCopiedBaseLink(false), 2500);
                       }}
                       className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border-2 transition-all ${
                         copiedBaseLink 
                           ? 'bg-green-100 text-green-700 border-green-300' 
                           : 'bg-white hover:bg-gray-100 text-gray-800 border-gray-300 shadow-sm'
                       }`}
                       title="Copia l'indirizzo principale da scrivere o dettare agli studenti"
                     >
                       {copiedBaseLink ? <Check size={14}/> : <Copy size={14}/>}
                       {copiedBaseLink ? 'Indirizzo copiato!' : 'Copia indirizzo sito (per Chromebook)'}
                     </button>

                     <button
                       type="button"
                       onClick={() => {
                         navigator.clipboard.writeText(joinUrl);
                         setCopiedDirectLink(true);
                         setTimeout(() => setCopiedDirectLink(false), 2500);
                       }}
                       className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border-2 transition-all ${
                         copiedDirectLink 
                           ? 'bg-green-100 text-green-700 border-green-300' 
                           : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-300 shadow-sm'
                       }`}
                       title="Copia il link diretto già pronto per Google Classroom o Teams"
                     >
                       {copiedDirectLink ? <Check size={14}/> : <Share2 size={14}/>}
                       {copiedDirectLink ? 'Link diretto copiato!' : 'Copia link diretto (per Classroom)'}
                     </button>
                   </div>
                </div>

             </div>

             {sessionData.type === 'poll' && <div className="mt-8 text-2xl font-black text-center text-green-700 bg-green-50 px-6 py-3 rounded-2xl border-2 border-green-200">{sessionData.question}</div>}
             {sessionData.questions && sessionData.questions.length > 0 && (
                <div className="w-full max-w-5xl px-4 text-center mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sessionData.questions.map((q) => (
                        <div key={q.id} className="bg-white/95 backdrop-blur-sm border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left flex flex-col">
                            {q.imgUrl && <div className="mb-4 rounded-xl overflow-hidden border-2 border-gray-100 h-48 w-full"><img src={q.imgUrl} alt="Stimolo" className="w-full h-full object-cover" /></div>}
                            <h2 className="text-2xl font-black text-gray-800">{q.text}</h2>
                        </div>
                    ))}
                </div>
             )}
          </div>
      )}

      {viewMode === 'responses' && (
          <div className="flex-1 min-h-[62vh] md:min-h-[560px] bg-amber-50/70 rounded-3xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 flex flex-col relative animate-in slide-in-from-right duration-300 group">
            {sessionData.type === 'qa' && (() => {
                const visibleResponses = sessionData.responses.filter(r => r.status === 'visible' || (!r.status && r.visible !== false));
                return (
                  <>
                    {visibleResponses.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-4 select-none my-auto">
                            <div className="w-20 h-20 rounded-2xl bg-yellow-200 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-3xl mb-5">
                                📝
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
                                In attesa delle risposte...
                            </h3>
                            <p className="mt-2 text-sm md:text-base font-bold text-gray-600 max-w-md">
                                Gli studenti possono inviare le risposte dal proprio dispositivo, oppure puoi registrarle direttamente a voce qui sotto.
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsManualQAOpen(true)}
                                className="mt-6 px-6 py-3.5 bg-yellow-300 hover:bg-yellow-400 text-black font-black text-sm md:text-base rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2.5 cursor-pointer"
                                title="Aggiungi manualmente una risposta raccolta a voce dallo studente (Ctrl+M)"
                            >
                                <Plus size={20} className="stroke-[3]" />
                                <span>Aggiungi risposta a voce</span>
                                <span className="hidden sm:inline-block text-[11px] bg-black text-yellow-300 px-2 py-0.5 rounded font-mono font-black ml-1">
                                    Ctrl+M
                                </span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col flex-1">
                            <div className={`grid ${QA_FONT_SIZES[qaFontSize]?.grid || QA_FONT_SIZES.md.grid} gap-4`}>
                                {sessionData.responses.slice().reverse().map((res, idx) => {
                                    const isVisible = res.status === 'visible' || (!res.status && res.visible !== false);
                                    if (!isVisible) return null;
                                    const noteKey = res.timestamp ? `${res.timestamp}_${idx}` : `note_${idx}`;
                                    const isCollapsed = showNames && isNoteCollapsed(noteKey);
                                    const fontCfg = QA_FONT_SIZES[qaFontSize] || QA_FONT_SIZES.md;
                                    const authorName = showNames && res.studentName && res.studentName.trim()
                                      ? res.studentName.trim()
                                      : (showNames ? 'Anonimo' : '');

                                    if (isCollapsed) {
                                      return (
                                        <div
                                          key={noteKey}
                                          onClick={() => toggleNoteCollapse(noteKey)}
                                          className={`bg-white rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:-translate-y-0.5 transition-all flex items-center justify-between ${fontCfg.collapsedPad}`}
                                          title="Clicca per espandere e leggere il contenuto"
                                        >
                                          <div className="flex items-center gap-2 min-w-0 pr-2">
                                            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                              👤
                                            </span>
                                            <span className="font-black text-gray-900 truncate text-sm">
                                              {authorName}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-1 text-gray-600 hover:text-black flex-shrink-0">
                                            <ChevronDown size={16} />
                                          </div>
                                        </div>
                                      );
                                    }

                                    return (
                                        <div 
                                          key={noteKey} 
                                          className={`bg-white rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex flex-col justify-between ${fontCfg.cardPad}`}
                                        >
                                            <div>
                                              {/* In modalità senza nomi (Aula Anonima), NESSUN TITOLO né 'Risposta #' */}
                                              {showNames && (
                                                <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-gray-100">
                                                  <div className="flex items-center gap-2 min-w-0">
                                                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                                      👤
                                                    </span>
                                                    <span className={`font-black text-black uppercase tracking-wider truncate ${fontCfg.headerSize}`}>
                                                      {authorName}
                                                    </span>
                                                    {res.studentName && (
                                                      <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300 px-1.5 py-0.2 rounded-md">
                                                        Studente
                                                      </span>
                                                    )}
                                                  </div>
                                                  <button
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      toggleNoteCollapse(noteKey);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors ml-2 flex-shrink-0"
                                                    title="Collassa (mostra solo nome)"
                                                  >
                                                    <ChevronUp size={16} />
                                                  </button>
                                                </div>
                                              )}

                                              {/* Contenuto del post-it */}
                                              {Array.isArray(res.text) ? (
                                                <div>
                                                  {/* In primo piano le risposte; domande opzionali */}
                                                  {res.text.map((qaItem, qaIdx) => {
                                                    const nlPos = qaItem.indexOf('\n');
                                                    const answerPart = nlPos >= 0 ? qaItem.substring(nlPos + 1) : qaItem;
                                                    return (
                                                      <div key={qaIdx}>
                                                        {qaIdx > 0 && <hr style={{ margin: '10px 0', borderColor: '#e5e7eb' }} />}
                                                        <p className={`font-bold text-gray-900 whitespace-pre-wrap ${fontCfg.textSize}`}>{answerPart}</p>
                                                      </div>
                                                    );
                                                  })}
                                                  {res.text.some((qaItem) => qaItem.indexOf('\n') >= 0) && (
                                                    <details style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #d1d5db' }}>
                                                      <summary className={`text-gray-500 cursor-pointer font-bold ${fontCfg.detailsText}`}>Mostra domande</summary>
                                                      <div style={{ marginTop: '6px' }}>
                                                        {res.text.map((qaItem, qaIdx) => {
                                                          const nlPos = qaItem.indexOf('\n');
                                                          const questionPart = nlPos >= 0 ? qaItem.substring(0, nlPos).replace(/:$/, '') : '';
                                                          return questionPart ? (
                                                            <p key={qaIdx} className={`text-gray-600 italic ${fontCfg.detailsText}`} style={{ marginBottom: '3px' }}>• {questionPart}</p>
                                                          ) : null;
                                                        })}
                                                      </div>
                                                    </details>
                                                  )}
                                                </div>
                                              ) : (
                                                <p className={`font-bold text-gray-900 whitespace-pre-wrap ${fontCfg.textSize}`}>{res.text}</p>
                                              )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pulsante aggiunta manuale QA in calce quando ci sono risposte */}
                            <div className="mt-8 flex justify-end">
                                <button 
                                    type="button"
                                    onClick={() => setIsManualQAOpen(true)} 
                                    className="px-4 py-3 bg-yellow-300 hover:bg-yellow-400 text-black font-black text-sm rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
                                    title="Aggiungi manualmente una risposta raccolta a voce dallo studente (Ctrl+M)"
                                >
                                    <Plus size={18} className="stroke-[3]"/>
                                    <span>Aggiungi a Voce</span>
                                    <span className="hidden sm:inline-block text-[10px] bg-black text-yellow-300 px-1.5 py-0.5 rounded font-mono font-black">Ctrl+M</span>
                                </button>
                            </div>
                        </div>
                    )}

                    <ManualQAModal 
                        isOpen={isManualQAOpen} 
                        onClose={() => setIsManualQAOpen(false)} 
                        onSubmit={handleManualQASubmit}
                        questions={sessionData.questions}
                    />
                  </>
                );
            })()}
            {sessionData.type === 'wordcloud' && <FloatingWordCloud responses={sessionData.responses} onManualAdd={handleManualAddWord} />}
            {sessionData.type === 'poll' && <PollChart responses={sessionData.responses} options={sessionData.options} onManualVote={handleManualPollVote} />}
          </div>
      )}
    </div>
  );
};

const FeedbackStudentView = ({ sessionCode, onExit, user, initialStudentName = "" }) => {
    const [text, setText] = useState("");
    const [answers, setAnswers] = useState({}); // Per QA Multiplo
    const [selectedOptions, setSelectedOptions] = useState([]); // Array per multi-select
    const [status, setStatus] = useState("loading");
    const [sessionData, setSessionData] = useState(null);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);
    // Su Chromebook scolastici condivisi, il nome è solo in memoria per la sessione corrente
    const [studentName, setStudentName] = useState(() => (initialStudentName && initialStudentName.trim()) ? initialStudentName.trim() : "");

    useEffect(() => {
        if (!db || !user) return;
        
        // CONTROLLO RISPOSTA GIÀ INVIATA
        if (localStorage.getItem(`submitted_${sessionCode}`)) {
            setAlreadySubmitted(true);
        }

        const sessionRef = doc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'feedback_sessions'), sessionCode);
        const unsubscribe = onSnapshot(sessionRef, (snap) => {
            if (!snap.exists()) { setStatus("not_found"); } 
            else { 
                const data = snap.data();
                setSessionData(data);
                setStatus(data.active ? "active" : "closed");
            }
        });
        return () => unsubscribe();
    }, [sessionCode, user]);

    const handleOptionToggle = (opt) => {
        if (sessionData.allowMultiple) {
            if (selectedOptions.includes(opt)) {
                setSelectedOptions(selectedOptions.filter(o => o !== opt));
            } else {
                setSelectedOptions([...selectedOptions, opt]);
            }
        } else {
            setSelectedOptions([opt]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!studentName || studentName.trim().length < 2) {
            alert("Devi inserire il tuo nome e cognome per inviare la risposta.");
            return;
        }

        // Se non sono ammesse risposte multiple e ha già inviato
        if (!sessionData.allowMultipleResponses && alreadySubmitted) return;

        let payload;
        if (sessionData.type === 'poll') {
            payload = selectedOptions; 
        } else if (sessionData.type === 'qa' && sessionData.questions?.length > 0) {
            // MULTI-QUESTION SUBMIT (Salva come array, ora supportato dalla dashboard)
            payload = sessionData.questions.map(q => {
                const ans = answers[q.id];
                if (!ans) return null;
                return `${q.text.toUpperCase()}:\n${ans}`;
            }).filter(Boolean);
            
            if (!payload || payload.length === 0) return; 
        } else {
            payload = text; 
        }

        if (!payload || (typeof payload === 'string' && !payload.trim()) || (Array.isArray(payload) && payload.length === 0)) return;
        
        setSending(true);

        if (status !== 'active') { alert("Sessione chiusa."); setSending(false); return; }

        try {
            const sessionRef = doc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'feedback_sessions'), sessionCode);
            
            // STATUS INIZIALE
            const initialStatus = sessionData.moderationEnabled ? 'pending' : 'visible';
            
            await updateDoc(sessionRef, { 
                responses: arrayUnion({ 
                    text: payload, 
                    studentName: studentName.trim() || 'Anonimo',
                    timestamp: new Date().toISOString(), 
                    status: initialStatus,
                    visible: initialStatus === 'visible' 
                }) 
            });
            
            // Segna come inviato in locale
            localStorage.setItem(`submitted_${sessionCode}`, 'true');
            if(!sessionData.allowMultipleResponses) setAlreadySubmitted(true);
            
            setSent(true);
            setText("");
            setAnswers({});
            setSelectedOptions([]);
            
            // Se sono permesse risposte multiple, resetta la vista invio dopo 3s
            if(sessionData.allowMultipleResponses) setTimeout(() => { setSent(false); }, 3000); 
        } catch (err) { console.error(err); alert("Errore."); }
        setSending(false);
    };

    // --- SE LO STUDENTE NON HA ANCORA INSERITO IL NOME (ES. ACCESSO DA QR/LINK DIRETTO) ---
    if (!studentName || studentName.trim().length < 2) {
        return (
            <div className="min-h-screen bg-yellow-50 flex flex-col justify-center items-center p-6">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border-4 border-black p-8 text-center animate-in fade-in zoom-in">
                    <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-4 border-2 border-blue-200">
                        <span style={{ fontSize: '28px' }}>👤</span>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                        Sessione {sessionCode}
                    </span>
                    <h2 className="text-2xl font-black text-gray-900 mt-3 mb-2">Come ti chiami?</h2>
                    <p className="text-gray-500 text-xs font-bold mb-6">
                        Inserisci il tuo nome e cognome prima di rispondere. Il docente potrà scegliere se visualizzarlo o tenerlo anonimo alla lavagna.
                    </p>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const inputVal = e.target.elements.nameInput.value.trim();
                        if (inputVal.length >= 2) {
                            setStudentName(inputVal);
                        }
                    }}>
                        <input
                            name="nameInput"
                            type="text"
                            required
                            autoFocus
                            placeholder="Il tuo nome e cognome..."
                            className="w-full text-center text-lg font-bold p-3.5 border-2 border-gray-300 focus:border-black rounded-xl outline-none mb-4 bg-gray-50"
                            maxLength={35}
                        />
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-3.5 rounded-xl font-black text-base hover:scale-105 transition-transform shadow-md"
                        >
                            CONTINUA
                        </button>
                    </form>
                    <button onClick={onExit} className="mt-4 text-xs font-bold text-gray-400 hover:text-black uppercase tracking-wider">
                        Esci
                    </button>
                </div>
            </div>
        );
    }

    // --- SCHERMATA DI CARICAMENTO STILIZZATA ---
    if (status === "loading") {
        return (
            <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-6">
                <div className="p-8 text-center">
                    <Loader2 className="animate-spin mx-auto w-12 h-12 text-yellow-600 mb-4"/>
                    <p className="font-bold text-gray-500">Connessione in corso...</p>
                </div>
            </div>
        );
    }

    if (status === "not_found") return <div className="p-8 text-center text-red-500 font-bold min-h-screen flex items-center justify-center bg-yellow-50">Sessione non trovata.</div>;
    
    // BLOCCO SE GIÀ INVIATO E NO MULTIPLI
    if (alreadySubmitted && sessionData && !sessionData.allowMultipleResponses) {
        return (
            <div className="max-w-md mx-auto p-6 min-h-screen flex flex-col justify-center text-center bg-yellow-50">
                <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-black">
                     <CheckCircle size={64} className="text-green-500 mx-auto mb-4"/>
                     <h2 className="text-2xl font-black mb-2">Risposta Inviata!</h2>
                     <p className="text-gray-500 mb-6">Hai già partecipato a questa attività.</p>
                     <button onClick={onExit} className="w-full bg-gray-100 py-3 rounded-xl font-bold">Esci</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-yellow-50 flex flex-col justify-center p-6">
            <div className="max-w-md mx-auto w-full bg-white rounded-3xl shadow-xl border-4 border-black p-6">
                <div className="text-center mb-6">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Sessione {sessionCode}</span>
                    <h1 className="text-2xl font-black mt-2">
                        {sessionData.type === 'poll' ? "Sondaggio" : sessionData.type === 'wordcloud' ? "Brainstorming" : "Rispondi"}
                    </h1>
                    {status === 'closed' ? (
                        <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-xl font-bold flex items-center justify-center gap-2">
                            <Lock size={18}/> Sessione Terminata
                        </div>
                    ) : (
                        <p className="text-gray-600 text-sm mt-2">
                            La tua risposta sarà visualizzata alla lavagna.
                        </p>
                    )}
                </div>

                {/* RIEPILOGO NOME STUDENTE REGISTRATO */}
                <div className="mb-5 bg-blue-50/80 p-3 rounded-2xl border-2 border-blue-200 flex items-center justify-between text-left">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-base">👤</span>
                        <div className="min-w-0">
                            <span className="block text-[10px] font-black uppercase text-blue-700 tracking-wider">Partecipi come:</span>
                            <span className="font-black text-sm text-gray-900 truncate block">{studentName}</span>
                        </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => {
                        const newName = prompt("Modifica il tuo nome:", studentName);
                        if (newName && newName.trim().length >= 2) {
                            setStudentName(newName.trim());
                        }
                      }}
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 underline ml-2"
                    >
                        Cambia
                    </button>
                </div>

                {sent ? (
                    <div className="bg-green-50 text-green-600 p-8 rounded-2xl text-center animate-in zoom-in">
                        <Check size={48} className="mx-auto mb-2"/>
                        <h3 className="font-bold text-xl">Inviato!</h3>
                        {sessionData.moderationEnabled && <p className="text-xs mt-2 text-green-800 bg-green-100 py-1 px-2 rounded-full inline-block">In attesa di approvazione</p>}
                        {sessionData.allowMultipleResponses && <button onClick={() => setSent(false)} className="mt-4 text-sm underline block mx-auto">Invia altro</button>}
                    </div>
                ) : (
                    status === 'active' && (
                        <form onSubmit={handleSubmit}>
                            {/* RENDER SONDAGGIO */}
                            {sessionData.type === 'poll' && (
                                <div className="space-y-3 mb-6">
                                    <h3 className="font-bold text-lg text-center mb-4">{sessionData.question}</h3>
                                    {sessionData.options.map(opt => {
                                        const isSelected = selectedOptions.includes(opt);
                                        return (
                                            <button key={opt} type="button" onClick={() => handleOptionToggle(opt)} className={`w-full p-4 rounded-xl border-2 font-bold transition-all flex items-center justify-between ${isSelected ? 'bg-blue-600 text-white border-blue-700 shadow-sm' : 'bg-white border-gray-200 text-black hover:bg-gray-50'}`}>
                                                {opt}
                                                {sessionData.allowMultiple && isSelected && <CheckSquare size={20}/>}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* RENDER QA MULTIPLO (Solo se ci sono domande esplicite) */}
                            {sessionData.type === 'qa' && sessionData.questions && sessionData.questions.length > 0 && (
                                <div className="space-y-6 mb-6">
                                    {sessionData.questions.map(q => (
                                        <div key={q.id}>
                                            <label className="block font-bold text-gray-800 mb-2">{q.text}</label>
                                            <textarea 
                                                value={answers[q.id] || ""}
                                                onChange={e => setAnswers({...answers, [q.id]: e.target.value})}
                                                placeholder="La tua risposta..."
                                                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none min-h-[100px] text-lg"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {/* RENDER TEXTAREA SEMPLICE (Solo per QA Semplice o Wordcloud) */}
                            {((sessionData.type === 'qa' && (!sessionData.questions || sessionData.questions.length === 0)) || sessionData.type === 'wordcloud') && (
                                <textarea value={text} onChange={e => setText(e.target.value)} placeholder={sessionData.type === 'wordcloud' ? "Scrivi una parola..." : "Scrivi il tuo pensiero..."} className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none min-h-[150px] text-lg mb-4" />
                            )}
                            
                            <button type="submit" disabled={sending} className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                {sending ? <Loader2 className="animate-spin"/> : "INVIA"}
                            </button>
                        </form>
                    )
                )}
                <button onClick={onExit} className="w-full mt-4 text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-black">Esci dalla sessione</button>
            </div>
        </div>
    );
};

// --- STANDARD ACTIVITY VIEW ---
const StandardActivityView = ({ view, currentScenario, generateScenario, theme, data, onFullUpdate, onOpenManager }) => (
  <main className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
    <h2 className={`text-center text-3xl font-black uppercase tracking-tight mb-6 ${theme.accent} drop-shadow-sm`}>
      {view === 'emotions' && 'Gestione Emozioni'}
      {view === 'emotion_narratives' && 'Narrazione Emotiva'}
      {view === 'affectivity_sexuality' && 'Affettività e Sessualità'}
      {view === 'effective_communication' && 'Comunicazione Efficace'}
      {view === 'decisions_cold' && 'Decisioni a Freddo'}
      {view === 'decisions_hot' && 'Decisioni a Caldo'}
    </h2>

    {CATEGORIES.includes(view) && data && (() => {
      const catData = ensureCategorySets(view, data);
      const totalAll = getAllItemsForCategory(catData.sets).length;
      return (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-3.5 px-5 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-gray-700 tracking-wider">Set Attivo:</span>
            <select
              value={catData.activeSetId}
              onChange={(e) => {
                const updated = setActiveCategorySet(view, data, e.target.value);
                onFullUpdate(updated);
              }}
              className="bg-yellow-50 border-2 border-black rounded-xl px-3 py-1.5 font-black text-sm text-black outline-none hover:bg-yellow-100 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <option value="all">⭐ Tutti gli stimoli ({totalAll} stimoli)</option>
              {catData.sets.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.items?.length || 0} stimoli)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onOpenManager}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black bg-white hover:bg-yellow-300 px-3.5 py-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            title="Gestisci i set e gli stimoli"
          >
            <Settings size={14} /> Gestisci Set &amp; Stimoli
          </button>
        </div>
      );
    })()}

    <div className="flex-1 flex flex-col relative">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden transition-all">
        {!currentScenario ? (
           <div className="flex flex-col items-center z-10 animate-fade-in">
              <div className={`w-32 h-32 ${theme.light} rounded-full flex items-center justify-center mb-6 animate-pulse border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}><RotateCcw size={48} className={theme.accent} /></div>
              <h3 className="text-2xl font-black text-gray-400 uppercase mb-6">Nessun elemento attivo</h3>
              <button onClick={generateScenario} className={`px-10 py-5 rounded-2xl text-white font-black text-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-3 border-black ${theme.button}`}>ESTRAI {view === 'emotion_narratives' ? 'EMOZIONE' : 'SCENARIO'}</button>
           </div>
        ) : (
          <div className="w-full flex flex-col h-full animate-fade-in z-10">
            <div className="flex justify-end items-start mb-6 gap-2">
               <button onClick={generateScenario} className={`p-3 rounded-xl text-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:translate-x-0.5 active:translate-y-0.5 transition-all ${theme.button}`} title="Prossimo elemento"><RotateCcw size={20} /></button>
               <FullscreenButton className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-xl"/>
            </div>
            <div className="flex-1 flex items-center justify-center py-4">
              <h3 className={`text-4xl md:text-6xl font-black text-gray-800 leading-tight text-center ${view === 'emotion_narratives' ? 'uppercase tracking-tighter' : ''}`}>{currentScenario.text}</h3>
            </div>
            {view !== 'affectivity_sexuality' && (
              <div className={`mt-8 p-6 rounded-2xl ${theme.light} bg-opacity-70 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                <h4 className={`text-xs font-black uppercase tracking-widest mb-3 ${theme.accent} flex items-center gap-2`}><Brain size={14} /> {view === 'emotion_narratives' ? 'Spunti per il racconto' : 'Spunti per la discussione'}</h4>
                <ul className="grid md:grid-cols-3 gap-4 text-gray-900 font-black text-sm">
                  {view === 'emotions' && (<>
                      <li className="bg-white p-3.5 rounded-xl text-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Che emozione provi?</li>
                      <li className="bg-white p-3.5 rounded-xl text-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Dove la senti nel corpo?</li>
                      <li className="bg-white p-3.5 rounded-xl text-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Intensità (1-10)?</li>
                  </>)}
                  {view === 'emotion_narratives' && (<>
                      <li className="bg-white p-3.5 rounded-xl text-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Quando è successo?</li>
                      <li className="bg-white p-3.5 rounded-xl text-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Cosa l'ha innescata?</li>
                      <li className="bg-white p-3.5 rounded-xl text-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Come hai reagito?</li>
                  </>)}
                  {view === 'effective_communication' && (<>
                      <li className="bg-white p-3.5 rounded-xl text-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Che stile è? (Passivo, Aggressivo, Assertivo)</li>
                      <li className="bg-white p-3.5 rounded-xl text-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Come si sente chi parla e chi ascolta?</li>
                      <li className="bg-white p-3.5 rounded-xl text-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Come riformularlo in modo assertivo?</li>
                  </>)}
                  {(view === 'decisions_cold' || view === 'decisions_hot') && (<>
                      <li className="bg-white p-3.5 rounded-xl text-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Cosa fai subito?</li>
                      <li className="bg-white p-3.5 rounded-xl text-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Conseguenze?</li>
                      <li className="bg-white p-3.5 rounded-xl text-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Alternative?</li>
                  </>)}
                </ul>
              </div>
            )}
          </div>
        )}
        <div className={`absolute top-0 right-0 w-64 h-64 ${theme.light} rounded-bl-[100%] opacity-30 pointer-events-none`} />
        <div className={`absolute bottom-0 left-0 w-40 h-40 ${theme.light} rounded-tr-[100%] opacity-30 pointer-events-none`} />
      </div>
    </div>
  </main>
);

const HistoryDrawer = ({ isOpen, onClose, history, theme }) => {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out border-2 border-black ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black uppercase flex items-center gap-2"><History className="text-gray-400" /> Cronologia</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            {history.length === 0 ? (
              <div className="text-center text-gray-400 mt-20"><Clock size={48} className="mx-auto mb-4 opacity-50" /><p>Nessuno scenario generato.</p></div>
            ) : (
              <div className="space-y-4">
                {history.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="p-4 bg-gray-50 rounded-xl border-2 border-transparent hover:border-gray-200 transition-colors">
                     <div className="flex justify-between items-center mb-2">
                       <span className={`text-[10px] font-black uppercase px-2 rounded-full ${theme.light} ${theme.accent}`}>#{history.length - idx}</span>
                       <span className="text-[10px] text-gray-400">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{item.text}</p>
                    <div className="mt-2 flex gap-1 flex-wrap">
                      {item.tags?.map(t => <span key={t} className="text-[10px] bg-white border border-gray-200 px-1 rounded text-gray-500 uppercase">{t}</span>)}
                      {item.coordinates && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded font-bold flex items-center gap-1"><MapPin size={10}/> Mappato</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default function App() {
  const [view, setView] = useState('dashboard');
  const [data, setData] = useState(null); 
  const [user, setUser] = useState(null);
  
  // Stati per le attività standard
  const [currentScenario, setCurrentScenario] = useState(null);
  const [history, setHistory] = useState([]);
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMappingMode, setIsMappingMode] = useState(false);

  // Stato per la modalità Studente (Join) e Moderatore (Mod)
  const [studentSessionCode, setStudentSessionCode] = useState(null);
  const [moderatorSessionCode, setModeratorSessionCode] = useState(null);
  const [studentEnteredName, setStudentEnteredName] = useState("");

  // Stato sicurezza e autenticazione docente
  const [isTeacherPinModalOpen, setIsTeacherPinModalOpen] = useState(false);
  const [teacherAuth, setTeacherAuth] = useState(() => isTeacherAuthenticated());

  const [isStudentEntry, setIsStudentEntry] = useState(() => !isTeacherAuthenticated());

  // Ricalcola autenticazione quando arrivano i dati aggiornati da Firebase
  useEffect(() => {
    const isAuth = isTeacherAuthenticated(data);
    setTeacherAuth(isAuth);
    if (!isAuth && !studentSessionCode && !moderatorSessionCode) {
      setIsStudentEntry(true);
    }
  }, [data]);

  // Modali globali
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isP2POpen, setIsP2POpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // --- SYNC ENGINE ---
  useEffect(() => {
    // URL Params check
    const params = new URLSearchParams(window.location.search);
    const sessionParam = params.get('session');
    const modeParam = params.get('mode');

    // Auto-ricezione configurazione Firebase da link condiviso (?fb=...)
    const fbParam = params.get('fb');
    if (fbParam) {
      const decoded = decodeFBConfig(fbParam);
      if (decoded && (!FIREBASE_CONFIG || !FIREBASE_CONFIG.apiKey)) {
        saveFBConfig(decoded);
      }
    }

    // ?ns= trasporta il namespace nel link di condivisione
    const nsParam = params.get('ns');
    if (nsParam) {
      try {
        APP_ID = decodeURIComponent(escape(atob(nsParam)));
      } catch {}
    }

    if (sessionParam) {
        if(modeParam === 'moderator') {
            setModeratorSessionCode(sessionParam);
        } else {
            setStudentSessionCode(sessionParam);
        }
        setIsStudentEntry(false);
    } else if (params.get('teacher') === '1' && isTeacherAuthenticated()) {
        setIsStudentEntry(false);
    } else if (!isTeacherAuthenticated()) {
        setIsStudentEntry(true);
    }

    const initApp = async () => {
      // Carica la cache delle immagini personalizzate da IndexedDB all'avvio
      loadAllCustomImages().catch(() => {});

      if (db) {
        try {
           if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
             await signInWithCustomToken(auth, __initial_auth_token);
           } else {
             throw new Error('No token');
           }
        } catch {
           await signInAnonymously(auth);
        }
        onAuthStateChanged(auth, setUser);
      } else {
        // Se Firebase non è collegato, tenta di caricare il backup locale sicuro
        try {
          const savedBackup = localStorage.getItem('lss_main_db_backup');
          if (savedBackup) {
            const parsed = JSON.parse(savedBackup);
            if (parsed && typeof parsed === 'object') {
              setData(hydrateVisualMetaphors(parsed));
              return;
            }
          }
        } catch {}
        setData(INITIAL_DB_DATA); 
      }
    };
    initApp();
  }, []);

  useEffect(() => {
    if (!db || !user || studentSessionCode || moderatorSessionCode) return; 
    const docRef = doc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'lifeskills'), 'main_db');
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const snapData = snap.data();
        // Idrata visual_metaphors ripristinando le immagini salvate in IndexedDB/memoria
        if (snapData && snapData.visual_metaphors) {
          snapData.visual_metaphors = hydrateVisualMetaphors(snapData.visual_metaphors);
        }
        setData(snapData);
        // Se c'è un PIN impostato su Firebase e questo dispositivo non è autorizzato, proteggi la Dashboard
        if (isPinProtectionEnabled(snapData) && !isTeacherAuthenticated(snapData)) {
          setIsStudentEntry(true);
        }
      } else { 
        setDoc(docRef, INITIAL_DB_DATA); 
        setData(INITIAL_DB_DATA); 
      }
    }, (err) => {
      console.warn("Snapshot listener warning:", err);
      // NON resettare i dati se la connessione o il payload ha avuto un errore temporaneo
    });
    return () => unsubscribe();
  }, [user, studentSessionCode, moderatorSessionCode]);

  // --- MODES RENDER ---
  if (isStudentEntry) {
      return (
        <>
          <StudentEntryView 
            onJoin={(code, name) => { 
              setStudentSessionCode(code); 
              if (name) setStudentEnteredName(name);
              setIsStudentEntry(false); 
            }} 
            onTeacherUnlock={() => {
              if (teacherAuth || isTeacherAuthenticated(data)) {
                setIsStudentEntry(false);
              } else {
                setIsTeacherPinModalOpen(true);
              }
            }}
            canUnlock={true}
          />
          <TeacherPinModal 
            isOpen={isTeacherPinModalOpen} 
            onClose={() => setIsTeacherPinModalOpen(false)}
            onSuccess={() => {
              setTeacherAuth(true);
              setIsStudentEntry(false);
            }}
            dbData={data}
          />
        </>
      );
  }

  if (studentSessionCode) {
      return (
        <FeedbackStudentView 
          sessionCode={studentSessionCode} 
          initialStudentName={studentEnteredName}
          onExit={() => { 
            setStudentSessionCode(null); 
            setStudentEnteredName(""); // Svuota il nome per il prossimo studente su questo Chromebook
            window.history.replaceState({}, document.title, window.location.pathname);
            if (!isTeacherAuthenticated(data)) {
              setIsStudentEntry(true);
            }
          }} 
          user={user} 
        />
      );
  }
  
  if (moderatorSessionCode) {
      return <FeedbackModeratorView sessionCode={moderatorSessionCode} user={user} />;
  }

  // --- STANDARD ACTIONS ---
  const handleUpdateData = async (newData) => {
    // 1. Idrata prima lo stato locale con le immagini complete
    const hydratedData = {
      ...newData,
      visual_metaphors: hydrateVisualMetaphors(newData.visual_metaphors)
    };
    setData(hydratedData);

    // 2. Salva copia di sicurezza locale
    try {
      const safeLocal = sanitizeDataForFirestore(hydratedData);
      localStorage.setItem('lss_main_db_backup', JSON.stringify(safeLocal));
    } catch (e) {
      console.warn('Backup locale non riuscito:', e);
    }

    // 3. Salva su Firestore sanitizzando per non superare il limite di 1MB
    if (db && user) {
      try {
        const firestoreData = sanitizeDataForFirestore(hydratedData);
        const docRef = doc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'lifeskills'), 'main_db');
        await setDoc(docRef, firestoreData);
      } catch (err) {
        console.error('Errore durante salvataggio su Firestore:', err);
      }
    }
  };

  const handleFullUpdate = (newFullData) => handleUpdateData(newFullData);
  const handleViewChange = (newView) => { setView(newView); setCurrentScenario(null); setHistory([]); setIsHistoryOpen(false); };
  
  const getTheme = () => {
    switch(view) {
      case 'emotions': return { bg: 'bg-[#FFF0F5]', accent: 'text-pink-500', border: 'border-pink-500', button: 'bg-pink-500 hover:bg-pink-400 border-pink-700', light: 'bg-pink-100', cardBorder: 'border-pink-200' };
      case 'decisions_cold': return { bg: 'bg-[#F0F8FF]', accent: 'text-blue-600', border: 'border-blue-500', button: 'bg-blue-500 hover:bg-blue-400 border-blue-700', light: 'bg-blue-100', cardBorder: 'border-blue-200' };
      case 'decisions_hot': return { bg: 'bg-[#FFF5EE]', accent: 'text-orange-600', border: 'border-orange-500', button: 'bg-orange-500 hover:bg-orange-400 border-orange-700', light: 'bg-orange-100', cardBorder: 'border-orange-200' };
      case 'emotion_narratives': return { bg: 'bg-[#F3E8FF]', accent: 'text-purple-600', border: 'border-purple-500', button: 'bg-purple-500 hover:bg-purple-400 border-purple-700', light: 'bg-purple-100', cardBorder: 'border-purple-200' };
      case 'affectivity_sexuality': return { bg: 'bg-[#FFE4E6]', accent: 'text-rose-600', border: 'border-rose-500', button: 'bg-rose-500 hover:bg-rose-400 border-rose-700', light: 'bg-rose-100', cardBorder: 'border-rose-200' };
      case 'effective_communication': return { bg: 'bg-[#F0FDF9]', accent: 'text-teal-600', border: 'border-teal-500', button: 'bg-teal-600 hover:bg-teal-500 border-teal-800', light: 'bg-teal-100', cardBorder: 'border-teal-200' };
      default: return { bg: 'bg-gray-50' };
    }
  };

  const handleUpdatePolls = (newPolls) => {
    handleUpdateData({...data, poll_sets: newPolls});
  };

  const handleUpdateSets = (newSets) => {
    handleUpdateData({...data, feedback_sets: newSets});
  };

  const generateScenario = () => {
    const list = CATEGORIES.includes(view)
      ? getActiveItemsForCategory(view, data)
      : data[view];
    if (!list || list.length === 0) return alert("Nessuno stimolo disponibile in questo set.");
    const activeItems = list.filter(item => !item.hidden);
    if (activeItems.length === 0) return alert("Tutti gli stimoli di questo set sono nascosti.");
    const shownIds = new Set(history.map(h => h.id));
    const available = activeItems.filter(item => !shownIds.has(item.id));
    let selected = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : activeItems[Math.floor(Math.random() * activeItems.length)];
    setCurrentScenario(selected);
    setHistory(prev => [selected, ...prev]);
  };

  const handleSelectEmotion = (text) => {
    const list = CATEGORIES.includes(view)
      ? getActiveItemsForCategory(view, data)
      : data[view];
    const selected = (list || []).find(s => s.text === text);
    if (selected) { setCurrentScenario(selected); setHistory(prev => [selected, ...prev]); }
  };

  const handleMapCoordinate = (coords) => {
    if (!currentScenario) return;
    const updated = { ...currentScenario, coordinates: coords };
    setCurrentScenario(updated);
    const newList = data[view].map(s => s.id === currentScenario.id ? updated : s);
    handleUpdateData({ ...data, [view]: newList });
  };

  if (!data && !studentSessionCode) return <div className="min-h-screen flex items-center justify-center bg-yellow-50"><Loader2 className="animate-spin text-orange-500"/></div>;

  if (view === 'emotion_thermometer') {
    return (
      <EmotionThermometer
        data={data.emotion_thermometer || INITIAL_DB_DATA.emotion_thermometer}
        onUpdate={(next) => handleUpdateData({ ...data, emotion_thermometer: next })}
        onClose={() => setView('dashboard')}
      />
    );
  }

  if (view === 'visual_metaphors') {
    return (
      <VisualMetaphorsView
        data={data}
        onUpdateData={handleUpdateData}
        onBack={() => setView('dashboard')}
        db={db}
        user={user}
        appId={APP_ID}
      />
    );
  }

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-yellow-50 p-4 sm:p-6 font-sans selection:bg-yellow-200 flex flex-col">
        
        {/* BARRA SUPERIORE DI SISTEMA & CATTEDRA (SEPARATA DALL'HERO TITLE) */}
        <nav className="max-w-7xl mx-auto w-full mb-4 sm:mb-8 flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* LATO SINISTRO: STATO CLOUD & ACCESSO RAPIDO STUDENTI */}
          <div className="flex items-center gap-2.5">
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border-2 border-black/15 text-xs font-black text-gray-800 shadow-sm">
                {db ? <Cloud size={15} className="text-emerald-600"/> : <Save size={15} className="text-amber-600"/>} 
                <span>{db ? "Cloud Attivo" : "Locale"}</span>
             </div>

             <button 
               onClick={() => { setIsStudentEntry(true); }} 
               className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-900 bg-blue-100 hover:bg-blue-200 border-2 border-black px-3.5 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:scale-95 transition-all"
               title="Passa alla schermata di ingresso studenti con codice stanza"
             >
                <LogIn size={15} className="text-blue-700"/>
                <span>💻 Ingresso Studenti</span>
             </button>
          </div>

          {/* LATO DESTRO: STRUMENTI DOCENTE & UTILITY */}
          <div className="flex items-center gap-2 flex-wrap">
             {/* 1. TASTO GUIDA DOCENTE (Evidente e accogliente) */}
             <button 
               onClick={() => setIsGuideOpen(true)}
               className="px-3.5 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 border-2 border-black font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:scale-95 transition-all"
               title="Istruzioni complete e pratiche per tutte le funzioni"
               aria-label="Apri guida per il docente"
             >
               <BookOpen size={14} className="text-blue-700"/>
               <span>Guida Docente</span>
             </button>

             {/* 2. TASTO IMPOSTAZIONI */}
             <button 
               onClick={() => setIsSettingsOpen(true)} 
               className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-800 border-2 border-black font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:scale-95 transition-all" 
               title="Impostazioni generali e sicurezza PIN"
               aria-label="Impostazioni"
             >
               <Settings size={14}/>
               <span className="hidden sm:inline">Impostazioni</span>
             </button>

             {/* 3. TASTO BLOCCA CATTEDRA (Se PIN attivo) */}
             {isPinProtectionEnabled(data) && (
               <button 
                 onClick={() => {
                   logoutTeacher();
                   setTeacherAuth(false);
                   setIsStudentEntry(true);
                 }} 
                 className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-black rounded-xl font-black text-xs flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:scale-95 transition-all" 
                 title="Blocca sessione docente (richiederà il PIN per riaccedere)"
                 aria-label="Blocca sessione docente"
               >
                 <Lock size={13}/>
                 <span className="hidden md:inline">Blocca</span>
               </button>
             )}

             {/* 4. CLUSTER UTILITY: P2P, BACKUP, FULLSCREEN */}
             <div className="flex items-center gap-1 bg-white p-1 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
               <button 
                 onClick={() => setIsP2POpen(true)} 
                 className="p-1.5 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors" 
                 title="Sincronizzazione P2P locale"
                 aria-label="Sincronizzazione P2P"
               >
                 <Smartphone size={15}/>
               </button>

               <button 
                 onClick={() => {
                   const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
                   const el = document.createElement('a');
                   el.setAttribute("href", dataStr);
                   el.setAttribute("download", `lifeskills_FULL_BACKUP_${new Date().toISOString().slice(0,10)}.json`);
                   document.body.appendChild(el); el.click(); el.remove();
                 }} 
                 className="p-1.5 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors" 
                 title="Scarica Backup Completo JSON"
                 aria-label="Scarica backup completo"
               >
                 <Download size={15}/>
               </button>
               
               <label 
                 className="p-1.5 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors cursor-pointer" 
                 title="Ripristina Backup da file JSON"
                 aria-label="Ripristina backup"
               >
                 <Upload size={15}/>
                 <input 
                   type="file" 
                   accept=".json" 
                   className="hidden" 
                   onChange={(e) => {
                       const file = e.target.files[0];
                       if(!file) return;
                       const reader = new FileReader();
                       reader.onload = (evt) => {
                           try { handleFullUpdate(JSON.parse(evt.target.result)); alert("Database ripristinato con successo!"); } catch { alert("File JSON non valido."); }
                       };
                       reader.readAsText(file);
                   }}
                 />
               </label>

               <FullscreenButton className="p-1.5 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"/>
             </div>
          </div>
        </nav>

        {/* HERO TITLE CON AMPIO SPAZIO E RESPIRO */}
        <header className="max-w-4xl mx-auto my-4 sm:my-8 text-center shrink-0">
          <div className="inline-block relative">
             <div className="absolute -inset-1 bg-black rounded-full blur-sm opacity-20 transform rotate-2"></div>
             <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] py-3 sm:py-4 px-8 sm:px-14 rounded-full transform -rotate-1">
               <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-gray-900">
                 LIFE SKILLS <span className="text-yellow-500 relative inline-block">SUITE</span>
               </h1>
             </div>
          </div>
          <p className="mt-3 text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-widest">
            Attività Interattive per lo Sviluppo Socio-Emotivo e Relazionale
          </p>
        </header>

        <main className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8 pb-10">
          <Card title="Gestione Emozioni" subtitle="Identificazione" icon={Heart} color="bg-pink-200" description="Scenari per identificare e verbalizzare il vissuto emotivo." onClick={() => handleViewChange('emotions')} />
          <Card title="Narrazione Emotiva" subtitle="Storytelling" icon={BookOpen} color="bg-purple-200" description="Estrai un'emozione e racconta un episodio personale." onClick={() => handleViewChange('emotion_narratives')} />
          <Card title="Affettività e Sessualità" subtitle="Relazioni" icon={HeartHandshake} color="bg-rose-200" description="Dinamiche di coppia, consenso, confini e identità." onClick={() => handleViewChange('affectivity_sexuality')} />
          <Card title="Comunicazione Efficace" subtitle="Stili Relazionali" icon={MessageCircle} color="bg-teal-200" description="Riconosci e sperimenta stili di comunicazione passiva, aggressiva e assertiva." onClick={() => handleViewChange('effective_communication')} />
          <Card title="Decisioni a Freddo" subtitle="Razionalità" icon={Brain} color="bg-blue-200" description="Scelte complesse e pianificazione." onClick={() => handleViewChange('decisions_cold')} />
          <Card title="Decisioni a Caldo" subtitle="Impulsività" icon={Thermometer} color="bg-orange-200" description="Gestione del rischio e reazioni immediate." onClick={() => handleViewChange('decisions_hot')} />
          <Card title="Feedback & Sondaggi" subtitle="Interattivo" icon={MessageSquare} color="bg-yellow-200" description="Q&A, Brainstorming e Sondaggi anonimi in tempo reale." onClick={() => handleViewChange('feedback_session')} />
          <Card title="Termometro Emozioni" subtitle="Esercizio" icon={BarChart2} color="bg-amber-200" description="Ordina le intensità emotive dal più debole al più forte." onClick={() => handleViewChange('emotion_thermometer')} />
          <Card title="Metafore Visive" subtitle="Fotolinguaggio & Blob Trees" icon={Sparkles} color="bg-indigo-200" description="Fotolinguaggio a 60 immagini e Blob Trees interattivi per identificazione e vissuti emotivi." onClick={() => handleViewChange('visual_metaphors')} />
        </main>

        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          appId={APP_ID} 
          data={data}
          onUpdate={handleFullUpdate}
        />
        <GuideModal 
          isOpen={isGuideOpen} 
          onClose={() => setIsGuideOpen(false)} 
        />
        <TeacherPinModal 
          isOpen={isTeacherPinModalOpen} 
          onClose={() => setIsTeacherPinModalOpen(false)}
          onSuccess={() => {
            setTeacherAuth(true);
            setIsStudentEntry(false);
          }}
          dbData={data}
        />
        <P2PModal isOpen={isP2POpen} onClose={() => setIsP2POpen(false)} data={data} onUpdate={handleFullUpdate} />
      </div>
    );
  }

  if (view === 'feedback_session') {
      return (
        <div className="min-h-screen bg-yellow-50 p-4 md:p-8 font-sans flex flex-col">
            <div className="max-w-6xl mx-auto w-full mb-6 flex justify-between items-center">
                <button 
                  onClick={() => setView('dashboard')} 
                  className="flex items-center gap-2 font-black text-sm text-black bg-white hover:bg-yellow-300 px-4 py-2.5 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <ArrowLeft size={18} /> Dashboard
                </button>
                <FullscreenButton className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl"/>
            </div>
            <div className="flex-1 max-w-6xl mx-auto w-full">
                <FeedbackTeacherView 
                  onClose={() => setView('dashboard')} 
                  feedbackSets={data.feedback_sets || []}
                  pollSets={data.poll_sets || []}
                  onUpdateSets={handleUpdateSets}
                  onUpdatePolls={handleUpdatePolls}
                  user={user}
                />
            </div>
            {isManagerOpen && (<ScenarioManager scenarios={data[view]} type={view} fullData={data} onFullUpdate={handleFullUpdate} mappingMode={isMappingMode} setMappingMode={setIsMappingMode} onClose={() => setIsManagerOpen(false)} />)}
        </div>
      );
  }

  return (
    <div className={`min-h-screen ${getTheme().bg} p-4 md:p-8 font-sans transition-colors duration-500 flex flex-col`}>
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between mb-6">
        <button 
          onClick={() => setView('dashboard')} 
          className="flex items-center gap-2 font-black text-sm text-black bg-white hover:bg-yellow-300 px-4 py-2.5 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          <ArrowLeft size={18} /> Dashboard
        </button>
        <div className="flex gap-2.5">
          {['emotions', 'emotion_narratives'].includes(view) && (
             <button 
               onClick={() => setIsWheelOpen(true)} 
               className="flex items-center gap-2 px-4 py-2.5 bg-white text-pink-700 hover:bg-pink-100 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black text-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
             >
               <Heart size={18} className="fill-pink-500 text-pink-700" /> Ruota Emozioni
             </button>
          )}
          <button 
            onClick={() => setIsManagerOpen(true)} 
            className="p-2.5 bg-white hover:bg-yellow-200 text-black rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all relative cursor-pointer"
            title="Gestisci set e stimoli"
          >
            <Settings size={18} />
            {isMappingMode && <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-black"></span>}
          </button>
          <button 
            onClick={() => setIsHistoryOpen(true)} 
            className="p-2.5 bg-white hover:bg-yellow-200 text-black rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all relative cursor-pointer"
            title="Cronologia estrazioni"
          >
            <History size={18} />
            {history.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black"></span>}
          </button>
          <FullscreenButton className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl"/>
        </div>
      </div>
      
      <StandardActivityView 
        view={view} 
        currentScenario={currentScenario} 
        generateScenario={generateScenario} 
        theme={getTheme()} 
        data={data} 
        onFullUpdate={handleFullUpdate} 
        onOpenManager={() => setIsManagerOpen(true)} 
      />
      
      <HistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} history={history} theme={getTheme()} />
      <EmotionWheelModal 
        isOpen={isWheelOpen} 
        onClose={() => setIsWheelOpen(false)} 
        targetEmotion={currentScenario ? currentScenario.text : null} 
        targetCoordinates={currentScenario?.coordinates} 
        isMappingMode={isMappingMode} 
        onMapCoordinate={handleMapCoordinate} 
        onNextEmotion={generateScenario} 
        allScenarios={CATEGORIES.includes(view) ? getActiveItemsForCategory(view, data) : data[view]}
        onSelectEmotion={handleSelectEmotion} 
      />
      {isManagerOpen && (<ScenarioManager scenarios={CATEGORIES.includes(view) ? getActiveItemsForCategory(view, data) : data[view]} type={view} fullData={data} onFullUpdate={handleFullUpdate} mappingMode={isMappingMode} setMappingMode={setIsMappingMode} onClose={() => setIsManagerOpen(false)} />)}
      
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } } @keyframes ping-slow { 0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; } 100% { transform: translate(-50%, -50%) scale(2); opacity: 0; } } .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; } .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; } .custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.1); border-radius: 20px; }`}</style>
    </div>
  );
}