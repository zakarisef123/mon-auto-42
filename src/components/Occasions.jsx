const CHECKS = [
  'Véhicules révisés et contrôlés par nos mécaniciens',
  'Reprise de votre ancien véhicule possible',
  'Carte grise faite sur place',
  'Recherche personnalisée selon votre budget',
];

export default function Occasions({ onChooseSujet }) {
  return (
    <section className="section section--dark" id="occasions">
      <div className="container split">
        <div className="split__media img-reveal">
          <img
            src="/assets/img/parc-vehicules.jpg"
            alt="Véhicules d'occasion exposés devant le garage : Audi RS3, Audi RS5, Porsche 911"
            loading="lazy"
          />
          <span className="badge">Occasions</span>
        </div>
        <div className="split__text reveal">
          <p className="kicker">Véhicules d'occasion</p>
          <h2>De la citadine à la sportive, un parc qui bouge chaque semaine.</h2>
          <p>
            Chaque véhicule passe par notre atelier avant d'être proposé : contrôle complet, entretien à jour, historique
            vérifié. Vous achetez en connaissant exactement ce que vous achetez.
          </p>
          <ul className="checks">
            {CHECKS.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <div className="split__actions">
            <a href="#devis" className="btn btn--accent" onClick={() => onChooseSujet("Achat d'un véhicule d'occasion")}>
              Je cherche un véhicule
            </a>
            <a href="#devis" className="btn btn--ghost" onClick={() => onChooseSujet('Vente / reprise de mon véhicule')}>
              Faire estimer ma voiture
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
