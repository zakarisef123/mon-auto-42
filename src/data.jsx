export const PHONE_DISPLAY = '07 66 90 35 29';
export const PHONE_TEL = 'tel:+33766903529';
export const PHONE_INTL = '33766903529';
export const ADDRESS_LINE1 = '1 Rue du Puits de la Garenne';
export const ADDRESS_LINE2 = '42000 Saint-Étienne';
export const MAPS_DIRECTIONS =
  'https://www.google.com/maps/dir/?api=1&destination=1+Rue+du+Puits+de+la+Garenne+42000+Saint-%C3%89tienne';
export const MAPS_EMBED =
  'https://maps.google.com/maps?q=1%20Rue%20du%20Puits%20de%20la%20Garenne%2C%2042000%20Saint-%C3%89tienne&z=16&output=embed';

// À COMPLÉTER : remplacer par les horaires réels du garage
export const HOURS = ['Du lundi au vendredi : 8h–12h / 14h–18h', 'Samedi : sur rendez-vous'];

export const SUJETS = [
  'Mécanique / entretien',
  'Carrosserie',
  'Pare-brise',
  'Dépannage',
  'Carte grise',
  "Achat d'un véhicule d'occasion",
  'Vente / reprise de mon véhicule',
  'Autre',
];

export const MARQUEE = ['Mécanique', 'Carrosserie', 'Pare-brise', 'Dépannage', 'Carte grise', 'Vente', 'Achat', 'Reprise'];

export const SERVICES = [
  {
    title: 'Mécanique',
    text: 'Vidange, freinage, distribution, embrayage, diagnostic électronique, climatisation, pneumatiques.',
    icon: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.1-.4-.4-2.1z" />,
  },
  {
    title: 'Carrosserie',
    text: "Débosselage, rayures, peinture, remplacement d'éléments. Prise en charge avec votre assurance.",
    icon: <path d="M5 17h14l-1.5-5.5A2 2 0 0 0 15.6 10H8.4a2 2 0 0 0-1.9 1.5zM3 17h18v3H3zM7 7l2-3M17 7l-2-3M12 7V3" />,
  },
  {
    title: 'Pare-brise',
    text: "Réparation d'impact et remplacement de vitrage. Démarches simplifiées avec votre assureur.",
    icon: (
      <>
        <path d="M3 8c3-2 6-3 9-3s6 1 9 3l-2 9H5z" />
        <path d="M9 11l2 2M13 10l3 3" />
      </>
    ),
  },
  {
    title: 'Dépannage',
    text: "Panne, batterie à plat, véhicule immobilisé : appelez-nous, on s'organise pour vous remettre en route.",
    icon: (
      <>
        <path d="M2 16V9h9l3 4h5a2 2 0 0 1 2 2v1" />
        <circle cx="6.5" cy="17" r="2" />
        <circle cx="17.5" cy="17" r="2" />
        <path d="M11 9 7 4" />
      </>
    ),
  },
  {
    title: 'Carte grise',
    text: "Changement de titulaire, d'adresse, duplicata : on s'occupe des démarches ANTS à votre place.",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 10h6M7 14h10" />
      </>
    ),
  },
  {
    title: 'Vente · Achat · Reprise',
    text: 'Achetez un véhicule contrôlé, vendez le vôtre ou faites-le reprendre pour financer le suivant.',
    icon: <path d="M4 12h16M14 6l6 6-6 6" />,
    highlight: true,
    link: { href: '#occasions', label: 'Découvrir →' },
  },
];

export const GALLERY = [
  { src: '/assets/img/atelier.jpg', alt: 'Atelier mécanique avec pont élévateur et véhicules en réparation', caption: "L'atelier", wide: true },
  { src: '/assets/img/accueil.jpg', alt: "Espace d'accueil clientèle du garage", caption: "L'accueil" },
  { src: '/assets/img/parking-occasions.jpg', alt: "Parking extérieur avec véhicules d'occasion à vendre", caption: 'Le parc extérieur' },
  { src: '/assets/img/facade-garage.jpg', alt: 'Façade du garage Mon Auto 42', caption: '1 rue du Puits de la Garenne', wide: true },
];

export const WHY = [
  { title: 'Transparence', text: 'Devis clair avant toute intervention. Pas de surprise sur la facture.' },
  { title: 'Réactivité', text: 'Un numéro direct, une réponse rapide, des délais tenus.' },
  { title: 'Toutes marques', text: 'Citadines, utilitaires, SUV ou sportives : on connaît.' },
  { title: 'Tout-en-un', text: 'Réparation, vente et administratif : un seul interlocuteur.' },
];

export const PROCESS = [
  { title: 'Vous nous contactez', text: 'Par téléphone, WhatsApp ou directement au garage. On écoute ce qui ne va pas.' },
  { title: 'Diagnostic', text: 'On examine le véhicule et on identifie précisément la panne ou les travaux à faire.' },
  { title: 'Devis clair', text: 'Vous recevez un prix détaillé. Rien n’est fait sans votre accord.' },
  { title: 'Intervention', text: 'Nos mécaniciens réparent avec des pièces adaptées, dans les délais annoncés.' },
  { title: 'Vous repartez', text: 'On vous explique ce qui a été fait et vous reprenez la route sereinement.' },
];
