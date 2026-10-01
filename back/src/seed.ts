import 'reflect-metadata';
import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { extname, join } from 'node:path';
import { copyFile, mkdir } from 'node:fs/promises';
import { AppDataSource } from './data-source.js';
import { Skill } from './modules/skills/entities/skill.entity.js';
import { SkillCategory } from './modules/skills/entities/skill-category.entity.js';
import { SkillCategoryEntry } from './modules/skills/entities/skill-category-entry.entity.js';
import { SkillLevel } from './modules/skills/entities/skill-level.enum.js';
import { Profile } from './modules/profile/entities/profile.entity.js';
import { Experience } from './modules/experiences/entities/experience.entity.js';
import { Achievement } from './modules/experiences/entities/achievement.entity.js';
import { ExperienceSkill } from './modules/experiences/entities/experience-skill.entity.js';
import { Project } from './modules/projects/entities/project.entity.js';
import { ProjectLink } from './modules/projects/entities/project-link.entity.js';
import { Media } from './modules/media/entities/media.entity.js';
import { ContactInfo } from './modules/contact/entities/contact-info.entity.js';
import { Company } from './modules/projects/enums/company.enum.js';
import { ProjectCategory } from './modules/projects/enums/project-category.enum.js';
import { ProjectType } from './modules/projects/enums/project-type.enum.js';
import { ProjectStatus } from './modules/projects/enums/project-status.enum.js';
import { ExperienceStatus } from './modules/experiences/enums/experience-status.enum.js';

/**
 * Transcribes the content that used to live in front's *.const.ts files.
 * Idempotent: every insert is keyed and skipped if it already exists.
 * Run with: npm run seed
 */

const SLUG = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

async function upsertSkill(skillRepo = AppDataSource.getRepository(Skill), name: string) {
  const slug = SLUG(name);
  const existing = await skillRepo.findOne({ where: { slug } });
  if (existing) return existing;
  return skillRepo.save(skillRepo.create({ name, slug }));
}

async function upsertCategory(key: string, label: string, order: number) {
  const repo = AppDataSource.getRepository(SkillCategory);
  const existing = await repo.findOne({ where: { key } });
  if (existing) return existing;
  return repo.save(repo.create({ key, label, order }));
}

// Preview images still live in front's static assets; copied into media
// storage directly so seeding is reproducible without a manual upload step.
const FRONT_IMAGES_DIR = join(process.cwd(), '..', 'front', 'src', 'assets', 'images');

async function upsertPreviewMedia(
  mediaRepo: ReturnType<typeof AppDataSource.getRepository<Media>>,
  altText: string,
  sourceFilename: string,
): Promise<Media> {
  const existing = await mediaRepo.findOne({ where: { altText } });
  if (existing) return existing;

  const uploadDir = process.env.MEDIA_UPLOAD_DIR ?? './uploads';
  await mkdir(uploadDir, { recursive: true });
  const filename = `${randomUUID()}${extname(sourceFilename).toLowerCase()}`;
  const sourcePath = join(FRONT_IMAGES_DIR, sourceFilename);
  try {
    await copyFile(sourcePath, join(uploadDir, filename));
  } catch (error) {
    throw new Error(`Seed: could not copy preview image for "${altText}" from ${sourcePath}`, { cause: error });
  }

  const publicUrl = `${process.env.MEDIA_PUBLIC_URL}/${filename}`;
  return mediaRepo.save(mediaRepo.create({ filename, url: publicUrl, altText }));
}

