import React, { useState, useEffect, useRef } from 'react';
import { LogIn, X, Loader2 } from 'lucide-react';
import { P2P_CATEGORIES, P2P_CATEGORY_LABELS, p2pCompress, p2pDecompress, p2pMergeData } from '../lib/p2p';

// Oltre questa soglia il payload viene spezzato: i canali dati WebRTC non
// reggono messaggi arbitrariamente grandi.
const CHUNK_SIZE = 16000;

/**
 * Sincronizzazione diretta fra due dispositivi.
 * Un lato fa da host e mostra un QR con il proprio id PeerJS, l'altro lo
 * inquadra (o incolla l'id) e si collega. I dati ricevuti non sovrascrivono
 * mai quelli locali: vengono uniti aggiungendo solo ciò che manca.
 */
export default function P2PModal({ isOpen, onClose, data, onUpdate }) {
  const [mode, setMode] = useState(null);
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);
  const [myId, setMyId] = useState('');
  const [remoteId, setRemoteId] = useState('');
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(-1);
  const [cats, setCats] = useState(() => {
    const o = {};
    P2P_CATEGORIES.forEach((c) => (o[c] = true));
    return o;
  });
  const [received, setReceived] = useState(null);
  const [qrUrl, setQrUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const scanRef = useRef(null);
  const chunksRef = useRef({ parts: [], total: 0 });

  // Alla chiusura si smonta tutto: connessione, fotocamera e stato.
  useEffect(() => {
    if (isOpen) return;
    if (peer) {
      peer.destroy();
      setPeer(null);
    }
    setMode(null);
    setConn(null);
    setMyId('');
    setStatus('');
    setProgress(-1);
    setReceived(null);
    setQrUrl('');
    if (scanRef.current) {
      try {
        scanRef.current.stop();
      } catch {
        /* lo scanner era già fermo */
      }
      scanRef.current = null;
    }
    setScanning(false);
  }, [isOpen]);

  const handleData = (raw) => {
    try {
      if (raw.type === 'p2p_data') {
        setReceived(p2pDecompress(raw.payload));
        setStatus('Dati ricevuti! Premi IMPORTA per unire.');
        setProgress(100);
      } else if (raw.type === 'p2p_chunk_start') {
        chunksRef.current = { parts: [], total: raw.total };
        setProgress(0);
        setStatus(`Ricezione... 0/${raw.total}`);
      } else if (raw.type === 'p2p_chunk') {
        const store = chunksRef.current;
        store.parts.push(raw.data);
        setProgress(Math.round((store.parts.length / store.total) * 100));
        setStatus(`Ricezione... ${store.parts.length}/${store.total}`);
        if (store.parts.length === store.total) {
          setReceived(p2pDecompress(store.parts.join('')));
          setStatus('Dati ricevuti! Premi IMPORTA per unire.');
          setProgress(100);
        }
      }
    } catch (err) {
      setStatus('Errore decompressione: ' + err.message);
    }
  };

  const attachConnection = (c, connectedMessage) => {
    setConn(c);
    setStatus(connectedMessage);
    c.on('data', handleData);
    c.on('close', () => {
      setStatus('Disconnesso.');
      setConn(null);
    });
  };

  const startHost = () => {
    setMode('host');
    setStatus('Connessione al server...');
    const p2 = new Peer();
    p2.on('open', (id) => {
      setMyId(id);
      setStatus('In attesa di connessione...');
      setPeer(p2);
      if (typeof QRCode !== 'undefined') {
        QRCode.toDataURL(id, { width: 256, margin: 1 })
          .then(setQrUrl)
          .catch(() => {});
      }
    });
    p2.on('connection', (c) => attachConnection(c, 'Connesso! In attesa dati...'));
    p2.on('error', (err) => setStatus('Errore: ' + err.type));
  };

  const startScan = () => {
    setMode('scan');
    setStatus('Pronto per connettersi.');
  };

  const connectTo = (id) => {
    if (!id.trim()) return;
    setStatus('Connessione...');
    const p2 = new Peer();
    setPeer(p2);
    p2.on('open', () => {
      const c = p2.connect(id.trim());
      c.on('open', () => attachConnection(c, 'Connesso!'));
      c.on('error', (err) => setStatus('Errore connessione: ' + err.type));
    });
    p2.on('error', (err) => setStatus('Errore: ' + err.type));
  };

  const sendData = () => {
    if (!conn) return;
    const filtered = {};
    P2P_CATEGORIES.forEach((cat) => {
      if (cats[cat] && data[cat]) filtered[cat] = data[cat];
    });
    const compressed = p2pCompress(filtered);

    if (compressed.length <= CHUNK_SIZE) {
      conn.send({ type: 'p2p_data', payload: compressed });
      setStatus('Dati inviati!');
      setProgress(100);
      return;
    }

    const chunks = [];
    for (let i = 0; i < compressed.length; i += CHUNK_SIZE) chunks.push(compressed.slice(i, i + CHUNK_SIZE));
    conn.send({ type: 'p2p_chunk_start', total: chunks.length });
    setProgress(0);
    chunks.forEach((ch, idx) => {
      // I pezzi vengono distanziati per non saturare il canale dati.
      setTimeout(() => {
        conn.send({ type: 'p2p_chunk', data: ch, idx });
        setProgress(Math.round(((idx + 1) / chunks.length) * 100));
        setStatus(idx === chunks.length - 1 ? 'Dati inviati!' : `Invio... ${idx + 1}/${chunks.length}`);
      }, idx * 50);
    });
  };

  const doMerge = () => {
    if (!received) return;
    onUpdate(p2pMergeData(data, received));
    setStatus('Dati importati con successo!');
    setReceived(null);
    setProgress(-1);
  };

  const startQrScan = () => {
    setScanning(true);
    // Si attende che il contenitore sia nel DOM prima di avviare la fotocamera.
    setTimeout(() => {
      const el = document.getElementById('_p2p_qr_reader');
      if (!el) return;
      const scanner = new Html5Qrcode('_p2p_qr_reader');
      scanRef.current = scanner;
      scanner
        .start({ facingMode: 'environment' }, { fps: 10, qrbox: 250 }, (text) => {
          scanner
            .stop()
            .then(() => {
              setScanning(false);
              scanRef.current = null;
              setRemoteId(text);
              connectTo(text);
            })
            .catch(() => {});
        })
        .catch((err) => {
          setStatus('Errore fotocamera: ' + err);
          setScanning(false);
        });
    }, 200);
  };

  if (!isOpen) return null;

  const categoryPicker = (
    <div className="space-y-3">
      <p className="text-xs font-bold text-gray-400 uppercase">Categorie da inviare:</p>
      <div className="grid grid-cols-2 gap-2">
        {P2P_CATEGORIES.map((cat) => (
          <label
            key={cat}
            className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-xs font-bold ${
              cats[cat]
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-gray-50 border-gray-200 text-gray-400'
            }`}
          >
            <input
              type="checkbox"
              checked={cats[cat]}
              onChange={() => setCats((prev) => ({ ...prev, [cat]: !prev[cat] }))}
              className="accent-blue-500"
            />
            {P2P_CATEGORY_LABELS[cat]}
          </label>
        ))}
      </div>
      <button
        onClick={sendData}
        className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800"
      >
        INVIA DATI
      </button>
      {progress >= 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: progress + '%' }} />
        </div>
      )}
    </div>
  );

  const statusLine = status && (
    <div className="text-center text-sm font-bold text-gray-600 bg-gray-50 rounded-xl p-3">
      <Loader2 size={14} className={`inline mr-2 ${conn ? 'hidden' : 'animate-spin'}`} />
      {status}
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-lg border-4 border-black animate-in zoom-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black flex items-center gap-2">
            <LogIn size={22} /> Sincronizzazione P2P
          </h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>

        {!mode && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">
              Trasferisci dati direttamente tra dispositivi senza server.
            </p>
            <button
              onClick={startHost}
              className="w-full p-4 bg-blue-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-600"
            >
              <LogIn size={20} /> Mostra QR (Host)
            </button>
            <button
              onClick={startScan}
              className="w-full p-4 bg-green-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-green-600"
            >
              <LogIn size={20} /> Scansiona QR (Client)
            </button>
          </div>
        )}

        {mode === 'host' && (
          <div className="space-y-4">
            {qrUrl && (
              <div className="text-center">
                <img src={qrUrl} alt="QR Code" style={{ width: 200, height: 200 }} className="mx-auto" />
                <p className="text-[10px] font-mono text-gray-400 mt-2 break-all">{myId}</p>
              </div>
            )}
            {statusLine}
            {conn && categoryPicker}
          </div>
        )}

        {mode === 'scan' && (
          <div className="space-y-4">
            {!conn && !scanning && (
              <div className="space-y-3">
                <button
                  onClick={startQrScan}
                  className="w-full p-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600"
                >
                  Apri Fotocamera
                </button>
                <div className="flex gap-2">
                  <input
                    value={remoteId}
                    onChange={(e) => setRemoteId(e.target.value)}
                    placeholder="...oppure incolla ID manualmente"
                    className="flex-1 p-3 rounded-xl border-2 border-gray-200 text-xs font-mono outline-none focus:border-black"
                  />
                  <button
                    onClick={() => connectTo(remoteId)}
                    disabled={!remoteId.trim()}
                    className="bg-black text-white px-4 rounded-xl font-bold disabled:opacity-30"
                  >
                    VAI
                  </button>
                </div>
              </div>
            )}
            {scanning && <div id="_p2p_qr_reader" className="rounded-xl overflow-hidden" style={{ width: '100%' }} />}
            {statusLine}
            {conn && categoryPicker}
          </div>
        )}

        {received && (
          <div className="mt-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
            <p className="font-bold text-yellow-800 mb-2">Dati ricevuti:</p>
            <div className="text-xs text-yellow-700 space-y-1 mb-3">
              {P2P_CATEGORIES.map((cat) =>
                received[cat] ? (
                  <div key={cat}>
                    • {P2P_CATEGORY_LABELS[cat]}: <b>{received[cat].length}</b> elementi
                  </div>
                ) : null,
              )}
            </div>
            <button
              onClick={doMerge}
              className="w-full bg-yellow-500 text-white py-2 rounded-xl font-bold hover:bg-yellow-600"
            >
              IMPORTA E UNISCI
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
