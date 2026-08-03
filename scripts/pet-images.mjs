// Banque de photos libres de droits (Unsplash) utilisées comme image de
// couverture pour chaque article généré. Chaque photo est vérifiée manuellement
// (téléchargement + inspection visuelle) pour éviter les images cassées, hors
// sujet ou affichant un logo de marque visible.
//
// Les tags sont volontairement précis (pas de tag générique présent partout) :
// ça évite qu'un sujet précis (ex: "niche d'extérieur") hérite d'une photo de
// chien quelconque juste parce qu'elle est taguée "chien". Quand aucun tag ne
// correspond, pickCoverImage retombe sur tout le pool au hasard plutôt que
// d'imposer une image sans rapport.
export const PET_IMAGES = [
  { id: '1543466835-00a7907e9de1', tags: ['chien'] },
  { id: '1514888286974-6c03e2ca1dba', tags: ['chat'] },
  { id: '1544568100-847a948585b9', tags: ['chien', 'promenade', 'extérieur'] },
  { id: '1587764379873-97837921fd44', tags: ['chiot'] },
  { id: '1478098711619-5ab0b478d6e6', tags: ['chat'] },
  { id: '1450778869180-41d0601e046e', tags: ['deuxième animal', 'intégrer'] },
  { id: '1425082661705-1834bfd09dca', tags: ['hamster', 'rongeur', 'lapin', 'nac'] },
  { id: '1552053831-71594a27632d', tags: ['chiot', 'jardin'] },
  { id: '1546975490-e8b92a360b24', tags: ['coin confortable', 'aménager'] },
  { id: '1596492784531-6e6eb5ea9993', tags: ['pelage', 'chien'] },
  { id: '1592194996308-7b43878e84a6', tags: ['chaton'] },
  { id: '1507146426996-ef05306b995a', tags: ['gamelle', 'nourrir son chiot'] },
  { id: '1560743641-3914f2c45636', tags: ['sport', 'activité'] },
  { id: '1444212477490-ca407925329e', tags: ['refuge', 'adopter', 'éleveur'] },
  { id: '1777196896095-32407293d5b0', tags: ['niche', 'extérieur'] },
  { id: '1764741368227-38ac9fd670a2', tags: ['fontaine', 'hydratation'] },
  { id: '1746092111692-d89d6b02ce00', tags: ['plantes', 'intérieur'] },
  { id: '1727510190155-51abda425a82', tags: ['toilettage', 'pelage', 'brossage'] },
  { id: '1504199098938-e4bbcee5e4a9', tags: ['laisse', 'harnais', 'promenade'] },
  { id: '1638826595775-e2eae86cda8e', tags: ['jouet', 'jouets interactifs', 'jouet interactif'] },
  { id: '1774797405267-7c452cb85652', tags: ['croquettes', 'alimentation', 'nourrir son chat'] },
  { id: '1549545931-59bf067af9ab', tags: ['stress', 'anxiété', 'peur'] },
];

function buildUrl(id, width = 1200) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Un tag ne compte comme "présent" que s'il apparaît comme mot / expression
// entière dans le sujet, pas comme simple sous-chaîne. Sans ça, un tag comme
// "chat" matchait aussi "chaton" ou "achat", ce qui provoquait des choix
// d'image hors sujet. On autorise un "s" final optionnel pour matcher les
// pluriels français ("chiens", "chats"...) sans réintroduire ce genre de faux
// positif (un "s" final ne crée pas de nouveau mot comme "chaton" le ferait).
function topicIncludesTag(lowerTopic, tag) {
  const pattern = new RegExp(`(?<![\\p{L}])${escapeRegex(tag.toLowerCase())}s?(?![\\p{L}])`, 'u');
  return pattern.test(lowerTopic);
}

/**
 * Choisit une image en fonction du sujet de l'article. On préfère les images
 * dont le plus grand nombre de tags apparaît dans le sujet (les correspondances
 * les plus spécifiques l'emportent) ; en cas d'égalité, on tire au sort parmi
 * les meilleures candidates, en excluant si possible les images déjà utilisées
 * par un autre article publié (voir `usedIds`) pour éviter les doublons visuels
 * sur le site. Si rien ne correspond, on tire au sort dans tout le pool plutôt
 * que d'imposer une image sans rapport.
 */
export function pickCoverImage(topic, width = 1200, usedIds = []) {
  const lowerTopic = topic.toLowerCase();
  const usedSet = new Set(usedIds);

  let bestScore = 0;
  let bestCandidates = [];

  for (const img of PET_IMAGES) {
    const score = img.tags.filter((tag) => topicIncludesTag(lowerTopic, tag)).length;
    if (score > bestScore) {
      bestScore = score;
      bestCandidates = [img];
    } else if (score === bestScore && score > 0) {
      bestCandidates.push(img);
    }
  }

  const pool = bestCandidates.length > 0 ? bestCandidates : PET_IMAGES;
  const unused = pool.filter((img) => !usedSet.has(img.id));
  const finalPool = unused.length > 0 ? unused : pool;
  const chosen = finalPool[Math.floor(Math.random() * finalPool.length)];
  return buildUrl(chosen.id, width);
}
