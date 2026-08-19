export type ProjectPhoto = { src: string; caption: string }

export type Project = {
  id: string
  title: string
  category: string
  blurb: string
  link: string | null
  purpose: string
  story: string[]
  modules: string[]
  stack: string[]
  photos: ProjectPhoto[]
}

const cliniquePhotos: ProjectPhoto[] = [
  { src: '/projects/clinique/login.png', caption: 'Connexion — accès par rôle et licences de la clinique' },
  { src: '/projects/clinique/dashbord.png', caption: 'Tableau de bord — activité du jour' },
  { src: '/projects/clinique/patient.png', caption: 'Base patients — fiches, recherche, historique' },
  { src: '/projects/clinique/consultation-inscription.png', caption: 'Inscription consultation & caisse d’accueil' },
  { src: '/projects/clinique/consult-dossier-medicaux.png', caption: 'Dossiers médicaux — examen, diagnostic, prescriptions' },
  { src: '/projects/clinique/ordonnance.png', caption: 'Ordonnances et documents PDF' },
  { src: '/projects/clinique/biologie-inscription.png', caption: 'Biologie — inscription interne / externe' },
  { src: '/projects/clinique/biologie-laboratoire.png', caption: 'Laboratoire — saisie et validation des analyses' },
  { src: '/projects/clinique/ecograiphie-inscription.png', caption: 'Échographie — inscription' },
  { src: '/projects/clinique/eco-salle-d-examen.png', caption: 'Salle d’échographie' },
  { src: '/projects/clinique/gynecologie-inscription.png', caption: 'Gynécologie — inscription' },
  { src: '/projects/clinique/gynecologie-salle-examen.png', caption: 'Gynécologie — salle d’examen' },
  { src: '/projects/clinique/ophtamologie-inscription.png', caption: 'Ophtalmologie — inscription' },
  { src: '/projects/clinique/ophtamologie-salle-examen.png', caption: 'Ophtalmologie — salle d’examen' },
  { src: '/projects/clinique/dentaire-inscription.png', caption: 'Dentaire — inscription' },
  { src: '/projects/clinique/cabinet-dentaire.png', caption: 'Cabinet dentaire' },
  { src: '/projects/clinique/churigie-inscrption.png', caption: 'Chirurgie — inscription' },
  { src: '/projects/clinique/churigie-bloc-suivi.png', caption: 'Bloc opératoire — suivi' },
  { src: '/projects/clinique/hospitalisation.png', caption: 'Hospitalisation — séjours et chambres' },
  { src: '/projects/clinique/mise-en-observation.png', caption: 'Mise en observation' },
  { src: '/projects/clinique/salle-accouchement.png', caption: 'Salle d’accouchement' },
  { src: '/projects/clinique/accouchement-inscription.png', caption: 'Accouchement — inscription' },
  { src: '/projects/clinique/soins.png', caption: 'Soins infirmiers' },
  { src: '/projects/clinique/pharmacie.png', caption: 'Pharmacie et mouvements de stock' },
  { src: '/projects/clinique/hopital.png', caption: 'Hôpital — tarifs et organisation' },
  { src: '/projects/clinique/planning-rdv.png', caption: 'Planning des rendez-vous' },
  { src: '/projects/clinique/planning-programme.png', caption: 'Planning des programmes' },
  { src: '/projects/clinique/assurance.png', caption: 'Assurances' },
  { src: '/projects/clinique/activites-financi-re.png', caption: 'Activités financières' },
  { src: '/projects/clinique/personel.png', caption: 'Personnel et habilitations' },
  { src: '/projects/clinique/parametre.png', caption: 'Paramètres de la clinique' },
  { src: '/projects/clinique/avis-client.png', caption: 'Avis patients' },
  { src: '/projects/clinique/statut-global.png', caption: 'Statut global de l’établissement' },
]

