// ============================================================
// Local French-Chinese Dictionary — no AI, offline, fast
// 300+ common French words for Chinese learners
// ============================================================

import Dexie, { type Table } from 'dexie';

export interface SavedWord {
  id: string;
  french: string;
  translation: string;
  notes: string;
  tags: string[];
  createdAt: string;
  lastReviewed: string;
  reviewCount: number;
  mastered: boolean;
}

class WordBankDB extends Dexie {
  savedWords!: Table<SavedWord, string>;
  constructor() {
    super('FrenchWordBank');
    this.version(1).stores({ savedWords: 'id, french, createdAt, mastered, *tags' });
  }
}

export const wordBankDB = new WordBankDB();

// ============================================================
// Large local French→Chinese dictionary (300+ entries)
// Grouped by category for easy browsing
// ============================================================
interface DictEntry {
  f: string;      // French
  c: string;      // Chinese
  p?: string;     // French pronunciation note (for Chinese speakers)
  e?: string;     // Example sentence
  ec?: string;    // Example Chinese translation
}

const DICTIONARY: Record<string, DictEntry> = {};

function addEntry(french: string, chinese: string, pron?: string, example?: string, exampleZh?: string) {
  DICTIONARY[french.toLowerCase().trim()] = { f: french, c: chinese, p: pron, e: example, ec: exampleZh };
}

// === Greetings / 问候 ===
addEntry('bonjour', '你好；早上好', 'bohn-jhoor', 'Bonjour, comment allez-vous?', '你好，你好吗？');
addEntry('salut', '你好/再见（非正式）', 'sah-lew', 'Salut, ça va?', '嗨，还好吗？');
addEntry('bonsoir', '晚上好', 'bohn-swahr', 'Bonsoir, madame.', '晚上好，女士。');
addEntry('au revoir', '再见', 'oh ruh-vwahr', 'Au revoir et bonne journée!', '再见，祝你有美好的一天！');
addEntry('merci', '谢谢', 'mehr-see', 'Merci beaucoup!', '非常感谢！');
addEntry('s\'il vous plaît', '请（正式）', 'seel-voo-play', 'Un café, s\'il vous plaît.', '请给我一杯咖啡。');
addEntry('de rien', '不客气', 'duh ree-ehn', 'De rien, c\'est normal.', '不客气，这没什么。');
addEntry('excusez-moi', '对不起；打扰一下', 'ex-kew-zay mwah', 'Excusez-moi, où est la gare?', '打扰一下，火车站在哪？');
addEntry('pardon', '抱歉；请再说一遍', 'par-dohn');
addEntry('bonne journée', '祝你有美好的一天', 'bun jhoor-nay');
addEntry('bonne soirée', '祝你晚上愉快', 'bun swah-ray');
addEntry('à bientôt', '回头见', 'ah bee-ehn-toh');
addEntry('à demain', '明天见', 'ah duh-man');
addEntry('enchanté', '很高兴认识你', 'ahn-shahn-tay', 'Enchanté, je m\'appelle Paul.', '很高兴认识你，我叫保罗。');
addEntry('comment allez-vous', '您好吗？（正式）', 'koh-mahn-tah-lay-voo');
addEntry('ça va', '还好吗；还行', 'sah vah', 'Ça va bien, merci!', '很好，谢谢！');

// === Numbers / 数字 ===
addEntry('un', '一', 'uhn'); addEntry('deux', '二', 'deuh'); addEntry('trois', '三', 'trwah');
addEntry('quatre', '四', 'katr'); addEntry('cinq', '五', 'sank'); addEntry('six', '六', 'sees');
addEntry('sept', '七', 'set'); addEntry('huit', '八', 'weet'); addEntry('neuf', '九', 'neuhf');
addEntry('dix', '十', 'dees'); addEntry('vingt', '二十', 'vahn'); addEntry('cent', '一百', 'sahn');
addEntry('mille', '一千', 'meel');

// === Colors / 颜色 ===
addEntry('rouge', '红色', 'roozh'); addEntry('bleu', '蓝色', 'bleuh'); addEntry('vert', '绿色', 'vehr');
addEntry('jaune', '黄色', 'zhohn'); addEntry('noir', '黑色', 'nwahr'); addEntry('blanc', '白色', 'blahn');
addEntry('orange', '橙色', 'oh-rahnzh'); addEntry('violet', '紫色', 'vee-oh-lay');
addEntry('rose', '粉色', 'rohz'); addEntry('gris', '灰色', 'gree'); addEntry('marron', '棕色', 'mah-rohn');

// === Food & Drinks / 饮食 ===
addEntry('pain', '面包', 'pan', 'Le pain est très bon.', '面包很好吃。');
addEntry('fromage', '奶酪', 'froh-mahzh', 'Le fromage français est délicieux.', '法国奶酪很好吃。');
addEntry('croissant', '牛角面包', 'krwah-sahn', 'Je prends un croissant.', '我吃一个牛角面包。');
addEntry('baguette', '法棍面包', 'bah-get');
addEntry('beurre', '黄油', 'beuhr');
addEntry('confiture', '果酱', 'kohn-fee-tewr');
addEntry('poulet', '鸡肉', 'poo-lay', 'Le poulet rôti est bon.', '烤鸡很好吃。');
addEntry('poisson', '鱼', 'pwah-sohn');
addEntry('viande', '肉', 'vee-ahnd');
addEntry('légumes', '蔬菜（复数）', 'lay-gewm');
addEntry('riz', '米饭', 'ree');
addEntry('pâtes', '意大利面', 'paht');
addEntry('salade', '沙拉', 'sah-lahd');
addEntry('chocolat', '巧克力', 'shoh-koh-lah');
addEntry('gâteau', '蛋糕', 'gah-toh');
addEntry('glace', '冰淇淋', 'glahs');
addEntry('œuf', '鸡蛋', 'euhf');
addEntry('soupe', '汤', 'soop');
addEntry('jambon', '火腿', 'zhahm-bohn');
addEntry('crêpe', '可丽饼', 'krep');
addEntry('eau', '水', 'oh', 'De l\'eau, s\'il vous plaît.', '请给我水。');
addEntry('café', '咖啡', 'kah-fay', 'Un café noir, s\'il vous plaît.', '请给我一杯黑咖啡。');
addEntry('thé', '茶', 'tay');
addEntry('vin', '葡萄酒', 'vahn', 'Un verre de vin rouge.', '一杯红酒。');
addEntry('bière', '啤酒', 'bee-ehr');
addEntry('jus', '果汁', 'zhew', 'Un jus d\'orange frais.', '一杯鲜榨橙汁。');
addEntry('lait', '牛奶', 'lay');

