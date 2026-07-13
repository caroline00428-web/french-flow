import type { GrammarLesson } from '../types';

// ============================================================
// A0-A2 Grammar Lessons
// ============================================================

export const grammarLessons: GrammarLesson[] = [
  // ======== A0 LESSONS ========
  {
    id: 'gram-a0-1',
    title: 'Noun Gender: le, la, l\'',
    titleZh: '名词性别：le, la, l\'',
    level: 'A0',
    explanation: `In French, every noun has a gender — masculine or feminine. There are no neutral nouns.

**le** = the (masculine): le pain, le fromage, le café
**la** = the (feminine): la baguette, la salade, la bière
**l'** = the (before vowels or silent h): l'eau, l'ami, l'hôtel

**Tips for guessing gender:**
- Words ending in **-e** are often feminine: la table, la chaise, la porte
- Words ending in **-age, -ment, -eau** are often masculine: le fromage, le monument, le bureau
- BUT there are many exceptions! Always learn the article with the noun.

**un** = a/an (masculine): un café, un croissant
**une** = a/an (feminine): une baguette, une bière

**des** = some (plural): des croissants, des baguettes`,
    examples: [
      { french: 'le pain', english: 'the bread', notes: 'masculine' },
      { french: 'la salade', english: 'the salad', notes: 'feminine' },
      { french: 'l\'eau', english: 'the water', notes: 'feminine, but l\' before vowel' },
      { french: 'un café', english: 'a coffee', notes: 'masculine, indefinite' },
      { french: 'une bière', english: 'a beer', notes: 'feminine, indefinite' },
      { french: 'des amis', english: 'some friends', notes: 'plural' },
    ],
    exercises: [
      { type: 'multiple-choice', question: '___ pain (bread)', options: ['le', 'la', 'l\'', 'les'], correctAnswer: 'le', hint: 'pain ends with a consonant, most non-e-ending words are masculine' },
      { type: 'multiple-choice', question: '___ eau (water)', options: ['le', 'la', 'l\'', 'un'], correctAnswer: 'l\'', hint: 'eau starts with a vowel' },
      { type: 'multiple-choice', question: '___ baguette', options: ['le', 'la', 'un', 'des'], correctAnswer: 'la', hint: 'words ending in -ette are feminine' },
      { type: 'fill-blank', question: '___ café (a coffee)', options: undefined, correctAnswer: 'un', hint: 'indefinite article, masculine' },
      { type: 'fill-blank', question: 'Je voudrais ___ croissant.', options: undefined, correctAnswer: 'un', hint: 'a croissant — indefinite masculine' },
    ],
  },
  {
    id: 'gram-a0-2',
    title: 'The Verb Être (to be)',
    titleZh: '动词 Être（是）',
    level: 'A0',
    explanation: `**être** = to be — the most important French verb!

| Person | Form | Example |
|--------|------|---------|
| je (I) | **suis** | Je suis français. = I am French. |
| tu (you, informal) | **es** | Tu es gentil. = You are kind. |
| il/elle (he/she) | **est** | Elle est belle. = She is beautiful. |
| nous (we) | **sommes** | Nous sommes fatigués. = We are tired. |
| vous (you, formal/pl) | **êtes** | Vous êtes très aimable. = You are very kind. |
| ils/elles (they) | **sont** | Ils sont contents. = They are happy. |

The final consonants are silent: suis (swee), es (ay), est (ay), sont (so^n — nasal).`,
    examples: [
      { french: 'Je suis étudiant.', english: 'I am a student.' },
      { french: 'Tu es mon ami.', english: 'You are my friend.' },
      { french: 'Il est médecin.', english: 'He is a doctor.' },
      { french: 'Nous sommes à Paris.', english: 'We are in Paris.' },
      { french: 'Vous êtes en retard.', english: 'You are late.' },
      { french: 'Elles sont françaises.', english: 'They (f) are French.' },
    ],
    exercises: [
      { type: 'fill-blank', question: 'Je ___ français.', correctAnswer: 'suis', hint: 'I am = je ___' },
      { type: 'fill-blank', question: 'Elle ___ belle.', correctAnswer: 'est', hint: 'She is = elle ___' },
      { type: 'fill-blank', question: 'Nous ___ contents.', correctAnswer: 'sommes', hint: 'We are = nous ___' },
      { type: 'multiple-choice', question: 'Ils ___ à la maison.', options: ['est', 'sont', 'sommes', 'êtes'], correctAnswer: 'sont', hint: 'They (m) are = ils ___' },
      { type: 'fill-blank', question: 'Tu ___ très gentil.', correctAnswer: 'es', hint: 'You (informal) are = tu ___' },
    ],
  },
  {
    id: 'gram-a0-3',
    title: 'The Verb Avoir (to have)',
    titleZh: '动词 Avoir（有）',
    level: 'A0',
    explanation: `**avoir** = to have — second most important verb!

| Person | Form | Example |
|--------|------|---------|
| je/j' | **ai** | J'ai un chat. = I have a cat. |
| tu | **as** | Tu as raison. = You are right (lit: you have reason). |
| il/elle | **a** | Il a vingt ans. = He is 20 (lit: he has 20 years). |
| nous | **avons** | Nous avons une maison. = We have a house. |
| vous | **avez** | Vous avez l'heure? = Do you have the time? |
| ils/elles | **ont** | Elles ont faim. = They are hungry (lit: they have hunger). |

**Important!** French uses "avoir" for age, hunger, thirst, fear:
- J'ai faim = I am hungry
- J'ai soif = I am thirsty
- J'ai peur = I am afraid
- J'ai ___ ans = I am ___ years old`,
    examples: [
      { french: 'J\'ai un chien.', english: 'I have a dog.' },
      { french: 'Tu as faim?', english: 'Are you hungry?' },
      { french: 'Il a 30 ans.', english: 'He is 30 years old.' },
      { french: 'Nous avons une réunion.', english: 'We have a meeting.' },
      { french: 'Vous avez un stylo?', english: 'Do you have a pen?' },
      { french: 'Ils ont soif.', english: 'They are thirsty.' },
    ],
    exercises: [
      { type: 'fill-blank', question: 'J\'___ un livre.', correctAnswer: 'ai', hint: 'I have = j\'___' },
      { type: 'fill-blank', question: 'Elle ___ deux enfants.', correctAnswer: 'a', hint: 'She has = elle ___' },
      { type: 'fill-blank', question: 'Nous ___ faim.', correctAnswer: 'avons', hint: 'We have/are hungry = nous ___ faim' },
      { type: 'multiple-choice', question: 'Ils ___ une grande maison.', options: ['a', 'as', 'ont', 'avez'], correctAnswer: 'ont', hint: 'They have = ils ___' },
    ],
  },

  // ======== A1 LESSONS ========
  {
    id: 'gram-a1-1',
    title: 'Present Tense: -ER Verbs',
    titleZh: '现在时：-ER 动词变位',
    level: 'A1',
    explanation: `Most French verbs end in **-ER** (about 80%!). They follow a regular pattern.

Take **parler** (to speak):
1. Remove -ER → **parl-** (the stem)
2. Add endings:

| Person | Ending | Example (parler) |
|--------|--------|------------------|
| je | **-e** | je parle |
| tu | **-es** | tu parles |
| il/elle | **-e** | il parle |
| nous | **-ons** | nous parlons |
| vous | **-ez** | vous parlez |
| ils/elles | **-ent** | ils parlent |

**Note:** je/tu/il/elle and ils/elles forms all SOUND the same! The endings are silent.

Other -ER verbs following this pattern:
- aimer (to like/love) → j'aime, tu aimes...
- habiter (to live) → j'habite, tu habites...
- travailler (to work) → je travaille, tu travailles...
- manger (to eat) → je mange, tu manges... (nous: mange**ons**)`,
    examples: [
      { french: 'Je parle français.', english: 'I speak French.' },
      { french: 'Tu habites où?', english: 'Where do you live?' },
      { french: 'Elle travaille à Paris.', english: 'She works in Paris.' },
      { french: 'Nous aimons le chocolat.', english: 'We like chocolate.' },
      { french: 'Vous parlez anglais?', english: 'Do you speak English?' },
      { french: 'Ils mangent au restaurant.', english: 'They eat at the restaurant.' },
    ],
    exercises: [
      { type: 'fill-blank', question: 'Je ___ (parler) français.', correctAnswer: 'parle', hint: 'je form: stem + e' },
      { type: 'fill-blank', question: 'Nous ___ (aimer) le cinéma.', correctAnswer: 'aimons', hint: 'nous form: stem + ons' },
      { type: 'fill-blank', question: 'Vous ___ (travailler) beaucoup.', correctAnswer: 'travaillez', hint: 'vous form: stem + ez' },
      { type: 'fill-blank', question: 'Tu ___ (habiter) à Lyon?', correctAnswer: 'habites', hint: 'tu form: stem + es' },
    ],
  },
  {
    id: 'gram-a1-2',
    title: 'Negation: ne...pas',
    titleZh: '否定：ne...pas',
    level: 'A1',
    explanation: `To make a sentence negative in French, wrap the verb with **ne...pas**:

**Rule:** subject + **ne** + verb + **pas** + rest

| Positive | Negative |
|----------|----------|
| Je parle français. | Je **ne** parle **pas** français. |
| Il est fatigué. | Il **n'**est **pas** fatigué. |
| Nous aimons le café. | Nous **n'**aimons **pas** le café. |

**n'** is used when the verb starts with a vowel (est → n'est, aime → n'aime).

**In spoken French**, "ne" is often dropped:
- Je parle pas. (casual, very common!)
- J'aime pas ça. (I don't like that.)`,
    examples: [
      { french: 'Je ne comprends pas.', english: 'I don\'t understand.' },
      { french: 'Il n\'est pas français.', english: 'He is not French.' },
      { french: 'Je n\'ai pas de temps.', english: 'I don\'t have time.' },
      { french: 'Elle ne travaille pas ici.', english: 'She doesn\'t work here.' },
    ],
    exercises: [
      { type: 'fill-blank', question: 'Je ___ comprends ___. (don\'t understand)', correctAnswer: 'ne...pas', hint: 'ne before the verb, pas after' },
      { type: 'fill-blank', question: 'Elle ___ est ___ contente. (isn\'t happy)', correctAnswer: 'ne...pas', hint: 'n\' before vowel → n\'est pas' },
      { type: 'multiple-choice', question: 'Which is correct?', options: ['Je pas parle.', 'Je ne parle pas.', 'Je parle ne pas.', 'Ne je parle pas.'], correctAnswer: 'Je ne parle pas.', hint: 'ne before verb, pas after verb' },
    ],
  },

  // ======== A2 LESSONS ========
  {
    id: 'gram-a2-1',
    title: 'Passé Composé (Past Tense)',
    titleZh: '复合过去时',
    level: 'A2',
    explanation: `The **passé composé** is the most common way to express the past in spoken French.

**Formula:** avoir/être (present) + past participle

**With avoir** (most verbs):
- J'ai **mangé** = I ate / I have eaten
- Tu as **parlé** = You spoke
- Il a **fini** = He finished

**Past participle formation:**
- -ER verbs → -**é**: parler → parlé, manger → mangé
- -IR verbs → -**i**: finir → fini, choisir → choisi
- -RE verbs → -**u**: vendre → vendu, attendre → attendu

**With être** (movement/state verbs — "Dr. & Mrs. Vandertramp"):
- Je suis **allé(e)** = I went
- Elle est **née** = She was born
- Ils sont **arrivés** = They arrived

With être, the participle agrees with the subject (add -e for feminine, -s for plural).`,
    examples: [
      { french: 'J\'ai mangé une pizza.', english: 'I ate a pizza.' },
      { french: 'Elle a parlé au directeur.', english: 'She spoke to the director.' },
      { french: 'Nous sommes allés au cinéma.', english: 'We went to the cinema.' },
      { french: 'Je suis né en Chine.', english: 'I was born in China.' },
      { french: 'Ils ont fini le projet.', english: 'They finished the project.' },
    ],
    exercises: [
      { type: 'fill-blank', question: 'J\'___ ___ (manger) une salade.', correctAnswer: 'ai mangé', hint: 'I ate = j\'ai + past participle of manger' },
      { type: 'fill-blank', question: 'Elle ___ ___ (aller) à Paris.', correctAnswer: 'est allée', hint: 'aller uses être + feminine agreement' },
      { type: 'multiple-choice', question: 'Nous ___ au restaurant hier.', options: ['avons mangé', 'sommes mangé', 'a mangé', 'mangeons'], correctAnswer: 'avons mangé', hint: 'manger uses avoir; nous form of avoir is avons' },
    ],
  },
  {
    id: 'gram-a2-2',
    title: 'Basic Questions',
    titleZh: '基础问句',
    level: 'A2',
    explanation: `Three ways to ask questions in French:

**1. Intonation (casual):** Just raise your voice at the end.
- Tu parles français? ↗

**2. Est-ce que (standard):** Add "est-ce que" at the beginning.
- **Est-ce que** tu parles français?

**3. Inversion (formal):** Swap subject and verb.
- Parles-**tu** français?

**Question words:**
- **Qui** = Who
- **Quoi / Que** = What
- **Où** = Where
- **Quand** = When
- **Pourquoi** = Why
- **Comment** = How
- **Combien** = How much / How many
- **Quel/Quelle** = Which`,
    examples: [
      { french: 'Comment tu t\'appelles?', english: 'What\'s your name?' },
      { french: 'Où habitez-vous?', english: 'Where do you live? (formal)' },
      { french: 'Qu\'est-ce que c\'est?', english: 'What is this?' },
      { french: 'Pourquoi est-ce que tu apprends le français?', english: 'Why are you learning French?' },
      { french: 'Combien ça coûte?', english: 'How much does it cost?' },
    ],
    exercises: [
      { type: 'fill-blank', question: '___ est-ce que tu t\'appelles? (What is your name?)', correctAnswer: 'Comment', hint: '"How" do you call yourself? → Comment' },
      { type: 'multiple-choice', question: '___ habites-tu? (Where do you live?)', options: ['Qui', 'Où', 'Quand', 'Pourquoi'], correctAnswer: 'Où', hint: 'Where = Où' },
      { type: 'fill-blank', question: '___ ça coûte? (How much does it cost?)', correctAnswer: 'Combien', hint: 'How much = Combien' },
    ],
  },
];

// Helper to get lessons by level
export function getLessonsByLevel(level: string): GrammarLesson[] {
  return grammarLessons.filter(l => l.level === level);
}