export const projects: Project[] = [
  {
    id: 'stock-magasin',
    title: 'Gestion de stock — magasin',
    category: 'Logiciel phare',
    blurb: 'StockHub pour commerces : boutiques, inventaire, caisse, fournisseurs, siège et magasin.',
    link: 'https://stock.blackagence.com',
    purpose:
      'Donner à une enseigne une vision unique de ce qu’elle vend et de ce qu’elle a en rayon. Le logiciel relie le siège, les boutiques, le stock et la caisse.',
    story: [
      'StockHub (aussi appelé Stock Sales Hub) est un hub ventes & stocks. Il n’est pas un tableur habillé : chaque vente déduit le stock, chaque transfert se trace, chaque boutique a son périmètre.',
      'Deux espaces existent. Le siège (boutique principale) voit le réseau : magasins, employés, commandes fournisseurs, réceptions. Le magasin voit son rayon, sa caisse, ses mouvements.',
      'L’authentification passe par l’API Laravel (Sanctum). Les rôles séparent direction, manager et vendeur. L’application s’installe en PWA, avec un manifeste boutique et un manifeste système.',
      'On y gère le catalogue, l’inventaire, les ventes, les transferts inter-boutiques, les commandes fournisseurs et le journal d’erreurs pour le suivi technique.',
    ],
    modules: [
      'Réseau de boutiques',
      'Catalogue & inventaire',
      'Ventes / caisse',
      'Transferts inter-magasins',
      'Commandes fournisseurs',
      'Personnel & rôles',
      'Espace système',
    ],
    stack: ['React', 'TypeScript', 'Laravel', 'Sanctum', 'MySQL', 'PWA'],
    photos: [{ src: '/projects/stock-magasin/facture.jpg', caption: 'Document de facturation — Stock magasin' }],
  },
  {
    id: 'stock-auto',
    title: 'Gestion de stock — automobile',
    category: 'Logiciel phare',
    blurb: 'Même exigence de stock, calibrée garage et pièces : atelier, références, mouvements.',
    link: 'https://gestion-auto.blackagence.com',
    purpose:
      'Piloter un stock qui parle automobile : pièces, consommables d’atelier, mouvements liés à l’activité garage, sans perdre une référence.',
    story: [
      'C’est la deuxième famille de gestion de stock livrée par LK-group. L’architecture reprend le hub ventes & stocks, mais le métier change : ici on n’aligne pas des lots de magasin généraliste, on aligne des pièces et un atelier.',
      'Le frontend communique avec une API dédiée (api-stock-auto). Boutiques / dépôts, employés, catalogue, inventaire, ventes, transferts et commandes fournisseurs restent les piliers.',
      'L’intérêt : un mécanicien, un magasinier pièces et une direction voient le même stock, avec des rôles différents. Une pièce vendue ou posée disparaît du bon endroit.',
    ],
    modules: [
      'Stock pièces & atelier',
      'Ventes et sorties',
      'Transferts',
      'Fournisseurs',
      'Rôles garage / dépôt / direction',
      'PWA',
    ],
    stack: ['React', 'TypeScript', 'Laravel', 'Sanctum', 'MySQL', 'PWA'],
    photos: [],
  },
  {
    id: 'clinique',
    title: 'Gestion de cliniques',
    category: 'Logiciel phare',
    blurb: 'Suite clinique complète : du guichet au compte-rendu, chaque service a son flux et ses documents.',
    link: 'https://ma-clinique.blackagence.com',
    purpose:
      'Faire tourner une clinique au quotidien : patients, caisses, médecins, laboratoire, imagerie, hospitalisation, pharmacie, finances — sans mélanger les dossiers.',
    story: [
      'Le logiciel (MED-PRO) est une plateforme d’établissement de santé. Chaque module médical possède sa propre table, son API, ses reçus et rapports PDF. Une biologie n’écrit jamais dans une consultation. C’est volontaire : ça protège les données et les statistiques.',
      'Le parcours commence à l’accueil. On identifie le patient, on l’inscrit dans le bon service, on encaisse si besoin, on imprime le reçu. Le dossier avance ensuite vers le médecin, le labo, l’échographe, le bloc, l’hospitalisation ou les soins.',
      'Les rôles filtrent le menu : admin, médecin (selon spécialité), réceptionniste, caisses, pharmacien, facturier. Les licences de la clinique activent ou masquent les compartiments.',
      'Les documents (reçus, ordonnances, comptes rendus) se personnalisent : couleurs, filigrane, identité de la clinique. Une application mobile / desktop existe aussi, servie depuis l’API.',
    ],
    modules: [
      'Patients & dossiers',
      'Consultations',
      'Biologie / laboratoire',
      'Échographie',
      'Gynécologie',
      'Ophtalmologie',
      'Dentaire',
      'Chirurgie',
      'Hospitalisation & observation',
      'Accouchement',
      'Soins infirmiers',
      'Pharmacie',
      'Planning & rendez-vous',
      'Finances, assurances, personnel',
    ],
    stack: ['React', 'TypeScript', 'Laravel', 'MySQL', 'PWA', 'DomPDF'],
    photos: cliniquePhotos,
  },
  {
    id: 'residences',
    title: 'Réservation de résidences',
    category: 'Logiciel phare',
    blurb: 'SaaS de réservation : visiteur, entreprise de résidences, administration de plateforme.',
    link: 'https://residence.blackagence.com',
    purpose:
      'Permettre à un voyageur de réserver un logement chez une enseigne, et à chaque entreprise de ne gérer que ses résidences, ses calendriers et ses paiements.',
    story: [
      'La plateforme a trois portes. Le client choisit d’abord une entreprise de résidences, puis ne voit que ses logements. L’entreprise s’inscrit, attend la validation, puis administre ses biens. Le système (LK-group) valide, abonne, commissionne.',
      'La clé métier s’appelle residence_company_id. Elle isole les données : utilisateurs, résidences, appartements, réservations, avis. Le backend ne fait pas confiance au navigateur pour coller une réservation à une enseigne : il la déduit du logement choisi.',
      'Côté paiement, Wave utilise le compte marchand de l’entreprise. La plateforme calcule commission et référence. Une entreprise non validée ne se connecte pas. Une enseigne bloquée disparaît de la recherche.',
    ],
    modules: [
      'Sélection d’enseigne',
      'Catalogue logements',
      'Réservations & occupations',
      'Espace entreprise',
      'Validation système',
      'Paiements & commissions',
      'Avis',
    ],
    stack: ['React', 'Vite', 'Laravel', 'MySQL', 'Wave'],
    photos: [],
  },
  {
    id: 'scolarnet',
    title: 'ScolarNet — établissements',
    category: 'Logiciel phare',
    blurb: 'Gestion scolaire : classes, notes, séances, discipline, caisse, espaces école / profs / parents.',
    link: null,
    purpose:
      'Remplacer les cahiers éparpillés d’un établissement par un logiciel où chaque rôle (direction, éducateur, professeur, économe, parent) voit exactement ce qu’il doit voir.',
    story: [
      'ScolarNet, c’est deux applications qui se parlent : un front React et un backend Express + MySQL. L’utilisateur se connecte, reçoit des cookies httpOnly, et chaque appel est filtré par RBAC.',
      'La direction gère l’école. L’éducateur vit la vie scolaire sans créer les emplois. Le professeur saisit notes, séances, discipline limitée. L’économe touche la caisse. Le parent a son espace. Un super admin gère les établissements.',
      'On y trouve élèves, classes, bâtiments, évaluations, présences, notes de conduite, scolarité, cantine, transport, paies. Le cycle (primaire / secondaire) change même la logique d’évaluation : un maître de primaire n’a pas les mêmes compositions qu’un prof du secondaire.',
    ],
    modules: [
      'Élèves & classes',
      'Notes & évaluations',
      'Séances',
      'Discipline & présences',
      'Caisse / scolarité',
      'Espaces école, prof, parent, super admin',
    ],
    stack: ['React', 'TanStack Router', 'Node.js', 'Express', 'MySQL'],
    photos: [],
  },
  {
    id: 'prince-deco',
    title: 'Prince Déco — e-commerce',
    category: 'Commerce',
    blurb: 'Marketplace multi-vendeurs : client, vendeur, administration, stock et PWA.',
    link: 'https://ayoudeco.com',
    purpose:
      'Vendre la décoration en ligne tout en laissant chaque vendeur gérer son catalogue, son stock et ses commandes, sous un portail système.',
    story: [
      'Prince Déco (ayoudeco.com) est une marketplace à trois portails. Le client parcourt et commande. Le vendeur gère boutiques, stock, commandes, employés. L’administration système supervise la plateforme.',
      'Le backend Laravel 12 expose une API REST. Le front React 19 + TypeScript tourne en PWA, thème clair/sombre. Les notifications push, les PDF et le stock sont dans la boucle, pas en option.',
    ],
    modules: ['Boutique client', 'Portail vendeur', 'Stock', 'Commandes', 'Administration système', 'PWA'],
    stack: ['React 19', 'TypeScript', 'Laravel 12', 'MySQL', 'PWA'],
    photos: [],
  },
  {
    id: 'ticketsplus',
    title: 'TicketsPlus',
    category: 'Opérations',
    blurb: 'Tickets d’intervention, sites techniques, logistique, caisse, flotte GPS.',
    link: 'https://tbcenergieinnovation.com',
    purpose:
      'Piloter le terrain d’une entreprise d’énergie / télécoms : sites, pannes, demandes, stocks, caisse et véhicules.',
    story: [
      'TicketsPlus est le logiciel métier de TBC Energie Innovation. On y fiche les sites (groupes, batteries, clim, GPS), on ouvre des tickets PM / CM, on y colle les photos avant-après, on valide.',
      'Un circuit de demandes multi-niveaux (RM → MM → responsable → logistique → compta) empêche les achats fantômes. La logistique voit stocks global, bureau, zone. La caisse tient les écritures. La flotte GPS montre véhicules, geofences, missions.',
    ],
    modules: ['Sites techniques', 'Tickets', 'Workflows', 'Logistique', 'Caisse', 'Flotte GPS', 'PWA'],
    stack: ['Laravel', 'MySQL', 'Blade', 'PWA', 'Flutter'],
    photos: [],
  },
  {
    id: 'events',
    title: 'Billetterie & événements',
    category: 'Événementiel',
    blurb: 'Écosystème événements : application visiteur, scanner, dashboard, flux de tickets.',
    link: null,
    purpose: 'Vendre, contrôler et suivre des tickets d’événement, de l’achat à l’entrée de salle.',
    story: [
      'Plusieurs livraisons gravitent autour de l’événementiel : dashboard organisateur, application visiteur, application scanner. L’idée est la même partout : un ticket unique, un scan fiable, un tableau de bord qui dit qui est entré.',
      'Les projets even-anyway, projet-even et la couche tickets de T+ partagent cette logique : émettre, scanner, réconcilier.',
    ],
    modules: ['Billetterie', 'App visiteur', 'Scanner', 'Dashboard organisateur'],
    stack: ['React', 'Laravel', 'Applications mobiles'],
    photos: [],
  },
  {
    id: 'immo',
    title: 'Gestion immobilière',
    category: 'Immobilier',
    blurb: 'Outils de gestion et de mise en avant de biens, suivis et espaces métier.',
    link: null,
    purpose: 'Suivre des biens, des contacts et des opérations immobilières sans perdre le fil d’un dossier.',
    story: [
      'Les projets immobilier (gestion-immobilier, riad, black-immo) couvrent la vitrine et le back-office : fiches de biens, suivi, espaces métier. L’objectif est de faire travailler un promoteur ou une agence sur un outil unique.',
    ],
    modules: ['Biens', 'Suivi', 'Espaces métier'],
    stack: ['React', 'Laravel'],
    photos: [],
  },
  {
    id: 'transci',
    title: 'TransCI — transport',
    category: 'Mobilité',
    blurb: 'Application et tableau de bord pour le transport : courses, suivi, opérations.',
    link: null,
    purpose: 'Suivre l’activité transport : courses, tableau de bord, application terrain.',
    story: [
      'TransCI relie une API, un dashboard et une application. On y pilote les opérations de transport au quotidien : ce qui part, ce qui arrive, ce qui reste à dispatcher.',
    ],
    modules: ['Dashboard', 'Application', 'API métier'],
    stack: ['React', 'Laravel'],
    photos: [],
  },
  {
    id: 'reservauto',
    title: 'ReservAuto',
    category: 'Mobilité',
    blurb: 'Réservation de véhicules : parcours client, documents, calendrier de disponibilité.',
    link: null,
    purpose: 'Réserver un véhicule comme on réserve un logement : disponibilités, documents, confirmation.',
    story: [
      'ReservAuto est une application de réservation automobile. Le client parcourt, choisit, transmet les pièces (CNI, permis — vérifiés par le code), et le calendrier bloque la voiture.',
    ],
    modules: ['Catalogue véhicules', 'Réservation', 'Documents', 'Calendrier'],
    stack: ['React', 'Laravel'],
    photos: [],
  },
  {
    id: 'groupe-deco',
    title: 'Groupe Déco — atelier créatif',
    category: 'Marque',
    blurb: 'Espace entreprise et studio créatif pour une enseigne de décoration.',
    link: 'https://decoratep.net',
    purpose: 'Donner à Groupe Décoratep un espace digital : marque, création, administration.',
    story: [
      'Creative Canvas Studio + API Laravel. L’enseigne gère son univers de décoration en ligne, avec un espace entreprise et un accès système. Le domaine public est decoratep.net.',
    ],
    modules: ['Studio créatif', 'Espace entreprise', 'Administration'],
    stack: ['React', 'Laravel', 'MySQL'],
    photos: [],
  },
  {
    id: 'relation',
    title: 'Mise en relation',
    category: 'Plateforme',
    blurb: 'Plateforme de mise en relation entre acteurs, avec un front pensé pour le matching.',
    link: null,
    purpose: 'Connecter deux côtés d’un marché : ceux qui cherchent, ceux qui proposent.',
    story: [
      'Le front de mise en relation est une application web dédiée au matching. On y construit le pont entre l’offre et la demande, avec une interface pensée pour rester simple.',
    ],
    modules: ['Profils', 'Matching', 'Front visiteur'],
    stack: ['React'],
    photos: [],
  },
  {
    id: 'echic',
    title: 'Echic Connect',
    category: 'Application',
    blurb: 'Application de connexion et d’expérience utilisateur, orientée fluidité mobile.',
    link: null,
    purpose: 'Offrir une expérience de connexion fluide, mobile first.',
    story: [
      'Echic Connect est une application d’expérience utilisateur. L’accent est mis sur le geste, la fluidité, le mobile — une app qu’on ouvre sans y penser.',
    ],
    modules: ['Expérience mobile', 'Connexion'],
    stack: ['React', 'TypeScript'],
    photos: [],
  },
  {
    id: 'services',
    title: 'Application de services',
    category: 'Services',
    blurb: 'App et API pour commander et suivre des prestations de service.',
    link: null,
    purpose: 'Commander une prestation, la suivre, la clôturer.',
    story: [
      'Le couple service-app / service-backend permet de prendre une demande de service et de la faire avancer jusqu’à la livraison, côté client et côté opération.',
    ],
    modules: ['Demandes', 'Suivi', 'API'],
    stack: ['React', 'Laravel'],
    photos: [],
  },
]

export function getProject(id: string) {
  return projects.find((project) => project.id === id)
}
