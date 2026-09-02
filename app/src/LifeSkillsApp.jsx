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
  scenario_sets: {}
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

    const maxCount = Math.max(...Object.values(counts), 1);
    return (
        <div className="w-full h-full flex flex-col justify-center gap-4 p-4 max-w-3xl mx-auto">
            {safeOptions.map((opt, idx) => (
                <div key={idx} className="w-full">
                    <div className="flex justify-between items-center mb-1 font-bold text-gray-700">
                        <div className="flex items-center gap-2">
                            <span>{opt}</span>
                            {/* Manual Controls */}
                            {onManualVote && (
                                <div className="flex gap-1 ml-2">
                                    <button onClick={() => onManualVote(opt, 1)} className="bg-green-100 hover:bg-green-200 text-green-700 rounded p-0.5" title="Aggiungi voto"><Plus size={14}/></button>
                                    <button onClick={() => onManualVote(opt, -1)} className="bg-red-100 hover:bg-red-200 text-red-700 rounded p-0.5" title="Rimuovi voto"><Minus size={14}/></button>
                                </div>
                            )}
                        </div>
                        <span>{counts[opt]}</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-8 border-2 border-gray-200 overflow-hidden shadow-inner">
                        <div className="bg-green-500 h-full transition-all duration-1000 ease-out" style={{ width: `${maxCount > 0 ? (counts[opt] / maxCount) * 100 : 0}%` }}/>
                    </div>
                </div>
            ))}
            <div className="text-center text-gray-400 text-sm mt-4">Voti totali: {total}</div>
        </div>
    );
};

