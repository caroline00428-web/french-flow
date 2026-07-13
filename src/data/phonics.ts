// ============================================================
// French Sound System — complete phonics for learners
// Every sound with: IPA, spelling patterns, examples, minimal pairs
// ============================================================

export interface FrenchSound {
  id: string;
  sound: string;       // phonetic label
  ipa: string;         // IPA symbol
  type: 'vowel' | 'nasal' | 'consonant' | 'semi-vowel';
  description: string; // how to make the sound
  spelling: string[];  // common spellings
  examples: { word: string; ipa: string; meaning: string }[];
  minimalPairs?: { wordA: string; wordB: string; note: string }[];
  tip: string;         // tip for Chinese speakers
}

export const frenchSoundSystem: FrenchSound[] = [
  // ======== ORAL VOWELS / 口腔元音 ========
  {
    id: 'v-a',
    sound: 'a (开口前元音)',
    ipa: '/a/',
    type: 'vowel',
    description: '嘴巴张到最大，舌头放平，像中文"啊"但更靠前、更紧张。法语 a 比中文的"啊"嘴型更大、声音更亮。',
    spelling: ['a', 'à', 'â'],
    examples: [
      { word: 'la', ipa: '/la/', meaning: '那个（阴性）' },
      { word: 'là', ipa: '/la/', meaning: '那里' },
      { word: 'chat', ipa: '/ʃa/', meaning: '猫' },
      { word: 'papa', ipa: '/papa/', meaning: '爸爸' },
    ],
    tip: '不要发成中文的"啊"，法语 a 嘴张得更大，声音从喉咙深处出来。对着镜子看，应该能看到喉咙。',
  },
  {
    id: 'v-e-open',
    sound: 'è / ê (开口e)',
    ipa: '/ɛ/',
    type: 'vowel',
    description: '嘴半开，舌头前部抬起。类似英语 "bed" 的 e，或者中文"也"的韵母去掉后面的 i。',
    spelling: ['è', 'ê', 'e(在闭音节)', 'ai', 'ei'],
    examples: [
      { word: 'très', ipa: '/tʁɛ/', meaning: '非常' },
      { word: 'fête', ipa: '/fɛt/', meaning: '节日' },
      { word: 'lait', ipa: '/lɛ/', meaning: '牛奶' },
      { word: 'neige', ipa: '/nɛʒ/', meaning: '雪' },
      { word: 'belle', ipa: '/bɛl/', meaning: '美丽的' },
    ],
    tip: 'è/ê/ai 发音完全一样！法语就是喜欢用不同字母写同一个音。记住：嘴巴半开，不要闭太紧。',
  },
  {
    id: 'v-e-closed',
    sound: 'é (闭口e)',
    ipa: '/e/',
    type: 'vowel',
    description: '嘴半闭，舌头前部抬高。类似英语 "say" 去掉尾音 y，但更紧张。嘴角向两边拉开。',
    spelling: ['é', '-er(词尾)', '-ez(词尾)', '-es(少数词)'],
    examples: [
      { word: 'café', ipa: '/kafe/', meaning: '咖啡' },
      { word: 'parler', ipa: '/paʁle/', meaning: '说' },
      { word: 'chez', ipa: '/ʃe/', meaning: '在…家' },
      { word: 'été', ipa: '/ete/', meaning: '夏天' },
    ],
    minimalPairs: [
      { wordA: 'é (闭口)', wordB: 'è (开口)', note: 'é: 嘴角拉开, è: 嘴更开' },
      { wordA: 'fée /fe/ (仙女)', wordB: 'fait /fɛ/ (事实)', note: '完全不同的两个词！' },
    ],
    tip: '嘴角用力向两边拉，像在微笑😊。é 的嘴型比 è 更小更紧张。这是法语最常见的音之一。',
  },
  {
    id: 'v-e-schwa',
    sound: 'e (轻声e)',
    ipa: '/ə/',
    type: 'vowel',
    description: '最放松的元音。嘴几乎不张开，舌头在中间。类似中文"的"里面的 e，或者英语 "the" 的 e。',
    spelling: ['e(无重音)'],
    examples: [
      { word: 'le', ipa: '/lə/', meaning: '那个（阳性）' },
      { word: 'de', ipa: '/də/', meaning: '的/从' },
      { word: 'petit', ipa: '/pəti/', meaning: '小的' },
    ],
    tip: '法语口语里这个音经常被省略。比如 "je suis" 说快了变成 "chuis"。但初学建议发出来。',
  },
  {
    id: 'v-i',
    sound: 'i',
    ipa: '/i/',
    type: 'vowel',
    description: '嘴角向两边拉到最大，舌头前部抬高。类似中文"衣"。法语 i 和中文 i 几乎一样，很容易。',
    spelling: ['i', 'î', 'ï', 'y(少数词)'],
    examples: [
      { word: 'ici', ipa: '/isi/', meaning: '这里' },
      { word: 'vie', ipa: '/vi/', meaning: '生活' },
      { word: 'île', ipa: '/il/', meaning: '岛屿' },
    ],
    tip: '最简单的一个音，和中文 i 一样。注意 ï 上面两点表示要和前面的元音分开发音。',
  },
  {
    id: 'v-u',
    sound: 'u (最难的元音！)',
    ipa: '/y/',
    type: 'vowel',
    description: '这是法语最难、最独特的音！舌头位置说 i，嘴唇圆起来说 u。中文和英语都没有这个音。',
    spelling: ['u', 'û'],
    examples: [
      { word: 'tu', ipa: '/ty/', meaning: '你' },
      { word: 'rue', ipa: '/ʁy/', meaning: '街道' },
      { word: 'sûr', ipa: '/syʁ/', meaning: '确定的' },
    ],
    minimalPairs: [
      { wordA: 'tu /ty/ (你)', wordB: 'tout /tu/ (一切)', note: 'u≠ou! u=撮口, ou=圆唇' },
      { wordA: 'dessus /dəsy/ (上面)', wordB: 'dessous /dəsu/ (下面)', note: '天上 vs 地下，就靠这一个音！' },
    ],
    tip: '做一个"衣"的口型，保持舌头不动，然后把嘴唇用力撮起来，像要亲谁一样！对着镜子练，嘴唇必须圆。',
  },
  {
    id: 'v-ou',
    sound: 'ou',
    ipa: '/u/',
    type: 'vowel',
    description: '嘴唇撮圆，舌头后部抬高。接近中文"乌"但嘴更圆更紧。',
    spelling: ['ou', 'où', 'oû'],
    examples: [
      { word: 'vous', ipa: '/vu/', meaning: '您/你们' },
      { word: 'jour', ipa: '/ʒuʁ/', meaning: '天/日子' },
      { word: 'où', ipa: '/u/', meaning: '哪里' },
    ],
    minimalPairs: [
      { wordA: 'ou /u/ (圆唇u)', wordB: 'u /y/ (撮口u)', note: '最关键的区别！' },
    ],
    tip: '和中文"乌"差不多但嘴唇更用力地圆起来。ou 和 u 的区别就是圆唇 vs 撮口。',
  },
  {
    id: 'v-o-open',
    sound: 'o (开口)',
    ipa: '/ɔ/',
    type: 'vowel',
    description: '嘴张开，比 a 稍小。类似英语 "hot" 的 o。',
    spelling: ['o(在闭音节)', 'au(少数)'],
    examples: [
      { word: 'porte', ipa: '/pɔʁt/', meaning: '门' },
      { word: 'homme', ipa: '/ɔm/', meaning: '男人' },
      { word: 'pomme', ipa: '/pɔm/', meaning: '苹果' },
    ],
    tip: '开口 o 和闭口 o 的区别：开口 o 出现在词中闭音节，闭口 o 在词尾开音节。不用刻意记，多听自然分。',
  },
  {
    id: 'v-o-closed',
    sound: 'ô / au / eau (闭口o)',
    ipa: '/o/',
    type: 'vowel',
    description: '嘴更闭，舌头后部更高。类似英语 "go" 去掉尾音。',
    spelling: ['ô', 'au', 'eau', 'o(词尾开音节)'],
    examples: [
      { word: 'bientôt', ipa: '/bjɛ̃to/', meaning: '很快' },
      { word: 'beau', ipa: '/bo/', meaning: '美丽的' },
      { word: 'eau', ipa: '/o/', meaning: '水' },
      { word: 'mot', ipa: '/mo/', meaning: '词' },
    ],
    tip: 'eau 三个字母读成 o 一个音，这就是法语！au 也是 o。记住：eau=au=ô=o。',
  },

  // ======== NASAL VOWELS / 鼻化元音 ========
  {
    id: 'n-an',
    sound: 'an / en (鼻化a)',
    ipa: '/ɑ̃/',
    type: 'nasal',
    description: '嘴巴张到 a 的口型，同时软腭下降让气流从鼻子出来。不要在末尾加 n 或 ng 的音。',
    spelling: ['an', 'en', 'am', 'em'],
    examples: [
      { word: 'an', ipa: '/ɑ̃/', meaning: '年' },
      { word: 'enfant', ipa: '/ɑ̃fɑ̃/', meaning: '孩子' },
      { word: 'dans', ipa: '/dɑ̃/', meaning: '在…里' },
      { word: 'chambre', ipa: '/ʃɑ̃bʁ/', meaning: '房间' },
      { word: 'temps', ipa: '/tɑ̃/', meaning: '时间' },
    ],
    tip: 'an 和 en 在现代法语中发音完全一样！不要发成"昂"——不要加 g 音。纯粹是 a 从鼻子出来。',
  },
  {
    id: 'n-in',
    sound: 'in / ain / ein (鼻化i)',
    ipa: '/ɛ̃/',
    type: 'nasal',
    description: '舌头接近 è 的位置，气流从鼻子出来。类似英语 "bang" 的 ang 但不闭口。',
    spelling: ['in', 'ain', 'ein', 'im', 'aim', 'ym', 'yn'],
    examples: [
      { word: 'pain', ipa: '/pɛ̃/', meaning: '面包' },
      { word: 'vin', ipa: '/vɛ̃/', meaning: '葡萄酒' },
      { word: 'plein', ipa: '/plɛ̃/', meaning: '满的' },
      { word: 'simple', ipa: '/sɛ̃pl/', meaning: '简单的' },
    ],
    minimalPairs: [
      { wordA: 'pain /pɛ̃/ (面包)', wordB: 'paon /pɑ̃/ (孔雀)', note: 'in ≠ an! 舌头位置不同' },
    ],
    tip: 'in/ain/ein 发音完全一样。嘴角拉开一点，气流从鼻子出。不要加 n 尾音。',
  },
  {
    id: 'n-on',
    sound: 'on (鼻化o)',
    ipa: '/ɔ̃/',
    type: 'nasal',
    description: '嘴唇撮圆，舌头后部抬高，气流从鼻子出来。',
    spelling: ['on', 'om'],
    examples: [
      { word: 'bon', ipa: '/bɔ̃/', meaning: '好的' },
      { word: 'nom', ipa: '/nɔ̃/', meaning: '名字' },
      { word: 'maison', ipa: '/mɛzɔ̃/', meaning: '房子' },
      { word: 'bonbon', ipa: '/bɔ̃bɔ̃/', meaning: '糖果' },
    ],
    tip: 'on 不等于中文的"ong"！没有 g 音。纯粹的 o 从鼻子出来。嘴唇撮圆是关键。',
  },
  {
    id: 'n-un',
    sound: 'un (鼻化u)',
    ipa: '/œ̃/',
    type: 'nasal',
    description: '这个音在消亡中，很多法国人已经不用了，和 in 合并。但传统法语中还存在。',
    spelling: ['un', 'um'],
    examples: [
      { word: 'un', ipa: '/œ̃/', meaning: '一' },
      { word: 'brun', ipa: '/bʁœ̃/', meaning: '棕色的' },
      { word: 'parfum', ipa: '/paʁfœ̃/', meaning: '香水' },
    ],
    minimalPairs: [
      { wordA: 'brun /bʁœ̃/ (棕色)', wordB: 'brin /bʁɛ̃/ (小枝)', note: '很多人已经不分了' },
    ],
    tip: '初学者不用纠结 un 和 in 的区别。日常口语中大多数法国人已经合并了。',
  },

  // ======== CONSONANTS / 辅音 ========
  {
    id: 'c-r',
    sound: 'R (法语R)',
    ipa: '/ʁ/',
    type: 'consonant',
    description: '小舌颤动/摩擦。舌头后部靠近小舌，气流通过摩擦发声。不像西班牙语那样舌尖颤动，也不像英语 r 那样卷舌。',
    spelling: ['r', 'rr', 'rh'],
    examples: [
      { word: 'rouge', ipa: '/ʁuʒ/', meaning: '红色' },
      { word: 'Paris', ipa: '/paʁi/', meaning: '巴黎' },
      { word: 'français', ipa: '/fʁɑ̃sɛ/', meaning: '法语' },
      { word: 'rue', ipa: '/ʁy/', meaning: '街道' },
    ],
    tip: '像漱口时喉咙里发出的声音。从喉咙深处出来，不是舌尖。练的时候含一口水，发出咕噜声，就是法语R的位置。',
  },
  {
    id: 'c-j',
    sound: 'j (软g)',
    ipa: '/ʒ/',
    type: 'consonant',
    description: '类似英语 "pleasure" 的 s，或中文"日"的声母。舌面靠近上颚，摩擦发声。',
    spelling: ['j', 'g(在e,i,y前)'],
    examples: [
      { word: 'je', ipa: '/ʒə/', meaning: '我' },
      { word: 'manger', ipa: '/mɑ̃ʒe/', meaning: '吃' },
      { word: 'jour', ipa: '/ʒuʁ/', meaning: '天' },
    ],
    tip: 'g 在 e/i/y 前面就发 j 的音。所以 manger 读"忙jei"不是"忙gei"。',
  },
  {
    id: 'c-ch',
    sound: 'ch',
    ipa: '/ʃ/',
    type: 'consonant',
    description: '类似英语 "shoe" 的 sh，或中文"西"的声母。比中文 sh 更轻。',
    spelling: ['ch'],
    examples: [
      { word: 'chat', ipa: '/ʃa/', meaning: '猫' },
      { word: 'chercher', ipa: '/ʃɛʁʃe/', meaning: '寻找' },
      { word: 'chocolat', ipa: '/ʃɔkɔla/', meaning: '巧克力' },
    ],
    tip: '法语的 ch 永远读 sh，没有英语 church 那种 ch 音。巧克力就是 sho-ko-la。',
  },
];

