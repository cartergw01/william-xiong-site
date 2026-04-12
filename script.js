const root = document.documentElement;
const reveals = document.querySelectorAll(".reveal");
const themeToggle = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("william-theme");
const body = document.body;

const applyTheme = (theme) => {
  const isLight = theme === "light";
  body.classList.toggle("theme-light", isLight);
  body.classList.toggle("theme-dark", !isLight);

  if (!themeToggle) {
    return;
  }

  themeToggle.setAttribute("aria-pressed", String(!isLight));
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
};

applyTheme(savedTheme || "dark");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -8% 0px",
  }
);

reveals.forEach((section) => revealObserver.observe(section));

const updateSpineProgress = () => {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  root.style.setProperty("--spine-height", `${progress}%`);
};

window.addEventListener("scroll", updateSpineProgress, { passive: true });
window.addEventListener("resize", updateSpineProgress, { passive: true });
updateSpineProgress();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = body.classList.contains("theme-light") ? "dark" : "light";
    localStorage.setItem("william-theme", nextTheme);
    applyTheme(nextTheme);
  });
}
