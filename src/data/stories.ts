// ============================================================
// French Stories & Movie Scripts Library
// For immersive reading, tap-to-translate, and vocabulary building
// ============================================================

export interface Story {
  id: string;
  title: string;
  titleZh: string;
  type: 'story' | 'script';
  level: 'A0' | 'A1' | 'A2' | 'B1';
  source?: string; // movie/show name
  emoji: string;
  paragraphs: StoryParagraph[];
}

export interface StoryParagraph {
  french: string;
  chinese: string;
  vocab?: { word: string; meaning: string }[];
  speaker?: string; // for scripts
}

// ============================================================
// French Stories — graded readers for immersive learning
// ============================================================
export const frenchStories: Story[] = [
  // ======== A0 Stories ========
  {
    id: 'story-petit-chat',
    title: 'Le Petit Chat Blanc',
    titleZh: '小白猫',
    type: 'story',
    level: 'A0',
    emoji: '🐱',
    paragraphs: [
      { french: 'Il était une fois un petit chat blanc. Il s\'appelait Neige. Neige habitait dans une petite maison à la campagne. Tous les jours, il jouait dans le jardin.', chinese: '从前有一只小白猫。它叫白雪。白雪住在乡下的小房子里。每天它都在花园里玩耍。', vocab: [
        { word: 'Il était une fois', meaning: '从前（故事开头）' },
        { word: 'campagne', meaning: '乡村' },
        { word: 'jouait', meaning: '玩耍（jouer的过去时）' },
      ]},
      { french: 'Un matin, Neige a vu un oiseau jaune. L\'oiseau chantait une belle chanson. "Bonjour, petit chat!" a dit l\'oiseau. "Bonjour! Tu chantes très bien!" a répondu Neige.', chinese: '一天早上，白雪看到一只黄色的小鸟。小鸟唱着美丽的歌。"你好，小猫！"小鸟说。"你好！你唱得真好听！"白雪回答。', vocab: [
        { word: 'a vu', meaning: '看到了（voir的过去时）' },
        { word: 'chantait', meaning: '唱歌（chanter的过去时）' },
        { word: 'a répondu', meaning: '回答（répondre的过去时）' },
      ]},
      { french: 'Les deux animaux sont devenus amis. Chaque jour, l\'oiseau venait chanter pour Neige. Et le petit chat blanc était très heureux.', chinese: '两个小动物成了朋友。每天小鸟都来给白雪唱歌。小白猫非常开心。', vocab: [
        { word: 'sont devenus', meaning: '成为了（devenir的过去时）' },
        { word: 'venait', meaning: '来（venir的过去时）' },
      ]},
    ],
  },
  {
    id: 'story-chien-perdu',
    title: 'Le Chien Perdu',
    titleZh: '走丢的小狗',
    type: 'story',
    level: 'A0',
    emoji: '🐕',
    paragraphs: [
      { french: 'Une petite fille s\'appelle Lila. Elle a sept ans. Elle a un chien. Le chien s\'appelle Cookie. Cookie est marron et blanc. Il est très gentil.', chinese: '一个小女孩叫莉拉。她七岁。她有一只狗。狗叫 Cookie。Cookie 是棕色和白色的。它非常乖。', vocab: [
        { word: 'fille', meaning: '女孩' },
        { word: 'marron', meaning: '棕色' },
      ]},
      { french: 'Un jour, Lila et Cookie vont au parc. Cookie court après un papillon. Il court et il court. Soudain, Cookie est perdu! Lila pleure. Elle cherche Cookie partout.', chinese: '有一天，莉拉和 Cookie 去公园。Cookie 追着一只蝴蝶跑。它跑啊跑。突然，Cookie 不见了！莉拉哭了。她到处找 Cookie。', vocab: [
        { word: 'court après', meaning: '追赶' },
        { word: 'papillon', meaning: '蝴蝶' },
        { word: 'perdu', meaning: '丢失的' },
        { word: 'partout', meaning: '到处' },
      ]},
      { french: 'Heureusement, un monsieur gentil trouve Cookie. Il le ramène à Lila. Lila est très contente. Elle dit merci au monsieur. Cookie lèche le visage de Lila. Quelle joie!', chinese: '幸运的是，一位好心的先生找到了 Cookie。他把 Cookie 带回来给莉拉。莉拉非常开心。她对先生说谢谢。Cookie 舔着莉拉的脸。真开心啊！', vocab: [
        { word: 'Heureusement', meaning: '幸运地' },
        { word: 'ramène', meaning: '带回来' },
        { word: 'lèche', meaning: '舔' },
        { word: 'visage', meaning: '脸' },
      ]},
    ],
  },

  // ======== A1 Stories ========
  {
    id: 'story-mystere-boulangerie',
    title: 'Le Mystère de la Boulangerie',
    titleZh: '面包店的秘密',
    type: 'story',
    level: 'A1',
    emoji: '🥐',
    paragraphs: [
      { french: 'Monsieur Dupont est boulanger. Tous les matins, il se lève à quatre heures pour faire du pain. Sa boulangerie est la meilleure du quartier. Les clients font la queue chaque jour.', chinese: '杜邦先生是面包师。每天早上他四点起床做面包。他的面包店是街区最好的。顾客们每天都排队。', vocab: [
        { word: 'boulanger', meaning: '面包师' },
        { word: 'se lève', meaning: '起床' },
        { word: 'quartier', meaning: '街区' },
        { word: 'font la queue', meaning: '排队' },
      ]},
      { french: 'Mais depuis une semaine, quelque chose est étrange. Chaque nuit, quelqu\'un vole trois croissants et une baguette. Monsieur Dupont est inquiet. "Qui peut faire ça?" se demande-t-il.', chinese: '但最近一周，有件奇怪的事。每天晚上有人偷三个牛角面包和一根法棍。杜邦先生很担心。"谁会做这种事？"他想。', vocab: [
        { word: 'depuis', meaning: '自从' },
        { word: 'étrange', meaning: '奇怪的' },
        { word: 'vole', meaning: '偷' },
        { word: 'inquiet', meaning: '担心的' },
      ]},
      { french: 'Il décide de rester une nuit dans la boulangerie. À minuit, il entend un bruit. Il allume la lumière et voit... une petite fille avec un chat! "Pardon, monsieur," dit-elle, "ma maman est malade et elle adore vos croissants."', chinese: '他决定在面包店待一晚。午夜，他听到声音。他打开灯，看到... 一个小女孩和一只猫！"对不起，先生，"她说，"我妈妈生病了，她很喜欢您的牛角面包。"', vocab: [
        { word: 'décide de', meaning: '决定' },
        { word: 'entend', meaning: '听到' },
        { word: 'allume', meaning: '打开（灯）' },
        { word: 'adore', meaning: '非常喜欢' },
      ]},
      { french: 'Monsieur Dupont sourit. "Tu aurais pu demander," dit-il gentiment. Le lendemain, il apporte un grand panier de croissants à la maman malade. La petite fille promet de ne plus jamais voler.', chinese: '杜邦先生笑了。"你可以直接跟我要的，"他温柔地说。第二天他带了一大篮牛角面包给生病的妈妈。小女孩保证再也不偷了。', vocab: [
        { word: 'sourit', meaning: '微笑' },
        { word: 'lendemain', meaning: '第二天' },
        { word: 'panier', meaning: '篮子' },
        { word: 'promet', meaning: '承诺' },
      ]},
    ],
  },

  // ======== A2 Stories ========
  {
    id: 'story-voyage-marseille',
    title: 'Un Week-end à Marseille',
    titleZh: '马赛周末',
    type: 'story',
    level: 'A2',
    emoji: '⚓',
    paragraphs: [
      { french: 'Le mois dernier, j\'ai décidé de partir en week-end à Marseille. J\'avais besoin de voir la mer. J\'ai pris un train de bonne heure le samedi matin. Le voyage a duré trois heures depuis Paris.', chinese: '上个月，我决定去马赛过周末。我需要看看海。我周六一大早就坐火车出发了。从巴黎出发花了三小时。', vocab: [
        { word: 'avais besoin de', meaning: '需要' },
        { word: 'de bonne heure', meaning: '一大早' },
        { word: 'a duré', meaning: '持续了' },
      ]},
      { french: 'En arrivant, j\'ai tout de suite senti l\'air marin. Le ciel était d\'un bleu magnifique. Je me suis promené dans le Vieux-Port. Les bateaux dansaient doucement sur l\'eau.', chinese: '一到那里，我立刻闻到了海风。天空是美丽的蓝色。我在老港散步。船只在水中轻轻摇曳。', vocab: [
        { word: 'tout de suite', meaning: '立刻' },
        { word: 'senti', meaning: '感觉到了' },
        { word: 'bateaux', meaning: '船' },
        { word: 'doucement', meaning: '轻轻地' },
      ]},
      { french: 'Pour le déjeuner, j\'ai goûté la fameuse bouillabaisse. C\'était délicieux! Le serveur m\'a expliqué que la recette traditionnelle utilise au moins quatre sortes de poissons différents.', chinese: '午餐我品尝了著名的马赛鱼汤。太好吃了！服务员告诉我传统做法至少用四种不同的鱼。', vocab: [
        { word: 'bouillabaisse', meaning: '马赛鱼汤（普罗旺斯名菜）' },
        { word: 'recette', meaning: '食谱' },
        { word: 'au moins', meaning: '至少' },
      ]},
      { french: 'Le soir, j\'ai rencontré des gens très sympathiques dans un bar du Panier, le vieux quartier. On a parlé de tout et de rien. Un Marseillais m\'a dit: "Ici, on prend le temps de vivre." J\'ai adoré cette phrase.', chinese: '晚上我在老城区 Le Panier 的酒吧遇到了一些很友好的人。我们天南海北地聊。一个马赛人对我说："在这里，我们慢慢生活。"我太喜欢这句话了。', vocab: [
        { word: 'sympathiques', meaning: '友好的' },
        { word: 'On a parlé de tout et de rien', meaning: '什么都聊' },
        { word: 'prend le temps de', meaning: '花时间做...' },
      ]},
    ],
  },

  // ======== B1 Stories ========
  {
    id: 'story-reve-francais',
    title: 'Mon Rêve Français',
    titleZh: '我的法国梦',
    type: 'story',
    level: 'B1',
    emoji: '🇫🇷',
    paragraphs: [
      { french: 'Je m\'appelle Lin. Je suis chinoise. Depuis toute petite, je rêve de vivre en France. Ma grand-mère m\'a offert un jour un livre sur Paris. Les photos de la Tour Eiffel, de Montmartre, et des jardins du Luxembourg m\'ont fascinée. C\'est à ce moment-là que tout a commencé.', chinese: '我叫林。我是中国人。从小我就梦想在法国生活。有一天奶奶送了我一本关于巴黎的书。埃菲尔铁塔、蒙马特、卢森堡公园的照片让我着迷。一切从那时开始。', vocab: [
        { word: 'Depuis toute petite', meaning: '从小' },
        { word: 'rêve de', meaning: '梦想' },
        { word: 'm\'ont fascinée', meaning: '让我着迷' },
      ]},
      { french: 'Mais apprendre le français n\'était pas facile. Les premiers mois, je ne comprenais presque rien. Le genre des noms me paraissait absurde. Pourquoi une table est-elle féminine et un bureau masculin? J\'ai failli abandonner plusieurs fois.', chinese: '但学法语并不容易。最初几个月，我几乎什么都听不懂。名词的性别让我觉得很荒谬。为什么桌子是阴性、办公桌是阳性？好几次我都差点放弃。', vocab: [
        { word: 'presque rien', meaning: '几乎什么都没有' },
        { word: 'paraissait', meaning: '看起来' },
        { word: 'absurde', meaning: '荒谬的' },
        { word: 'failli abandonner', meaning: '差点放弃' },
      ]},
      { french: 'Pourtant, j\'ai persévéré. J\'ai commencé à regarder des films français avec sous-titres. J\'ai écouté des chansons de Édith Piaf et de Stromae. Petit à petit, la langue est devenue moins étrangère. Les sons qui me semblaient impossibles à prononcer sont devenus familiers.', chinese: '然而我坚持了下来。我开始看法语电影配字幕。我听 Édith Piaf 和 Stromae 的歌。慢慢地，这门语言变得不那么陌生了。那些曾经觉得不可能发出的音变得熟悉了。', vocab: [
        { word: 'Pourtant', meaning: '然而' },
        { word: 'persévéré', meaning: '坚持' },
        { word: 'sous-titres', meaning: '字幕' },
        { word: 'Petit à petit', meaning: '一点点地' },
        { word: 'étrangère', meaning: '陌生的' },
      ]},
      { french: 'Aujourd\'hui, je vis à Lyon. Je travaille dans une entreprise de design. Chaque matin, je prends mon café en terrasse et je regarde la ville s\'éveiller. Je parle français avec mes collègues, mes voisins, les commerçants. Ce rêve qui semblait si lointain est devenu ma réalité.', chinese: '今天，我住在里昂。我在一家设计公司工作。每天早晨，我在露台上喝咖啡，看着城市苏醒。我和同事、邻居、商贩说法语。那个曾经看似遥远的梦想，已经成了我的现实。', vocab: [
        { word: 'en terrasse', meaning: '在露天座位' },
        { word: 's\'éveiller', meaning: '苏醒' },
        { word: 'commerçants', meaning: '商贩' },
        { word: 'lointain', meaning: '遥远的' },
        { word: 'réalité', meaning: '现实' },
      ]},
    ],
  },
];

