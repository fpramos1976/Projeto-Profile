const ICON_MOON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
const ICON_SUN =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';

// Textos do botão de tema, que é montado pelo JavaScript
const THEME_LABELS = {
  pt: { toLight: "Ativar tema claro", toDark: "Ativar tema escuro" },
  en: { toLight: "Switch to light theme", toDark: "Switch to dark theme" },
};

function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // localStorage indisponível (ex.: modo privado): a escolha só não fica salva
  }
}

/*
 * IDIOMA
 */
function getCurrentLanguage() {
  return document.documentElement.lang === "en" ? "en" : "pt";
}

function getInitialLanguage() {
  const saved = readStorage("language");
  if (saved === "pt" || saved === "en") {
    return saved;
  }
  // Sem preferência salva: português para navegadores em português, inglês para os demais
  const browserLanguage = (navigator.language || "pt").toLowerCase();
  return browserLanguage.startsWith("pt") ? "pt" : "en";
}

function applyTranslations(language) {
  const texts = window.TRANSLATIONS || {};

  document.querySelectorAll("[data-i18n]").forEach(function (element) {
    const entry = texts[element.dataset.i18n];
    if (entry) element.textContent = entry[language];
  });

  document.querySelectorAll("[data-i18n-attr]").forEach(function (element) {
    const [attribute, key] = element.dataset.i18nAttr.split(":");
    const entry = texts[key];
    if (entry) element.setAttribute(attribute, entry[language]);
  });
}

function setLanguage(language, save) {
  document.documentElement.lang = language === "en" ? "en" : "pt-BR";
  if (document.readyState !== "loading") {
    applyTranslations(language);
    updateToggleButton(getCurrentTheme());
  }
  if (save) writeStorage("language", language);
}

function toggleLanguage() {
  setLanguage(getCurrentLanguage() === "pt" ? "en" : "pt", true);
}

/*
 * TEMA
 */
function getCurrentTheme() {
  return document.documentElement.getAttribute("data-theme");
}

function getInitialTheme() {
  const saved = readStorage("theme");
  if (saved === "light" || saved === "dark") {
    return saved;
  }
  // Sem preferência salva: segue o tema do sistema operacional
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function updateToggleButton(theme) {
  const buttonDarkMode = document.getElementById("toggleDarkMode");
  if (!buttonDarkMode) return;

  const labels = THEME_LABELS[getCurrentLanguage()];
  buttonDarkMode.innerHTML = theme === "dark" ? ICON_SUN : ICON_MOON;
  buttonDarkMode.setAttribute("aria-label", theme === "dark" ? labels.toLight : labels.toDark);
}

function setTheme(theme, save) {
  document.documentElement.setAttribute("data-theme", theme);
  updateToggleButton(theme);
  if (save) writeStorage("theme", theme);
}

function toggleDarkMode() {
  setTheme(getCurrentTheme() === "dark" ? "light" : "dark", true);
}

// Aplica tema e idioma imediatamente (o script está no <head>) para evitar "piscar" a tela
setTheme(getInitialTheme(), false);
setLanguage(getInitialLanguage(), false);

document.addEventListener("DOMContentLoaded", function () {
  // Os textos vêm do assets/translations.js (o HTML guarda a versão em português como reserva)
  applyTranslations(getCurrentLanguage());
  document.documentElement.classList.add("i18nReady");
  updateToggleButton(getCurrentTheme());

  document.getElementById("toggleDarkMode").addEventListener("click", toggleDarkMode);
  document.getElementById("toggleLanguage").addEventListener("click", toggleLanguage);

  const currentYear = document.getElementById("currentYear");
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
});
