export type SoftwareProduct = {
  id: string
  name: string
  tag: string
  flagship?: boolean
  summary: string
  details: string[]
  variants?: { title: string; text: string }[]
}

export const company = {
  name: 'LK-group',
  tagline: 'Solutions that inspire, experiences that leave a mark.',
  focus:
    'Nous concevons des applications et des logiciels d’entreprise qui transforment le quotidien des organisations : stocks, cliniques, écoles, résidences, commerce, transport et opérations terrain.',
}

export const navItems = [
  { to: '/', label: 'Accueil' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/contact', label: 'Contactez-nous' },
] as const

export const services = [
  {
    id: 'apps',
    title: "Développement d'applications",
    text: 'Web, mobile et PWA pensés pour vos équipes. Interfaces fluides, hors-ligne possible, et une expérience qui donne envie de travailler.',
    highlight: true,
  },
  {
    id: 'software',
    title: 'Développement de logiciels',
    text: 'Suites métier sur mesure : stocks, cliniques, établissements, réservations, tickets, flotte. Un logiciel qui épouse votre façon de décider.',
    highlight: true,
  },
  {
    id: 'comm',
    title: 'Communication digitale',
    text: 'Des écrans, des récits et des identités qui portent votre marque aussi loin que vos produits.',
  },
  {
    id: 'uiux',
    title: 'Design UI/UX',
    text: 'Des parcours clairs, des bulles, des micro-interactions. Le geste devient naturel, le regard reste accroché.',
  },
  {
    id: 'marketing',
    title: 'Marketing digital',
    text: 'Visibilité, conversion, fidélisation. On relie le produit à ceux qui en ont vraiment besoin.',
  },
  {
    id: 'conseil',
    title: 'Conseil & accompagnement',
    text: 'Architecture, cadrage, formation, suivi. On reste jusqu’à ce que le logiciel vive dans vos équipes.',
  },
]

export const flagshipProducts: SoftwareProduct[] = [
  {
    id: 'stock',
    name: 'LK Stock',
    tag: 'Logiciel phare',
    flagship: true,
    summary:
      'Deux familles de gestion de stock, nées du terrain. L’une pour le magasin et la vente. L’autre pour l’atelier et l’automobile. Même exigence : voir, bouger, vendre, sans perdre une pièce.',
    details: [
      'Inventaire vivant, mouvements, transferts, seuils d’alerte',
      'Ventes, caisse, facturation et suivi fournisseurs',
      'Rôles boutique / entrepôt / direction, PWA installable',
    ],
    variants: [
      {
        title: 'Stock commercial & magasin',
        text: 'Pour les enseignes, dépôts et points de vente. Entrées, sorties, inventaires tournants, ventes au comptoir, factures, marges. Vous savez ce qui dort, ce qui part, et ce qui doit rentrer demain.',
      },
      {
        title: 'Stock automobile & atelier',
        text: 'Pour les garages, concessions et pièces détachées. Références liées aux véhicules, historiques d’interventions, consommables d’atelier, et un stock qui parle le langage de la mécanique.',
      },
    ],
  },
  {
    id: 'clinique',
    name: 'LK Clinique',
    tag: 'Santé',
    summary:
      'Plateforme de gestion d’établissements de santé : consultations, biologie, échographie, hospitalisation, soins infirmiers. Chaque service a son flux, ses documents, sa vérité.',
    details: [
      'Parcours patient du guichet au compte-rendu',
      'Modules médicaux isolés (biologie, imagerie, hospitalisation, soins)',
      'Reçus, rapports et tableaux de bord financiers',
    ],
  },
  {
    id: 'residences',
    name: 'LK Résidences',
    tag: 'Hospitalité',
    summary:
      'Application de réservation de résidences et logements. Côté visiteur, on choisit une enseigne puis un logement. Côté entreprise, on gère le calendrier, les occupations et les paiements.',
    details: [
      'Multi-entreprises, multi-résidences',
      'Réservations, occupations, avis et visibilité',
      'Paiements et commissions de plateforme',
    ],
  },
  {
    id: 'ecole',
    name: 'ScolarNet',
    tag: 'Éducation',
    summary:
      'Gestion d’établissements scolaires : classes, élèves, notes, séances, discipline, caisse. Des espaces distincts pour la direction, les enseignants et les familles.',
    details: [
      'Vie scolaire, évaluations et scolarité',
      'Caisse, inscriptions, rôles métier',
      'Application pensée pour le quotidien d’une école',
    ],
  },
]

export { projects as portfolioProjects } from './projects'

export const cv = {
  name: 'Lou Kou',
  role: 'Développeur d’applications & de logiciels d’entreprise',
  company: 'Fondateur — LK-group',
  pitch:
    'Je construis des logiciels que les équipes utilisent vraiment. Pas des maquettes qui dorment : des suites métier, des PWA, des espaces admin, des flux qui tiennent la charge d’une clinique, d’un dépôt ou d’une école. LK-group est le nom de cette exigence : des solutions qui inspirent, des expériences qui laissent une marque.',
  education: {
    school: 'Saint-Plan',
    place: 'Côte d’Ivoire',
    diploma: 'Bac+1',
  },
  contact: {
    location: 'Côte d’Ivoire',
    email: 'À communiquer',
    phone: 'À communiquer',
  },
  strengths: [
    'Architecturer un produit de bout en bout (front, API, données, rôles)',
    'Transformer un métier réel en logiciel clair : stock, santé, école, réservation',
    'Soigner le geste : PWA, hors-ligne, animations, design qui se sent premium',
    'Livrer des plateformes multi-espaces : visiteur, entreprise, administration',
  ],
  stack: [
    'React',
    'TypeScript',
    'Laravel',
    'Node.js',
    'Flutter',
    'MySQL',
    'PWA',
    'REST',
    'SaaS multi-tenant',
  ],
  chapters: [
    {
      title: 'Logiciels d’entreprise',
      text: 'Stocks magasin et automobile, cliniques, établissements scolaires, résidences, e-commerce, tickets techniques, transport.',
    },
    {
      title: 'Applications',
      text: 'Expériences mobiles et web installables, scanners, espaces clients, tableaux de bord, parcours de réservation.',
    },
    {
      title: 'Pourquoi ce métier',
      text: 'Parce qu’un bon logiciel change une journée de travail. Il enlève la friction, protège les données, et rend l’équipe plus fière de ce qu’elle fait.',
    },
  ],
}

export const stats = [
  { value: '15+', label: 'Produits livrés' },
  { value: '6', label: 'Métiers couverts' },
  { value: '2', label: 'Familles de stock' },
  { value: '100%', label: 'Sur-mesure' },
]
