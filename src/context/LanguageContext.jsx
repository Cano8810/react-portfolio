import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Sidebar
    work: 'Work',
    about: 'About',
    studies: 'Studies',
    interfaceStudios: 'Interface Studios',
    resume: 'Resume',
    contact: 'Contact',
    settings: 'Settings',
    lightMode: 'Light',
    darkMode: 'Dark',
    language: 'Language',
    // Hero
    heroStatement: 'Helping brands to stand out in the digital era',
    heroDescription: 'The combination of my passion for design, code & interaction positions me in a unique place in the web design world.',
    basedIn: 'Based in',
    localTime: 'Local time',
    scrollToExplore: 'Scroll to explore',
    // About
    aboutTitle: 'About Me',
    aboutText1: 'I am a passionate developer with experience in modern web technologies. I love creating beautiful, functional, and user-friendly websites.',
    aboutText2: 'My goal is to deliver high-quality solutions that exceed expectations and create real value.',
    yearsExperience: 'Years Experience',
    projectsCompleted: 'Projects Completed',
    technologiesMastered: 'Technologies',
    // Projects
    projectsTitle: 'My Projects',
    projectsSubtitle: 'A selection of my work',
    projectsText1: 'Here you will find a selection of my recent projects. Each project represents unique challenges and creative solutions.',
    projectsText2: 'From e-commerce platforms to interactive dashboards - I bring ideas to life with modern technologies and user-friendly design.',
    scrollDown: 'Scroll down',
    viewProject: 'View Project',
    viewCode: 'View Code',
    // Skills
    skillsTitle: 'Skills & Studies',
    skillsSubtitle: 'Technologies and tools I work with',
    frontend: 'Frontend',
    backend: 'Backend',
    tools: 'Tools & Others',
    // Contact
    contactTitle: 'Get in Touch',
    contactSubtitle: 'Have a project in mind? Let\'s work together!',
    nameLabel: 'Name',
    emailLabel: 'Email',
    messageLabel: 'Message',
    sendMessage: 'Send Message',
    sending: 'Sending...',
    messageSent: 'Message sent successfully!',
    messageError: 'Error sending message. Please try again.',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'your.email@example.com',
    messagePlaceholder: 'Tell me about your project...',
    // Footer
    footerRights: 'All rights reserved',
    // Studies Section
    studiesTitle: 'Education & Studies',
    studiesSubtitle: 'My academic background and certifications',
    education: 'Education',
    certifications: 'Certifications',
    // Interface Studios Section
    studioTitle: 'Creative Digital Solutions',
    studioSubtitle: 'We transform ideas into exceptional digital experiences',
    serviceDesign: 'UI/UX Design',
    serviceDesignDesc: 'Creating intuitive and beautiful user interfaces',
    serviceDev: 'Web Development',
    serviceDevDesc: 'Building fast and scalable web applications',
    serviceMobile: 'Mobile Apps',
    serviceMobileDesc: 'Native and cross-platform mobile solutions',
    serviceConsulting: 'Consulting',
    serviceConsultingDesc: 'Strategic guidance for digital transformation',
    statProjects: 'Projects',
    statClients: 'Clients',
    statYears: 'Years',
    statSatisfaction: 'Satisfaction',
    studioCta: 'Ready to start your next project?',
    studioContact: 'Get in Touch',
    // Resume Section
    resumeTitle: 'Resume',
    resumeSubtitle: 'My professional experience and qualifications',
    downloadResume: 'Download PDF',
    workExperience: 'Work Experience',
    technicalSkills: 'Technical Skills',
  },
  de: {
    // Sidebar
    work: 'Arbeit',
    about: 'Über mich',
    studies: 'Studium',
    interfaceStudios: 'Interface Studios',
    resume: 'Lebenslauf',
    contact: 'Kontakt',
    settings: 'Einstellungen',
    lightMode: 'Hell',
    darkMode: 'Dunkel',
    language: 'Sprache',
    // Hero
    heroStatement: 'Marken helfen, im digitalen Zeitalter hervorzustechen',
    heroDescription: 'Die Kombination aus meiner Leidenschaft für Design, Code & Interaktion positioniert mich an einem einzigartigen Platz in der Webdesign-Welt.',
    basedIn: 'Standort',
    localTime: 'Ortszeit',
    scrollToExplore: 'Scrollen zum Entdecken',
    // About
    aboutTitle: 'Über mich',
    aboutText1: 'Ich bin ein leidenschaftlicher Entwickler mit Erfahrung in modernen Web-Technologien. Ich liebe es, schöne, funktionale und benutzerfreundliche Websites zu erstellen.',
    aboutText2: 'Mein Ziel ist es, qualitativ hochwertige Lösungen zu liefern, die Erwartungen übertreffen und echten Mehrwert schaffen.',
    yearsExperience: 'Jahre Erfahrung',
    projectsCompleted: 'Projekte abgeschlossen',
    technologiesMastered: 'Technologien',
    // Projects
    projectsTitle: 'Meine Projekte',
    projectsSubtitle: 'Eine Auswahl meiner Arbeiten',
    projectsText1: 'Hier finden Sie eine Auswahl meiner jüngsten Projekte. Jedes Projekt repräsentiert einzigartige Herausforderungen und kreative Lösungen.',
    projectsText2: 'Von E-Commerce-Plattformen bis hin zu interaktiven Dashboards - ich bringe Ideen zum Leben mit modernen Technologien und benutzerfreundlichem Design.',
    scrollDown: 'Nach unten scrollen',
    viewProject: 'Projekt ansehen',
    viewCode: 'Code ansehen',
    // Skills
    skillsTitle: 'Fähigkeiten & Studium',
    skillsSubtitle: 'Technologien und Tools mit denen ich arbeite',
    frontend: 'Frontend',
    backend: 'Backend',
    tools: 'Tools & Sonstiges',
    // Contact
    contactTitle: 'Kontakt aufnehmen',
    contactSubtitle: 'Haben Sie ein Projekt im Sinn? Lassen Sie uns zusammenarbeiten!',
    nameLabel: 'Name',
    emailLabel: 'E-Mail',
    messageLabel: 'Nachricht',
    sendMessage: 'Nachricht senden',
    sending: 'Wird gesendet...',
    messageSent: 'Nachricht erfolgreich gesendet!',
    messageError: 'Fehler beim Senden. Bitte versuchen Sie es erneut.',
    namePlaceholder: 'Ihr Name',
    emailPlaceholder: 'ihre.email@beispiel.de',
    messagePlaceholder: 'Erzählen Sie mir von Ihrem Projekt...',
    // Footer
    footerRights: 'Alle Rechte vorbehalten',
    // Studies Section
    studiesTitle: 'Bildung & Studium',
    studiesSubtitle: 'Mein akademischer Hintergrund und Zertifizierungen',
    education: 'Ausbildung',
    certifications: 'Zertifizierungen',
    // Interface Studios Section
    studioTitle: 'Kreative Digitale Lösungen',
    studioSubtitle: 'Wir verwandeln Ideen in außergewöhnliche digitale Erlebnisse',
    serviceDesign: 'UI/UX Design',
    serviceDesignDesc: 'Intuitive und schöne Benutzeroberflächen erstellen',
    serviceDev: 'Webentwicklung',
    serviceDevDesc: 'Schnelle und skalierbare Webanwendungen bauen',
    serviceMobile: 'Mobile Apps',
    serviceMobileDesc: 'Native und plattformübergreifende mobile Lösungen',
    serviceConsulting: 'Beratung',
    serviceConsultingDesc: 'Strategische Beratung für digitale Transformation',
    statProjects: 'Projekte',
    statClients: 'Kunden',
    statYears: 'Jahre',
    statSatisfaction: 'Zufriedenheit',
    studioCta: 'Bereit für Ihr nächstes Projekt?',
    studioContact: 'Kontakt aufnehmen',
    // Resume Section
    resumeTitle: 'Lebenslauf',
    resumeSubtitle: 'Meine berufliche Erfahrung und Qualifikationen',
    downloadResume: 'PDF herunterladen',
    workExperience: 'Berufserfahrung',
    technicalSkills: 'Technische Fähigkeiten',
  },
  tr: {
    // Sidebar
    work: 'Çalışmalar',
    about: 'Hakkımda',
    studies: 'Eğitim',
    interfaceStudios: 'Interface Studios',
    resume: 'Özgeçmiş',
    contact: 'İletişim',
    settings: 'Ayarlar',
    lightMode: 'Açık',
    darkMode: 'Koyu',
    language: 'Dil',
    // Hero
    heroStatement: 'Markaların dijital çağda öne çıkmasına yardımcı oluyorum',
    heroDescription: 'Tasarım, kod ve etkileşime olan tutkumun kombinasyonu, beni web tasarım dünyasında benzersiz bir konuma yerleştiriyor.',
    basedIn: 'Konum',
    localTime: 'Yerel saat',
    scrollToExplore: 'Keşfetmek için kaydırın',
    // About
    aboutTitle: 'Hakkımda',
    aboutText1: 'Modern web teknolojilerinde deneyimli tutkulu bir geliştiriciyim. Güzel, işlevsel ve kullanıcı dostu web siteleri oluşturmayı seviyorum.',
    aboutText2: 'Hedefim, beklentileri aşan ve gerçek değer yaratan yüksek kaliteli çözümler sunmaktır.',
    yearsExperience: 'Yıl Deneyim',
    projectsCompleted: 'Tamamlanan Proje',
    technologiesMastered: 'Teknoloji',
    // Projects
    projectsTitle: 'Projelerim',
    projectsSubtitle: 'Çalışmalarımdan bir seçki',
    projectsText1: 'Burada son projelerimden bir seçki bulacaksınız. Her proje benzersiz zorlukları ve yaratıcı çözümleri temsil ediyor.',
    projectsText2: 'E-ticaret platformlarından interaktif panolara - modern teknolojiler ve kullanıcı dostu tasarımla fikirleri hayata geçiriyorum.',
    scrollDown: 'Aşağı kaydır',
    viewProject: 'Projeyi Gör',
    viewCode: 'Kodu Gör',
    // Skills
    skillsTitle: 'Yetenekler & Eğitim',
    skillsSubtitle: 'Çalıştığım teknolojiler ve araçlar',
    frontend: 'Frontend',
    backend: 'Backend',
    tools: 'Araçlar & Diğer',
    // Contact
    contactTitle: 'İletişime Geçin',
    contactSubtitle: 'Aklınızda bir proje mi var? Birlikte çalışalım!',
    nameLabel: 'İsim',
    emailLabel: 'E-posta',
    messageLabel: 'Mesaj',
    sendMessage: 'Mesaj Gönder',
    sending: 'Gönderiliyor...',
    messageSent: 'Mesaj başarıyla gönderildi!',
    messageError: 'Mesaj gönderilirken hata oluştu. Lütfen tekrar deneyin.',
    namePlaceholder: 'Adınız',
    emailPlaceholder: 'email@ornek.com',
    messagePlaceholder: 'Projeniz hakkında bilgi verin...',
    // Footer
    footerRights: 'Tüm hakları saklıdır',
    // Studies Section
    studiesTitle: 'Eğitim & Çalışmalar',
    studiesSubtitle: 'Akademik geçmişim ve sertifikalarım',
    education: 'Eğitim',
    certifications: 'Sertifikalar',
    // Interface Studios Section
    studioTitle: 'Yaratıcı Dijital Çözümler',
    studioSubtitle: 'Fikirleri olağanüstü dijital deneyimlere dönüştürüyoruz',
    serviceDesign: 'UI/UX Tasarım',
    serviceDesignDesc: 'Sezgisel ve güzel kullanıcı arayüzleri oluşturma',
    serviceDev: 'Web Geliştirme',
    serviceDevDesc: 'Hızlı ve ölçeklenebilir web uygulamaları oluşturma',
    serviceMobile: 'Mobil Uygulamalar',
    serviceMobileDesc: 'Yerel ve çapraz platform mobil çözümler',
    serviceConsulting: 'Danışmanlık',
    serviceConsultingDesc: 'Dijital dönüşüm için stratejik rehberlik',
    statProjects: 'Proje',
    statClients: 'Müşteri',
    statYears: 'Yıl',
    statSatisfaction: 'Memnuniyet',
    studioCta: 'Bir sonraki projenize başlamaya hazır mısınız?',
    studioContact: 'İletişime Geçin',
    // Resume Section
    resumeTitle: 'Özgeçmiş',
    resumeSubtitle: 'Profesyonel deneyimim ve niteliklerim',
    downloadResume: 'PDF İndir',
    workExperience: 'İş Deneyimi',
    technicalSkills: 'Teknik Yetenekler',
  },
};

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
];

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || navigator.language.split('-')[0] || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
