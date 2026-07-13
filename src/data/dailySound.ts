// ============================================================
// Daily Sound Focus — one sound per day, deep practice
// Based on: single-sound immersion + minimal pair comparison
// ============================================================

export interface DailySoundLesson {
  day: number;
  sound: string;
  ipa: string;
  focusWord: string; // the key word that anchors the sound
  description: string;
  words: string[]; // words all containing today's sound
  compare?: { // yesterday's sound for comparison
    sound: string;
    ipa: string;
    pairs: { a: string; b: string }[]; // minimal pairs
  };
  sentences: string[]; // sentences using today's words
}

// 30-day sound curriculum — from easiest to hardest
export const dailySoundCurriculum: DailySoundLesson[] = [
  // Week 1: Foundation vowels
  {
    day: 1, sound: 'i', ipa: '/i/', focusWord: 'ici',
    description: '法语最简单的音。嘴角向两边拉，和中文"衣"一样。',
    words: ['ici', 'vie', 'midi', 'fini', 'petit', 'Paris', 'il dit', 'la ville'],
    sentences: ['Il est ici.', 'La vie est belle.', 'J\'ai fini!', 'Il dit oui.'],
  },
  {
    day: 2, sound: 'a', ipa: '/a/', focusWord: 'la',
    description: '嘴张到最大，舌头放平。比中文"啊"更亮更靠前。',
    words: ['la', 'chat', 'papa', 'là-bas', 'déjà', 'voilà', 'la table', 'pas mal'],
    compare: { sound: 'i', ipa: '/i/', pairs: [
      { a: 'ici', b: 'là-bas' }, { a: 'vie', b: 'voilà' },
    ]},
    sentences: ['La table est là.', 'Le chat va là-bas.', 'Pas mal du tout!', 'Voilà le chat.'],
  },
  {
    day: 3, sound: 'è / ai', ipa: '/ɛ/', focusWord: 'très',
    description: '嘴半开。è/ê/ai/ei 都发这个音。记住：看到 ai 就念 è。',
    words: ['très', 'lait', 'belle', 'neige', 'fait', 'mais', 'français', 'la fête'],
    compare: { sound: 'é', ipa: '/e/', pairs: [
      { a: 'café (é闭口)', b: 'lait (è开口)' }, { a: 'fée', b: 'fait' },
    ]},
    sentences: ['C\'est très bien.', 'Je bois du lait.', 'Elle est belle.', 'Il fait beau.'],
  },
  {
    day: 4, sound: 'é', ipa: '/e/', focusWord: 'café',
    description: '嘴角向两边拉开，像在微笑。é/-er/-ez 都发这个音。',
    words: ['café', 'parler', 'chez', 'été', 'aller', 'assez', 'le dîner', 'bientôt'],
    compare: { sound: 'è', ipa: '/ɛ/', pairs: [
      { a: 'café (é)', b: 'lait (è)' }, { a: 'parler', b: 'parlait' },
    ]},
    sentences: ['Je bois un café.', 'Je vais parler.', 'Je suis chez moi.', 'Assez bien!'],
  },
  {
    day: 5, sound: 'ou', ipa: '/u/', focusWord: 'vous',
    description: '嘴唇撮圆，舌头后缩。接近中文"乌"。',
    words: ['vous', 'jour', 'tout', 'rouge', 'la bouche', 'bonjour', 'toujours', 'beaucoup'],
    compare: { sound: 'u', ipa: '/y/', pairs: [
      { a: 'vous (圆唇)', b: 'vu (撮口)' }, { a: 'tout (一切)', b: 'tu (你)' },
      { a: 'dessous (下面)', b: 'dessus (上面)' },
    ]},
    sentences: ['Bonjour à vous!', 'Tout est rouge.', 'Merci beaucoup.', 'Je suis toujours là.'],
  },
  {
    day: 6, sound: 'u', ipa: '/y/', focusWord: 'tu',
    description: '法语最难、最独特的音！舌头说 i，嘴唇说 ou。撮起来！',
    words: ['tu', 'rue', 'lune', 'plus', 'une', 'sur', 'du', 'la culture'],
    compare: { sound: 'ou', ipa: '/u/', pairs: [
      { a: 'tu (撮口)', b: 'tout (圆唇)' }, { a: 'rue (街)', b: 'roue (轮子)' },
      { a: 'dessus (上面)', b: 'dessous (下面)' },
    ]},
    sentences: ['Tu es dans la rue.', 'La lune est belle.', 'Une culture du vin.', 'Pas plus que ça.'],
  },
  {
    day: 7, sound: 'e (轻声)', ipa: '/ə/', focusWord: 'le',
    description: '最放松的音。嘴几乎不动。口语里经常被省略。',
    words: ['le', 'de', 'je', 'ce', 'que', 'petit', 'venir', 'regarder'],
    compare: { sound: 'é', ipa: '/e/', pairs: [
      { a: 'le (轻声)', b: 'les (é)' }, { a: 'de', b: 'des' },
    ]},
    sentences: ['Je le vois.', 'Ce petit chat.', 'Que veux-tu?', 'Regarder la télé.'],
  },

  // Week 2: Open/Close O + Nasals begin
  {
    day: 8, sound: 'o / au / eau', ipa: '/o/', focusWord: 'beau',
    description: '嘴唇撮圆但没 ou 那么紧。au/eau/ô 都发这个音。',
    words: ['beau', 'eau', 'mot', 'trop', 'bientôt', 'le château', 'cadeau', 'bureau'],
    compare: { sound: 'ou', ipa: '/u/', pairs: [
      { a: 'beau (o)', b: 'bout (ou)' }, { a: 'mot', b: 'mou' },
    ]},
    sentences: ['C\'est trop beau!', 'De l\'eau, s\'il vous plaît.', 'À bientôt!', 'Au bureau.'],
  },
  {
    day: 9, sound: 'o (开口)', ipa: '/ɔ/', focusWord: 'porte',
    description: '嘴比闭口o更大。出现在闭音节中。',
    words: ['porte', 'pomme', 'homme', 'école', 'encore', 'la note', 'donner', 'bonne'],
    compare: { sound: 'ô (闭口)', ipa: '/o/', pairs: [
      { a: 'pomme (开口)', b: 'paume (闭口)' }, { a: 'note', b: 'nôtre' },
    ]},
    sentences: ['Ouvre la porte.', 'Une pomme rouge.', 'Encore une fois.', 'Bonne idée!'],
  },
  {
    day: 10, sound: 'an / en', ipa: '/ɑ̃/', focusWord: 'enfant',
    description: '第一个鼻化元音。a的口型，气流从鼻子出来。不要加g音。',
    words: ['enfant', 'dans', 'an', 'temps', 'chambre', 'manger', 'français', 'maintenant'],
    sentences: ['Un enfant dans la chambre.', 'J\'ai un an.', 'En mangeant du pain.', 'Maintenant ou jamais.'],
  },
  {
    day: 11, sound: 'in / ain', ipa: '/ɛ̃/', focusWord: 'pain',
    description: 'è的口型，气流从鼻子出来。in/ain/ein 都一样。',
    words: ['pain', 'vin', 'plein', 'matin', 'prochain', 'le jardin', 'simple', 'important'],
    compare: { sound: 'an', ipa: '/ɑ̃/', pairs: [
      { a: 'pain (in)', b: 'paon (an)' }, { a: 'vin', b: 'vent' },
      { a: 'brin', b: 'brun' },
    ]},
    sentences: ['Du pain et du vin.', 'Le matin est plein.', 'C\'est simple.', 'Très important.'],
  },
  {
    day: 12, sound: 'on', ipa: '/ɔ̃/', focusWord: 'bon',
    description: 'o的口型，嘴唇撮圆，气流从鼻子出来。',
    words: ['bon', 'nom', 'maison', 'bonbon', 'façon', 'rond', 'le monde', 'comprendre'],
    compare: { sound: 'an', ipa: '/ɑ̃/', pairs: [
      { a: 'bon (on)', b: 'banc (an)' }, { a: 'nom', b: 'nan' },
    ]},
    sentences: ['C\'est très bon!', 'Mon nom est...', 'Tout le monde.', 'Je comprends.'],
  },

  // Week 3: Consonants + tricky vowels
  {
    day: 13, sound: 'R (小舌音)', ipa: '/ʁ/', focusWord: 'rouge',
    description: '舌头后部靠近小舌，气流摩擦。像轻轻漱口的声音。',
    words: ['rouge', 'rue', 'Paris', 'français', 'trois', 'vraiment', 'regarder', 'rencontrer'],
    sentences: ['La voiture rouge.', 'Je vis à Paris.', 'Vraiment?', 'Trois cafés.'],
  },
  {
    day: 14, sound: 'ch', ipa: '/ʃ/', focusWord: 'chat',
    description: '像英语 shoe。法语 ch 永远读 sh。',
    words: ['chat', 'chercher', 'chocolat', 'chambre', 'chanson', 'chaud', 'chose', 'changer'],
    compare: { sound: 'j (软g)', ipa: '/ʒ/', pairs: [
      { a: 'chat (sh)', b: 'jazz (j)' }, { a: 'chou (卷心菜)', b: 'joue (玩)' },
    ]},
    sentences: ['Le petit chat.', 'Je cherche un chocolat.', 'Quelque chose de chaud.', 'Change la chanson.'],
  },
  {
    day: 15, sound: 'j / g(软)', ipa: '/ʒ/', focusWord: 'je',
    description: 'g在e/i/y前发这个音。和英语 pleasure 的 s 一样。',
    words: ['je', 'manger', 'jour', 'rouge', 'déjà', 'génial', 'la neige', 'le fromage'],
    compare: { sound: 'ch', ipa: '/ʃ/', pairs: [
      { a: 'je (j)', b: 'chat (sh)' }, { a: 'manger', b: 'manche' },
    ]},
    sentences: ['Je mange du fromage.', 'Quel jour?', 'C\'est génial!', 'Déjà fini.'],
  },
  {
    day: 16, sound: 'oi', ipa: '/wa/', focusWord: 'moi',
    description: 'o + a 连起来。不是两个音节，是一个！',
    words: ['moi', 'toi', 'trois', 'pourquoi', 'noir', 'voir', 'boire', 'soirée'],
    sentences: ['C\'est pour moi.', 'Je bois de l\'eau.', 'Bonsoir!', 'Pourquoi pas?'],
  },
  {
    day: 17, sound: 'ui', ipa: '/ɥi/', focusWord: 'oui',
    description: '嘴唇撮圆然后快速变 i。注意 oui 和 ui 不一样！',
    words: ['oui', 'nuit', 'bruit', 'pluie', 'cuisine', 'depuis', 'traduire', 'la suite'],
    compare: { sound: 'u', ipa: '/y/', pairs: [
      { a: 'nuit (nwee)', b: 'nu (ny)' }, { a: 'depuis', b: 'du puits' },
    ]},
    sentences: ['Mais oui!', 'Bonne nuit.', 'Dans la cuisine.', 'Depuis longtemps.'],
  },

  // Week 4: Nasal combos + review
  {
    day: 18, sound: 'ien', ipa: '/jɛ̃/', focusWord: 'bien',
    description: 'i + in 连起来。不是两个鼻音，是一个复合鼻化元音。',
    words: ['bien', 'rien', 'chien', 'italien', 'le mien', 'ancien', 'parisien', 'musicien'],
    sentences: ['Très bien!', 'De rien.', 'Un chien mignon.', 'Je suis parisien.'],
  },
  {
    day: 19, sound: 'oin', ipa: '/wɛ̃/', focusWord: 'loin',
    description: 'oi + in。远→loin，少→moins，点→point。',
    words: ['loin', 'moins', 'point', 'coin', 'besoin', 'le soin', 'rejoindre', 'témoin'],
    compare: { sound: 'ien', ipa: '/jɛ̃/', pairs: [
      { a: 'bien (ien)', b: 'loin (oin)' }, { a: 'musicien', b: 'coin' },
    ]},
    sentences: ['C\'est loin?', 'Au moins ça.', 'J\'ai besoin d\'aide.', 'Un point important.'],
  },
  {
    day: 20, sound: 'gn', ipa: '/ɲ/', focusWord: 'montagne',
    description: '像英语 onion 的 ni。舌头中段贴住上颚。',
    words: ['montagne', 'Espagne', 'gagner', 'ligne', 'signer', 'mignon', 'champagne', 'la baignoire'],
    sentences: ['J\'aime la montagne.', 'En Espagne.', 'Tu as gagné!', 'Quel champagne!'],
  },

  // Days 21-30: Review and contrast
  { day: 21, sound: '对比复习：u vs ou', ipa: '/y/ vs /u/', focusWord: 'tu vs tout',
    description: '今天只做一件事：反复比较 u 和 ou。撮口 vs 圆唇。',
    words: ['tu', 'tout', 'rue', 'roue', 'dessus', 'dessous', 'vu', 'vous', 'pull', 'poule'],
    sentences: ['Tu as tout mangé?', 'Dans la rue, il y a une roue.', 'Le chat est dessus, le chien dessous.'],
  },
  { day: 22, sound: '对比复习：é vs è', ipa: '/e/ vs /ɛ/', focusWord: 'café vs lait',
    description: '嘴角拉开(é) vs 嘴半开(è)。微笑 vs 正常。',
    words: ['café', 'lait', 'parler', 'parlait', 'fée', 'fait', 'chez', 'chaise', 'pied', 'paix'],
    sentences: ['Je bois un café au lait.', 'Il parlait en parlant.', 'Chez moi, sur la chaise.'],
  },
  { day: 23, sound: '对比复习：an vs on vs in', ipa: '/ɑ̃/ vs /ɔ̃/ vs /ɛ̃/', focusWord: 'vent vs bon vs vin',
    description: '三大鼻化元音对决。嘴型从开到闭。',
    words: ['vent', 'bon', 'vin', 'dans', 'don', 'daim', 'temps', 'ton', 'teint', 'sans', 'son', 'sein'],
    sentences: ['Le vent est bon, le vin aussi.', 'Dans le son, un ton.', 'Sans bon vin?'],
  },
  { day: 24, sound: 'R + 元音组合', ipa: '', focusWord: 'train',
    description: '法语R和不同元音连接。R在词首、词中、词尾。',
    words: ['rue', 'rouge', 'rire', 'train', 'trois', 'très', 'grand', 'France', 'mer', 'partir'],
    sentences: ['Le train part pour Paris.', 'Rue de la Grande France.', 'Trois rires rouges.'],
  },
  { day: 25, sound: '词尾辅音不发音', ipa: '', focusWord: 'parlent',
    description: '法语最省力的规则：词尾的 t, s, d, p, n(t), x 通通不发音！',
    words: ['parlent', 'grand', 'petit', 'beaucoup', 'temps', 'deux', 'prix', 'heureux', 'vous', 'nous', 'faux'],
    sentences: ['Ils parlent beaucoup.', 'Un grand petit chat.', 'Deux prix différents.', 'Je suis heureux.'],
  },
  { day: 26, sound: '连音 (liaison)', ipa: '', focusWord: 'vous-avez',
    description: '前一个词尾的辅音和后一个词首的元音连起来读。vous avez → vou-zavé。',
    words: ['vous-avez', 'les-enfants', 'un-ami', 'très-important', 'petit-à-petit', 'quand-il', 'tout-à-fait', 'chez-eux'],
    sentences: ['Vous avez un ami.', 'Les enfants sont là.', 'Petit à petit.', 'Tout à fait!'],
  },

  // Final wrap-up
  { day: 27, sound: '最难音回顾', ipa: '', focusWord: 'tu vs tout vs teint',
    description: '法语三大"杀手"音：u(撮口) vs ou(圆唇) vs in(鼻化)。一口气对比。',
    words: ['tu', 'tout', 'teint', 'vu', 'vous', 'vin', 'rue', 'roue', 'rein', 'pull', 'poule', 'pain'],
    sentences: ['Tu as tout bu?', 'Dans la rue, une roue.', 'Du vin dans la cuisine.'],
  },
  { day: 28, sound: '自由练习日', ipa: '', focusWord: 'bonjour',
    description: '用前27天学的所有音，大声朗读这些日常句子。',
    words: [],
    sentences: [
      'Bonjour, je voudrais un café et un croissant.',
      'Tu viens chez moi ce soir?',
      'Il fait très beau aujourd\'hui.',
      'J\'ai besoin d\'un renseignement.',
      'Je ne comprends pas, pouvez-vous répéter?',
      'C\'est vraiment très gentil, merci beaucoup!',
      'À demain, bonne soirée!',
    ],
  },
  { day: 29, sound: '唱歌学发音', ipa: '', focusWord: 'Frère Jacques',
    description: '用法语儿歌练发音。旋律帮助你记住音节。',
    words: ['Frère', 'Jacques', 'dormez', 'matines', 'sonnez'],
    sentences: [
      'Frère Jacques, Frère Jacques,',
      'Dormez-vous? Dormez-vous?',
      'Sonnez les matines! Sonnez les matines!',
      'Ding, ding, dong! Ding, ding, dong!',
    ],
  },
  { day: 30, sound: '毕业日！', ipa: '', focusWord: 'confiance',
    description: '你已经掌握了法语所有核心音素。从今天起，看到法语单词就敢读。Félicitations! 🎉',
    words: ['félicitations', 'confiance', 'prononciation', 'naturellement', 'magnifique'],
    sentences: [
      'Félicitations! Tu as fini les 30 jours!',
      'Maintenant tu as confiance pour parler français.',
      'La prononciation n\'est plus un problème.',
      'Tu peux lire naturellement et magnifiquement.',
    ],
  },
];

export function getTodayLesson(): DailySoundLesson {
  const startDate = new Date('2026-07-01');
  const today = new Date();
  const dayDiff = Math.floor((today.getTime() - startDate.getTime()) / 86400000);
  const index = Math.max(0, dayDiff % dailySoundCurriculum.length);
  return dailySoundCurriculum[index];
}

export function getLessonByDay(day: number): DailySoundLesson | null {
  return dailySoundCurriculum.find(l => l.day === day) || null;
}
