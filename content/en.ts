import type { ContentDeck } from "@/content/schema";

export const enContent = {
  locale: "en",
  meta: {
    title: "ISANDRE — The room continues",
    description:
      "Open furniture for rooms that need structure, not another wall. Discover the ṬĀQA collection.",
    productTitlePattern: "{product} by ISANDRE — ṬĀQA",
    productDescriptionPattern:
      "{product}, {descriptor}. An open piece designed in France and made to order in Italy.",
  },
  brand: {
    signature: "The room continues.",
    promise: "Furniture that gives objects a place without closing the room.",
    campaign: "Let life through.",
    origin: "Designed in France. Made to order in Italy.",
    collectionLead: "ṬĀQA — places opened within matter.",
  },
  navigation: {
    pieces: "Pieces",
    story: "Living with ṬĀQA",
    making: "Making",
    projection: "View in your room",
    bag: "Bag",
    language: "Français",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  launch: {
    edition: "The first edition",
    delivery: "Delivery to selected destinations",
  },
  common: {
    collection: "Collection",
    service: "Service",
    technicalSheet: "Technical sheet",
    relatedProducts: "Continue with another piece",
    legal: "Legal",
    contact: "Contact",
    choose: "Choose",
    discoverPiece: "Discover the piece",
    viewAllDetails: "View all details",
    speakToStudio: "Speak to the studio",
    close: "Close",
    edit: "Edit",
    opening: "Opening…",
    expressCheckout: "Express checkout",
    expressCheckoutNote:
      "Stripe shows the fastest options available on this device.",
    stripePaymentMethodsNote:
      "Stripe shows the payment methods available for your country and eligibility.",
    dimensionsAndMaterial: "Dimensions and material",
    productionAndDelivery: "Production and delivery",
    materialSummary: "Low-sheen mineral surface. Open-backed structure.",
    selection: "Your selection",
    emptySelection: "Your selection will appear here.",
    viewCollection: "View the collection",
    changePieceOrFinish: "Change piece or finish",
    changePiece: "Change piece",
    production: "Production",
    delivery: "Delivery",
    summary: "Summary",
    items: "Items",
    leadTime: "Lead time",
    clearBag: "Clear bag",
    or: "or",
  },
  home: {
    heroEyebrow: "ISANDRE · ṬĀQA",
    heroTitle: "The room continues.",
    heroBody:
      "Mass gives chosen objects a place. Openings keep light, movement and conversation connected.",
    buyNow: "Buy now",
    addToBag: "Add to bag",
    viewAtHome: "View in your room",
    collectionEyebrow: "Three ways to open a room",
    collectionTitle: "Rise. Extend. Keep close.",
    collectionBody:
      "SEUIL marks a passage. PORTÉE draws a low horizon. VEILLE holds the last objects of the day.",
    storyEyebrow: "Living with open form",
    storyTitle: "Furniture should change a room, not stop it.",
    storyBody:
      "From morning light to the quiet before sleep, each piece makes space for objects while the room remains visible through it.",
    serviceEyebrow: "Made for an address",
    serviceTitle: "Choose the form. We organise the rest.",
    serviceBody:
      "Finish, delivery and secure payment are confirmed before the order begins. Technical and project support remain available throughout.",
  },
  products: {
    "seuil-01": {
      name: "SEUIL 01",
      descriptor: "Open Tall Cabinet",
      statement: "A threshold made visible.",
      shortStatement: "A tall form that gives structure without becoming a wall.",
      story:
        "SEUIL rises between uses. Books and ceramics settle into its openings; light, sightlines and daily movement carry on through it.",
      galleryHeading: "A presence the room can see through.",
      detailLines: [
        "Open on both sides.",
        "Eight fixed openings.",
        "102 × 184 × 42 cm.",
      ],
      heroEyebrow: "The vertical piece",
      heroCta: "Choose SEUIL",
      scaleCaption: "Its 184 cm height reads against familiar architecture.",
      openBackCaption: "The reverse is finished and open. SEUIL can leave the wall.",
      serviceLine: "For passages, living rooms and freestanding separation.",
    },
    "portee-02": {
      name: "PORTÉE 02",
      descriptor: "Open Low Cabinet",
      statement: "A horizon within the room.",
      shortStatement: "A long, low form that connects two uses.",
      story:
        "PORTÉE stretches between living and dining, sofa and window, books and empty space. It divides the function, never the view.",
      galleryHeading: "A line that brings the room together.",
      detailLines: [
        "Open on both sides.",
        "Eight fixed openings.",
        "184 × 102 × 42 cm.",
      ],
      heroEyebrow: "The horizontal piece",
      heroCta: "Choose PORTÉE",
      scaleCaption: "Its 102 cm height creates a low, legible horizon.",
      openBackCaption: "Every opening continues through to the other side.",
      serviceLine: "For walls, sofa backs and open-plan rooms.",
    },
    "veille-03": {
      name: "VEILLE 03",
      descriptor: "Bedside Table",
      statement: "Last at night. First in the morning.",
      shortStatement: "A small open architecture for private rituals.",
      story:
        "VEILLE keeps a book, a glass and the smallest rituals close. Its two openings turn the bedside into one calm, deliberate place.",
      galleryHeading: "The quiet side of the room.",
      detailLines: [
        "Exactly two open compartments.",
        "Rounded monolithic silhouette.",
        "Final dimensions under validation.",
      ],
      heroEyebrow: "The bedside piece",
      heroCta: "Choose VEILLE",
      scaleCaption: "Shown beside a bed as a use concept; dimensions remain under validation.",
      openBackCaption: "The final rear construction will be published after industrial validation.",
      serviceLine: "For books, a glass and the quiet beside the bed.",
    },
  },
  finishes: {
    chalk: {
      label: "Chalk",
      note: "A soft white that holds the light.",
      world: "Pale oak, smoked glass and morning light.",
    },
    butter: {
      label: "Butter",
      note: "Sunlight with a little more staying power.",
      world: "Blond wood, amber glass and one cobalt accent.",
    },
    sage: {
      label: "Sage",
      note: "A quiet green with shadowed depth.",
      world: "Walnut, olive ceramic and the garden beyond.",
    },
    "rose-clay": {
      label: "Rose Clay",
      note: "Earth, skin and the first light of evening.",
      world: "Amber glass, dark ceramic and a distant burgundy textile.",
    },
  },
  commerce: {
    quantity: "Quantity",
    finish: "Finish",
    price: "Price",
    from: "From",
    added: "Added to your bag.",
    bagTitle: "Your bag",
    bagEmptyTitle: "Your bag is waiting.",
    bagEmptyBody: "Choose a piece and finish. You can change both before checkout.",
    subtotal: "Subtotal",
    checkout: "Continue to secure checkout",
    secureCheckout: "Secure checkout with Stripe",
    remove: "Remove",
    increase: "Increase quantity",
    decrease: "Decrease quantity",
    deliveryCalculated: "Delivery is calculated for your address.",
    productionEstimate: "Estimated production: 20 working days.",
    taxNote: "Applicable duties and taxes are shown before payment.",
    checkoutCancelled: "Checkout was cancelled. Your selection is still in the bag.",
    checkoutSuccess: "Order received. A confirmation will be sent to your email.",
    buyNow: "Buy now",
    addToBag: "Add to bag",
  },
  projection: {
    title: "See the piece in your room",
    subtitle: "Add one photograph, choose a position and compare.",
    upload: "Choose a room photograph",
    replacePhoto: "Change photograph",
    place: "Tap where the piece should stand",
    optionalNote: "Optional note",
    optionalPlaceholder: "For example: keep it closer to the wall.",
    generate: "Create the view",
    retry: "Try again",
    adjust: "Adjust position",
    addToBag: "Add this piece to your bag",
    before: "Before",
    after: "After",
    compare: "Drag to compare",
    productReference: "Product reference",
    noPhoto: "No photograph selected",
    startTitle: "Start with your room.",
    startBody: "One clear photograph is enough. Then tap where the piece should stand.",
    unavailableTitle: "Room projection coming soon.",
    unavailableBody:
      "This tool will be released after the manufacturing dimensions are approved.",
    creating: "Creating your room view",
    keepOpen: "You can minimise this view and keep browsing.",
    download: "Download image",
    share: "Share image",
    states: {
      reading: "Reading the room",
      placing: "Setting the selected piece",
      integrating: "Matching light and perspective",
      checking: "Checking the result",
    },
    errors: {
      billing: "Projection is temporarily unavailable because the image service requires billing.",
      unavailable: "Projection is temporarily unavailable. Your product selection is unchanged.",
      invalidImage: "Use a clear JPG, PNG or WebP photograph.",
      placement: "Choose a visible point on the floor before continuing.",
      geometryBlocked: "This piece will be available for projection after its final dimensions are approved.",
      generic: "The view could not be created. Please try another photograph.",
    },
  },
  placementModes: {
    "against-wall": "Against a wall",
    divider: "As a room divider",
    "behind-sofa": "Behind a sofa",
    "under-window": "Under a window",
    bedside: "Beside the bed",
    other: "Another position",
  },
  service: {
    productionTitle: "Made to order in Italy",
    productionBody:
      "Production in Italy begins after payment. The current planning estimate is 20 working days before dispatch.",
    processEyebrow: "From drawing to mould",
    processTitle: "One form. One continuous piece.",
    processBody:
      "Designed in France for rotational moulding in Italy. One continuous shell moves through mould preparation, cooling, inspection and controlled colour matching.",
    deliveryTitle: "Delivered to your address",
    deliveryBody:
      "Destination, delivery charge, applicable duties and taxes are confirmed before payment.",
    technicalTitle: "Know the piece",
    technicalBody:
      "Validated dimensions and open-back views are available before purchase. Unvalidated data stays unpublished.",
    projectTitle: "For a project",
    projectBody:
      "Interior designers and project clients can request technical documents, quantities and delivery planning.",
    careTitle: "Live with it",
    careBody:
      "The final care protocol will be supplied with each order after material validation.",
  },
  faq: [
    {
      id: "open-back",
      question: "Are the pieces open on both sides?",
      answer:
        "SEUIL and PORTÉE are designed as open-backed forms and can sit away from a wall. Their approved rear views are available in each product gallery.",
    },
    {
      id: "dimensions",
      question: "What are the dimensions?",
      answer:
        "SEUIL measures 102 × 184 × 42 cm. PORTÉE measures 184 × 102 × 42 cm. VEILLE dimensions remain under industrial validation and are not yet published.",
    },
    {
      id: "material",
      question: "What is the material?",
      answer:
        "The target platform is a continuous, low-sheen, mass-coloured surface. The final commercial specification will be published only after industrial testing and golden-sample approval.",
    },
    {
      id: "origin",
      question: "Where are the pieces made?",
      answer:
        "The collection is designed in France and made to order in Italy. Supplier, batch and production records will be retained for every completed piece.",
    },
    {
      id: "delivery",
      question: "When will my order arrive?",
      answer:
        "The current production estimate is 20 working days. Transit time and delivery cost depend on the destination and are shown before payment.",
    },
    {
      id: "returns",
      question: "Can I return an order?",
      answer:
        "The applicable return terms depend on the destination and whether the piece is standard or genuinely personalised. The final policy is shown before payment.",
    },
  ],
  emails: {
    orderConfirmedSubject: "Your ISANDRE order is confirmed",
    orderConfirmedHeading: "Your piece is now in motion.",
    orderConfirmedBody:
      "We have received your order and will keep you informed from production to delivery.",
    productionUpdateSubject: "An update on your ISANDRE piece",
    productionUpdateBody:
      "Your piece is being prepared. We will write again when its final checks are complete.",
    shipmentSubject: "Your ISANDRE piece is on its way",
    shipmentBody:
      "Your piece has left the studio. The delivery details and tracking link are included below when available.",
    deliverySubject: "Your ISANDRE piece has arrived",
    deliveryBody:
      "We hope the piece has found its place. Keep the packaging until you have completed the arrival check.",
    careSubject: "Living with your ISANDRE piece",
    careBody:
      "A short care note for the surface, the openings and the life of the piece.",
    projectionSubject: "Your ISANDRE room view",
    abandonedBagSubject: "Your selected piece is still in your bag",
    supportSignature: "ISANDRE Client Service",
  },
  press: {
    headline: "ISANDRE introduces ṬĀQA, furniture that lets the room continue.",
    standfirst:
      "Three open forms give objects a place while preserving light, movement and sightlines.",
    boilerplate:
      "ISANDRE is an independent French design house. Its first collection, ṬĀQA, explores furniture as an open architecture for everyday life and is made to order in Italy.",
    releaseNote:
      "Brand, collection and product names remain subject to formal legal clearance before public launch.",
  },
  trade: {
    headline: "Open forms for considered interiors.",
    body:
      "For residential, hospitality and editorial projects, request the current technical pack, finish references, quantities and delivery planning.",
    cta: "Request the trade pack",
    requestedDetails: [
      "Project location",
      "Selected pieces and finishes",
      "Target quantity",
      "Required delivery window",
      "Technical or installation constraints",
    ],
  },
  serviceRequests: {
    eyebrow: "Studio requests",
    title: "Tell us what the room needs.",
    body:
      "Projects, trade specifications and editorial requests are handled separately from standard online orders.",
    kinds: {
      project: {
        label: "Project",
        description: "A residential project, adaptation or technical question.",
      },
      trade: {
        label: "Trade",
        description: "Specification, quantities, samples and delivery planning.",
      },
      press: {
        label: "Press",
        description: "Images, credits, product information or an interview.",
      },
    },
    fields: {
      name: "Name",
      email: "Email",
      organization: "Studio or publication",
      phone: "Phone",
      location: "City / country",
      product: "Piece",
      finish: "Finish",
      quantity: "Quantity",
      message: "Request",
      messagePlaceholder:
        "Tell us about the space, timing and information you need.",
      privacy: "I agree that my details are used to answer this request.",
      marketing: "I would also like occasional news from ISANDRE.",
    },
    submit: "Send request",
    submitting: "Sending…",
    success: "Your request has reached the studio.",
    error: "The request could not be sent. Please try again.",
  },
  measurement: {
    title: "Your privacy, kept simple.",
    body:
      "Essential storage keeps your bag and market selection. Optional audience measurement helps us improve the shop. No advertising tracker is active.",
    essentialOnly: "Essential only",
    allowAnalytics: "Allow audience measurement",
    preferences: "Privacy choices",
  },
  errors: {
    required: "This field is required.",
    invalidEmail: "Enter a valid email address.",
    network: "The connection was interrupted. Please try again.",
    checkout: "Secure checkout could not be opened. Your bag has been kept.",
    unavailable: "This option is not available yet.",
    retry: "Try again",
  },
  glossary: {
    openBacked: {
      term: "Open-backed",
      definition: "Finished and open through the rear, without a closing panel.",
    },
    preparedToOrder: {
      term: "Made to order",
      definition:
        "Production in Italy begins for a confirmed order; it does not imply personalisation.",
    },
    digitallyApproved: {
      term: "Digital-approved",
      definition:
        "Approved as a digital representation, not as physical proof of colour or material.",
    },
    conceptBlocked: {
      term: "Concept-blocked",
      definition:
        "Visible for direction only; not released as dimensional or industrial proof.",
    },
    goldenSample: {
      term: "Golden sample",
      definition:
        "The signed physical reference used to release material, colour and finish.",
    },
  },
} satisfies ContentDeck;
