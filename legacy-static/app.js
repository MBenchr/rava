(function () {
  const data = window.ravaSiteData;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const priceFormatter = new Intl.NumberFormat("fr-BE", {
    maximumFractionDigits: 0,
  });

  const els = {
    body: document.body,
    header: document.querySelector(".site-header"),
    headerMenu: document.getElementById("headerMenu"),
    siteNav: document.getElementById("siteNav"),
    heroFrame: document.getElementById("heroFrame"),
    heroImage: document.getElementById("heroImage"),
    heroLegend: document.getElementById("heroLegend"),
    heroMeta: document.getElementById("heroMeta"),
    formatControls: document.getElementById("formatControls"),
    finishControls: document.getElementById("finishControls"),
    countryControls: document.getElementById("countryControls"),
    formatCurrent: document.getElementById("formatCurrent"),
    finishCurrent: document.getElementById("finishCurrent"),
    countryCurrent: document.getElementById("countryCurrent"),
    configureMedia: document.getElementById("configureMedia"),
    configureSummary: document.getElementById("configureSummary"),
    sceneStack: document.getElementById("sceneStack"),
    processFacts: document.getElementById("processFacts"),
    processSteps: document.getElementById("processSteps"),
    processPrimaryMedia: document.getElementById("processPrimaryMedia"),
    processSecondaryMedia: document.getElementById("processSecondaryMedia"),
    orderMedia: document.getElementById("orderMedia"),
    orderSummary: document.getElementById("orderSummary"),
    drawer: document.getElementById("orderDrawer"),
    drawerKicker: document.getElementById("drawerKicker"),
    drawerTitle: document.getElementById("drawerTitle"),
    drawerIntro: document.getElementById("drawerIntro"),
    drawerSummary: document.getElementById("drawerSummary"),
    drawerMode: document.getElementById("drawerMode"),
    drawerMailLink: document.getElementById("drawerMailLink"),
    drawerSubmit: document.getElementById("drawerSubmit"),
    orderForm: document.getElementById("orderForm"),
    fieldName: document.getElementById("fieldName"),
    fieldEmail: document.getElementById("fieldEmail"),
    fieldCity: document.getElementById("fieldCity"),
    fieldNotes: document.getElementById("fieldNotes"),
    mobileSummaryCopy: document.getElementById("mobileSummaryCopy"),
    structuredData: document.getElementById("structuredData"),
  };

  const state = {
    format: data.defaults.format,
    finish: data.defaults.finish,
    country: data.defaults.country,
  };

  let activeDrawerMode = "order";
  let sceneObserver;

  function getVariant() {
    return data.variants[state.format] || data.variants[data.defaults.format];
  }

  function getFinish() {
    return (
      data.finishSwatches.find((item) => item.slug === state.finish) ||
      data.finishSwatches[0]
    );
  }

  function getCountry() {
    return data.shippingZones[state.country] || data.shippingZones[data.defaults.country];
  }

  function formatPrice(value) {
    return `${priceFormatter.format(value)} EUR`;
  }

  function getPrice() {
    const variant = getVariant();
    const finish = getFinish();
    return variant.basePrice + (finish.priceDelta || 0);
  }

  function buildSrcSet(asset) {
    if (!asset.small) return asset.src;
    return `${asset.small} 768w, ${asset.src} ${asset.width}w`;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function mediaMarkup(media, options = {}) {
    const asset = data.assets[media.asset];
    const loading = options.loading || "lazy";
    const wash = options.wash || getFinish().wash;
    return `
      <figure class="visual-frame visual-frame--${media.ratio} visual-frame--wash" style="--media-position:${media.position}; --wash-color:${wash};">
        <img
          src="${asset.src}"
          srcset="${buildSrcSet(asset)}"
          sizes="${media.sizes}"
          width="${asset.width}"
          height="${asset.height}"
          alt="${escapeHtml(media.alt)}"
          loading="${loading}"
          decoding="async"
        />
        ${
          media.legend
            ? `<figcaption class="visual-frame__legend">${escapeHtml(media.legend)}</figcaption>`
            : ""
        }
      </figure>
    `;
  }

  function updateHeroMedia() {
    const variant = getVariant();
    const finish = getFinish();
    const assetKey =
      variant.slug === "horizontal"
        ? variant.hero.asset
        : finish.slug === "vert-gris" || finish.slug === "charbon-doux"
          ? finish.heroAsset
          : variant.hero.asset;
    const asset = data.assets[assetKey];
    const alt =
      variant.slug === "horizontal"
        ? "Cabinet Mura horizontal dans un interieur lumineux"
        : `Cabinet Mura vertical en finition ${finish.name.toLowerCase()} dans un interieur premium`;

    els.heroFrame.style.setProperty("--media-position", variant.hero.position);
    els.heroFrame.style.setProperty("--wash-color", finish.wash);
    els.heroImage.src = asset.src;
    els.heroImage.srcset = buildSrcSet(asset);
    els.heroImage.sizes = variant.hero.sizes;
    els.heroImage.width = asset.width;
    els.heroImage.height = asset.height;
    els.heroImage.alt = alt;
    els.heroLegend.textContent = `${variant.code} · format ${variant.label.toLowerCase()}`;

    els.heroMeta.innerHTML = [
      `${variant.dimensions}`,
      `${data.brand.productionLeadDays} jours ouvres de fabrication`,
      `A partir de ${formatPrice(getPrice())}`,
    ]
      .map((item) => `<span>${item}</span>`)
      .join("");
  }

  function getConfigureMedia() {
    const variant = getVariant();
    const finish = getFinish();

    if (variant.slug === "horizontal") {
      return {
        ...variant.configure,
        legend: `Lecture frontale · ${finish.name}`,
      };
    }

    let asset = "pieceVertical";
    let ratio = "portrait";
    let position = "51% 50%";

    if (finish.slug === "vert-gris") {
      asset = "useWinterGarden";
      position = "50% 50%";
    } else if (finish.slug === "charbon-doux") {
      asset = "darkSalon";
      position = "52% 50%";
    } else if (finish.slug === "ocre-doux") {
      asset = "useFamily";
      position = "58% 50%";
    } else if (finish.slug !== "ivoire-chaud") {
      asset = "finishesSamples";
      ratio = "landscape";
      position = "48% 54%";
    }

    return {
      asset,
      ratio,
      position,
      legend: asset === "finishesSamples" ? `Nuancier · ${finish.name}` : `Lecture ${finish.name.toLowerCase()}`,
      alt: `Cabinet Mura en finition ${finish.name.toLowerCase()}`,
      sizes: "(max-width: 960px) 100vw, 52vw",
    };
  }

  function getSceneEntries() {
    const variant = getVariant();
    const finish = getFinish();
    const configureMedia = getConfigureMedia();
    const secondSceneAsset =
      variant.slug === "horizontal" ? "formatHorizontal" : finish.sceneAsset || "useArchitecture";

    const thirdMedia =
      variant.slug === "horizontal"
        ? {
            asset: "formatHorizontal",
            ratio: "landscape",
            position: "50% 56%",
            legend: "Ligne basse · format horizontal",
            alt: "Cabinet Mura horizontal en situation",
            sizes: "(max-width: 960px) 100vw, 60vw",
          }
        : {
            asset: "useArchitecture",
            ratio: "portrait",
            position: "60% 50%",
            legend: "Habiter le mur",
            alt: "Cabinet Mura vertical contre un mur",
            sizes: "(max-width: 960px) 100vw, 60vw",
          };

    return [
      {
        index: "01",
        title: "Voir la silhouette",
        body: "La forme doit se comprendre d'un regard, sans angle inutile ni texte en trop.",
        media: {
          ...configureMedia,
          legend: configureMedia.legend,
        },
      },
      {
        index: "02",
        title: finish.name,
        body: finish.note,
        media: {
          asset: secondSceneAsset,
          ratio: secondSceneAsset === "formatHorizontal" ? "landscape" : "portrait",
          position:
            secondSceneAsset === "useWinterGarden"
              ? "50% 50%"
              : secondSceneAsset === "darkSalon"
                ? "52% 50%"
                : secondSceneAsset === "detailNiches"
                  ? "54% 48%"
                  : secondSceneAsset === "formatHorizontal"
                    ? "50% 56%"
                    : "52% 50%",
          legend: `Finition ${finish.name.toLowerCase()}`,
          alt: `Cabinet Mura en finition ${finish.name.toLowerCase()}`,
          sizes: "(max-width: 960px) 100vw, 60vw",
        },
      },
      {
        index: "03",
        title: variant.slug === "horizontal" ? "Dessiner une ligne basse" : "Habiter le mur",
        body: variant.usage,
        media: thirdMedia,
      },
      {
        index: "04",
        title: "Rester habitable",
        body: "L'objet garde une vraie presence, meme dans une piece vivante et deja meublee.",
        media: {
          asset: "useFamily",
          ratio: "portrait",
          position: "58% 50%",
          legend: "Interieur vivant",
          alt: "Cabinet Mura dans un interieur familial",
          sizes: "(max-width: 960px) 100vw, 60vw",
        },
      },
      {
        index: "05",
        title: "Lumiere et contraste",
        body: "La piece doit tenir autant dans une lumiere claire que dans une ambiance plus dense.",
        media: {
          asset: finish.slug === "charbon-doux" ? "darkSalon" : "useSeparation",
          ratio: "portrait",
          position: finish.slug === "charbon-doux" ? "52% 50%" : "50% 46%",
          legend: finish.slug === "charbon-doux" ? "Edition speciale" : "Separer sans fermer",
          alt: "Cabinet Mura dans un interieur contraste",
          sizes: "(max-width: 960px) 100vw, 60vw",
        },
      },
      {
        index: "06",
        title: "Surface et signature",
        body: "Grain fin, rayon doux, ligne nette. Le meuble se joue aussi dans le detail proche.",
        media: {
          asset: "detailTexture",
          ratio: "detail",
          position: "62% 54%",
          legend: "Detail de surface",
          alt: "Detail de la surface et de la signature du Cabinet Mura",
          sizes: "(max-width: 960px) 100vw, 58vw",
        },
      },
    ];
  }

  function updateBodyState() {
    const finish = getFinish();
    els.body.dataset.format = state.format;
    els.body.dataset.finish = state.finish;
    els.body.dataset.country = state.country;
    document.documentElement.style.setProperty("--accent-color", finish.color);
  }

  function renderFormatControls() {
    els.formatCurrent.textContent = getVariant().label;
    els.formatControls.innerHTML = Object.values(data.variants)
      .map(
        (variant) => `
          <button
            class="format-option ${variant.slug === state.format ? "is-active" : ""}"
            type="button"
            data-format="${variant.slug}"
            aria-pressed="${variant.slug === state.format}"
          >
            <div class="format-option__top">
              <div>
                <span class="format-option__label">${variant.label}</span>
                <span class="format-option__meta">${variant.dimensions}</span>
              </div>
              <img class="format-option__icon" src="${variant.silhouette}" alt="" aria-hidden="true" />
            </div>
            <span class="format-option__meta">${variant.usage}</span>
          </button>
        `
      )
      .join("");
  }

  function renderFinishControls() {
    const finish = getFinish();
    els.finishCurrent.textContent = finish.name;
    els.finishControls.innerHTML = data.finishSwatches
      .map(
        (item) => `
          <button
            class="finish-option ${item.slug === state.finish ? "is-active" : ""}"
            type="button"
            data-finish="${item.slug}"
            aria-pressed="${item.slug === state.finish}"
          >
            <span class="finish-option__dot" style="background:${item.color}"></span>
            <span>
              <span class="finish-option__name">${item.name}</span>
              <span class="finish-option__note">${item.note}</span>
            </span>
          </button>
        `
      )
      .join("");
  }

  function renderCountryControls() {
    const country = getCountry();
    els.countryCurrent.textContent = country.label;
    els.countryControls.innerHTML = Object.values(data.shippingZones)
      .map(
        (item) => `
          <button
            class="country-option ${item.code === state.country ? "is-active" : ""}"
            type="button"
            data-country="${item.code}"
            aria-pressed="${item.code === state.country}"
          >
            <span class="format-option__label">${item.label}</span>
            <span class="country-option__meta">${item.transit}</span>
            <span class="country-option__meta">${item.note}</span>
          </button>
        `
      )
      .join("");
  }

  function renderConfigure() {
    const variant = getVariant();
    const finish = getFinish();
    const country = getCountry();
    const price = formatPrice(getPrice());
    const configureMedia = getConfigureMedia();

    els.configureMedia.innerHTML = mediaMarkup(configureMedia, { wash: finish.wash });
    els.configureSummary.innerHTML = `
      <p class="summary-card__eyebrow">Configuration</p>
      <h3>${variant.name}</h3>
      <dl class="summary-list">
        <div>
          <dt>Dimensions</dt>
          <dd>${variant.dimensions}</dd>
        </div>
        <div>
          <dt>Finition</dt>
          <dd>${finish.name}</dd>
        </div>
        <div>
          <dt>Fabrication</dt>
          <dd>${data.brand.productionLeadDays} jours ouvres</dd>
        </div>
        <div>
          <dt>Livraison</dt>
          <dd>${country.label} · ${country.transit}</dd>
        </div>
      </dl>
      <p class="summary-card__price">A partir de ${price}</p>
    `;
  }

  function renderScenes() {
    const finish = getFinish();
    els.sceneStack.innerHTML = getSceneEntries()
      .map(
        (scene, index) => `
          <li class="scene-item ${index === 0 ? "is-active" : ""}" style="--index:${index}">
            <article class="scene-card">
              ${mediaMarkup(scene.media, { wash: finish.wash })}
              <div class="scene-card__copy">
                <span class="scene-card__index">${scene.index}</span>
                <h3>${scene.title}</h3>
                <p>${scene.body}</p>
              </div>
            </article>
          </li>
        `
      )
      .join("");

    if (sceneObserver) {
      sceneObserver.disconnect();
    }

    sceneObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-active", entry.isIntersecting);
        });
      },
      {
        threshold: 0.55,
      }
    );

    els.sceneStack.querySelectorAll(".scene-item").forEach((item) => {
      sceneObserver.observe(item);
    });
  }

  function renderProcess() {
    const variant = getVariant();
    const finish = getFinish();
    const country = getCountry();

    els.processFacts.innerHTML = `
      <div>
        <dt>Format</dt>
        <dd>${variant.label} · ${variant.dimensions}</dd>
      </div>
      <div>
        <dt>Fabrication</dt>
        <dd>${data.brand.productionLeadDays} jours ouvres avant expedition</dd>
      </div>
      <div>
        <dt>Livraison</dt>
        <dd>${country.label} · ${country.transit}</dd>
      </div>
      <div>
        <dt>Transport</dt>
        <dd>${country.note}</dd>
      </div>
    `;

    els.processSteps.innerHTML = data.processSteps
      .map((step) => `<li>${step}</li>`)
      .join("");

    els.processPrimaryMedia.innerHTML = mediaMarkup(
      {
        asset: "atelier",
        ratio: "portrait",
        position: "58% 50%",
        legend: "Atelier · mise en forme et controle",
        alt: `Cabinet Mura en atelier, finition ${finish.name.toLowerCase()}`,
        sizes: "(max-width: 960px) 100vw, 50vw",
      },
      { wash: finish.wash }
    );

    els.processSecondaryMedia.innerHTML = mediaMarkup(
      {
        asset: "installation",
        ratio: "portrait",
        position: "50% 54%",
        legend: `${country.label} · livraison verifiee`,
        alt: "Installation du Cabinet Mura dans un interieur",
        sizes: "(max-width: 960px) 100vw, 50vw",
      },
      { wash: finish.wash }
    );
  }

  function getOrderMedia() {
    const variant = getVariant();
    const finish = getFinish();
    if (variant.slug === "horizontal") {
      return variant.order;
    }
    if (finish.slug === "vert-gris") {
      return {
        asset: "useWinterGarden",
        ratio: "portrait",
        position: "50% 50%",
        legend: "Finition vert gris",
        alt: "Cabinet Mura dans un jardin d'hiver",
        sizes: "(max-width: 960px) 100vw, 50vw",
      };
    }
    if (finish.slug === "charbon-doux") {
      return {
        asset: "darkSalon",
        ratio: "portrait",
        position: "52% 50%",
        legend: "Edition speciale · charbon doux",
        alt: "Cabinet Mura dans un salon sombre",
        sizes: "(max-width: 960px) 100vw, 50vw",
      };
    }
    return variant.order;
  }

  function summaryMarkup() {
    const variant = getVariant();
    const finish = getFinish();
    const country = getCountry();
    return `
      <p class="summary-card__eyebrow">Recapitulatif</p>
      <h3>${variant.name}</h3>
      <dl>
        <div>
          <dt>Finition</dt>
          <dd>${finish.name}</dd>
        </div>
        <div>
          <dt>Pays</dt>
          <dd>${country.label}</dd>
        </div>
        <div>
          <dt>Fabrication</dt>
          <dd>${data.brand.productionLeadDays} jours ouvres</dd>
        </div>
        <div>
          <dt>Transit</dt>
          <dd>${country.transit}</dd>
        </div>
      </dl>
      <p class="summary-card__price">A partir de ${formatPrice(getPrice())}</p>
      <p class="order-note">Livraison en sus, sur devis, apres verification logistique.</p>
    `;
  }

  function renderOrder() {
    const variant = getVariant();
    const finish = getFinish();
    const country = getCountry();

    els.orderMedia.innerHTML = mediaMarkup(getOrderMedia(), { wash: finish.wash });
    els.orderSummary.innerHTML = summaryMarkup();
    els.mobileSummaryCopy.textContent = `${variant.label} · ${finish.name} · A partir de ${formatPrice(getPrice())}`;
    els.drawerSummary.innerHTML = summaryMarkup();
    els.drawerMailLink.textContent =
      activeDrawerMode === "sheet"
        ? "Ouvrir directement la demande de fiche"
        : activeDrawerMode === "project"
          ? "Ouvrir directement le message projet"
          : "Ouvrir directement le message";

    els.drawerSubmit.textContent =
      activeDrawerMode === "sheet"
        ? "Preparer la demande"
        : activeDrawerMode === "project"
          ? "Preparer le projet"
          : "Preparer la commande";

    const modeMeta = data.ctaModes[activeDrawerMode];
    els.drawerKicker.textContent = modeMeta.label;
    els.drawerTitle.textContent = modeMeta.title;
    els.drawerIntro.textContent = modeMeta.intro;
    els.drawerMode.value = activeDrawerMode;

    updateMailLink();

    els.heroMeta.setAttribute("data-country", country.label);
  }

  function renderStructuredData() {
    const variants = Object.values(data.variants);
    const finishes = data.finishSwatches;
    const shippingDetails = Object.values(data.shippingZones).map((zone) => ({
      "@type": "OfferShippingDetails",
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: zone.destination,
      },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: data.brand.productionLeadDays,
          maxValue: data.brand.productionLeadDays,
          unitCode: "DAY",
        },
      },
    }));

    const hasVariant = [];

    variants.forEach((variant) => {
      finishes.forEach((finish) => {
        hasVariant.push({
          "@type": "Product",
          name: `${data.brand.name} - ${variant.name} - ${finish.name}`,
          sku: `${variant.slug}-${finish.slug}`,
          color: finish.name,
          material: "Finition mate texturee a effet mineral",
          size: variant.dimensions,
          image: [new URL(data.assets[variant.configure.asset].src, window.location.href).href],
          offers: {
            "@type": "Offer",
            priceCurrency: "EUR",
            price: String(variant.basePrice + (finish.priceDelta || 0)),
            availability: "https://schema.org/PreOrder",
            url: new URL(
              `${window.location.pathname}?format=${variant.slug}&finish=${finish.slug}&country=BE`,
              window.location.href
            ).href,
            shippingDetails,
            hasMerchantReturnPolicy: {
              "@type": "MerchantReturnPolicy",
              url: new URL("./conditions-commande.html", window.location.href).href,
              applicableCountry: ["BE", "FR"],
              returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
            },
          },
        });
      });
    });

    const payload = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          name: data.brand.name,
          email: data.brand.email,
        },
        {
          "@type": "ProductGroup",
          name: "Cabinet Mura",
          brand: {
            "@type": "Brand",
            name: data.brand.name,
          },
          description:
            "Bibliotheque sculpturale sur commande, disponible en format vertical ou horizontal et en plusieurs finitions mates texturees.",
          variesBy: [
            "https://schema.org/color",
            "https://schema.org/size",
          ],
          hasVariant,
        },
      ],
    };

    els.structuredData.textContent = JSON.stringify(payload);
  }

  function syncUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set("format", state.format);
    url.searchParams.set("finish", state.finish);
    url.searchParams.set("country", state.country);
    window.history.replaceState({}, "", url);
  }

  function updateMailLink() {
    const variant = getVariant();
    const finish = getFinish();
    const country = getCountry();
    const mode = data.ctaModes[activeDrawerMode];
    const lines = [
      `${mode.subject}`,
      "",
      `Piece : ${variant.name}`,
      `Format : ${variant.dimensions}`,
      `Finition : ${finish.name}`,
      `Pays : ${country.label}`,
      `Fabrication : ${data.brand.productionLeadDays} jours ouvres`,
      `Transit : ${country.transit}`,
      `Prix de depart : ${formatPrice(getPrice())}`,
      "",
      `Nom : ${els.fieldName.value || ""}`,
      `Email : ${els.fieldEmail.value || ""}`,
      `Ville : ${els.fieldCity.value || ""}`,
      `Contexte : ${els.fieldNotes.value || ""}`,
    ].join("\n");

    const href = `mailto:${data.brand.email}?subject=${encodeURIComponent(
      mode.subject
    )}&body=${encodeURIComponent(lines)}`;

    els.drawerMailLink.href = href;
    return href;
  }

  function render() {
    updateBodyState();
    updateHeroMedia();
    renderFormatControls();
    renderFinishControls();
    renderCountryControls();
    renderConfigure();
    renderScenes();
    renderProcess();
    renderOrder();
    renderStructuredData();
    syncUrl();
  }

  function openDrawer(mode) {
    activeDrawerMode = mode in data.ctaModes ? mode : "order";
    renderOrder();
    els.drawer.hidden = false;
    window.requestAnimationFrame(() => {
      els.drawer.classList.add("is-open");
    });
    els.drawer.setAttribute("aria-hidden", "false");
    els.body.classList.add("has-drawer");
  }

  function closeDrawer() {
    els.drawer.classList.remove("is-open");
    els.drawer.setAttribute("aria-hidden", "true");
    els.body.classList.remove("has-drawer");
    window.setTimeout(() => {
      if (!els.drawer.classList.contains("is-open")) {
        els.drawer.hidden = true;
      }
    }, 220);
  }

  function setState(nextState) {
    Object.assign(state, nextState);
    render();
  }

  function loadFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const format = params.get("format");
    const finish = params.get("finish");
    const country = params.get("country");

    if (format && data.variants[format]) {
      state.format = format;
    }
    if (finish && data.finishSwatches.some((item) => item.slug === finish)) {
      state.finish = finish;
    }
    if (country && data.shippingZones[country]) {
      state.country = country;
    }
  }

  function wireHeader() {
    if (!els.headerMenu || !els.header || !els.siteNav) return;

    function closeMenu() {
      els.header.classList.remove("is-open");
      els.headerMenu.setAttribute("aria-expanded", "false");
    }

    els.headerMenu.addEventListener("click", () => {
      const next = !els.header.classList.contains("is-open");
      els.header.classList.toggle("is-open", next);
      els.headerMenu.setAttribute("aria-expanded", String(next));
    });

    els.siteNav.addEventListener("click", (event) => {
      if (event.target.closest('a[href^="#"]')) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 920) {
        closeMenu();
      }
    });
  }

  function wireEvents() {
    document.addEventListener("click", (event) => {
      const formatButton = event.target.closest("[data-format]");
      if (formatButton) {
        setState({ format: formatButton.dataset.format });
        return;
      }

      const finishButton = event.target.closest("[data-finish]");
      if (finishButton) {
        setState({ finish: finishButton.dataset.finish });
        return;
      }

      const countryButton = event.target.closest("[data-country]");
      if (countryButton) {
        setState({ country: countryButton.dataset.country });
        return;
      }

      const openButton = event.target.closest("[data-open-order]");
      if (openButton) {
        openDrawer(openButton.dataset.mode || "order");
        return;
      }

      if (event.target.closest("[data-close-drawer]")) {
        closeDrawer();
      }
    });

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        const target = href ? document.querySelector(href) : null;
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDrawer();
      }
    });

    ["input", "change"].forEach((eventName) => {
      els.orderForm.addEventListener(eventName, updateMailLink);
    });

    els.orderForm.addEventListener("submit", (event) => {
      event.preventDefault();
      window.location.href = updateMailLink();
    });
  }

  loadFromUrl();
  wireHeader();
  wireEvents();
  render();
})();
