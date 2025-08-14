import { Project } from '../../models/project.model';
import { ProjectType } from '../../enums/project-type.enum';
import { ProjectCategory } from '../../enums/project-category.enum';
import { ProjectStatus } from '../../enums/project-status.enum';
import { Skill } from '../../enums/skill.enum';
import { Company } from '../../enums/company.enum';
import { ImageAssets } from '@components/explorer/assets-images.const';

export const Projects: Project[] = [
  new Project(
    1,
    '2025',
    'Porfolio 2025',
    Company.PERSO,
    ProjectCategory.WEBSITE,
    ProjectType.PERSO,
    ProjectStatus.IN_PROGRESS,
    'Conception et réalisation d\'un portefolio pour mettre en avant mes dernière informations (compétences, project, experiences, ect...)',
    [Skill.ANGULAR, Skill.TYPESCRIPT, Skill.JASMINE, Skill.HTML, Skill.CSS, Skill.TAILWINDCSS, Skill.GITHUB],
    [
      {
        'label': 'Site',
        'url': 'http://thomasbellavoine.fr'
      },
      {
        'label': 'Github',
        'url': 'https://github.com/tbellavoine/'
      },
      {
        'label': 'Preview',
        'url': '/assets/images/pfo.jpg'
      }
    ]
  ),
  new Project(
    2,
    '2020 - 2025',
    'GRP: Gestion de la Relation Producteur',
    Company.WEB_ATRIO,
    ProjectCategory.APP,
    ProjectType.PRO,
    ProjectStatus.IN_PROGRESS,
    'Conception et développement de l’interface utilisateur pour la gestion des relations producteurs bio-méthane, pilotage de l’architecture front-end Angular (migration progressive v8 à v19), mise en place de tests unitaires et d’intégration (Jasmine/Jest), développement back-end avec Symfony et API-Platform, déploiement sur AWS Cloud, ainsi que formation et encadrement technique des nouveaux collaborateurs.',
    [Skill.ANGULAR, Skill.TYPESCRIPT, Skill.JEST, Skill.SONARQUBE, Skill.HTML, Skill.CSS, Skill.TAILWINDCSS, Skill.DOCKER, Skill.AWS, Skill.ADOBE_XD, Skill.CI_CD, Skill.SYMFONY, Skill.DOCTRINE, Skill.PHPUNIT, Skill.JIRA, Skill.GITLAB],
    [
      {
        'label': 'Site de l\'entreprise',
        'url': 'https://www.grdf.fr/'
      },
      {
        'label': 'Preview',
        'url': '/assets/images/grp.jpg'
      }
    ]
  ),
  new Project(
    3,
    '2022',
    'Patience .K - coaching',
    Company.PERSO,
    ProjectCategory.APP,
    ProjectType.PERSO,
    ProjectStatus.ENDED,
    'Site vitrine WordPress pour coach sportif à domicile spécialisé dans la remise en forme et perte de poids, avec design personnalisé créé sur maquettes validées et formation back-office pour une gestion autonome du contenu.',
    [Skill.WORDPRESS, Skill.HTML, Skill.JQUERY, Skill.SASS, Skill.PHOTOSHOP, Skill.ILLUSTRATOR, Skill.TWIG, Skill.PHP],
    [
      {
        'label': 'Site de l\'entreprise',
        'url': 'https://patiencekcoaching.fr'
      },
      {
        'label': 'Preview',
        'url': '/assets/images/patiencekcoaching.png'
      }
    ]
  ),
  new Project(
    4,
    '2020',
    'HORA ASOCIADOS - Estudio Juririco Empresarial',
    Company.PERSO,
    ProjectCategory.WEBSITE,
    ProjectType.PERSO,
    ProjectStatus.ENDED,
    'Site vitrine WordPress pour cabinet d\'avocats spécialisé en droit du travail, fiscal et corporatif, avec design sur maquettes validées et formation back-office pour une gestion autonome du contenu professionnel.',
    [Skill.WORDPRESS, Skill.HTML, Skill.JQUERY, Skill.SASS, Skill.PHOTOSHOP, Skill.ILLUSTRATOR, Skill.TWIG, Skill.PHP,],
    [
      {
        'label': 'Site de l\'entreprise',
        'url': 'https://horaasociados.com/'
      },
      {
        'label': 'Preview',
        'url': '/assets/images/horaasociados.png'
      }
    ]
  ),
  new Project(
    5,
    '2020',
    'SVP.com',
    Company.WEB_ATRIO,
    ProjectCategory.BLOG,
    ProjectType.PRO,
    ProjectStatus.ENDED,
    'Mission de refonte technique front-end en urgence : transformation complète des maquettes Zeplin en interfaces HTML5/SCSS compatibles cross-browser (IE11) avec templating Laravel Blade, incluant la réduction de la dette technique avant mise en production.',
    [Skill.HTML, Skill.CSS, Skill.JAVASCRIPT, Skill.ZEPLIN, Skill.LARAVEL],
    [
      {
        'label': 'Site de l\'entreprise',
        'url': 'https://www.svp.com/'
      },
      {
        'label': 'Preview',
        'url': '/assets/images/SVP.jpg'
      }
    ]
  ),
  new Project(
    6,
    '2019 - 2020',
    'Longchamp',
    Company.WEB_ATRIO,
    ProjectCategory.COMMERCE,
    ProjectType.PRO,
    ProjectStatus.ENDED,
    'Développement et intégration front-end pour Salesforce Commerce Cloud et Angular 7, incluant la création de modules e-commerce personnalisés, l’optimisation des performances, la mise en conformité accessibilité AA et la transformation de maquettes en interfaces UI/UX interactives.',
    [Skill.ANGULAR, Skill.TYPESCRIPT, Skill.HTML, Skill.ISML, Skill.SCSS, Skill.PHOTOSHOP, Skill.GITLAB],
    [
      {
        'label': 'Site de l\'entreprise',
        'url': 'https://www.longchamp.com/fr/fr/mypliage'
      },
      {
        'label': 'Preview',
        'url': '/assets/images/mypliage.jpg'
      }
    ]
  ),
  new Project(
    7,
    '2019',
    'Inovarion',
    Company.ADVERIS,
    ProjectCategory.WEBSITE,
    ProjectType.PRO,
    ProjectStatus.REFUNDED,
    'Développement et intégration front-end sous wordpress pour un client médical. Optimisation des performances, la mise en conformité accessibilité AA et la transformation de maquettes en interfaces UI/UX interactives.',
    [Skill.WORDPRESS, Skill.HTML, Skill.JQUERY, Skill.SASS, Skill.PHOTOSHOP, Skill.ILLUSTRATOR, Skill.TWIG, Skill.PHP, Skill.TREE_JS],
    [
      {
        'label': 'Preview',
        'url': '/assets/images/inovarion.jpg'
      }
    ]
  ),
  new Project(
    8,
    '2019',
    'Yposkesi',
    Company.ADVERIS,
    ProjectCategory.WEBSITE,
    ProjectType.PRO,
    ProjectStatus.REFUNDED,
    'Développement et intégration front-end sous wordpress pour un client médical. Optimisation des performances, la mise en conformité accessibilité AA et la transformation de maquettes en interfaces UI/UX interactives.',
    [Skill.WORDPRESS, Skill.HTML, Skill.JQUERY, Skill.JAVASCRIPT, Skill.SASS, Skill.PHOTOSHOP, Skill.ILLUSTRATOR, Skill.TWIG, Skill.PHP],
    [
      {
        'label': 'Preview',
        'url': '/assets/images/yposkesi.jpg'
      }
    ]
  ),
  new Project(
    9,
    '2018',
    'Pinet',
    Company.ADVERIS,
    ProjectCategory.WEBSITE,
    ProjectType.PRO,
    ProjectStatus.ENDED,
    'Développement et intégration front-end sous wordpress pour un client dans le domaine de la construction. Optimisation des performances, transformation des maquettes en interfaces UI/UX interactives.',
    [Skill.WORDPRESS, Skill.HTML, Skill.JQUERY, Skill.JAVASCRIPT, Skill.SASS, Skill.PHOTOSHOP, Skill.ILLUSTRATOR, Skill.TWIG, Skill.PHP],
    [
      {
        'label': 'Site de l\'entreprise',
        'url': 'https://www.pinet-industrie.com/fr/'
      },
      {
        'label': 'Preview',
        'url': '/assets/images/pinet.jpg'
      }
    ]
  ),
  new Project(
    10,
    '2018',
    'Nextensia',
    Company.ADVERIS,
    ProjectCategory.WEBSITE,
    ProjectType.PRO,
    ProjectStatus.ENDED,
    'Développement et intégration front-end sous wordpress pour un client dans le domaine de la construction. Optimisation des performances, transformation des maquettes en interfaces UI/UX interactives.',
    [Skill.WORDPRESS, Skill.HTML, Skill.JQUERY, Skill.JAVASCRIPT, Skill.SASS, Skill.PHOTOSHOP, Skill.ILLUSTRATOR, Skill.TWIG, Skill.PHP],
    [
      {
        'label': 'Site de l\'entreprise',
        'url': 'https://www.pinet-industrie.com/fr/'
      },
      {
        'label': 'Preview',
        'url': '/assets/images/pinet.jpg'
      }
    ]
  ),
  new Project(
    11,
    '2018',
    'Metroscope',
    Company.ADVERIS,
    ProjectCategory.WEBSITE,
    ProjectType.PRO,
    ProjectStatus.REFUNDED,
    'Développement et intégration front-end sous wordpress. Optimisation des performances, transformation des maquettes en interfaces UI/UX interactives.',
    [Skill.WORDPRESS, Skill.HTML, Skill.JQUERY, Skill.JAVASCRIPT, Skill.SASS, Skill.PHOTOSHOP, Skill.ILLUSTRATOR, Skill.TWIG, Skill.PHP],
    [
      {
        'label': 'Site de l\'entreprise',
        'url': 'https://www.pinet-industrie.com/fr/'
      },
      {
        'label': 'Preview',
        'url': '/assets/images/pinet.jpg'
      }
    ]
  ),
  new Project(
    12,
    '2018',
    'Fondation avenir du patrimoine à paris',
    Company.ADVERIS,
    ProjectCategory.COLLAB,
    ProjectType.PRO,
    ProjectStatus.ENDED,
    'Développement et intégration front-end sous wordpress pour une fondation. Optimisation des performances, transformation des maquettes en interfaces UI/UX interactives.',
    [Skill.WORDPRESS, Skill.HTML, Skill.JQUERY, Skill.JAVASCRIPT, Skill.SASS, Skill.PHOTOSHOP, Skill.ILLUSTRATOR, Skill.TWIG, Skill.PHP],
    [
      {
        'label': 'Site de l\'entreprise',
        'url': 'https://www.pinet-industrie.com/fr/'
      },
      {
        'label': 'Preview',
        'url': ImageAssets.PINET
      }
    ]
  )
];
