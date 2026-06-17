(function () {
  // ---- dark / light mode ----
  var root = document.documentElement;
  function setMode(dark) {
    root.classList.toggle('dark', dark);
    try { localStorage.setItem('mode', dark ? 'dark' : 'light'); } catch (e) {}
    var btn = document.getElementById('mode-toggle');
    if (btn) btn.textContent = dark ? 'view in light mode' : 'view in dark mode';
  }
  var btn = document.getElementById('mode-toggle');
  if (btn) {
    btn.textContent = root.classList.contains('dark') ? 'view in light mode' : 'view in dark mode';
    btn.addEventListener('click', function () { setMode(!root.classList.contains('dark')); });
  }

  // ---- tag co-highlight: hover a tag, all matching labels light up ----
  function wire(selector, attr) {
    document.querySelectorAll(selector).forEach(function (el) {
      var v = el.getAttribute(attr);
      if (!v) return;
      el.addEventListener('mouseenter', function () {
        document.querySelectorAll('[' + attr + '="' + (window.CSS && CSS.escape ? CSS.escape(v) : v) + '"]')
          .forEach(function (m) { m.classList.add('lit'); });
      });
      el.addEventListener('mouseleave', function () {
        document.querySelectorAll('.lit').forEach(function (m) { m.classList.remove('lit'); });
      });
    });
  }
  wire('.tt', 'data-type');
  wire('.topic', 'data-topic');
})();