async function main() {
  await AppDataSource.initialize();
  console.log('Connected. Seeding...');

  const skillRepo = AppDataSource.getRepository(Skill);
  const entryRepo = AppDataSource.getRepository(SkillCategoryEntry);
  const profileRepo = AppDataSource.getRepository(Profile);
  const contactRepo = AppDataSource.getRepository(ContactInfo);
  const experienceRepo = AppDataSource.getRepository(Experience);
  const achievementRepo = AppDataSource.getRepository(Achievement);
  const experienceSkillRepo = AppDataSource.getRepository(ExperienceSkill);
  const projectRepo = AppDataSource.getRepository(Project);
  const projectLinkRepo = AppDataSource.getRepository(ProjectLink);
  const mediaRepo = AppDataSource.getRepository(Media);

  // --- Skill catalog (was the `Skill` enum in front/src/app/enums/skill.enum.ts) ---
  const skillNames = [
    'Adobe Xd', 'Angular', 'Aws', 'Bootstrap', 'CI/CD', 'Cross Plateform', 'Css', 'Docker',
    'Doctrine', 'Express', 'figma', 'Firebase', 'Github', 'Gitlab', 'Html', 'Illustator',
    'Illustrator', 'Isml', 'Jasmine', 'Javascript', 'Jest', 'Jira', 'Jquery', 'Laravel blade',
    'Less', 'Material Ui', 'Nestjs', 'Photoshop', 'Php', 'Phpmyadmin', 'Phpstorm', 'Phpunit',
    'Postman', 'Powerpoint', 'Sass', 'Scss', 'Sonarqube', 'Symfony', 'Tailwindcss', 'TreeJs',
    'Twig', 'Typescript', 'Visual Studio Code', 'Webstorm', 'Wordpress', 'Zeplin',
    // Used by experiences/skills-page entries, free-text in the old front-end:
    'TypeScript', 'HTML', 'Tailwindcss (skills page)', 'Symfony (skills page)', 'Doctrine (skills page)',
    'NodeJS', 'Express (skills page)', 'PHPMyAdmin', 'RGAA', 'Performance', 'CSS/SCSS/LESS',
  ];
  const skillsByName = new Map<string, Skill>();
  for (const name of skillNames) {
    skillsByName.set(name, await upsertSkill(skillRepo, name));
  }
  const skill = (name: string): Skill => {
    const found = skillsByName.get(name);
    if (!found) throw new Error(`Seed bug: skill "${name}" was not pre-registered above`);
    return found;
  };

  // --- Skill categories (Skills page's six dictionaries + each experience's groups) ---
  const categories = {
    front_end: await upsertCategory('front_end', 'Front End', 0),
    back_end: await upsertCategory('back_end', 'Back End', 1),
    ux_ui: await upsertCategory('ux_ui', 'UX/UI', 2),
    dev_ops: await upsertCategory('dev_ops', 'DevOps', 3),
    tools: await upsertCategory('tools', 'Outils', 4),
    quality: await upsertCategory('quality', 'Qualité', 5),
  };

  // --- Skills page content ---
  // "powerpoint" was '🛇' originally, normalized to SkillLevel.NOT_A_FIT ('✗').
  const skillsPage: [keyof typeof categories, string, SkillLevel][] = [
    ['front_end', 'Angular', SkillLevel.ACQUIRED],
    ['front_end', 'TypeScript', SkillLevel.ACQUIRED],
    ['front_end', 'HTML', SkillLevel.ACQUIRED],
    ['front_end', 'CSS/SCSS/LESS', SkillLevel.ACQUIRED],
    ['front_end', 'Javascript', SkillLevel.ACQUIRED],
    ['front_end', 'Tailwindcss (skills page)', SkillLevel.ACQUIRED],
    ['front_end', 'Bootstrap', SkillLevel.ACQUIRED],
    ['back_end', 'Php', SkillLevel.NOTIONS],
    ['back_end', 'Symfony (skills page)', SkillLevel.NOTIONS],
    ['back_end', 'Doctrine (skills page)', SkillLevel.NOTIONS],
    ['back_end', 'NodeJS', SkillLevel.NOTIONS],
    ['back_end', 'Nestjs', SkillLevel.NOTIONS],
    ['back_end', 'Express (skills page)', SkillLevel.NOTIONS],
    ['back_end', 'PHPMyAdmin', SkillLevel.ACQUIRED],
    ['quality', 'Sonarqube', SkillLevel.ACQUIRED],
    ['quality', 'Jasmine', SkillLevel.ACQUIRED],
    ['quality', 'Jest', SkillLevel.ACQUIRED],
    ['quality', 'Phpunit', SkillLevel.NOTIONS],
    ['ux_ui', 'Material Ui', SkillLevel.ACQUIRED],
    ['ux_ui', 'figma', SkillLevel.ACQUIRED],
    ['ux_ui', 'Adobe Xd', SkillLevel.ACQUIRED],
    ['ux_ui', 'Photoshop', SkillLevel.ACQUIRED],
    ['ux_ui', 'Illustator', SkillLevel.ACQUIRED],
    ['ux_ui', 'Powerpoint', SkillLevel.NOT_A_FIT],
    ['dev_ops', 'Github', SkillLevel.ACQUIRED],
    ['dev_ops', 'Gitlab', SkillLevel.ACQUIRED],
    ['dev_ops', 'Docker', SkillLevel.ACQUIRED],
    ['dev_ops', 'Aws', SkillLevel.NOTIONS],
    ['dev_ops', 'Firebase', SkillLevel.ACQUIRED],
    ['dev_ops', 'CI/CD', SkillLevel.ACQUIRED],
    ['tools', 'Jira', SkillLevel.ACQUIRED],
    ['tools', 'Postman', SkillLevel.ACQUIRED],
    ['tools', 'Webstorm', SkillLevel.ACQUIRED],
    ['tools', 'Phpstorm', SkillLevel.NOTIONS],
    ['tools', 'Visual Studio Code', SkillLevel.ACQUIRED],
    ['tools', 'Cross Plateform', SkillLevel.ACQUIRED],
  ];
  for (const [categoryKey, skillName, level] of skillsPage) {
    const category = categories[categoryKey];
    const s = skill(skillName);
    const exists = await entryRepo.findOne({ where: { skill: { id: s.id }, category: { id: category.id } } });
    if (!exists) {
      await entryRepo.save(entryRepo.create({ skill: s, category, level }));
    }
  }

  // --- Profile ---
  const profileExists = await profileRepo.find({ take: 1 });
  if (!profileExists[0]) {
    await profileRepo.save(
      profileRepo.create({
        name: 'Thomas BELLAVOINE',
        title: 'Développeur frontend Angular',
        bioParagraphs: [
          'Salut, moi c’est Thomas 👋',
          '<strong>Développeur front-end</strong> depuis plus de dix ans, je <em>conçois</em> et <em>construis</em> des interfaces web qui allient <em>performance</em> et <em>plaisir d’utilisation</em>. Mon domaine de prédilection : <strong>Angular</strong>, que j’ai vu évoluer du 8 jusqu’au 19, et avec lequel j’ai réalisé aussi bien des refontes techniques critiques que des applications complètes prêtes pour la production.',
          'Mon approche est <strong>simple</strong> : <em>comprendre</em> les besoins réels, <em>anticiper</em> les contraintes techniques et <em>trouver</em> la solution la plus élégante. Je suis un passionné des détails — du temps de chargement à la compatibilité entre navigateurs — parce que ce sont souvent eux qui font la différence pour l’utilisateur final.',
          'Au fil des années, j’ai travaillé sur des projets variés : e-commerce, applications métiers, expériences 3D interactives, ou encore modules sur mesure pour des marques prestigieuses. J’aime aussi <strong>transmettre</strong> : <em>former</em> de nouveaux développeurs, <em>partager</em> de bonnes pratiques, et parfois <em>sauver</em> une mise en production de dernière minute (ce qui, avouons-le, donne plus d’adrénaline que le café).',
          'Ce qui m’anime avant tout, c’est de créer des produits qui rendent service, qui durent, et qui donnent envie de revenir. Parce qu’au fond, le code n’est qu’un outil : <strong>ce qui compte, c’est l’expérience qu’il permet de vivre</strong>.',
        ],
        softSkills: ['teamwork', 'proactive', 'adaptability', 'creativity', 'critical thinking', 'autonomy'],
        cvUrl: '/assets/pdf/CV-Thomas-BELLAVOINE.pdf',
      }),
    );
  }

  // --- Contact ---
  const contactExists = await contactRepo.find({ take: 1 });
  if (!contactExists[0]) {
    await contactRepo.save(
      contactRepo.create({
        site: 'http://thomasbellavoine.fr',
        email: 'mailto:bellavoine.thomas@gmail.com',
        linkedin: 'https://www.linkedin.com/in/t-bellavoine/',
      }),
    );
  }

  // --- Experiences ---
  type SeedExperience = {
    slug: string;
    company: string;
    role: string;
    periodLabel: string;
    status: ExperienceStatus;
    skills: Partial<Record<keyof typeof categories, string[]>>;
    achievements: string[];
  };
  const experiences: SeedExperience[] = [
    {
      slug: 'front-end-developer-grdf',
      company: 'Web atrio',
      role: 'Développeur Front-End Angular',
      periodLabel: 'Oct 2020',
      status: ExperienceStatus.IN_PROGRESS,
      skills: {
        front_end: ['Angular', 'TypeScript', 'HTML', 'Tailwindcss (skills page)'],
        back_end: ['Symfony (skills page)', 'Doctrine (skills page)'],
        quality: ['Sonarqube', 'Jest', 'Phpunit'],
        ux_ui: ['figma', 'Adobe Xd'],
        dev_ops: ['Gitlab', 'Docker', 'Aws', 'CI/CD'], // "Wsl" from the original free-text list has no catalog equivalent yet
        tools: ['Jira', 'Postman', 'Webstorm'],
      },
      achievements: [
        'Conception et développement de l\'interface utilisateur pour la gestion des relations producteurs bio-méthane',
        'Pilotage de l\'architecture front-end Angular (migration progressive des versions 8 à 19)',
        'Assurance qualité par la mise en place de tests unitaires et d\'intégration (Jasmine/Jest)',
        'Développement back-end avec Symfony et API-Platform, déploiement sur AWS Cloud',
        'Formation et encadrement technique des nouveaux collaborateurs',
      ],
    },
    {
      slug: 'front-end-developer-svp',
      company: 'Web atrio',
      role: 'Développeur Front-End',
      periodLabel: 'Mai 2020 - Juin 2020',
      status: ExperienceStatus.ENDED,
      skills: {
        front_end: ['HTML', 'Scss', 'Javascript'], // "Webpack" has no catalog equivalent yet
        ux_ui: [], // "Zeplin" listed separately below (catalog has 'Zeplin')
        tools: ['Visual Studio Code', 'Cross Plateform'],
      },
      achievements: [
        'Mission critique front-end : refonte technique en urgence avant mise en production',
        'Refonte technique : réduction de la dette technique front-end',
        'Intégration complète : transformation de maquettes Zeplin en interfaces HTML5/SCSS avec templating Laravel Blade',
        'Compatibilité cross-browser : mise en place du support IE11 via Webpack Mix et polyfills',
      ],
    },
    {
      slug: 'front-end-developer-longchamp',
      company: 'Web atrio',
      role: 'Développeur Front-End',
      periodLabel: 'Avril 2020',
      status: ExperienceStatus.ENDED,
      skills: {
        front_end: ['Angular', 'TypeScript', 'Isml', 'Scss', 'Javascript'], // "RGAA"/"performance" are qualities, not tools
        ux_ui: ['Photoshop'],
        dev_ops: ['Gitlab', 'CI/CD'],
        tools: ['Jira', 'Postman'], // "Inteliji"/"Salesforce commerce cloud" have no catalog equivalent yet
      },
      achievements: [
        'Développement de modules e-commerce HTML (ISML)/SASS/JavaScript natifs pour Salesforce Commerce Cloud avec optimisation des performances et conformité accessibilité AA',
        'Création d\'un module Angular 7 pour la personnalisation de produits Longchamp',
        'Intégration UI/UX : transformation de maquettes Photoshop en interfaces interactives optimisées pour l\'expérience utilisateur',
      ],
    },
    {
      slug: 'front-end-developer-adveris',
      company: 'Adveris',
      role: 'Développeur Front-End',
      periodLabel: 'Novembre 2018 - Avril 2019',
      status: ExperienceStatus.ENDED,
      skills: {
        front_end: ['Angular', 'TypeScript', 'HTML', 'Scss', 'Jquery', 'TreeJs', 'Twig', 'Bootstrap'],
        back_end: ['Php'],
        ux_ui: ['figma'], // Zeplin
        tools: ['Visual Studio Code', 'Wordpress'],
      },
      achievements: [
        'Conception et développement de sites web responsive (WordPress/Twig/Symfony) avec architecture front-end performante',
        'Migration technique vers le framework Angular et développement de nouvelles fonctionnalités',
        'Développement d\'expériences 3D interactives avec Three.js pour enrichir l\'engagement utilisateur',
        'Réalisations : sites Inovarion, Yposkesi, Metroscope (production)',
      ],
    },
    {
      slug: 'web-integrator-plaza',
      company: 'Adveris',
      role: 'Intégrateur Web',
      periodLabel: 'janvier 2014 - Décembre 2018',
      status: ExperienceStatus.ENDED,
      skills: {
        front_end: ['HTML', 'Sass', 'Jquery'],
        ux_ui: ['Photoshop', 'Illustrator'],
        tools: ['Visual Studio Code'], // "Coda (mac)"/"Microsoft Sharepoint 2010/2013" have no catalog equivalent yet
      },
      achievements: [
        'Conception et intégration front-end pour intranets SharePoint 2010/2013 destinés aux grandes entreprises (BIC, CNES, Europe Airport, GRT)',
        'Optimisation d\'assets : découpage précis de maquettes Photoshop et compression d\'images pour des performances optimales',
        'Développement responsive HTML5/LESS/SASS garantissant une expérience utilisateur cohérente multi-dispositifs et cross-browser',
      ],
    },
  ];

  for (const [index, exp] of experiences.entries()) {
    let experience = await experienceRepo.findOne({ where: { slug: exp.slug } });
    if (!experience) {
      experience = await experienceRepo.save(
        experienceRepo.create({
          slug: exp.slug,
          company: exp.company,
          role: exp.role,
          periodLabel: exp.periodLabel,
          status: exp.status,
          order: index,
          published: true,
        }),
      );
      for (const [aIndex, text] of exp.achievements.entries()) {
        await achievementRepo.save(achievementRepo.create({ experience, text, order: aIndex }));
      }
      for (const [categoryKey, names] of Object.entries(exp.skills) as [keyof typeof categories, string[]][]) {
        for (const name of names) {
          await experienceSkillRepo.save(
            experienceSkillRepo.create({ experience, skill: skill(name), category: categories[categoryKey] }),
          );
        }
      }
    }
  }

  // --- Projects ---
  // `preview`: front/src/assets/images/* filename for the previewImage.
  type SeedProject = {
    date: string; name: string; company: Company; category: ProjectCategory; type: ProjectType;
    status: ProjectStatus; description: string; skills: string[];
    links: { label: string; url: string }[]; preview?: string;
  };
  const projects: SeedProject[] = [
    {
      date: '2025', name: 'Porfolio 2025', company: Company.PERSO, category: ProjectCategory.WEBSITE,
      type: ProjectType.PERSO, status: ProjectStatus.IN_PROGRESS,
      description: 'Conception et réalisation d\'un portefolio pour mettre en avant mes dernière informations (compétences, project, experiences, ect...)',
      skills: ['Angular', 'Typescript', 'Jasmine', 'Html', 'Css', 'Tailwindcss', 'Github'],
      links: [
        { label: 'Site', url: 'http://thomasbellavoine.fr' },
        { label: 'Github', url: 'https://github.com/tbellavoine/' },
      ],
    },
    {
      date: '2020 - 2025', name: 'GRP: Gestion de la Relation Producteur', company: Company.WEB_ATRIO,
      category: ProjectCategory.APP, type: ProjectType.PRO, status: ProjectStatus.IN_PROGRESS,
      description: 'Conception et développement de l’interface utilisateur pour la gestion des relations producteurs bio-méthane, pilotage de l’architecture front-end Angular (migration progressive v8 à v19), mise en place de tests unitaires et d’intégration (Jasmine/Jest), développement back-end avec Symfony et API-Platform, déploiement sur AWS Cloud, ainsi que formation et encadrement technique des nouveaux collaborateurs.',
      skills: ['Angular', 'Typescript', 'Jest', 'Sonarqube', 'Html', 'Css', 'Tailwindcss', 'Docker', 'Aws', 'Adobe Xd', 'CI/CD', 'Symfony', 'Doctrine', 'Phpunit', 'Jira', 'Gitlab'],
      links: [{ label: 'Site de l\'entreprise', url: 'https://www.grdf.fr/' }],
      preview: 'Gestion relation producteur.jpg',
    },
    {
      date: '2022', name: 'Patience .K - coaching', company: Company.PERSO, category: ProjectCategory.APP,
      type: ProjectType.PERSO, status: ProjectStatus.ENDED,
      description: 'Site vitrine WordPress pour coach sportif à domicile spécialisé dans la remise en forme et perte de poids, avec design personnalisé créé sur maquettes validées et formation back-office pour une gestion autonome du contenu.',
      skills: ['Wordpress', 'Html', 'Jquery', 'Sass', 'Photoshop', 'Illustrator', 'Twig', 'Php'],
      links: [{ label: 'Site de l\'entreprise', url: 'https://patiencekcoaching.fr' }],
      preview: 'Patience K Coaching.jpg',
    },
    {
      date: '2020', name: 'HORA ASOCIADOS - Estudio Juririco Empresarial', company: Company.PERSO,
      category: ProjectCategory.WEBSITE, type: ProjectType.PERSO, status: ProjectStatus.ENDED,
      description: 'Site vitrine WordPress pour cabinet d\'avocats spécialisé en droit du travail, fiscal et corporatif, avec design sur maquettes validées et formation back-office pour une gestion autonome du contenu professionnel.',
      skills: ['Wordpress', 'Html', 'Jquery', 'Sass', 'Photoshop', 'Illustrator', 'Twig', 'Php'],
      links: [{ label: 'Site de l\'entreprise', url: 'https://horaasociados.com/' }],
      preview: 'Hora Asociados.jpg',
    },
    {
      date: '2020', name: 'SVP.com', company: Company.WEB_ATRIO, category: ProjectCategory.BLOG,
      type: ProjectType.PRO, status: ProjectStatus.ENDED,
      description: 'Mission de refonte technique front-end en urgence : transformation complète des maquettes Zeplin en interfaces HTML5/SCSS compatibles cross-browser (IE11) avec templating Laravel Blade, incluant la réduction de la dette technique avant mise en production.',
      skills: ['Html', 'Css', 'Javascript', 'Zeplin', 'Laravel blade'],
      links: [{ label: 'Site de l\'entreprise', url: 'https://www.svp.com/' }],
      preview: 'SVP.jpg',
    },
    {
      date: '2019 - 2020', name: 'Longchamp', company: Company.WEB_ATRIO, category: ProjectCategory.COMMERCE,
      type: ProjectType.PRO, status: ProjectStatus.ENDED,
      description: 'Développement et intégration front-end pour Salesforce Commerce Cloud et Angular 7, incluant la création de modules e-commerce personnalisés, l’optimisation des performances, la mise en conformité accessibilité AA et la transformation de maquettes en interfaces UI/UX interactives.',
      skills: ['Angular', 'Typescript', 'Html', 'Isml', 'Scss', 'Photoshop', 'Gitlab'],
      links: [{ label: 'Site de l\'entreprise', url: 'https://www.longchamp.com/fr/fr/mypliage' }],
      preview: 'Longchamp Mypliage.jpg',
    },
    {
      date: '2019', name: 'Inovarion', company: Company.ADVERIS, category: ProjectCategory.WEBSITE,
      type: ProjectType.PRO, status: ProjectStatus.REFUNDED,
      description: 'Développement et intégration front-end sous wordpress pour un client médical. Optimisation des performances, la mise en conformité accessibilité AA et la transformation de maquettes en interfaces UI/UX interactives.',
      skills: ['Wordpress', 'Html', 'Jquery', 'Sass', 'Photoshop', 'Illustrator', 'Twig', 'Php', 'TreeJs'],
      links: [],
      preview: 'Inovarion.jpg',
    },
    {
      date: '2019', name: 'Yposkesi', company: Company.ADVERIS, category: ProjectCategory.WEBSITE,
      type: ProjectType.PRO, status: ProjectStatus.REFUNDED,
      description: 'Développement et intégration front-end sous wordpress pour un client médical. Optimisation des performances, la mise en conformité accessibilité AA et la transformation de maquettes en interfaces UI/UX interactives.',
      skills: ['Wordpress', 'Html', 'Jquery', 'Javascript', 'Sass', 'Photoshop', 'Illustrator', 'Twig', 'Php'],
      links: [],
      preview: 'Yposkesi.jpg',
    },
    {
      date: '2018', name: 'Pinet', company: Company.ADVERIS, category: ProjectCategory.WEBSITE,
      type: ProjectType.PRO, status: ProjectStatus.ENDED,
      description: 'Développement et intégration front-end sous wordpress pour un client dans le domaine de la construction. Optimisation des performances, transformation des maquettes en interfaces UI/UX interactives.',
      skills: ['Wordpress', 'Html', 'Jquery', 'Javascript', 'Sass', 'Photoshop', 'Illustrator', 'Twig', 'Php'],
      links: [{ label: 'Site de l\'entreprise', url: 'https://www.pinet-industrie.com/fr/' }],
      preview: 'Pinet.jpg',
    },
    {
      date: '2018', name: 'Nextensia', company: Company.ADVERIS, category: ProjectCategory.WEBSITE,
      type: ProjectType.PRO, status: ProjectStatus.ENDED,
      description: 'Développement et intégration front-end sous wordpress pour un client dans le domaine de la construction. Optimisation des performances, transformation des maquettes en interfaces UI/UX interactives.',
      skills: ['Wordpress', 'Html', 'Jquery', 'Javascript', 'Sass', 'Photoshop', 'Illustrator', 'Twig', 'Php'],
      links: [{ label: 'Site de l\'entreprise', url: 'https://www.pinet-industrie.com/fr/' }],
      preview: 'Nextensia.jpg',
    },
    {
      date: '2018', name: 'Metroscope', company: Company.ADVERIS, category: ProjectCategory.WEBSITE,
      type: ProjectType.PRO, status: ProjectStatus.REFUNDED,
      description: 'Développement et intégration front-end sous wordpress. Optimisation des performances, transformation des maquettes en interfaces UI/UX interactives.',
      skills: ['Wordpress', 'Html', 'Jquery', 'Javascript', 'Sass', 'Photoshop', 'Illustrator', 'Twig', 'Php'],
      links: [],
      preview: 'Metroscope EDF.jpg',
    },
    {
      date: '2018', name: 'Fondation avenir du patrimoine à paris', company: Company.ADVERIS,
      category: ProjectCategory.COLLAB, type: ProjectType.PRO, status: ProjectStatus.ENDED,
      description: 'Développement et intégration front-end sous wordpress pour une fondation. Optimisation des performances, transformation des maquettes en interfaces UI/UX interactives.',
      skills: ['Wordpress', 'Html', 'Jquery', 'Javascript', 'Sass', 'Photoshop', 'Illustrator', 'Twig', 'Php'],
      links: [{ label: 'Site de l\'entreprise', url: 'https://fondationavenirpatrimoineparis.fr' }],
      preview: 'Fondation avenir du patrimoine paris.jpg',
    },
  ];

  for (const [index, p] of projects.entries()) {
    const existing = await projectRepo.findOne({ where: { name: p.name } });
    if (existing) continue;
    const previewImage = p.preview ? await upsertPreviewMedia(mediaRepo, p.name, p.preview) : undefined;
    const project = await projectRepo.save(
      projectRepo.create({
        date: p.date,
        name: p.name,
        company: p.company,
        category: p.category,
        type: p.type,
        status: p.status,
        description: p.description,
        order: index,
        published: true,
        skills: p.skills.map((name) => skill(name)),
        previewImage,
      }),
    );
    for (const [lIndex, link] of p.links.entries()) {
      await projectLinkRepo.save(projectLinkRepo.create({ project, label: link.label, url: link.url, order: lIndex }));
    }
  }

  console.log('\nSeed complete.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(() => {
    if (AppDataSource.isInitialized) return AppDataSource.destroy();
  });
