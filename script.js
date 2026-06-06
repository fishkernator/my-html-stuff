/* Inkwork — a little bit of interactivity.
   Right now this only does one thing: the light/dark mode toggle,
   remembering your choice between visits. Add more here as the site grows. */

(function () {
  var root = document.documentElement;
  var btn = document.getElementById('themeToggle');

  // Restore the visitor's saved preference (if any) on load.
  var saved = localStorage.getItem('inkwork-theme');
  if (saved) {
    root.setAttribute('data-theme', saved);
  }
  syncLabel();

  if (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('inkwork-theme', next);
      syncLabel();
    });
  }

  // Button shows the mode you can switch TO.
  function syncLabel() {
    if (!btn) return;
    btn.textContent = root.getAttribute('data-theme') === 'dark' ? 'Light' : 'Dark';
  }
})();
