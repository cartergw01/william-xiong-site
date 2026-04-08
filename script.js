const themeToggle = document.querySelector(".theme-toggle");
const sections = Array.from(document.querySelectorAll("main .reveal"));
const heroName = document.querySelector(".hero-name");

const savedTheme = localStorage.getItem("william-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

const applyTheme = (theme) => {
  const isDark = theme === "dark";
  document.body.classList.toggle("theme-dark", isDark);

  if (!themeToggle) {
    return;
  }

  themeToggle.textContent = isDark ? "\u2600" : "\u263E";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
};

applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -10% 0px",
  }
);

sections.forEach((section) => {
  revealObserver.observe(section);
});

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("theme-dark") ? "light" : "dark";
    localStorage.setItem("william-theme", nextTheme);
    applyTheme(nextTheme);
  });
}

if (heroName) {
  const resetHeroName = () => {
    heroName.style.setProperty("--name-tilt-x", "0deg");
    heroName.style.setProperty("--name-tilt-y", "0deg");
    heroName.style.setProperty("--name-shift-x", "0px");
    heroName.style.setProperty("--name-glow-x", "50%");
    heroName.style.setProperty("--name-glow-y", "50%");
  };

  heroName.addEventListener("pointermove", (event) => {
    const rect = heroName.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

    heroName.style.setProperty("--name-tilt-x", `${offsetX * 8}deg`);
    heroName.style.setProperty("--name-tilt-y", `${offsetY * -8}deg`);
    heroName.style.setProperty("--name-shift-x", `${offsetX * 8}px`);
    heroName.style.setProperty("--name-glow-x", `${(offsetX + 0.5) * 100}%`);
    heroName.style.setProperty("--name-glow-y", `${(offsetY + 0.5) * 100}%`);
  });

  heroName.addEventListener("pointerleave", resetHeroName);
  resetHeroName();
}
