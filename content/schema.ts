import type {
  FinishId,
  Locale,
  PlacementMode,
  ProductId,
} from "@/lib/isandre/ids";

export type ProductEditorialCopy = {
  name: string;
  descriptor: string;
  statement: string;
  shortStatement: string;
  story: string;
  galleryHeading: string;
  detailLines: string[];
  heroEyebrow: string;
  heroCta: string;
  scaleCaption: string;
  openBackCaption: string;
  serviceLine: string;
};

export type FinishEditorialCopy = {
  label: string;
  note: string;
  world: string;
};

export type ContentDeck = {
  locale: Locale;
  meta: {
    title: string;
    description: string;
    productTitlePattern: string;
    productDescriptionPattern: string;
  };
  brand: {
    signature: string;
    promise: string;
    campaign: string;
    origin: string;
    collectionLead: string;
  };
  navigation: {
    pieces: string;
    story: string;
    making: string;
    projection: string;
    bag: string;
    language: string;
    openMenu: string;
    closeMenu: string;
  };
  launch: {
    edition: string;
    delivery: string;
  };
  common: {
    collection: string;
    service: string;
    technicalSheet: string;
    relatedProducts: string;
    legal: string;
    contact: string;
    choose: string;
    discoverPiece: string;
    viewAllDetails: string;
    speakToStudio: string;
    close: string;
    edit: string;
    opening: string;
    expressCheckout: string;
    expressCheckoutNote: string;
    stripePaymentMethodsNote: string;
    dimensionsAndMaterial: string;
    productionAndDelivery: string;
    materialSummary: string;
    selection: string;
    emptySelection: string;
    viewCollection: string;
    changePieceOrFinish: string;
    changePiece: string;
    production: string;
    delivery: string;
    summary: string;
    items: string;
    leadTime: string;
    clearBag: string;
    or: string;
  };
  home: {
    heroEyebrow: string;
    heroTitle: string;
    heroBody: string;
    buyNow: string;
    addToBag: string;
    viewAtHome: string;
    collectionEyebrow: string;
    collectionTitle: string;
    collectionBody: string;
    storyEyebrow: string;
    storyTitle: string;
    storyBody: string;
    serviceEyebrow: string;
    serviceTitle: string;
    serviceBody: string;
  };
  products: Record<ProductId, ProductEditorialCopy>;
  finishes: Record<FinishId, FinishEditorialCopy>;
  commerce: {
    quantity: string;
    finish: string;
    price: string;
    from: string;
    added: string;
    bagTitle: string;
    bagEmptyTitle: string;
    bagEmptyBody: string;
    subtotal: string;
    checkout: string;
    secureCheckout: string;
    remove: string;
    increase: string;
    decrease: string;
    deliveryCalculated: string;
    productionEstimate: string;
    taxNote: string;
    checkoutCancelled: string;
    checkoutSuccess: string;
    buyNow: string;
    addToBag: string;
  };
  projection: {
    title: string;
    subtitle: string;
    upload: string;
    replacePhoto: string;
    place: string;
    optionalNote: string;
    optionalPlaceholder: string;
    generate: string;
    retry: string;
    adjust: string;
    addToBag: string;
    before: string;
    after: string;
    compare: string;
    productReference: string;
    noPhoto: string;
    startTitle: string;
    startBody: string;
    unavailableTitle: string;
    unavailableBody: string;
    creating: string;
    keepOpen: string;
    download: string;
    share: string;
    states: {
      reading: string;
      placing: string;
      integrating: string;
      checking: string;
    };
    errors: {
      billing: string;
      unavailable: string;
      invalidImage: string;
      placement: string;
      geometryBlocked: string;
      generic: string;
    };
  };
  placementModes: Record<PlacementMode, string>;
  service: {
    productionTitle: string;
    productionBody: string;
    processEyebrow: string;
    processTitle: string;
    processBody: string;
    deliveryTitle: string;
    deliveryBody: string;
    technicalTitle: string;
    technicalBody: string;
    projectTitle: string;
    projectBody: string;
    careTitle: string;
    careBody: string;
  };
  faq: Array<{ id: string; question: string; answer: string }>;
  emails: {
    orderConfirmedSubject: string;
    orderConfirmedHeading: string;
    orderConfirmedBody: string;
    productionUpdateSubject: string;
    productionUpdateBody: string;
    shipmentSubject: string;
    shipmentBody: string;
    deliverySubject: string;
    deliveryBody: string;
    careSubject: string;
    careBody: string;
    projectionSubject: string;
    abandonedBagSubject: string;
    supportSignature: string;
  };
  press: {
    headline: string;
    standfirst: string;
    boilerplate: string;
    releaseNote: string;
  };
  trade: {
    headline: string;
    body: string;
    cta: string;
    requestedDetails: string[];
  };
  serviceRequests: {
    eyebrow: string;
    title: string;
    body: string;
    kinds: {
      project: { label: string; description: string };
      trade: { label: string; description: string };
      press: { label: string; description: string };
    };
    fields: {
      name: string;
      email: string;
      organization: string;
      phone: string;
      location: string;
      product: string;
      finish: string;
      quantity: string;
      message: string;
      messagePlaceholder: string;
      privacy: string;
      marketing: string;
    };
    submit: string;
    submitting: string;
    success: string;
    error: string;
  };
  measurement: {
    title: string;
    body: string;
    essentialOnly: string;
    allowAnalytics: string;
    preferences: string;
  };
  errors: {
    required: string;
    invalidEmail: string;
    network: string;
    checkout: string;
    unavailable: string;
    retry: string;
  };
  glossary: Record<
    "openBacked" | "preparedToOrder" | "digitallyApproved" | "conceptBlocked" | "goldenSample",
    {
      term: string;
      definition: string;
    }
  >;
};