// ============================================================
// Movie & TV Scripts — learn from real dialogues
// ============================================================
export const movieScripts: Story[] = [
  {
    id: 'script-amelie',
    title: 'Le Fabuleux Destin d\'Amélie Poulain',
    titleZh: '天使爱美丽',
    type: 'script',
    level: 'B1',
    source: '2001年电影 · 导演 Jean-Pierre Jeunet',
    emoji: '🎬',
    paragraphs: [
      { speaker: 'Narrateur', french: 'Le 3 septembre 1973, à 18h28min32s, une mouche bleue de la famille des calliphoridés, capable de produire 14 670 battements d\'ailes par minute, se posait sur la rue Saint-Vincent à Montmartre.', chinese: '1973年9月3日下午6点28分32秒，一只属于丽蝇科的蓝苍蝇，每分钟能振翅14670次，降落在蒙马特的圣文森特街。', vocab: [
        { word: 'mouche', meaning: '苍蝇' },
        { word: 'ailes', meaning: '翅膀' },
        { word: 'se posait', meaning: '降落' },
      ]},
      { speaker: 'Narrateur', french: 'À la même seconde, dans un restaurant voisin, le propriétaire effaçait une inscription sur son ardoise. C\'était l\'inscription suivante: "Pas de jambon".', chinese: '同一秒，在隔壁的餐厅，老板正在黑板上擦掉一行字。上面写的是："没有火腿"。', vocab: [
        { word: 'propriétaire', meaning: '老板；业主' },
        { word: 'effaçait', meaning: '擦去' },
        { word: 'ardoise', meaning: '黑板' },
      ]},
      { speaker: 'Amélie', french: 'C\'est drôle la vie. Quand on est gosse, le temps n\'en finit pas de traîner... Et puis du jour au lendemain on a cinquante ans.', chinese: '生活真有趣。小时候觉得时间过得好慢... 然后一转眼就五十岁了。', vocab: [
        { word: 'drôle', meaning: '有趣的' },
        { word: 'gosse', meaning: '小孩（口语）' },
        { word: 'traîner', meaning: '拖沓' },
        { word: 'du jour au lendemain', meaning: '一夜之间' },
      ]},
      { speaker: 'Amélie', french: 'Mademoiselle, vous avez rendez-vous? Non, non. Je suis venue aider quelqu\'un.', chinese: '小姐，您有预约吗？不，不。我是来帮助某人的。', vocab: [
        { word: 'rendez-vous', meaning: '约会；预约' },
        { word: 'venue', meaning: '来（venir的过去分词）' },
      ]},
    ],
  },
  {
    id: 'script-intouchables',
    title: 'Intouchables',
    titleZh: '触不可及',
    type: 'script',
    level: 'A2',
    source: '2011年电影 · 改编自真实故事',
    emoji: '🤝',
    paragraphs: [
      { speaker: 'Driss', french: 'Franchement, vous me faites rire. C\'est pour ça que je vous aime bien.', chinese: '说真的，你让我发笑。这就是我喜欢你的原因。', vocab: [
        { word: 'Franchement', meaning: '说实话' },
        { word: 'faites rire', meaning: '让...发笑' },
      ]},
      { speaker: 'Driss', french: 'Pas de bras, pas de chocolat!', chinese: '没有手臂就没有巧克力！', vocab: [
        { word: 'bras', meaning: '手臂' },
      ]},
      { speaker: 'Philippe', french: 'Je ne veux pas de votre pitié. Je veux que vous soyez normal avec moi.', chinese: '我不需要你的同情。我只希望你用正常的方式对我。', vocab: [
        { word: 'pitié', meaning: '同情' },
        { word: 'normal', meaning: '正常的' },
      ]},
      { speaker: 'Driss', french: 'Écoutez, je suis pas là pour vous plaindre. La vie, c\'est comme ça. Des fois on gagne, des fois on perd.', chinese: '听着，我不是来同情你的。生活就是这样，有时赢有时输。', vocab: [
        { word: 'plaindre', meaning: '同情；怜悯' },
      ]},
    ],
  },
  {
    id: 'script-petit-nicolas',
    title: 'Le Petit Nicolas',
    titleZh: '小淘气尼古拉',
    type: 'script',
    level: 'A1',
    source: '2009年电影 · 改编自经典童书',
    emoji: '👦',
    paragraphs: [
      { speaker: 'Nicolas', french: 'Moi, je suis Nicolas. J\'ai une maman, un papa, et une maîtresse qui est très gentille. Mais aujourd\'hui, j\'ai un gros problème.', chinese: '我是尼古拉。我有一个妈妈、一个爸爸，还有一个非常好的老师。但今天我有一个大问题。', vocab: [
        { word: 'maîtresse', meaning: '女老师（小学）' },
        { word: 'problème', meaning: '问题' },
      ]},
      { speaker: 'Nicolas', french: 'Papa m\'a dit que maman allait avoir un bébé. Un bébé! Mes copains m\'ont raconté des histoires terribles. Ils disent que quand un bébé arrive, les parents oublient leur grand enfant.', chinese: '爸爸说妈妈要有小宝宝了。小宝宝！我的朋友们给我讲了很多可怕的故事。他们说宝宝来了以后，父母会忘了大孩子。', vocab: [
        { word: 'bébé', meaning: '宝宝' },
        { word: 'copains', meaning: '朋友；伙伴' },
        { word: 'raconté', meaning: '讲述了' },
        { word: 'oublient', meaning: '忘记' },
      ]},
      { speaker: 'Alceste', french: 'Moi, quand ma petite sœur est née, mes parents ne m\'ont plus jamais emmené au restaurant. Plus jamais!', chinese: '我妹妹出生后，我爸妈再也没带我去过餐厅。再也没去过！', vocab: [
        { word: 'née', meaning: '出生' },
        { word: 'emmené', meaning: '带去' },
      ]},
      { speaker: 'Nicolas', french: 'Je ne veux pas être oublié. Je vais faire quelque chose de génial pour que mes parents soient fiers de moi.', chinese: '我不想被忘记。我要做一件了不起的事，让父母为我骄傲。', vocab: [
        { word: 'génial', meaning: '了不起的' },
        { word: 'fiers', meaning: '骄傲的' },
      ]},
    ],
  },
];

