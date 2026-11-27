(() => {
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem('dennis-blog-theme'); } catch (_) {}
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = saved || (prefersDark ? 'dark' : 'light');

  function updateButtons() {
    const dark = root.dataset.theme === 'dark';
    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      const label = button.querySelector('.theme-label');
      if (label) label.textContent = dark ? 'Light mode' : 'Dark mode';
    });
  }
  document.addEventListener('DOMContentLoaded', () => {
    updateButtons();
    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.addEventListener('click', () => {
        root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem('dennis-blog-theme', root.dataset.theme); } catch (_) {}
        updateButtons();
      });
    });
  });
})();
