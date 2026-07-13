import { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';

// ============================================================
// Curated free French learning videos from YouTube
// ============================================================

interface Video {
  id: string;
  title: string;
  titleZh: string;
  channel: string;
  duration: string;
  level: string;
  category: 'pronunciation' | 'grammar' | 'conversation' | 'culture' | 'music';
  description: string;
}

const videos: Video[] = [
  // Pronunciation
  {
    id: 't7FAlwA-fco',
    title: 'Learn French Pronunciation in 12 Minutes',
    titleZh: '12分钟学会法语发音',
    channel: 'Learn French with FrenchPod101.com',
    duration: '12:00',
    level: 'A0',
    category: 'pronunciation',
    description: '覆盖所有法语元音和辅音发音，适合零基础',
  },
  {
    id: 'tME5xdX7fTE',
    title: 'French nasal vowels pronunciation',
    titleZh: '法语鼻音元音发音详解',
    channel: 'Comme une Française',
    duration: '8:30',
    level: 'A0-A1',
    category: 'pronunciation',
    description: 'an/en/in/on/un 鼻音的发音技巧和口型示范',
  },
  // Conversation
  {
    id: 'hD4mE8h2TMc',
    title: 'Slow and Easy French Conversation Practice',
    titleZh: '慢速法语日常对话练习',
    channel: 'Kendra\'s Language School',
    duration: '45:00',
    level: 'A1',
    category: 'conversation',
    description: '慢速法语对话，带英语字幕，适合跟读练习',
  },
  {
    id: 'I9KA3DEqaDA',
    title: 'French Conversation Practice for Beginners',
    titleZh: '法语初学者对话练习',
    channel: 'Easy French',
    duration: '14:00',
    level: 'A1',
    category: 'conversation',
    description: 'Easy French 街头采访系列，真实法国人日常对话',
  },
  {
    id: 'ujDtm0hZyII',
    title: 'Ordering Food in French at a Restaurant',
    titleZh: '在法国餐厅用法语点餐',
    channel: 'Learn French with Alexa',
    duration: '8:00',
    level: 'A1',
    category: 'conversation',
    description: '餐厅点餐真实场景对话，涵盖常用句型',
  },
  // Grammar
  {
    id: 'Jhxf3Fq1K8w',
    title: 'French Verbs & Tenses explained',
    titleZh: '法语动词时态详解',
    channel: 'Learn French With Alexa',
    duration: '15:00',
    level: 'A1-A2',
    category: 'grammar',
    description: '用简单英语讲解法语核心动词时态',
  },
  {
    id: 'NRx4O5QPqSo',
    title: 'Le Passé Composé - French Past Tense',
    titleZh: '法语复合过去时（Passé Composé）',
    channel: 'Learn French With Alexa',
    duration: '10:00',
    level: 'A2',
    category: 'grammar',
    description: '清晰讲解 passé composé 的结构和用法',
  },
  // Culture
  {
    id: 'hwRGOzexQcQ',
    title: 'Paris Travel Guide - French Phrases You Need',
    titleZh: '巴黎旅行必备法语',
    channel: 'Tourist to Local',
    duration: '12:00',
    level: 'A1',
    category: 'culture',
    description: '巴黎旅行中实际会用到的法语短语',
  },
  {
    id: 'FNtCV8TE4iA',
    title: 'French Workplace Culture & Vocabulary',
    titleZh: '法国职场文化与词汇',
    channel: 'Comme une Française',
    duration: '11:00',
    level: 'B1',
    category: 'culture',
    description: '了解法国职场礼仪、常用办公法语',
  },
  // Music
  {
    id: '4B_6H2n8QvU',
    title: 'Indila - Dernière Danse (Lyrics)',
    titleZh: 'Indila - 最后一支舞（带歌词）',
    channel: 'Indila',
    duration: '3:30',
    level: 'A2',
    category: 'music',
    description: '法国流行歌曲，慢速清晰，适合学法语',
  },
  {
    id: 'k5Sqxr3P980',
    title: 'Zaz - Je veux (Official Video)',
    titleZh: 'Zaz - 我想要（官方MV）',
    channel: 'Zaz',
    duration: '3:40',
    level: 'A2',
    category: 'music',
    description: '欢快的法语歌曲，歌词简单上口',
  },
  {
    id: 'W2XNFNXJqB0',
    title: 'Stromae - Papaoutai (Lyrics)',
    titleZh: 'Stromae - 爸爸你在哪（带歌词）',
    channel: 'Stromae',
    duration: '3:50',
    level: 'A2-B1',
    category: 'music',
    description: '比利时法语歌手，现代法语流行音乐',
  },
];

const CATEGORY_TABS: Record<string, { label: string; icon: string; color: string }> = {
  all: { label: '全部', icon: '🎬', color: 'bg-gray-50 text-gray-600' },
  pronunciation: { label: '发音', icon: '🗣️', color: 'bg-red-50 text-red-600' },
  conversation: { label: '对话', icon: '💬', color: 'bg-blue-50 text-blue-600' },
  grammar: { label: '语法', icon: '📖', color: 'bg-purple-50 text-purple-600' },
  culture: { label: '文化', icon: '🏛️', color: 'bg-amber-50 text-amber-600' },
  music: { label: '音乐', icon: '🎵', color: 'bg-pink-50 text-pink-600' },
};

export default function Videos() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const filteredVideos = activeTab === 'all'
    ? videos
    : videos.filter(v => v.category === activeTab);

  if (selectedVideo) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedVideo(null)}
          className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] flex items-center gap-1"
        >
          ← 返回视频列表
        </button>

        {/* YouTube embed */}
        <div className="bg-black rounded-2xl overflow-hidden aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${selectedVideo.id}?rel=0&modestbranding=1`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={selectedVideo.title}
          />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-bold text-sm">{selectedVideo.title}</h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">{selectedVideo.titleZh}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-[var(--color-text-secondary)]">
            <span>🎬 {selectedVideo.channel}</span>
            <span>⏱️ {selectedVideo.duration}</span>
            <span className="px-1.5 py-0.5 bg-gray-100 rounded-full text-[10px] font-medium">
              {selectedVideo.level}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-2">{selectedVideo.description}</p>
          <a
            href={`https://www.youtube.com/watch?v=${selectedVideo.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-xs text-red-500 hover:text-red-600"
          >
            <ExternalLink size={12} /> 在 YouTube 打开
          </a>
        </div>

        {/* Learning tip */}
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <p className="text-xs text-amber-700">
            💡 <strong>学习建议：</strong>先看一遍了解大意 → 打开字幕看第二遍 → 跟读模仿发音 → 记录生词到词汇复习
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">视频学习 🎬</h1>
      <p className="text-xs text-[var(--color-text-secondary)]">
        精选免费法语教学视频 · 真实母语者发音 · 点击即可观看
      </p>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {Object.entries(CATEGORY_TABS).map(([key, { label, icon }]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeTab === key
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-white border border-gray-200 text-[var(--color-text-secondary)] hover:border-gray-300'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Video grid */}
      <div className="grid gap-3">
        {filteredVideos.map(video => (
          <button
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-left hover:border-red-200 transition-colors group"
          >
            <div className="flex gap-3 p-4">
              {/* Thumbnail placeholder with play button */}
              <div className="w-32 h-20 bg-gray-900 rounded-xl shrink-0 flex items-center justify-center relative overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                  alt=""
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-red-600/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={18} fill="white" className="text-white ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm line-clamp-2">{video.title}</h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{video.titleZh}</p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[var(--color-text-secondary)]">
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded-full">{video.level}</span>
                  <span>⏱️ {video.duration}</span>
                  <span>🎬 {video.channel.slice(0, 20)}...</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
