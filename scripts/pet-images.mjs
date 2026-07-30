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
];

function buildUrl(id, width = 1200) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}

/**
 * Choisit une image en fonction du sujet de l'article. On préfère les images
 * dont le plus grand nombre de tags apparaît dans le sujet (les correspondances
 * les plus spécifiques l'emportent) ; en cas d'égalité, on tire au sort parmi
 * les meilleures candidates. Si rien ne correspond, on tire au sort dans tout
 * le pool plutôt que d'imposer une image sans rapport.
 */
export function pickCoverImage(topic, width = 1200) {
  const lowerTopic = topic.toLowerCase();

  let bestScore = 0;
  let bestCandidates = [];

  for (const img of PET_IMAGES) {
    const score = img.tags.filter((tag) => lowerTopic.includes(tag)).length;
    if (score > bestScore) {
      bestScore = score;
      bestCandidates = [img];
    } else if (score === bestScore && score > 0) {
      bestCandidates.push(img);
    }
  }

  const pool = bestCandidates.length > 0 ? bestCandidates : PET_IMAGES;
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  return buildUrl(chosen.id, width);
}
