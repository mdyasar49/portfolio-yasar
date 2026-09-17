/**
 * Fallback profile data for instant zero-latency rendering.
 * Ensures the portfolio loads instantly even during server cold starts.
 */

export const fallbackProfile = {
  name: "A. MOHAMED YASAR",
  title: "Full Stack Engineer | React.js | Python & Django | AI Voice Systems | REST APIs",
  email: "mohamedyasar081786@gmail.com",
  phone: "+91-9025943184",
  location: "Chennai, TN, India",
  summary: "Full Stack Developer with 3 Years 1 Month of experience specializing in React.js, Python (Django), and the MERN stack. Proven expertise in building responsive web applications with solid backend support, real-time AI Voice portals (Google Gemini Live API & WebSockets), Twilio Voice & SMS integrations, and RESTful APIs. Skilled in working with SQL databases (MySQL/SQLite WAL mode), SonarQube code quality audits, automated server deployment pipelines, and solving complex technical challenges to deliver high-quality production products.",
  availabilityStatus: "Immediate Joiner",
  softSkills: [
    "React.js, MERN Stack & Python (Django)",
    "Twilio Telephony & Voice AI Integration",
    "Server-Sent Events (SSE) & WebSockets Streaming",
    "SonarQube Security & Performance Auditing",
    "Automated Server Deployment (PowerShell / Bash)",
    "AI Agent Workflows (Antigravity, Gemini, Cursor)",
    "Database Optimization (MySQL / SQLite WAL Mode)"
  ],
  additionalInfo: {
    availability: "Immediate Joiner",
    workMode: "Work From Office | Rotational Shifts | Open to Relocation (Anywhere in Tamil Nadu)",
    languages: ["English", "Tamil"],
    softSkills: ["Problem Solving", "Analytical Thinking", "Communication", "Team Collaboration", "Adaptability"]
  },
  heroTagline: "Architecting Real-Time Web Apps, AI Voice Systems & Solid Backend Architectures",
  heroMetrics: [
    { label: "EXPERIENCE", val: "3 Yrs 1 Mo", color: "#f97316" },
    { label: "STACK", val: "React / Python / MERN", color: "#e11d48" },
    { label: "LOCATION", val: "Chennai, TN", color: "#00e5ff" },
    { label: "STATUS", val: "Immediate Joiner", color: "#ec4899" }
  ],
  menuItems: [
    { name: "About", path: "/#about", type: "anchor" },
    { name: "Skills", path: "/#skills", type: "anchor" },
    { name: "Experience", path: "/#experience", type: "anchor" },
    { name: "Projects", path: "/#projects", type: "anchor" },
    { name: "Education", path: "/#education", type: "anchor" },
    { name: "Contact", path: "/#contact", type: "anchor" },
    { name: "Resume", path: "/resume", type: "route" },
    { name: "Docs", path: "/documentation", type: "route" }
  ],
  experience: [
    {
      role: "Freelance Full Stack Developer",
      company: "Infogenx Pvt. Ltd.",
      companyUrl: "https://infogenx.com",
      companyLinkedIn: "https://www.linkedin.com/company/infogenx/",
      period: "May 2026 – Present",
      location: "Remote",
      technologies: ["Python (Django)", "React.js", "WebSockets", "Twilio API", "Node.js", "MySQL", "SQLite", "SonarQube", "Gemini 3.6 Flash"],
      description: [
        "Architected and deployed the multimodal AI Voice Agent System ('Sarah') over low-latency WebSockets with Voice Activity Detection (VAD) and post-call QA scoring pushing to Zoho CRM.",
        "Built the production Twilio Dialer & Communication Suite featuring dual-channel recording, click-to-dial, Zadarma SMS failover, and automated Zoho CRM/Books integrations.",
        "Conducted SonarQube security and code quality audits—eliminating memory leaks (SQLite WAL mode), resolving complexity, and enforcing accessibility compliance.",
        "Engineered and deployed the Blog Admin Portal (blogadmin.infogenx.com) with React.js frontend, Node.js API, dynamic Markdown guides, and automated image compression.",
        "Developed corporate web portals (infogenx.com, infogenx.com.au, dev.infogenx.com) from scratch with 20+ responsive views, SVG network animations, and Zoho widgets.",
        "Leveraged AI Agent workflows (Antigravity AI, Gemini, Cursor) to accelerate development and perform rapid root-cause isolation of critical bugs."
      ]
    },
    {
      role: "Software Engineer / Frontend Specialist",
      company: "Bytes and Binaries Software Solutions",
      companyUrl: "https://www.bytesandbinaries.com/",
      companyLinkedIn: "https://www.linkedin.com/company/bytes-and-binaries/",
      period: "July 2023 – March 2026",
      location: "Pudukkottai, India",
      technologies: ["React.js", "Material UI", "REST APIs", "SQL", "Git", "Postman"],
      description: [
        "Building and maintaining professional user interfaces using React.js and Material UI, ensuring a smooth experience for users.",
        "Working closely with backend teams to integrate REST APIs and manage data flow across different modules.",
        "Optimizing SQL queries to improve database performance and troubleshooting data-related issues.",
        "Solving complex technical problems and reducing bugs through detailed analysis and testing.",
        "Documenting technical features and API details to help the team understand the system better.",
        "Collaborating with QA teams to ensure high-quality releases and system stability."
      ]
    }
  ],
  projects: [
    {
      name: "StreamPulse | Enterprise Live IPTV & Cinema VOD Streaming Suite",
      type: "Full-Stack Media Streaming Platform",
      technologies: ["Python (Django REST)", "React.js 18", "Vite", "Material UI (MUI v5)", "HLS.js", "WebSockets", "Xtream Codes API", "Cloudflare Pages"],
      image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80&w=800",
      link: "https://streampulse-iptv.pages.dev",
      github: "https://github.com/mdyasar49/streampulse-iptv",
      description: [
        "Architected an enterprise-grade Live TV & VOD platform streaming 1,360+ live channels and 230+ 1080p Cinema Movies with sub-second buffer latency.",
        "Engineered built-in CORS Stream Shield proxy, automated M3U playlist export engine for VLC/Kodi, and Xtream Codes API server compatible with TiviMate & Smart TV apps."
      ],
      highlights: ["Adaptive HLS Streaming", "1,360+ Live Channels", "CORS Stream Shield", "Xtream Codes API Server"],
      stats: { Channels: "1,360+ Live", VOD: "230+ 1080p FHD", Latency: "Sub-second", Status: "Live on Cloudflare" }
    },
    {
      name: "Infogenx AI Voice & Multimodal Agent Platform",
      type: "Production AI System (Infogenx)",
      technologies: ["Python", "FastAPI", "Google Gemini Live API", "WebSockets", "Twilio Voice & SMS", "Zoho CRM", "Docker"],
      image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=800",
      link: "https://voice.infogenx.com/infogenx/dashboard",
      github: "#",
      description: [
        "Architected and deployed multimodal AI Voice Agent ('Sarah') operating over low-latency PCM WebSockets with Voice Activity Detection (VAD).",
        "Built automated post-call AI transcript evaluation (QA scoring 1-10, structured pain point extraction) pushing JSON payloads directly to Zoho CRM webhooks."
      ],
      highlights: ["Real-Time Voice AI", "Zoho CRM Integration", "WebSocket Engine"],
      stats: { Latency: "<200ms", "QA Scoring": "Automated", Status: "Live Production" }
    },
    {
      name: "Production Twilio Dialer & Multi-Channel Automation",
      type: "Communication Suite (Infogenx)",
      technologies: ["Python", "Django", "Twilio API", "Zadarma API", "Zoho Deluge", "MySQL", "SQLite WAL"],
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
      link: "https://twilliodialer.infogenx.com/",
      github: "#",
      description: [
        "Engineered production-grade Django web dialer featuring dual-channel call recording, click-to-dial, and Zadarma SMS failover.",
        "Automated multi-channel performance digests aggregating leads from Google Apps Script, Zoho Campaigns, Zoho Books, and telephony logs."
      ],
      highlights: ["Dual Channel Recording", "Zoho Integration", "Multi-Channel SMS"],
      stats: { Reliability: "99.9%", Failover: "Zadarma SMS", Status: "Live Production" }
    },
    {
      name: "Infogenx Blog Admin Portal & CMS",
      type: "Full-Stack Web App (Infogenx)",
      technologies: ["React.js", "Node.js", "Express.js", "LocalStorage API", "Markdown", "Image Compression"],
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800",
      link: "https://blogadmin.infogenx.com/dashboard",
      github: "#",
      description: [
        "Built custom blog admin portal supporting dynamic CRUD actions, Markdown guides, and automatic table of contents generation."
      ],
      highlights: ["Markdown CMS", "Fast Build", "Automated Assets"],
      stats: { Architecture: "Decoupled", Storage: "JSON & Storage API", Status: "Live Production" }
    },
    {
      name: "Infogenx Corporate Portals & Design System",
      type: "Corporate Portals (Infogenx)",
      technologies: ["React.js", "Material UI", "CSS3", "SVG Network Animation", "Zoho CRM Widgets"],
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
      link: "https://infogenx.com",
      github: "#",
      description: [
        "Developed corporate websites from scratch: infogenx.com, infogenx.com.au, and dev.infogenx.com with 20+ responsive views."
      ],
      highlights: ["20+ Views", "SVG Animations", "Glassmorphic UI"],
      stats: { Performance: "95+", Design: "Modern Glassmorphism", Status: "Live Production" }
    },
    {
      name: "Job Planner Enterprise",
      type: "Production Environment (Bytes and Binaries)",
      technologies: ["React.js", "Redux", "Material UI", "REST APIs", "MySQL"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      link: "https://jobplanner.com.au/",
      github: "#",
      description: [
        "Full Stack Contributor to a high-traffic Job Management System, focusing on modular UI development and efficient data rendering."
      ],
      highlights: ["Remote Collaboration", "Modular Components", "API Integration"],
      stats: { Role: "Full Stack", Impact: "Workflow Efficiency", Status: "Production" }
    },
    {
      name: "Full-Stack MERN Portfolio System",
      type: "Full-Stack Portfolio",
      technologies: ["MongoDB", "Express.js", "React.js", "Node.js", "Socket.io", "Framer Motion"],
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
      link: "https://mern-portfolio-yasar-1.onrender.com",
      github: "https://github.com/mdyasar49/portfolio-yasar",
      description: [
        "Developed a modular, data-driven portfolio framework powered by Node.js, Express REST API, and React frontend."
      ],
      highlights: ["Real-Time Socket.io", "Decoupled Architecture", "Dynamic Data"],
      stats: { Data: "100% Dynamic", Security: "Hardened", Status: "Live Production" }
    }
  ],
  technicalSkills: {
    frontend: ["React.js", "Redux", "JavaScript (ES6+)", "Material UI", "HTML5 & CSS3", "Glassmorphism & Responsive UI", "Animations (Framer Motion / SVG)"],
    backend: ["Node.js & Express.js", "Python (Django / FastAPI)", "RESTful API Design", "Core Java & Spring Boot", "Server-Side Security"],
    database: ["MySQL & SQL Server", "MongoDB", "SQLite (WAL Mode & Connection Safety)", "Query Optimization", "Real-time Data Syncing"],
    telephonyAI: ["Twilio API (Voice & SMS)", "WebRTC & Twilio Device", "Google Gemini Live API & WebSockets", "Voice Activity Detection (VAD)", "Zoho Deluge Automations"],
    tools: ["Git & GitHub", "Postman", "CloudPanel & SSH", "PowerShell & Bash Scripting", "SonarQube Code Quality & Security", "VS Code & Docker"],
    productivityTools: ["AI-Assisted Development (Antigravity AI, Gemini 3.6 Flash, Cursor)", "Agentic AI Tooling", "Process Automation"],
    other: ["SonarQube Security Audit", "Memory Leak Optimization", "Bug Investigation & Root Cause Analysis"]
  },
  education: [
    {
      degree: "Master of Computer Applications (MCA)",
      institution: "M.I.E.T Arts and Science College, Tiruchirappalli",
      year: "2023 - 2025",
      period: "2023 - 2025",
      description: "Specializing in advanced software engineering, cloud computing, and enterprise application development.",
      achievements: ["Advanced Data Structures", "Cloud Architecture Research"]
    },
    {
      degree: "Bachelor of Computer Applications (BCA)",
      institution: "Jamal Mohamed College, Tiruchirappalli",
      year: "2020 - 2023",
      period: "2020 - 2023",
      description: "Foundational studies in computer science, including algorithms, database management, and web technologies.",
      achievements: ["Programming Excellence", "Web Development Project Lead"]
    }
  ],
  socials: {
    linkedin: "https://linkedin.com/in/mohamed-yasar-4674ba223",
    github: "https://github.com/mdyasar49"
  },
  customData: {
    availabilityLabel: "AVAILABILITY",
    availabilityStatus: "OPEN TO WORK",
    versionLabel: "VERSION",
    versionValue: "v1.0.0",
    heroOverline: "PROFESSIONAL PORTFOLIO",
    heroActionLabel: "VIEW PROJECTS",
    aboutOverline: "ABOUT ME",
    aboutHeadline: "Crafting High-Performance & AI-Powered Web Platforms",
    expertiseLabel: "Expertise",
    experienceLabel: "Experience",
    experienceValue: "2.5+ Years",
    portfolioLabel: "Portfolio",
    competenciesTitle: "Technical Expertise",
    navLabel: "NAVIGATION",
    copyrightText: "© 2026 A. MOHAMED YASAR",
    contactOverline: "GET IN TOUCH",
    contactHeadline: "Let's Build Something Exceptional",
    contactActionLabel: "SEND MESSAGE",
    skillsOverline: "TECHNICAL SKILLS",
    skillsHeadline: "Core Technical Stack",
    projectsOverline: "FEATURED PROJECTS",
    projectsHeadline: "Production Systems & Applications",
    projectsOverviewLabel: "PROJECT OVERVIEW",
    projectsLiveLabel: "Live Interface",
    projectsSourceLabel: "Source",
    experienceOverline: "WORK EXPERIENCE",
    experienceHeadline: "Professional Journey",
    educationOverline: "EDUCATION",
    educationHeadline: "Academic Background",
    resumeOverline: "RESUME & DOCUMENTS",
    resumeHeadline: "Professional Resume",
    resumePersonaTitle: "Professional Profile",
    resumePersonaDesc: "A comprehensive overview of my technical expertise, professional journey, and engineering methodologies.",
    resumeDownloadLabel: "DOWNLOAD PDF",
    resumeInteractiveLabel: "INTERACTIVE VIEW"
  },
  footerConfig: {
    watermark: "YASAR",
    tagline: "Building high-performance web applications, AI voice platforms, and real-time systems.",
    origin: "MADE IN TAMIL NADU",
    engineVersion: "1.0.0"
  }
};

export default fallbackProfile;
