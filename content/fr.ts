import type { ContentDeck } from "@/content/schema";

export const frContent = {
  locale: "fr",
  meta: {
    title: "ISANDRE — La pièce continue",
    description:
      "Des meubles ouverts pour les espaces qui demandent une structure, pas un mur de plus. Découvrez la collection ṬĀQA.",
    productTitlePattern: "{product} par ISANDRE — ṬĀQA",
    productDescriptionPattern:
      "{product}, {descriptor}. Une pièce ouverte dessinée en France et fabriquée sur commande en Italie.",
  },
  brand: {
    signature: "La pièce continue.",
    promise: "Des meubles qui donnent une place aux objets sans fermer la pièce.",
    campaign: "Laisser passer la vie.",
    origin: "Dessiné en France. Fabriqué sur commande en Italie.",
    collectionLead: "ṬĀQA — des places ménagées dans la matière.",
  },
  navigation: {
    pieces: "Les pièces",
    story: "Vivre avec ṬĀQA",
    making: "Fabrication",
    projection: "Voir chez vous",
    bag: "Panier",
    language: "English",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
  },
  launch: {
    edition: "La première édition",
    delivery: "Livraison vers une sélection de destinations",
  },
  common: {
    collection: "Collection",
    service: "Service",
    technicalSheet: "Fiche technique",
    relatedProducts: "Continuer avec une autre pièce",
    legal: "Mentions légales",
    contact: "Contact",
    choose: "Choisir",
    discoverPiece: "Découvrir la pièce",
    viewAllDetails: "Voir tous les détails",
    speakToStudio: "Parler au studio",
    close: "Fermer",
    edit: "Modifier",
    opening: "Ouverture…",
    expressCheckout: "Paiement express",
    expressCheckoutNote:
      "Stripe affiche les options les plus rapides disponibles sur cet appareil.",
    stripePaymentMethodsNote:
      "Stripe affiche les moyens de paiement disponibles selon votre pays et votre éligibilité.",
    dimensionsAndMaterial: "Dimensions et matière",
    productionAndDelivery: "Fabrication et livraison",
    materialSummary: "Surface minérale à faible brillance. Structure sans fond.",
    selection: "Votre sélection",
    emptySelection: "Votre sélection apparaîtra ici.",
    viewCollection: "Voir la collection",
    changePieceOrFinish: "Modifier la pièce ou la finition",
    changePiece: "Changer de pièce",
    production: "Fabrication",
    delivery: "Livraison",
    summary: "Résumé",
    items: "Pièces",
    leadTime: "Délai",
    clearBag: "Vider le panier",
    or: "ou",
  },
  home: {
    heroEyebrow: "ISANDRE · ṬĀQA",
    heroTitle: "La pièce continue.",
    heroBody:
      "La masse donne une place aux objets choisis. Les ouvertures gardent la lumière, les gestes et les conversations reliés.",
    buyNow: "Acheter",
    addToBag: "Ajouter au panier",
    viewAtHome: "Voir dans votre pièce",
    collectionEyebrow: "Trois façons d’ouvrir une pièce",
    collectionTitle: "Élever. Étendre. Garder près de soi.",
    collectionBody:
      "SEUIL marque un passage. PORTÉE dessine un horizon bas. VEILLE accueille les derniers objets du jour.",
    storyEyebrow: "Vivre avec ṬĀQA",
    storyTitle: "Un meuble peut changer la pièce sans l’arrêter.",
    storyBody:
      "De la lumière du matin au calme avant le sommeil, chaque forme donne une place aux objets tandis que la pièce reste visible à travers elle.",
    serviceEyebrow: "Pensé pour une adresse",
    serviceTitle: "Choisissez la forme. Nous organisons la suite.",
    serviceBody:
      "Finition, livraison et paiement sécurisé sont confirmés avant le lancement de la commande. L’accompagnement technique reste disponible.",
  },
  products: {
    "seuil-01": {
      name: "SEUIL 01",
      descriptor: "Cabinet vertical ouvert",
      statement: "Un seuil rendu visible.",
      shortStatement: "Une forme haute qui structure sans devenir un mur.",
      story:
        "SEUIL s’élève entre deux usages. Livres et céramiques trouvent leur place ; la lumière, les perspectives et les gestes quotidiens continuent à le traverser.",
      galleryHeading: "Une présence à travers laquelle la pièce reste visible.",
      detailLines: [
        "Ouvert des deux côtés.",
        "Huit ouvertures fixes.",
        "102 × 184 × 42 cm.",
      ],
      heroEyebrow: "La pièce verticale",
      heroCta: "Choisir SEUIL",
      scaleCaption: "Sa hauteur de 184 cm se lit contre une architecture familière.",
      openBackCaption: "L’arrière est fini et ouvert. SEUIL peut quitter le mur.",
      serviceLine: "Pour les passages, les salons et la séparation libre.",
    },
    "portee-02": {
      name: "PORTÉE 02",
      descriptor: "Cabinet horizontal ouvert",
      statement: "Un horizon dans la pièce.",
      shortStatement: "Une forme longue et basse qui relie deux usages.",
      story:
        "PORTÉE s’étire entre salon et repas, canapé et fenêtre, livres et vide. Elle sépare la fonction, jamais le regard.",
      galleryHeading: "Une ligne qui rassemble la pièce.",
      detailLines: [
        "Ouvert des deux côtés.",
        "Huit ouvertures fixes.",
        "184 × 102 × 42 cm.",
      ],
      heroEyebrow: "La pièce horizontale",
      heroCta: "Choisir PORTÉE",
      scaleCaption: "Sa hauteur de 102 cm dessine un horizon bas et lisible.",
      openBackCaption: "Chaque ouverture continue jusqu’à l’autre côté.",
      serviceLine: "Pour les murs, les dos de canapé et les espaces ouverts.",
    },
    "veille-03": {
      name: "VEILLE 03",
      descriptor: "Table de chevet",
      statement: "Dernière le soir. Première le matin.",
      shortStatement: "Une petite architecture ouverte pour les rituels intimes.",
      story:
        "VEILLE garde près de soi un livre, un verre et les plus petits rituels. Ses deux ouvertures font du chevet un lieu calme et délibéré.",
      galleryHeading: "Le côté calme de la pièce.",
      detailLines: [
        "Exactement deux compartiments ouverts.",
        "Silhouette monolithique arrondie.",
        "Dimensions finales en validation.",
      ],
      heroEyebrow: "La pièce de chevet",
      heroCta: "Choisir VEILLE",
      scaleCaption: "Présentée près d’un lit comme concept d’usage ; les dimensions restent en validation.",
      openBackCaption: "La construction arrière finale sera publiée après validation industrielle.",
      serviceLine: "Pour les livres, un verre et le calme près du lit.",
    },
  },
  finishes: {
    chalk: {
      label: "Craie",
      note: "Un blanc doux qui retient la lumière.",
      world: "Chêne pâle, verre fumé et lumière du matin.",
    },
    butter: {
      label: "Beurre",
      note: "Un soleil qui reste un peu plus longtemps.",
      world: "Bois blond, verre ambré et une touche de cobalt.",
    },
    sage: {
      label: "Sauge",
      note: "Un vert calme, approfondi par l’ombre.",
      world: "Noyer, céramique olive et jardin en arrière-plan.",
    },
    "rose-clay": {
      label: "Argile rose",
      note: "La terre, la peau et la première lumière du soir.",
      world: "Verre ambré, céramique sombre et textile bordeaux éloigné.",
    },
  },
  commerce: {
    quantity: "Quantité",
    finish: "Finition",
    price: "Prix",
    from: "À partir de",
    added: "Ajouté au panier.",
    bagTitle: "Votre panier",
    bagEmptyTitle: "Votre panier vous attend.",
    bagEmptyBody: "Choisissez une pièce et une finition. Vous pourrez encore les modifier avant le paiement.",
    subtotal: "Sous-total",
    checkout: "Continuer vers le paiement sécurisé",
    secureCheckout: "Paiement sécurisé avec Stripe",
    remove: "Retirer",
    increase: "Augmenter la quantité",
    decrease: "Réduire la quantité",
    deliveryCalculated: "La livraison est calculée selon votre adresse.",
    productionEstimate: "Fabrication estimée : 20 jours ouvrés.",
    taxNote: "Les droits et taxes applicables sont affichés avant le paiement.",
    checkoutCancelled: "Le paiement a été annulé. Votre sélection reste dans le panier.",
    checkoutSuccess: "Commande reçue. Une confirmation sera envoyée par email.",
    buyNow: "Acheter",
    addToBag: "Ajouter au panier",
  },
  projection: {
    title: "Voir la pièce chez vous",
    subtitle: "Ajoutez une photo, choisissez un emplacement et comparez.",
    upload: "Choisir une photo de la pièce",
    replacePhoto: "Changer de photo",
    place: "Touchez le sol à l’endroit où poser la pièce",
    optionalNote: "Précision facultative",
    optionalPlaceholder: "Par exemple : la garder plus près du mur.",
    generate: "Créer la vue",
    retry: "Recommencer",
    adjust: "Ajuster l’emplacement",
    addToBag: "Ajouter cette pièce au panier",
    before: "Avant",
    after: "Après",
    compare: "Glisser pour comparer",
    productReference: "Référence produit",
    noPhoto: "Aucune photo sélectionnée",
    startTitle: "Commencez par votre pièce.",
    startBody:
      "Une photo claire suffit. Touchez ensuite l’endroit où la pièce doit se poser.",
    unavailableTitle: "Projection bientôt disponible.",
    unavailableBody:
      "Cet outil sera publié après validation des dimensions de fabrication.",
    creating: "Création de votre projection",
    keepOpen: "Vous pouvez réduire cette vue et poursuivre votre visite.",
    download: "Télécharger l’image",
    share: "Partager l’image",
    states: {
      reading: "Lecture de la pièce",
      placing: "Mise en place de la forme choisie",
      integrating: "Accord de la lumière et de la perspective",
      checking: "Vérification du résultat",
    },
    errors: {
      billing: "La projection est temporairement indisponible car le service d’image demande une facturation active.",
      unavailable: "La projection est temporairement indisponible. Votre sélection produit reste inchangée.",
      invalidImage: "Utilisez une photo nette au format JPG, PNG ou WebP.",
      placement: "Choisissez un point visible sur le sol avant de continuer.",
      geometryBlocked: "Cette pièce sera disponible en projection après validation de ses dimensions finales.",
      generic: "La vue n’a pas pu être créée. Essayez une autre photo.",
    },
  },
  placementModes: {
    "against-wall": "Contre un mur",
    divider: "En séparation",
    "behind-sofa": "Derrière un canapé",
    "under-window": "Sous une fenêtre",
    bedside: "À côté du lit",
    other: "Autre emplacement",
  },
  service: {
    productionTitle: "Fabriqué sur commande en Italie",
    productionBody:
      "La fabrication en Italie démarre après le paiement. L’estimation actuelle est de 20 jours ouvrés avant expédition.",
    processEyebrow: "Du dessin au moule",
    processTitle: "Une forme. Une seule pièce continue.",
    processBody:
      "Dessinée en France pour le rotomoulage en Italie. Une coque continue passe par la préparation du moule, le refroidissement, le contrôle et l’ajustement précis de la couleur.",
    deliveryTitle: "Livré à votre adresse",
    deliveryBody:
      "Destination, frais de livraison, droits et taxes applicables sont confirmés avant le paiement.",
    technicalTitle: "Connaître la pièce",
    technicalBody:
      "Les dimensions validées et les vues traversantes sont disponibles avant l’achat. Les données non validées restent masquées.",
    projectTitle: "Pour un projet",
    projectBody:
      "Architectes d’intérieur et clients projet peuvent demander documents techniques, quantités et calendrier de livraison.",
    careTitle: "Vivre avec la pièce",
    careBody:
      "Le protocole d’entretien final accompagnera chaque commande après validation de la matière.",
  },
  faq: [
    {
      id: "open-back",
      question: "Les pièces sont-elles ouvertes des deux côtés ?",
      answer:
        "SEUIL et PORTÉE sont conçues sans fond et peuvent s’éloigner du mur. Leurs vues arrière validées figurent dans chaque galerie produit.",
    },
    {
      id: "dimensions",
      question: "Quelles sont les dimensions ?",
      answer:
        "SEUIL mesure 102 × 184 × 42 cm. PORTÉE mesure 184 × 102 × 42 cm. Les dimensions de VEILLE restent en validation industrielle et ne sont pas encore publiées.",
    },
    {
      id: "material",
      question: "Quelle est la matière ?",
      answer:
        "La plateforme cible est une surface continue, faiblement satinée et teintée dans la masse. La spécification commerciale finale ne sera publiée qu’après essais industriels et validation du golden sample.",
    },
    {
      id: "origin",
      question: "Où les pièces sont-elles fabriquées ?",
      answer:
        "La collection est dessinée en France et fabriquée sur commande en Italie. Les dossiers fournisseur, lot et production seront conservés pour chaque pièce réalisée.",
    },
    {
      id: "delivery",
      question: "Quand ma commande arrivera-t-elle ?",
      answer:
        "L’estimation actuelle de fabrication est de 20 jours ouvrés. Le transit et les frais dépendent de la destination et sont affichés avant le paiement.",
    },
    {
      id: "returns",
      question: "Puis-je retourner une commande ?",
      answer:
        "Les conditions applicables dépendent de la destination et du caractère standard ou réellement personnalisé de la pièce. La politique finale est présentée avant le paiement.",
    },
  ],
  emails: {
    orderConfirmedSubject: "Votre commande ISANDRE est confirmée",
    orderConfirmedHeading: "Votre pièce est désormais en mouvement.",
    orderConfirmedBody:
      "Nous avons reçu votre commande et vous tiendrons informé de la fabrication jusqu’à la livraison.",
    productionUpdateSubject: "Des nouvelles de votre pièce ISANDRE",
    productionUpdateBody:
      "Votre pièce est en préparation. Nous vous écrirons de nouveau lorsque ses contrôles finaux seront terminés.",
    shipmentSubject: "Votre pièce ISANDRE est en chemin",
    shipmentBody:
      "Votre pièce a quitté le studio. Les informations de livraison et le suivi figurent ci-dessous lorsqu’ils sont disponibles.",
    deliverySubject: "Votre pièce ISANDRE est arrivée",
    deliveryBody:
      "Nous espérons que la pièce a trouvé sa place. Conservez l’emballage jusqu’à la fin du contrôle à l’arrivée.",
    careSubject: "Vivre avec votre pièce ISANDRE",
    careBody:
      "Quelques gestes simples pour la surface, les ouvertures et la vie de la pièce.",
    projectionSubject: "Votre vue ISANDRE dans votre intérieur",
    abandonedBagSubject: "Votre pièce est toujours dans votre panier",
    supportSignature: "Service client ISANDRE",
  },
  press: {
    headline: "ISANDRE présente ṬĀQA, des meubles qui laissent la pièce continuer.",
    standfirst:
      "Trois formes ouvertes donnent une place aux objets tout en préservant la lumière, les gestes et les perspectives.",
    boilerplate:
      "ISANDRE est une maison de design française indépendante. Sa première collection, ṬĀQA, explore le meuble comme une architecture ouverte pour la vie quotidienne et est fabriquée sur commande en Italie.",
    releaseNote:
      "La marque, la collection et les noms produits restent soumis à une clearance juridique formelle avant lancement public.",
  },
  trade: {
    headline: "Des formes ouvertes pour les intérieurs pensés.",
    body:
      "Pour les projets résidentiels, hôteliers ou éditoriaux, demandez le dossier technique actuel, les références de finition, les quantités et le calendrier de livraison.",
    cta: "Demander le dossier prescripteur",
    requestedDetails: [
      "Lieu du projet",
      "Pièces et finitions envisagées",
      "Quantité cible",
      "Fenêtre de livraison",
      "Contraintes techniques ou d’installation",
    ],
  },
  serviceRequests: {
    eyebrow: "Demandes au studio",
    title: "Dites-nous ce que la pièce demande.",
    body:
      "Les projets, prescriptions et demandes éditoriales sont traités séparément des commandes standard en ligne.",
    kinds: {
      project: {
        label: "Projet",
        description: "Un projet résidentiel, une adaptation ou une question technique.",
      },
      trade: {
        label: "Prescripteur",
        description: "Spécification, quantités, échantillons et calendrier.",
      },
      press: {
        label: "Presse",
        description: "Images, crédits, informations produit ou entretien.",
      },
    },
    fields: {
      name: "Nom",
      email: "Email",
      organization: "Studio ou publication",
      phone: "Téléphone",
      location: "Ville / pays",
      product: "Pièce",
      finish: "Finition",
      quantity: "Quantité",
      message: "Demande",
      messagePlaceholder:
        "Précisez l’espace, le calendrier et les informations recherchées.",
      privacy: "J’accepte que mes informations soient utilisées pour répondre à cette demande.",
      marketing: "Je souhaite également recevoir occasionnellement des nouvelles d’ISANDRE.",
    },
    submit: "Envoyer la demande",
    submitting: "Envoi…",
    success: "Votre demande est arrivée au studio.",
    error: "La demande n’a pas pu être envoyée. Réessayez.",
  },
  measurement: {
    title: "Votre vie privée, simplement.",
    body:
      "Le stockage essentiel conserve votre panier et votre marché. La mesure d’audience facultative nous aide à améliorer la boutique. Aucun traceur publicitaire n’est actif.",
    essentialOnly: "Essentiel uniquement",
    allowAnalytics: "Autoriser la mesure d’audience",
    preferences: "Choix de confidentialité",
  },
  errors: {
    required: "Ce champ est obligatoire.",
    invalidEmail: "Saisissez une adresse email valide.",
    network: "La connexion a été interrompue. Réessayez.",
    checkout: "Le paiement sécurisé n’a pas pu s’ouvrir. Votre panier est conservé.",
    unavailable: "Cette option n’est pas encore disponible.",
    retry: "Réessayer",
  },
  glossary: {
    openBacked: {
      term: "Sans fond",
      definition: "Fini et ouvert à l’arrière, sans panneau de fermeture.",
    },
    preparedToOrder: {
      term: "Fabriqué sur commande",
      definition:
        "La fabrication en Italie commence pour une commande confirmée ; cela ne signifie pas une personnalisation.",
    },
    digitallyApproved: {
      term: "Validé numériquement",
      definition:
        "Approuvé comme représentation numérique, pas comme preuve physique de couleur ou de matière.",
    },
    conceptBlocked: {
      term: "Concept bloqué",
      definition:
        "Visible uniquement comme direction ; non libéré comme preuve dimensionnelle ou industrielle.",
    },
    goldenSample: {
      term: "Échantillon maître",
      definition:
        "Référence physique signée utilisée pour libérer matière, couleur et finition.",
    },
  },
} satisfies ContentDeck;
