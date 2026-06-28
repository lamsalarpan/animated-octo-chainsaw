// Theme (dark/light mode) handling
// Applies saved preference immediately, falls back to system preference,
// and wires up any .theme-toggle-btn on the page.
(function () {
  const STORAGE_KEY = "arpan-theme";

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    updateToggleIcons(theme);
  }

  function updateToggleIcons(theme) {
    document.querySelectorAll(".theme-toggle-btn i").forEach((icon) => {
      icon.className = theme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
    });
    document.querySelectorAll(".theme-toggle-btn").forEach((btn) => {
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
      btn.title = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    });
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  // Apply theme as early as possible (before DOMContentLoaded) to avoid a flash of the wrong theme
  applyTheme(getPreferredTheme());

  document.addEventListener("DOMContentLoaded", () => {
    updateToggleIcons(document.documentElement.getAttribute("data-theme") || "light");
    document.querySelectorAll(".theme-toggle-btn").forEach((btn) => {
      btn.addEventListener("click", toggleTheme);
    });
  });

  // Keep in sync if the user changes their OS-level setting and hasn't manually chosen
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });
})();
