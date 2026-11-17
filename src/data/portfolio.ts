import devOverflowImg from '@/src/assets/images/project_dev_overflow_1791396614426.jpg';
import brainwaveImg from '@/src/assets/images/project_brainwave_1791396627915.jpg';
import movixImg from '@/src/assets/images/project_movix_1791396639720.jpg';
import sphereFallbackImg from '@/src/assets/images/hero_sphere_fallback_1791396651541.jpg';

export interface MetricItem {
  id: string;
  value: number;
  suffix: string;
  displayValue: string;
  label: string;
  context: string;
  detail: string;
}

export interface AchievementItem {
  id: string;
  index: string;
  title: string;
  category: string;
  metricHighlight?: string;
  description: string;
  technologies: string[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  period: string;
  summary: string;
  achievements: AchievementItem[];
}

export interface SkillNode {
  name: string;
  category: 'Frontend' | 'Backend' | 'Databases' | 'Cloud & DevOps' | 'UI / Styling' | 'Tools & Practices';
  context: string;
  orbitRing: 1 | 2 | 3;
  angle: number;
  brandColor: string;
}

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  technologies: string[];
  liveUrl: string;
  image: string;
  accentColor: string;
}

export interface PublicationItem {
  title: string;
  subtitle: string;
  journal: string;
  date: string;
  summary: string;
  domains: string[];
}

export interface EducationItem {
  institution: string;
  abbreviation: string;
  degree: string;
  gpa: string;
  period: string;
  focusAreas: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  domain: string;
}

export const PORTFOLIO_ASSETS = {
  sphereFallback: sphereFallbackImg,
};

export const PERSONAL_INFO = {
  fullName: 'J.A.D. Praveen Roshane De Silva',
  shortName: 'Praveen De Silva',
  brandMark: 'PRAVEEN.DS',
  role: 'Full-Stack Software Engineer',
  positioning: 'Creative engineer + full-stack developer + problem solver.',
  heroHeadline: 'Building digital experiences where engineering meets creativity.',
  heroSubcopy:
    'Senior Full-Stack Software Engineer with 5+ years of experience architecting high-performance .NET backends, modern React interfaces, cloud-ready Azure workflows, and enterprise systems at scale.',
  location: 'Gampaha, Sri Lanka',
  email: 'praveenroshane123@gmail.com',
  phone: '0762739838',
  social: {
    github: 'https://github.com/PraveenRoshane',
    linkedin: 'https://linkedin.com/in/praveen-de-silva-525550229',
  },
};

