// Script: batch translate high-frequency French words via Zhipu
// Usage: node scripts/expandDict.mjs [count]

const API_KEY = 'aea47fc1d1e6420c8c6adc281843a81a.4leDRZ4imcRPCvx4';
const BATCH_SIZE = 30;
const START_INDEX = 0;
const END_INDEX = 2000; // total words to process

// Top ~2000 most common French words (frequency-based, curated)
const HIGH_FREQ_WORDS = `
le,de,un,être,et,à,il,avoir,ne,je,son,que,se,qui,ce,dans,en,du,elle,au,de,ce,le,la,les,des,une,pour,pas,sur,par,avec,plus,autre,on,tout,mais,faire,comme,leur,nous,aller,vouloir,venir,pouvoir,bien,aussi,devoir,savoir,falloir,voir,après,encore,petit,grand,entre,prendre,donner,parler,mettre,aimer,passer,regarder,croire,demander,rester,répondre,entendre,penser,arriver,connaître,devenir,sentir,sortir,comprendre,attendre,permettre,écrire,apprendre,commencer,marcher,chercher,expliquer,garder,oublier,apporter,essayer,continuer,recevoir
bonjour,merci,pardon,politesse,respect,gentil,méchant,calme,énervé,fatigué,malade,guérir,dormir,rêver,imaginer,créer,détruire,construire,habiter,déménager,campagne,ville,village,quartier,magasin,supermarché,banque,poste,mairie,école,université,hôpital,pharmacie,cinéma,théâtre,bibliothèque,piscine,stade,parc,jardin
printemps,été,automne,hiver,janvier,février,mars,avril,mai,juin,juillet,août,septembre,octobre,novembre,décembre,lundi,mardi,mercredi,jeudi,vendredi,samedi,dimanche,matin,midi,après-midi,soir,minuit,journée,semaine,mois,année,siècle,moment,instant,heure,minute,seconde,rendez-vous,date,calendrier,férié,vacances,congé
rouge,bleu,vert,jaune,noir,blanc,orange,violet,rose,gris,marron,clair,foncé,brillant,mat,rayé,imprimé,couleur,peinture,arc-en-ciel,nuance,teinte,doré,argenté,transparent,opaque,multicolore,uni,bariolé,pâle,vif,décorer,embellir
pain,fromage,vin,bière,jus,lait,eau,café,thé,chocolat,confiture,miel,beurre,huile,vinaigre,sel,poivre,sucre,farine,riz,pâtes,pomme,banane,orange,fraise,citron,cerise,pêche,poire,raisin,melon,carotte,poivron,tomate,salade,oignon,ail,pomme de terre,haricot,petit pois,maïs,champignon,viande,poulet,bœuf,porc,agneau,poisson,crevette,saumon,thon,œuf,fromage,yaourt,crème,glace,gâteau,tarte,biscuit,chips,apéritif,digestif,entrée,plat,dessert,goûter,dîner,déjeuner,petit déjeuner,brunch,apéro,barbecue,pique-nique,buffet
voiture,train,avion,bateau,bus,métro,tramway,taxi,moto,vélo,trottinette,marche,course,essence,diesel,électrique,hybride,volant,moteur,roue,pneu,frein,accélérer,ralentir,stationner,démarrer,conduire,pilote,passager,piéton,conducteur,chauffeur,permis,assurance,carte grise,contravention,amende,stationnement,embouteillage,bouchon,déviation,autoroute,nationale,départementale,chemin,route,rue,avenue,boulevard,place,rond-point,carrefour,feu rouge,stop,priorité,passage piéton,trottoir,piste cyclable
téléphone,portable,ordinateur,tablette,écran,clavier,souris,imprimante,enceinte,casque,chargeur,câble,wifi,bluetooth,internet,réseau,site,application,logiciel,mot de passe,identifiant,compte,profil,notification,message,email,courriel,pièce jointe,spam,newsletter,réseau social,like,partage,commentaire,abonné,publication,story,story,selfie,video,photo,image,son,musique,film,série,documentaire,podcast,émission,chaîne,streaming,télécharger,upload,download,cloud,stockage,donnée,mémoire,disque dur,clé USB
famille,parent,père,mère,frère,sœur,fils,fille,grand-père,grand-mère,petit-fils,petite-fille,oncle,tante,cousin,neveu,nièce,beau-père,belle-mère,beau-frère,belle-sœur,mari,femme,époux,épouse,compagnon,compagne,conjoint,célibataire,marié,divorcé,veuf,fiancé,pacsé,enfant,bébé,adolescent,adulte,personne âgée,génération,ancêtre,descendant,héritage,foyer,ménage
corps,tête,visage,cheveux,front,œil,yeux,nez,bouche,lèvre,dent,langue,oreille,cou,gorge,épaule,bras,coude,poignet,main,doigt,ongle,dos,poitrine,ventre,hanche,jambe,genou,cheville,pied,orteil,peau,muscle,os,sang,cœur,poumon,estomac,cerveau,nerf,santé,médecine,médicament,aspirine,antibiotique,vaccin,traitement,guérison,consultation,diagnostic,symptôme,fatigue,fièvre,toux,rhume,grippe,allergie,diabète,cancer,cardiaque,urgence,ambulance,pompier,police,samu
parler,dire,raconter,expliquer,décrire,demander,répondre,argumenter,débattre,convaincre,persuader,mentir,promettre,jurer,insulter,complimenter,flatter,remercier,féliciter,critiquer,accuser,excuser,pardonner,avouer,confesser,confier,raconter,chuchoter,murmurer,crier,hurler,siffler,chanter,déclamer,réciter,lire,écrire,taper,dicter,traduire,interpréter,communiquer,échanger,discuter,converser,bavarder
beau,belle,joli,moche,laid,magnifique,splendide,superbe,horrible,affreux,terrible,génial,formidable,excellent,parfait,imparfait,médiocre,nul,raté,réussi,brillant,exceptionnel,remarquable,banal,ordinaire,commun,spécial,unique,rare,précieux,cher,coûteux,bon marché,gratuit,payant,riche,pauvre,aisé,modeste,simple,compliqué,facile,difficile,dur,mou,tendre,cassant,solide,fragile
acheter,vendre,commander,livrer,recevoir,envoyer,retourner,rembourser,échanger,choisir,préférer,comparer,hésiter,décider,prix,coût,solde,promotion,réduction,remise,cadeau,gratuit,payant,cher,abordable,ruineux,économiser,dépenser,gaspiller,investir,placer,épargner,emprunter,prêter,devoir,rembourser,crédit,dette,compte,banque,chèque,espèces,carte bancaire,monnaie,portefeuille,argent,paiement,transaction,facture,reçu,ticket,addition,pourboire,taxe,impôt,TVA
`.split(',').map(w => w.trim()).filter(w => w.length > 0);