// ============================================================
// Helper functions
// ============================================================
export function getAllStories(): Story[] {
  return [...frenchStories, ...movieScripts];
}

export function getStoriesByLevel(level: string): Story[] {
  return getAllStories().filter(s => s.level === level);
}

export function getStoriesByType(type: 'story' | 'script'): Story[] {
  return getAllStories().filter(s => s.type === type);
}

// Download a story as readable HTML file
export function downloadStoryAsHTML(story: Story): void {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>${story.title} - FrenchFlow</title>
<style>
  body { font-family: Georgia, serif; max-width: 700px; margin: 0 auto; padding: 20px; background: #fffaf5; color: #333; line-height: 2; }
  h1 { color: #58CC02; border-bottom: 2px solid #58CC02; padding-bottom: 10px; }
  .fr { font-size: 18px; margin: 15px 0; }
  .zh { color: #666; font-size: 15px; margin-bottom: 25px; padding-left: 15px; border-left: 3px solid #eee; }
  .speaker { color: #e74c3c; font-weight: bold; }
  .vocab { background: #f0f0f0; padding: 8px 15px; border-radius: 8px; margin: 5px 0 15px; font-size: 14px; }
  .meta { color: #999; font-size: 13px; margin-bottom: 20px; }
</style></head>
<body>
<h1>${story.emoji} ${story.title}</h1>
<p class="meta">${story.titleZh} | 级别: ${story.level} | 来自 FrenchFlow 随身法语助手</p>
${story.paragraphs.map(p => `
  <p class="fr">${p.speaker ? `<span class="speaker">[${p.speaker}]</span> ` : ''}${p.french}</p>
  <p class="zh">${p.chinese}</p>
  ${p.vocab ? `<div class="vocab">📖 ${p.vocab.map(v => `<b>${v.word}</b> = ${v.meaning}`).join(' · ')}</div>` : ''}
`).join('\n')}
<p style="text-align:center;color:#ccc;margin-top:40px;">— 来自 FrenchFlow 随身法语助手 🇫🇷</p>
</body></html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${story.id}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

// Download all stories as one HTML book
export function downloadAllStoriesAsBook(): void {
  const stories = getAllStories();
  const html = `<!DOCTYPE html><html lang="fr">
<head><meta charset="UTF-8"><title>FrenchFlow 法语阅读库</title>
<style>
  body { font-family: Georgia, serif; max-width: 750px; margin: 0 auto; padding: 20px; background: #fffaf5; color: #333; line-height: 2; }
  h1 { color: #58CC02; text-align:center; }
  h2 { color: #e74c3c; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 40px; }
  .fr { font-size: 18px; margin: 12px 0; }
  .zh { color: #666; font-size: 15px; margin-bottom: 20px; padding-left: 15px; border-left: 3px solid #eee; }
  .speaker { color: #e74c3c; font-weight: bold; }
  .vocab { background: #f0f0f0; padding: 8px 15px; border-radius: 8px; margin: 5px 0 15px; font-size: 14px; }
</style></head><body>
<h1>🇫🇷 FrenchFlow 法语阅读库</h1>
<p style="text-align:center;color:#999">共 ${stories.length} 篇文章 · 支持离线阅读</p>
${stories.map(s => `
  <h2>${s.emoji} ${s.title} <small style="color:#999">${s.level}</small></h2>
  <p style="color:#999">${s.titleZh} ${s.source ? '· ' + s.source : ''}</p>
  ${s.paragraphs.map(p => `
    <p class="fr">${p.speaker ? `<span class="speaker">[${p.speaker}]</span> ` : ''}${p.french}</p>
    <p class="zh">${p.chinese}</p>
    ${p.vocab ? `<div class="vocab">📖 ${p.vocab.map(v => `<b>${v.word}</b> = ${v.meaning}`).join(' · ')}</div>` : ''}
  `).join('\n')}
`).join('\n<hr style="margin:30px 0;border-color:#eee">')}
</body></html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'FrenchFlow-阅读库.html';
  a.click();
  URL.revokeObjectURL(url);
}
