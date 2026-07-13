import type { VocabWord, ListeningItem, DictationItem } from '../types';

// ============================================================
// A0-A1 Daily Life vocabulary
// ============================================================

export const dailyWords: VocabWord[] = [
  // People & Family
  { id: 'fam-1', french: 'la famille', english: 'family', category: 'family', difficulty: 1 },
  { id: 'fam-2', french: 'le père', english: 'father', category: 'family', difficulty: 1, exampleSentence: 'Mon père est médecin.', exampleTranslation: 'My father is a doctor.' },
  { id: 'fam-3', french: 'la mère', english: 'mother', category: 'family', difficulty: 1, exampleSentence: 'Ma mère est gentille.', exampleTranslation: 'My mother is kind.' },
  { id: 'fam-4', french: 'le frère', english: 'brother', category: 'family', difficulty: 1 },
  { id: 'fam-5', french: 'la sœur', english: 'sister', category: 'family', difficulty: 1, exampleSentence: 'Ma sœur habite à Lyon.', exampleTranslation: 'My sister lives in Lyon.' },
  { id: 'fam-6', french: 'l\'ami', english: 'friend (m)', category: 'family', difficulty: 1, exampleSentence: 'C\'est mon ami Pierre.', exampleTranslation: 'This is my friend Pierre.' },
  { id: 'fam-7', french: 'l\'amie', english: 'friend (f)', category: 'family', difficulty: 1 },
  { id: 'fam-8', french: 'l\'homme', english: 'man', category: 'family', difficulty: 1 },
  { id: 'fam-9', french: 'la femme', english: 'woman / wife', category: 'family', difficulty: 1 },
  { id: 'fam-10', french: 'l\'enfant', english: 'child', category: 'family', difficulty: 1 },

  // Pronouns (essential!)
  { id: 'pro-1', french: 'je', english: 'I', category: 'pronouns', difficulty: 1, exampleSentence: 'Je suis français.', exampleTranslation: 'I am French.' },
  { id: 'pro-2', french: 'tu', english: 'you (informal)', category: 'pronouns', difficulty: 1, exampleSentence: 'Tu es mon ami.', exampleTranslation: 'You are my friend.' },
  { id: 'pro-3', french: 'il', english: 'he / it (m)', category: 'pronouns', difficulty: 1, exampleSentence: 'Il est grand.', exampleTranslation: 'He is tall.' },
  { id: 'pro-4', french: 'elle', english: 'she / it (f)', category: 'pronouns', difficulty: 1, exampleSentence: 'Elle est belle.', exampleTranslation: 'She is beautiful.' },
  { id: 'pro-5', french: 'nous', english: 'we', category: 'pronouns', difficulty: 1, exampleSentence: 'Nous allons au cinéma.', exampleTranslation: 'We are going to the cinema.' },
  { id: 'pro-6', french: 'vous', english: 'you (formal/plural)', category: 'pronouns', difficulty: 1, exampleSentence: 'Vous êtes très gentil.', exampleTranslation: 'You are very kind.' },
  { id: 'pro-7', french: 'ils', english: 'they (m)', category: 'pronouns', difficulty: 1 },
  { id: 'pro-8', french: 'elles', english: 'they (f)', category: 'pronouns', difficulty: 1 },

  // Basic Verbs
  { id: 'vb-1', french: 'être', english: 'to be', category: 'verbs-basic', difficulty: 1, exampleSentence: 'Je suis étudiant.', exampleTranslation: 'I am a student.' },
  { id: 'vb-2', french: 'avoir', english: 'to have', category: 'verbs-basic', difficulty: 1, exampleSentence: 'J\'ai vingt ans.', exampleTranslation: 'I am 20 years old.' },
  { id: 'vb-3', french: 'aller', english: 'to go', category: 'verbs-basic', difficulty: 1, exampleSentence: 'Je vais à Paris.', exampleTranslation: 'I am going to Paris.' },
  { id: 'vb-4', french: 'faire', english: 'to do / to make', category: 'verbs-basic', difficulty: 2, exampleSentence: 'Je fais mes devoirs.', exampleTranslation: 'I do my homework.' },
  { id: 'vb-5', french: 'parler', english: 'to speak', category: 'verbs-basic', difficulty: 1, exampleSentence: 'Je parle français.', exampleTranslation: 'I speak French.' },
  { id: 'vb-6', french: 'manger', english: 'to eat', category: 'verbs-basic', difficulty: 1, exampleSentence: 'Je mange une pomme.', exampleTranslation: 'I eat an apple.' },
  { id: 'vb-7', french: 'boire', english: 'to drink', category: 'verbs-basic', difficulty: 2, exampleSentence: 'Je bois de l\'eau.', exampleTranslation: 'I drink water.' },
  { id: 'vb-8', french: 'aimer', english: 'to like / to love', category: 'verbs-basic', difficulty: 1, exampleSentence: 'J\'aime la musique.', exampleTranslation: 'I like music.' },
  { id: 'vb-9', french: 'habiter', english: 'to live (reside)', category: 'verbs-basic', difficulty: 2, exampleSentence: 'J\'habite à Bordeaux.', exampleTranslation: 'I live in Bordeaux.' },
  { id: 'vb-10', french: 'travailler', english: 'to work', category: 'verbs-basic', difficulty: 2, exampleSentence: 'Je travaille dans un bureau.', exampleTranslation: 'I work in an office.' },
  { id: 'vb-11', french: 'vouloir', english: 'to want', category: 'verbs-basic', difficulty: 2, exampleSentence: 'Je veux apprendre le français.', exampleTranslation: 'I want to learn French.' },
  { id: 'vb-12', french: 'pouvoir', english: 'to be able to / can', category: 'verbs-basic', difficulty: 2, exampleSentence: 'Je peux vous aider.', exampleTranslation: 'I can help you.' },

  // Common adjectives
  { id: 'adj-1', french: 'grand', english: 'big / tall', category: 'daily', difficulty: 1 },
  { id: 'adj-2', french: 'petit', english: 'small / short', category: 'daily', difficulty: 1 },
  { id: 'adj-3', french: 'bon', english: 'good', category: 'daily', difficulty: 1, exampleSentence: 'C\'est très bon!', exampleTranslation: 'This is very good!' },
  { id: 'adj-4', french: 'mauvais', english: 'bad', category: 'daily', difficulty: 1 },
  { id: 'adj-5', french: 'beau / belle', english: 'beautiful', category: 'daily', difficulty: 2, exampleSentence: 'Paris est une belle ville.', exampleTranslation: 'Paris is a beautiful city.' },
  { id: 'adj-6', french: 'nouveau', english: 'new', category: 'daily', difficulty: 1 },
  { id: 'adj-7', french: 'vieux', english: 'old', category: 'daily', difficulty: 1 },
  { id: 'adj-8', french: 'jeune', english: 'young', category: 'daily', difficulty: 1 },
  { id: 'adj-9', french: 'heureux', english: 'happy', category: 'daily', difficulty: 2 },
  { id: 'adj-10', french: 'fatigué', english: 'tired', category: 'daily', difficulty: 2 },

  // Daily phrases
  { id: 'dp-1', french: 'Oui', english: 'Yes', category: 'daily', difficulty: 1 },
  { id: 'dp-2', french: 'Non', english: 'No', category: 'daily', difficulty: 1 },
  { id: 'dp-3', french: 'Peut-être', english: 'Maybe', category: 'daily', difficulty: 2 },
  { id: 'dp-4', french: 'D\'accord', english: 'OK / Alright', category: 'daily', difficulty: 1, exampleSentence: 'D\'accord, on y va!', exampleTranslation: 'OK, let\'s go!' },
  { id: 'dp-5', french: 'Je ne sais pas', english: 'I don\'t know', category: 'daily', difficulty: 2, exampleSentence: 'Je ne sais pas où c\'est.', exampleTranslation: 'I don\'t know where it is.' },
  { id: 'dp-6', french: 'Je ne comprends pas', english: 'I don\'t understand', category: 'daily', difficulty: 2 },
  { id: 'dp-7', french: 'Pouvez-vous répéter?', english: 'Can you repeat?', category: 'daily', difficulty: 2 },
  { id: 'dp-8', french: 'Parlez-vous anglais?', english: 'Do you speak English?', category: 'daily', difficulty: 2, exampleSentence: 'Excusez-moi, parlez-vous anglais?', exampleTranslation: 'Excuse me, do you speak English?' },
  { id: 'dp-9', french: 'Je suis désolé', english: 'I am sorry', category: 'daily', difficulty: 1 },
  { id: 'dp-10', french: 'À bientôt!', english: 'See you soon!', category: 'daily', difficulty: 1 },
];