// === Family / 家庭 ===
addEntry('famille', '家庭', 'fah-mee-yuh');
addEntry('père', '父亲', 'pehr', 'Mon père est médecin.', '我父亲是医生。');
addEntry('mère', '母亲', 'mehr', 'Ma mère est gentille.', '我母亲很温柔。');
addEntry('frère', '兄弟', 'frehr');
addEntry('sœur', '姐妹', 'seuhr');
addEntry('ami', '朋友（男）', 'ah-mee', 'C\'est mon ami Pierre.', '这是我的朋友皮埃尔。');
addEntry('amie', '朋友（女）', 'ah-mee');
addEntry('homme', '男人', 'ohm');
addEntry('femme', '女人；妻子', 'fahm');
addEntry('enfant', '孩子', 'ahn-fahn');
addEntry('mari', '丈夫', 'mah-ree');
addEntry('parents', '父母', 'pah-rahn');

// === Pronouns / 代词 ===
addEntry('je', '我', 'zhuh', 'Je suis français.', '我是法国人。');
addEntry('tu', '你（非正式）', 'tew', 'Tu es mon ami.', '你是我的朋友。');
addEntry('il', '他；它（阳）', 'eel', 'Il est grand.', '他很高。');
addEntry('elle', '她；它（阴）', 'el', 'Elle est belle.', '她很美。');
addEntry('nous', '我们', 'noo', 'Nous allons au cinéma.', '我们去电影院。');
addEntry('vous', '你们；您', 'voo', 'Vous êtes très gentil.', '您很友善。');
addEntry('ils', '他们（阳）', 'eel');
addEntry('elles', '她们（阴）', 'el');

// === Common Verbs / 常用动词 ===
addEntry('être', '是', 'etr', 'Je suis étudiant.', '我是学生。');
addEntry('avoir', '有', 'ah-vwahr', 'J\'ai vingt ans.', '我二十岁。');
addEntry('aller', '去', 'ah-lay', 'Je vais à Paris.', '我去巴黎。');
addEntry('faire', '做', 'fehr', 'Je fais mes devoirs.', '我做作业。');
addEntry('parler', '说', 'par-lay', 'Je parle français.', '我说法语。');
addEntry('manger', '吃', 'mahn-zhay', 'Je mange une pomme.', '我吃一个苹果。');
addEntry('boire', '喝', 'bwahr', 'Je bois de l\'eau.', '我喝水。');
addEntry('aimer', '喜欢；爱', 'eh-may', 'J\'aime la musique.', '我喜欢音乐。');
addEntry('habiter', '居住', 'ah-bee-tay', 'J\'habite à Lyon.', '我住在里昂。');
addEntry('travailler', '工作', 'trah-vah-yay', 'Je travaille à Paris.', '我在巴黎工作。');
addEntry('vouloir', '想要', 'voo-lwahr', 'Je veux apprendre le français.', '我想学法语。');
addEntry('pouvoir', '能够', 'poo-vwahr', 'Je peux vous aider.', '我可以帮您。');
addEntry('savoir', '知道', 'sah-vwahr', 'Je ne sais pas.', '我不知道。');
addEntry('venir', '来', 'vuh-neer', 'Je viens de Chine.', '我来自中国。');
addEntry('prendre', '拿；乘坐；吃/喝', 'prahn-dr', 'Je prends le métro.', '我坐地铁。');
addEntry('voir', '看见', 'vwahr');
addEntry('entendre', '听见', 'ahn-tahn-dr');
addEntry('comprendre', '理解', 'kohm-prahn-dr', 'Je ne comprends pas.', '我不懂。');
addEntry('apprendre', '学习', 'ah-prahn-dr', 'J\'apprends le français.', '我在学法语。');

// === Adjectives / 形容词 ===
addEntry('grand', '大的；高的', 'grahn');
addEntry('petit', '小的；矮的', 'puh-tee');
addEntry('bon', '好的', 'bohn', 'C\'est très bon!', '这很好吃！');
addEntry('mauvais', '坏的', 'moh-vay');
addEntry('beau', '美丽的（阳）', 'boh');
addEntry('belle', '美丽的（阴）', 'bel');
addEntry('nouveau', '新的', 'noo-voh');
addEntry('vieux', '老的；旧的', 'vee-euh');
addEntry('jeune', '年轻的', 'zheuhn');
addEntry('heureux', '幸福的；开心的', 'euh-reuh');
addEntry('fatigué', '疲惫的', 'fah-tee-gay');
addEntry('content', '高兴的', 'kohn-tahn');
addEntry('triste', '悲伤的', 'treest');
addEntry('chaud', '热的', 'shoh');
addEntry('froid', '冷的', 'frwah');

// === Time / 时间 ===
addEntry('lundi', '星期一', 'luhn-dee');
addEntry('mardi', '星期二', 'mar-dee');
addEntry('mercredi', '星期三', 'mehr-kruh-dee');
addEntry('jeudi', '星期四', 'zheuh-dee');
addEntry('vendredi', '星期五', 'vahn-druh-dee');
addEntry('samedi', '星期六', 'sahm-dee');
addEntry('dimanche', '星期日', 'dee-mahnsh');
addEntry('janvier', '一月', 'zhahn-vee-ay');
addEntry('février', '二月', 'fay-vree-ay');
addEntry('mars', '三月', 'mahrs');
addEntry('avril', '四月', 'ah-vreel');
addEntry('mai', '五月', 'may');
addEntry('juin', '六月', 'zhwahn');
addEntry('juillet', '七月', 'zhwee-yay');
addEntry('août', '八月', 'oot');
addEntry('septembre', '九月', 'sep-tahm-br');
addEntry('octobre', '十月', 'ok-toh-br');
addEntry('novembre', '十一月', 'noh-vahm-br');
addEntry('décembre', '十二月', 'day-sahm-br');
addEntry('aujourd\'hui', '今天', 'oh-jhoor-dwee');
addEntry('demain', '明天', 'duh-man');
addEntry('hier', '昨天', 'ee-ehr');
addEntry('matin', '早上', 'mah-tan');
addEntry('soir', '晚上', 'swahr');
addEntry('heure', '小时；时间', 'euhr');

