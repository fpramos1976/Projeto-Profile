const ICON_MOON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
const ICON_SUN =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';

function getSavedTheme() {
  try {
    return localStorage.getItem("theme");
  } catch (error) {
    return null;
  }
}

function getInitialTheme() {
  const saved = getSavedTheme();
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

  buttonDarkMode.innerHTML = theme === "dark" ? ICON_SUN : ICON_MOON;
  buttonDarkMode.setAttribute(
    "aria-label",
    theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"
  );
}

function setTheme(theme, save) {
  document.documentElement.setAttribute("data-theme", theme);
  updateToggleButton(theme);
  if (save) {
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      // localStorage indisponível (ex.: modo privado): o tema só não fica salvo
    }
  }
}

function toggleDarkMode() {
  const current = document.documentElement.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark", true);
}

// Aplica o tema imediatamente (o script está no <head>) para evitar "piscar" a tela
setTheme(getInitialTheme(), false);

document.addEventListener("DOMContentLoaded", function () {
  updateToggleButton(document.documentElement.getAttribute("data-theme"));
  document.getElementById("toggleDarkMode").addEventListener("click", toggleDarkMode);

  const currentYear = document.getElementById("currentYear");
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
});