const ManualQAModal = ({ isOpen, onClose, onSubmit, questions }) => {
    const [answers, setAnswers] = useState({});
    const [singleText, setSingleText] = useState("");

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (questions && questions.length > 0) {
            // Formato domande multiple
            const payload = questions.map(q => {
                const ans = answers[q.id];
                if (!ans) return null;
                return `${q.text.toUpperCase()}:\n${ans}`;
            }).filter(Boolean);
            if (payload.length > 0) onSubmit(payload);
        } else {
            // Formato testo libero
            if (singleText.trim()) onSubmit(singleText);
        }
        setAnswers({});
        setSingleText("");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl border-4 border-black max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-4">
                    <h3 className="text-2xl font-black flex items-center gap-2"><Edit size={24} className="text-blue-500"/> Inserimento Manuale</h3>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={20}/></button>
                </div>

                <div className="space-y-6">
                    {questions && questions.length > 0 ? (
                        questions.map((q, idx) => (
                            <div key={q.id}>
                                <label className="block font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide">#{idx+1} {q.text}</label>
                                <textarea 
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none min-h-[80px]"
                                    placeholder="Scrivi la risposta dello studente..."
                                    value={answers[q.id] || ""}
                                    onChange={e => setAnswers({...answers, [q.id]: e.target.value})}
                                />
                            </div>
                        ))
                    ) : (
                        <div>
                            <label className="block font-bold text-gray-700 mb-2">Risposta</label>
                            <textarea 
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none min-h-[150px]"
                                placeholder="Scrivi il pensiero..."
                                value={singleText}
                                onChange={e => setSingleText(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Annulla</button>
                    <button onClick={handleSubmit} className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg">AGGIUNGI ALLA LAVAGNA</button>
                </div>
            </div>
        </div>
    );
};

const FloatingWordCloud = ({ responses, onManualAdd }) => {
    const containerRef = useRef(null);
    const [nodes, setNodes] = useState([]);
    const nodesRef = useRef([]); 

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
                color: `hsl(${(i * 55) % 360}, 75%, 40%)`,
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

    const handleAddClick = () => {
        const word = window.prompt("Aggiungi una parola al brainstorming:");
        if (word && word.trim()) {
            onManualAdd(word.trim());
        }
    };

    if (nodes.length === 0) return (
        <div className="relative w-full h-full min-h-[80vh] flex flex-col items-center justify-center bg-yellow-50/30 rounded-xl border-4 border-yellow-100">
             <div className="text-gray-400 text-2xl font-bold uppercase opacity-50">In attesa di pensieri...</div>
             <button onClick={handleAddClick} className="mt-4 text-gray-400 hover:text-gray-600 flex items-center gap-2 text-sm font-bold border-2 border-dashed border-gray-300 rounded-lg px-3 py-1"><Plus size={16}/> Aggiungi manuale</button>
        </div>
    );

    return (
        <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-yellow-50/30 min-h-[80vh] rounded-xl border-4 border-yellow-100 group">
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
                        textShadow: '2px 2px 0px rgba(255,255,255,0.9), -1px -1px 0 #fff',
                        zIndex: Math.floor(node.count * 100), 
                        pointerEvents: 'none' 
                    }}
                >
                    {node.text}
                </div>
            ))}
            <button 
                onClick={handleAddClick} 
                className="absolute bottom-4 right-4 p-3 rounded-full bg-white/50 hover:bg-white text-gray-400 hover:text-black shadow-sm border border-transparent hover:border-gray-300 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-50"
                title="Aggiungi parola manualmente"
            >
                <Plus size={20}/>
            </button>
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
        <div className="w-full md:w-1/3 p-6 border-r-4 border-gray-100 bg-white flex flex-col overflow-y-auto">
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
                <button onClick={() => setActiveTab('pending')} className={`flex-1 py-2 rounded-lg font-bold ${activeTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
                    Da Approvare ({pending.length})
                </button>
                <button onClick={() => setActiveTab('published')} className={`flex-1 py-2 rounded-lg font-bold ${activeTab === 'published' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
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
                                <p className="text-xs text-gray-400">{new Date(res.timestamp).toLocaleTimeString()}</p>
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
    return (
        <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-6 relative">
            {canUnlock && onTeacherUnlock && (
                <button
                    type="button"
                    onClick={onTeacherUnlock}
                    className="absolute top-6 right-6 flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-xs font-black text-gray-700 hover:text-black border-2 border-black/10 shadow-sm transition-all"
                    title="Accesso riservato al docente tramite PIN"
                >
                    <Lock size={14} className="text-amber-600" /> Area Docente
                </button>
            )}
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border-4 border-black">
                <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"><LogIn size={40} className="text-yellow-600"/></div>
                <h1 className="text-3xl font-black mb-2">Partecipa</h1>
                <p className="text-gray-500 mb-6">Inserisci il codice fornito dal docente.</p>
                <input 
                    value={code} 
                    onChange={e => setCode(e.target.value.toUpperCase())}
                    placeholder="CODICE" 
                    className="w-full text-center text-3xl font-black tracking-widest p-4 border-4 border-gray-200 rounded-2xl mb-4 focus:border-black outline-none uppercase"
                    maxLength={4}
                />
                <button 
                    onClick={() => code.length >= 4 && onJoin(code)}
                    disabled={code.length < 4}
                    className="w-full bg-black text-white py-4 rounded-xl font-bold text-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:transform-none"
                >
                    ENTRA
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

  // Stato e handler per shortUrl e condivisione Chromebook
  const [shortUrl, setShortUrl] = useState(null);
  const [tinyBusy, setTinyBusy] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleGenerateTinyUrl = async (targetUrl) => {
    setTinyBusy(true);
    const res = await generateTinyUrl(targetUrl);
    if (res) setShortUrl(res);
    setTinyBusy(false);
  };

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

  const handleManualQASubmit = async (content) => {
      if (!content || !db || !sessionCode) return;
      const sessionRef = doc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'feedback_sessions'), sessionCode);
      await updateDoc(sessionRef, { 
          responses: arrayUnion({ 
              text: content, 
              timestamp: new Date().toISOString(), 
              status: 'visible',
              visible: true 
          }) 
      });
  };

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
      <div className="flex flex-col items-center justify-center h-full p-8 bg-yellow-50 rounded-3xl border-4 border-yellow-200">
        <div className="bg-yellow-100 p-6 rounded-full mb-6 border-4 border-yellow-300"><MessageSquare size={64} className="text-yellow-600" /></div>
        <h2 className="text-4xl font-black mb-2 text-yellow-900">Feedback Anonimo</h2>
        <p className="text-gray-600 mb-8 max-w-md">Scegli un'attività e proietta il QR.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full max-w-4xl">
            <button onClick={() => setSessionType('qa')} className={`p-6 rounded-2xl border-4 flex flex-col items-center gap-3 transition-all ${sessionType === 'qa' ? 'bg-yellow-200 border-yellow-500 scale-105 shadow-xl' : 'bg-white border-gray-200 hover:border-yellow-300 text-gray-500'}`}>
                <MessageSquare size={40}/>
                <span className="font-black text-lg">Domande & Risposte</span>
            </button>
            <button onClick={() => setSessionType('wordcloud')} className={`p-6 rounded-2xl border-4 flex flex-col items-center gap-3 transition-all ${sessionType === 'wordcloud' ? 'bg-blue-200 border-blue-500 scale-105 shadow-xl' : 'bg-white border-gray-200 hover:border-blue-300 text-gray-500'}`}>
                <Cloud size={40}/>
                <span className="font-black text-lg">Brainstorming</span>
            </button>
            <button onClick={() => setSessionType('poll')} className={`p-6 rounded-2xl border-4 flex flex-col items-center gap-3 transition-all ${sessionType === 'poll' ? 'bg-green-200 border-green-500 scale-105 shadow-xl' : 'bg-white border-gray-200 hover:border-green-300 text-gray-500'}`}>
                <BarChart2 size={40}/>
                <span className="font-black text-lg">Sondaggio</span>
            </button>
        </div>

        {/* OPZIONI COMUNI: MODERAZIONE */}
        <div className="mb-6 flex flex-wrap gap-4 justify-center">
             <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                <span className="font-bold text-gray-700 text-sm">Richiedi approvazione:</span>
                <button onClick={() => setModerationEnabled(!moderationEnabled)} className={`w-12 h-6 rounded-full transition-colors relative ${moderationEnabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${moderationEnabled ? 'left-7' : 'left-1'}`} />
                </button>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                <span className="font-bold text-gray-700 text-sm">Consenti risposte multiple per utente:</span>
                <button onClick={() => setAllowMultipleResponses(!allowMultipleResponses)} className={`w-12 h-6 rounded-full transition-colors relative ${allowMultipleResponses ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${allowMultipleResponses ? 'left-7' : 'left-1'}`} />
                </button>
            </div>
        </div>

        {sessionType === 'qa' && (
             <div className="w-full max-w-md bg-white p-4 rounded-2xl shadow-sm border-2 border-yellow-100 mb-6 flex gap-2">
               <div className="flex-1 relative">
                  <select className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 appearance-none font-bold text-gray-700 outline-none focus:border-yellow-400" value={selectedSetId} onChange={(e) => setSelectedSetId(e.target.value)}>
                     <option value="">-- Risposte Libere (Nessuna Domanda) --</option>
                     {feedbackSets && feedbackSets.map(set => (<option key={set.id} value={set.id}>{set.title}</option>))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16}/>
               </div>
               <button onClick={() => setIsSettingsOpen('questions')} className="p-3 bg-gray-100 rounded-xl border-2 border-gray-200 hover:bg-gray-200 text-gray-600" title="Gestisci Set"><Settings size={20}/></button>
             </div>
        )}

        {sessionType === 'poll' && (
            <div className="w-full max-w-lg bg-white p-6 rounded-2xl border-2 border-green-200 mb-8 animate-in slide-in-from-top-4 relative">
                <button onClick={() => setIsSettingsOpen('polls')} className="absolute top-4 right-4 text-gray-400 hover:text-black"><Settings size={20}/></button>
                <div className="mb-4">
                     <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Preset Salvati</label>
                     <select className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm" value={selectedPollId} onChange={(e) => setSelectedPollId(e.target.value)}>
                        <option value="">-- Nuovo Sondaggio --</option>
                        {pollSets && pollSets.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                     </select>
                </div>
                <input value={pollQuestion} onChange={e => setPollQuestion(e.target.value)} placeholder="Domanda del sondaggio..." className="w-full p-3 mb-3 rounded-xl border-2 border-gray-200 font-bold outline-none focus:border-green-500"/>
                <textarea value={pollOptionsInput} onChange={e => setPollOptionsInput(e.target.value)} placeholder="Opzioni (separate da virgola). Es: Sì, No, Forse" className="w-full p-3 rounded-xl border-2 border-gray-200 outline-none focus:border-green-500 h-24 mb-3"/>
                <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={allowMultiple} onChange={e => setAllowMultiple(e.target.checked)} className="w-5 h-5 accent-green-500" />
                    Consenti risposta multipla
                </label>
            </div>
        )}

        <button onClick={createSession} disabled={loading} className="bg-black text-white px-12 py-5 rounded-2xl font-black text-2xl hover:scale-105 transition-transform flex items-center gap-3 shadow-xl">
          {loading ? <Loader2 className="animate-spin"/> : <PlayIcon />} AVVIA SESSIONE
        </button>
      </div>
    );
  }

  const fbEncoded = encodeFBConfig(getFBConfig());
  const joinUrl = `${window.location.href.split('?')[0]}?session=${sessionCode}${fbEncoded ? `&fb=${fbEncoded}` : ''}`;
  const modUrl = `${window.location.href.split('?')[0]}?mode=moderator&session=${sessionCode}`;

  return (
    <div className="flex flex-col h-full relative">
      <div className="bg-white p-3 rounded-2xl border-b-4 border-black mb-4 flex flex-col md:flex-row justify-between items-center shadow-md gap-4">
         <div className="flex items-center gap-3">
             <span className="bg-black text-white px-3 py-1 rounded-lg font-mono font-bold text-xl">{sessionCode}</span>
             <button onClick={toggleSessionStatus} className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-2 border-2 ${sessionData.active ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}`}>
                {sessionData.active ? 'APERTA' : 'CHIUSA'}
             </button>
         </div>
         
         <div className="flex-1 text-center font-bold text-gray-500 uppercase text-sm">
             {sessionData.type === 'qa' && "Domande & Risposte"}
             {sessionData.type === 'wordcloud' && "Brainstorming"}
             {sessionData.type === 'poll' && "Sondaggio"}
         </div>

         <div className="flex gap-2">
             <button onClick={() => setShowModQR(!showModQR)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl font-bold flex items-center gap-2 border-2 border-gray-200" title="Telecomando Moderatore">
                <Smartphone size={18}/> <span className="hidden lg:inline">Moderazione</span>
             </button>
             <button onClick={() => setViewMode(viewMode === 'qr' ? 'responses' : 'qr')} className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 border-2 border-blue-200 transition-all">
                {viewMode === 'qr' ? <><MessageSquare size={18}/> VEDI RISULTATI ({sessionData.responses.filter(r => r.status === 'visible' || (!r.status && r.visible !== false)).length})</> : <><QrCode size={18}/> MOSTRA QR</>}
             </button>
             {/* Esportazione Immagine SVG per tutte le modalità */}
             <button 
               onClick={() => exportSessionImage(sessionData, sessionCode, showNames)} 
               className="p-2 bg-purple-100 hover:bg-purple-200 border-2 border-purple-300 text-purple-700 font-black rounded-xl flex items-center gap-1 transition-all" 
               title="Salva come immagine vettoriale SVG (tutti gli elementi dell'area di lavoro, zoomabile all'infinito)"
             >
                <Download size={18} />
                <span style={{ fontSize: '13px', fontWeight: '900', lineHeight: '20px' }}>SVG</span>
             </button>
             <button onClick={exportResponses} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 border-2 border-gray-200 text-gray-600" title="Esporta TXT"><FileJson size={20}/></button>
             <button onClick={() => exportSessionXLSX(sessionData, sessionCode)} className="p-2 bg-green-100 rounded-xl hover:bg-green-200 border-2 border-green-200 text-green-600" title="Esporta XLSX">
                <span style={{ fontSize: '14px', fontWeight: '900', lineHeight: '20px' }}>XLS</span>
             </button>
             {sessionData.type === 'qa' && (
                <>
                  <div className="flex items-center bg-gray-100 rounded-xl border-2 border-gray-200 p-0.5" title="Regola dimensione testo (per far stare più cose a schermo)">
                    <button
                      type="button"
                      onClick={() => {
                        const lvls = ['sm', 'md', 'lg', 'xl'];
                        const curIdx = lvls.indexOf(qaFontSize);
                        if (curIdx > 0) setQaFontSize(lvls[curIdx - 1]);
                      }}
                      disabled={qaFontSize === 'sm'}
                      className="px-2 py-1 font-black text-xs text-gray-700 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title="Riduci testo (far stare più note a schermo)"
                    >
                      A-
                    </button>
                    <span className="px-1.5 font-bold text-[11px] text-gray-600 uppercase select-none">
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
                      title="Ingrandisci testo"
                    >
                      A+
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={toggleAllCollapse}
                    className={`p-2 rounded-xl border-2 transition-all flex items-center gap-1.5 ${allCollapsed ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-800' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600'}`}
                    title={allCollapsed ? "Espandi tutte le note (mostra risposte)" : "Collassa tutte (mostra solo nomi)"}
                  >
                    {allCollapsed ? <ChevronDown size={18}/> : <ChevronUp size={18}/>}
                    <span className="text-xs font-bold hidden md:inline">
                      {allCollapsed ? "Espandi tutte" : "Solo nomi"}
                    </span>
                  </button>
                  <button onClick={() => setShowNames(!showNames)} className={`p-2 rounded-xl border-2 transition-all ${showNames ? 'bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-600' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600'}`} title={showNames ? 'Nascondi nomi' : 'Mostra nomi'}>
                     <span style={{ fontSize: '16px', lineHeight: '20px' }}>👤</span>
                  </button>
                </>
             )}
             <button onClick={() => setSessionCode(null)} className="p-2 bg-red-100 rounded-xl hover:bg-red-200 border-2 border-red-200 text-red-600"><X size={20}/></button>
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
                         <div className="text-sm font-bold text-gray-700">
                           Apri il browser su:
                           <div className="mt-1 font-mono font-black text-sm md:text-base text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 select-all inline-block break-all">
                             {shortUrl || getStudentBaseUrl() || window.location.host}
                           </div>
                         </div>
                       </li>

                       <li className="flex items-start gap-2.5">
                         <span className="w-6 h-6 rounded-full bg-black text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                         <div className="text-sm font-bold text-gray-700">
                           Inserisci il codice PIN:
                           <div className="mt-1.5 text-4xl md:text-5xl font-mono font-black tracking-widest text-black bg-yellow-300 px-5 py-2 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block select-all">
                             {sessionCode}
                           </div>
                         </div>
                       </li>
                     </ol>
                   </div>

                   {/* Pulsanti rapidi per il docente */}
                   <div className="pt-4 border-t-2 border-gray-100 flex flex-wrap gap-2">
                     <button
                       type="button"
                       onClick={() => {
                         navigator.clipboard.writeText(joinUrl);
                         setCopiedLink(true);
                         setTimeout(() => setCopiedLink(false), 2500);
                       }}
                       className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 border-2 transition-all ${
                         copiedLink 
                           ? 'bg-green-100 text-green-700 border-green-300' 
                           : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                       }`}
                       title="Copia l'indirizzo diretto da incollare su Google Classroom o Teams"
                     >
                       {copiedLink ? <Check size={14}/> : <Copy size={14}/>}
                       {copiedLink ? 'Link copiato!' : 'Copia link diretto (per Classroom)'}
                     </button>

                     {!shortUrl && (
                       <button
                         type="button"
                         onClick={() => handleGenerateTinyUrl(joinUrl)}
                         disabled={tinyBusy}
                         className="px-3 py-2 rounded-xl font-bold text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 border-2 border-purple-200 flex items-center gap-1.5 transition-all disabled:opacity-50"
                         title="Genera un link breve tipo tinyurl.com/... facile da scrivere per gli studenti"
                       >
                         <Sparkles size={14} />
                         {tinyBusy ? 'Generazione...' : 'Crea link TinyURL'}
                       </button>
                     )}
                   </div>
                </div>

             </div>

             {sessionData.type === 'poll' && <div className="mt-8 text-2xl font-black text-center text-green-700 bg-green-50 px-6 py-3 rounded-2xl border-2 border-green-200">{sessionData.question}</div>}
             {sessionData.questions && sessionData.questions.length > 0 && (
                <div className="w-full max-w-5xl px-4 text-center mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sessionData.questions.map((q) => (
                        <div key={q.id} className="bg-white/90 backdrop-blur-sm border-l-8 border-yellow-400 p-6 rounded-r-2xl shadow-lg text-left flex flex-col">
                            {q.imgUrl && <div className="mb-4 rounded-xl overflow-hidden border-2 border-gray-100 h-48 w-full"><img src={q.imgUrl} alt="Stimolo" className="w-full h-full object-cover" /></div>}
                            <h2 className="text-2xl font-black text-gray-800">{q.text}</h2>
                        </div>
                    ))}
                </div>
             )}
          </div>
      )}

      {viewMode === 'responses' && (
          <div className="flex-1 bg-yellow-50 rounded-3xl border-4 border-yellow-200 p-6 overflow-y-auto relative animate-in slide-in-from-right duration-300 group">
            {sessionData.type === 'qa' && (
                // Filtra solo quelle visibili o approvate
                <>
                    {sessionData.responses.filter(r => r.status === 'visible' || (!r.status && r.visible !== false)).length === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center text-yellow-300 font-black text-4xl uppercase opacity-40">In attesa...</div>
                    ) : (
                        <div className={`grid ${QA_FONT_SIZES[qaFontSize]?.grid || QA_FONT_SIZES.md.grid}`}>
                            {sessionData.responses.slice().reverse().map((res, idx) => {
                                const isVisible = res.status === 'visible' || (!res.status && res.visible !== false);
                                if (!isVisible) return null;
                                const noteKey = res.timestamp ? `${res.timestamp}_${idx}` : `note_${idx}`;
                                const isCollapsed = isNoteCollapsed(noteKey);
                                const fontCfg = QA_FONT_SIZES[qaFontSize] || QA_FONT_SIZES.md;
                                const authorName = showNames && res.studentName && res.studentName.trim()
                                  ? res.studentName.trim()
                                  : (showNames ? 'Anonimo' : `Risposta #${sessionData.responses.length - idx}`);

                                if (isCollapsed) {
                                  return (
                                    <div
                                      key={noteKey}
                                      onClick={() => toggleNoteCollapse(noteKey)}
                                      className={`bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-black cursor-pointer hover:shadow-md transition-all flex items-center justify-between ${fontCfg.collapsedPad}`}
                                      title="Clicca per espandere e leggere il contenuto"
                                    >
                                      <div className="flex items-center gap-2 min-w-0 pr-2">
                                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                          👤
                                        </span>
                                        <span className="font-bold text-gray-800 truncate text-sm">
                                          {authorName}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1 text-gray-400 hover:text-black flex-shrink-0">
                                        <ChevronDown size={16} />
                                      </div>
                                    </div>
                                  );
                                }

                                return (
                                    <div key={noteKey} className={`bg-white rounded-xl shadow-md border-b-4 border-gray-200 hover:-translate-y-0.5 transition-all flex flex-col justify-between ${fontCfg.cardPad}`}>
                                        <div>
                                          <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100">
                                            <div className="flex items-center gap-2 min-w-0">
                                              <span className="text-xs">👤</span>
                                              <span className={`font-bold text-gray-700 uppercase tracking-wider truncate ${fontCfg.headerSize}`}>
                                                {authorName}
                                              </span>
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

                                          {Array.isArray(res.text) ? (
                                            <div>
                                              {/* In primo piano solo le risposte: le domande restano a richiesta. */}
                                              {res.text.map((qaItem, qaIdx) => {
                                                const nlPos = qaItem.indexOf('\n');
                                                const answerPart = nlPos >= 0 ? qaItem.substring(nlPos + 1) : qaItem;
                                                return (
                                                  <div key={qaIdx}>
                                                    {qaIdx > 0 && <hr style={{ margin: '10px 0', borderColor: '#e5e7eb' }} />}
                                                    <p className={`font-bold text-gray-800 whitespace-pre-wrap ${fontCfg.textSize}`}>{answerPart}</p>
                                                  </div>
                                                );
                                              })}
                                              {res.text.some((qaItem) => qaItem.indexOf('\n') >= 0) && (
                                                <details style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #d1d5db' }}>
                                                  <summary className={`text-gray-400 cursor-pointer font-bold ${fontCfg.detailsText}`}>Mostra domande</summary>
                                                  <div style={{ marginTop: '6px' }}>
                                                    {res.text.map((qaItem, qaIdx) => {
                                                      const nlPos = qaItem.indexOf('\n');
                                                      const questionPart = nlPos >= 0 ? qaItem.substring(0, nlPos).replace(/:$/, '') : '';
                                                      return questionPart ? (
                                                        <p key={qaIdx} className={`text-gray-500 italic ${fontCfg.detailsText}`} style={{ marginBottom: '3px' }}>• {questionPart}</p>
                                                      ) : null;
                                                    })}
                                                  </div>
                                                </details>
                                              )}
                                            </div>
                                          ) : (
                                            <p className={`font-bold text-gray-800 whitespace-pre-wrap ${fontCfg.textSize}`}>{res.text}</p>
                                          )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {/* Pulsante aggiunta manuale QA */}
                    <button 
                        onClick={() => setIsManualQAOpen(true)} 
                        className="absolute bottom-4 right-4 p-3 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-black shadow-lg border border-transparent hover:border-gray-300 transition-all opacity-0 group-hover:opacity-100 z-50"
                        title="Aggiungi risposta manuale"
                    >
                        <Plus size={20}/>
                    </button>
                    <ManualQAModal 
                        isOpen={isManualQAOpen} 
                        onClose={() => setIsManualQAOpen(false)} 
                        onSubmit={handleManualQASubmit}
                        questions={sessionData.questions}
                    />
                </>
            )}
            {sessionData.type === 'wordcloud' && <FloatingWordCloud responses={sessionData.responses} onManualAdd={handleManualAddWord} />}
            {sessionData.type === 'poll' && <PollChart responses={sessionData.responses} options={sessionData.options} onManualVote={handleManualPollVote} />}
          </div>
      )}
    </div>
  );
};