// ============================================================
// Quick reference: letter → sound mapping
// ============================================================
export const letterSoundMap: { letters: string; sound: string; example: string }[] = [
  { letters: 'é', sound: '/e/ (闭口e)', example: 'café' },
  { letters: 'è, ê', sound: '/ɛ/ (开口e)', example: 'très, fête' },
  { letters: 'ai, ei', sound: '/ɛ/ (开口e)', example: 'lait, neige' },
  { letters: 'au, eau', sound: '/o/ (闭口o)', example: 'beau, eau' },
  { letters: 'ou', sound: '/u/ (圆唇u)', example: 'vous' },
  { letters: 'oi', sound: '/wa/', example: 'moi, trois' },
  { letters: 'ch', sound: '/ʃ/ (sh)', example: 'chat' },
  { letters: 'gn', sound: '/ɲ/ (ny)', example: 'montagne' },
  { letters: 'il, ill', sound: '/j/ (y音)', example: 'fille, travail' },
  { letters: 'an, en', sound: '/ɑ̃/ (鼻化a)', example: 'enfant' },
  { letters: 'in, ain, ein', sound: '/ɛ̃/ (鼻化e)', example: 'pain, plein' },
  { letters: 'on, om', sound: '/ɔ̃/ (鼻化o)', example: 'bon' },
  { letters: 'tion', sound: '/sjɔ̃/', example: 'nation' },
  { letters: 'qu', sound: '/k/', example: 'qui, que' },
  { letters: 'c(在a,o,u前)', sound: '/k/', example: 'café, comme, cul' },
  { letters: 'c(在e,i,y前)', sound: '/s/', example: 'ceci, cycle' },
  { letters: 'g(在a,o,u前)', sound: '/g/', example: 'gare, goût' },
  { letters: 'g(在e,i,y前)', sound: '/ʒ/ (j)', example: 'manger, girafe' },
  { letters: 's(元音间)', sound: '/z/', example: 'maison, rose' },
  { letters: '词尾辅音', sound: '一般不发音', example: 'parlent → parle, grand → gran' },
];

export function getSoundCount(): { vowels: number; nasals: number; consonants: number } {
  return {
    vowels: frenchSoundSystem.filter(s => s.type === 'vowel').length,
    nasals: frenchSoundSystem.filter(s => s.type === 'nasal').length,
    consonants: frenchSoundSystem.filter(s => s.type === 'consonant').length,
  };
}
