# Plan : contenu dynamique, console d'admin, backend NestJS

Statut : proposition, rien n'est implémenté. Ce document sert de référence pour cadrer le travail avant de commencer, et de checklist pendant l'implémentation.

Versions vérifiées sur le registre npm le 30/09/2026 (pas de mémoire d'entraînement) : NestJS `12.1.2` (CLI `12.0.8`, requiert Node ≥20 — le projet tourne déjà en Node 24.17), TypeORM `1.1.1`, `@nestjs/config` `12.0.1`, `@nestjs/jwt` `12.0.2`, `@nestjs/passport` `12.0.0`, `@nestjs/throttler` `6.7.1`, `class-validator` `0.15.1`, `helmet` `8.3.0`.

## 1. Périmètre

### Contenu à rendre dynamique (géré depuis l'admin)
- **Profil** : bio (actuellement des paragraphes en dur dans `profile.component.html`), savoir-être (`softSkillsObject`), lien CV.
- **Expériences** (`experiences.const.ts`) : 5 entrées, chacune avec entreprise, rôle, période (texte libre, ex. "Oct 2020", "Mai 2020 - Juin 2020" — pas de dates structurées), statut (texte libre), compétences par catégorie, réalisations (liste de textes).
- **Compétences** (`skills.component.ts`) : 6 catégories (front/back/ux-ui/dev-ops/tools/quality), chacune un dictionnaire nom → niveau (`✓`/`~`), `qualityObject` a en plus un sous-objet `tests`.
- **Projets** (`projets.const.ts`) : 12 entrées, chacune avec id, date, nom, entreprise (enum `Company`), catégorie (enum `ProjectCategory`), type (enum `ProjectType`), statut (enum `ProjectStatus`), description, tags de compétences (enum `Skill`, un catalogue plat partagé par tout le site), liens (label + url ; un lien "Preview" pointe vers une clé `ImageAssets` interne plutôt qu'une vraie URL — à nettoyer, voir §4.3).
- **Contact** (`constact.const.ts`) : site, email, linkedin.
- **Images de preview des projets** (`src/assets/images/*`, `ImageAssetsMap`).

### Explicitement hors périmètre
- Les mini-jeux (Snake, Tic-tac-toe, 2048) : ce sont des fonctionnalités, pas du contenu éditorial.
- La structure de navigation (explorer, tabs, menus) : de la UI, pas du contenu.
- Le multi-langue : `fallbackLang: 'fr'` et un seul fichier `fr.json` existent déjà ; les rendre dynamiques est un chantier séparé, mentionné en piste d'extension (§8) mais pas dans les phases 1 à 5.
- Le multi-admin / gestion de rôles : un seul compte admin (le propriétaire du site) suffit au départ. Prévu extensible, pas construit dès le jour 1.

## 2. Décisions à valider avant de commencer

Ce sont des choix qui changent la suite du plan — à trancher explicitement, pas par défaut implicite.

1. **Stratégie de rendu du site public** (voir §5.3) :
   - (a) *rebuild au publish* — on garde le prerendering SSG actuel, l'admin déclenche un rebuild+déploiement à chaque publication ;
   - (b) *fetch live* — le site public appelle l'API à l'exécution, plus de prerendering de contenu.
   Recommandation : (a), pour ne pas perdre le travail SSR/SEO déjà fait ce jour.
2. **Topologie de l'admin** (voir §6.1) :
   - (a) route `/admin` intégrée à l'app Angular existante, rendue uniquement côté client ;
   - (b) application Angular séparée.
   Recommandation : (a), vu l'échelle (un seul admin, peu d'écrans).
3. **Stockage** : PostgreSQL managé (Neon/Supabase/Railway, tous ont un plan gratuit) vs SQLite. Recommandation : PostgreSQL dès le départ — un SQLite sur disque perd ses données à chaque redéploiement sur la plupart des hébergeurs sans volume persistant configuré.
4. **Stockage des images uploadées** : disque du serveur (simple, mais lié à l'hébergeur) vs bucket S3-compatible (Cloudflare R2, Backblaze B2 — portable, découplé du serveur). Recommandation : bucket S3-compatible dès le départ, migration plus dure à faire après coup.
5. **Modèle de compétences** : garder tel quel (3 représentations parallèles : enum `Skill` pour les projets, tableaux texte libre dans les expériences, dictionnaires dans Skills) vs unifier en une seule entité `Skill` référencée partout. Recommandation : unifier (§4.2) — construire un nouveau système en reconduisant une duplication existante n'a pas de sens.
6. **ORM** : TypeORM `1.x` (première version stable majeure depuis 5 ans, cf. intro) vs Prisma (son tag `latest` pointe actuellement sur un `8.0.0-rc`, pas une version stable — à éviter pour l'instant si le critère est "stable") vs Drizzle (`0.45.3`, léger, bon support TypeScript). Recommandation : TypeORM, intégration native avec NestJS (`@nestjs/typeorm`), l'équipe vient de livrer une vraie version stable majeure.

## 3. Vue d'ensemble de l'architecture cible

```
PFO-2025/                    (dépôt actuel, front Angular, reste statique/prerenderé)
PFO-2025-api/                (nouveau dépôt séparé — cycle de déploiement indépendant)
  ├── src/
  │   ├── modules/
  │   │   ├── auth/          JWT, guard, login
  │   │   ├── profile/       singleton
  │   │   ├── experiences/   CRUD
  │   │   ├── projects/      CRUD
  │   │   ├── skills/        CRUD (catégories + niveau)
  │   │   ├── contact/       singleton
  │   │   └── media/         upload images (S3-compatible)
  │   ├── common/            guards, interceptors, filters partagés
  │   └── main.ts
  ├── test/                  e2e (Vitest + supertest)
  └── .github/workflows/ci.yml
```

Pourquoi un dépôt séparé plutôt qu'un monorepo : le front est 100% statique et n'a besoin d'aucun serveur Node pour tourner (travail fait cette session) ; coupler son cycle de déploiement à celui d'une API qui, elle, tourne en continu, romprait cette propriété pour rien. Un monorepo (Nx) reste une option si la coordination entre les deux devient pénible, mais ce n'est pas le point de départ le plus simple.

## 4. Backend NestJS

### 4.1 Stack

- NestJS `12.x`, ESM (nouveau défaut de la CLI en v12 — tous les packages officiels sont passés en ESM, cf. migration vers `withFetch()` déjà faite côté Angular pour une raison similaire).
- Vitest pour les tests (nouveau défaut NestJS 12 pour les projets ESM ; cohérent avec le choix déjà fait côté Angular cette session).
- TypeORM `1.x` + PostgreSQL, migrations versionnées (jamais `synchronize: true` en production).
- `@nestjs/swagger` : documentation OpenAPI générée automatiquement, exposée en dev (`/api/docs`), effort minime pour un gain réel (explorateur d'API testable sans outil externe).
- Validation : DTOs + `class-validator`/`class-transformer` (classique, éprouvé) — NestJS 12 permet aussi de valider avec des schémas Zod/Valibot via le support *Standard Schema* dans `@Body`/`@Query`/`@Param`, si préféré. Pas de différence fonctionnelle notable à cette échelle ; `class-validator` reste le choix par défaut le plus documenté.
- Sécurité : `helmet`, `@nestjs/throttler` (limite de tentatives sur `/auth/login`), CORS restreint à l'origine du site public + `localhost` en dev.
- Mots de passe : `argon2` (recommandation actuelle, plus robuste que bcrypt face au GPU-cracking).

### 4.2 Modèle de données

Entités proposées (schéma "unifié", cf. décision §2.5) :

| Entité | Champs clés | Notes |
|---|---|---|
| `AdminUser` | id, email, passwordHash, createdAt | un seul enregistrement au départ, table prête pour en accueillir d'autres |
| `Skill` | id, name, slug | catalogue unique ; remplace l'enum `Skill` + les tableaux texte libre des expériences + les clés des dictionnaires de `SkillsComponent` |
| `SkillCategory` | id, key (`front_end`/`back_end`/`ux_ui`/`dev_ops`/`tools`/`quality`), label | remplace les 6 signaux séparés de `SkillsComponent` |
| `SkillLevel` (table de jointure) | skillId, categoryId, level (enum `✓`/`~`/`✗`), order | le niveau n'a de sens que dans le contexte "page Compétences" |
| `Profile` | id (singleton), name, title, bioParagraphs (jsonb), cvUrl | |
| `SoftSkill` | id, profileId, label | ou simplement `softSkills: string[]` en colonne jsonb sur `Profile` — plus simple, suffisant vu le volume actuel (6 entrées) |
| `Experience` | id, slug, company, role, periodLabel (texte libre, comme aujourd'hui), status, order, published | |
| `ExperienceSkill` (jointure) | experienceId, skillId, categoryId | remplace `skills: {front_end: [...], ...}` |
| `Achievement` | id, experienceId, text, order | remplace `achievements: string[]` |
| `Project` | id, date (texte libre, comme aujourd'hui — les dates existantes ne sont pas toutes des années pleines, ex. "2020 - 2025"), name, company, category (enum), type (enum), status (enum), description, order, published | |
| `ProjectSkill` (jointure) | projectId, skillId | remplace `Project.skills: Skill[]` |
| `ProjectLink` | id, projectId, label, url | liens externes réels uniquement |
| `Media` | id, filename, url, altText, projectId (nullable) | upload d'images ; `Project.previewImageId` en clé étrangère remplace le lien "Preview" qui pointait vers une clé `ImageAssets` interne — nettoyage du contournement actuel |
| `ContactInfo` | id (singleton), site, email, linkedin | |

Les enums `Company`, `ProjectCategory`, `ProjectType`, `ProjectStatus` (texte fixe, peu de valeurs, changent rarement) restent des enums TypeScript/PostgreSQL plutôt que des tables — pas de bénéfice à les rendre éditables depuis l'admin pour l'instant.

Migration à risque le plus faible : garder les 3 représentations de compétences séparées (un `skills: jsonb` par expérience, un enum `Skill` pour les projets, 6 tables `SkillCategory` indépendantes) — plus rapide à construire, mais reconduit la duplication actuelle. À confirmer selon l'appétit pour le nettoyage vs la vitesse de livraison.

### 4.3 Surface API

| Méthode | Route | Auth | Usage |
|---|---|---|---|
| GET | `/api/v1/profile` | non | site public |
| GET | `/api/v1/experiences` | non | site public |
| GET | `/api/v1/skills` | non | site public |
| GET | `/api/v1/projects` | non | site public |
| GET | `/api/v1/projects/:id` | non | site public |
| GET | `/api/v1/contact` | non | site public |
| POST | `/api/v1/auth/login` | non (mais rate-limited) | admin |
| POST/PUT/DELETE | `/api/v1/admin/{profile,experiences,skills,projects,contact}` | JWT | admin |
| POST | `/api/v1/admin/media` | JWT | upload (multipart, multer) |
| POST | `/api/v1/admin/publish` | JWT | déclenche le rebuild du front (§5.3, option a) |

Les routes publiques ne renvoient que les entrées `published: true`, dans l'ordre (`order`).

### 4.4 Auth

Un seul identifiant admin, créé via variables d'environnement au premier démarrage (pas d'inscription ouverte). JWT dans un cookie `httpOnly`, `secure`, `sameSite=strict` — préféré à un token en `localStorage` (évite le vol par XSS). Durée de vie courte (1h) avec renouvellement silencieux tant que le cookie est valide ; pas de refresh token séparé pour ce volume d'usage (un seul utilisateur, faible fréquence de connexion) — complexité à ajouter plus tard seulement si un besoin réel apparaît.

### 4.5 Script de seed / migration des données existantes

Avant tout, un script (`scripts/seed-from-consts.ts`, exécuté une fois) qui importe directement les fichiers `*.const.ts` actuels du front et insère leur contenu en base — garantit zéro perte/retape de contenu au passage en dynamique. Il tourne contre la structure définie en §4.2, donc écrit après que le modèle soit figé.

### 4.6 Tests

Vitest partout (cohérence avec le front) : tests unitaires par service (logique métier, validation), tests e2e par contrôleur (supertest contre une base de test dédiée, pas la base de prod). CI : lint, build, tests, sur chaque push/PR — même schéma que `.github/workflows/ci.yml` côté front.

## 5. Intégration côté Angular

### 5.1 Remplacement des données en dur

Chaque composant qui importe aujourd'hui un `*.const.ts` (Works, Skills, Projects, Contact, Profile) passe à un appel `httpResource()`/`rxResource()` — stables depuis Angular 22 (identifié dans la revue de l'écosystème plus tôt cette session comme "disponible, pas encore utile" ; ça devient le cas d'usage exact). Ex. :

```ts
protected readonly projects = httpResource<Project[]>(() => '/api/v1/projects');
```

Remplace le tableau `Projects` importé statiquement ; le template change peu (`projects()` au lieu de `Projects`), `httpResource` expose nativement `isLoading()`/`error()` pour les états de chargement.

### 5.2 Un point d'attention : `JsonCardComponent`

Son entrée est déjà typée `object` avec narrowing au runtime sur `type`/`links` (fait cette session, cf. commit `059a556`) — elle acceptera les objets renvoyés par l'API sans changement, à condition que la forme JSON (`links: {label, url}[]`) reste compatible. Les données renvoyées par `/api/v1/projects/:id` doivent donc respecter cette forme exacte pour les liens.

### 5.3 Stratégie de rendu (décision §2.1)

**Option a — rebuild au publish (recommandée)** : le prerendering SSG mis en place cette session (`ng build`, 21 routes statiques) reste la source du site public. À chaque publication depuis l'admin, le backend déclenche le déploiement (`POST /api/v1/admin/publish` → appelle l'API GitHub Actions `workflow_dispatch` sur le dépôt front, ou un webhook du même style côté l'hébergeur choisi). Le site reste aussi rapide et aussi bien référencé qu'aujourd'hui ; contrepartie : un délai de quelques dizaines de secondes à quelques minutes entre "publier" et "visible en ligne", et une dépendance cachée entre les deux dépôts (le webhook).

**Option b — fetch live** : les pages publiques appellent l'API à l'exécution (comme une SPA classique), plus de prerendering de contenu (`app.routes.server.ts` peut toujours prerenderer la coquille de page, mais pas le contenu). Changement visible immédiat, mais retour à un état "vide pour les robots qui n'exécutent pas JS" partiellement — sauf à ajouter une couche de cache HTTP côté CDN pour amortir.

Un entre-deux existe (regénérer uniquement à la demande, façon ISR) mais demande une infrastructure de cache/révalidation que `@angular/ssr` ne fournit pas nativement aujourd'hui — pas retenu comme point de départ.

### 5.4 Console d'admin

Décision §2.2 : nouvelle section `/admin/**`, lazy-loaded, marquée `RenderMode.Client` dans `app.routes.server.ts` (le mécanisme de rendu par route mis en place cette session permet justement de mélanger pages statiques et section dynamique dans la même app). Un `authGuard` (`CanActivateFn`) vérifie la présence d'une session valide (appel à `/api/v1/auth/me` ou décodage du cookie) avant d'autoriser l'accès.

Écrans, un par ressource (Profil, Expériences, Compétences, Projets, Contact) : liste + formulaire création/édition + confirmation de suppression. Les formulaires utilisent Signal Forms (stable depuis Angular 22, identifié plus tôt cette session comme candidat naturel pour exactement ce cas d'usage : formulaires CRUD orientés signal, cohérent avec le reste de l'app qui est déjà 100% signals). Les composants d'interaction complexes (sélecteur de catégorie, liste réordonnable) peuvent réutiliser `@angular/aria` (déjà adopté pour l'accordéon de l'explorer cette session) plutôt que réinventer l'accessibilité clavier à la main.

Upload d'image : un composant dédié, `multipart/form-data` vers `/api/v1/admin/media`, aperçu avant envoi.

Brouillon/publié : un statut `published` par entrée, pour préparer du contenu sans l'exposer tout de suite sur le site public.

## 6. Déploiement

- **Front** : inchangé, reste un site statique (Netlify/Vercel/GitHub Pages/Cloudflare Pages — tous suffisent pour un `dist/PFO-2025/browser`).
- **API** : a besoin d'un hébergement qui tourne en continu (contrairement au front) — nouveau, à budgéter (Railway/Render/Fly.io ont des paliers gratuits ou très bas coût suffisants à cette échelle).
- **Base de données** : Postgres managé (Neon/Supabase/le Postgres intégré de Railway).
- **Secrets** : `JWT_SECRET`, identifiants admin, chaîne de connexion base, clés du bucket S3-compatible — via variables d'environnement / gestionnaire de secrets de l'hébergeur, jamais committés.
- **CI/CD** : un second workflow GitHub Actions, dans le dépôt `PFO-2025-api`, sur le modèle de celui du front (`npm ci` → lint → build → test), plus une étape de déploiement propre à l'hébergeur choisi.

## 7. Feuille de route (par phases, taille relative — pas d'estimation en jours, rythme solo variable)

| Phase | Contenu | Taille |
|---|---|---|
| 0 | Trancher les 6 décisions du §2 | petite |
| 1 | Squelette NestJS, entités + migrations, endpoints publics en lecture seule, Swagger, CI du nouveau dépôt, script de seed depuis les `*.const.ts` actuels | moyenne |
| 2 | Auth (login, guard JWT, cookie httpOnly), endpoints admin CRUD, rate limiting, hashage argon2 | moyenne |
| 3 | Front : remplacement des imports `*.const.ts` par `httpResource()`, décision §5.3 mise en œuvre (webhook de rebuild si option a) | moyenne |
| 4 | Console d'admin : routes `/admin`, guard, écrans CRUD en Signal Forms, upload d'image | grande |
| 5 | Durcissement : sauvegardes base, logs structurés, tests e2e des parcours admin, documentation | petite à moyenne |

Chaque phase se termine testée et déployée avant de passer à la suivante — pas de grand-bang.

## 8. Pistes d'extension (hors phases 1-5, à ne considérer qu'une fois le socle stable)

- Support multi-langue réel (l'app a déjà l'intention — `selectedLanguage` en localStorage — mais un seul `fr.json` existe) : ajouter `en.json`, rendre les contenus dynamiques traduisibles (colonnes `*_fr`/`*_en` ou table de traductions).
- Multi-admin avec rôles, si le site accueille un jour plusieurs contributeurs.
- Cache CDN + invalidation ciblée si l'option "fetch live" (§5.3-b) est choisie et que la fraîcheur immédiate prime sur le SEO statique.
- Historique des modifications (audit log) sur les entités éditées.

## 9. Risques principaux

- **Nouvelle surface à maintenir** : le site n'a plus besoin de zéro serveur (acquis cette session) mais un serveur applicatif + une base de données, en continu, avec coûts et incidents possibles — arbitrage assumé en échange de l'édition dynamique demandée.
- **Cohérence front/back sur la forme des données** : toute divergence entre ce que l'API renvoie et ce que `JsonCardComponent`/les templates attendent casse silencieusement l'affichage (pas d'erreur de compilation, puisque les données arrivent au runtime) — les DTOs NestJS et les types Angular doivent être tenus en phase, idéalement via un contrat partagé (à minima un fichier de types partagé entre les deux dépôts, au mieux le schéma OpenAPI généré par `@nestjs/swagger` comme source de vérité).
- **Option §5.3-a (rebuild au publish)** introduit un couplage opérationnel entre deux dépôts (un webhook qui doit rester configuré et fonctionnel) — documenté, testé, mais un point de défaillance de plus qu'un site 100% statique.
