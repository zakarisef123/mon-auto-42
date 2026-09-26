import { useCallback, useEffect, useState } from 'react';
import Intro from './components/Intro.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Marquee from './components/Marquee.jsx';
import Services from './components/Services.jsx';
import Occasions from './components/Occasions.jsx';
import Road from './components/Road.jsx';
import Garage from './components/Garage.jsx';
import Devis from './components/Devis.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import useSiteEffects from './hooks/useSiteEffects.js';
import { SUJETS } from './data.jsx';

export default function App() {
  const [ready, setReady] = useState(false);
  const [sujet, setSujet] = useState(SUJETS[0]);
  const onIntroDone = useCallback(() => setReady(true), []);

  useSiteEffects();

  // Déclenche les animations d'entrée du hero (titre, phares, jauge)
  useEffect(() => {
    document.documentElement.classList.toggle('is-ready', ready);
  }, [ready]);

  return (
    <>
      <a className="skip" href="#contenu">
        Aller au contenu
      </a>
      <Intro onDone={onIntroDone} />
      <div className="progress" aria-hidden="true" />
      <Header />
      <main id="contenu">
        <Hero ready={ready} />
        <Marquee />
        <Services />
        <Occasions onChooseSujet={setSujet} />
        <Road />
        <Garage />
        <Devis sujet={sujet} onSujetChange={setSujet} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
