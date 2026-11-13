/* Light / dark button for every page on yourastro.space (main page, /notes, /terminal, /SPHEREx).
   All of them live on one domain, so one saved choice in localStorage covers the whole site.
   Each page sets data-theme early in <head> (a two-line inline script) so there is no flash;
   this file wires the .theme-toggle buttons and keeps embedded iframes in step.
   Light is the default; dark only when someone presses the button. */
(function () {
    var KEY = 'yas-theme';
    var root = document.documentElement;

    function current() { return root.dataset.theme === 'dark' ? 'dark' : 'light'; }

    function syncFrames(t) {
        document.querySelectorAll('iframe').forEach(function (f) {
            try { if (f.contentDocument) f.contentDocument.documentElement.dataset.theme = t; } catch (e) {}
        });
    }

    function paint() {
        var t = current(), dark = t === 'dark';
        document.querySelectorAll('.theme-toggle').forEach(function (b) {
            b.setAttribute('aria-pressed', String(dark));
            b.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
            b.title = dark ? 'Light mode' : 'Dark mode';
        });
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg').trim() || getComputedStyle(root).getPropertyValue('--bg-color').trim() || (dark ? '#070b2e' : '#f2f2f2'));
        syncFrames(t);
    }

    function set(t) {
        root.dataset.theme = t;
        try { localStorage.setItem(KEY, t); } catch (e) {}
        paint();
        window.dispatchEvent(new Event('themechange'));
    }

    document.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('.theme-toggle');
        if (b) set(current() === 'dark' ? 'light' : 'dark');
    });
    document.querySelectorAll('iframe').forEach(function (f) { f.addEventListener('load', paint); });
    /* another tab changed the theme */
    window.addEventListener('storage', function (e) {
        if (e.key === KEY && e.newValue) { root.dataset.theme = e.newValue; paint(); window.dispatchEvent(new Event('themechange')); }
    });
    paint();
})();
