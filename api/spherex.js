// AI disclosure: written with Claude (Anthropic) during NASA Space Apps Milano 2026, from the team's instructions,
// and checked by the team. See SPHEREx-site README, "AI use".
// SPHEREx relay for yourastro.space/SPHEREx: any sky position, not only the five targets.
// NASA/IPAC IRSA does not send CORS headers, so the browser cannot read SPHEREx cutouts itself.
// This function asks IRSA for them, cuts each one onto the page's fixed north-up grid, and hands back
// the same small int16 images that the Python tool in SPHEREx-site/tool/ makes with astropy.
//
//   GET /api/spherex?op=find&ra=..&dec=..&band=D1          every DR1 exposure covering the point (IRSA SIA)
//   GET /api/spherex?op=frame&uri=..&cra=..&cdec=..&size=..&gra=..&gdec=..&npix=..&tra=..&tdec=..&mask=0|1
//   GET /api/spherex?op=cat&kind=gaia|catwise&ra=..&dec=..&r=..   catalogue sources for the overlays (IRSA TAP)
//   GET /api/spherex?op=exo&q=TRAPPIST                     exoplanets and hosts by name (NASA Exoplanet Archive)
//
// It only fetches SPHEREx file paths from irsa.ipac.caltech.edu, a fixed Gaia query from ESA, and a fixed
// planet query from the NASA Exoplanet Archive (which also sends no CORS headers), so it is not an open proxy.
"use strict";

const IRSA = "https://irsa.ipac.caltech.edu";
const COLLECTION = "spherex_dr1";              // a newer SPHEREx release only needs this name changed
const PIX_DEG = 6.15 / 3600;                   // SPHEREx pixel
const BAD_BITS = [0, 1, 6, 9, 10, 11, 15, 17, 19].reduce((s, b) => s + 2 ** b, 0);   // same as the Python tool
const D2R = Math.PI / 180;

// ---------- small helpers ----------
const num = (q, k, lo, hi) => {
  const v = Number(q[k]);
  if (!Number.isFinite(v) || v < lo || v > hi) throw new RangeError(`${k} must be a number from ${lo} to ${hi}`);
  return v;
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchRetry(url, opts = {}, tries = 4, budgetMs = 50000) {
  const t0 = Date.now();
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { ...opts, signal: AbortSignal.timeout(Math.max(5000, budgetMs - (Date.now() - t0))) });
      if (r.ok) return r;
      last = new Error(`IRSA answered ${r.status}`);
      if (r.status < 500) throw last;
    } catch (e) { last = e; if (e instanceof RangeError) throw e; }
    if (Date.now() - t0 > budgetMs - 8000) break;
    await sleep(1500 * 2 ** i);                // IRSA gives short 502 and 503 bursts
  }
  throw last;
}

// ---------- VOTable (TABLEDATA) and CSV ----------
function votable(xml) {
  const names = [...xml.matchAll(/<FIELD\b[^>]*\bname="([^"]*)"/g)].map((m) => m[1]);
  const un = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
  return [...xml.matchAll(/<TR>([\s\S]*?)<\/TR>/g)].map((m) => {
    const cells = [...m[1].matchAll(/<TD>([\s\S]*?)<\/TD>|<TD\/>/g)].map((c) => un(c[1] || ""));
    return Object.fromEntries(names.map((n, i) => [n, cells[i]]));
  });
}
function csv(text) {
  const lines = text.trim().split(/\r?\n/);
  const head = lines.shift().split(",");
  return lines.map((l) => Object.fromEntries(l.split(",").map((v, i) => [head[i], v])));
}

