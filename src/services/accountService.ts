// ============================================================
// Local Account System — multi-profile with per-user settings
// Stores profiles + chat history in localStorage/IndexedDB
// ============================================================

import Dexie, { type Table } from 'dexie';

// --- Types ---
export interface UserProfile {
  id: string;
  nickname: string;
  avatar: string;        // emoji
  createdAt: string;
  lastLogin: string;
  // Per-user settings
  apiKey: string;
  apiProvider: 'zhipu' | 'gemini';
  voiceName: string;
  dailyGoal: number;
}

export interface ChatMessage {
  id: string;
  profileId: string;
  role: 'user' | 'assistant';
  content: string;
  page: string;           // which page the chat was on
  timestamp: string;
}

// --- IndexedDB for chat history ---
class ChatDB extends Dexie {
  messages!: Table<ChatMessage, string>;

  constructor() {
    super('FrenchFlowChat');
    this.version(1).stores({
      messages: 'id, profileId, timestamp',
    });
  }
}

export const chatDB = new ChatDB();

// --- Profile Management (localStorage-based) ---
const PROFILES_KEY = 'ff_profiles';
const ACTIVE_PROFILE_KEY = 'ff_active_profile';

function getAllProfiles(): UserProfile[] {
  try {
    return JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]');
  } catch { return []; }
}

function saveAllProfiles(profiles: UserProfile[]): void {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function getActiveProfile(): UserProfile | null {
  const id = localStorage.getItem(ACTIVE_PROFILE_KEY);
  if (!id) return null;
  return getAllProfiles().find(p => p.id === id) || null;
}

export function setActiveProfile(id: string): UserProfile | null {
  const profile = getAllProfiles().find(p => p.id === id);
  if (!profile) return null;
  profile.lastLogin = new Date().toISOString();
  const profiles = getAllProfiles().map(p => p.id === id ? profile : p);
  saveAllProfiles(profiles);
  localStorage.setItem(ACTIVE_PROFILE_KEY, id);
  // Sync per-user settings to legacy localStorage keys
  localStorage.setItem('frenchflow_api_key', profile.apiKey);
  localStorage.setItem('frenchflow_api_provider', profile.apiProvider);
  if (profile.voiceName) localStorage.setItem('ff_voice', profile.voiceName);
  return profile;
}

export function createProfile(nickname: string, avatar: string): UserProfile {
  const profile: UserProfile = {
    id: 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    nickname,
    avatar,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    apiKey: '',
    apiProvider: 'zhipu',
    voiceName: '',
    dailyGoal: 50,
  };
  const profiles = getAllProfiles();
  profiles.push(profile);
  saveAllProfiles(profiles);
  setActiveProfile(profile.id);
  return profile;
}

export function updateProfile(id: string, updates: Partial<UserProfile>): UserProfile | null {
  const profiles = getAllProfiles();
  const idx = profiles.findIndex(p => p.id === id);
  if (idx === -1) return null;
  profiles[idx] = { ...profiles[idx], ...updates };
  saveAllProfiles(profiles);
  // If updating active profile, sync settings
  const active = getActiveProfile();
  if (active && active.id === id) {
    setActiveProfile(id);
  }
  return profiles[idx];
}

export function deleteProfile(id: string): void {
  const profiles = getAllProfiles().filter(p => p.id !== id);
  saveAllProfiles(profiles);
  // Clean up chat history
  chatDB.messages.where('profileId').equals(id).delete();
  // If deleted active, switch to first available or null
  if (localStorage.getItem(ACTIVE_PROFILE_KEY) === id) {
    if (profiles.length > 0) {
      setActiveProfile(profiles[0].id);
    } else {
      localStorage.removeItem(ACTIVE_PROFILE_KEY);
      localStorage.removeItem('frenchflow_api_key');
      localStorage.removeItem('frenchflow_api_provider');
    }
  }
}

export function getAllProfileList(): UserProfile[] {
  return getAllProfiles();
}

// --- Chat History ---
export async function saveChatMessage(profileId: string, role: 'user' | 'assistant', content: string, page: string): Promise<void> {
  await chatDB.messages.put({
    id: 'msg_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 4),
    profileId,
    role,
    content,
    page,
    timestamp: new Date().toISOString(),
  });
  // Keep only last 500 messages per profile
  const all = await chatDB.messages.where('profileId').equals(profileId).toArray();
  if (all.length > 500) {
    const sorted = all.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    const toDelete = sorted.slice(0, sorted.length - 500);
    await chatDB.messages.bulkDelete(toDelete.map(m => m.id));
  }
}

export async function getChatHistory(profileId: string, limit = 50): Promise<ChatMessage[]> {
  const all = await chatDB.messages.where('profileId').equals(profileId).toArray();
  return all
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, limit)
    .reverse(); // return in chronological order
}

export async function clearChatHistory(profileId: string): Promise<void> {
  await chatDB.messages.where('profileId').equals(profileId).delete();
}

// --- Legacy migration ---
// If there's an API key in legacy localStorage but no profiles exist,
// auto-create a default profile with that key
export function migrateFromLegacy(): void {
  const profiles = getAllProfiles();
  if (profiles.length > 0) return; // Already have profiles

  const legacyKey = localStorage.getItem('frenchflow_api_key');
  const legacyProvider = localStorage.getItem('frenchflow_api_provider') as 'zhipu' | 'gemini' || 'zhipu';
  const legacyVoice = localStorage.getItem('ff_voice') || '';
  const legacyGoal = parseInt(localStorage.getItem('ff_daily_goal') || '50', 10);

  if (legacyKey || true) { // Always create a profile
    const profile: UserProfile = {
      id: 'u_default',
      nickname: '我',
      avatar: '😎',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      apiKey: legacyKey || '',
      apiProvider: legacyProvider,
      voiceName: legacyVoice,
      dailyGoal: isNaN(legacyGoal) ? 50 : legacyGoal,
    };
    saveAllProfiles([profile]);
    setActiveProfile(profile.id);
  }
}
