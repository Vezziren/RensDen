import { useState, useEffect } from 'react';
import CustomCursor from './components/CustomCursor';
import GlobalBackground from './components/GlobalBackground';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <PageTransition isLoading={isLoading} />
      {!isLoading && (
        <>
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <CustomCursor />
          <GlobalBackground />
          <div className="grain-overlay" aria-hidden="true" />
          <Navigation />
          <main id="main-content" style={{ position: 'relative', zIndex: 1 }}>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
