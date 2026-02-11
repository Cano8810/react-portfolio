import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Sidebar from './components/layout/Sidebar';
import Hero from './components/sections/Hero';
import AboutSection from './components/sections/AboutSection';
import Projects from './components/sections/Projects';
import Studies from './components/sections/Studies';
import InterfaceStudios from './components/sections/InterfaceStudios';
import Contact from './components/sections/Contact';
import PrivateVault from './components/sections/PrivateVault';
import Footer from './components/layout/Footer';
import DecryptedText from './components/ui/DecryptedText';
import WelcomeLoader from './components/ui/WelcomeLoader';
import './styles/variables.css';
import './styles/global.css';
import './styles/animations.css';

function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [renderContent, setRenderContent] = useState(false);

  const handleLoaderComplete = () => {
    // Content startet zu rendern während Swipe Animation läuft
    setRenderContent(true);
  };

  const handleLoaderFinished = () => {
    // Loader komplett weg nach Swipe Animation
    setShowLoader(false);
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        {showLoader && (
          <WelcomeLoader
            onComplete={handleLoaderComplete}
            onFinished={handleLoaderFinished}
          />
        )}
        {renderContent && (
          <div className="app">
            {/* Credit Link - Top Right */}
            <a href="#" className="credit-link">
              <DecryptedText
                text="© Code by Can Yildiz"
                speed={50}
                maxIterations={15}
                sequential={true}
                revealDirection="start"
                className="credit-char"
                parentClassName="credit-text"
                animateOn="view"
              />
            </a>

            <Sidebar />
            <main>
              <Hero />
              <AboutSection />
              <Projects />
              <PrivateVault />
              <Studies />
              <InterfaceStudios />
              <Contact />
            </main>
            <Footer />
          </div>
        )}
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
