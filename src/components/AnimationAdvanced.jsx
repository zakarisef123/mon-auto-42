import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

// Scène 3D animée (Three.js + GSAP), affichée en fond du hero.
// La scène suit la taille de son conteneur, se met en pause hors écran
// et libère toutes ses ressources au démontage.
export default function AnimationAdvanced({ className = '', style }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // SETUP
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // WebGL indisponible : on n'affiche simplement pas la scène
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    camera.position.z = 5;

    // LIGHTING (intensités adaptées à l'éclairage physique de Three.js r155+)
    const ambientLight = new THREE.AmbientLight(0x00d4ff, 1.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xff00ff, 80);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, 1.5);
    fillLight.position.set(-3, 2, 4);
    scene.add(fillLight);

    // GÉOMÉTRIES MULTIPLES
    const geometries = [
      new THREE.TorusGeometry(1, 0.4, 16, 100),
      new THREE.IcosahedronGeometry(0.8),
      new THREE.OctahedronGeometry(0.7),
    ];

    const materials = [
      new THREE.MeshStandardMaterial({ color: 0x00d4ff, metalness: 0.7, roughness: 0.3 }),
      new THREE.MeshStandardMaterial({ color: 0xff00ff, metalness: 0.7, roughness: 0.3 }),
      new THREE.MeshStandardMaterial({ color: 0x00ff88, metalness: 0.7, roughness: 0.3 }),
    ];

    const group = new THREE.Group();
    scene.add(group);

    const tweens = [];
    geometries.forEach((geo, i) => {
      const mesh = new THREE.Mesh(geo, materials[i]);
      mesh.position.x = (i - 1) * 1.5;
      group.add(mesh);

      // ANIMATIONS GSAP
      tweens.push(
        gsap.to(mesh.rotation, {
          x: Math.PI * 2,
          y: Math.PI * 2,
          duration: 4 + i,
          repeat: -1,
          ease: 'none',
        }),
        gsap.to(mesh.position, {
          y: Math.sin(i) * 0.5,
          duration: 2 + i * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      );
    });

    // Taille = celle du conteneur ; sur écran large, les formes passent à droite du texte
    function resize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const halfWidth = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z * camera.aspect;
      const wide = camera.aspect > 1.1;
      group.position.x = wide ? halfWidth * 0.5 : 0;
      group.position.y = wide ? 0.4 : -1.2;
      group.scale.setScalar(wide ? 1 : 0.75);
    }
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // RENDER (en pause quand le hero n'est pas visible)
    let frame = 0;
    let visible = true;
    function animate() {
      frame = requestAnimationFrame(animate);
      if (visible) renderer.render(scene, camera);
    }
    animate();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      tweens.forEach((t) => (visible ? t.resume() : t.pause()));
    });
    io.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      tweens.forEach((t) => t.kill());
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} className={className} style={style} aria-hidden="true" />;
}
