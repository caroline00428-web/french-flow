import type { VocabWord, ListeningItem, DictationItem } from '../types';

// ============================================================
// A0-A1 Food & Drinks vocabulary
// ============================================================

export const foodWords: VocabWord[] = [
  { id: 'food-1', french: 'le pain', english: 'bread', category: 'food', difficulty: 1, exampleSentence: 'Je mange du pain.', exampleTranslation: 'I eat bread.' },
  { id: 'food-2', french: 'le fromage', english: 'cheese', category: 'food', difficulty: 1, exampleSentence: 'Le fromage français est délicieux.', exampleTranslation: 'French cheese is delicious.' },
  { id: 'food-3', french: 'le croissant', english: 'croissant', category: 'food', difficulty: 1, exampleSentence: 'Je prends un croissant au petit déjeuner.', exampleTranslation: 'I have a croissant for breakfast.' },
  { id: 'food-4', french: 'la baguette', english: 'baguette', category: 'food', difficulty: 1, exampleSentence: 'Une baguette, s\'il vous plaît.', exampleTranslation: 'A baguette, please.' },
  { id: 'food-5', french: 'le beurre', english: 'butter', category: 'food', difficulty: 1 },
  { id: 'food-6', french: 'la confiture', english: 'jam', category: 'food', difficulty: 2 },
  { id: 'food-7', french: 'le poulet', english: 'chicken', category: 'food', difficulty: 1, exampleSentence: 'Le poulet rôti est mon plat préféré.', exampleTranslation: 'Roast chicken is my favorite dish.' },
  { id: 'food-8', french: 'le poisson', english: 'fish', category: 'food', difficulty: 1 },
  { id: 'food-9', french: 'la viande', english: 'meat', category: 'food', difficulty: 1 },
  { id: 'food-10', french: 'les légumes', english: 'vegetables', category: 'food', difficulty: 1, exampleSentence: 'Je mange des légumes tous les jours.', exampleTranslation: 'I eat vegetables every day.' },
  { id: 'food-11', french: 'le riz', english: 'rice', category: 'food', difficulty: 1 },
  { id: 'food-12', french: 'les pâtes', english: 'pasta', category: 'food', difficulty: 1 },
  { id: 'food-13', french: 'la salade', english: 'salad', category: 'food', difficulty: 1 },
  { id: 'food-14', french: 'le chocolat', english: 'chocolate', category: 'food', difficulty: 1, exampleSentence: 'J\'adore le chocolat!', exampleTranslation: 'I love chocolate!' },
  { id: 'food-15', french: 'le gâteau', english: 'cake', category: 'food', difficulty: 1 },
  { id: 'food-16', french: 'la glace', english: 'ice cream', category: 'food', difficulty: 1 },
  { id: 'food-17', french: 'l\'œuf', english: 'egg', category: 'food', difficulty: 2, exampleSentence: 'Je voudrais deux œufs.', exampleTranslation: 'I would like two eggs.' },
  { id: 'food-18', french: 'la soupe', english: 'soup', category: 'food', difficulty: 1 },
  { id: 'food-19', french: 'le jambon', english: 'ham', category: 'food', difficulty: 2 },
  { id: 'food-20', french: 'la crêpe', english: 'crepe', category: 'food', difficulty: 2 },

  // Drinks
  { id: 'drink-1', french: 'l\'eau', english: 'water', category: 'drinks', difficulty: 1, exampleSentence: 'De l\'eau, s\'il vous plaît.', exampleTranslation: 'Water, please.' },
  { id: 'drink-2', french: 'le café', english: 'coffee', category: 'drinks', difficulty: 1, exampleSentence: 'Un café noir, s\'il vous plaît.', exampleTranslation: 'A black coffee, please.' },
  { id: 'drink-3', french: 'le thé', english: 'tea', category: 'drinks', difficulty: 1 },
  { id: 'drink-4', french: 'le vin', english: 'wine', category: 'drinks', difficulty: 1, exampleSentence: 'Un verre de vin rouge.', exampleTranslation: 'A glass of red wine.' },
  { id: 'drink-5', french: 'la bière', english: 'beer', category: 'drinks', difficulty: 1 },
  { id: 'drink-6', french: 'le jus d\'orange', english: 'orange juice', category: 'drinks', difficulty: 1, exampleSentence: 'Un jus d\'orange frais.', exampleTranslation: 'A fresh orange juice.' },
  { id: 'drink-7', french: 'le lait', english: 'milk', category: 'drinks', difficulty: 1 },
  { id: 'drink-8', french: 'le chocolat chaud', english: 'hot chocolate', category: 'drinks', difficulty: 2 },
];

