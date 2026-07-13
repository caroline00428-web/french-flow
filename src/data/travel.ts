import type { VocabWord } from '../types';

// ============================================================
// A1 Travel & Work vocabulary
// For the goal of eventually working in France 🇫🇷
// ============================================================

export const travelWords: VocabWord[] = [
  // Places
  { id: 'trv-1', french: 'la gare', english: 'train station', category: 'travel', difficulty: 1, exampleSentence: 'Où est la gare?', exampleTranslation: 'Where is the train station?' },
  { id: 'trv-2', french: 'l\'aéroport', english: 'airport', category: 'travel', difficulty: 2, exampleSentence: 'Je vais à l\'aéroport.', exampleTranslation: 'I am going to the airport.' },
  { id: 'trv-3', french: 'l\'hôtel', english: 'hotel', category: 'travel', difficulty: 1, exampleSentence: 'L\'hôtel est près de la gare.', exampleTranslation: 'The hotel is near the station.' },
  { id: 'trv-4', french: 'le restaurant', english: 'restaurant', category: 'travel', difficulty: 1, exampleSentence: 'Le restaurant est ouvert.', exampleTranslation: 'The restaurant is open.' },
  { id: 'trv-5', french: 'le métro', english: 'subway / metro', category: 'travel', difficulty: 1, exampleSentence: 'Je prends le métro.', exampleTranslation: 'I take the metro.' },
  { id: 'trv-6', french: 'la rue', english: 'street', category: 'travel', difficulty: 1, exampleSentence: 'C\'est dans cette rue.', exampleTranslation: 'It\'s on this street.' },
  { id: 'trv-7', french: 'le musée', english: 'museum', category: 'travel', difficulty: 1, exampleSentence: 'Le Louvre est un grand musée.', exampleTranslation: 'The Louvre is a big museum.' },
  { id: 'trv-8', french: 'la pharmacie', english: 'pharmacy', category: 'travel', difficulty: 2, exampleSentence: 'Il y a une pharmacie ici?', exampleTranslation: 'Is there a pharmacy here?' },
  { id: 'trv-9', french: 'le supermarché', english: 'supermarket', category: 'travel', difficulty: 2 },
  { id: 'trv-10', french: 'la poste', english: 'post office', category: 'travel', difficulty: 2 },

  // Directions
  { id: 'trv-11', french: 'à gauche', english: 'on the left / to the left', category: 'travel', difficulty: 1, exampleSentence: 'Tournez à gauche.', exampleTranslation: 'Turn left.' },
  { id: 'trv-12', french: 'à droite', english: 'on the right / to the right', category: 'travel', difficulty: 1, exampleSentence: 'C\'est à droite.', exampleTranslation: 'It\'s on the right.' },
  { id: 'trv-13', french: 'tout droit', english: 'straight ahead', category: 'travel', difficulty: 1, exampleSentence: 'Allez tout droit.', exampleTranslation: 'Go straight ahead.' },
  { id: 'trv-14', french: 'près de', english: 'near', category: 'travel', difficulty: 1 },
  { id: 'trv-15', french: 'loin de', english: 'far from', category: 'travel', difficulty: 1 },
  { id: 'trv-16', french: 'ici', english: 'here', category: 'travel', difficulty: 1, exampleSentence: 'C\'est ici.', exampleTranslation: 'It\'s here.' },
  { id: 'trv-17', french: 'là-bas', english: 'over there', category: 'travel', difficulty: 1, exampleSentence: 'La boulangerie est là-bas.', exampleTranslation: 'The bakery is over there.' },

  // Transportation
  { id: 'trv-18', french: 'le train', english: 'train', category: 'travel', difficulty: 1, exampleSentence: 'Le train part à midi.', exampleTranslation: 'The train leaves at noon.' },
  { id: 'trv-19', french: 'le bus', english: 'bus', category: 'travel', difficulty: 1 },
  { id: 'trv-20', french: 'le taxi', english: 'taxi', category: 'travel', difficulty: 1 },
  { id: 'trv-21', french: 'la voiture', english: 'car', category: 'travel', difficulty: 1 },
  { id: 'trv-22', french: 'le vélo', english: 'bicycle', category: 'travel', difficulty: 1 },
  { id: 'trv-23', french: 'le billet', english: 'ticket', category: 'travel', difficulty: 1, exampleSentence: 'Un billet pour Paris, s\'il vous plaît.', exampleTranslation: 'A ticket to Paris, please.' },
  { id: 'trv-24', french: 'le passeport', english: 'passport', category: 'travel', difficulty: 2 },
  { id: 'trv-25', french: 'la valise', english: 'suitcase', category: 'travel', difficulty: 2 },

  // Work-related (for the goal of working in France!)
  { id: 'wrk-1', french: 'le travail', english: 'work / job', category: 'work', difficulty: 1, exampleSentence: 'Je cherche du travail.', exampleTranslation: 'I am looking for work.' },
  { id: 'wrk-2', french: 'le bureau', english: 'office / desk', category: 'work', difficulty: 1, exampleSentence: 'Je travaille dans un bureau.', exampleTranslation: 'I work in an office.' },
  { id: 'wrk-3', french: 'l\'entreprise', english: 'company', category: 'work', difficulty: 2, exampleSentence: 'L\'entreprise est grande.', exampleTranslation: 'The company is big.' },
  { id: 'wrk-4', french: 'le collègue', english: 'colleague', category: 'work', difficulty: 2, exampleSentence: 'C\'est mon collègue.', exampleTranslation: 'This is my colleague.' },
  { id: 'wrk-5', french: 'la réunion', english: 'meeting', category: 'work', difficulty: 2, exampleSentence: 'J\'ai une réunion à 14h.', exampleTranslation: 'I have a meeting at 2pm.' },
  { id: 'wrk-6', french: 'le CV', english: 'resume / CV', category: 'work', difficulty: 1, exampleSentence: 'J\'ai envoyé mon CV.', exampleTranslation: 'I sent my resume.' },
  { id: 'wrk-7', french: 'l\'entretien', english: 'interview', category: 'work', difficulty: 2, exampleSentence: 'J\'ai un entretien demain.', exampleTranslation: 'I have an interview tomorrow.' },
  { id: 'wrk-8', french: 'le salaire', english: 'salary', category: 'work', difficulty: 2 },
  { id: 'wrk-9', french: 'le contrat', english: 'contract', category: 'work', difficulty: 2 },
  { id: 'wrk-10', french: 'l\'ordinateur', english: 'computer', category: 'work', difficulty: 1, exampleSentence: 'J\'utilise un ordinateur.', exampleTranslation: 'I use a computer.' },
  { id: 'wrk-11', french: 'le courriel / l\'email', english: 'email', category: 'work', difficulty: 1, exampleSentence: 'Je vous envoie un courriel.', exampleTranslation: 'I am sending you an email.' },
  { id: 'wrk-12', french: 'la candidature', english: 'job application', category: 'work', difficulty: 3, exampleSentence: 'J\'ai déposé ma candidature.', exampleTranslation: 'I submitted my application.' },
  { id: 'wrk-13', french: 'le stage', english: 'internship', category: 'work', difficulty: 2 },
  { id: 'wrk-14', french: 'le patron / la patronne', english: 'boss (m/f)', category: 'work', difficulty: 2 },
  { id: 'wrk-15', french: 'le rendez-vous', english: 'appointment / meeting', category: 'work', difficulty: 2, exampleSentence: 'J\'ai un rendez-vous à 10h.', exampleTranslation: 'I have an appointment at 10am.' },
];

export function getWorkWords(): VocabWord[] {
  return travelWords.filter(w => w.category === 'work');
}

export function getTravelWords(): VocabWord[] {
  return travelWords.filter(w => w.category === 'travel');
}