export const ABOUT_DATA = {
  statement:
    'Bridging enterprise-grade backend architecture with fluid, high-craft frontend engineering.',
  biography: [
    'Results-driven Software Engineer with over 5 years of professional experience specializing in full-stack development using .NET, React, and Azure.',
    'Proven track record in engineering secure banking reporting systems, enterprise Identity and Access Management (IAM) platforms, and scalable e-commerce architectures. Adept at modernizing complex decade-old legacy applications into maintainable, high-velocity modern systems while optimizing critical database and data-pipeline performance.',
  ],
  specializations: [
    'Secure Banking Reporting Systems',
    'Enterprise Identity & Access Management',
    'Scalable E-Commerce Systems',
    'Legacy Application Modernization',
    'Database Performance Optimization',
    'Modern Responsive Interfaces',
  ],
  metrics: [
    {
      id: 'exp-years',
      value: 5,
      suffix: '+ Years',
      displayValue: '5+ Years',
      label: 'Professional Experience',
      context: 'Full-stack enterprise software delivery across .NET, React & Azure',
      detail:
        'Delivered production banking reporting portals, enterprise IAM platforms, and scalable e-commerce workflows across full engineering lifecycles.',
    },
    {
      id: 'report-opt',
      value: 40,
      suffix: '%',
      displayValue: '40%',
      label: 'Report Generation Improvement',
      context: 'Reduced critical MS SQL & Oracle reporting query execution times',
      detail:
        'Refactored complex joins, indexing strategies, and stored procedures across MS SQL Server and Oracle DB to cut batch reporting latency.',
    },
    {
      id: 'file-perf',
      value: 80,
      suffix: '%',
      displayValue: '80%',
      label: 'File Upload / Reading Performance',
      context: 'Engineered high-speed .NET Core file parsing & ingestion modules',
      detail:
        'Replaced memory-heavy buffering with streaming .NET Core parsers and asynchronous I/O pipelines for high-volume enterprise datasets.',
    },
    {
      id: 'legacy-mod',
      value: 15,
      suffix: '+ Years',
      displayValue: '15+ Years',
      label: 'Legacy Systems Modernized',
      context: 'Refactored & upgraded mission-critical .NET Framework platforms',
      detail:
        'Incrementally modernized 15+ year-old .NET Framework and Web Forms codebases toward modular .NET Core APIs and responsive React UIs.',
    },
  ] as MetricItem[],
};

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    role: 'Senior Software Engineer',
    company: 'DMS Software Engineering (Pvt) Ltd',
    location: 'Colombo, Sri Lanka',
    period: '02/2021 – 04/2026',
    summary:
      'Spearheaded full-stack architecture, database optimization, legacy modernization, and enterprise UI transformation across banking, IAM, and enterprise software systems.',
    achievements: [
      {
        id: 'ach-db',
        index: '01',
        title: 'Database Query & Stored Procedure Optimization',
        category: 'Database Engineering',
        metricHighlight: '40% Faster Report Generation',
        description:
          'Optimized complex MS SQL and Oracle database queries and stored procedures, reducing critical enterprise report generation times by 40%.',
        technologies: ['MS SQL Server', 'Oracle DB', 'Stored Procedures', 'Query Tuning'],
      },
      {
        id: 'ach-io',
        index: '02',
        title: 'High-Performance .NET Core File Ingestion Engine',
        category: 'Backend Architecture',
        metricHighlight: '80% Faster Upload & Reading',
        description:
          'Engineered high-performance .NET Core file parsing and upload modules, reducing data upload and reading times by 80% for large enterprise datasets.',
        technologies: ['.NET Core', 'C#', 'Stream Processing', 'RESTful APIs'],
      },
      {
        id: 'ach-legacy',
        index: '03',
        title: 'Enterprise Legacy Application Modernization',
        category: 'System Modernization',
        metricHighlight: '15+ Year Systems Upgraded',
        description:
          'Maintained, refactored, and upgraded 15+ year-old legacy .NET Framework enterprise applications to ensure stability, security, and maintainability.',
        technologies: ['.NET Framework', '.NET Web Forms', 'C#', 'Architecture Refactoring'],
      },
      {
        id: 'ach-iam',
        index: '04',
        title: 'Identity & Access Management (IAM) Architecture',
        category: 'Security & Governance',
        metricHighlight: 'Enterprise IAM & Admin Suites',
        description:
          'Designed and developed comprehensive IAM functionality and administration dashboards for fine-grained role governance and secure access control.',
        technologies: ['IAM', 'React.js', '.NET Core', 'RESTful APIs'],
      },
      {
        id: 'ach-frontend',
        index: '05',
        title: 'Modern Frontend Migration to React & Redux',
        category: 'Frontend Engineering',
        metricHighlight: 'Modernized UI Architecture',
        description:
          'Led migration of legacy frontend structures to React, Tailwind CSS, and Redux, establishing responsive component libraries and predictable state management.',
        technologies: ['React.js', 'Tailwind CSS', 'Redux', 'Responsive UI'],
      },
      {
        id: 'ach-agile',
        index: '06',
        title: 'System Design, Code Reviews & Agile Delivery',
        category: 'Engineering Leadership',
        metricHighlight: 'Full-Lifecycle Ownership',
        description:
          'Participated actively in sprint planning, rigorous code reviews, and architectural system design discussions to uphold engineering quality across teams.',
        technologies: ['Agile/Scrum', 'Git', 'System Design', 'Code Review'],
      },
    ],
  },
];

export const SKILL_CATEGORIES = [
  'All',
  'Frontend',
  'Backend',
  'Databases',
  'Cloud & DevOps',
  'UI / Styling',
  'Tools & Practices',
] as const;

export type SkillCategoryFilter = (typeof SKILL_CATEGORIES)[number];

