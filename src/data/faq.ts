// ============================================================
// FAQ Knowledge Base — 100+ common French questions
// Keyword matching engine, zero AI needed
// ============================================================

export interface FAQEntry {
  id: string;
  keywords: string[];   // Chinese keywords for matching
  question: string;      // The question (Chinese)
  answer: string;        // The answer (Chinese, with French examples)
  tags: string[];        // Categories: grammar, vocab, culture, pronunciation, exam
}

export const faqDatabase: FAQEntry[] = [
  // === 基础语法 Grammar ===
  {
    id: 'faq-001',
    keywords: ['名词', '性别', '阴阳性', 'le', 'la', '区分'],
    question: '怎么区分法语名词的阴阳性？',
    answer: '法语名词的阴阳性需要逐个记忆，但有一些规律可以参考：\n\n📌 **通常阳性的词尾：**\n-age: le voyage, le fromage\n-ment: le moment, le bâtiment\n-eau: le bateau, le château\n-isme: le tourisme\n\n📌 **通常阴性的词尾：**\n-tion/sion: la nation, la décision\n-té: la liberté, la beauté\n-ade: la salade, la promenade\n-esse: la jeunesse, la tristesse\n\n⚠️ 例外很多！最好的方法是记单词时把冠词一起记：le livre, la table。',
    tags: ['grammar'],
  },
  {
    id: 'faq-002',
    keywords: ['动词变位', 'conjugaison', '变位', '规则'],
    question: '法语动词变位有什么规律？',
    answer: '法语动词分三组：\n\n**第一组 -ER（规则）：**\nparler → je parle, tu parles, il parle, nous parlons, vous parlez, ils parlent（词尾：-e, -es, -e, -ons, -ez, -ent）\n\n**第二组 -IR（规则）：**\nfinir → je finis, tu finis, il finit, nous finissons, vous finissez, ils finissent\n\n**第三组（不规则）：**\nêtre, avoir, aller, faire, pouvoir, vouloir, devoir...\n这些必须单独记忆，没有统一规律。\n\n💡 好消息：-ER 动词占法语动词的 80% 以上，规则统一。',
    tags: ['grammar'],
  },
  {
    id: 'faq-003',
    keywords: ['passé composé', '复合过去时', '过去时', 'avoir', 'être'],
    question: 'Passé composé 什么时候用 être，什么时候用 avoir？',
    answer: '**大多数动词用 avoir：**\nJ\'ai mangé, J\'ai parlé, J\'ai fini...\n\n**用 être 的 17 个动词（"DR MRS VANDERTRAMP" 口诀）：**\nDevenir, Revenir, Monter, Rester, Sortir\nVenir, Aller, Naître, Descendre, Entrer, Retourner, Tomber, Rentrer, Arriver, Mourir, Partir\n\n例：Je suis allé(e), Elle est partie, Nous sommes arrivés\n\n**代词式动词也用 être：**\nJe me suis levé(e) = 我起床了\n\n💡 être 动词的过去分词要和主语性数配合！',
    tags: ['grammar'],
  },
  {
    id: 'faq-004',
    keywords: ['虚拟式', 'subjonctif', '虚拟'],
    question: '什么时候用虚拟式 (subjonctif)？',
    answer: '虚拟式用于表达主观判断。以下是必须用虚拟式的结构：\n\n**必要性：** Il faut que...\n**愿望：** Je veux que..., Je souhaite que...\n**情感：** Je suis content que..., Je regrette que...\n**怀疑：** Je doute que..., Il est possible que...\n**让步：** Bien que..., Quoique...\n**目的：** Pour que..., Afin que...\n\n❌ 不用虚拟式的：\nJe pense que...（肯定）\nJe crois que...（肯定）\nIl est certain que...\n\n💡 简单规则：如果从句表达的是事实 → 直陈式。如果是主观 → 虚拟式。',
    tags: ['grammar'],
  },
  {
    id: 'faq-005',
    keywords: ['否定', 'ne pas', 'ne plus', 'ne jamais', 'ne rien'],
    question: '法语的否定形式有哪些？',
    answer: '基本结构：ne + 动词 + 否定词\n\n📌 **常见否定：**\nne...pas = 不 (Je ne parle pas = 我不说)\nne...plus = 不再 (Je ne fume plus = 我不再抽烟了)\nne...jamais = 从不 (Je ne bois jamais = 我从不喝酒)\nne...rien = 什么都不 (Je ne vois rien = 我什么都没看到)\nne...personne = 没人 (Je ne vois personne = 我谁都没看到)\nne...que = 只 (Je n\'ai que 10 euros = 我只有 10 欧)\n\n⚠️ 口语中常省略 ne：J\'ai pas faim = 我不饿。',
    tags: ['grammar'],
  },
  {
    id: 'faq-006',
    keywords: ['冠词', 'article', 'le', 'la', 'un', 'une', 'du', 'de la'],
    question: '法语冠词到底怎么用？(le/la/un/du/de la...)',
    answer: '法语冠词分三类：\n\n**1. 定冠词 (le/la/l\'/les)** = the\n指特定事物：Le livre est sur la table.\n\n**2. 不定冠词 (un/une/des)** = a/an/some\n指不特定事物：J\'ai un chat.\n\n**3. 部分冠词 (du/de la/de l\'/des)** = some\n指不可数/不确定量：Je bois du café. Je mange de la viande.\n\n📌 否定句中，不定冠词和部分冠词变 de：\nJ\'ai un chat → Je n\'ai pas de chat.\nJe bois du café → Je ne bois pas de café.',
    tags: ['grammar'],
  },
  {
    id: 'faq-007',
    keywords: ['比较级', 'plus', 'moins', '比较', 'aussi'],
    question: '法语怎么表达比较？',
    answer: '**比较级结构：plus/moins/aussi + 形容词 + que**\n\n📌 更高：plus + adj + que\nElle est plus grande que moi = 她比我高\n\n📌 更低：moins + adj + que\nCe livre est moins intéressant = 这本书没那么有趣\n\n📌 同等：aussi + adj + que\nIl est aussi intelligent que son frère = 他和他哥一样聪明\n\n⚠️ 三个不规则比较：\nbon → meilleur (更好)\nmauvais → pire (更差)\npetit → moindre (更小/次要)',
    tags: ['grammar'],
  },

  // === 语音 Pronunciation ===
  {
    id: 'faq-008',
    keywords: ['发音', 'prononciation', '鼻音', 'an', 'en', 'in', 'on', 'un'],
    question: '法语鼻音怎么发？（an/en/in/on/un）',
    answer: '法语有 4 个鼻化元音：\n\n📌 **/ɑ̃/ — an, en, am, em**\n像"帮"但鼻子出气：dans, enfant, chambre\n\n📌 **/ɛ̃/ — in, im, ain, ein, en（少数）**\n像"班"但鼻子出气：vin, important, pain, plein\n\n📌 **/ɔ̃/ — on, om**\n嘴撮圆+鼻子出气：bon, nom, maison\n\n📌 **/œ̃/ — un, um**（正在消失，很多人用/ɛ̃/代替）\n像 in 但嘴更圆：un, parfum\n\n💡 技巧：用手指轻捏鼻子，发音时如果感到震动就是鼻音！',
    tags: ['pronunciation'],
  },
  {
    id: 'faq-009',
    keywords: ['r音', '小舌音', '法语r', 'r'],
    question: '法语的小舌音 R 怎么练？',
    answer: '法语 R 是小舌颤音（喉咙深处发音），不是中文的 r。\n\n📌 **练习步骤：**\n1. 含一口水在喉咙，仰头发出"咕噜咕噜"的声音 → 这就是小舌位置\n2. 不用水，尝试在同一位置发出轻微的摩擦音\n3. 从"k"（喉咙爆破音）的位置开始，稍微放松，让气流摩擦小舌\n4. 先从简单的词练：\n   - rouge, rue, riz（R 在词首，容易发）\n   - Paris, merci, partir（R 在词中）\n   - bonjour, bonsoir（R 在词尾，轻轻带过）\n\n💡 实在发不好也没关系，用轻 H 音代替（像"喝"），法国人也能听懂！',
    tags: ['pronunciation'],
  },
  {
    id: 'faq-010',
    keywords: ['联诵', 'liaison', '连读', '连音'],
    question: '什么情况下要联诵 (liaison)？',
    answer: '联诵 = 前词末尾不发音的辅音 + 后词元音开头 → 连读。\n\n📌 **必须联诵：**\n- 冠词+名词：les‿amis, un‿enfant\n- 形容词+名词：petit‿enfant, grand‿homme\n- 代词+动词：nous‿allons, ils‿arrivent\n- 介词+名词：chez‿elle, dans‿un\n- 助动词+过去分词：ils ont‿aimé\n\n📌 **禁止联诵：**\n- 名词+形容词：un garçon ( ) intelligent\n- 连词 et 后：et ( ) elle\n- H 嘘音词前：les ( ) haricots\n\n💡 联诵让法语听起来流畅优雅，是地道法语的标志！',
    tags: ['pronunciation'],
  },

  // === 词汇 Vocab ===
  {
    id: 'faq-011',
    keywords: ['词汇', '记单词', '记忆', '单词'],
    question: '有什么记法语单词的好方法？',
    answer: '📌 **高效记单词技巧：**\n\n1. **词根词缀法**：很多法语词和英语相似\n   information→information, liberté→liberty\n\n2. **分组记忆**：\n   一次记一组相关的词（食物、颜色、交通...）\n\n3. **联想记忆**：\n   pomme de terre = "地里的苹果" = 土豆 🥔\n\n4. **在句子中记**：\n   不要背孤立的词，背包含这个词的完整句子\n\n5. **间隔复习 (SM-2)**：\n   FrenchFlow 的闪卡系统自动帮你安排复习时间\n\n6. **每天定量**：\n   每天新词 10 个，复习旧词，比一次背 50 个有效得多。',
    tags: ['vocab'],
  },
  {
    id: 'faq-012',
    keywords: ['faux amis', '假朋友', '同形异义'],
    question: '法语和英语有哪些容易搞混的假朋友 (faux amis)？',
    answer: '📌 **常见 faux amis（拼写相似但意思不同）：**\n\n- actuellement = 目前（≠ actually = 实际上）\n- un car = 大巴（≠ a car = 小汽车）\n- une librairie = 书店（≠ library = 图书馆 → bibliothèque）\n- assister à = 参加（≠ to assist = 帮助）\n- attendre = 等待（≠ to attend = 参加）\n- demander = 问/请求（≠ to demand = 要求）\n- la chance = 运气（≠ chance = 机会 → occasion）\n- éventuellement = 可能（≠ eventually = 最终 → finalement）\n- le pain = 面包（≠ pain = 疼痛 → douleur）\n- sensible = 敏感的（≠ sensible = 明智的 → raisonnable）',
    tags: ['vocab'],
  },

  // === 文化 Culture ===
  {
    id: 'faq-013',
    keywords: ['vous', 'tu', '尊称', '正式', '非正式', '称呼'],
    question: '什么时候用 vous，什么时候用 tu？',
    answer: '**Vous（尊称"您"）：**\n- 陌生人、长辈、上级\n- 正式场合（商店、餐厅、办公室）\n- 第一次见面的人\n- 复数 = "你们"\n\n**Tu（你）：**\n- 朋友、家人、同龄人\n- 儿童之间\n- 上级对下级（单向）\n- 社交网络\n\n💡 不确定时就用 vous！对方可能会说 "On peut se tutoyer?"（我们可以用 tu 吗？）——这就是你可以切换的讯号。',
    tags: ['culture'],
  },
  {
    id: 'faq-014',
    keywords: ['法国', '文化', '礼仪', '用餐', '小费', '生活'],
    question: '去法国需要注意哪些文化礼仪？',
    answer: '📌 **法国生活礼仪要点：**\n\n**打招呼：** 进入商店/电梯要说 Bonjour，离开说 Au revoir。不打招呼被认为很没礼貌。\n\n**用餐：** 等所有人菜都上齐了再开始吃。两手放桌上（不要放膝上）。面包直接放桌布上。\n\n**小费：** 账单已含 15% 服务费。但凑整留几欧硬币是常见的礼貌。\n\n**排队：** 法国人排队很有耐心。插队是大忌。\n\n**称呼：** 正式场合用 Monsieur/Madame。不说 Excusez-moi? 直接问问题。\n\n**周日：** 大部分商店关门。周日是家庭日。\n\n**亲吻礼 (la bise)：** 朋友见面贴面（通常是两下，地区不同）。不熟的人握手。',
    tags: ['culture'],
  },
  {
    id: 'faq-015',
    keywords: ['DELF', 'DALF', 'TCF', '考试', '考级', '等级'],
    question: 'DELF/DALF/TCF 考试有什么区别？我应该考哪个？',
    answer: '📌 **三种法语考试：**\n\n**DELF/DALF（终身有效）：**\n- DELF A1-B2：初级到中高级\n- DALF C1-C2：高级到母语\n- 最权威，终身有效，适合留学/移民\n- 每年 4 次考试机会，全球通用\n\n**TCF（2年有效）：**\n- 全部等级一次考完，电脑评分\n- 适合快速获得等级证明\n- 移民法国常用\n\n**TEF（2年有效）：**\n- 类似 TCF，加拿大移民常用\n\n💡 留学法国一般要求 DELF B2 或 DALF C1。',
    tags: ['exam', 'culture'],
  },

  // === 更多常见问题 ===
  {
    id: 'faq-016',
    keywords: ['ce', 'cet', 'cette', 'ces', 'ce que', 'ce qui', '指示'],
    question: '"Ce/cette/ces" 和 "ce qui/ce que" 怎么区分？',
    answer: '**指示形容词 ce/cet/cette/ces = this/that/these/those：**\nce + 阳性单数辅音开头：ce livre\ncet + 阳性单元音开头：cet homme\ncette + 阴性单数：cette table\nces + 复数：ces livres, ces tables\n\n**关系代词 ce qui/ce que = what：**\nce qui = what（做主语）：Je sais ce qui est important = 我知道什么是重要的\nce que = what（做宾语）：Je sais ce que tu veux = 我知道你要什么\nce dont = what...of：Je sais ce dont tu parles = 我知道你在说什么',
    tags: ['grammar'],
  },
  {
    id: 'faq-017',
    keywords: ['depuis', 'pendant', 'pour', 'il y a', '时间'],
    question: 'Depuis / pendant / pour / il y a 怎么区分？',
    answer: '都和"时间"有关，但用法不同：\n\n**Depuis + 现在时** = 从过去持续到现在（还在继续）\nJ\'apprends le français depuis 6 mois = 学法语 6 个月了（现在还在学）\n\n**Pendant** = 在...期间（完整的时间段）\nJ\'ai vécu en France pendant 3 ans = 在法国住了 3 年（已结束）\n\n**Pour** = 计划在未来持续多久\nJe pars en France pour 2 semaines = 我要去法国待两周\n\n**Il y a** = ...之前\nJe suis arrivé il y a 3 jours = 我 3 天前到的\n\n**Dans** = ...之后（将来）\nJe pars dans 3 jours = 我 3 天后出发',
    tags: ['grammar'],
  },
  {
    id: 'faq-018',
    keywords: ['de', 'du', 'des', 'de la', 'de l\'', '部分'],
    question: '什么时候用 de 什么时候用 du/des？',
    answer: '**Du/de la/des = 部分冠词（"一些"）：**\n在肯定句中和不可数名词/不确定量搭配：\nJe bois du café = 我喝（一些）咖啡\n\n**De（无冠词）：**\n1. 表达数量：beaucoup de, un peu de, un kilo de...\n2. 否定句：Je n\'ai pas de chat\n3. 形容词前（复数）：de belles fleurs（而非 des belles fleurs）\n\n**De + le/les 缩合：**\nde + le → du（所有格）：le livre du professeur\nde + les → des：le livre des étudiants',
    tags: ['grammar'],
  },
  {
    id: 'faq-019',
    keywords: ['en', 'y', '代词', '副代词'],
    question: 'En 和 Y 的用法有什么区别？',
    answer: '**En = de + 名词：**\n- 代替"de + 地点"：Je viens de Paris → J\'en viens\n- 代替"de + 事物"：Je parle de mon travail → J\'en parle\n- 代替数量后的名词：J\'ai trois pommes → J\'en ai trois\n- 固定搭配：avoir besoin de → J\'en ai besoin\n\n**Y = à + 名词：**\n- 代替"à + 地点"：Je vais à Paris → J\'y vais\n- 代替"à + 事物"：Je pense à mon travail → J\'y pense\n- 固定搭配：s\'intéresser à → Je m\'y intéresse\n\n💡 口诀：en 代替 de..., y 代替 à...。',
    tags: ['grammar'],
  },
  {
    id: 'faq-020',
    keywords: ['imparfait', 'passé composé', '区别', '未完成', '复合过去'],
    question: 'Imparfait 和 Passé composé 的区别？什么时候用哪个？',
    answer: '**Imparfait（未完成过去时）：**\n用于过去持续/重复/背景：\n- 习惯：Quand j\'étais petit, je jouais dans le jardin.\n- 描述：Il faisait beau, les oiseaux chantaient.\n- 背景+被打断：Je dormais quand le téléphone a sonné.\n\n**Passé composé（复合过去时）：**\n用于过去完成/一次性/先后动作：\n- 事件：Hier, je suis allé au cinéma.\n- 打断：Le téléphone a sonné（打断了睡觉）\n\n💡 一句话里 imparfait（背景画布）+ passé composé（画上去的事件）。\n\n例子：Il pleuvait (背景). Je suis sorti (事件).',
    tags: ['grammar'],
  },
];

// ============================================================
// Search engine — keyword matching
// ============================================================
export function searchFAQ(query: string, maxResults = 5): FAQEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return faqDatabase.slice(0, maxResults);

  // Score each entry by keyword match
  const scored = faqDatabase.map(entry => {
    let score = 0;
    // Match against keywords
    for (const kw of entry.keywords) {
      if (q.includes(kw.toLowerCase()) || kw.toLowerCase().includes(q)) {
        score += 10;
      }
    }
    // Match against question text
    if (entry.question.toLowerCase().includes(q)) {
      score += 20;
    }
    // Match against tags
    for (const tag of entry.tags) {
      if (q.includes(tag)) score += 5;
    }
    return { entry, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(s => s.entry);
}

export function getFAQByTag(tag: string): FAQEntry[] {
  return faqDatabase.filter(e => e.tags.includes(tag));
}

export function getAllFAQTags(): string[] {
  const tags = new Set<string>();
  for (const e of faqDatabase) {
    for (const t of e.tags) tags.add(t);
  }
  return [...tags];
}