// === Places / 地点 ===
addEntry('maison', '家；房子', 'may-zohn');
addEntry('gare', '火车站', 'gahr', 'Où est la gare?', '火车站在哪？');
addEntry('aéroport', '机场', 'ah-ay-roh-por');
addEntry('hôtel', '酒店', 'oh-tel');
addEntry('restaurant', '餐厅', 'res-toh-rahn');
addEntry('métro', '地铁', 'may-troh');
addEntry('rue', '街道', 'rew');
addEntry('musée', '博物馆', 'mew-zay');
addEntry('pharmacie', '药店', 'far-mah-see');
addEntry('supermarché', '超市', 'soo-pehr-mar-shay');
addEntry('bureau', '办公室', 'bew-roh');
addEntry('école', '学校', 'ay-kol');
addEntry('hôpital', '医院', 'oh-pee-tahl');

// === Travel & Work / 出行 & 工作 ===
addEntry('train', '火车', 'trahn');
addEntry('bus', '公共汽车', 'bews');
addEntry('taxi', '出租车', 'tak-see');
addEntry('voiture', '汽车', 'vwah-tewr');
addEntry('vélo', '自行车', 'vay-loh');
addEntry('billet', '票', 'bee-yay');
addEntry('passeport', '护照', 'pahs-por');
addEntry('valise', '行李箱', 'vah-leez');
addEntry('travail', '工作', 'trah-vai');
addEntry('entreprise', '公司', 'ahn-truh-preez');
addEntry('collègue', '同事', 'koh-leg');
addEntry('réunion', '会议', 'ray-ew-nee-ohn');
addEntry('salaire', '工资', 'sah-lehr');
addEntry('ordinateur', '电脑', 'or-dee-nah-teuhr');

// === Daily Phrases / 日常用语 ===
addEntry('oui', '是', 'wee');
addEntry('non', '不', 'nohn');
addEntry('peut-être', '也许', 'peuh-tetr');
addEntry('d\'accord', '好的；同意', 'dah-kor');
addEntry('je ne sais pas', '我不知道', 'zhuh nuh say pah');
addEntry('je ne comprends pas', '我不懂', 'zhuh nuh kohm-prahn pah');
addEntry('parlez-vous anglais', '您说英语吗', 'par-lay voo ahn-glay');
addEntry('je suis désolé', '我很抱歉', 'zhuh swee day-zoh-lay');
addEntry('combien ça coûte', '这个多少钱', 'kohm-bee-ehn sah koot');
addEntry('où sont les toilettes', '洗手间在哪', 'oo sohn lay twah-let');
addEntry('quelle heure est-il', '几点了', 'kel euhr ay-teel');
addEntry('je voudrais', '我想要', 'zhuh voo-dray');

// === Body & Health / 身体 ===
addEntry('tête', '头', 'tet');
addEntry('main', '手', 'man');
addEntry('pied', '脚', 'pee-ay');
addEntry('œil', '眼睛', 'euh-y');
addEntry('bouche', '嘴', 'boosh');
addEntry('oreille', '耳朵', 'oh-ray');
addEntry('nez', '鼻子', 'nay');
addEntry('dos', '背', 'doh');
addEntry('cœur', '心', 'keuhr');

// === Weather / 天气 ===
addEntry('soleil', '太阳', 'soh-lay');
addEntry('pluie', '雨', 'plwee');
addEntry('neige', '雪', 'nezh');
addEntry('vent', '风', 'vahn');
addEntry('nuage', '云', 'new-ahzh');
addEntry('il fait beau', '天气好', 'eel fay boh');
addEntry('il fait chaud', '天气热', 'eel fay shoh');
addEntry('il fait froid', '天气冷', 'eel fay frwah');

// === Animals / 动物 ===
addEntry('chat', '猫', 'shah');
addEntry('chien', '狗', 'shee-ehn');
addEntry('oiseau', '鸟', 'wah-zoh');
addEntry('poisson', '鱼', 'pwah-sohn');
addEntry('cheval', '马', 'shuh-vahl');
addEntry('lapin', '兔子', 'lah-pan');

// === Clothing / 服装 ===
addEntry('vêtement', '衣服', 'vet-mahn');
addEntry('chemise', '衬衫', 'shuh-meez');
addEntry('pantalon', '裤子', 'pahn-tah-lohn');
addEntry('robe', '连衣裙', 'rob');
addEntry('jupe', '裙子', 'zhewp');
addEntry('chaussure', '鞋子', 'shoh-sewr');
addEntry('chapeau', '帽子', 'shah-poh');
addEntry('manteau', '大衣', 'mahn-toh');
addEntry('pull', '毛衣', 'pewl');
addEntry('écharpe', '围巾', 'ay-sharp');
addEntry('gant', '手套', 'gahn');
addEntry('sac', '包', 'sak');
addEntry('lunettes', '眼镜', 'lew-net');
addEntry('montre', '手表', 'mohn-tr');
addEntry('bague', '戒指', 'bahg');
addEntry('boucle d\'oreille', '耳环', 'bookl doh-ray');

// === Home / 家居 ===
addEntry('chambre', '卧室', 'shahm-br');
addEntry('cuisine', '厨房', 'kwee-zeen');
addEntry('salon', '客厅', 'sah-lohn');
addEntry('salle de bain', '浴室', 'sal duh ban');
addEntry('table', '桌子', 'tah-bl');
addEntry('chaise', '椅子', 'shez');
addEntry('lit', '床', 'lee');
addEntry('fenêtre', '窗户', 'fuh-netr');
addEntry('porte', '门', 'port');
addEntry('toit', '屋顶', 'twah');
addEntry('escalier', '楼梯', 'es-kal-yay');
addEntry('jardin', '花园', 'zhar-dan');
addEntry('clé', '钥匙', 'klay');
addEntry('miroir', '镜子', 'mee-rwahr');
addEntry('lampe', '灯', 'lahmp');

