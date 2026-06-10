const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");
const menuLinks = document.querySelectorAll(".menu a");
const intro = document.querySelector(".intro");
const progress = document.querySelector(".scroll-progress span");
const revealItems = document.querySelectorAll(".js-reveal");
const tapeDividers = document.querySelectorAll(".tape-divider");
const parallaxItems = document.querySelectorAll(".js-parallax");
const counters = document.querySelectorAll(".js-count");
const quickNav = document.querySelector(".quick-nav");
const quickNavToggle = document.querySelector(".quick-nav__toggle");
const quickNavCurrent = document.querySelector(".quick-nav__current");
const quickNavLinks = document.querySelectorAll(".quick-nav__list a");
const navSections = [...quickNavLinks]
  .map((link) => document.getElementById(link.dataset.section))
  .filter(Boolean);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.body.classList.add("is-loading");

function finishIntro() {
  intro.classList.add("is-hidden");
  document.body.classList.remove("is-loading");
  document.body.classList.add("animations-ready");
}

window.addEventListener("load", () => {
  window.setTimeout(finishIntro, reduceMotion ? 50 : 1450);
});

function closeMenu() {
  menu.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
}

menuButton.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

menuLinks.forEach((link) => link.addEventListener("click", closeMenu));

function closeQuickNav() {
  quickNav.classList.remove("is-open");
  quickNavToggle.setAttribute("aria-expanded", "false");
}

quickNavToggle.addEventListener("click", () => {
  const isOpen = quickNav.classList.toggle("is-open");
  quickNavToggle.setAttribute("aria-expanded", String(isOpen));
});

quickNavLinks.forEach((link) => link.addEventListener("click", closeQuickNav));

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) closeMenu();
  closeQuickNav();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  },
  { threshold: 0.08, rootMargin: "-4% 0px -4% 0px" },
);

revealItems.forEach((item) => revealObserver.observe(item));
tapeDividers.forEach((item) => revealObserver.observe(item));

function animateCounter(element) {
  if (element.animationFrame) cancelAnimationFrame(element.animationFrame);

  const target = Number(element.dataset.count);
  const prefix = element.dataset.prefix || "";
  const suffix = element.dataset.suffix || "";
  const start = performance.now();
  const duration = 900;

  function tick(now) {
    const progressValue = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progressValue, 3);
    element.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
    if (progressValue < 1) {
      element.animationFrame = requestAnimationFrame(tick);
    }
  }

  element.animationFrame = requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
      } else {
        if (entry.target.animationFrame) cancelAnimationFrame(entry.target.animationFrame);
        const prefix = entry.target.dataset.prefix || "";
        const suffix = entry.target.dataset.suffix || "";
        entry.target.textContent = `${prefix}0${suffix}`;
      }
    });
  },
  { threshold: 0.6 },
);

if (!reduceMotion) counters.forEach((counter) => counterObserver.observe(counter));

let ticking = false;

function updateMotion() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const scrollRatio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  progress.style.transform = `scaleX(${scrollRatio})`;
  quickNav.classList.toggle("is-shown", window.scrollY > window.innerHeight * 0.55);

  const marker = window.scrollY + window.innerHeight * 0.42;
  let activeIndex = 0;

  navSections.forEach((section, index) => {
    if (section.offsetTop <= marker) activeIndex = index;
  });

  quickNavLinks.forEach((link, index) => {
    const isActive = index === activeIndex;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  quickNavCurrent.textContent = String(activeIndex).padStart(2, "0");

  if (!reduceMotion && window.innerWidth > 700) {
    parallaxItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const viewportOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
      const speed = Number(item.dataset.speed || 0);
      item.style.transform = `translate3d(0, ${-viewportOffset * speed}px, 0)`;
    });
  }

  ticking = false;
}

function requestMotionUpdate() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateMotion);
}

window.addEventListener("scroll", requestMotionUpdate, { passive: true });
window.addEventListener("resize", requestMotionUpdate);
requestMotionUpdate();
