# Journal de décisions

## D-001 — Autorité documentaire

Le fichier `docs/research/plan-maitre-final-isandre-taqa.md` est la source de
vérité produit, marque, média, commerce et marketing. Les deux cahiers corpus
en sont les sources de contrôle :

- `docs/research/cahier-images-luxe-corpus-200.md`
- `docs/research/cahier-marketing-externe-corpus-200.md`

En cas de conflit avec le runtime VIAIRE, le plan maître prévaut sous réserve
des blocages juridiques ou industriels explicitement documentés.

## D-002 — Architecture canonique

La migration introduit des modules `lib/isandre/*`. Le catalogue décide, les
services calculent et les composants rendent. `lib/rava-content.ts` ne doit
plus porter une vérité concurrente ; il deviendra au besoin une façade de
compatibilité temporaire puis sera supprimé.

## D-003 — Identifiants

| Ancien | Canonique |
|---|---|
| `elan-o1` | `seuil-01` |
| `portee-o2` | `portee-02` |
| `veille-o4` | `veille-03` |
| `plaster-rose` | `rose-clay` |

Les anciens identifiants restent acceptés uniquement aux frontières de
compatibilité : URLs historiques, panier local déjà stocké et anciens jobs de
projection.

## D-004 — Routes

Les routes canoniques sont :

- `/products/seuil-01`
- `/products/portee-02`
- `/products/veille-03`
- `/fr/produits/seuil-01`
- `/fr/produits/portee-02`
- `/fr/produits/veille-03`

Les routes historiques redirigent en 301 et conservent la query de finition
lorsqu'elle est normalisable.

## D-005 — Géométrie

SEUIL et PORTÉE utilisent les manifests actuellement approuvés, migrés vers les
nouveaux IDs sans altération des mesures ni des ouvertures. VEILLE reste
`blocked` jusqu'à validation fabricant de ses dimensions et coordonnées.

## D-006 — Allégations

ISANDRE, ṬĀQA, les noms produits et les claims d'origine restent des choix
créatifs soumis à clearance. Le runtime ne doit pas présenter comme preuve :

- une popularité non mesurée ;
- une presse non publiée ;
- une fabrication française non validée ;
- un atelier ou un artisan généré par IA ;
- une rareté artificielle.

## D-007 — Déploiement

Les vagues A0 à A3 sont locales. Aucun push, secret distant, changement Stripe,
DNS ou déploiement n'est effectué sans demande explicite.

## D-008 — Registre géométrique

`lib/isandre/geometry.data.json` est l’unique vérité métrique. Le module de
projection ne possède plus les dimensions et ne fait que consommer ce registre.
Les kits techniques versionnés sont régénérés sous les IDs canoniques et
contrôlés par `npm run projection:verify`.

## D-009 — Projection VEILLE

VEILLE reste commercialisable mais ne peut pas être simulée tant que H-005
n’est pas levé. L’API renvoie un statut 422 et l’interface explique le blocage
sans inventer une cote ni substituer un autre produit.

## D-010 — Identité A4 canonique

`lib/isandre/brand.ts` porte les tokens et spécifications utilisées par le
runtime. `scripts/generate-brand-assets.mjs` produit les masters et leurs copies
publiques ; `scripts/verify-brand-system.ts` interdit toute divergence de
checksum.

Le système retenu est :

- wordmark vectoriel `ISANDRE` autonome ;
- signe secondaire `L’ENTAILLE`, ratio `1:1,55` et retrait carré unique ;
- `ṬĀQA` pour l’éditorial, `TAQA` pour les systèmes techniques ;
- `Instrument Serif` pour le display et `Inter` pour l’interface, choix
  typographique remplacé par D-038 ;
- Encre, Chaux, Papier, Pierre, Terre d’ombre et Cobalt de passage.

La V1 et son monogramme en croix sont archivés. `L’ENTAILLE` n’est jamais une
arche, un motif répété, une photographie ou un effet.

## D-011 — Marque d’origine

La plaque canonique est un rectangle plein de `42,07 × 26,00 × 1,20 mm`, avec
micro-rayons de `0,8 mm`. Elle reste `prototype-required` jusqu’au passage des
portes physiques H-008. Les fichiers A4 ne portent pas `FRANCE`, car H-004
reste ouvert.

Les textes secondaires des fichiers de gravure restent éditables au stade
prototype. Le fournisseur retenu devra les vectoriser après validation de la
microtypographie à l’échelle 1:1.

