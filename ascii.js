/* ASCII star field behind the first screen: pure text, drawn to fit, twinkles slowly. */
(function () {
    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- star field ---- */
    var sky = document.querySelector('.sky');
    if (sky) {
        var GLYPHS = ['.', '.', '.', '·', '·', '+', '*', '✦'];
        var cols = 0, rows = 0, grid = [];
        function measure() {
            var probe = document.createElement('span');
            probe.textContent = 'MMMMMMMMMM';
            sky.appendChild(probe);
            var r = probe.getBoundingClientRect();
            sky.removeChild(probe);
            return { w: r.width / 10 || 8, h: r.height || 16 };
        }
        function build() {
            var box = sky.parentElement.getBoundingClientRect(), ch = measure();
            cols = Math.max(10, Math.floor(box.width / ch.w));
            rows = Math.max(5, Math.floor(box.height / ch.h));
            grid = [];
            for (var y = 0; y < rows; y++) {
                var line = [];
                for (var x = 0; x < cols; x++) line.push(Math.random() < 0.035 ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : ' ');
                grid.push(line);
            }
            draw();
        }
        function draw() { sky.textContent = grid.map(function (l) { return l.join(''); }).join('\n'); }
        function twinkle() {
            for (var k = 0; k < Math.max(3, (rows * cols) / 400); k++) {
                var y = (Math.random() * rows) | 0, x = (Math.random() * cols) | 0;
                grid[y][x] = grid[y][x] === ' ' ? (Math.random() < 0.5 ? '.' : GLYPHS[(Math.random() * GLYPHS.length) | 0]) : ' ';
            }
            draw();
        }
        build();
        var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(build, 200); });
        if (!still) setInterval(function () { if (!document.hidden) twinkle(); }, 700);
    }

})();
