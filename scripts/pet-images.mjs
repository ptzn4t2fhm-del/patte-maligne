// Banque de photos libres de droits (Unsplash, hotlink autorisé sans attribution
// obligatoire) utilisées comme image de couverture pour chaque article généré.
// Chaque entrée est taguée par mot-clé pour matcher le sujet de l'article.

export const PET_IMAGES = [
  { id: '1583511655857-d19b40a7a54e', tags: ['chien'] },
  { id: '1543466835-00a7907e9de1', tags: ['chien'] },
  { id: '1514888286974-6c03e2ca1dba', tags: ['chat'] },
  { id: '1544568100-847a948585b9', tags: ['chien'] },
  { id: '1587764379873-97837921fd44', tags: ['chien'] },
  { id: '1478098711619-5ab0b478d6e6', tags: ['chat'] },
  { id: '1450778869180-41d0601e046e', tags: ['chien', 'chat'] },
  { id: '1425082661705-1834bfd09dca', tags: ['hamster', 'rongeur', 'lapin', 'nac'] },
  { id: '1552053831-71594a27632d', tags: ['chien'] },
  { id: '1546975490-e8b92a360b24', tags: ['chien'] },
  { id: '1596492784531-6e6eb5ea9993', tags: ['chien'] },
  { id: '1592194996308-7b43878e84a6', tags: ['chat'] },
  { id: '1507146426996-ef05306b995a', tags: ['chien'] },
  { id: '1560743641-3914f2c45636', tags: ['chien'] },
  { id: '1444212477490-ca407925329e', tags: ['chien'] },
];

function buildUrl(id, width = 1200) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}

/**
 * Choisit une image de couverture pertinente en fonction du sujet de l'article
 * (matching simple sur les mots-clés chien/chat/hamster/lapin/etc.), avec repli
 * aléatoire sur l'ensemble de la banque si aucun mot-clé ne correspond.
 */
export function pickCoverImage(topic, width = 1200) {
  const lowerTopic = topic.toLowerCase();
  const matches = PET_IMAGES.filter((img) =>
    img.tags.some((tag) => lowerTopic.includes(tag)),
  );
  const pool = matches.length > 0 ? matches : PET_IMAGES;
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  return buildUrl(chosen.id, width);
}
