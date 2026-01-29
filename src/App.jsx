import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Sidebar from './components/layout/Sidebar';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import Studies from './components/sections/Studies';
import InterfaceStudios from './components/sections/InterfaceStudios';
import Resume from './components/sections/Resume';
import Contact from './components/sections/Contact';
import Footer from './components/layout/Footer';
import DecryptedText from './components/ui/DecryptedText';
import './styles/variables.css';
import './styles/global.css';
import './styles/animations.css';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
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
            animateOn="both"
          />
        </a>

        <Sidebar />
        <main>
          <Hero />
          <About />
          <Projects />
          <Studies />
          <InterfaceStudios />
          <Resume />
          <Contact />
        </main>
        <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
