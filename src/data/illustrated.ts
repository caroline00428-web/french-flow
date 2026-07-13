// ============================================================
// Illustrated French Reading — Le Petit Prince, poetry, classic texts
// With emoji illustrations for immersive reading
// ============================================================

export interface IllustratedReading {
  id: string;
  title: string;
  titleZh: string;
  author: string;
  level: 'A1' | 'A2' | 'B1';
  type: 'classic' | 'poetry' | 'comic' | 'diary';
  emoji: string;
  scenes: IllustratedScene[];
}

export interface IllustratedScene {
  illustration: string; // emoji art
  french: string;
  chinese: string;
  vocab?: { word: string; meaning: string }[];
}

export const illustratedReadings: IllustratedReading[] = [
  // ======== Le Petit Prince style ========
  {
    id: 'illus-petit-prince-1',
    title: 'Le Petit Prince — La Rose',
    titleZh: '小王子 — 玫瑰',
    author: 'Antoine de Saint-Exupéry (改编)',
    level: 'A2',
    type: 'classic',
    emoji: '🌹',
    scenes: [
      {
        illustration: '⭐ 🌍 🏜️ 👦 🌹',
        french: 'Le Petit Prince vivait sur une toute petite planète. Sur cette planète, il y avait une fleur. Une rose magnifique, mais très orgueilleuse.',
        chinese: '小王子住在一颗很小的星球上。星球上有一朵花。一朵美丽的玫瑰，但非常骄傲。',
        vocab: [
          { word: 'toute petite', meaning: '非常小的' },
          { word: 'orgueilleuse', meaning: '骄傲的' },
        ],
      },
      {
        illustration: '🌹 💬 👦 ❤️',
        french: '"Je t\'aime," dit la rose. "Mais tu ne le sais pas. C\'est ma faute. Cela n\'a aucune importance. Mais tu as été aussi bête que moi. Essaie d\'être heureux."',
        chinese: '"我爱你，"玫瑰说。"但你不知道。这是我的错。这不重要。但你和我一样傻。试着快乐起来吧。"',
        vocab: [
          { word: 'faute', meaning: '错误；过错' },
          { word: 'bête', meaning: '傻的' },
          { word: 'heureux', meaning: '快乐的' },
        ],
      },
      {
        illustration: '👦 ✈️ 🌹 💧',
        french: 'Le Petit Prince comprit alors qu\'il aimait sa rose. "On ne voit bien qu\'avec le cœur. L\'essentiel est invisible pour les yeux."',
        chinese: '小王子这才明白他爱他的玫瑰。"只有用心才能看得清。重要的东西用眼睛是看不见的。"',
        vocab: [
          { word: 'comprit', meaning: '明白了（comprendre的过去时）' },
          { word: 'cœur', meaning: '心' },
          { word: 'essentiel', meaning: '重要的东西' },
          { word: 'invisible', meaning: '看不见的' },
        ],
      },
    ],
  },
  {
    id: 'illus-petit-prince-2',
    title: 'Le Petit Prince — Le Renard',
    titleZh: '小王子 — 狐狸',
    author: 'Antoine de Saint-Exupéry (改编)',
    level: 'A2',
    type: 'classic',
    emoji: '🦊',
    scenes: [
      {
        illustration: '👦 🏜️ 🦊 🌾',
        french: 'C\'est alors qu\'apparut le renard. "Bonjour," dit le renard. "Bonjour," répondit poliment le Petit Prince. "Je suis un renard," dit le renard. "Viens jouer avec moi," proposa le Petit Prince. "Je suis tellement triste."',
        chinese: '这时狐狸出现了。"你好，"狐狸说。"你好，"小王子礼貌地回答。"我是一只狐狸，"狐狸说。"来和我玩吧，"小王子提议。"我好伤心。"',
        vocab: [
          { word: 'apparut', meaning: '出现了' },
          { word: 'poliment', meaning: '礼貌地' },
          { word: 'tellement', meaning: '如此地' },
        ],
      },
      {
        illustration: '🦊 💬 👦 🤝',
        french: '"Je ne puis pas jouer avec toi," dit le renard. "Je ne suis pas apprivoisé." "Qu\'est-ce que signifie \'apprivoiser\'?" demanda le Petit Prince. "C\'est une chose trop oubliée," dit le renard. "Ça signifie \'créer des liens\'."',
        chinese: '我不能和你玩，狐狸说。我没有被驯养。驯养是什么意思？小王子问。这是一件被遗忘的事，狐狸说。意思是建立联系。',
        vocab: [
          { word: 'apprivoisé', meaning: '被驯养的' },
          { word: 'signifie', meaning: '意味着' },
          { word: 'créer des liens', meaning: '建立联系' },
        ],
      },
      {
        illustration: '🦊 🌹 👦 🌍',
        french: '"Tu deviens responsable pour toujours de ce que tu as apprivoisé. Tu es responsable de ta rose..." "Je suis responsable de ma rose," répéta le Petit Prince, afin de se souvenir.',
        chinese: '"你永远对你驯养过的东西负责。你要对你的玫瑰负责..." "我要对我的玫瑰负责，"小王子重复道，为了记住。',
        vocab: [
          { word: 'responsable', meaning: '负责的' },
          { word: 'pour toujours', meaning: '永远' },
          { word: 'afin de', meaning: '为了' },
          { word: 'se souvenir', meaning: '记住' },
        ],
      },
    ],
  },

  // ======== French Poetry ========
  {
    id: 'poem-chanson',
    title: 'Chanson d\'Automne',
    titleZh: '秋之歌',
    author: 'Paul Verlaine',
    level: 'B1',
    type: 'poetry',
    emoji: '🍂',
    scenes: [
      {
        illustration: '🍂 🎻 🍁 😢',
        french: 'Les sanglots longs\nDes violons\nDe l\'automne\nBlessent mon cœur\nD\'une langueur\nMonotone.',
        chinese: '秋天的小提琴\n长长的呜咽\n用单调的\n忧郁\n刺伤我的心。',
        vocab: [
          { word: 'sanglots', meaning: '呜咽；哭泣' },
          { word: 'blessent', meaning: '伤害' },
          { word: 'langueur', meaning: '忧郁；倦怠' },
        ],
      },
      {
        illustration: '⏰ 💨 🍂 🏃',
        french: 'Tout suffocant\nEt blême, quand\nSonne l\'heure,\nJe me souviens\nDes jours anciens\nEt je pleure.',
        chinese: '当钟声响起\n一切窒息\n而苍白\n我想起\n往日的时光\n我哭了。',
        vocab: [
          { word: 'suffocant', meaning: '令人窒息的' },
          { word: 'blême', meaning: '苍白的' },
          { word: 'pleure', meaning: '哭泣' },
        ],
      },
    ],
  },
  {
    id: 'poem-liberte',
    title: 'Liberté (extrait)',
    titleZh: '自由（节选）',
    author: 'Paul Éluard',
    level: 'A2',
    type: 'poetry',
    emoji: '🕊️',
    scenes: [
      {
        illustration: '📝 🏫 ✏️ 📄',
        french: 'Sur mes cahiers d\'écolier\nSur mon pupitre et les arbres\nSur le sable sur la neige\nJ\'écris ton nom.',
        chinese: '在我的学生笔记本上\n在我的课桌和树上\n在沙上 在雪上\n我写下你的名字。',
        vocab: [
          { word: 'cahiers', meaning: '笔记本' },
          { word: 'pupitre', meaning: '课桌' },
          { word: 'sable', meaning: '沙子' },
        ],
      },
      {
        illustration: '🌅 🌊 🏔️ ✈️',
        french: 'Sur toutes les pages lues\nSur toutes les pages blanches\nPierre sang papier ou cendre\nJ\'écris ton nom.',
        chinese: '在所有读过的书页上\n在所有空白的书页上\n石头 鲜血 纸张 或 灰烬\n我写下你的名字。',
        vocab: [
          { word: 'blanches', meaning: '白色的；空白的' },
          { word: 'cendre', meaning: '灰烬' },
        ],
      },
    ],
  },

  // ======== French Comic style (bande dessinée) ========
  {
    id: 'comic-paris',
    title: 'Une Journée à Paris',
    titleZh: '巴黎一日（漫画风）',
    author: 'FrenchFlow原创',
    level: 'A1',
    type: 'comic',
    emoji: '🗼',
    scenes: [
      {
        illustration: '🌅 🗼 ☕ 🥐',
        french: 'PANEL 1: Il est 8h du matin. Le soleil brille sur la Tour Eiffel. Marie boit son café en terrasse.',
        chinese: '早上8点。阳光照在埃菲尔铁塔上。玛丽在露天座位喝咖啡。',
        vocab: [
          { word: 'brille', meaning: '照耀' },
          { word: 'en terrasse', meaning: '在露天座位' },
        ],
      },
      {
        illustration: '🚇 👩 💼 🏢',
        french: 'PANEL 2: Marie prend le métro. Il y a beaucoup de monde. Elle écoute de la musique. Direction: La Défense.',
        chinese: '玛丽坐地铁。人很多。她在听音乐。方向：拉德芳斯。',
        vocab: [
          { word: 'beaucoup de monde', meaning: '很多人' },
          { word: 'écoute', meaning: '听' },
        ],
      },
      {
        illustration: '🍽️ 👩‍💼 👨‍💼 💬',
        french: 'PANEL 3: Déjeuner avec des collègues. "Tu prends quoi?" "Une salade, et toi?" "Un sandwich au jambon."',
        chinese: '和同事吃午饭。"你吃什么？""沙拉，你呢？""火腿三明治。"',
        vocab: [
          { word: 'Déjeuner', meaning: '午餐' },
          { word: 'sandwich au jambon', meaning: '火腿三明治' },
        ],
      },
      {
        illustration: '🌆 🏠 📖 🛏️',
        french: 'PANEL 4: Le soir, Marie rentre chez elle. Elle lit un peu. "Quelle belle journée!" pense-t-elle en souriant.',
        chinese: '晚上，玛丽回家。她读了一会儿书。"多么美好的一天！"她微笑着想。',
        vocab: [
          { word: 'rentre', meaning: '回家' },
          { word: 'en souriant', meaning: '微笑着' },
        ],
      },
    ],
  },

  // ======== French Diary style ========
  {
    id: 'diary-student',
    title: 'Journal d\'un Étudiant',
    titleZh: '留学生日记',
    author: 'FrenchFlow原创',
    level: 'A2',
    type: 'diary',
    emoji: '📓',
    scenes: [
      {
        illustration: '📅 🛬 🇫🇷 😰',
        french: '10 septembre. Je suis arrivé en France il y a trois jours. Tout est nouveau. Tout est différent. La boulangerie, le fromage, la façon de dire bonjour... Je suis un peu perdu.',
        chinese: '9月10日。三天前我到了法国。一切都很新鲜。一切都不一样。面包店、奶酪、打招呼的方式...我有点迷茫。',
        vocab: [
          { word: 'il y a trois jours', meaning: '三天前' },
          { word: 'façon', meaning: '方式' },
          { word: 'perdu', meaning: '迷茫的' },
        ],
      },
      {
        illustration: '📅 🏫 👨‍🏫 📖',
        french: '15 septembre. Premier jour de cours! Le professeur parle très vite. Je comprends peut-être 50%. Mais j\'ai rencontré une fille sympa qui s\'appelle Camille. Elle m\'a proposé de réviser ensemble.',
        chinese: '9月15日。第一天上课！老师说话好快。我大概只听懂50%。但我认识了一个叫卡米尔的友善女孩。她提议一起复习。',
        vocab: [
          { word: 'cours', meaning: '课程' },
          { word: 'peut-être', meaning: '大概；也许' },
          { word: 'réviser', meaning: '复习' },
        ],
      },
      {
        illustration: '📅 🎉 🍷 🧀',
        french: '3 octobre. Ce soir, soirée crêpes chez Camille! J\'ai appris à faire des crêpes bretonnes. Ce n\'est pas si difficile! Mes amis français m\'ont dit que mon français s\'améliore.',
        chinese: '10月3日。今晚在卡米尔家做可丽饼！我学会了做布列塔尼可丽饼。没那么难！我的法国朋友说我的法语在进步。',
        vocab: [
          { word: 'soirée', meaning: '晚会' },
          { word: 'appris', meaning: '学会了' },
          { word: 's\'améliore', meaning: '在进步' },
        ],
      },
    ],
  },
];