async function translateBatch(words) {
  const prompt = `Translate these French words to Chinese. Return ONLY a JSON array: [{"f":"word","c":"中文"}] for each word. No explanation.`;
  const res = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify({
      model: 'glm-4-flash',
      messages: [{ role: 'user', content: `${prompt}\n\nWords: ${words.join(', ')}` }],
      temperature: 0.1, max_tokens: 1500,
    }),
  });
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '';
  try {
    return JSON.parse(content.replace(/```json\n?/g, '').replace(/```/g, '').trim());
  } catch { return []; }
}

async function main() {
  const uniqueWords = [...new Set(HIGH_FREQ_WORDS)].filter(w => !w.includes(' ')); // skip phrases for now
  console.log(`Total unique words: ${uniqueWords.length}`);

  let results = [];
  for (let i = 0; i < Math.min(uniqueWords.length, END_INDEX); i += BATCH_SIZE) {
    const batch = uniqueWords.slice(i, i + BATCH_SIZE);
    console.log(`Translating batch ${i / BATCH_SIZE + 1}: ${batch.slice(0, 3).join(', ')}...`);
    const translated = await translateBatch(batch);
    results.push(...translated);
    console.log(`  Got ${translated.length} results`);
    await new Promise(r => setTimeout(r, 500)); // rate limit
  }

  // Output as addEntry calls
  for (const r of results) {
    if (r.c && r.f) {
      console.log(`addEntry('${r.f}', '${r.c}');`);
    }
  }
}

main().catch(console.error);