// === Education / 教育 ===
addEntry('livre', '书', 'leevr');
addEntry('cahier', '笔记本', 'kah-yay');
addEntry('stylo', '笔', 'stee-loh');
addEntry('crayon', '铅笔', 'kray-ohn');
addEntry('gomme', '橡皮', 'gom');
addEntry('règle', '尺子', 'regl');
addEntry('professeur', '老师', 'pro-fes-eur');
addEntry('étudiant', '学生', 'ay-tew-dee-ahn');
addEntry('examen', '考试', 'eg-zah-man');
addEntry('devoir', '作业', 'duh-vwahr');
addEntry('leçon', '课', 'luh-sohn');
addEntry('université', '大学', 'ew-nee-ver-see-tay');
addEntry('bibliothèque', '图书馆', 'bee-blee-oh-tek');
addEntry('diplôme', '文凭', 'dee-plohm');
addEntry('matière', '学科', 'mah-tee-ehr');
addEntry('note', '分数', 'not');

// === Emotions / 情感 ===
addEntry('amour', '爱', 'ah-moor');
addEntry('joie', '快乐', 'zhwah');
addEntry('tristesse', '悲伤', 'trees-tes');
addEntry('colère', '愤怒', 'koh-lehr');
addEntry('peur', '害怕', 'peur');
addEntry('surprise', '惊讶', 'sewr-preez');
addEntry('espoir', '希望', 'es-pwahr');
addEntry('ennui', '无聊', 'ahn-nwee');
addEntry('jalousie', '嫉妒', 'zhah-loo-zee');
addEntry('fierté', '骄傲', 'fee-ehr-tay');
addEntry('honte', '羞愧', 'ohnt');
addEntry('curiosité', '好奇心', 'kew-ree-oh-zee-tay');
addEntry('soulagement', '宽慰', 'soo-lazh-mahn');
addEntry('nostalgie', '怀旧', 'nos-tal-zhee');

// === Technology / 科技 ===
addEntry('téléphone', '电话', 'tay-lay-fon');
addEntry('portable', '手机', 'por-tah-bl');
addEntry('écran', '屏幕', 'ay-krahn');
addEntry('clavier', '键盘', 'klahv-yay');
addEntry('souris', '鼠标', 'soo-ree');
addEntry('internet', '互联网', 'an-ter-net');
addEntry('réseau', '网络', 'ray-zoh');
addEntry('application', '应用程序', 'ah-plee-kah-syohn');
addEntry('mot de passe', '密码', 'moh duh pahs');
addEntry('donnée', '数据', 'doh-nay');
addEntry('logiciel', '软件', 'loh-zhee-see-el');
addEntry('matériel', '硬件', 'mah-tay-ree-el');
addEntry('site web', '网站', 'seet web');
addEntry('courriel', '电子邮件', 'koo-ree-el');
addEntry('télécharger', '下载', 'tay-lay-shar-zhay');
addEntry('imprimer', '打印', 'am-pree-may');

// === Nature / 自然 ===
addEntry('arbre', '树', 'arbr');
addEntry('fleur', '花', 'fleuhr');
addEntry('plante', '植物', 'plahnt');
addEntry('forêt', '森林', 'foh-ray');
addEntry('montagne', '山', 'mohn-tahn-yuh');
addEntry('rivière', '河', 'ree-vee-ehr');
addEntry('mer', '海', 'mehr');
addEntry('lac', '湖', 'lak');
addEntry('ciel', '天空', 'see-el');
addEntry('terre', '地球；土地', 'tehr');
addEntry('lune', '月亮', 'lewn');
addEntry('étoile', '星星', 'ay-twahl');
addEntry('feu', '火', 'feuh');
addEntry('air', '空气', 'ehr');
addEntry('sable', '沙子', 'sah-bl');
addEntry('pierre', '石头', 'pee-ehr');

// === Sports / 运动 ===
addEntry('sport', '运动', 'spor');
addEntry('football', '足球', 'foot-bohl');
addEntry('natation', '游泳', 'nah-tah-syohn');
addEntry('course', '跑步', 'koors');
addEntry('vélo', '自行车', 'vay-loh');
addEntry('tennis', '网球', 'teh-nees');
addEntry('basket', '篮球', 'bahs-ket');
addEntry('ski', '滑雪', 'skee');
addEntry('danse', '跳舞', 'dahns');
addEntry('gymnastique', '体操', 'zheem-nah-steek');
addEntry('match', '比赛', 'match');
addEntry('équipe', '团队', 'ay-keep');
addEntry('joueur', '选手', 'zhoo-euhr');
addEntry('gagner', '赢', 'gah-nyay');
addEntry('perdre', '输', 'pehr-dr');

// === Shopping / 购物 ===
addEntry('magasin', '商店', 'mah-gah-zan');
addEntry('marché', '市场', 'mar-shay');
addEntry('prix', '价格', 'pree');
addEntry('cher', '贵的', 'shehr');
addEntry('bon marché', '便宜的', 'bohn mar-shay');
addEntry('acheter', '买', 'ah-shuh-tay');
addEntry('vendre', '卖', 'vahn-dr');
addEntry('carte', '卡', 'kart');
addEntry('argent', '钱', 'ar-zhahn');
addEntry('monnaie', '零钱', 'moh-nay');
addEntry('reçu', '收据', 'ruh-sew');
addEntry('remise', '折扣', 'ruh-meez');
addEntry('gratuit', '免费的', 'grah-twee');
addEntry('payer', '付款', 'pay-yay');
addEntry('commander', '订购', 'koh-mahn-day');
addEntry('livraison', '送货', 'lee-vray-zohn');