// ---------- FITS: just enough for SPHEREx Level 2 cutouts ----------
function fitsHDUs(buf) {
  const out = [];
  let off = 0;
  while (off + 2880 <= buf.length) {
    const cards = {};
    let i = off, done = false;
    while (!done && i + 80 <= buf.length) {
      const card = buf.toString("latin1", i, i + 80); i += 80;
      if (card.startsWith("END ") || card === "END".padEnd(80)) done = true;
      else if (card[8] === "=" ) {
        let v = card.slice(10), q = v.indexOf("'");
        if (q >= 0 && v.slice(0, q).trim() === "") v = v.slice(q + 1, v.indexOf("'", q + 1)).trim();
        else v = v.split("/")[0].trim();
        cards[card.slice(0, 8).trim()] = v;
      }
    }
    if (!done) break;
    const data = Math.ceil((i - off) / 2880) * 2880 + off;
    const naxis = +cards.NAXIS || 0;
    let size = naxis ? Math.abs(+cards.BITPIX) / 8 : 0;
    for (let k = 1; k <= naxis; k++) size *= +cards[`NAXIS${k}`];
    size += +(cards.PCOUNT || 0);
    out.push({ h: cards, data, size, name: cards.EXTNAME || (out.length ? "" : "PRIMARY") });
    off = data + Math.ceil(size / 2880) * 2880;
  }
  return out;
}
function readImage(buf, hdu) {
  const nx = +hdu.h.NAXIS1, ny = +hdu.h.NAXIS2, bp = +hdu.h.BITPIX, a = new Float64Array(nx * ny);
  for (let k = 0; k < nx * ny; k++) {
    const o = hdu.data + k * 4;
    a[k] = bp === -32 ? buf.readFloatBE(o) : buf.readInt32BE(o);
  }
  return { nx, ny, a };
}

// sky (deg) -> 0-based pixel of a TAN-SIP header, using the inverse polynomial AP, BP
function makeSkyToPix(h) {
  const g = (k, d = 0) => (h[k] === undefined ? d : +h[k]);
  const cd = h.CD1_1 !== undefined
    ? [g("CD1_1"), g("CD1_2"), g("CD2_1"), g("CD2_2")]
    : [g("PC1_1", 1) * g("CDELT1", 1), g("PC1_2") * g("CDELT1", 1), g("PC2_1") * g("CDELT2", 1), g("PC2_2", 1) * g("CDELT2", 1)];
  const det = cd[0] * cd[3] - cd[1] * cd[2];
  const inv = [cd[3] / det, -cd[1] / det, -cd[2] / det, cd[0] / det];
  const a0 = g("CRVAL1") * D2R, d0 = g("CRVAL2") * D2R, crp1 = g("CRPIX1"), crp2 = g("CRPIX2");
  const ord = g("AP_ORDER"), AP = [], BP = [];
  for (let p = 0; p <= ord; p++) for (let q = 0; p + q <= ord; q++) {
    const ap = g(`AP_${p}_${q}`), bp = g(`BP_${p}_${q}`);
    if (ap || bp) { AP.push([p, q, ap]); BP.push([p, q, bp]); }
  }
  return (ra, dec) => {
    const a = ra * D2R, d = dec * D2R, da = a - a0;
    const cosc = Math.sin(d0) * Math.sin(d) + Math.cos(d0) * Math.cos(d) * Math.cos(da);
    if (cosc <= 0) return [NaN, NaN];
    const xi = (Math.cos(d) * Math.sin(da) / cosc) / D2R;
    const eta = ((Math.cos(d0) * Math.sin(d) - Math.sin(d0) * Math.cos(d) * Math.cos(da)) / cosc) / D2R;
    const U = inv[0] * xi + inv[1] * eta, V = inv[2] * xi + inv[3] * eta;
    let u = U, v = V;
    for (const [p, q, c] of AP) u += c * U ** p * V ** q;
    for (const [p, q, c] of BP) v += c * U ** p * V ** q;
    return [u + crp1 - 1, v + crp2 - 1];
  };
}