// Listening: daily phrases
export const dailyListening: ListeningItem[] = [
  { id: 'dl-1', french: 'Je m\'appelle Paul.', english: 'My name is Paul.', options: ['My name is Paul.', 'I am French.', 'I live in Paris.', 'I am a student.'], correctIndex: 0, category: 'daily', difficulty: 1 },
  { id: 'dl-2', french: 'Je parle un peu français.', english: 'I speak a little French.', options: ['I speak a little French.', 'I speak English well.', 'I don\'t speak French.', 'I want to learn French.'], correctIndex: 0, category: 'daily', difficulty: 2 },
  { id: 'dl-3', french: 'J\'habite à Paris.', english: 'I live in Paris.', options: ['I live in Paris.', 'I work in Paris.', 'I am from Paris.', 'I like Paris.'], correctIndex: 0, category: 'daily', difficulty: 1 },
  { id: 'dl-4', french: 'Je suis très content aujourd\'hui.', english: 'I am very happy today.', options: ['I am very happy today.', 'I am tired today.', 'I am busy today.', 'I am sad today.'], correctIndex: 0, category: 'daily', difficulty: 2 },
  { id: 'dl-5', french: 'Où sont les toilettes?', english: 'Where is the bathroom?', options: ['Where is the bathroom?', 'Where is the exit?', 'Where is the station?', 'Where is the restaurant?'], correctIndex: 0, category: 'daily', difficulty: 1 },
  { id: 'dl-6', french: 'Quelle heure est-il?', english: 'What time is it?', options: ['What time is it?', 'What day is it?', 'How are you?', 'Where are you?'], correctIndex: 0, category: 'daily', difficulty: 2 },
  { id: 'dl-7', french: 'Je voudrais réserver une table.', english: 'I would like to reserve a table.', options: ['I would like to reserve a table.', 'I would like to order food.', 'I want to pay the bill.', 'I need a menu.'], correctIndex: 0, category: 'daily', difficulty: 2 },
  { id: 'dl-8', french: 'Combien ça coûte?', english: 'How much does it cost?', options: ['How much does it cost?', 'What is this?', 'Where can I pay?', 'Do you have change?'], correctIndex: 0, category: 'daily', difficulty: 2 },
];

// Dictation: daily phrases
export const dailyDictation: DictationItem[] = [
  { id: 'dd-1', french: 'bonjour', english: 'hello', difficulty: 1 },
  { id: 'dd-2', french: 'merci', english: 'thank you', difficulty: 1 },
  { id: 'dd-3', french: 'Je m\'appelle', english: 'My name is', difficulty: 2, hint: 'Start with "Je"' },
  { id: 'dd-4', french: 'au revoir', english: 'goodbye', difficulty: 1 },
  { id: 'dd-5', french: 's\'il vous plaît', english: 'please', difficulty: 2 },
  { id: 'dd-6', french: 'Comment allez-vous?', english: 'How are you?', difficulty: 2, hint: 'The question has 3 words' },
  { id: 'dd-7', french: 'Je parle français.', english: 'I speak French.', difficulty: 2 },
  { id: 'dd-8', french: 'Où sont les toilettes?', english: 'Where is the bathroom?', difficulty: 3 },
];
