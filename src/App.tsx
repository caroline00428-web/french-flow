import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { initVoices } from './hooks/useTTS';
import Layout from './components/Layout';

// Core 4 tabs
import SearchPage from './pages/SearchPage';
import WordBank from './pages/WordBank';
import Learn from './pages/Learn';
import Profile from './pages/Profile';

// Secondary pages
import Vocabulary from './pages/Vocabulary';
import Pronunciation from './pages/Pronunciation';
import Listening from './pages/Listening';
import Dictation from './pages/Dictation';
import Grammar from './pages/Grammar';
import Story from './pages/Story';
import Reading from './pages/Reading';
import ScriptsPage from './pages/ScriptsPage';
import PhonicsPage from './pages/PhonicsPage';
import DailySoundPage from './pages/DailySoundPage';
import WordStudy from './pages/WordStudy';
import Feedback from './pages/Feedback';
import Tutor from './pages/Tutor';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import QuizBattle from './pages/QuizBattle';
import Dialogue from './pages/Dialogue';
import FAQPage from './pages/FAQPage';

export default function App() {
  const initialize = useGameStore(s => s.initialize);
  const isLoaded = useGameStore(s => s.isLoaded);

  useEffect(() => { initialize(); initVoices(); }, [initialize]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-secondary)]">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🇫🇷</div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-2">FrenchFlow</h1>
          <p className="text-[var(--color-text-secondary)]">随身法语助手</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter basename="/french-flow">
      <Routes>
        <Route element={<Layout />}>
          {/* Main 4 tabs */}
          <Route path="/" element={<SearchPage />} />
          <Route path="/wordbank" element={<WordBank />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/profile" element={<Profile />} />

          {/* Secondary pages */}
          <Route path="/vocabulary" element={<Vocabulary />} />
          <Route path="/pronunciation" element={<Pronunciation />} />
          <Route path="/listening" element={<Listening />} />
          <Route path="/dictation" element={<Dictation />} />
          <Route path="/grammar" element={<Grammar />} />
          <Route path="/story" element={<Story />} />
          <Route path="/reading" element={<Reading />} />
          <Route path="/scripts" element={<ScriptsPage />} />
          <Route path="/phonics" element={<PhonicsPage />} />
          <Route path="/dailysound" element={<DailySoundPage />} />
          <Route path="/wordstudy" element={<WordStudy />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/tutor" element={<Tutor />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz-battle" element={<QuizBattle />} />
          <Route path="/dialogue" element={<Dialogue />} />
          <Route path="/faq" element={<FAQPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