// The per-pixel wavelength: WAVE-TAB, a bilinear lookup table on detector coordinates (FITS Paper III).
// The table sits at the very end of each cutout, after a 3.8 MB PSF table we do not need, and it is the
// same calibration (spectral_wcs_<detector>_v2.2) for every DR1 exposure of a detector. So it is kept
// here, read from the WCS-WAVE extension of DR1 files on 14 November 2026, and each download stops
// after the first ~60 kB. Wavelength in microns; W is listed with X fastest.
const WAVE = {"D1":{"X":[1,256,511,766,1021,1275,1530,1785,2040],"Y":[1,256,511,766,1021,1275,1530,1785,2040],"W":[1.12617,1.12085,1.11724,1.11522,1.11457,1.11516,1.11738,1.12119,1.12628,1.06942,1.06428,1.06043,1.05846,1.05779,1.05866,1.06082,1.06452,1.0697,1.01519,1.01029,1.00669,1.00465,1.00392,1.00479,1.00708,1.01076,1.01565,0.96378,0.95896,0.95555,0.9536,0.95287,0.95369,0.9557,0.95923,0.96398,0.91509,0.91047,0.90704,0.90508,0.9043,0.9051,0.90727,0.91074,0.91561,0.86897,0.86446,0.86119,0.85922,0.85853,0.85946,0.86139,0.86474,0.86938,0.82559,0.82087,0.81771,0.81569,0.81543,0.81577,0.81786,0.82121,0.82601,0.78395,0.77914,0.77618,0.77428,0.7739,0.77427,0.77602,0.77939,0.78387,0.74438,0.74031,0.73728,0.73553,0.7349,0.73586,0.73772,0.7408,0.74502]},"D2":{"X":[1,205,409,613,817,1021,1224,1428,1632,1836,2040],"Y":[1,205,409,613,817,1021,1224,1428,1632,1836,2040],"W":[1.6677,1.66112,1.65633,1.65266,1.65067,1.65008,1.65082,1.65306,1.65661,1.66159,1.66746,1.59995,1.59372,1.58889,1.58528,1.58336,1.58253,1.58336,1.58557,1.58917,1.5942,1.60042,1.53422,1.52788,1.52302,1.51957,1.51736,1.51681,1.51766,1.51972,1.52326,1.52833,1.53472,1.47056,1.4645,1.45973,1.45634,1.4543,1.45398,1.45464,1.45668,1.46009,1.46507,1.47115,1.41026,1.40445,1.39986,1.39663,1.39468,1.39414,1.39489,1.39687,1.40017,1.40482,1.41078,1.35329,1.34749,1.34296,1.33977,1.33795,1.3374,1.33802,1.34009,1.34339,1.34792,1.35379,1.29887,1.29327,1.28867,1.28545,1.28362,1.28323,1.28381,1.28581,1.28916,1.29366,1.29936,1.24619,1.24047,1.2361,1.23315,1.23114,1.23071,1.23111,1.23338,1.2365,1.24088,1.24649,1.19526,1.18979,1.18542,1.1823,1.18063,1.1801,1.18066,1.18283,1.18557,1.19005,1.19588,1.14603,1.14093,1.13669,1.13376,1.13206,1.1313,1.1321,1.13395,1.13682,1.1412,1.14671,1.10064,1.09491,1.09082,1.08817,1.08612,1.08592,1.08637,1.08846,1.09102,1.0954,1.10063]},"D3":{"X":[1,256,511,766,1021,1275,1530,1785,2040],"Y":[1,36,71,105,140,141,379,617,855,1091,1326,1564,1802,2040],"W":[2.43266,2.42665,2.42264,2.41956,2.41917,2.42026,2.42313,2.42806,2.43907,2.42453,2.41715,2.41276,2.40943,2.40862,2.41036,2.41351,2.41891,2.42496,2.41334,2.40619,2.3996,2.39559,2.39414,2.3955,2.40053,2.40741,2.41535,2.40138,2.39175,2.38404,2.37932,2.37803,2.37946,2.38473,2.39254,2.40309,2.38599,2.37529,2.36793,2.36312,2.36173,2.36337,2.36841,2.37619,2.38727,2.38545,2.37496,2.36738,2.36277,2.36117,2.36286,2.36791,2.37569,2.38686,2.27755,2.26665,2.25907,2.25442,2.25314,2.25461,2.25926,2.26736,2.27826,2.17294,2.16181,2.15438,2.15005,2.14848,2.15031,2.15505,2.16308,2.17357,2.07204,2.06146,2.05413,2.04986,2.04849,2.05002,2.05465,2.06254,2.07311,1.97752,1.96738,1.9604,1.95603,1.95464,1.95612,1.96065,1.96801,1.97863,1.88754,1.87776,1.87053,1.86639,1.86498,1.86651,1.87094,1.87848,1.88861,1.79991,1.7899,1.78262,1.77862,1.77737,1.77878,1.78314,1.79032,1.80066,1.71654,1.70687,1.70017,1.69615,1.6947,1.69627,1.70052,1.70767,1.7175,1.63787,1.62847,1.62149,1.61765,1.61626,1.61783,1.62185,1.62901,1.63858]},"D4":{"X":[1,171,341,511,681,851,1021,1190,1360,1530,1700,1870,2040],"Y":[1,151,301,451,601,751,901,1050,1200,1350,1500,1650,1800,1801,1841,1881,1921,1960,2000,2040],"W":[3.86286,3.85413,3.84103,3.83153,3.82503,3.81816,3.81808,3.81796,3.82145,3.82896,3.83926,3.84762,3.86216,3.7351,3.72245,3.70892,3.70243,3.69392,3.68922,3.68874,3.6894,3.69348,3.6976,3.70734,3.72051,3.73145,3.60955,3.59455,3.58448,3.57591,3.56832,3.56304,3.56275,3.56326,3.5683,3.57291,3.58125,3.59046,3.60807,3.48857,3.47198,3.46249,3.45345,3.44574,3.4426,3.44156,3.44207,3.44541,3.45152,3.45993,3.47024,3.48396,3.36907,3.35534,3.34437,3.33483,3.32872,3.32424,3.32303,3.32303,3.32746,3.33352,3.34134,3.35237,3.36638,3.25417,3.24048,3.2293,3.22023,3.21377,3.20972,3.20813,3.21048,3.21292,3.21857,3.2264,3.23703,3.24995,3.14187,3.12869,3.1171,3.10963,3.1026,3.09915,3.09663,3.09705,3.10065,3.10669,3.11478,3.12557,3.13746,3.03465,3.01968,3.00927,3.00111,2.99369,2.99036,2.98941,2.99144,2.99293,2.99872,3.00614,3.01683,3.02991,2.92913,2.91608,2.9053,2.89649,2.89002,2.88692,2.88545,2.88584,2.88956,2.89617,2.90294,2.91303,2.92379,2.82776,2.81504,2.80488,2.79595,2.79069,2.78707,2.78518,2.78635,2.78928,2.79447,2.80222,2.81229,2.82419,2.73059,2.71793,2.708,2.69975,2.69443,2.69144,2.68981,2.6907,2.69361,2.69879,2.70594,2.71536,2.72667,2.63746,2.62523,2.61538,2.60763,2.60121,2.59758,2.59678,2.5974,2.59992,2.60535,2.6129,2.62267,2.63385,2.54738,2.53555,2.52547,2.51746,2.51181,2.50844,2.50682,2.50799,2.51096,2.5157,2.5236,2.53249,2.54373,2.54686,2.53492,2.52479,2.51693,2.51139,2.50776,2.5063,2.50744,2.51049,2.51515,2.52292,2.5319,2.54311,2.5226,2.51111,2.50159,2.49304,2.48752,2.48419,2.48277,2.48357,2.48619,2.49174,2.49893,2.5088,2.52012,2.49929,2.48765,2.47772,2.47039,2.46545,2.46281,2.46127,2.46165,2.46443,2.4688,2.47575,2.48473,2.49622,2.47601,2.4651,2.45753,2.45124,2.44737,2.44477,2.44341,2.44467,2.44588,2.44949,2.45491,2.46277,2.47307,2.4563,2.44754,2.44128,2.4369,2.43303,2.43141,2.43011,2.43038,2.43202,2.43498,2.43965,2.44504,2.45337,2.44036,2.43315,2.42711,2.42195,2.41792,2.41546,2.41304,2.41361,2.41601,2.42028,2.42548,2.43109,2.43778,2.42784,2.41877,2.41131,2.40491,2.40632,2.40021,2.39803,2.39964,2.40127,2.40295,2.40994,2.41619,2.42531]},"D5":{"X":[1,205,409,613,817,1021,1224,1428,1632,1836,2040],"Y":[1,205,409,613,817,1021,1224,1428,1632,1836,2040],"W":[4.44256,4.4365,4.43174,4.42787,4.42589,4.42462,4.42531,4.427,4.43023,4.43463,4.43035,4.37719,4.37088,4.36577,4.36211,4.35981,4.35878,4.3594,4.36099,4.36413,4.3688,4.37462,4.3121,4.30546,4.30068,4.29699,4.2947,4.29369,4.29406,4.29596,4.29912,4.30378,4.30954,4.2481,4.24174,4.23642,4.23263,4.23012,4.22918,4.22954,4.23151,4.23468,4.23956,4.24558,4.18472,4.17797,4.17272,4.1689,4.16642,4.16545,4.16579,4.16774,4.17118,4.17585,4.18194,4.12163,4.11486,4.10943,4.10557,4.10309,4.10207,4.10262,4.10458,4.10787,4.11264,4.11885,4.05955,4.05258,4.04732,4.04346,4.04075,4.03979,4.0402,4.04221,4.04567,4.05053,4.05675,3.998,3.991,3.98541,3.98149,3.97882,3.97781,3.97831,3.98039,3.98373,3.98879,3.99533,3.93712,3.9302,3.92458,3.92069,3.91805,3.91698,3.91752,3.91956,3.9229,3.92796,3.93439,3.87773,3.87062,3.86498,3.86096,3.85848,3.8575,3.85797,3.85976,3.86338,3.86836,3.87468,3.81942,3.8122,3.80656,3.80233,3.79952,3.79838,3.79903,3.80104,3.8047,3.80969,3.81639]},"D6":{"X":[1,256,511,766,1021,1275,1530,1785,2040],"Y":[1,256,511,766,1021,1275,1530,1785,2040],"W":[5.02461,5.01593,5.01099,5.0085,5.00534,5.00734,5.01013,5.01627,5.02345,4.94389,4.93669,4.93087,4.92782,4.92623,4.9277,4.93045,4.93608,4.94372,4.86465,4.85714,4.85205,4.84838,4.84708,4.84837,4.8513,4.85642,4.86408,4.78781,4.78054,4.77561,4.77196,4.77053,4.77141,4.7749,4.77988,4.78716,4.71254,4.70486,4.69917,4.69503,4.69495,4.69539,4.69838,4.70423,4.71152,4.63738,4.62919,4.62413,4.6203,4.61902,4.61977,4.62347,4.62848,4.63625,4.5629,4.55553,4.54923,4.54635,4.54474,4.54567,4.54897,4.55427,4.56169,4.49077,4.48306,4.47725,4.47345,4.47228,4.47307,4.47658,4.48193,4.48969,4.42127,4.41319,4.40686,4.40304,4.40175,4.40271,4.40625,4.41208,4.42008]}};
function makeWavelength(h) {
  const t = WAVE["D" + String(h.DETECTOR).trim()];
  if (!t) return () => null;
  const nx = t.X.length, ny = t.Y.length;
  const idx = (arr, v) => {                       // fractional 0-based index of v among the control points
    if (v <= arr[0]) return 0;
    for (let i = 0; i < arr.length - 1; i++) if (v <= arr[i + 1]) return i + (v - arr[i]) / (arr[i + 1] - arr[i]);
    return arr.length - 1;
  };
  const val = (i, j) => t.W[i + nx * j];
  const c1 = +h.CRVAL1W, c2 = +h.CRVAL2W, p1 = +h.CRPIX1W, p2 = +h.CRPIX2W, s1 = +h.CDELT1W || 1, s2 = +h.CDELT2W || 1;
  return (x0, y0) => {                             // 0-based cutout pixel
    const fx = idx(t.X, c1 + s1 * (x0 + 1 - p1)), fy = idx(t.Y, c2 + s2 * (y0 + 1 - p2));
    const i = Math.min(nx - 2, Math.floor(fx)), j = Math.min(ny - 2, Math.floor(fy)), tx = fx - i, ty = fy - j;
    return (1 - tx) * (1 - ty) * val(i, j) + tx * (1 - ty) * val(i + 1, j) + (1 - tx) * ty * val(i, j + 1) + tx * ty * val(i + 1, j + 1);
  };
}

