import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';

const BLUE = 0x1e5bb8; // bleu de l'enseigne
const RED = 0xe3262f; // rouge de l'accueil

// Roue de voiture 3D (pneu, jante 5 branches, disque, étrier) affichée dans le hero.
// Elle arrive en roulant, freine, puis tourne doucement ; elle suit la souris
// et accélère quand on fait défiler la page.
export default function Wheel3D({ className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // WebGL indisponible : pas de roue, le reste du site fonctionne
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    // Reflets réalistes sur le métal
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    // Lumières : blanc principal, contre-jour bleu, touche rouge
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 5, 6);
    const rim = new THREE.DirectionalLight(0x6fa8ff, 3);
    rim.position.set(-6, 2, -3);
    const accent = new THREE.PointLight(RED, 25, 12);
    accent.position.set(3, -2.5, 2);
    scene.add(key, rim, accent, new THREE.AmbientLight(0xffffff, 0.25));

    const disposables = [];
    const track = (o) => (disposables.push(o), o);

    // ---------- Matériaux ----------
    const rubber = track(new THREE.MeshStandardMaterial({ color: 0x141518, roughness: 0.85, metalness: 0, side: THREE.DoubleSide }));
    const alloy = track(new THREE.MeshStandardMaterial({ color: 0xd4d9e1, roughness: 0.22, metalness: 1 }));
    const darkAlloy = track(new THREE.MeshStandardMaterial({ color: 0x3a404b, roughness: 0.35, metalness: 1, side: THREE.DoubleSide }));
    const discMat = track(new THREE.MeshStandardMaterial({ color: 0x8d939d, roughness: 0.45, metalness: 1 }));
    const holeMat = track(new THREE.MeshStandardMaterial({ color: 0x0c0d10, roughness: 1 }));
    const redPaint = track(new THREE.MeshStandardMaterial({ color: RED, roughness: 0.3, metalness: 0.2 }));
    const bluePaint = track(new THREE.MeshStandardMaterial({ color: BLUE, roughness: 0.25, metalness: 0.4 }));
    const redLine = track(new THREE.MeshBasicMaterial({ color: RED }));

    const root = new THREE.Group(); // position, flottement, inclinaison
    const tilt = new THREE.Group(); // suit la souris
    const spin = new THREE.Group(); // tourne
    root.add(tilt);
    tilt.add(spin);
    scene.add(root);

    // ---------- Pneu (profil tourné autour de l'axe) ----------
    const profile = [
      [1.12, 0.4], [1.3, 0.45], [1.47, 0.44], [1.57, 0.37], [1.62, 0.22],
      [1.63, 0], [1.62, -0.22], [1.57, -0.37], [1.47, -0.44], [1.3, -0.45], [1.12, -0.4],
    ].map(([r, z]) => new THREE.Vector2(r, z));
    const tyreGeo = track(new THREE.LatheGeometry(profile, 96));
    tyreGeo.rotateX(Math.PI / 2);
    spin.add(new THREE.Mesh(tyreGeo, rubber));

    // Sculptures de la bande de roulement
    const lugGeo = track(new THREE.BoxGeometry(0.035, 0.09, 0.24));
    const lugs = new THREE.InstancedMesh(lugGeo, rubber, 128);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    for (let i = 0; i < 128; i++) {
      const row = i % 2;
      const a = (Math.floor(i / 2) / 64) * Math.PI * 2 + row * (Math.PI / 64);
      q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), a);
      m.compose(new THREE.Vector3(Math.cos(a) * 1.63, Math.sin(a) * 1.63, row ? 0.15 : -0.15), q, new THREE.Vector3(1, 1, 1));
      lugs.setMatrixAt(i, m);
    }
    spin.add(lugs);

    // Liseré rouge sur le flanc
    const stripeGeo = track(new THREE.TorusGeometry(1.36, 0.012, 8, 128));
    const stripe = new THREE.Mesh(stripeGeo, redLine);
    stripe.position.z = 0.455;
    spin.add(stripe);

    // ---------- Jante ----------
    const barrelGeo = track(new THREE.CylinderGeometry(1.12, 1.12, 0.8, 96, 1, true));
    barrelGeo.rotateX(Math.PI / 2);
    spin.add(new THREE.Mesh(barrelGeo, darkAlloy));

    const lipGeo = track(new THREE.TorusGeometry(1.1, 0.045, 12, 128));
    const lip = new THREE.Mesh(lipGeo, alloy);
    lip.position.z = 0.4;
    spin.add(lip);

    // 5 branches effilées
    const spokeShape = new THREE.Shape();
    spokeShape.moveTo(-0.1, 0.26);
    spokeShape.quadraticCurveTo(-0.08, 0.7, -0.19, 1.09);
    spokeShape.lineTo(0.19, 1.09);
    spokeShape.quadraticCurveTo(0.08, 0.7, 0.1, 0.26);
    spokeShape.closePath();
    const spokeGeo = track(
      new THREE.ExtrudeGeometry(spokeShape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.03, bevelSegments: 3, curveSegments: 16 })
    );
    for (let i = 0; i < 5; i++) {
      const spoke = new THREE.Mesh(spokeGeo, alloy);
      spoke.rotation.z = (i / 5) * Math.PI * 2;
      spoke.position.z = 0.22;
      spin.add(spoke);
    }

    // Moyeu, cache central bleu, écrous
    const hubGeo = track(new THREE.CylinderGeometry(0.34, 0.38, 0.22, 48));
    hubGeo.rotateX(Math.PI / 2);
    const hub = new THREE.Mesh(hubGeo, alloy);
    hub.position.z = 0.28;
    spin.add(hub);

    const capGeo = track(new THREE.CylinderGeometry(0.17, 0.17, 0.06, 48));
    capGeo.rotateX(Math.PI / 2);
    const cap = new THREE.Mesh(capGeo, bluePaint);
    cap.position.z = 0.4;
    spin.add(cap);

    const nutGeo = track(new THREE.CylinderGeometry(0.035, 0.035, 0.06, 6));
    nutGeo.rotateX(Math.PI / 2);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + Math.PI / 5;
      const nut = new THREE.Mesh(nutGeo, darkAlloy);
      nut.position.set(Math.cos(a) * 0.25, Math.sin(a) * 0.25, 0.4);
      spin.add(nut);
    }

    // ---------- Disque de frein percé ----------
    const discGeo = track(new THREE.CylinderGeometry(0.92, 0.92, 0.07, 72));
    discGeo.rotateX(Math.PI / 2);
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.z = -0.05;
    spin.add(disc);

    const holeGeo = track(new THREE.CircleGeometry(0.025, 12));
    const holes = new THREE.InstancedMesh(holeGeo, holeMat, 48);
    for (let i = 0; i < 48; i++) {
      const ring = i % 3;
      const a = (Math.floor(i / 3) / 16) * Math.PI * 2 + ring * 0.12;
      m.makeTranslation(Math.cos(a) * (0.58 + ring * 0.11), Math.sin(a) * (0.58 + ring * 0.11), -0.01);
      holes.setMatrixAt(i, m);
    }
    spin.add(holes);

    // ---------- Étrier rouge (ne tourne pas) ----------
    const caliperShape = new THREE.Shape();
    caliperShape.absarc(0, 0, 1.0, THREE.MathUtils.degToRad(15), THREE.MathUtils.degToRad(65), false);
    caliperShape.absarc(0, 0, 0.7, THREE.MathUtils.degToRad(65), THREE.MathUtils.degToRad(15), true);
    caliperShape.closePath();
    const caliperGeo = track(
      new THREE.ExtrudeGeometry(caliperShape, { depth: 0.22, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 4, curveSegments: 24 })
    );
    const caliper = new THREE.Mesh(caliperGeo, redPaint);
    caliper.position.z = -0.12;
    tilt.add(caliper);

    // ---------- Mise en page selon la taille du hero ----------
    const layout = { x: 0, y: 0, scale: 1 };
    function resize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const halfW = halfH * camera.aspect;
      if (camera.aspect > 1.1) {
        layout.x = halfW * 0.54;
        layout.y = 0.15;
        layout.scale = Math.min(1.1, (halfH * 1.05) / 1.63);
      } else {
        layout.x = halfW * 0.45;
        layout.y = -halfH * 0.42;
        layout.scale = 0.95;
      }
      root.position.x = layout.x;
      root.scale.setScalar(layout.scale);
    }
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // ---------- Animations ----------
    const state = { speed: 14, floatY: 0 };
    const tweens = [
      // Arrivée en roulant depuis la droite puis freinage
      gsap.fromTo(root.position, { x: layout.x + 9 }, { x: () => layout.x, duration: 1.8, ease: 'power3.out', delay: 0.3 }),
      gsap.to(state, { speed: 0.5, duration: 2.4, ease: 'power2.out', delay: 0.3 }),
      // Flottement léger
      gsap.to(state, { floatY: 0.12, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' }),
    ];

    // Souris : la roue s'oriente vers le pointeur
    const pointer = { x: 0, y: 0 };
    const onPointer = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    // Scroll : la roue accélère
    let lastScroll = window.scrollY;
    let boost = 0;
    const onScroll = () => {
      boost = Math.min(boost + Math.abs(window.scrollY - lastScroll) * 0.02, 18);
      lastScroll = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ---------- Rendu (en pause hors écran) ----------
    const clock = new THREE.Clock();
    let frame = 0;
    let visible = true;
    function animate() {
      frame = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!visible) return;
      boost *= 0.94;
      spin.rotation.z -= (state.speed + boost) * dt;
      tilt.rotation.y += (-0.55 + pointer.x * 0.35 - tilt.rotation.y) * 0.06;
      tilt.rotation.x += (pointer.y * 0.2 - tilt.rotation.x) * 0.06;
      root.position.y = layout.y + state.floatY;
      renderer.render(scene, camera);
    }
    tilt.rotation.y = -0.55;
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
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', onScroll);
      tweens.forEach((t) => t.kill());
      lugs.dispose();
      holes.dispose();
      disposables.forEach((d) => d.dispose());
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
