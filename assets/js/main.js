// Mon Auto 42 — interactions
(function () {
  "use strict";

  var PHONE_INTL = "33766903529";
  document.documentElement.classList.add("js");

  // Header opaque au scroll
  var header = document.querySelector(".header");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Menu mobile
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  function closeMenu() {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Ouvrir le menu");
  }
  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  });
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") closeMenu(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  // Apparition au scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Lien actif dans la navigation
  var links = nav.querySelectorAll("a");
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { spy.observe(s); });
  }

  // Boutons qui pré-remplissent l'objet du devis
  var sujet = document.getElementById("sujet");
  document.querySelectorAll("[data-sujet]").forEach(function (btn) {
    btn.addEventListener("click", function () { sujet.value = btn.getAttribute("data-sujet"); });
  });

  // Formulaire de devis → WhatsApp ou SMS
  var form = document.getElementById("devis-form");
  var error = document.getElementById("form-error");
  var channel = "whatsapp";
  form.querySelectorAll("button[data-channel]").forEach(function (b) {
    b.addEventListener("click", function () { channel = b.getAttribute("data-channel"); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var required = ["nom", "tel", "message"];
    var valid = true;
    required.forEach(function (name) {
      var field = form.elements[name];
      var ok = field.value.trim() !== "";
      field.setAttribute("aria-invalid", String(!ok));
      if (!ok) valid = false;
    });
    error.hidden = valid;
    if (!valid) return;

    var f = form.elements;
    var text =
      "Bonjour Mon Auto 42,\n\n" +
      "Demande : " + f.sujet.value + "\n" +
      (f.vehicule.value.trim() ? "Véhicule : " + f.vehicule.value.trim() + "\n" : "") +
      "\n" + f.message.value.trim() + "\n\n" +
      f.nom.value.trim() + " — " + f.tel.value.trim();

    var url = channel === "sms"
      ? "sms:+" + PHONE_INTL + "?&body=" + encodeURIComponent(text)
      : "https://wa.me/" + PHONE_INTL + "?text=" + encodeURIComponent(text);

    window.open(url, "_blank", "noopener");
  });

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
