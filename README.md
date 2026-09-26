# Mon Auto 42 — site vitrine

Site du garage Mon Auto 42, 1 Rue du Puits de la Garenne, 42000 Saint-Étienne.
React + Vite, avec une roue de voiture 3D (Three.js + GSAP) dans le haut de page.

## Commandes

```bash
npm install      # installer les dépendances
npm run dev      # lancer en local sur http://localhost:5173
npm run build    # générer le site final dans dist/
```

## Structure

- `index.html` — point d'entrée (balises SEO, données Google)
- `src/App.jsx` — assemblage des sections
- `src/components/` — une section par fichier (Hero, Services, Occasions, Devis…)
- `src/components/Wheel3D.jsx` — roue 3D Three.js/GSAP (pneu, jante, disque, étrier)
- `src/data.jsx` — textes, téléphone, adresse, horaires, services
- `src/styles/` — styles et animations
- `public/assets/` — photos et favicon
- `mentions-legales.html` — mentions légales
- `netlify.toml` — réglages Netlify (build `npm run build`, dossier `dist`)

## À compléter

- Horaires réels : `src/data.jsx` (`HOURS`)
- SIRET / forme juridique / hébergeur : `mentions-legales.html`
- Nom de domaine : balise `canonical` et JSON-LD dans `index.html`