## D-012 — Preuve et image

Les templates séparent explicitement deux statuts :

- une image générée peut créer le désir ;
- une photographie réelle crée la preuve.

Atelier, artisan, propriétaire, presse, origine et site de fabrication ne sont
jamais simulés comme preuve.

## D-013 — Plateforme matière A5

La voie industrielle primaire est le LLDPE rotomoulé teinté dans la masse.
Le GFRP avec finition minérale reste une solution de repli, activable seulement
si les portes matière, géométrie, coût ou qualité du LLDPE échouent.

Les valeurs `7 mm`, `8–15 GU` et `30–50 µm` sont des cibles de prototype,
jamais des propriétés commerciales acquises avant mesure et golden sample.

## D-014 — Séquence d’industrialisation

SEUIL est le prototype de référence. PORTÉE suit après validation des coupons,
du tronçon fonctionnel et des enseignements SEUIL. VEILLE reste hors RFQ chiffré
et hors production tant que H-005 n’est pas levé.

## D-015 — Coût rendu et emballage

La décision fournisseur se prend sur le coût rendu complet et les portes
physiques, pas sur le prix départ usine seul. Le produit et son emballage sont
un même système de validation. Les budgets du classeur A5 restent marqués
`PLANNING` tant qu’ils ne sont pas remplacés par des devis et hypothèses
finance approuvés.

## D-016 — Signature photographique pilote

Les directions A affinée pour SEUIL Craie et C pour PORTÉE Sauge deviennent les
recettes pilotes A6. Elles combinent produit entier, perspective architecturale
naturelle, matière mate peau d’œuf, objets crédibles et absence de collage 3D.

Les pilotes restent hors `public/` jusqu’à la production et aux contrôles A7.

## D-017 — Statut visuel de VEILLE

La direction C affinée fixe l’intention émotionnelle de VEILLE Argile rose,
mais reste `concept-blocked`. Elle ne valide ni dimension, ni rapport de face,
ni projection, ni média commerce tant que H-005 n’est pas levé.

## D-018 — Désir et preuve

Les images générées peuvent produire du désir et préparer le commerce. Elles ne
prouvent jamais un atelier, un artisan, un client, une origine, un prototype,
un contrôle, un emballage ou une publication. Ces preuves restent
photographiques, datées et assorties de droits.

## D-019 — Registre média canonique

Les médias publiables sont adressés uniquement par
`public/isandre/media/manifest.json`. `C01` porte le commerce et `D01` le
désir. Une même image ne peut plus remplir plusieurs rôles éditoriaux.

Le runtime lit des chemins déclarés par `lib/isandre/media.ts` et ne
reconstruit aucun chemin VIAIRE, RAVA ou MURA.

## D-020 — Art direction mobile

Un master mobile dédié est obligatoire lorsqu’un master horizontal ne peut pas
montrer le produit entier dans un écran vertical. Le letterboxing, le crop de
silhouette et l’étirement sont interdits.

SEUIL et PORTÉE disposent de huit masters mobiles dédiés. Les masters VEILLE
sont déjà au rapport `4:5`.

## D-021 — Absence honnête

Une famille média manquante reste absente. Une scène de désir ne peut pas être
recadrée et présentée comme macro matière, vue arrière, preuve d’atelier ou
preuve de fabrication. La confiance prévaut sur le remplissage visuel.

## D-022 — Échelle démontrée, jamais suggérée

Une vue d’échelle n’est admise que si son repère est cohérent avec les
dimensions canoniques et la perspective. Deux essais SEUIL avec personne ont
été rejetés. Les vues P04 utilisent à ce stade des repères architecturaux ou
du mobilier standard, sans transformer ces objets en instruments de mesure.

PORTÉE conserve exactement huit ouvertures. Les recettes canoniques reprennent
le registre géométrique et non une formulation exploratoire de prompt.

## D-023 — Sélection storefront et acquisition

La production média et la sélection affichée sont deux projections distinctes.
Le storefront retient `20/20/19` masters pour SEUIL, PORTÉE et VEILLE, tandis
que les scènes fonctionnelles D04 servent l’acquisition et les tests sociaux.
Une PDP ne rend que `10–12` médias ordonnés par rôle.

## D-024 — Frontière des preuves physiques

Le corpus A7 contient `71` masters numériques et `1 136` dérivés. Les douze
scènes D04 sont autorisées pour l'acquisition, mais restent hors sélection PDP
automatique.

