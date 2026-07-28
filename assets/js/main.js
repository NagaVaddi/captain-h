/* Captain H — shared site behavior: nav, scroll reveal, accordion, counters, WhatsApp lead form. */
(function () {
  "use strict";

  var WA_NUMBER = "971503358824";

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  var scrim = document.querySelector(".nav-scrim");

  function closeNav() {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute("aria-expanded", "false");
    mobileNav.classList.remove("is-open");
    scrim.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  function openNav() {
    toggle.setAttribute("aria-expanded", "true");
    mobileNav.classList.add("is-open");
    scrim.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  if (toggle && mobileNav && scrim) {
    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeNav() : openNav();
    });
    scrim.addEventListener("click", closeNav);
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll("[data-count-to]");
  if (counters.length) {
    var counterIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseInt(el.getAttribute("data-count-to"), 10) || 0;
          var suffix = el.getAttribute("data-suffix") || "";
          var duration = 1400;
          var start = null;
          function step(ts) {
            if (!start) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          counterIO.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { counterIO.observe(el); });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".accordion-trigger").forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      if (panel) panel.style.maxHeight = expanded ? "0px" : panel.scrollHeight + "px";
    });
  });

  /* ---------- WhatsApp lead form ----------
     No backend: builds a prefilled wa.me deep link from the form fields and
     opens WhatsApp directly, so the lead lands in the chat inbox. */
  document.querySelectorAll(".contact-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      var data = {};

      form.querySelectorAll("[required]").forEach(function (field) {
        var wrap = field.closest(".form-field");
        var value = field.value.trim();
        if (!value) {
          valid = false;
          if (wrap) wrap.classList.add("has-error");
        } else {
          if (wrap) wrap.classList.remove("has-error");
        }
        data[field.name] = value;
      });

      form.querySelectorAll("[name]:not([required])").forEach(function (field) {
        data[field.name] = field.value.trim();
      });

      if (!valid) return;

      var lines = [];
      var intro = form.getAttribute("data-wa-intro") || "Hi Captain H, I would like a free consultation.";
      lines.push(intro);
      if (data.name) lines.push((form.getAttribute("data-label-name") || "Name") + ": " + data.name);
      if (data.phone) lines.push((form.getAttribute("data-label-phone") || "Phone") + ": " + data.phone);
      if (data.goal) lines.push((form.getAttribute("data-label-goal") || "Goal") + ": " + data.goal);
      if (data.message) lines.push((form.getAttribute("data-label-message") || "Message") + ": " + data.message);

      var text = encodeURIComponent(lines.join("\n"));
      var url = "https://wa.me/" + WA_NUMBER + "?text=" + text;

      form.classList.add("is-submitted");
      var success = form.parentElement.querySelector(".form-success");
      if (success) success.classList.add("is-visible");

      window.open(url, "_blank", "noopener");
    });
  });

  /* ---------- WhatsApp click tracking hook (no-op placeholder) ----------
     Kept intentionally simple: swap in gtag/fbq calls here once analytics
     and the Meta Pixel are wired up (see README). */
  document.querySelectorAll("a[href*='wa.me']").forEach(function (a) {
    a.addEventListener("click", function () {
      if (window.fbq) { try { window.fbq("track", "Contact"); } catch (err) {} }
      if (window.gtag) { try { window.gtag("event", "whatsapp_click"); } catch (err) {} }
    });
  });
})();