// the page's grid: north-up TAN, SPHEREx pixels, centre (gra, gdec) on pixel crpix0 (0-based)
function gridToSky(x, y, gra, gdec, c0) {
  const P = PIX_DEG * D2R, xi = -(x - c0) * P, eta = (y - c0) * P, rho = Math.hypot(xi, eta), d0 = gdec * D2R;
  if (rho === 0) return [gra, gdec];
  const c = Math.atan(rho);
  const ra = gra * D2R + Math.atan2(xi * Math.sin(c), rho * Math.cos(d0) * Math.cos(c) - eta * Math.sin(d0) * Math.sin(c));
  const dec = Math.asin(Math.cos(c) * Math.sin(d0) + eta * Math.sin(c) * Math.cos(d0) / rho);
  return [((ra / D2R) % 360 + 360) % 360, dec / D2R];
}
function skyToGrid(ra, dec, gra, gdec, c0) {
  const a = ra * D2R, d = dec * D2R, a0 = gra * D2R, d0 = gdec * D2R, da = a - a0;
  const cosc = Math.sin(d0) * Math.sin(d) + Math.cos(d0) * Math.cos(d) * Math.cos(da);
  const xi = Math.cos(d) * Math.sin(da) / cosc, eta = (Math.cos(d0) * Math.sin(d) - Math.sin(d0) * Math.cos(d) * Math.cos(da)) / cosc;
  return [c0 - xi / (PIX_DEG * D2R), c0 + eta / (PIX_DEG * D2R)];
}