Les macros `M01–M03`, l'atelier, l'artisan, le contrôle, l'emballage et
l'installation réelle ne sont jamais synthétisés pour combler une absence.
Leur protocole est livré, mais leur publication exige les portes H-006, H-009
et H-010. Une absence explicite est plus crédible qu'une fausse preuve.

## D-025 — Deck éditorial canonique

`content/en.ts` et `content/fr.ts` deviennent la source unique des promesses,
libellés commerce, états de projection, messages de service, emails, contenus
presse et glossaire. Les clés techniques restent identiques entre langues ;
seules leurs valeurs sont localisées.

Le catalogue et les composants rendent ce contrat. Ils ne maintiennent plus
leurs propres tableaux de slogans ou de libellés de placement. Toute nouvelle
chaîne publique structurante doit être ajoutée aux deux decks et passer
`npm run content:verify`.

## D-026 — Storefront court et recette isolée

La home est limitée à quatre blocs : commerce, collection, scènes d’usage,
preuve et service. Les finitions et la projection ne deviennent plus des
sections autonomes ; elles restent au plus près de la décision d’achat.

Les médias affichés proviennent exclusivement du registre A7. D04 reste
réservé à l’acquisition et aucune scène de désir ne remplace une preuve
physique absente.

La recette de production locale utilise `.next-qa`. Un serveur `next dev`
peut ainsi rester actif dans `.next` sans altérer les manifests du build
validé. Les commandes canoniques sont `npm run build:qa` et
`npm run start:qa`.

## D-027 — Une seule PDP, trois zones

Les routes produit EN/FR rendent un template commun composé de commerce,
preuve et service. Le `BuyPanel`, le catalogue, les marchés et le panier
restent les sources partagées avec la home.

Le rôle du média détermine son cadrage. Une scène peut remplir son cadre ; un
packshot ou une preuve géométrique doit rester entier. VEILLE ne rend pas sa
planche dimensionnelle P03 tant que H-005 n’est pas levé : P04 montre seulement
un contexte d’usage et le texte conserve le statut de validation.

## D-028 — Catalogue serveur et marchés staged

Le navigateur ne possède jamais la vérité monétaire. Il transmet des
identifiants strictement validés ; le serveur relit le catalogue, applique la
grille marché et crée Stripe Checkout. Tout montant ou champ non prévu est
rejeté.

Les trente marchés décrivent une capacité de configuration. Leur présence dans
le registre ne vaut ni ouverture commerciale, ni conformité fiscale, ni
promesse logistique. L'activation live reste conditionnée par H-011 à H-013.

Chaque intention de checkout reçoit un UUID d'idempotence. Une annulation
conserve le panier ; seul un paiement vérifié côté serveur autorise sa purge.

## D-029 — Une référence, un clic, un edit

La projection publique n'utilise ni maillage 3D injecté dans la photo, ni
pipeline de reconstruction visuelle en plusieurs passes. La géométrie reste un
manifeste de dimensions et d'identité ; l'expérience utilise la photo complète,
un point d'ancrage, le ratio canonique et une photographie officielle unique.

Le modèle image produit une photographie cohérente en un edit. Toute relance
supprime le job précédent. VEILLE reste désactivée jusqu'à H-005 et l'ouverture
publique du service reste conditionnée par H-015.

## D-030 — Une commande n'est pas un email

Stripe prouve le paiement, le domaine `orders` projette la commande, Supabase
la conserve et Resend communique. Le webhook revendique chaque événement avant
traitement, persiste la commande, envoie avec des clés idempotentes puis marque
l'événement terminé.

Le stockage mémoire est réservé au développement et la production échoue
explicitement sans adaptateur durable. Les relances de panier restent
désactivées tant que le consentement et H-017 ne sont pas validés.

## D-031 — Le passeport suit la pièce réelle

Le numéro de série est créé par un registre serveur canonique après fabrication,
jamais par le navigateur. Le passeport public expose uniquement l’identité de
la pièce et l’historique de service publiable ; aucune donnée propriétaire ne
quitte le domaine authentifié.

La route NFC est stable, mais aucune activation fictive ne compense l’absence
de puce, d’identité ou de preuve de propriété. L’espace propriétaire reste
fermé jusqu’aux validations H-008, H-016 et H-018.

## D-032 — Configuré ne veut pas dire publié

Le catalogue, les prix et Stripe test peuvent être entièrement recettés sans
créer une offre publique. `CATALOG_RELEASED` est une porte supplémentaire ; un
produit doit aussi être juridiquement, géométriquement et visuellement libéré
avant d’exposer `Offer`, Merchant Center, sitemap commercial ou checkout live.

