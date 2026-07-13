import type { PronunciationItem } from '../types';

// ============================================================
// French pronunciation focus exercises
// Key sounds that are difficult for English/Chinese speakers
// ============================================================

export const pronunciationExercises: PronunciationItem[] = [
  // ---- Vowel sounds ----
  { id: 'pr-1', french: 'café', english: 'coffee', difficulty: 1, focusSounds: ['é'], tips: 'é = like "ay" in "say" but shorter and tenser' },
  { id: 'pr-2', french: 'été', english: 'summer', difficulty: 1, focusSounds: ['é'], tips: 'Both é sound the same: tense "ay"' },
  { id: 'pr-3', french: 'élève', english: 'student', difficulty: 1, focusSounds: ['é', 'è'], tips: 'é = tense "ay", è = open "eh" like in "bed"' },
  { id: 'pr-4', french: 'très', english: 'very', difficulty: 1, focusSounds: ['è'], tips: 'è = open "eh" sound, mouth more open than é' },
  { id: 'pr-5', french: 'fête', english: 'party', difficulty: 1, focusSounds: ['ê'], tips: 'ê = same as è, open "eh" sound' },
  { id: 'pr-6', french: 'le', english: 'the (m)', difficulty: 1, focusSounds: ['e'], tips: 'e without accent = "uh" like the "e" in "the"' },

  // ---- Nasal sounds ----
  { id: 'pr-7', french: 'pain', english: 'bread', difficulty: 2, focusSounds: ['in'], tips: '"in" is nasal: like "a" in "bang" but through the nose, no "n" sound' },
  { id: 'pr-8', french: 'vin', english: 'wine', difficulty: 2, focusSounds: ['in'], tips: 'Same nasal "in" as in "pain"' },
  { id: 'pr-9', french: 'un', english: 'one', difficulty: 2, focusSounds: ['un'], tips: '"un" nasal: like "uh" through the nose, different from "in"' },
  { id: 'pr-10', french: 'brun', english: 'brown', difficulty: 2, focusSounds: ['un'], tips: 'un = nasal "uh"' },
  { id: 'pr-11', french: 'an', english: 'year', difficulty: 2, focusSounds: ['an'], tips: '"an" nasal: like "on" in "song" but through nose, mouth more open' },
  { id: 'pr-12', french: 'enfant', english: 'child', difficulty: 2, focusSounds: ['an', 'en'], tips: '"en" and "an" make the SAME nasal sound in modern French' },
  { id: 'pr-13', french: 'bon', english: 'good', difficulty: 2, focusSounds: ['on'], tips: '"on" nasal: like "own" through nose, lips rounded' },
  { id: 'pr-14', french: 'bonbon', english: 'candy', difficulty: 1, focusSounds: ['on'], tips: 'Both "on" sounds are the same nasal vowel' },

  // ---- The French R ----
  { id: 'pr-15', french: 'rouge', english: 'red', difficulty: 3, focusSounds: ['r'], tips: 'French R = guttural, from the throat. Like gargling softly. Not rolled like Spanish.' },
  { id: 'pr-16', french: 'Paris', english: 'Paris', difficulty: 3, focusSounds: ['r'], tips: 'R from the back of throat, not English R' },
  { id: 'pr-17', french: 'français', english: 'French', difficulty: 3, focusSounds: ['r', 'ç'], tips: 'R from throat + ç = soft "s" sound' },

  // ---- The French U (tricky!) ----
  { id: 'pr-18', french: 'tu', english: 'you (informal)', difficulty: 3, focusSounds: ['u'], tips: 'u: Say "ee" (like in "see") but round your lips tightly like you\'re saying "oo"' },
  { id: 'pr-19', french: 'rue', english: 'street', difficulty: 3, focusSounds: ['u', 'r'], tips: 'u = ee + rounded lips, r = throat' },
  { id: 'pr-20', french: 'du', english: 'some / of the', difficulty: 3, focusSounds: ['u'], tips: 'u = NOT "oo". Lips rounded like "oo" but tongue says "ee"' },

  // ---- Common words for practice ----
  { id: 'pr-21', french: 'Bonjour, je m\'appelle Marie.', english: 'Hello, my name is Marie.', difficulty: 2, tips: 'Practice the flow: Bon-jour (nasal "on"), je (soft "j" + "uh"), m\'appelle (ma-pell)' },
  { id: 'pr-22', french: 'Je voudrais un café, s\'il vous plaît.', english: 'I would like a coffee, please.', difficulty: 3, tips: 'vou-drais (silent s), un café (nasal un), s\'il vous plaît (seel-voo-play)' },
  { id: 'pr-23', french: 'Comment tu t\'appelles?', english: 'What\'s your name? (informal)', difficulty: 2, tips: 'Com-ment (nasal "en"), tu t\'appelles (tu-ta-pell, silent s)' },
  { id: 'pr-24', french: 'Où est la boulangerie?', english: 'Where is the bakery?', difficulty: 2, tips: 'Où (oo), est (ay), bou-lan-ge-rie (boo-lanj-ree)' },
  { id: 'pr-25', french: 'Enchanté!', english: 'Nice to meet you!', difficulty: 1, tips: 'En-chan-té (all nasal "en", then "shan-tay")' },
];

export function getPronunciationByDifficulty(difficulty: 1 | 2 | 3): PronunciationItem[] {
  return pronunciationExercises.filter(p => p.difficulty === difficulty);
}

export function getPronunciationBySound(sound: string): PronunciationItem[] {
  return pronunciationExercises.filter(p => p.focusSounds?.includes(sound));
}
