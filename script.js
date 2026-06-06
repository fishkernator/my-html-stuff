/* The Porch — interactivity.
   1. Dark mode by default (remembers your choice).
   2. Gwern-style hover link-popups: any <a class="lpop"> with data-title /
      data-status / data-note shows a little preview card on hover. */

(function () {
  var root = document.documentElement;

  /* ---- Theme: dark unless the visitor has chosen otherwise -------------- */
  var saved = localStorage.getItem('porch-theme');
  if (saved) root.setAttribute('data-theme', saved);     // else keep HTML default (dark)

  var btn = document.getElementById('themeToggle');
  function label() {
    if (btn) btn.textContent = root.getAttribute('data-theme') === 'dark' ? 'Light' : 'Dark';
  }
  label();
  if (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('porch-theme', next);
      label();
    });
  }

  /* ---- Hover link-popups ----------------------------------------------- */
  var pop = document.createElement('div');
  pop.className = 'popup';
  document.body.appendChild(pop);
  var hideTimer;

  function esc(s) {
    return (s || '').replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function show(a) {
    clearTimeout(hideTimer);
    var title  = a.getAttribute('data-title')  || a.textContent;
    var status = a.getAttribute('data-status');
    var note   = a.getAttribute('data-note');
    pop.innerHTML =
      '<span class="pt">' + esc(title) + '</span>' +
      (status ? '<span class="ps">' + esc(status) + '</span>' : '') +
      (note   ? '<span class="pn">' + esc(note) + '</span>'   : '');

    pop.style.display = 'block';
    var r = a.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var left = window.scrollX + r.left;
    var top  = window.scrollY + r.bottom + 8;
    if (left + pop.offsetWidth > window.scrollX + vw - 12)
      left = window.scrollX + vw - pop.offsetWidth - 12;
    if (left < window.scrollX + 8) left = window.scrollX + 8;
    pop.style.left = left + 'px';
    pop.style.top  = top + 'px';
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
})();