La mesure first-party reste disponible pour la recette. Toute destination
analytics ou publicitaire est opt-in et dépend d’un consentement vérifiable.

## D-033 — La distribution amplifie une preuve acquise

Le lancement ne commence ni par la publicité, ni par une déclaration de
popularité. Il commence par une silhouette stable, un produit livrable, deux
installations réelles, des droits exploitables et une histoire que les usages
peuvent confirmer.

Les outils presse, trade et campagne sont préparés avant ces preuves pour
réduire le délai d’exécution. Leur existence ne vaut pas autorisation de
diffusion. Chaque asset conserve son origine, son statut et sa porte.

## D-034 — Le bundle validé reste privé jusqu'aux preuves

La qualité technique locale ne lève aucune porte juridique, industrielle,
visuelle, fiscale ou logistique. Tant que les blocages H-001 à H-020 concernés
ne sont pas clos, `CATALOG_RELEASED=false` reste la position canonique :

- aucune `Offer` n'est exposée dans les données structurées ;
- Merchant Center reste indisponible ;
- le sitemap commercial reste vide ;
- `robots.txt` bloque l'indexation ;
- le checkout de production n'est pas présenté comme ouvert.

La recette de paiement mobile privilégie le bouton `Buy now` vers Stripe
Checkout hébergé. Les boutons Express Checkout inline ne sont montés qu'à
partir de `768px`, car leur iframe masquait la barre d'achat compacte sur les
petits écrans. Stripe conserve les wallets éligibles dans son checkout
hébergé.

## D-035 — Langue explicite et performance par intention

La racine `/` est toujours anglaise (`en-GB`) et `/fr` toujours française
(`fr-FR`). La préférence du navigateur ne provoque plus de redirection
automatique ; elle ne doit pas modifier la route, le canonical ou la langue
primaire. Le pays peut rester détecté pour proposer marché, devise et
livraison, avec contrôle explicite par le visiteur.

Les variantes ne sont plus préchargées en masse au chargement initial. Le hero
LCP est prioritaire ; les autres finitions ne sont préchargées qu'après une
intention mesurable (`pointer`, focus ou sélection). Le navigateur choisit
alors le dérivé AVIF adapté au viewport. Une image visible ne disparaît jamais
avant le décodage de sa remplaçante.

## D-036 — Conception française, fabrication italienne

La direction commerciale validée par le porteur de projet est désormais :

- collection conçue en France ;
- fabrication sur commande en Italie ;
- expédition depuis le site de fabrication ou le hub italien à confirmer.

Cette décision remplace toute formulation qui suggère une fabrication
française. Elle autorise les textes `Designed in France. Made to order in
Italy.` et `Dessiné en France. Fabriqué sur commande en Italie.` dans les
supports de préproduction.

Elle ne remplace pas les documents fournisseur, l'identification de
l'établissement, la traçabilité matière, les obligations d'étiquetage ou les
preuves d'origine nécessaires avant publication commerciale définitive. La
porte H-004 devient une porte de substantiation de la chaîne France/Italie, et
non une recherche de qualification `Made in France`.

## D-037 — Visualiser la préproduction sans inventer une preuve

Des scènes d'atelier générées peuvent expliquer le procédé envisagé et soutenir
un deck investisseur ou une page de préproduction à condition de porter la
mention explicite `Pre-production visualisation` ou `Visualisation de
préproduction`.

Elles n'ouvrent pas H-006 et ne sont jamais légendées comme photographie du
fabricant, de l'artisan, du prototype ou du contrôle réel. Les scènes suivent le
protocole `docs/media/preproduction-workshop-visualization-protocol.md`, les
dimensions canoniques et la chaîne réelle du rotomoulage. Toute preuve publique
de fabrication reste une photographie réelle, datée et assortie de droits.

## D-038 — Retour à la tension éditoriale du storefront public

La comparaison avec le storefront public antérieur confirme une meilleure
tension entre une serif de mode contrastée et une sans sobre. Le système courant
adopte donc :

- `Bodoni Moda` pour les titres éditoriaux ;
- `Manrope` pour l'interface, les textes, prix et références ;
- le wordmark vectoriel ISANDRE reste indépendant de toute police.

Ce changement remplace `Instrument Serif / Inter` sans réintroduire la structure,
les couleurs ou les composants de l'ancien site.
