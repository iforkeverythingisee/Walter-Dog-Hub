import { readFileSync } from "node:fs";
import { JSDOM, VirtualConsole } from "jsdom";

const file = process.argv[2] || "Hub.html";
const html = readFileSync(file, "utf8");

const pageErrors = [];
const virtualConsole = new VirtualConsole();
virtualConsole.on("jsdomError", (error) => pageErrors.push(error.message));
virtualConsole.on("error", (...args) => pageErrors.push(args.join(" ")));

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  pretendToBeVisual: true,
  url: "https://example.com/hub.html",
  virtualConsole,
  beforeParse(window) {
    window.scrollTo = () => {};
    window.alert = () => {};
    window.open = () => null;
    window.matchMedia = () => ({
      matches: false,
      media: "",
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {}
    });
  }
});

const { window } = dom;
const { document } = window;

const failures = [];

function check(name, condition, detail) {
  if (condition) {
    console.log(`  ok   ${name}`);
  } else {
    const message = detail ? `${name} -> ${detail}` : name;
    failures.push(message);
    console.error(`  FAIL ${message}`);
  }
}

console.log(`Smoke testing ${file}\n`);

check("page booted without uncaught errors", pageErrors.length === 0, pageErrors.join(" | "));
check("title is set", document.title.length > 0, document.title);
check("typewriter started", document.getElementById("typewriterText").textContent.length > 0);
check("clock rendered", document.getElementById("timeBox").textContent !== "Loading time...");
check("all six sections exist", ["homeSection", "gamesSection", "moviesSection", "toolsSection", "creditsSection", "settingsSection"].every(id => document.getElementById(id)));

// Tabs ------------------------------------------------------------------
window.switchTab("movies");
check(
  "movies tab opens",
  document.getElementById("moviesSection").style.display === "flex" &&
    document.getElementById("homeSection").style.display === "none"
);
const movieButtons = document.querySelectorAll("#movies-container .movie-btn");
check("movie list rendered", movieButtons.length > 0, `${movieButtons.length} buttons`);

window.switchTab("games");
check("games tab opens", document.getElementById("gamesSection").style.display === "flex");
check("active nav is announced", document.getElementById("navGames").getAttribute("aria-current") === "page");
check("inactive nav is not announced", document.getElementById("navHome").hasAttribute("aria-current") === false);

// Movie search ----------------------------------------------------------
window.switchTab("movies");
const movieSearch = document.getElementById("movieSearchInput");
movieSearch.value = "zzzzz-no-such-movie";
window.filterMovies();
check("empty search result is announced", document.getElementById("movieEmpty").hidden === false);
check("empty search result hides buttons", document.querySelectorAll("#movies-container .movie-btn").length === 0);

movieSearch.value = "avengers";
window.filterMovies();
check(
  "search narrows the list",
  document.querySelectorAll("#movies-container .movie-btn").length > 0 &&
    document.querySelectorAll("#movies-container .movie-btn").length < movieButtons.length,
  `${document.querySelectorAll("#movies-container .movie-btn").length} matches`
);

movieSearch.value = "";
window.filterMovies();
check("clearing search restores the list", document.querySelectorAll("#movies-container .movie-btn").length === movieButtons.length);

// Settings --------------------------------------------------------------
window.switchTab("settings");
const pinkSwatch = document.querySelector('[data-accent="#ec4899"]');
window.setAccent(pinkSwatch);
check(
  "accent color applied",
  document.documentElement.style.getPropertyValue("--accent-color") === "#ec4899",
  document.documentElement.style.getPropertyValue("--accent-color")
);
check("accent swatch marked active", pinkSwatch.classList.contains("active"));

const lowStars = document.querySelector('[data-density="low"]');
window.setStarDensity(lowStars);
check("star density applied", document.getElementById("stars3").style.opacity === "0");
check("star density swatch marked active", lowStars.classList.contains("active"));

const motionOff = document.querySelector('[data-motion="off"]');
window.setMotion(motionOff);
check("motion disabled class applied", document.body.classList.contains("no-motion"));

const stored = window.localStorage.getItem("walterDogHub.settings.v1");
check("settings persisted to localStorage", !!stored && stored.includes("#ec4899"), stored);

const cursorBtn = document.querySelector('[data-cursor="hamster"]');
window.setCursorStyle(cursorBtn);
check("cursor setting applied", document.body.classList.contains("hamster-cursor"));
window.setCursorStyle(document.querySelector('[data-cursor="default"]'));
check("cursor setting resets", !document.body.classList.contains("hamster-cursor"));

window.setMotion(document.querySelector('[data-motion="on"]'));

// Modal -----------------------------------------------------------------
window.openToolModal("aboutBlankModal");
const modal = document.getElementById("aboutBlankModal");
check("modal opens", modal.style.display === "flex");
check("modal is announced as a dialog", modal.getAttribute("aria-modal") === "true" && !!modal.getAttribute("aria-labelledby"));
check("page content hidden while modal open", document.getElementById("mainContent").getAttribute("aria-hidden") === "true");
check("background scroll locked", document.body.classList.contains("modal-open"));

document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
check("Escape closes the modal", modal.style.display === "none");
check("page content restored after close", !document.getElementById("mainContent").hasAttribute("aria-hidden"));

// Keyboard shortcut -----------------------------------------------------
window.switchTab("games");
document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "/", bubbles: true }));
check("'/' focuses the games search box", document.activeElement === document.getElementById("searchInput"));

window.switchTab("movies");
document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "/", bubbles: true }));
check("'/' focuses the movies search box", document.activeElement === document.getElementById("movieSearchInput"));

// Hash routing ----------------------------------------------------------
check("tab switch updates the hash", window.location.hash === "#movies", window.location.hash);
window.switchTab("home");
check("home tab clears the hash", window.location.hash === "", window.location.hash);

window.close();

console.log("");
if (failures.length > 0) {
  console.error(`${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log("All smoke checks passed.");
