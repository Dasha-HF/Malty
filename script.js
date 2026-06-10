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

const TAPE_SOURCES = {
  green: `<svg width="2502" height="348" xmlns="http://www.w3.org/2000/svg"><g transform="translate(27 -3836)"><path d="M21 4077.4C22.916 4079.25 24.8321 4081.1 43.9932 4086.76 63.1542 4092.42 88.5859 4104.13 135.966 4111.35 183.346 4118.56 266.957 4127.93 328.273 4130.08 389.588 4132.22 448.116 4130.86 503.857 4124.22 559.598 4117.59 613.597 4101.98 662.719 4090.27 711.841 4078.57 750.859 4063.35 798.588 4053.98 846.316 4044.62 893.347 4034.67 949.089 4034.08 1004.83 4033.5 1068.93 4039.94 1133.03 4050.47 1197.14 4061.01 1269.6 4083.25 1333.7 4097.3 1397.8 4111.35 1444.84 4129.3 1517.65 4134.76 1590.46 4140.22 1705.77 4138.86 1770.57 4130.08 1835.37 4121.3 1880.31 4092.61 1906.44 4082.08 1932.57 4071.54 1912.02 4082.27 1927.34 4066.86 1942.67 4051.45 1990.05 4013.99 1998.41 3989.6 2006.78 3965.21 2001.55 3938.09 1977.51 3920.53 1953.47 3902.97 1893.55 3881.51 1854.18 3884.24 1814.82 3886.97 1756.29 3914.67 1741.31 3936.92 1726.33 3959.16 1744.79 3995.84 1764.3 4017.69 1783.81 4039.54 1818.65 4054.96 1858.36 4068.03 1898.08 4081.1 1950.69 4091.64 2002.59 4096.13 2054.5 4100.61 2119.65 4099.83 2169.82 4094.96 2219.98 4090.08 2252.73 4085.2 2303.6 4066.86 2354.46 4048.52 2475 3984.91" stroke="#00422B" stroke-width="91.6667" fill="none"/></g></svg>`,
  pink: `<svg width="3079" height="523" xmlns="http://www.w3.org/2000/svg"><g transform="translate(476 -4940)"><path d="M0 324.357C2.36415 327.466 4.72853 330.575 28.3714 340.064 52.0143 349.554 83.3946 369.188 141.857 381.296 200.319 393.403 303.488 409.111 379.145 412.71 454.802 416.31 527.02 414.019 595.799 402.893 664.578 391.767 731.208 365.589 791.819 345.955 852.431 326.321 900.576 300.797 959.469 285.089 1018.36 269.382 1076.39 252.693 1145.17 251.712 1213.95 250.73 1293.05 261.529 1372.14 279.199 1451.24 296.87 1540.65 334.174 1619.75 357.735 1698.84 381.296 1756.88 411.401 1846.72 420.564 1936.56 429.726 2078.85 427.436 2158.8 412.71 2238.76 397.985 2294.21 349.881 2326.45 332.211 2358.69 314.54 2333.33 332.538 2352.25 306.687 2371.16 280.835 2429.62 218.007 2439.94 177.102 2450.26 136.198 2443.81 90.7131 2414.15 61.2621 2384.49 31.8111 2310.55-4.18446 2261.97 0.396802 2213.4 4.97806 2141.18 51.445 2122.7 88.7496 2104.21 126.054 2126.99 187.574 2151.07 224.224 2175.14 260.874 2218.13 286.725 2267.13 308.65 2316.14 330.575 2381.05 348.245 2445.1 355.772 2509.15 363.298 2589.53 361.989 2651.43 353.808 2713.34 345.627 2753.74 337.447 2816.5 306.687 2879.27 275.927 3028 169.249" stroke="#F8CAD0" stroke-width="91.6667" fill="none" transform="matrix(-1 0 0 1 2555 4987)"/></g></svg>`,
};

async function prepareTape(divider) {
  const image = divider.querySelector("img");
  if (!image) return;

  try {
    const type = divider.classList.contains("tape-divider--green") ? "green" : "pink";
    const source = TAPE_SOURCES[type];
    const documentFragment = new DOMParser().parseFromString(source, "image/svg+xml");
    const svg = documentFragment.documentElement;
    const width = Number(svg.getAttribute("width"));
    const height = Number(svg.getAttribute("height"));
    const path = svg.querySelector("path");

    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.classList.add("tape-divider__svg");

    path.setAttribute("pathLength", "1");
    path.classList.add("tape-divider__path");
    path.style.strokeDasharray = "1";
    path.style.strokeDashoffset = "1";

    divider.replaceChildren(svg);
    divider.tapePath = path;
  } catch {
    image.style.opacity = "1";
  }
}

Promise.all([...tapeDividers].map(prepareTape)).then(requestMotionUpdate);

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

function smoothStep(value) {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
}

function updateTapeProgress(divider) {
  if (!divider.tapePath) return;

  if (reduceMotion) {
    divider.tapePath.style.strokeDashoffset = "0";
    return;
  }

  const rect = divider.getBoundingClientRect();
  const startPoint = window.innerHeight * 0.98;
  const endPoint = -rect.height * 0.3;
  const rawProgress = (startPoint - rect.top) / (startPoint - endPoint);
  const progressValue = Math.max(0, Math.min(1, rawProgress));
  let drawProgress;
  let knotProgress = 0;

  if (progressValue < 0.58) {
    drawProgress = (progressValue / 0.58) * 0.68;
  } else if (progressValue < 0.82) {
    knotProgress = smoothStep((progressValue - 0.58) / 0.24);
    drawProgress = 0.68 + knotProgress * 0.2;
  } else {
    drawProgress = 0.88 + smoothStep((progressValue - 0.82) / 0.18) * 0.12;
  }

  divider.tapePath.style.strokeDashoffset = String(1 - drawProgress);
  divider.style.setProperty("--tape-shift", `${-6 + progressValue * 6}%`);
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
  tapeDividers.forEach(updateTapeProgress);
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