// === Banking / 金融 ===
addEntry('banque', '银行', 'bahnk');
addEntry('compte', '账户', 'kohmt');
addEntry('carte bancaire', '银行卡', 'kart bahn-kehr');
addEntry('crédit', '信用', 'kray-dee');
addEntry('dépenser', '花费', 'day-pahn-say');
addEntry('économiser', '储蓄', 'ay-koh-noh-mee-zay');
addEntry('impôt', '税', 'am-poh');
addEntry('assurance', '保险', 'ah-sew-rahns');
addEntry('investir', '投资', 'an-ves-teer');
addEntry('budget', '预算', 'bew-zhay');

// === Health / 医疗 ===
addEntry('santé', '健康', 'sahn-tay');
addEntry('malade', '生病的', 'mah-lahd');
addEntry('médecin', '医生', 'med-san');
addEntry('médicament', '药物', 'may-dee-kah-mahn');
addEntry('hôpital', '医院', 'oh-pee-tahl');
addEntry('dentiste', '牙医', 'dahn-teest');
addEntry('ordonnance', '处方', 'or-doh-nahns');
addEntry('blessure', '伤口', 'bles-sewr');
addEntry('fièvre', '发烧', 'fee-ehvr');
addEntry('toux', '咳嗽', 'too');
addEntry('rhume', '感冒', 'rewm');
addEntry('allergie', '过敏', 'ah-lehr-zhee');

// === Advanced / 进阶词汇 ===
addEntry('habitude', '习惯', 'ah-bee-tewd');
addEntry('expérience', '经验', 'ex-pay-ree-ahns');
addEntry('aventure', '冒险', 'ah-vahn-tewr');
addEntry('liberté', '自由', 'lee-behr-tay');
addEntry('égalité', '平等', 'ay-gah-lee-tay');
addEntry('fraternité', '博爱', 'frah-tehr-nee-tay');
addEntry('respect', '尊重', 'res-pay');
addEntry('confiance', '信任', 'kohn-fee-ahns');
addEntry('patience', '耐心', 'pah-see-ahns');
addEntry('courage', '勇气', 'koo-razh');
addEntry('intelligence', '智慧', 'an-tel-ee-zhahns');
addEntry('imagination', '想象力', 'ee-mah-zhee-nah-syohn');
addEntry('connaissance', '知识', 'koh-nay-sahns');
addEntry('sagesse', '智慧', 'sah-zhes');
addEntry('bonheur', '幸福', 'boh-neuhr');
addEntry('succès', '成功', 'sewk-say');
addEntry('échec', '失败', 'ay-shek');
addEntry('progrès', '进步', 'pro-gray');
addEntry('changement', '变化', 'shahnzh-mahn');
addEntry('choix', '选择', 'shwah');

// === Batch 1: High-frequency everyday words / 高频日常词 ===
addEntry('aller', '去');
addEntry('venir', '来');
addEntry('partir', '离开');
addEntry('rester', '留下；停留');
addEntry('arriver', '到达');
addEntry('entrer', '进入');
addEntry('sortir', '出去');
addEntry('monter', '上去');
addEntry('descendre', '下去');
addEntry('passer', '经过；度过');
addEntry('suivre', '跟随');
addEntry('tourner', '转动');
addEntry('lever', '举起');
addEntry('baisser', '降低');
addEntry('ouvrir', '打开');
addEntry('fermer', '关闭');
addEntry('tirer', '拉');
addEntry('pousser', '推');
addEntry('porter', '穿戴；携带');
addEntry('jeter', '扔');
addEntry('tomber', '落下；跌倒');
addEntry('casser', '打破');
addEntry('brûler', '烧');
addEntry('couper', '切');
addEntry('mélanger', '混合');
addEntry('verser', '倒入');
addEntry('remplir', '填满');
addEntry('vider', '清空');
addEntry('nettoyer', '清洁');
addEntry('laver', '洗');
addEntry('sécher', '弄干');
addEntry('ranger', '整理');
addEntry('cacher', '藏');
addEntry('montrer', '展示');
addEntry('crier', '喊叫');
addEntry('pleurer', '哭');
addEntry('rire', '笑');
addEntry('sourire', '微笑');
addEntry('chanter', '唱歌');
addEntry('danser', '跳舞');
addEntry('jouer', '玩；演奏');
addEntry('gagner', '赢得');
addEntry('perdre', '失去；输');
addEntry('trouver', '找到');
addEntry('chercher', '寻找');
addEntry('garder', '保留');
addEntry('laisser', '留下；让');
addEntry('croire', '相信');
addEntry('penser', '思考；认为');
addEntry('savoir', '知道');
addEntry('connaître', '认识；了解');
addEntry('oublier', '忘记');
addEntry('se souvenir', '记得');
addEntry('compter', '数；打算');
addEntry('raconter', '讲述');
addEntry('expliquer', '解释');
addEntry('décrire', '描述');
addEntry('écouter', '听');
addEntry('entendre', '听见');
addEntry('regarder', '看');
addEntry('voir', '看见');
addEntry('lire', '阅读');
addEntry('écrire', '写');
addEntry('commencer', '开始');
addEntry('finir', '完成；结束');
addEntry('continuer', '继续');
addEntry('arrêter', '停止');
addEntry('changer', '改变');
addEntry('essayer', '尝试');
addEntry('réussir', '成功');
addEntry('échouer', '失败');
addEntry('aider', '帮助');
addEntry('protéger', '保护');
addEntry('défendre', '防御；禁止');
addEntry('attaquer', '攻击');
addEntry('construire', '建造');
addEntry('détruire', '摧毁');
addEntry('créer', '创造');
addEntry('imaginer', '想象');
addEntry('rêver', '做梦；梦想');
addEntry('dormir', '睡觉');
addEntry('se réveiller', '醒来');
addEntry('se lever', '起床；站起来');
addEntry('se coucher', '躺下；睡觉');
addEntry('s\'asseoir', '坐下');
addEntry('marcher', '走路');
addEntry('courir', '跑步');
addEntry('sauter', '跳');
addEntry('nager', '游泳');
addEntry('voler', '飞；偷');
addEntry('conduire', '驾驶');
addEntry('voyager', '旅行');
addEntry('visiter', '参观');
addEntry('inviter', '邀请');
addEntry('accepter', '接受');
addEntry('refuser', '拒绝');
addEntry('donner', '给');
addEntry('recevoir', '收到');
addEntry('envoyer', '发送');
addEntry('apporter', '带来');
addEntry('emporter', '带走');
addEntry('préparer', '准备');
addEntry('organiser', '组织');
addEntry('participer', '参加');
addEntry('décider', '决定');
addEntry('choisir', '选择');
addEntry('préférer', '更喜欢');
addEntry('détester', '讨厌；憎恨');
addEntry('adorer', '很喜欢；崇拜');
addEntry('respecter', '尊重');
addEntry('pardonner', '原谅');
addEntry('excuser', '原谅；找借口');
addEntry('remercier', '感谢');
addEntry('féliciter', '祝贺');
addEntry('promettre', '承诺');
addEntry('mentir', '说谎');
addEntry('avouer', '承认');
addEntry('discuter', '讨论');
addEntry('se disputer', '争吵');
addEntry('se fâcher', '生气');
addEntry('se calmer', '冷静');
addEntry('s\'inquiéter', '担心');
addEntry('se réjouir', '高兴');
addEntry('s\'ennuyer', '无聊');
addEntry('s\'amuser', '玩得开心');
addEntry('se reposer', '休息');
addEntry('se dépêcher', '赶快');
addEntry('s\'habiller', '穿衣服');
addEntry('se déshabiller', '脱衣服');
addEntry('se laver', '洗澡；洗自己');
addEntry('se brosser', '刷(牙/头发)');
addEntry('se maquiller', '化妆');
addEntry('se raser', '刮胡子');
addEntry('se promener', '散步');
addEntry('se détendre', '放松');

