# Registre des blocages

## Blocages humains

| ID | Blocage | Impact | Action humaine exacte | Preuve de déblocage |
|---|---|---|---|---|
| H-001 | Clearance ISANDRE | Publication de la marque | Recherche juridique classes 20 et 35 dans les territoires cibles | Rapport signé ou avis du conseil |
| H-002 | Clearance ṬĀQA / TAQA | Publication de la collection ; une collection de luminaires design `Taqa` existe déjà | Recherche juridique et validation linguistique/culturelle | Avis juridique et linguistique archivés |
| H-003 | Noms SEUIL, PORTÉE, VEILLE | Publication commerciale | Clearance marques et usages dans les marchés prioritaires | Rapport de disponibilité |
| H-004 | Chaîne France / Italie | Publication définitive de `Designed in France. Made to order in Italy.` | Archiver l’identité du fabricant italien, les contrats, factures, lots matière et dossiers de production correspondant aux commandes | Dossier fournisseur et traçabilité par commande |
| H-005 | Géométrie VEILLE | Fiche cotée et projection exacte | Fournir plan fabricant avec dimensions, rayons et ouvertures | Plan versionné approuvé |
| H-006 | Atelier réel | Preuve de fabrication | Produire des photographies réelles avec droits d'usage | Fichiers maîtres, releases et métadonnées |
| H-007 | Domaine final | Emails, canonicals et paiement | Acheter et valider le domaine retenu | DNS et propriété vérifiés |
| H-008 | Plaque et NFC | Libération en production de la Marque d’origine | Imprimer à 1:1, graver trois profondeurs, fabriquer le prototype bronze, tester fixation/abrasion et lecture NFC sur cinq téléphones | Rapport physique signé, mesures et photos macro |
| H-009 | Validation industrielle A5 | Lancement production, claims matière, coûts et marges | Lancer RFQ, coupons, tronçon 640 mm, prototype SEUIL, laboratoire, essais emballage et golden sample | Dossier fournisseur signé, rapports de laboratoire, devis rendus et golden sample approuvé |
| H-010 | Libération des médias A6/A7 | Publication des couleurs et matière comme représentation fidèle | Comparer les sélections aux coupons/golden sample et obtenir une seconde validation plein écran indépendante | Rapport signé, mesures colorimétriques et liste des assets libérés |
| H-011 | Configuration Stripe Tax | Calcul fiscal live | Valider le siège dans Stripe, ajouter les immatriculations réellement détenues et tester le calcul dans chaque zone activée | Capture des réglages Stripe, Tax registrations actives et sessions tests conformes |
| H-012 | Transport et politique import | Activation des 30 marchés | Obtenir les tarifs rendus par produit/destination et décider DDP/DAP, retours et avaries | Grille transporteur signée, conditions de vente et tests d'étiquette |
| H-013 | Paiements live | Apple Pay, Google Pay, PayPal et Klarna en production | Vérifier le compte Stripe, le domaine et activer les méthodes éligibles par marché | Tableau Stripe live, domaine vérifié et transactions réelles de faible montant |
| H-014 | Email transactionnel | Confirmations client depuis le domaine de marque | Vérifier le domaine d'envoi et fournir `RESEND_API_KEY`, `RESEND_FROM`, `ORDER_NOTIFICATION_EMAIL` | DNS validé et emails de recette reçus sur au moins deux fournisseurs |
| H-015 | Recette projection réelle | Ouverture publique de `View in your room` | Financer et exécuter la matrice 2 produits × 4 finitions × 12 pièces, puis valider les résultats selon le protocole A12 | Rapport de recette, taux de réussite, exemples acceptés/rejetés et budget API confirmé |
| H-016 | Stockage commandes Supabase | Persistance de production et journal d'audit | Créer le projet cible, appliquer la migration A13 et fournir `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` au runtime serveur | Commande test persistée, replay webhook idempotent et sauvegarde vérifiée |
| H-017 | Politique retours et données | Publication des CGV, confidentialité et relances | Faire valider les règles par marché, les durées et le consentement marketing | Textes juridiques approuvés, versions datées et mécanisme de consentement audité |
| H-018 | Identité et transfert des passeports | Activation de l’espace propriétaire, récupération et cession | Valider le fournisseur d’identité, les preuves de propriété, le protocole de récupération et la politique de transfert | Recette authentifiée avec activation, récupération, transfert accepté et journal d’audit |
| H-019 | Consentement et mesure | Activation de GA4, pixels publicitaires et audiences | Choisir un CMP conforme par marché, faire valider le plan de consentement et connecter les destinations uniquement après accord | Audit CMP, consent mode et tests montrant zéro requête tierce avant consentement |
| H-020 | Publication Search et Merchant | Indexation, feed produit et campagnes Shopping | Lever les clearances, valider domaine/Search Console/Merchant Center, contrôler les droits et métadonnées des images puis activer `CATALOG_RELEASED=true` | Rich Results Test, feed sans erreur, domaine vérifié et crawl de recette |
| H-021 | Relecture éditoriale native | Publication définitive des textes anglais et français | Faire relire le corpus A8 par un rédacteur natif anglais et un relecteur français, sans réintroduire d'allégation non prouvée | Rapport de relecture versionné, corrections intégrées et approbation signée |

Une société française active nommée `ISANDRE` a également été repérée lors de
la recherche préliminaire. Son activité déclarée diffère, mais H-001 reste un
blocage de publication tant que les droits antérieurs et usages ne sont pas
analysés professionnellement.

## Blocages non bloquants pour les vagues locales

Les migrations de types, IDs, contenus, routes et géométries validées peuvent
être exécutées sans résoudre H-001 à H-010. Les éléments non validés portent un
statut explicite et ne deviennent pas des allégations publiques fermes.

## Problèmes techniques connus

- VEILLE reste hors projection et ses preuves P02/M01–M03 restent bloquées
  jusqu'à H-005, H-009 et H-010.
- Les emails, taxes, transport et moyens de paiement de production restent
  conditionnés par la configuration distante et les validations humaines.
- Les pages publiques de passeport restent non indexées et l’espace
  propriétaire désactivé tant que H-008, H-016 et H-018 ne sont pas levés.
- L’indexation, les offres structurées, le feed et les destinations analytics
  restent fermés tant que les portes de publication H-001 à H-004, H-009,
  H-010, H-019 et H-020 ne sont pas levées.