// value = lo + scale * (code + 32767), code -32768 = no data; the same packing as tool/server.py
function pack(img) {
  let lo = Infinity, hi = -Infinity;
  for (const v of img) if (Number.isFinite(v)) { if (v < lo) lo = v; if (v > hi) hi = v; }
  const codes = new Int16Array(img.length);
  if (lo === Infinity) { codes.fill(-32768); return { lo: 0, scale: 1, image: Buffer.from(codes.buffer).toString("base64") }; }
  lo = Math.round(lo * 1e6) / 1e6;
  const scale = Number(((hi - lo) / 65534 || 1).toPrecision(6));
  img.forEach((v, k) => { codes[k] = Number.isFinite(v) ? Math.max(-32767, Math.min(32767, Math.round((v - lo) / scale - 32767))) : -32768; });
  return { lo, scale, image: Buffer.from(codes.buffer).toString("base64") };   // Int16Array is little-endian on x86 and ARM
}

// one exposure onto the grid: zodiacal light off, flagged pixels optional, bilinear like scipy order=1
function cutToGrid(buf, p) {
  const hdus = fitsHDUs(buf), get = (n) => hdus.find((x) => x.name === n);
  const hi = get("IMAGE"), hz = get("ZODI"), hf = get("FLAGS");
  if (!hi || !hz || !hf) throw new Error("cutout is missing the IMAGE, ZODI or FLAGS extension");
  const im = readImage(buf, hi), zo = readImage(buf, hz), fl = readImage(buf, hf);
  const nx = im.nx, ny = im.ny, sci = new Float64Array(nx * ny);
  for (let k = 0; k < sci.length; k++) sci[k] = (p.mask && (fl.a[k] & BAD_BITS)) ? NaN : im.a[k] - zo.a[k];
  const toPix = makeSkyToPix(hi.h), c0 = Math.floor(p.npix / 2), out = new Array(p.npix * p.npix);
  for (let y = 0; y < p.npix; y++) for (let x = 0; x < p.npix; x++) {
    const [px, py] = toPix(...gridToSky(x, y, p.gra, p.gdec, c0));
    const i = Math.floor(px), j = Math.floor(py), tx = px - i, ty = py - j;
    if (!(i >= 0 && j >= 0 && i + 1 < nx && j + 1 < ny)) { out[y * p.npix + x] = NaN; continue; }
    const v00 = sci[j * nx + i], v10 = sci[j * nx + i + 1], v01 = sci[(j + 1) * nx + i], v11 = sci[(j + 1) * nx + i + 1];
    out[y * p.npix + x] = (1 - tx) * (1 - ty) * v00 + tx * (1 - ty) * v10 + (1 - tx) * ty * v01 + tx * ty * v11;
  }
  const [tpx, tpy] = toPix(p.tra, p.tdec);
  const wl = makeWavelength(hi.h)(tpx, tpy);
  const mjd = +(hi.h["MJD-OBS"] || hi.h["MJD-AVG"]);   // the start, as IRSA lists it
  const t = skyToGrid(p.tra, p.tdec, p.gra, p.gdec, c0);
  return { mjd, wavelength_um: wl === null ? null : Math.round(wl * 1e4) / 1e4,
    target_xy: t.map((v) => Math.round(v * 1000) / 1000), ...pack(out) };
}

