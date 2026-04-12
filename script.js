const root = document.documentElement;
const body = document.body;
const themeToggle = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("william-theme");

// ── Theme ────────────────────────────────────────────────
const applyTheme = (theme) => {
  const isLight = theme === "light";
  body.classList.toggle("theme-light", isLight);
  body.classList.toggle("theme-dark", !isLight);
  if (!themeToggle) return;
  themeToggle.setAttribute("aria-pressed", String(!isLight));
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
};

applyTheme(savedTheme || "dark");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = body.classList.contains("theme-light") ? "dark" : "light";
    localStorage.setItem("william-theme", next);
    applyTheme(next);
  });
}

// ── Desktop scroll spine ─────────────────────────────────
const updateSpine = () => {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  root.style.setProperty("--spine-height", max > 0 ? `${(y / max) * 100}%` : "0%");
};
window.addEventListener("scroll", updateSpine, { passive: true });
window.addEventListener("resize", updateSpine, { passive: true });
updateSpine();

// ── Standard reveal ───────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("is-visible");
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ── Mobile animations & lighting ─────────────────────────
const isMobile = window.innerWidth <= 640;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (isMobile && !reducedMotion) {

  // Split hero name into words for staggered slide-up
  const heroName = document.querySelector(".hero-name");
  if (heroName) {
    const words = heroName.textContent.trim().split(/\s+/);
    heroName.innerHTML = words
      .map((w) => `<span class="hero-word">${w}</span>`)
      .join(" ");
    heroName.querySelectorAll(".hero-word").forEach((w, i) => {
      w.style.setProperty("--word-delay", `${0.08 + i * 0.2}s`);
    });
  }

  // Entry observer: laser border + header assembly + bullet stagger
  const entryObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const entry = e.target;

        entry.classList.add("entry-visible");

        // Stagger bullets after section has had time to fade in
        entry.querySelectorAll(".detail-list li").forEach((li, i) => {
          li.style.transitionDelay = `${0.32 + i * 0.075}s`;
          requestAnimationFrame(() => requestAnimationFrame(() => li.classList.add("li-visible")));
        });

        entryObserver.unobserve(entry);
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px -2% 0px" }
  );
  document.querySelectorAll(".entry").forEach((el) => entryObserver.observe(el));

  // Skills observer: pill spring pop + accent glow → settle
  const skillsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.querySelectorAll(".skill-list li").forEach((li, i) => {
          li.style.transitionDelay = `${0.08 + i * 0.055}s`;
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              li.classList.add("li-visible");
              // Settle glow after pill has finished popping in
              setTimeout(() => li.classList.add("li-settled"), 800 + i * 55);
            })
          );
        });
        skillsObserver.unobserve(e.target);
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll(".skills-grid").forEach((el) => skillsObserver.observe(el));

  // Ambient parallax — glow drifts and grows with scroll
  const ambientOrbit = document.querySelector(".ambient-orbit");
  let spineRaf = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!spineRaf) {
        spineRaf = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          const max = document.documentElement.scrollHeight - window.innerHeight;
          const t = max > 0 ? y / max : 0;

          // Background glow position follows scroll (accent moves down the page)
          root.style.setProperty("--bg-glow-y", `${t * 110}%`);

          // Ambient orbit parallax
          if (ambientOrbit) {
            ambientOrbit.style.transform = `translateY(${y * 0.08}px) scale(${1 + t * 0.12})`;
            ambientOrbit.style.opacity = `${0.9 + t * 0.1}`;
          }

          spineRaf = false;
        });
      }
    },
    { passive: true }
  );

  // Touch-reactive spotlight
  const touchGlow = document.createElement("div");
  touchGlow.className = "touch-glow";
  body.appendChild(touchGlow);

  document.addEventListener(
    "touchstart",
    (e) => {
      const t = e.touches[0];
      root.style.setProperty("--tx", `${(t.clientX / window.innerWidth) * 100}%`);
      root.style.setProperty("--ty", `${(t.clientY / window.innerHeight) * 100}%`);
      root.style.setProperty("--touch-active", "1");
    },
    { passive: true }
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches[0];
      root.style.setProperty("--tx", `${(t.clientX / window.innerWidth) * 100}%`);
      root.style.setProperty("--ty", `${(t.clientY / window.innerHeight) * 100}%`);
    },
    { passive: true }
  );

  document.addEventListener(
    "touchend",
    () => {
      root.style.setProperty("--touch-active", "0");
    },
    { passive: true }
  );

  // Mobile progress bar
  const bar = document.createElement("div");
  bar.className = "mobile-progress";
  body.prepend(bar);

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty("--progress", max > 0 ? `${(y / max) * 100}%` : "0%");
    },
    { passive: true }
  );
}
