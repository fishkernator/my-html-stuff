/* The Porch — interactivity.
   1. Dark mode by default (remembers your choice).
   2. Hover link-popups (Gwern-style preview cards).
   3. § self-links appended to headings.
   4. Scrollspy: the contents rail highlights your current section. */

(function () {
  var root = document.documentElement;

  /* ---- 1. Theme: dark unless chosen otherwise -------------------------- */
  var saved = localStorage.getItem('porch-theme');
  if (saved) root.setAttribute('data-theme', saved);
  var btn = document.getElementById('themeToggle');
  function label() { if (btn) btn.textContent = root.getAttribute('data-theme') === 'dark' ? 'Light' : 'Dark'; }
  label();
  if (btn) btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('porch-theme', next);
    label();
  });

  /* ---- 2. Hover link-popups ------------------------------------------- */
  var pop = document.createElement('div');
  pop.className = 'popup';
  document.body.appendChild(pop);
  var hideTimer;
  function esc(s) { return (s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function show(a) {
    clearTimeout(hideTimer);
    var title = a.getAttribute('data-title') || a.textContent;
    var status = a.getAttribute('data-status');
    var note = a.getAttribute('data-note');
    pop.innerHTML = '<span class="pt">' + esc(title) + '</span>' +
      (status ? '<span class="ps">' + esc(status) + '</span>' : '') +
      (note ? '<span class="pn">' + esc(note) + '</span>' : '');
    pop.style.display = 'block';
    var r = a.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var left = window.scrollX + r.left;
    var top = window.scrollY + r.bottom + 8;
    if (left + pop.offsetWidth > window.scrollX + vw - 12) left = window.scrollX + vw - pop.offsetWidth - 12;
    if (left < window.scrollX + 8) left = window.scrollX + 8;
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
    requestAnimationFrame(function () { pop.classList.add('show'); });
  }
  function scheduleHide() {
    hideTimer = setTimeout(function () {
      pop.classList.remove('show');
      setTimeout(function () { if (!pop.classList.contains('show')) pop.style.display = 'none'; }, 160);
    }, 130);
  }
  document.querySelectorAll('a.lpop').forEach(function (a) {
    a.addEventListener('mouseenter', function () { show(a); });
    a.addEventListener('mouseleave', scheduleHide);
  });
  pop.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
  pop.addEventListener('mouseleave', scheduleHide);

  /* ---- 3. § self-links on headings ------------------------------------ */
  document.querySelectorAll('article h2[id], article h3[id]').forEach(function (h) {
    var a = document.createElement('a');
    a.className = 'anchor'; a.href = '#' + h.id; a.textContent = '§';
    a.setAttribute('aria-hidden', 'true');
    h.appendChild(a);
  });

  /* ---- 4. Scrollspy: highlight the current section in the rail -------- */
  var rail = document.querySelector('.toc-rail');
  if (rail && 'IntersectionObserver' in window) {
    var links = {};
    rail.querySelectorAll('a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var targets = Object.keys(links).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    if (targets.length) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            Object.keys(links).forEach(function (id) { links[id].classList.remove('cur'); });
            if (links[e.target.id]) links[e.target.id].classList.add('cur');
          }
        });
      }, { rootMargin: '-12% 0px -75% 0px', threshold: 0 });
      targets.forEach(function (t) { obs.observe(t); });
    }
  }
})();