// read a cutout only until IMAGE, FLAGS and ZODI are complete, then hang up on the PSF table
async function readFront(r) {
  const reader = r.body.getReader(), parts = [];
  let len = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (value) { parts.push(Buffer.from(value)); len += value.length; }
    const buf = Buffer.concat(parts, len);
    const hdus = fitsHDUs(buf);
    const ready = ["IMAGE", "FLAGS", "ZODI"].every((n) => hdus.some((x) => x.name === n && x.data + x.size <= len));
    if (ready || done) { if (!done) reader.cancel().catch(() => {}); return buf; }
    parts.length = 0; parts.push(buf);
  }
}

// ---------- the three operations ----------
async function find(q) {
  const ra = num(q, "ra", 0, 360), dec = num(q, "dec", -90, 90), band = String(q.band || "D1").toUpperCase();
  if (!/^D[1-6]$/.test(band)) throw new RangeError("band must be D1 to D6");
  const url = `${IRSA}/SIA?COLLECTION=${COLLECTION}&POS=circle+${ra}+${dec}+0.0005&RESPONSEFORMAT=VOTABLE`;
  const rows = votable(await (await fetchRetry(url)).text());
  return rows.filter((r) => r.energy_bandpassname === `SPHEREx-${band}` && r.dataproduct_subtype === "science")
    .map((r) => ({ uri: r.access_url.replace(`${IRSA}/`, ""), mjd: +r.t_min }))
    .sort((a, b) => a.mjd - b.mjd);
}