export const SKILLS_DATA: SkillNode[] = [
  // Frontend
  {
    name: 'React.js',
    category: 'Frontend',
    context: 'Enterprise SPAs, legacy frontend migrations, and interactive component architecture',
    orbitRing: 1,
    angle: 0,
    brandColor: '#61DAFB',
  },
  {
    name: 'Next.js',
    category: 'Frontend',
    context: 'Modern full-stack React frameworks, SSR/SSG routing, and high-performance web apps',
    orbitRing: 1,
    angle: 60,
    brandColor: '#94A3B8',
  },
  {
    name: 'Angular',
    category: 'Frontend',
    context: 'Structured TypeScript single-page applications and enterprise client portals',
    orbitRing: 2,
    angle: 20,
    brandColor: '#DD0031',
  },
  {
    name: '.NET Web Forms',
    category: 'Frontend',
    context: 'Maintaining, refactoring, and migrating 15+ year-old enterprise web interfaces',
    orbitRing: 3,
    angle: 15,
    brandColor: '#3B82F6',
  },

  // Backend
  {
    name: 'C#',
    category: 'Backend',
    context: 'Core language for high-performance backend services, parsers, and enterprise logic',
    orbitRing: 1,
    angle: 120,
    brandColor: '#9B4F96',
  },
  {
    name: '.NET Core',
    category: 'Backend',
    context: 'Engineered high-speed file parsing & upload modules with 80% performance gains',
    orbitRing: 1,
    angle: 180,
    brandColor: '#6D28D9',
  },
  {
    name: '.NET Framework',
    category: 'Backend',
    context: 'Long-term maintenance, refactoring, and modernization of mission-critical legacy systems',
    orbitRing: 2,
    angle: 80,
    brandColor: '#4F46E5',
  },
  {
    name: 'Node.js',
    category: 'Backend',
    context: 'Scalable JavaScript runtime for modern API services and full-stack web applications',
    orbitRing: 2,
    angle: 140,
    brandColor: '#5FA04E',
  },
  {
    name: 'Express.js',
    category: 'Backend',
    context: 'RESTful API routing, middleware architecture, and backend integration services',
    orbitRing: 3,
    angle: 75,
    brandColor: '#64748B',
  },

  // Databases
  {
    name: 'MS SQL Server',
    category: 'Databases',
    context: 'Complex query tuning & stored procedure optimization cutting report times by 40%',
    orbitRing: 1,
    angle: 240,
    brandColor: '#CC2927',
  },
  {
    name: 'Oracle DB',
    category: 'Databases',
    context: 'Enterprise banking & reporting database optimization and stored procedure engineering',
    orbitRing: 1,
    angle: 300,
    brandColor: '#F80000',
  },
  {
    name: 'PostgreSQL',
    category: 'Databases',
    context: 'Relational data modeling, indexing, and transactional integrity',
    orbitRing: 2,
    angle: 200,
    brandColor: '#336791',
  },
  {
    name: 'MySQL',
    category: 'Databases',
    context: 'Structured relational database management for web applications',
    orbitRing: 3,
    angle: 135,
    brandColor: '#00758F',
  },
  {
    name: 'MongoDB',
    category: 'Databases',
    context: 'Document-oriented NoSQL storage for flexible, high-throughput schemas',
    orbitRing: 3,
    angle: 195,
    brandColor: '#47A248',
  },

  // Cloud & DevOps
  {
    name: 'Microsoft Azure',
    category: 'Cloud & DevOps',
    context: 'Cloud-native .NET & React deployments, enterprise cloud services, and scalable hosting',
    orbitRing: 2,
    angle: 260,
    brandColor: '#0078D4',
  },
  {
    name: 'AWS',
    category: 'Cloud & DevOps',
    context: 'Cloud infrastructure services and distributed application deployment',
    orbitRing: 3,
    angle: 255,
    brandColor: '#FF9900',
  },

  // UI / Styling
  {
    name: 'Tailwind CSS',
    category: 'UI / Styling',
    context: 'Utility-first design systems and legacy-to-modern UI migrations',
    orbitRing: 2,
    angle: 320,
    brandColor: '#38BDF8',
  },
  {
    name: 'shadcn/ui',
    category: 'UI / Styling',
    context: 'Accessible, composable modern interface primitives for React applications',
    orbitRing: 3,
    angle: 300,
    brandColor: '#94A3B8',
  },
  {
    name: 'Material UI',
    category: 'UI / Styling',
    context: 'Enterprise dashboard component suites and structured design systems',
    orbitRing: 3,
    angle: 330,
    brandColor: '#007FFF',
  },
  {
    name: 'Bootstrap',
    category: 'UI / Styling',
    context: 'Responsive grid layouts across enterprise and legacy web platforms',
    orbitRing: 3,
    angle: 350,
    brandColor: '#7952B3',
  },

  // Tools & Practices
  {
    name: 'Redux',
    category: 'Tools & Practices',
    context: 'Predictable global state management for complex React & e-commerce applications',
    orbitRing: 2,
    angle: 345,
    brandColor: '#764ABC',
  },
  {
    name: 'RESTful APIs',
    category: 'Tools & Practices',
    context: 'Contract-driven API design connecting frontend interfaces to .NET & Node backends',
    orbitRing: 2,
    angle: 110,
    brandColor: '#06B6D4',
  },
  {
    name: 'IAM',
    category: 'Tools & Practices',
    context: 'Enterprise Identity and Access Management architecture and admin dashboards',
    orbitRing: 2,
    angle: 230,
    brandColor: '#10B981',
  },
  {
    name: 'Git',
    category: 'Tools & Practices',
    context: 'Distributed version control, branching workflows, and collaborative code reviews',
    orbitRing: 3,
    angle: 45,
    brandColor: '#F05032',
  },
  {
    name: 'Agile/Scrum',
    category: 'Tools & Practices',
    context: 'Iterative sprint planning, architectural grooming, and cross-functional delivery',
    orbitRing: 3,
    angle: 105,
    brandColor: '#F59E0B',
  },
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'dev-overflow',
    index: '01',
    title: 'Dev Overflow',
    subtitle: 'Community-Driven Developer Q&A & Knowledge Platform',
    description:
      'A full-featured community-driven question-and-answer platform engineered for software developers to collaborate, resolve complex technical problems, and curate structured engineering knowledge.',
    highlights: [
      'Questions & Technical Discussions',
      'Knowledge Sharing & Collaboration',
      'Upvoting / Downvoting Reputation System',
      'Taxonomy Tagging Architecture',
      'Global Instant Search Engine',
      'Personalized Developer Profiles',
    ],
    technologies: ['Next.js', 'React.js', 'Tailwind CSS', 'RESTful APIs', 'MongoDB'],
    liveUrl: 'https://stack-overflow-rouge.vercel.app',
    image: devOverflowImg,
    accentColor: '#00F0FF',
  },
  {
    id: 'brainwave',
    index: '02',
    title: 'Brainwave',
    subtitle: 'Modern Responsive Complex UI/UX Showcase',
    description:
      'A high-craft modern web experience focused on complex UI/UX spatial design, intricate Bento grid choreography, smooth component transitions, and cross-browser rendering performance.',
    highlights: [
      'Responsive Multi-Viewport Architecture',
      'Complex UI & Bento Grid Implementation',
      'Smooth Component & Scroll Transitions',
      'Frontend Rendering Performance Optimization',
      'Strict Cross-Browser Compatibility',
    ],
    technologies: ['React.js', 'Tailwind CSS', 'Modern UI/UX', 'Responsive Design'],
    liveUrl: 'https://brainwave-blond-gamma.vercel.app',
    image: brainwaveImg,
    accentColor: '#7C3AED',
  },
  {
    id: 'movix',
    index: '03',
    title: 'Movix',
    subtitle: 'Dynamic Movie Database, Discovery & Watchlist Platform',
    description:
      'An interactive media discovery and watchlist application integrating external entertainment APIs to deliver real-time trending titles, multi-parameter filtering, dynamic ratings, and rich media assets.',
    highlights: [
      'Real-Time Movie Discovery & Trending Titles',
      'Instant Search & Multi-Faceted Filtering',
      'Personalized User Watchlists',
      'External Media API Integration',
      'Dynamic Movie Metadata, Ratings & Media Assets',
    ],
    technologies: ['React.js', 'Redux', 'RESTful APIs', 'Dynamic UI'],
    liveUrl: 'https://movix-nu-mocha.vercel.app',
    image: movixImg,
    accentColor: '#00F0FF',
  },
];

