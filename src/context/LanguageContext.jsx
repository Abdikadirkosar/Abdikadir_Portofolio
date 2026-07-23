import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const translations = {
  EN: {
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      skills: "Skills",
      projects: "Projects",
      experience: "Experience",
      education: "Education",
      certificates: "Certificates",
      testimonials: "Testimonials",
      blog: "Blog",
      contact: "Contact",
      admin: "Admin",
    },
    hero: {
      badge: "AI Engineer & Full-Stack Architect",
      available: "AVAILABLE FOR HIRE & PROJECTS",
      downloadCv: "Download Resume (PDF)",
      viewProjects: "Explore Projects",
      terminalCmd: "Type 'help' in terminal below",
    },
    about: {
      badge: "about.system",
      title: "Passionate About Building",
      titleItalic: "Intelligent Systems",
      desc1: "I am an AI Engineer & Full-Stack Architect with a relentless drive for building scalable applications, generative AI models, and cloud-native solutions.",
      desc2: "Bridging the gap between cutting-edge Machine Learning models and sleek user interfaces.",
      expYears: "Years Experience",
      projectsCompleted: "Projects Completed",
      satisfiedClients: "Satisfied Clients",
    },
    services: {
      badge: "services.system",
      title: "Solutions &",
      titleItalic: "Engineering Services",
      subtitle: "High-performance services tailored for enterprise growth and digital transformation",
    },
    projects: {
      badge: "projects.system",
      title: "Featured",
      titleItalic: "Projects & Innovations",
      subtitle: "Explore interactive applications, AI models, and scalable full-stack web applications",
      searchPlaceholder: "Search projects by name, tech stack, or description...",
      all: "All",
      viewProject: "View Details",
      liveDemo: "Live Demo",
      githubRepo: "GitHub Code",
      noResults: "No projects found matching your search term.",
      page: "Page",
      of: "of",
    },
    skills: {
      badge: "skills.system",
      title: "Creative &",
      titleItalic: "Tech Stack",
      subtitle: "Technologies I use to build intelligent and high-performance systems",
    },
    experience: {
      badge: "experience.system",
      title: "Professional",
      titleItalic: "Career Journey",
      subtitle: "My technical experience and roles across software engineering and AI labs",
    },
    education: {
      badge: "education.system",
      title: "Academic Background &",
      titleItalic: "Qualifications",
      subtitle: "Degrees and formal academic foundation in Computer Science & Engineering",
    },
    certificates: {
      badge: "certificates.system",
      title: "Verified",
      titleItalic: "Certifications",
      subtitle: "Professional accreditations from global technology institutions",
    },
    testimonials: {
      badge: "testimonials.system",
      title: "Client & Colleague",
      titleItalic: "Testimonials",
      subtitle: "What partners and clients say about working together",
    },
    blog: {
      badge: "blog.system",
      title: "Articles &",
      titleItalic: "Technical Writings",
      subtitle: "Insights into AI models, web architecture, and software best practices",
      readMore: "Read Full Article",
    },
    contact: {
      badge: "contact.system",
      title: "Let's Build",
      titleItalic: "Something Amazing",
      nameLabel: "Your Name",
      emailLabel: "Your Email",
      messageLabel: "Your Message",
      sendBtn: "Send Message",
      sending: "Sending...",
    },
    chatbot: {
      title: "Abdikadir AI Assistant",
      subtitle: "Online • Ask me anything",
      placeholder: "Ask about Abdikadir's skills, projects...",
      welcome: "Hello! 👋 I am Abdikadir's AI Assistant. How can I help you today? You can ask about my skills, projects, background, or hiring details!",
    },
    terminal: {
      title: "Interactive Web Shell v2.4",
      welcome: "Welcome to Abdikadir's Interactive Shell. Type 'help' for available commands.",
    },
    cmdPalette: {
      placeholder: "Type a command or search portfolio sections... (Ctrl + K)",
      noResults: "No matching section or action found.",
      shortcutHint: "Press Esc to exit",
    }
  },
  SO: {
    nav: {
      home: "Guriga",
      about: "Naga Saabsan",
      services: "Adeegyada",
      skills: "Xirfadaha",
      projects: "Mashariicda",
      experience: "Khibradda",
      education: "Waxbarashada",
      certificates: "Shahaadooyinka",
      testimonials: "Taqsiinta",
      blog: "Wararka",
      contact: "Nala Soo Xiriir",
      admin: "Admin-ka",
    },
    hero: {
      badge: "AI Engineer & Full-Stack Architect",
      available: "DIYAAR U AH SHAQO IYO MASHARIIC",
      downloadCv: "Daji Resume (PDF)",
      viewProjects: "Eeg Mashariicda",
      terminalCmd: "Ku qor 'help' Terminal-ka hoose",
    },
    about: {
      badge: "about.system",
      title: "U Heelanaanta Dhisidda",
      titleItalic: "Nidaamyo Caqli Badan",
      desc1: "Waxaan ahay AI Engineer & Full-Stack Architect u taagan dhisidda boggaga casriga ah, moodallada Generative AI, iyo nidaamyo cloud-native ah.",
      desc2: "Isku xiridda tiknoolajiyada ugu sareysa ee Machine Learning iyo boggaga indhaha soo jiidanaaya.",
      expYears: "Sano Khibrad Ah",
      projectsCompleted: "Mashruuc ee la Dhameeyay",
      satisfiedClients: "Macaamiil ku Hanoonay",
    },
    services: {
      badge: "services.system",
      title: "Fikradaha &",
      titleItalic: "Adeegyada Injineernimada",
      subtitle: "Adeegyo tayo sare leh oo loogu talagalay koritaanka ganacsiga iyo transformation-ka digital-ka ah",
    },
    projects: {
      badge: "projects.system",
      title: "Mashariicda",
      titleItalic: "Ugu Waawayn",
      subtitle: "Daawo codsiyada shaqaynaya, moodallada AI, iyo boggaga casriga ah ee la dhisay",
      searchPlaceholder: "Ka raadi mashariicda magac, tech stack, ama faahfaahin...",
      all: "Dhamaan",
      viewProject: "Eeg Faahfaahinta",
      liveDemo: "Daawo Live",
      githubRepo: "Code-ka GitHub",
      noResults: "Lama helin mashruuc u dhigma raadintaada.",
      page: "Bogga",
      of: "ka mid ah",
    },
    skills: {
      badge: "skills.system",
      title: "Xirfadaha &",
      titleItalic: "Tiknoolajiyada",
      subtitle: "Tiknoolajiyada aan u adeegsado dhisidda nidaamyo caqli badan oo dhakhso badan",
    },
    experience: {
      badge: "experience.system",
      title: "Geeddiga",
      titleItalic: "Khibradda Shaqo",
      subtitle: "Khibraddayda tiknoolajiyadeed ee software engineering-ka iyo AI labs-ka",
    },
    education: {
      badge: "education.system",
      title: "Nidaamka",
      titleItalic: "Waxbarashada & Shahaadooyinka",
      subtitle: "Aqoonta rasmiga ah ee Computer Science-ka iyo Injineernimada",
    },
    certificates: {
      badge: "certificates.system",
      title: "Shahaadooyinka",
      titleItalic: "La Hubiyay",
      subtitle: "Aqoonsiyada rasmiga ah ee laga helay hay'adaha tiknoolajiyada ee caalamiga ah",
    },
    testimonials: {
      badge: "testimonials.system",
      title: "Marag-furka",
      titleItalic: "Macaamiisha & Asxaabta",
      subtitle: "Waxa ay asxaabta iyo macaamiishu ka yiraahdeen wada shaqayntayada",
    },
    blog: {
      badge: "blog.system",
      title: "Maqaallada &",
      titleItalic: "Qoraallada Tiknoolajiyada",
      subtitle: "Fahmo ku saabsan moodallada AI, web architecture, iyo software best practices",
      readMore: "Akhriso Maqaalka Buuxa",
    },
    contact: {
      badge: "contact.system",
      title: "Aan Dhisno",
      titleItalic: "Wax Weyn oo Yaab Leh",
      nameLabel: "Magacaaga",
      emailLabel: "Email-kaaga",
      messageLabel: "Fariintaada",
      sendBtn: "Dir Fariinta",
      sending: "Waa la dirayaa...",
    },
    chatbot: {
      title: "Caawiyaha AI ee Abdikadir",
      subtitle: "Online • I weydii wax kasta",
      placeholder: "Weaydii xirfadaha, mashariicda Abdikadir...",
      welcome: "Kheyre! 👋 Waxaan ahay Caawiyaha AI ee Abdikadir. Sidaan kugu caawin karaa maanta? Waxaad iga weydiin kartaa xirfahiisa, mashariicdiisa, ama si aad u kireysato!",
    },
    terminal: {
      title: "Interactive Web Shell v2.4",
      welcome: "Ku soo dhawaaw Shell-ka Abdikadir. Ku qor 'help' si aad u aragto amarrada jira.",
    },
    cmdPalette: {
      placeholder: "Qor amar ama raadi qaybaha portfolio-ga... (Ctrl + K)",
      noResults: "Lama helin qayb u dhiganta raadintaada.",
      shortcutHint: "Riix Esc si aad u xirto",
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("app_lang") || "EN";
  });

  useEffect(() => {
    localStorage.setItem("app_lang", lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "EN" ? "SO" : "EN"));
  };

  const t = translations[lang] || translations.EN;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext) || {
  lang: "EN",
  toggleLanguage: () => {},
  t: translations.EN
};
