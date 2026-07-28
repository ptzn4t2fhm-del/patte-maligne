import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_DIR = path.join(__dirname, 'data');
const STATE_FILE = path.join(STATE_DIR, 'state.json');

// Rotation quotidienne : comparatif -> guide -> article -> comparatif -> ...
const CATEGORY_ROTATION = ['comparatif', 'guide', 'article'];

export const TOPIC_BANK = {
  comparatif: [
    'Meilleures croquettes pour chien en 2026',
    'Meilleures croquettes pour chat en 2026',
    'Comparatif arbres à chat haut de gamme',
    'Meilleures caisses de transport pour chien',
    'Comparatif distributeurs automatiques de nourriture',
    'Meilleurs colliers GPS pour chien',
    'Comparatif paniers pour chien de grande taille',
    'Meilleures litières autonettoyantes pour chat',
    'Comparatif harnais anti-traction pour chien',
    'Meilleures cages pour rongeurs (hamster, lapin)',
    'Comparatif jouets interactifs pour chat',
    'Meilleures fontaines à eau pour chat',
    'Comparatif niches d\'extérieur pour chien',
    'Meilleures tondeuses pour chien à poils longs',
    'Comparatif sacs de transport pour petits chiens',
    'Meilleures clôtures anti-fugue pour chien',
    'Comparatif brosses pour chat à poils longs',
    'Meilleurs aquariums pour débutants',
    'Comparatif gamelles anti-glouton',
    'Meilleures chatières et portes électroniques pour chat',
  ],
  guide: [
    'Guide complet pour bien nourrir son chiot',
    'Comment choisir la bonne taille de cage pour son chien',
    'Guide d\'entretien du pelage selon la race de chien',
    'Tout savoir sur l\'alimentation sans céréales pour chat',
    'Guide complet pour l\'éducation d\'un chiot',
    'Comment habituer son chat à la litière',
    'Guide d\'achat : accessoires indispensables pour un nouveau chaton',
    'Guide complet du toilettage à la maison',
    'Comment choisir un aquarium adapté à ses poissons',
    'Guide d\'achat pour équiper un NAC (lapin, hamster, furet)',
    'Tout savoir sur le transport en voiture avec son animal',
    'Guide complet des jouets adaptés selon l\'âge du chien',
    'Comment aménager un coin confortable pour son chat',
    'Guide d\'achat : quel budget prévoir pour un chien',
    'Tout savoir sur les croquettes premium vs entrée de gamme',
    'Guide complet pour voyager en avion avec son animal',
    'Comment sociabiliser un chiot ou un chaton',
    'Guide d\'achat des équipements pour chien senior',
    'Guide complet sur l\'hydratation et les fontaines à eau pour chat',
    'Tout savoir sur le choix d\'une assurance santé animale',
  ],
  article: [
    'Les erreurs à éviter avec un nouveau chiot',
    'Chat d\'intérieur vs chat d\'extérieur : que choisir ?',
    'Les races de chien adaptées à la vie en appartement',
    'Combien coûte réellement un chien sur toute sa vie ?',
    'Comment reconnaître le stress chez son chat',
    'Les idées reçues sur l\'alimentation des animaux',
    'Animaux de compagnie et télétravail : nos astuces',
    'Faut-il adopter en refuge ou acheter chez un éleveur ?',
    'Les accessoires qui changent vraiment la vie des propriétaires de chien',
    'Chat et plantes d\'intérieur : les précautions à prendre',
    'Comment préparer l\'arrivée d\'un animal avec de jeunes enfants',
    'Les tendances 2026 pour les accessoires animaliers',
    'Animaux de compagnie et écologie : quelles options durables ?',
    'Comment gérer les vacances quand on a un animal',
    'Deuxième animal à la maison : comment bien l\'intégrer',
    'Chien et sport : les activités à pratiquer ensemble',
    'Animaux et seniors : quel compagnon choisir ?',
    'Comment reconnaître un bon éleveur ou une bonne animalerie',
    'Ce que coûte vraiment un chat sur toute sa vie',
    'Poils, griffures, allergies : vivre avec un animal au quotidien',
  ],
};

async function loadState() {
  if (!existsSync(STATE_FILE)) {
    return { dayCount: 0, usedTopics: { comparatif: [], guide: [], article: [] } };
  }
  const raw = await readFile(STATE_FILE, 'utf-8');
  return JSON.parse(raw);
}

async function saveState(state) {
  await mkdir(STATE_DIR, { recursive: true });
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

/**
 * Retourne le prochain sujet à traiter en suivant la rotation
 * comparatif -> guide -> article, en évitant les sujets déjà utilisés
 * tant qu'il en reste de disponibles dans la banque.
 */
export async function getNextTopic() {
  const state = await loadState();
  const category = CATEGORY_ROTATION[state.dayCount % CATEGORY_ROTATION.length];

  const allTopics = TOPIC_BANK[category];
  const used = state.usedTopics[category] ?? [];
  let available = allTopics.filter((t) => !used.includes(t));

  // Toute la banque a été utilisée : on recommence un nouveau cycle.
  if (available.length === 0) {
    state.usedTopics[category] = [];
    available = allTopics;
  }

  const topic = available[Math.floor(Math.random() * available.length)];

  state.usedTopics[category] = [...(state.usedTopics[category] ?? []), topic];
  state.dayCount += 1;
  await saveState(state);

  return { category, topic };
}
