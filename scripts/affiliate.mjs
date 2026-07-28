// Amazon Associates : tant que le tag n'est pas encore obtenu (compte pas
// encore approuvé), on génère des liens Amazon classiques (sans tag) pour
// pouvoir publier du contenu dès maintenant. Une fois le compte approuvé,
// il suffit de renseigner AMAZON_AFFILIATE_TAG dans .env : tous les articles
// (nouveaux et anciens, au prochain build) utiliseront automatiquement le
// vrai lien d'affiliation, sans aucune modification de code.
const AMAZON_TAG = process.env.AMAZON_AFFILIATE_TAG || '';

/**
 * Construit une URL de recherche Amazon pour un produit donné.
 * On utilise une recherche plutôt qu'un lien produit direct car l'IA ne
 * connaît pas d'ASIN réel garanti à jour : la recherche reste toujours valide.
 *
 * `context` (optionnel) est ajouté à la requête pour désambiguïser les noms de
 * produits génériques ou les marques multi-catégories (ex: "Ferplast Baita
 * 100" seul peut remonter des tapis ou accessoires Ferplast au lieu d'une
 * niche pour chien). On y met typiquement le type d'animal/produit concerné
 * (ex: "niche chien").
 */
export function buildAffiliateSearchUrl(productName, context = '') {
  const url = new URL('https://www.amazon.fr/s');
  const query = context ? `${productName} ${context}` : productName;
  url.searchParams.set('k', query.trim());
  if (AMAZON_TAG) {
    url.searchParams.set('tag', AMAZON_TAG);
  }
  return url.toString();
}

export function hasAffiliateTag() {
  return Boolean(AMAZON_TAG);
}