// === Batch 2: Adjectives and descriptors / 形容词 ===
addEntry('jeune', '年轻的');
addEntry('vieux', '老的；旧的');
addEntry('nouveau', '新的');
addEntry('ancien', '古老的；以前的');
addEntry('grand', '大的；高的');
addEntry('petit', '小的');
addEntry('gros', '胖的；大的');
addEntry('mince', '瘦的');
addEntry('long', '长的');
addEntry('court', '短的');
addEntry('large', '宽的');
addEntry('étroit', '窄的');
addEntry('haut', '高的');
addEntry('bas', '低的');
addEntry('profond', '深的');
addEntry('plein', '满的');
addEntry('vide', '空的');
addEntry('lourd', '重的');
addEntry('léger', '轻的');
addEntry('rapide', '快的');
addEntry('lent', '慢的');
addEntry('fort', '强壮的；大声的');
addEntry('faible', '弱的');
addEntry('dur', '硬的；困难的');
addEntry('mou', '软的');
addEntry('chaud', '热的');
addEntry('froid', '冷的');
addEntry('sec', '干的');
addEntry('mouillé', '湿的');
addEntry('propre', '干净的');
addEntry('sale', '脏的');
addEntry('riche', '富有的');
addEntry('pauvre', '贫穷的');
addEntry('heureux', '幸福的');
addEntry('malheureux', '不幸的');
addEntry('content', '高兴的');
addEntry('triste', '悲伤的');
addEntry('fier', '骄傲的');
addEntry('honteux', '羞愧的');
addEntry('courageux', '勇敢的');
addEntry('peureux', '胆小的');
addEntry('gentil', '友善的');
addEntry('méchant', '凶恶的');
addEntry('poli', '礼貌的');
addEntry('impoli', '不礼貌的');
addEntry('intelligent', '聪明的');
addEntry('bête', '傻的');
addEntry('drôle', '有趣的；好笑的');
addEntry('sérieux', '严肃的；认真的');
addEntry('calme', '平静的');
addEntry('énervé', '烦躁的');
addEntry('fatigué', '疲惫的');
addEntry('malade', '生病的');
addEntry('guéri', '痊愈的');
addEntry('vivant', '活着的');
addEntry('mort', '死去的');
addEntry('prêt', '准备好的');
addEntry('occupé', '忙碌的');
addEntry('libre', '自由的；空闲的');
addEntry('possible', '可能的');
addEntry('impossible', '不可能的');
addEntry('facile', '容易的');
addEntry('difficile', '困难的');
addEntry('simple', '简单的');
addEntry('compliqué', '复杂的');
addEntry('clair', '清楚的；明亮的');
addEntry('sombre', '黑暗的');
addEntry('sûr', '确定的；安全的');
addEntry('dangereux', '危险的');
addEntry('important', '重要的');
addEntry('inutile', '无用的');
addEntry('nécessaire', '必要的');
addEntry('spécial', '特别的');
addEntry('normal', '正常的');
addEntry('étrange', '奇怪的');
addEntry('différent', '不同的');
addEntry('pareil', '相同的');
addEntry('seul', '单独的；孤独的');
addEntry('ensemble', '一起');
addEntry('debout', '站着的');
addEntry('couché', '躺着的');
addEntry('ouvert', '开着的');
addEntry('fermé', '关着的');