export const PUBLICATION_DATA: PublicationItem = {
  title: 'EMOSENSE — Multi-Modal Emotion Recognition to Identify Emotions',
  subtitle: 'Peer-Reviewed Engineering Research Publication',
  journal: 'International Research Journal of Innovations in Engineering and Technology (IRJIET)',
  date: '10/2023',
  summary:
    'Research exploring multi-modal emotion recognition architectures to synthesize and classify human emotional states across complementary signal inputs, demonstrating applied analytical depth and research-driven problem solving.',
  domains: ['Multi-Modal Recognition', 'Applied Machine Intelligence', 'Signal Synthesis', 'Software Engineering Research'],
};

export const EDUCATION_DATA: EducationItem = {
  institution: 'Sri Lanka Institute of Information Technology',
  abbreviation: 'SLIIT',
  degree: 'BSc (Hons) in Software Engineering',
  gpa: '3.0',
  period: '01/2020 – 12/2023',
  focusAreas: [
    'Full-Stack Software Engineering',
    'Enterprise Systems Architecture',
    'Database Management Systems',
    'Research & Applied Computing',
  ],
};

export const CERTIFICATIONS_DATA: CertificationItem[] = [
  {
    id: 'cert-dotnet-react',
    title: 'Learn to Build an E-commerce Store with .Net, React & Redux',
    issuer: 'Udemy',
    domain: 'Full-Stack .NET & React E-Commerce Architecture',
  },
  {
    id: 'cert-nextjs',
    title: 'The Ultimate Next.js 16 Course',
    issuer: 'JS Mastery',
    domain: 'Modern Next.js Architecture & Full-Stack Web Engineering',
  },
];
