import React, { useState, useEffect } from 'react';
import { Maximize, Minimize } from 'lucide-react';

/** Attiva/disattiva lo schermo intero, utile durante l'uso in classe con la LIM. */
export default function FullscreenButton({ className }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => console.error(e));
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <button
      onClick={toggle}
      className={`p-2 bg-gray-100 rounded-xl hover:bg-gray-200 border-2 border-gray-200 text-gray-600 transition-all ${className}`}
      title={isFullscreen ? 'Esci da Schermo Intero' : 'Schermo Intero'}
    >
      {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
    </button>
  );
}