// Combined all food/drink words
export const allFoodWords = [...foodWords];

// Listening exercises: food & drink theme
export const foodListening: ListeningItem[] = [
  { id: 'fl-1', french: 'Je voudrais un café, s\'il vous plaît.', english: 'I would like a coffee, please.', options: ['I would like a coffee, please.', 'I want some tea.', 'Give me some water.', 'A glass of wine, please.'], correctIndex: 0, category: 'food', difficulty: 1 },
  { id: 'fl-2', french: 'Le pain est très bon.', english: 'The bread is very good.', options: ['The bread is very good.', 'The cheese is delicious.', 'The cake is sweet.', 'The soup is hot.'], correctIndex: 0, category: 'food', difficulty: 1 },
  { id: 'fl-3', french: 'Je mange une salade.', english: 'I am eating a salad.', options: ['I am eating a salad.', 'I am drinking water.', 'I like pasta.', 'The fish is fresh.'], correctIndex: 0, category: 'food', difficulty: 1 },
  { id: 'fl-4', french: 'Un verre de vin rouge, s\'il vous plaît.', english: 'A glass of red wine, please.', options: ['A glass of red wine, please.', 'A cup of coffee.', 'A bottle of water.', 'A beer, please.'], correctIndex: 0, category: 'drinks', difficulty: 2 },
  { id: 'fl-5', french: 'Le croissant est délicieux.', english: 'The croissant is delicious.', options: ['The croissant is delicious.', 'The baguette is fresh.', 'The bread is warm.', 'The cake is good.'], correctIndex: 0, category: 'food', difficulty: 1 },
  { id: 'fl-6', french: 'J\'adore le fromage français.', english: 'I love French cheese.', options: ['I love French cheese.', 'I like French bread.', 'I want French wine.', 'I eat French food.'], correctIndex: 0, category: 'food', difficulty: 2 },
  { id: 'fl-7', french: 'De l\'eau minérale, s\'il vous plaît.', english: 'Mineral water, please.', options: ['Mineral water, please.', 'Hot water, please.', 'Orange juice, please.', 'Milk, please.'], correctIndex: 0, category: 'drinks', difficulty: 2 },
  { id: 'fl-8', french: 'Je prends mon petit déjeuner à sept heures.', english: 'I have breakfast at 7 o\'clock.', options: ['I have breakfast at 7 o\'clock.', 'I eat lunch at noon.', 'I have dinner at 8.', 'I drink coffee in the morning.'], correctIndex: 0, category: 'food', difficulty: 2 },
];

// Dictation: food theme
export const foodDictation: DictationItem[] = [
  { id: 'fd-1', french: 'pain', english: 'bread', difficulty: 1 },
  { id: 'fd-2', french: 'café', english: 'coffee', difficulty: 1 },
  { id: 'fd-3', french: 'fromage', english: 'cheese', difficulty: 1 },
  { id: 'fd-4', french: 'croissant', english: 'croissant', difficulty: 2 },
  { id: 'fd-5', french: 'Je voudrais un café.', english: 'I would like a coffee.', difficulty: 2 },
  { id: 'fd-6', french: 'Le pain est bon.', english: 'The bread is good.', difficulty: 2 },
  { id: 'fd-7', french: 'baguette', english: 'baguette', difficulty: 2 },
  { id: 'fd-8', french: 'J\'adore le chocolat.', english: 'I love chocolate.', difficulty: 3 },
];
