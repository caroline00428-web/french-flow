// ============================================================
// Scenario Dialogue Practice — 10 everyday French conversations
// Branching choices with feedback. Pre-written, zero AI.
// ============================================================

export interface DialogueChoice {
  text: string;
  nextNode: number;     // 0-based index into nodes[]
  feedback: string;     // Shown after choosing
  isBest: boolean;      // Is this the best/expected answer
}

export interface DialogueNode {
  speaker: 'narrator' | 'vous' | string;
  french: string;
  chinese: string;
  choices?: DialogueChoice[];  // If present, user picks; if absent, auto-advance
}

export interface DialogueScenario {
  id: string;
  title: string;
  titleZh: string;
  level: 'A0' | 'A1' | 'A2';
  emoji: string;
  description: string;
  nodes: DialogueNode[];
}

export const dialogueScenarios: DialogueScenario[] = [
  // ═══════════════ 1: Au café ═══════════════
  {
    id: 'cafe',
    title: 'Au café',
    titleZh: '在咖啡馆',
    level: 'A0',
    emoji: '☕',
    description: '学习如何在法国咖啡馆点单。记住：礼貌最重要！',
    nodes: [
      {
        speaker: 'narrator', french: '你在巴黎街头，走进一家小咖啡馆。服务员正在等你点单。', chinese: '',
      },
      {
        speaker: 'serveur', french: 'Bonjour! Vous désirez?', chinese: '你好！想要点什么？',
        choices: [
          { text: 'Un café, s\'il vous plaît.', nextNode: 2, feedback: '✅ 完美！礼貌又得体。', isBest: true },
          { text: 'Café!', nextNode: 3, feedback: '⚠️ 太直接了。法国人会觉得有点粗鲁。', isBest: false },
          { text: 'Bonjour! Je voudrais un café, s\'il vous plaît.', nextNode: 4, feedback: '✨ 非常礼貌！先用 Bonjour 打招呼再加 s\'il vous plaît，满分！', isBest: false },
        ],
      },
      {
        speaker: 'serveur', french: 'Bien sûr. Un instant.', chinese: '好的，马上来。',
        choices: [
          { text: 'Merci!', nextNode: 5, feedback: '✅ 简单得体！', isBest: true },
          { text: '(不说话，等咖啡)', nextNode: 6, feedback: '⚠️ 说声 Merci 会更礼貌哦。', isBest: false },
        ],
      },
      {
        speaker: 'serveur', french: '... (微微皱眉) D\'accord... Un instant.', chinese: '...（微微皱眉）好... 马上来。',
        choices: [
          { text: 'Merci beaucoup!', nextNode: 5, feedback: '👍 亡羊补牢！服务态度好了一些。', isBest: false },
          { text: 'Pardon, je suis désolé. Merci beaucoup.', nextNode: 5, feedback: '👍 道歉让气氛缓和了。', isBest: false },
        ],
      },
      {
        speaker: 'serveur', french: 'Avec plaisir! Un excellent choix.', chinese: '很乐意！选得真好。',
      },
      {
        speaker: 'narrator', french: '☕ 咖啡来了，闻起来很香。', chinese: '',
        choices: [
          { text: 'Le café est très bon!', nextNode: 7, feedback: '😊 服务员笑了。', isBest: true },
        ],
      },
      {
        speaker: 'narrator', french: '☕ 咖啡来了，但你注意到服务态度不太好。下次记得多说 s\'il vous plaît！', chinese: '',
        choices: [
          { text: '(默默喝完咖啡)', nextNode: 7, feedback: '学到了教训。', isBest: false },
        ],
      },
      {
        speaker: 'narrator', french: '💡 今日学习：在法国点单，s\'il vous plaît（请）和 merci（谢谢）是魔法词。彬彬有礼是法国文化的核心。', chinese: '',
      },
    ],
  },

  // ═══════════════ 2: À la gare ═══════════════
  {
    id: 'gare',
    title: 'À la gare',
    titleZh: '在火车站',
    level: 'A1',
    emoji: '🚂',
    description: '在法国火车站买票、问站台的实用对话。',
    nodes: [
      {
        speaker: 'narrator', french: '你在巴黎 Gare de Lyon，要买一张去里昂的单程票。', chinese: '',
      },
      {
        speaker: 'guichetier', french: 'Bonjour. Je peux vous aider?', chinese: '你好，我能帮您吗？',
        choices: [
          { text: 'Bonjour. Un billet pour Lyon, s\'il vous plaît.', nextNode: 2, feedback: '✅ 简洁清晰！', isBest: true },
          { text: 'Je veux aller à Lyon.', nextNode: 3, feedback: '⚠️ 能听懂，但不够正式。', isBest: false },
          { text: 'Bonjour. Je voudrais un aller simple pour Lyon, s\'il vous plaît.', nextNode: 4, feedback: '✨ 非常精准！aller simple = 单程票。', isBest: false },
        ],
      },
      {
        speaker: 'guichetier', french: 'Aller simple ou aller-retour?', chinese: '单程还是往返？',
        choices: [
          { text: 'Aller simple, s\'il vous plaît.', nextNode: 5, feedback: '✅ 单程票。', isBest: true },
          { text: 'Aller-retour.', nextNode: 5, feedback: '往返票也可以。', isBest: false },
        ],
      },
      {
        speaker: 'guichetier', french: 'Vous voulez un billet pour Lyon? Aller simple ou aller-retour?', chinese: '您要去里昂的票？单程还是往返？',
        choices: [
          { text: 'Aller simple, merci.', nextNode: 5, feedback: '👍 这次说对了。', isBest: false },
        ],
      },
      {
        speaker: 'guichetier', french: 'Parfait. Aller simple pour Lyon. Quel jour?', chinese: '好的。单程去里昂。哪一天？',
        choices: [
          { text: 'Aujourd\'hui.', nextNode: 5, feedback: '✅ 今天走。', isBest: true },
        ],
      },
      {
        speaker: 'guichetier', french: 'Ça fera 56 euros. Vous payez par carte ou en espèces?', chinese: '一共 56 欧。刷卡还是现金？',
        choices: [
          { text: 'Par carte, s\'il vous plaît.', nextNode: 6, feedback: '✅ 刷卡支付。', isBest: true },
        ],
      },
      {
        speaker: 'guichetier', french: 'Voici votre billet. Le train part du quai numéro 5 à 14h30. Bon voyage!', chinese: '这是您的票。火车 14:30 从 5 号站台出发。旅途愉快！',
      },
    ],
  },

  // ═══════════════ 3: Au restaurant ═══════════════
  {
    id: 'restaurant',
    title: 'Au restaurant',
    titleZh: '在餐厅',
    level: 'A1',
    emoji: '🍽️',
    description: '在法国餐厅从进门到买单的完整对话流程。',
    nodes: [
      {
        speaker: 'narrator', french: '你走进一家法国餐厅，门口站着服务员。', chinese: '',
      },
      {
        speaker: 'serveur', french: 'Bonsoir! Vous avez réservé?', chinese: '晚上好！您预订了吗？',
        choices: [
          { text: 'Bonsoir! Oui, j\'ai réservé une table.', nextNode: 2, feedback: '✅ 是的，预订了。', isBest: true },
          { text: 'Non, je n\'ai pas réservé.', nextNode: 3, feedback: '没预订，可能需要等位。', isBest: false },
        ],
      },
      {
        speaker: 'serveur', french: 'Très bien. À quel nom?', chinese: '好的。什么名字？',
        choices: [
          { text: 'Au nom de Wang.', nextNode: 4, feedback: '✅ 就这样说。', isBest: true },
        ],
      },
      {
        speaker: 'serveur', french: 'Je regarde s\'il reste une table... Oui, suivez-moi.', chinese: '我看看有没有空桌... 有的，请跟我来。',
      },
      {
        speaker: 'serveur', french: '(引导你到桌子) Voici la carte.', chinese: '（引导你到桌子）这是菜单。',
        choices: [
          { text: 'Merci. Qu\'est-ce que vous recommandez?', nextNode: 5, feedback: '✅ 问问推荐菜，很好的策略！', isBest: true },
          { text: '(直接看菜单不说话)', nextNode: 5, feedback: '也可以，但问推荐更有趣。', isBest: false },
        ],
      },
      {
        speaker: 'serveur', french: 'Aujourd\'hui, le plat du jour est un poulet rôti avec des légumes. C\'est très bon.', chinese: '今天的每日特餐是烤鸡配蔬菜。很好吃。',
        choices: [
          { text: 'Je prends le plat du jour, s\'il vous plaît.', nextNode: 6, feedback: '✅ plat du jour = 今日特餐，通常性价比最高。', isBest: true },
          { text: 'Je voudrais un steak-frites.', nextNode: 6, feedback: '👍 经典法餐选择。', isBest: false },
        ],
      },
      {
        speaker: 'narrator', french: '（享用完美食后）', chinese: '',
      },
      {
        speaker: 'serveur', french: 'Vous avez terminé? Un dessert?', chinese: '吃好了吗？要甜点吗？',
        choices: [
          { text: 'Non merci. L\'addition, s\'il vous plaît.', nextNode: 8, feedback: '✅ 直接要账单。', isBest: true },
          { text: 'Oui! Qu\'est-ce que vous avez comme dessert?', nextNode: 7, feedback: '🍰 法国甜点值得一试！', isBest: false },
        ],
      },
      {
        speaker: 'serveur', french: 'Nous avons une mousse au chocolat, une tarte aux pommes, et des crêpes.', chinese: '我们有巧克力慕斯、苹果派和可丽饼。',
        choices: [
          { text: 'Une mousse au chocolat!', nextNode: 8, feedback: '🍫 法式经典！', isBest: false },
        ],
      },
      {
        speaker: 'serveur', french: 'L\'addition fait 25 euros. Service compris.', chinese: '账单 25 欧。含服务费。',
      },
      {
        speaker: 'narrator', french: '💡 法国餐厅小贴士：service compris = 服务费已含。不需要额外给小费（但凑整留几欧是礼貌）。', chinese: '',
      },
    ],
  },

  // ═══════════════ 4: Chez le médecin ═══════════════
  {
    id: 'medecin',
    title: 'Chez le médecin',
    titleZh: '看医生',
    level: 'A2',
    emoji: '🏥',
    description: '在法国看医生——描述症状、理解医嘱。',
    nodes: [
      {
        speaker: 'narrator', french: '你感到不舒服，来到了诊所。', chinese: '',
      },
      {
        speaker: 'médecin', french: 'Bonjour. Qu\'est-ce qui ne va pas?', chinese: '你好，哪里不舒服？',
        choices: [
          { text: 'J\'ai de la fièvre et je tousse beaucoup.', nextNode: 2, feedback: '✅ 清楚描述症状。', isBest: true },
          { text: 'Je suis malade.', nextNode: 3, feedback: '太模糊了，医生需要更多细节。', isBest: false },
        ],
      },
      {
        speaker: 'médecin', french: 'Depuis quand?', chinese: '多久了？',
        choices: [
          { text: 'Depuis trois jours.', nextNode: 4, feedback: '✅ depuis + 时间 = 从...开始。', isBest: true },
          { text: 'Trois jours avant.', nextNode: 4, feedback: '能听懂，但 depuis 更准确。', isBest: false },
        ],
      },
      {
        speaker: 'médecin', french: 'Pouvez-vous être plus précis? Quels sont vos symptômes?', chinese: '能说具体点吗？什么症状？',
        choices: [
          { text: 'J\'ai mal à la tête et j\'ai de la fièvre.', nextNode: 4, feedback: '✅ 头疼 + 发烧。', isBest: false },
        ],
      },
      {
        speaker: 'médecin', french: 'Je vais vous examiner. (检查后) Vous avez une grippe. Je vais vous prescrire des médicaments.', chinese: '我给您检查一下... 是流感。我给您开药。',
        choices: [
          { text: 'Merci, docteur. Est-ce que je peux aller travailler?', nextNode: 5, feedback: '✅ 问能否上班。', isBest: true },
        ],
      },
      {
        speaker: 'médecin', french: 'Non, il faut vous reposer. Prenez ces médicaments deux fois par jour pendant cinq jours.', chinese: '不行，要休息。这药每天两次，吃五天。',
        choices: [
          { text: 'D\'accord, merci beaucoup.', nextNode: 6, feedback: '✅ 遵医嘱。', isBest: true },
        ],
      },
      {
        speaker: 'narrator', french: '💡 法国就医：需要先看 médecin généraliste（全科医生）。药房 pharmacie 凭 ordonnance（处方）拿药。社保卡 carte Vitale 报销大部分费用。', chinese: '',
      },
    ],
  },

  // ═══════════════ 5: À l'hôtel ═══════════════
  {
    id: 'hotel',
    title: 'À l\'hôtel',
    titleZh: '在酒店',
    level: 'A1',
    emoji: '🏨',
    description: '酒店入住、询问设施、退房的实用法语。',
    nodes: [
      {
        speaker: 'narrator', french: '你到达酒店前台，准备入住。', chinese: '',
      },
      {
        speaker: 'réceptionniste', french: 'Bonjour! Avez-vous une réservation?', chinese: '你好！有预订吗？',
        choices: [
          { text: 'Bonjour! Oui, j\'ai une réservation.', nextNode: 2, feedback: '✅ 是的。', isBest: true },
        ],
      },
      {
        speaker: 'réceptionniste', french: 'À quel nom?', chinese: '什么名字？',
        choices: [
          { text: 'Wang. J\'ai réservé une chambre pour deux nuits.', nextNode: 3, feedback: '✅ 两晚。', isBest: true },
        ],
      },
      {
        speaker: 'réceptionniste', french: 'Oui, je vois. Une chambre avec salle de bain. Voici votre clé. Chambre 302.', chinese: '找到了。带浴室的房间。这是钥匙，302 房。',
        choices: [
          { text: 'Merci! À quelle heure est le petit-déjeuner?', nextNode: 4, feedback: '✅ 问早餐时间，很实用。', isBest: true },
          { text: 'Merci! Où est l\'ascenseur?', nextNode: 4, feedback: '👍 问电梯在哪，也很实用。', isBest: false },
        ],
      },
      {
        speaker: 'réceptionniste', french: 'Le petit-déjeuner est servi de 7h à 10h. L\'ascenseur est au fond du couloir.', chinese: '早餐 7-10 点。电梯在走廊尽头。',
      },
      {
        speaker: 'narrator', french: '💡 法国酒店实用词：chambre(房间) clé(钥匙) ascenseur(电梯) couloir(走廊) rez-de-chaussée(底层=中国的1楼)。法国 1er étage = 中国的 2 楼！', chinese: '',
      },
    ],
  },

  // ═══════════════ 6: Au marché ═══════════════
  {
    id: 'marche',
    title: 'Au marché',
    titleZh: '在市场',
    level: 'A1',
    emoji: '🧺',
    description: '在法国露天市场买水果蔬菜，练习砍价和数量表达。',
    nodes: [
      {
        speaker: 'narrator', french: '你在法国南部的一个露天市场。卖水果的摊主正在招呼你。', chinese: '',
      },
      {
        speaker: 'marchand', french: 'Approchez! Mes pêches sont délicieuses aujourd\'hui!', chinese: '来看看！今天的桃子特别甜！',
        choices: [
          { text: 'Bonjour! Combien coûtent les pêches?', nextNode: 2, feedback: '✅ 先问价格。', isBest: true },
          { text: '(拿起一个桃子闻了闻)', nextNode: 2, feedback: '法国市场确实可以闻可以摸，但还是问一句更好。', isBest: false },
        ],
      },
      {
        speaker: 'marchand', french: '3 euros le kilo, madame/monsieur. Elles sont excellentes!', chinese: '3 欧一公斤。这些桃子特别好！',
        choices: [
          { text: 'Je voudrais un kilo, s\'il vous plaît.', nextNode: 3, feedback: '✅ 要一公斤。', isBest: true },
          { text: 'C\'est un peu cher... Vous pouvez faire un prix?', nextNode: 4, feedback: '😄 试着砍价！在法国市场可以稍微讨价还价。', isBest: false },
        ],
      },
      {
        speaker: 'marchand', french: 'Voilà un kilo de pêches. Et avec ceci?', chinese: '一公斤桃子。还要别的吗？',
        choices: [
          { text: 'Avez-vous des fraises?', nextNode: 5, feedback: '✅ 还想买草莓。', isBest: true },
        ],
      },
      {
        speaker: 'marchand', french: 'Bon, pour vous, 2 euros 50 le kilo!', chinese: '好，给你的话 2.5 欧一公斤！',
        choices: [
          { text: 'Merci! Je prends un kilo.', nextNode: 5, feedback: '✅ 砍价成功！', isBest: false },
        ],
      },
      {
        speaker: 'marchand', french: 'Oui, elles sont magnifiques. 4 euros la barquette.', chinese: '有，草莓很漂亮。4 欧一盒。',
        choices: [
          { text: 'Je les prends! Ça fait combien?', nextNode: 6, feedback: '✅ 要了。问一共多少钱。', isBest: true },
        ],
      },
      {
        speaker: 'marchand', french: 'Ça fait 7 euros en tout. Merci et bonne journée!', chinese: '一共 7 欧。谢谢，祝您有美好的一天！',
      },
    ],
  },

  // ═══════════════ 7: Demander son chemin ═══════════════
  {
    id: 'chemin',
    title: 'Demander son chemin',
    titleZh: '问路',
    level: 'A1',
    emoji: '🗺️',
    description: '在法国街头问路——方向、距离、交通。',
    nodes: [
      {
        speaker: 'narrator', french: '你在里昂老城区，找不到前往圣母教堂的路。', chinese: '',
      },
      {
        speaker: 'vous', french: 'Pardon madame, pour aller à la cathédrale, s\'il vous plaît?', chinese: '打扰一下，请问去大教堂怎么走？',
      },
      {
        speaker: 'passante', french: 'Ah, c\'est facile! Vous continuez tout droit, puis vous prenez la première rue à gauche.', chinese: '很简单！直走，然后第一条街左转。',
        choices: [
          { text: 'Tout droit, puis à gauche. Merci!', nextNode: 3, feedback: '✅ 重复确认方向。', isBest: true },
          { text: 'C\'est loin?', nextNode: 4, feedback: '想问远不远也很正常。', isBest: false },
        ],
      },
      {
        speaker: 'passante', french: 'C\'est à environ 10 minutes à pied. Vous voyez, après le pont, c\'est juste là.', chinese: '大概走十分钟。过了桥就到了。',
        choices: [
          { text: 'Merci beaucoup! Bonne journée!', nextNode: 5, feedback: '✅ 完美结束！', isBest: true },
        ],
      },
      {
        speaker: 'passante', french: 'Non, c\'est à environ 10 minutes à pied. Après le pont.', chinese: '不远，走路大概十分钟。过了桥就是。',
        choices: [
          { text: 'Merci!', nextNode: 5, feedback: '✅ 谢谢！', isBest: false },
        ],
      },
      {
        speaker: 'narrator', french: '💡 问路关键词：tout droit(直走) à gauche(左转) à droite(右转) près de(在...附近) en face de(在...对面) au coin de(在...拐角)。', chinese: '',
      },
    ],
  },

  // ═══════════════ 8: Au téléphone ═══════════════
  {
    id: 'telephone',
    title: 'Au téléphone',
    titleZh: '打电话',
    level: 'A2',
    emoji: '📞',
    description: '用法语打电话——预约、留言、听懂电话用语。',
    nodes: [
      {
        speaker: 'narrator', french: '你打电话给牙医诊所预约检查。', chinese: '',
      },
      {
        speaker: 'secrétaire', french: 'Cabinet dentaire, bonjour!', chinese: '牙医诊所，你好！',
        choices: [
          { text: 'Bonjour madame. Je voudrais prendre un rendez-vous, s\'il vous plaît.', nextNode: 2, feedback: '✅ 清晰表达预约意图。', isBest: true },
          { text: 'Allô? C\'est le dentiste?', nextNode: 3, feedback: '⚠️ 太口语了，不够正式。', isBest: false },
        ],
      },
      {
        speaker: 'secrétaire', french: 'Bien sûr. Quel jour vous conviendrait?', chinese: '当然。您方便哪天？',
        choices: [
          { text: 'Lundi prochain, si c\'est possible.', nextNode: 4, feedback: '✅ 下周一。', isBest: true },
          { text: 'Le plus tôt possible.', nextNode: 4, feedback: '尽快也可以。', isBest: false },
        ],
      },
      {
        speaker: 'secrétaire', french: 'Oui, c\'est bien le cabinet dentaire. Quel est votre problème?', chinese: '是的，这里是牙医诊所。您有什么问题？',
        choices: [
          { text: 'Je voudrais prendre un rendez-vous pour un contrôle.', nextNode: 4, feedback: '👍 这次说清楚了。', isBest: false },
        ],
      },
      {
        speaker: 'secrétaire', french: 'Alors... lundi à 10h30, ça vous va?', chinese: '周一 10:30 可以吗？',
        choices: [
          { text: 'Oui, parfait! Merci beaucoup.', nextNode: 5, feedback: '✅ 确认时间。', isBest: true },
          { text: 'Non, c\'est trop tôt. Plutôt l\'après-midi?', nextNode: 5, feedback: '👍 改时间也很正常。', isBest: false },
        ],
      },
      {
        speaker: 'secrétaire', french: 'Entendu. Vous êtes madame/monsieur...?', chinese: '好的。您是...女士/先生？',
        choices: [
          { text: 'Wang, W-A-N-G.', nextNode: 6, feedback: '✅ 拼出姓氏，电话中很实用。', isBest: true },
        ],
      },
      {
        speaker: 'secrétaire', french: 'Très bien. À lundi 10h30. Merci de votre appel!', chinese: '好的。周一 10:30 见。感谢来电！',
      },
    ],
  },

  // ═══════════════ 9: À la pharmacie ═══════════════
  {
    id: 'pharmacie',
    title: 'À la pharmacie',
    titleZh: '在药店',
    level: 'A2',
    emoji: '💊',
    description: '在法国药房买药、描述症状、听取药师建议。',
    nodes: [
      {
        speaker: 'narrator', french: '你感冒了，走进街角的绿色十字药店。', chinese: '',
      },
      {
        speaker: 'pharmacien', french: 'Bonjour! Je peux vous aider?', chinese: '你好！需要帮助吗？',
        choices: [
          { text: 'Bonjour. J\'ai un rhume. Qu\'est-ce que vous me conseillez?', nextNode: 2, feedback: '✅ 描述症状 + 寻求建议。', isBest: true },
          { text: 'Je veux des médicaments.', nextNode: 3, feedback: '⚠️ 太模糊了，药师需要知道什么症状。', isBest: false },
        ],
      },
      {
        speaker: 'pharmacien', french: 'Quels sont vos symptômes exactement?', chinese: '具体什么症状？',
        choices: [
          { text: 'J\'ai le nez qui coule et je tousse un peu.', nextNode: 4, feedback: '✅ 流鼻涕 + 咳嗽。', isBest: true },
        ],
      },
      {
        speaker: 'pharmacien', french: 'Pour quel problème? Qu\'est-ce que vous avez?', chinese: '什么病？您怎么了？',
        choices: [
          { text: 'J\'ai un rhume, le nez qui coule...', nextNode: 4, feedback: '👍 这次说清了。', isBest: false },
        ],
      },
      {
        speaker: 'pharmacien', french: 'Je vous recommande ce sirop et des pastilles pour la gorge. Prenez le sirop trois fois par jour.', chinese: '我推荐这个止咳糖浆和润喉糖。糖浆每天三次。',
        choices: [
          { text: 'D\'accord. Est-ce que ça fait dormir?', nextNode: 5, feedback: '✅ 问是否嗜睡（很重要！）。', isBest: true },
        ],
      },
      {
        speaker: 'pharmacien', french: 'Non, celui-ci ne fait pas dormir. Ça fera 12 euros.', chinese: '这个不会嗜睡。一共 12 欧。',
      },
      {
        speaker: 'narrator', french: '💡 法国药店实用词：rhume(感冒) toux(咳嗽) fièvre(发烧) ordonnance(处方) sirop(糖浆) pastille(含片) comprimé(药片)。只有 pharmacie 能卖药，超市不行！', chinese: '',
      },
    ],
  },

  // ═══════════════ 10: Entretien d'embauche ═══════════════
  {
    id: 'entretien',
    title: 'Entretien d\'embauche',
    titleZh: '工作面试',
    level: 'A2',
    emoji: '💼',
    description: '法语求职面试的常见问题和得体回答。',
    nodes: [
      {
        speaker: 'narrator', french: '你走进办公室，面试官微笑着迎接你。', chinese: '',
      },
      {
        speaker: 'recruteur', french: 'Bonjour! Asseyez-vous, je vous en prie.', chinese: '你好！请坐。',
        choices: [
          { text: 'Bonjour, merci de me recevoir.', nextNode: 2, feedback: '✅ 感谢接待，开场完美。', isBest: true },
          { text: '(拘谨地坐下不说话)', nextNode: 2, feedback: '有点紧张...说句话会更好。', isBest: false },
        ],
      },
      {
        speaker: 'recruteur', french: 'Parlez-moi un peu de vous.', chinese: '请简单介绍下自己。',
        choices: [
          { text: 'Je m\'appelle X. J\'ai 28 ans. J\'ai étudié le marketing et j\'ai travaillé trois ans dans ce domaine.', nextNode: 3, feedback: '✅ 简洁的自我介绍。', isBest: true },
          { text: 'Je suis né en Chine. J\'aime le sport et la lecture.', nextNode: 4, feedback: '⚠️ 太私人了，面试应该先说职业背景。', isBest: false },
        ],
      },
      {
        speaker: 'recruteur', french: 'Très bien. Pourquoi voulez-vous travailler chez nous?', chinese: '很好。为什么想来我们公司工作？',
        choices: [
          { text: 'Votre entreprise est reconnue dans le secteur et j\'aimerais contribuer à vos projets.', nextNode: 5, feedback: '✅ 得体！既夸公司又表达贡献意愿。', isBest: true },
        ],
      },
      {
        speaker: 'recruteur', french: 'Je vois. Parlez-moi plutôt de votre expérience professionnelle.', chinese: '明白了。不如谈谈您的工作经验。',
        choices: [
          { text: 'J\'ai travaillé dans le marketing digital. J\'ai géré des projets et une équipe.', nextNode: 5, feedback: '👍 补救了。', isBest: false },
        ],
      },
      {
        speaker: 'recruteur', french: 'Avez-vous des questions?', chinese: '您有什么问题吗？',
        choices: [
          { text: 'Oui. Comment décririez-vous la culture d\'entreprise ici?', nextNode: 6, feedback: '✅ 问公司文化，显得有想法。', isBest: true },
          { text: 'Non, je n\'ai pas de questions.', nextNode: 6, feedback: '⚠️ 不问问题显得不够感兴趣。', isBest: false },
        ],
      },
      {
        speaker: 'recruteur', french: 'Excellente question... (解释公司文化) Merci pour cet entretien. Nous vous contacterons bientôt.', chinese: '好问题... 谢谢您的参与。我们会尽快联系。',
      },
    ],
  },
];

// Get scenarios by level
export function getDialoguesByLevel(level?: string): DialogueScenario[] {
  if (!level) return dialogueScenarios;
  return dialogueScenarios.filter(d => d.level === level);
}