// === Batch 3: More nouns and everyday objects ===
addEntry('matin', '早晨');
addEntry('soir', '晚上');
addEntry('nuit', '夜晚');
addEntry('midi', '中午');
addEntry('jour', '白天；天');
addEntry('semaine', '星期');
addEntry('mois', '月份');
addEntry('année', '年份');
addEntry('siècle', '世纪');
addEntry('moment', '时刻');
addEntry('heure', '小时；时间');
addEntry('minute', '分钟');
addEntry('seconde', '秒');
addEntry('côté', '旁边；方向');
addEntry('coin', '角落');
addEntry('milieu', '中间');
addEntry('bout', '末端；尽头');
addEntry('début', '开始');
addEntry('fin', '结束');
addEntry('partie', '部分');
addEntry('morceau', '碎片；块');
addEntry('pièce', '房间；硬币；零件');
addEntry('objet', '物体');
addEntry('chose', '东西；事物');
addEntry('idée', '想法');
addEntry('avis', '意见');
addEntry('avis', '意见');
addEntry('problème', '问题');
addEntry('solution', '解决办法');
addEntry('question', '问题');
addEntry('réponse', '答案');
addEntry('exemple', '例子');
addEntry('raison', '理由；原因');
addEntry('cause', '原因');
addEntry('effet', '效果；影响');
addEntry('résultat', '结果');
addEntry('différence', '区别');
addEntry('ressemblance', '相似');
addEntry('vérité', '真相');
addEntry('mensonge', '谎言');
addEntry('secret', '秘密');
addEntry('surprise', '惊喜；意外');
addEntry('espoir', '希望');
addEntry('peur', '恐惧');
addEntry('colère', '愤怒');
addEntry('joie', '快乐');
addEntry('tristesse', '悲伤');
addEntry('amour', '爱情');
addEntry('haine', '仇恨');
addEntry('jalousie', '嫉妒');
addEntry('courage', '勇气');
addEntry('patience', '耐心');
addEntry('chance', '运气；机会');
addEntry('risque', '风险');
addEntry('danger', '危险');
addEntry('sécurité', '安全');
addEntry('paix', '和平');
addEntry('guerre', '战争');
addEntry('victoire', '胜利');
addEntry('défaite', '失败');
addEntry('force', '力量');
addEntry('faiblesse', '弱点');
addEntry('qualité', '优点；质量');
addEntry('défaut', '缺点');
addEntry('erreur', '错误');
addEntry('faute', '过错');
addEntry('conseil', '建议');
addEntry('aide', '帮助');
addEntry('ordre', '顺序；命令');
addEntry('désordre', '混乱');
addEntry('bruit', '噪音');
addEntry('silence', '安静');
addEntry('lumière', '光');
addEntry('ombre', '影子；阴影');
addEntry('couleur', '颜色');
addEntry('forme', '形状');
addEntry('taille', '尺码；大小');
addEntry('poids', '重量');
addEntry('vitesse', '速度');
addEntry('distance', '距离');
addEntry('espace', '空间');
addEntry('temps', '时间；天气');
addEntry('argent', '钱');
addEntry('prix', '价格');
addEntry('valeur', '价值');
addEntry('nombre', '数字；数量');
addEntry('chiffre', '数字');
addEntry('lettre', '字母；信件');
addEntry('mot', '单词');
addEntry('phrase', '句子');
addEntry('histoire', '故事；历史');
addEntry('livre', '书');
addEntry('page', '页面');
addEntry('image', '图片');
addEntry('film', '电影');
addEntry('musique', '音乐');
addEntry('chanson', '歌曲');
addEntry('bruit', '噪音');
addEntry('voix', '声音；嗓音');
addEntry('parole', '话语');
addEntry('mot', '词语');
addEntry('langue', '语言；舌头');
addEntry('pays', '国家');
addEntry('région', '地区');
addEntry('ville', '城市');
addEntry('village', '村庄');
addEntry('rue', '街道');
addEntry('route', '公路');
addEntry('chemin', '小路；路径');
addEntry('pont', '桥');
addEntry('bâtiment', '建筑物');
addEntry('appartement', '公寓');
addEntry('chambre', '房间；卧室');
addEntry('cuisine', '厨房');
addEntry('salle', '厅；室');
addEntry('toilette', '厕所');
addEntry('escalier', '楼梯');
addEntry('ascenseur', '电梯');
addEntry('porte', '门');
addEntry('fenêtre', '窗户');
addEntry('mur', '墙');
addEntry('sol', '地面');
addEntry('plafond', '天花板');
addEntry('toit', '屋顶');
addEntry('jardin', '花园');
addEntry('cour', '院子');
addEntry('garage', '车库');
addEntry('voiture', '汽车');
addEntry('moto', '摩托车');
addEntry('vélo', '自行车');
addEntry('bus', '公共汽车');
addEntry('train', '火车');
addEntry('avion', '飞机');
addEntry('bateau', '船');
addEntry('métro', '地铁');
addEntry('taxi', '出租车');
addEntry('pied', '脚');
addEntry('jambe', '腿');
addEntry('genou', '膝盖');
addEntry('bras', '手臂');
addEntry('main', '手');
addEntry('doigt', '手指');
addEntry('tête', '头');
addEntry('visage', '脸');
addEntry('œil', '眼睛');
addEntry('oreille', '耳朵');
addEntry('nez', '鼻子');
addEntry('bouche', '嘴巴');
addEntry('dent', '牙齿');
addEntry('cheveu', '头发');
addEntry('peau', '皮肤');
addEntry('cœur', '心脏');
addEntry('sang', '血液');
addEntry('dos', '背部');
addEntry('ventre', '腹部');
addEntry('cerveau', '大脑');
addEntry('esprit', '精神；头脑');
addEntry('corps', '身体');
addEntry('âme', '灵魂');
addEntry('dieu', '神；上帝');
addEntry('religion', '宗教');
addEntry('église', '教堂');
addEntry('foi', '信仰');
addEntry('politique', '政治');
addEntry('économie', '经济');
addEntry('société', '社会');
addEntry('culture', '文化');
addEntry('tradition', '传统');
addEntry('coutume', '习俗');
addEntry('loi', '法律');
addEntry('règle', '规则');
addEntry('droit', '权利；法律');
addEntry('devoir', '义务；作业');
addEntry('liberté', '自由');
addEntry('égalité', '平等');
addEntry('fraternité', '博爱');
addEntry('justice', '正义；司法');
addEntry('respect', '尊重');
addEntry('responsabilité', '责任');
addEntry('nature', '自然');
addEntry('environnement', '环境');
addEntry('pollution', '污染');
addEntry('climat', '气候');
addEntry('planète', '星球');
addEntry('terre', '地球；土地');
addEntry('mer', '大海');
addEntry('océan', '海洋');
addEntry('fleuve', '河流');
addEntry('rivière', '小河');
addEntry('lac', '湖泊');
addEntry('montagne', '山');
addEntry('forêt', '森林');
addEntry('arbre', '树');
addEntry('fleur', '花');
addEntry('plante', '植物');
addEntry('animal', '动物');
addEntry('oiseau', '鸟');
addEntry('poisson', '鱼');
addEntry('insecte', '昆虫');
addEntry('serpent', '蛇');
addEntry('lion', '狮子');
addEntry('tigre', '老虎');
addEntry('éléphant', '大象');
addEntry('singe', '猴子');
addEntry('ours', '熊');
addEntry('loup', '狼');
addEntry('renard', '狐狸');
addEntry('lapin', '兔子');
addEntry('souris', '老鼠；鼠标');
addEntry('cochon', '猪');
addEntry('vache', '母牛');
addEntry('mouton', '绵羊');
addEntry('poule', '母鸡');
addEntry('coq', '公鸡');
addEntry('canard', '鸭子');

