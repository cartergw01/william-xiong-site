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
  const scrolled = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  root.style.setProperty("--spine-height", max > 0 ? `${(scrolled / max) * 100}%` : "0%");
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

// ── Mobile animations ─────────────────────────────────────
const isMobile = window.innerWidth <= 640;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (isMobile && !reducedMotion) {

  // Hero: split name into words and animate each in
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

  // Entry observer: assemble header + stagger bullets
  const entryObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;

        const entry = e.target;

        // Trigger header assembly (transform only — no opacity)
        entry.classList.add("entry-visible");

        // Stagger bullets: delay starts after section is likely visible (~350ms)
        entry.querySelectorAll(".detail-list li").forEach((li, i) => {
          li.style.transitionDelay = `${0.32 + i * 0.075}s`;
          // Double rAF ensures the delay is set before class triggers transition
          requestAnimationFrame(() => requestAnimationFrame(() => li.classList.add("li-visible")));
        });

        entryObserver.unobserve(entry);
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px -2% 0px" }
  );
  document.querySelectorAll(".entry").forEach((el) => entryObserver.observe(el));

  // Skills observer: stagger pill pop-in
  const skillsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.querySelectorAll(".skill-list li").forEach((li, i) => {
          li.style.transitionDelay = `${0.08 + i * 0.055}s`;
          requestAnimationFrame(() => requestAnimationFrame(() => li.classList.add("li-visible")));
        });
        skillsObserver.unobserve(e.target);
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll(".skills-grid").forEach((el) => skillsObserver.observe(el));

  // Ambient glow parallax — shifts upward as you scroll
  const ambientOrbit = document.querySelector(".ambient-orbit");
  if (ambientOrbit) {
    let rafPending = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!rafPending) {
          rafPending = true;
          requestAnimationFrame(() => {
            const y = window.scrollY;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const t = max > 0 ? y / max : 0;
            ambientOrbit.style.transform = `translateY(${y * 0.08}px) scale(${1 + t * 0.1})`;
            ambientOrbit.style.opacity = `${0.92 + t * 0.08}`;
            rafPending = false;
          });
        }
      },
      { passive: true }
    );
  }

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