async function frame(q) {
  const uri = String(q.uri || "");
  if (!/^ibe\/data\/spherex\/[\w./-]+\.fits$/.test(uri) || uri.includes("..")) throw new RangeError("uri must be a SPHEREx file in the IRSA archive");
  const p = {
    cra: num(q, "cra", 0, 360), cdec: num(q, "cdec", -90, 90), size: num(q, "size", 0.005, 0.35),
    gra: num(q, "gra", 0, 360), gdec: num(q, "gdec", -90, 90), npix: Math.round(num(q, "npix", 3, 201)),
    tra: num(q, "tra", 0, 360), tdec: num(q, "tdec", -90, 90), mask: q.mask === "1",
  };
  const r = await fetchRetry(`${IRSA}/${uri}?center=${p.cra},${p.cdec}deg&size=${p.size}`);
  return cutToGrid(await readFront(r), p);
}

const CATALOGS = {
  gaia: "SELECT TOP 2000 ra, dec, pmra, pmdec, phot_g_mean_mag AS mag FROM gaia_dr3_source WHERE 1 = CONTAINS(POINT('ICRS', ra, dec), CIRCLE('ICRS', {ra}, {dec}, {r})) ORDER BY phot_g_mean_mag",
  catwise: "SELECT TOP 2000 ra_pm AS ra, dec_pm AS dec, pmra, pmdec, w2mpro AS mag FROM catwise_2020 WHERE 1 = CONTAINS(POINT('ICRS', ra, dec), CIRCLE('ICRS', {ra}, {dec}, {r})) ORDER BY w2mpro",
};
// Gaia DR3 straight from ESA's Gaia archive, which answers in seconds; IRSA's copy is the fallback
const ESA_TAP = "https://gea.esac.esa.int/tap-server/tap/sync";
async function cat(q) {
  const kind = String(q.kind || "");
  if (!CATALOGS[kind]) throw new RangeError("kind must be gaia or catwise");
  const query = CATALOGS[kind].replace("{ra}", num(q, "ra", 0, 360)).replace("{dec}", num(q, "dec", -90, 90)).replace("{r}", num(q, "r", 0.001, 0.4));
  const ask = async (url, adql, tries, budget) => {
    const body = new URLSearchParams({ QUERY: adql, FORMAT: "csv", LANG: "ADQL", REQUEST: "doQuery" });
    const r = await fetchRetry(url, { method: "POST", body }, tries, budget);
    return csv(await r.text()).map((x) => [+x.ra, +x.dec, +(x.pmra || 0), +(x.pmdec || 0), x.mag === "" || x.mag === undefined ? null : +x.mag]);
  };
  if (kind === "gaia") {
    try { return await ask(ESA_TAP, query.replace("gaia_dr3_source", "gaiadr3.gaia_source"), 2, 20000); }
    catch { /* fall through to IRSA */ }
  }
  return ask(`${IRSA}/TAP/sync`, query, 3, 30000);
}

