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
const assistedSections = [...navSections, document.getElementById("contacts")].filter(
  (section, index, sections) => section && sections.indexOf(section) === index,
);
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

function getLayoutTop(element) {
  let top = 0;
  let current = element;

  while (current) {
    top += current.offsetTop;
    current = current.offsetParent;
  }

  return top;
}

function updateRevealState(element) {
  const top = getLayoutTop(element);
  const bottom = top + element.offsetHeight;
  const viewportTop = window.scrollY;
  const viewportBottom = viewportTop + window.innerHeight;
  const isVisible = element.classList.contains("is-visible");

  if (!isVisible) {
    const entersViewport =
      bottom > viewportTop + window.innerHeight * 0.1 &&
      top < viewportBottom - window.innerHeight * 0.1;
    if (entersViewport) element.classList.add("is-visible");
    return;
  }

  const leavesViewport =
    bottom < viewportTop - window.innerHeight * 0.08 ||
    top > viewportBottom + window.innerHeight * 0.08;
  if (leavesViewport) element.classList.remove("is-visible");
}

function updateCounterState(counter) {
  if (reduceMotion) return;

  const top = getLayoutTop(counter);
  const center = top + counter.offsetHeight / 2;
  const enters =
    center > window.scrollY + window.innerHeight * 0.18 &&
    center < window.scrollY + window.innerHeight * 0.82;

  if (enters && counter.dataset.active !== "true") {
    counter.dataset.active = "true";
    animateCounter(counter);
  } else if (!enters && counter.dataset.active === "true") {
    counter.dataset.active = "false";
    if (counter.animationFrame) cancelAnimationFrame(counter.animationFrame);
    const prefix = counter.dataset.prefix || "";
    const suffix = counter.dataset.suffix || "";
    counter.textContent = `${prefix}0${suffix}`;
  }
}

let ticking = false;
let scrollAssistTimer;
let isAssistedScrolling = false;

function assistScroll() {
  if (reduceMotion || isAssistedScrolling || quickNav.classList.contains("is-open")) return;

  const headerOffset = window.innerWidth <= 980 ? 88 : 20;
  const position = window.scrollY + headerOffset;
  let target = null;
  let distance = Infinity;

  assistedSections.forEach((section) => {
    const sectionDistance = Math.abs(getLayoutTop(section) - position);
    if (sectionDistance < distance) {
      target = section;
      distance = sectionDistance;
    }
  });

  if (!target || distance < 3 || distance > 120) return;

  isAssistedScrolling = true;
  window.scrollTo({
    top: Math.max(0, getLayoutTop(target) - headerOffset),
    behavior: "smooth",
  });

  window.setTimeout(() => {
    isAssistedScrolling = false;
  }, 850);
}

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

  revealItems.forEach(updateRevealState);
  tapeDividers.forEach(updateRevealState);
  counters.forEach(updateCounterState);

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

window.addEventListener(
  "scroll",
  () => {
    requestMotionUpdate();
    if (!isAssistedScrolling) {
      window.clearTimeout(scrollAssistTimer);
      scrollAssistTimer = window.setTimeout(assistScroll, 220);
    }
  },
  { passive: true },
);
window.addEventListener("resize", requestMotionUpdate);
requestMotionUpdate();
