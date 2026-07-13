import type { VocabWord } from '../types';

// ============================================================
// A0 Basics - Greetings, Numbers, Colors, Days, Months
// ============================================================

export const basicsWords: VocabWord[] = [
  // Greetings
  { id: 'greet-1', french: 'Bonjour', english: 'Hello / Good morning', category: 'greetings', difficulty: 1, exampleSentence: 'Bonjour, comment allez-vous?', exampleTranslation: 'Hello, how are you?' },
  { id: 'greet-2', french: 'Salut', english: 'Hi / Bye (informal)', category: 'greetings', difficulty: 1, exampleSentence: 'Salut, ça va?', exampleTranslation: 'Hi, how\'s it going?' },
  { id: 'greet-3', french: 'Bonsoir', english: 'Good evening', category: 'greetings', difficulty: 1, exampleSentence: 'Bonsoir, madame.', exampleTranslation: 'Good evening, madam.' },
  { id: 'greet-4', french: 'Au revoir', english: 'Goodbye', category: 'greetings', difficulty: 1, exampleSentence: 'Au revoir et bonne journée!', exampleTranslation: 'Goodbye and have a nice day!' },
  { id: 'greet-5', french: 'Merci', english: 'Thank you', category: 'greetings', difficulty: 1, exampleSentence: 'Merci beaucoup!', exampleTranslation: 'Thank you very much!' },
  { id: 'greet-6', french: 'S\'il vous plaît', english: 'Please (formal)', category: 'greetings', difficulty: 1, exampleSentence: 'Un café, s\'il vous plaît.', exampleTranslation: 'A coffee, please.' },
  { id: 'greet-7', french: 'De rien', english: 'You\'re welcome', category: 'greetings', difficulty: 1, exampleSentence: 'De rien, c\'est normal.', exampleTranslation: 'You\'re welcome, it\'s nothing.' },
  { id: 'greet-8', french: 'Excusez-moi', english: 'Excuse me', category: 'greetings', difficulty: 1, exampleSentence: 'Excusez-moi, où est la gare?', exampleTranslation: 'Excuse me, where is the train station?' },
  { id: 'greet-9', french: 'Comment allez-vous?', english: 'How are you? (formal)', category: 'greetings', difficulty: 2, exampleSentence: 'Bonjour, comment allez-vous?', exampleTranslation: 'Hello, how are you?' },
  { id: 'greet-10', french: 'Ça va?', english: 'How\'s it going? (informal)', category: 'greetings', difficulty: 1, exampleSentence: 'Salut, ça va?', exampleTranslation: 'Hi, how\'s it going?' },

  // Numbers 1-20
  { id: 'num-1', french: 'un', english: 'one', category: 'numbers', difficulty: 1, exampleSentence: 'J\'ai un chat.', exampleTranslation: 'I have one cat.' },
  { id: 'num-2', french: 'deux', english: 'two', category: 'numbers', difficulty: 1 },
  { id: 'num-3', french: 'trois', english: 'three', category: 'numbers', difficulty: 1 },
  { id: 'num-4', french: 'quatre', english: 'four', category: 'numbers', difficulty: 1 },
  { id: 'num-5', french: 'cinq', english: 'five', category: 'numbers', difficulty: 1 },
  { id: 'num-6', french: 'six', english: 'six', category: 'numbers', difficulty: 1 },
  { id: 'num-7', french: 'sept', english: 'seven', category: 'numbers', difficulty: 1 },
  { id: 'num-8', french: 'huit', english: 'eight', category: 'numbers', difficulty: 1 },
  { id: 'num-9', french: 'neuf', english: 'nine', category: 'numbers', difficulty: 1 },
  { id: 'num-10', french: 'dix', english: 'ten', category: 'numbers', difficulty: 1 },
  { id: 'num-11', french: 'onze', english: 'eleven', category: 'numbers', difficulty: 1 },
  { id: 'num-12', french: 'douze', english: 'twelve', category: 'numbers', difficulty: 1 },
  { id: 'num-13', french: 'treize', english: 'thirteen', category: 'numbers', difficulty: 1 },
  { id: 'num-14', french: 'quatorze', english: 'fourteen', category: 'numbers', difficulty: 1 },
  { id: 'num-15', french: 'quinze', english: 'fifteen', category: 'numbers', difficulty: 1 },
  { id: 'num-16', french: 'seize', english: 'sixteen', category: 'numbers', difficulty: 2 },
  { id: 'num-17', french: 'dix-sept', english: 'seventeen', category: 'numbers', difficulty: 2 },
  { id: 'num-18', french: 'dix-huit', english: 'eighteen', category: 'numbers', difficulty: 2 },
  { id: 'num-19', french: 'dix-neuf', english: 'nineteen', category: 'numbers', difficulty: 2 },
  { id: 'num-20', french: 'vingt', english: 'twenty', category: 'numbers', difficulty: 1 },

  // Colors
  { id: 'col-1', french: 'rouge', english: 'red', category: 'colors', difficulty: 1, exampleSentence: 'La pomme est rouge.', exampleTranslation: 'The apple is red.' },
  { id: 'col-2', french: 'bleu', english: 'blue', category: 'colors', difficulty: 1 },
  { id: 'col-3', french: 'vert', english: 'green', category: 'colors', difficulty: 1 },
  { id: 'col-4', french: 'jaune', english: 'yellow', category: 'colors', difficulty: 1 },
  { id: 'col-5', french: 'noir', english: 'black', category: 'colors', difficulty: 1 },
  { id: 'col-6', french: 'blanc', english: 'white', category: 'colors', difficulty: 1 },
  { id: 'col-7', french: 'orange', english: 'orange', category: 'colors', difficulty: 1 },
  { id: 'col-8', french: 'violet', english: 'purple', category: 'colors', difficulty: 1 },
  { id: 'col-9', french: 'rose', english: 'pink', category: 'colors', difficulty: 1 },
  { id: 'col-10', french: 'gris', english: 'grey', category: 'colors', difficulty: 1 },

  // Days of week
  { id: 'day-1', french: 'lundi', english: 'Monday', category: 'time', difficulty: 1 },
  { id: 'day-2', french: 'mardi', english: 'Tuesday', category: 'time', difficulty: 1 },
  { id: 'day-3', french: 'mercredi', english: 'Wednesday', category: 'time', difficulty: 1 },
  { id: 'day-4', french: 'jeudi', english: 'Thursday', category: 'time', difficulty: 1 },
  { id: 'day-5', french: 'vendredi', english: 'Friday', category: 'time', difficulty: 1 },
  { id: 'day-6', french: 'samedi', english: 'Saturday', category: 'time', difficulty: 1 },
  { id: 'day-7', french: 'dimanche', english: 'Sunday', category: 'time', difficulty: 1 },

  // Months
  { id: 'mon-1', french: 'janvier', english: 'January', category: 'time', difficulty: 2 },
  { id: 'mon-2', french: 'février', english: 'February', category: 'time', difficulty: 2 },
  { id: 'mon-3', french: 'mars', english: 'March', category: 'time', difficulty: 1 },
  { id: 'mon-4', french: 'avril', english: 'April', category: 'time', difficulty: 1 },
  { id: 'mon-5', french: 'mai', english: 'May', category: 'time', difficulty: 1 },
  { id: 'mon-6', french: 'juin', english: 'June', category: 'time', difficulty: 1 },
  { id: 'mon-7', french: 'juillet', english: 'July', category: 'time', difficulty: 2 },
  { id: 'mon-8', french: 'août', english: 'August', category: 'time', difficulty: 2 },
  { id: 'mon-9', french: 'septembre', english: 'September', category: 'time', difficulty: 2 },
  { id: 'mon-10', french: 'octobre', english: 'October', category: 'time', difficulty: 2 },
  { id: 'mon-11', french: 'novembre', english: 'November', category: 'time', difficulty: 2 },
  { id: 'mon-12', french: 'décembre', english: 'December', category: 'time', difficulty: 2 },
];

// All basics words combined - simple category selection helper
export function getWordsByCategory(category: string): VocabWord[] {
  return basicsWords.filter(w => w.category === category);
}

export function getWordsByDifficulty(difficulty: 1 | 2 | 3): VocabWord[] {
  return basicsWords.filter(w => w.difficulty === difficulty);
}

export function getAllWordIds(): string[] {
  return basicsWords.map(w => w.id);
}