// ---------- exoplanet hosts by name, from the NASA Exoplanet Archive (Planetary Systems Composite table) ----------
// Its positions are Gaia DR2 at epoch 2015.5 (Barnard's star checks out to the mas), so the page sets that epoch.
const EXO_TAP = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync";
async function exo(q) {
  const term = String(q.q || "").trim().toUpperCase();
  if (term.length < 2 || term.length > 40 || !/^[A-Z0-9 .+\-_'()]+$/.test(term)) throw new RangeError("q must be 2 to 40 letters, digits, spaces or . + - _ ' ( )");
  const like = term.replace(/'/g, "''");
  const adql = "SELECT TOP 40 pl_name, hostname, ra, dec, sy_pmra, sy_pmdec, sy_dist, sy_kmag, disc_year, discoverymethod FROM pscomppars " +
    `WHERE UPPER(pl_name) LIKE '%${like}%' OR UPPER(hostname) LIKE '%${like}%' ORDER BY hostname, pl_name`;
  const r = await fetchRetry(`${EXO_TAP}?${new URLSearchParams({ query: adql, format: "json" })}`, {}, 3, 25000);
  const f = (v) => (v === null || v === undefined || v === "" ? null : +v);
  return (await r.json()).map((x) => ({
    name: x.pl_name, host: x.hostname, ra: f(x.ra), dec: f(x.dec), pmra: f(x.sy_pmra), pmdec: f(x.sy_pmdec),
    dist: f(x.sy_dist), kmag: f(x.sy_kmag), year: f(x.disc_year), method: x.discoverymethod || "",
  })).filter((x) => x.ra !== null && x.dec !== null);
}

module.exports = async function handler(req, res) {
  const q = Object.fromEntries(new URL(req.url, "http://x").searchParams);
  const send = (code, obj, cache) => {
    res.statusCode = code;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", cache || "no-store");
    res.end(JSON.stringify(obj));
  };
  try {
    if (q.op === "find") return send(200, { rows: await find(q) }, "public, s-maxage=86400");
    if (q.op === "frame") return send(200, await frame(q), "public, s-maxage=2592000, immutable");
    if (q.op === "cat") return send(200, { rows: await cat(q) }, "public, s-maxage=604800");
    if (q.op === "exo") return send(200, { rows: await exo(q) }, "public, s-maxage=86400");
    return send(400, { error: "op must be find, frame, cat or exo" });
  } catch (e) {
    return send(e instanceof RangeError ? 400 : 502, { error: e.message || String(e) });
  }
};
module.exports.cutToGrid = cutToGrid;
module.exports.votable = votable;
module.exports.exo = exo;