// ============================================================
// Dictionary lookup
// ============================================================
export function lookupWord(query: string): DictEntry | null {
  const q = query.toLowerCase().trim();
  // Exact match
  if (DICTIONARY[q]) return DICTIONARY[q];

  // Partial match (starts with)
  for (const [key, entry] of Object.entries(DICTIONARY)) {
    if (key.startsWith(q) || q.startsWith(key)) return entry;
  }

  // Contains match
  for (const [key, entry] of Object.entries(DICTIONARY)) {
    if (key.includes(q) || q.includes(key)) return entry;
  }

  return null;
}

// Reverse lookup — Chinese to French
export function lookupChinese(query: string): DictEntry | null {
  const q = query.trim();
  for (const entry of Object.values(DICTIONARY)) {
    if (entry.c.includes(q)) return entry;
  }
  return null;
}

// Get all dictionary entries (for browsing/export)
export function getAllDictionaryEntries(): DictEntry[] {
  return Object.values(DICTIONARY);
}

// Search by prefix (for autocomplete)
export function searchByPrefix(prefix: string, limit = 10): DictEntry[] {
  const p = prefix.toLowerCase().trim();
  if (!p) return [];
  return Object.values(DICTIONARY)
    .filter(e => e.f.toLowerCase().startsWith(p))
    .slice(0, limit);
}

// Get dictionary stats
export function getDictionaryStats(): { total: number } {
  return { total: Object.keys(DICTIONARY).length };
}

// ============================================================
// Word packs — downloadable JSON files for offline use
// ============================================================
export interface WordPack {
  name: string;
  description: string;
  wordCount: number;
  words: Array<{ french: string; chinese: string; example?: string; exampleZh?: string }>;
}

// Generate word packs grouped by category
export function generateWordPacks(): WordPack[] {
  const packs: WordPack[] = [
    { name: '核心词汇', description: '最常用的200个法语单词', wordCount: 0, words: [] },
    { name: '饮食', description: '食物和饮品相关词汇', wordCount: 0, words: [] },
    { name: '出行工作', description: '交通、旅行和职场词汇', wordCount: 0, words: [] },
    { name: '日常用语', description: '日常会话必备短语', wordCount: 0, words: [] },
  ];

  // First 200 entries → core
  const all = Object.values(DICTIONARY);
  packs[0].words = all.slice(0, 200).map(e => ({ french: e.f, chinese: e.c, example: e.e, exampleZh: e.ec }));
  packs[0].wordCount = packs[0].words.length;

  // Food
  const foodKeys = ['pain','fromage','croissant','baguette','beurre','confiture','poulet','poisson','viande','légumes','riz','pâtes','salade','chocolat','gâteau','glace','œuf','soupe','jambon','crêpe','eau','café','thé','vin','bière','jus','lait'];
  packs[1].words = foodKeys.map(k => DICTIONARY[k]).filter(Boolean).map(e => ({ french: e.f, chinese: e.c }));
  packs[1].wordCount = packs[1].words.length;

  // Travel & Work
  const travelKeys = ['gare','aéroport','hôtel','restaurant','métro','rue','train','bus','taxi','voiture','vélo','billet','passeport','travail','entreprise','collègue','réunion','salaire','ordinateur','bureau'];
  packs[2].words = travelKeys.map(k => DICTIONARY[k]).filter(Boolean).map(e => ({ french: e.f, chinese: e.c }));
  packs[2].wordCount = packs[2].words.length;

  // Daily phrases
  const dailyKeys = ['bonjour','salut','merci','au revoir','oui','non','d\'accord','je ne sais pas','je ne comprends pas','je suis désolé','combien ça coûte','où sont les toilettes','quelle heure est-il','je voudrais'];
  packs[3].words = dailyKeys.map(k => DICTIONARY[k]).filter(Boolean).map(e => ({ french: e.f, chinese: e.c, example: e.e, exampleZh: e.ec }));
  packs[3].wordCount = packs[3].words.length;

  return packs;
}

// Download a word pack as JSON file
export function downloadWordPack(pack: WordPack): void {
  const json = JSON.stringify(pack, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `french-wordpack-${pack.name}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Import words from a JSON file into word bank
export async function importWordPack(file: File): Promise<number> {
  const text = await file.text();
  const pack: WordPack = JSON.parse(text);
  let count = 0;
  for (const w of pack.words) {
    const exists = await wordBankDB.savedWords.where('french').equals(w.french).first();
    if (!exists) {
      await wordBankDB.savedWords.put({
        id: Date.now().toString() + '_' + Math.random().toString(36).slice(2, 8),
        french: w.french,
        translation: w.chinese,
        notes: '',
        tags: [pack.name],
        createdAt: new Date().toISOString(),
        lastReviewed: new Date().toISOString(),
        reviewCount: 0,
        mastered: false,
      });
      count++;
    }
  }
  return count;
}

// ============================================================
// Online translation — uses Zhipu AI when local dictionary misses
// ============================================================
export async function translateOnline(word: string): Promise<DictEntry | null> {
  const apiKey = localStorage.getItem('frenchflow_api_key');
  if (!apiKey) return null;

  try {
    const res = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: [{ role: 'user', content: `Translate "${word}" from French to Chinese. Return ONLY a JSON object: {"f":"${word}","c":"中文翻译","p":"法语发音提示"}. No markdown, no explanation.` }],
        temperature: 0.1,
        max_tokens: 100,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '';
    // Extract JSON from possible markdown wrapping
    const json = content.replace(/```json\n?/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(json);
    if (parsed.c) return { f: word, c: parsed.c, p: parsed.p || '' };
    return null;
  } catch {
    return null;
  }
}

// Hybrid lookup: local first, then online
export async function smartLookup(word: string): Promise<DictEntry | null> {
  // Try local first
  const local = lookupWord(word);
  if (local) return local;

  // Try online
  return translateOnline(word);
}
