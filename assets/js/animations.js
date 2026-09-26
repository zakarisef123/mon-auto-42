// Mon Auto 42 — animations
(function () {
  "use strict";

  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function ready() { root.classList.add("is-ready"); }

  // ---------- Écran de démarrage (une fois par visite) ----------
  var intro = document.getElementById("intro");
  var seen = false;
  try { seen = sessionStorage.getItem("ma42-intro") === "1"; } catch (e) {}

  if (!intro || reduced || seen) {
    if (intro) intro.remove();
    requestAnimationFrame(function () { requestAnimationFrame(ready); });
  } else {
    root.style.overflow = "hidden";
    try { sessionStorage.setItem("ma42-intro", "1"); } catch (e) {}
    setTimeout(function () {
      intro.classList.add("is-leaving");
      root.style.overflow = "";
      setTimeout(ready, 250);
      setTimeout(function () { intro.remove(); }, 800);
    }, 1300);
  }

  // ---------- Titre du hero découpé mot par mot ----------
  var h1 = document.querySelector(".hero h1");
  if (h1) {
    var i = 0;
    (function split(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span");
            w.className = "word";
            var inner = document.createElement("span");
            inner.textContent = part;
            inner.style.transitionDelay = (0.08 * i++) + "s";
            w.appendChild(inner);
            frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          split(child);
        }
      });
    })(h1);
    h1.classList.remove("reveal");
  }

  // ---------- Traînées de vitesse dans le hero ----------
  var speed = document.querySelector(".hero__speed");
  if (speed && !reduced) {
    for (var s = 0; s < 14; s++) {
      var line = document.createElement("span");
      line.style.top = (8 + Math.random() * 84) + "%";
      line.style.animationDuration = (1.4 + Math.random() * 2.2) + "s";
      line.style.animationDelay = (Math.random() * 4) + "s";
      line.style.width = (12 + Math.random() * 22) + "%";
      if (s % 5 === 0) line.style.background = "linear-gradient(90deg, transparent, rgba(227,38,47,.6))";
      speed.appendChild(line);
    }
  }

  // ---------- Apparitions en cascade ----------
  var groups = new Map();
  document.querySelectorAll(".reveal, .img-reveal").forEach(function (el) {
    var n = groups.get(el.parentNode) || 0;
    el.style.setProperty("--d", (Math.min(n, 6) * 0.08) + "s");
    groups.set(el.parentNode, n + 1);
  });

  // ---------- Révélation des images en volet ----------
  var imgs = document.querySelectorAll(".img-reveal");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    imgs.forEach(function (el) { io.observe(el); });
  } else {
    imgs.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // ---------- Compteur ----------
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (reduced) { el.textContent = target; return; }
    el.textContent = "0";
    var start = null;
    function tick(t) {
      if (!root.classList.contains("is-ready")) { requestAnimationFrame(tick); return; }
      if (start === null) start = t + 500;
      var p = Math.max(0, Math.min(1, (t - start) / 1200));
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });

  // ---------- Scroll : barre de progression + voiture ----------
  var progress = document.querySelector(".progress");
  var road = document.querySelector(".road");
  var car = road && road.querySelector(".road__car");
  var ticking = false;

  function onScroll() {
    var max = root.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";

    if (road && car && !reduced) {
      var r = road.getBoundingClientRect();
      var vh = window.innerHeight;
      // 0 quand la route entre par le bas, 1 quand elle sort par le haut
      var p = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
      var dist = p * (road.offsetWidth + car.offsetWidth * 2) - car.offsetWidth * 1.2;
      road.style.setProperty("--car-x", dist + "px");
      road.style.setProperty("--wheel", (dist * 2.2) + "deg");
      road.style.setProperty("--road-x", (-dist * 0.3) + "px");
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  // ---------- Parallaxe légère sur le hero ----------
  var heroBg = document.querySelector(".hero__bg");
  if (heroBg && !reduced) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y < window.innerHeight) heroBg.style.translate = "0 " + (y * 0.3) + "px";
    }, { passive: true });
  }

  if (!finePointer || reduced) return;

  // ---------- Cartes : tilt 3D + halo qui suit la souris ----------
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      card.classList.add("is-tilting");
      card.style.transform = "rotateX(" + ((0.5 - y) * 10) + "deg) rotateY(" + ((x - 0.5) * 12) + "deg) translateY(-4px)";
      card.style.setProperty("--mx", (x * 100) + "%");
      card.style.setProperty("--my", (y * 100) + "%");
    });
    card.addEventListener("mouseleave", function () {
      card.classList.remove("is-tilting");
      card.style.transform = "";
    });
  });

  // ---------- Boutons magnétiques ----------
  document.querySelectorAll(".hero__actions .btn, .split__actions .btn, .header__cta").forEach(function (btn) {
    btn.classList.add("magnetic");
    btn.addEventListener("mousemove", function (e) {
      var r = btn.getBoundingClientRect();
      var x = e.clientX - r.left - r.width / 2;
      var y = e.clientY - r.top - r.height / 2;
      btn.style.transform = "translate(" + (x * 0.25) + "px," + (y * 0.35) + "px)";
    });
    btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
  });
})();
