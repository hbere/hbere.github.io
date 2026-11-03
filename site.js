
function tok(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }

/* Survey map: isolines of a smooth scalar field, traced by marching squares.
   The avatar's contours, drawn the way a real chart draws them. */
(function () {
  var c = document.getElementById("map");
  if (!c || !c.getContext) return;
  var ctx = c.getContext("2d");

  var bumps = [
    [0.30, 0.20,  1.00, 0.22], [0.74, 0.34, -0.95, 0.20],
    [0.50, 0.72,  0.95, 0.24], [0.10, 0.60, -0.70, 0.19],
    [0.90, 0.82,  0.85, 0.21], [0.62, 0.04,  0.60, 0.16],
    [0.20, 0.92, -0.75, 0.18], [0.96, 0.48,  0.65, 0.17]
  ];
  function field(x, y) {
    var v = 0;
    for (var i = 0; i < bumps.length; i++) {
      var b = bumps[i], dx = x - b[0], dy = y - b[1];
      v += b[2] * Math.exp(-(dx * dx + dy * dy) / (2 * b[3] * b[3]));
    }
    return v + 0.10 * Math.sin(x * 8.3) * Math.cos(y * 6.1);
  }

  function draw() {
    var w = c.clientWidth, h = c.clientHeight;
    if (!w || !h) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    var nx = 104, ny = Math.max(56, Math.round(104 * h / w));
    var g = new Float32Array((nx + 1) * (ny + 1));
    for (var j = 0; j <= ny; j++)
      for (var i = 0; i <= nx; i++)
        g[j * (nx + 1) + i] = field(i / nx, j / ny);

    var cw = w / nx, ch = h / ny;
    var levels = 24;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    var mint = tok("--contour");

    for (var L = 0; L < levels; L++) {
      var lv = -0.95 + (1.95 * L) / (levels - 1);
      var major = L % 4 === 0;
      ctx.strokeStyle = mint;
      ctx.globalAlpha = major ? 0.92 : 0.42;
      ctx.lineWidth = major ? 2.0 : 1.1;
      ctx.beginPath();
      for (var jj = 0; jj < ny; jj++) {
        for (var ii = 0; ii < nx; ii++) {
          var a = g[jj * (nx + 1) + ii],       b2 = g[jj * (nx + 1) + ii + 1],
              d = g[(jj + 1) * (nx + 1) + ii + 1], e = g[(jj + 1) * (nx + 1) + ii];
          var idx = (a > lv ? 8 : 0) | (b2 > lv ? 4 : 0) | (d > lv ? 2 : 0) | (e > lv ? 1 : 0);
          if (idx === 0 || idx === 15) continue;
          var x0 = ii * cw, y0 = jj * ch;
          function lerp(p, q) { return (lv - p) / (q - p || 1e-6); }
          var T = [x0 + cw * lerp(a, b2), y0];
          var R = [x0 + cw, y0 + ch * lerp(b2, d)];
          var B = [x0 + cw * lerp(e, d), y0 + ch];
          var Lf = [x0, y0 + ch * lerp(a, e)];
          function seg(p, q) { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); }
          switch (idx) {
            case 1: case 14: seg(Lf, B); break;
            case 2: case 13: seg(B, R); break;
            case 3: case 12: seg(Lf, R); break;
            case 4: case 11: seg(T, R); break;
            case 6: case 9:  seg(T, B); break;
            case 7: case 8:  seg(Lf, T); break;
            case 5:          seg(Lf, T); seg(B, R); break;
            case 10:         seg(T, R); seg(Lf, B); break;
          }
        }
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  var ro = "ResizeObserver" in window ? new ResizeObserver(draw) : null;
  if (ro) ro.observe(c); else window.addEventListener("resize", draw);
  requestAnimationFrame(draw);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", draw);
})();

/* Copyright year. The markup carries a static 2026 so the notice is right with
   JavaScript off; from 2027 onward this widens it to a range ending in the
   current year (2026–2027, 2026–2028, …). */
(function () {
  var y = new Date().getFullYear();
  if (y > 2026) {
    var spans = document.querySelectorAll(".years");
    for (var i = 0; i < spans.length; i++) spans[i].textContent = "2026\u2013" + y;
  }
})();