const FeedbackStudentView = ({ sessionCode, onExit, user }) => {
    const [text, setText] = useState("");
    const [answers, setAnswers] = useState({}); // Per QA Multiplo
    const [selectedOptions, setSelectedOptions] = useState([]); // Array per multi-select
    const [status, setStatus] = useState("loading");
    const [sessionData, setSessionData] = useState(null);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [alreadySubmitted, setAlreadySubmitted] = useState(false); // NUOVO STATO

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

    // --- NUOVA SCHERMATA DI CARICAMENTO STILIZZATA ---
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
                    {status === 'closed' ? <div className="mt-4 bg-red-50 text-red-500 p-3 rounded-xl font-bold flex items-center justify-center gap-2"><Lock size={18}/> Sessione Terminata</div> : <p className="text-gray-500 text-sm mt-2">La tua risposta sarà visualizzata alla lavagna.</p>}
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
                                            <button key={opt} type="button" onClick={() => handleOptionToggle(opt)} className={`w-full p-4 rounded-xl border-2 font-bold transition-all flex items-center justify-between ${isSelected ? 'bg-blue-500 text-white border-blue-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
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
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white/80 backdrop-blur-sm p-3 px-5 rounded-2xl border-2 border-black/10 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-gray-500 tracking-wider">Set Attivo:</span>
            <select
              value={catData.activeSetId}
              onChange={(e) => {
                const updated = setActiveCategorySet(view, data, e.target.value);
                onFullUpdate(updated);
              }}
              className="bg-white border-2 border-black/20 rounded-xl px-3 py-1 font-bold text-sm text-gray-800 outline-none hover:border-black cursor-pointer shadow-sm transition-all"
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
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-gray-700 hover:text-black bg-white hover:bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-300 shadow-sm transition-all"
            title="Gestisci i set e gli stimoli"
          >
            <Settings size={14} /> Gestisci Set &amp; Stimoli
          </button>
        </div>
      );
    })()}

    <div className="flex-1 flex flex-col relative">
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,0.05)] border-8 border-white flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden transition-all">
        {!currentScenario ? (
           <div className="flex flex-col items-center z-10 animate-fade-in">
              <div className={`w-32 h-32 ${theme.light} rounded-full flex items-center justify-center mb-6 animate-pulse`}><RotateCcw size={48} className={theme.accent} /></div>
              <h3 className="text-2xl font-black text-gray-400 uppercase mb-6">Nessun elemento attivo</h3>
              <button onClick={generateScenario} className={`px-10 py-5 rounded-2xl text-white font-black text-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-b-8 active:border-b-0 active:translate-y-2 ${theme.button}`}>ESTRAI {view === 'emotion_narratives' ? 'EMOZIONE' : 'SCENARIO'}</button>
           </div>
        ) : (
          <div className="w-full flex flex-col h-full animate-fade-in z-10">
            <div className="flex justify-end items-start mb-6">
               <button onClick={generateScenario} className={`p-3 rounded-xl text-white shadow-lg hover:scale-110 active:scale-90 transition-all ${theme.button}`} title="Prossimo elemento"><RotateCcw size={20} /></button>
               <FullscreenButton className="ml-2"/>
            </div>
            <div className="flex-1 flex items-center justify-center py-4">
              <h3 className={`text-4xl md:text-6xl font-black text-gray-800 leading-tight text-center ${view === 'emotion_narratives' ? 'uppercase tracking-tighter' : ''}`}>{currentScenario.text}</h3>
            </div>
            {view !== 'affectivity_sexuality' && (
              <div className={`mt-8 p-6 rounded-2xl ${theme.light} bg-opacity-60 border-2 border-white/50`}>
                <h4 className={`text-xs font-black uppercase tracking-widest mb-3 ${theme.accent} flex items-center gap-2 opacity-80`}><Brain size={14} /> {view === 'emotion_narratives' ? 'Spunti per il racconto' : 'Spunti per la discussione'}</h4>
                <ul className="grid md:grid-cols-3 gap-4 text-gray-700 font-bold text-sm">
                  {view === 'emotions' && (<>
                      <li className="bg-white/80 p-3 rounded-xl text-center">Che emozione provi?</li>
                      <li className="bg-white/80 p-3 rounded-xl text-center">Dove la senti nel corpo?</li>
                      <li className="bg-white/80 p-3 rounded-xl text-center">Intensità (1-10)?</li>
                  </>)}
                  {view === 'emotion_narratives' && (<>
                      <li className="bg-white/80 p-3 rounded-xl text-center">Quando è successo?</li>
                      <li className="bg-white/80 p-3 rounded-xl text-center">Cosa l'ha innescata?</li>
                      <li className="bg-white/80 p-3 rounded-xl text-center">Come hai reagito?</li>
                  </>)}
                  {view === 'effective_communication' && (<>
                      <li className="bg-white/80 p-3 rounded-xl text-center">Che stile è? (Passivo, Aggressivo, Assertivo)</li>
                      <li className="bg-white/80 p-3 rounded-xl text-center">Come si sente chi parla e chi ascolta?</li>
                      <li className="bg-white/80 p-3 rounded-xl text-center">Come riformularlo in modo assertivo?</li>
                  </>)}
                  {(view === 'decisions_cold' || view === 'decisions_hot') && (<>
                      <li className="bg-white/80 p-3 rounded-xl text-center">Cosa fai subito?</li>
                      <li className="bg-white/80 p-3 rounded-xl text-center">Conseguenze?</li>
                      <li className="bg-white/80 p-3 rounded-xl text-center">Alternative?</li>
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
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out border-l-4 border-black ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
  const [isStudentEntry, setIsStudentEntry] = useState(false);

  // Stato sicurezza e autenticazione docente
  const [isTeacherPinModalOpen, setIsTeacherPinModalOpen] = useState(false);
  const [teacherAuth, setTeacherAuth] = useState(() => isTeacherAuthenticated());

  // Modali globali
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isP2POpen, setIsP2POpen] = useState(false);

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

    // ?ns= trasporta il namespace nel link di condivisione, così chi entra
    // da QR finisce sullo stesso database del docente.
    const nsParam = params.get('ns');
    if (nsParam) {
      try {
        APP_ID = decodeURIComponent(escape(atob(nsParam)));
      } catch {
        /* namespace illeggibile: si resta su quello locale */
      }
    }

    // Se ci sono parametri, impostiamo lo stato MA non blocchiamo l'initAuth
    if (sessionParam) {
        if(modeParam === 'moderator') {
            setModeratorSessionCode(sessionParam);
        } else {
            setStudentSessionCode(sessionParam);
        }
    } else if (params.get('student') === '1' || params.get('join') === '1' || window.location.hash === '#student') {
        setIsStudentEntry(true);
    } else if (isPinProtectionEnabled() && !isTeacherAuthenticated()) {
        // Protezione attiva e dispositivo non autenticato come docente:
        // apre di default la vista studente anziché la Dashboard!
        setIsStudentEntry(true);
    }

    const initApp = async () => {
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
        setData(INITIAL_DB_DATA); 
      }
    };
    initApp();
  }, []);

  useEffect(() => {
    if (!db || !user || studentSessionCode || moderatorSessionCode) return; 
    const docRef = doc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'lifeskills'), 'main_db');
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) setData(snap.data());
      else { setDoc(docRef, INITIAL_DB_DATA); setData(INITIAL_DB_DATA); }
    }, (err) => setData(INITIAL_DB_DATA));
    return () => unsubscribe();
  }, [user, studentSessionCode, moderatorSessionCode]);

  // --- MODES RENDER ---
  if (isStudentEntry) {
      return (
        <>
          <StudentEntryView 
            onJoin={(code) => { setStudentSessionCode(code); setIsStudentEntry(false); }} 
            onTeacherUnlock={teacherAuth ? () => setIsStudentEntry(false) : () => setIsTeacherPinModalOpen(true)}
            canUnlock={true}
          />
          <TeacherPinModal 
            isOpen={isTeacherPinModalOpen} 
            onClose={() => setIsTeacherPinModalOpen(false)}
            onSuccess={() => {
              setTeacherAuth(true);
              setIsStudentEntry(false);
            }}
          />
        </>
      );
  }

  if (studentSessionCode) {
      return <FeedbackStudentView sessionCode={studentSessionCode} onExit={() => { 
          // INVECE DI RELOAD, MOSTRA SOLO ENTRY VIEW
          window.history.pushState({}, document.title, window.location.pathname); 
          setStudentSessionCode(null); 
          setIsStudentEntry(true);
      }} user={user} />;
  }
  
  if (moderatorSessionCode) {
      return <FeedbackModeratorView sessionCode={moderatorSessionCode} user={user} />;
  }

  // --- STANDARD ACTIONS ---
  const handleUpdateData = async (newData) => {
    setData(newData);
    if (db && user) {
      const docRef = doc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'lifeskills'), 'main_db');
      await setDoc(docRef, newData);
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

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-yellow-50 p-6 font-sans selection:bg-yellow-200">
        <header className="max-w-6xl mx-auto mb-16 text-center pt-10">
          <div className="inline-block relative">
             <div className="absolute -inset-1 bg-black rounded-full blur-sm opacity-20 transform rotate-2"></div>
             <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 px-12 rounded-full mb-8 transform -rotate-1">
               <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900">LIFE SKILLS <span className="text-yellow-500 relative inline-block">SUITE</span></h1>
             </div>
          </div>
          <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                  {db ? <Cloud size={14} className="text-green-500"/> : <Save size={14}/>} 
                  {db ? "Cloud Attivo" : "Locale"}
              </div>
              <button 
                onClick={() => { setIsStudentEntry(true); }} 
                className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 px-4 py-1.5 rounded-full shadow-sm hover:scale-105 transition-all"
                title="Accedi come studente digitando il codice PIN a 4 lettere"
              >
                  <LogIn size={15}/> 💻 Studente: Partecipa con PIN
              </button>
              
              <div className="absolute top-4 right-4 flex gap-2">
                 <FullscreenButton className=""/>
                 {isPinProtectionEnabled() && (
                   <button 
                     onClick={() => {
                       logoutTeacher();
                       setTeacherAuth(false);
                       setIsStudentEntry(true);
                     }} 
                     className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full transition-colors flex items-center justify-center shadow-sm" 
                     title="Blocca sessione docente (richiederà il PIN)"
                   >
                     <Lock size={16}/>
                   </button>
                 )}
                 <button onClick={() => setIsSettingsOpen(true)} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors" title="Impostazioni"><Settings size={16}/></button>
                 <button onClick={() => setIsP2POpen(true)} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors" title="Sincronizzazione P2P"><Smartphone size={16}/></button>
                 {/* GLOBAL BACKUP BUTTONS */}
                 <button onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
                    const el = document.createElement('a');
                    el.setAttribute("href", dataStr);
                    el.setAttribute("download", "lifeskills_FULL_BACKUP.json");
                    document.body.appendChild(el); el.click(); el.remove();
                 }} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 opacity-50 hover:opacity-100 transition-opacity" title="Backup Completo"><Download size={16}/></button>
                 
                 <label className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 opacity-50 hover:opacity-100 transition-opacity cursor-pointer" title="Ripristina Backup">
                    <Upload size={16}/>
                    <input type="file" accept=".json" className="hidden" onChange={(e) => {
                        const file = e.target.files[0];
                        if(!file) return;
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                            try { handleFullUpdate(JSON.parse(evt.target.result)); alert("Ripristinato!"); } catch { alert("File non valido"); }
                        };
                        reader.readAsText(file);
                    }}/>
                 </label>
              </div>
          </div>
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
        </main>

        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} appId={APP_ID} />
        <TeacherPinModal 
          isOpen={isTeacherPinModalOpen} 
          onClose={() => setIsTeacherPinModalOpen(false)}
          onSuccess={() => {
            setTeacherAuth(true);
            setIsStudentEntry(false);
          }}
        />
        <P2PModal isOpen={isP2POpen} onClose={() => setIsP2POpen(false)} data={data} onUpdate={handleFullUpdate} />
      </div>
    );
  }

  if (view === 'feedback_session') {
      return (
        <div className="min-h-screen bg-yellow-50 p-4 md:p-8 font-sans flex flex-col">
            <div className="max-w-6xl mx-auto w-full mb-6 flex justify-between items-center">
                <button onClick={() => setView('dashboard')} className="flex items-center gap-2 font-bold text-gray-700 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md border border-transparent hover:border-black"><ArrowLeft size={18} /> Dashboard</button>
                <FullscreenButton className=""/>
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
        <button onClick={() => setView('dashboard')} className="flex items-center gap-2 font-bold text-gray-700 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all border border-transparent hover:border-black"><ArrowLeft size={18} /> Dashboard</button>
        <div className="flex gap-2">
          {['emotions', 'emotion_narratives'].includes(view) && (
             <button onClick={() => setIsWheelOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-pink-500 rounded-xl shadow-sm border border-pink-100 hover:border-pink-500 font-bold text-sm transition-all"><Heart size={18} className="fill-pink-500" /> Ruota Emozioni</button>
          )}
          <button onClick={() => setIsManagerOpen(true)} className="p-2 bg-white text-gray-700 rounded-xl shadow-sm hover:bg-gray-100 border border-transparent hover:border-gray-300 relative">
            <Settings size={20} />
            {isMappingMode && <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-white"></span>}
          </button>
          <button onClick={() => setIsHistoryOpen(true)} className="p-2 bg-white text-gray-700 rounded-xl shadow-sm hover:bg-gray-100 border border-transparent hover:border-gray-300 relative">
            <History size={20} />
            {history.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></span>}
          </button>
          <FullscreenButton className=""/>
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