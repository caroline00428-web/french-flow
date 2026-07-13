import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { hasApiKey } from '../services/gemini';
import TutorPanel from './TutorPanel';

export default function TutorFab() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Don't show fab on tutor page (has its own UI)
  if (location.pathname === '/tutor') return null;
  if (!hasApiKey()) return null;

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-4 z-40 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg shadow-purple-300/50 flex items-center justify-center hover:scale-105 active:scale-95 transition-all animate-[bounce-in_0.3s_ease-out]"
          title="AI 法语家教"
        >
          <MessageCircle size={24} />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            AI
          </span>
        </button>
      )}

      {/* Slide-out panel */}
      <TutorPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
