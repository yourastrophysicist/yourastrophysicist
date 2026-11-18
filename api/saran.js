// yourastro.space/PPIItalia/saran, the anonymous question box for PPI Italia.
//
// Storage is a Redis database reached over its REST API (Upstash, added from the Vercel dashboard under
// Storage). The function reads either name pair Vercel creates for it:
//   KV_REST_API_URL + KV_REST_API_TOKEN   or   UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
// and two secrets set by hand in Project Settings > Environment Variables:
//   SARAN_ADMIN_KEY   the key Jessica types on the page to answer, hide, pin and delete
//   SARAN_SALT        any long random string, used to hash IP addresses and browser ids
//
//   GET  /api/saran                      every visible question, its replies, votes and the answer
//   POST /api/saran {op:"ask", text, cat, voter, agree:true}
//   POST /api/saran {op:"reply", id, text, voter}
//   POST /api/saran {op:"vote", id, on, voter}         id is a question id or a reply id
//   POST /api/saran {op:"report", id, voter}
//   POST /api/saran {op:"answer"|"hide"|"pin"|"delete", ...}   header x-admin-key only
//
// Nothing that can name a person is kept. No raw IP and no browser id is stored, only salted hashes,
// and the rate-limit keys that use the IP hash expire after an hour.
"use strict";

const crypto = require("crypto");

const P = "saran:";
const CATS = ["akademik", "dokumen", "keuangan", "kerja", "hidup", "kesehatan", "ppi", "lainnya"];
const LIMITS = { ask: [6, 3600], reply: [30, 3600], vote: [300, 3600], report: [30, 3600] };
const REPORTS_TO_HOLD = 3;
const ANIMALS = ["Komodo", "Cendrawasih", "Anoa", "Tarsius", "Pesut", "Kukang", "Maleo", "Jalak", "Badak", "Tapir",
  "Merak", "Rusa", "Elang", "Kakatua", "Penyu", "Lumba", "Bekantan", "Orangutan", "Kuskus", "Kasuari",
  "Cicak", "Kancil", "Beruang", "Harimau", "Kelinci", "Kupu", "Kunang", "Pinguin", "Lebah", "Kerapu"];

// ---------- Redis over REST ----------
function store() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const call = async (path, body) => {
    const r = await fetch(url.replace(/\/$/, "") + path, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(`store answered ${r.status}`);
    return r.json();
  };
  return {
    cmd: async (...args) => {
      const j = await call("", args);
      if (j.error) throw new Error(j.error);
      return j.result;
    },
    pipe: async (cmds) => {
      if (!cmds.length) return [];
      const j = await call("/pipeline", cmds);
      return j.map((x) => (x.error ? null : x.result));
    },
  };
}

// ---------- small helpers ----------
const SALT = () => process.env.SARAN_SALT || process.env.SARAN_ADMIN_KEY || "change-me";
const hash = (s) => crypto.createHmac("sha256", SALT()).update(String(s)).digest("hex").slice(0, 32);
const newId = (pre) => pre + Date.now().toString(36) + crypto.randomBytes(4).toString("hex");
const clientIp = (req) => String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "0").split(",")[0].trim();

class Bad extends Error { constructor(msg, status = 400) { super(msg); this.status = status; } }

function isAdmin(req) {
  const want = process.env.SARAN_ADMIN_KEY;
  const got = String(req.headers["x-admin-key"] || "");
  if (!want || !got) return false;
  const a = Buffer.from(hash("admin:" + want)), b = Buffer.from(hash("admin:" + got));
  return crypto.timingSafeEqual(a, b);
}

function voterOf(body) {
  const v = String(body.voter || "");
  if (!/^[a-z0-9]{16,64}$/i.test(v)) throw new Bad("bad_voter");
  return hash("voter:" + v);
}

// The page warns about these before sending; the server checks again so the rule holds.
function clean(text, min, max) {
  const t = String(text || "").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "").replace(/\n{3,}/g, "\n\n").trim();
  if (t.length < min) throw new Bad("too_short");
  if (t.length > max) throw new Bad("too_long");
  if (/(https?:\/\/|www\.)\S+/i.test(t)) throw new Bad("no_links");
  if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(t)) throw new Bad("no_email");
  if (/(\+?\d[\d .-]{8,}\d)/.test(t.replace(/\b(19|20)\d\d\b/g, ""))) throw new Bad("no_phone");
  return t;
}

async function limit(db, kind, ipHash) {
  const [max, ttl] = LIMITS[kind];
  const key = `${P}rl:${kind}:${ipHash}`;
  const [n] = await db.pipe([["INCR", key], ["EXPIRE", key, String(ttl), "NX"]]);
  if (n > max) throw new Bad("slow_down", 429);
}

async function getQ(db, id) {
  if (!/^q[a-z0-9]{8,24}$/.test(id)) throw new Bad("not_found", 404);
  const raw = await db.cmd("GET", `${P}q:${id}`);
  if (!raw) throw new Bad("not_found", 404);
  return JSON.parse(raw);
}

// ---------- reading ----------
async function list(db, admin, voter) {
  const ids = (await db.cmd("ZRANGE", `${P}all`, "0", "-1", "REV")) || [];
  if (!ids.length) return { questions: [], stats: { total: 0, answered: 0, votes: 0 } };
  const raws = await db.cmd("MGET", ...ids.map((i) => `${P}q:${i}`));
  const reps = await db.pipe(ids.map((i) => ["HGETALL", `${P}r:${i}`]));
  const scores = (await db.cmd("ZRANGE", `${P}votes`, "0", "-1", "WITHSCORES")) || [];
  const votes = {};
  for (let i = 0; i < scores.length; i += 2) votes[scores[i]] = Number(scores[i + 1]) || 0;

  const out = [];
  ids.forEach((id, k) => {
    if (!raws[k]) return;
    const q = JSON.parse(raws[k]);
    if (q.hidden && !admin) return;
    const flat = reps[k] || [];
    const replies = [];
    for (let i = 0; i < flat.length; i += 2) {
      const r = JSON.parse(flat[i + 1]);
      if (r.hidden && !admin) continue;
      replies.push({ id: r.id, text: r.text, t: r.t, alias: r.alias, asker: !!r.asker, hidden: admin ? !!r.hidden : undefined,
        held: admin ? !!r.held : undefined, votes: votes[r.id] || 0, mine: !!voter && r.by === voter });
    }
    replies.sort((a, b) => a.t - b.t);
    out.push({ id: q.id, text: q.text, cat: q.cat, t: q.t, pinned: !!q.pinned, answer: q.answer || null,
      hidden: admin ? !!q.hidden : undefined, held: admin ? !!q.held : undefined,
      votes: votes[q.id] || 0, mine: !!voter && q.by === voter, replies });
  });
  const answered = out.filter((q) => q.answer).length;
  const total = out.reduce((s, q) => s + q.votes, 0);
  return { questions: out, stats: { total: out.length, answered, votes: total } };
}

// ---------- writing ----------
async function ask(db, b, ipHash) {
  if (b.agree !== true) throw new Bad("agree_first");
  if (b.website) throw new Bad("spam");               // a hidden field only bots fill in
  const by = voterOf(b);
  const text = clean(b.text, 10, 1200);
  const cat = CATS.includes(b.cat) ? b.cat : "lainnya";
  await limit(db, "ask", ipHash);
  const q = { id: newId("q"), text, cat, t: Date.now(), by, answer: null, hidden: false, pinned: false };
  await db.pipe([["SET", `${P}q:${q.id}`, JSON.stringify(q)], ["ZADD", `${P}all`, String(q.t), q.id]]);
  return { ok: true, id: q.id };
}

async function reply(db, b, ipHash) {
  if (b.website) throw new Bad("spam");
  const by = voterOf(b);
  const q = await getQ(db, String(b.id));
  if (q.hidden) throw new Bad("not_found", 404);
  const text = clean(b.text, 2, 1000);
  await limit(db, "reply", ipHash);
  const h = parseInt(hash(`alias:${q.id}:${by}`).slice(0, 8), 16);
  const r = { id: newId("r"), q: q.id, text, t: Date.now(), by, asker: by === q.by,
    alias: ANIMALS[h % ANIMALS.length] + " " + (1 + (h >>> 8) % 99), hidden: false };
  await db.cmd("HSET", `${P}r:${q.id}`, r.id, JSON.stringify(r));
  await db.cmd("SET", `${P}owner:${r.id}`, q.id);
  return { ok: true, id: r.id };
}

async function vote(db, b, ipHash) {
  const by = voterOf(b);
  const id = String(b.id || "");
  if (!/^[qr][a-z0-9]{8,24}$/.test(id)) throw new Bad("not_found", 404);
  const exists = id[0] === "q" ? await db.cmd("EXISTS", `${P}q:${id}`) : await db.cmd("EXISTS", `${P}owner:${id}`);
  if (!exists) throw new Bad("not_found", 404);
  await limit(db, "vote", ipHash);
  const set = `${P}v:${id}`;
  const changed = await db.cmd(b.on ? "SADD" : "SREM", set, by);
  let n;
  if (changed) n = Number(await db.cmd("ZINCRBY", `${P}votes`, b.on ? "1" : "-1", id));
  else n = Number(await db.cmd("SCARD", set));
  return { ok: true, votes: Math.max(0, n), on: !!b.on };
}

async function report(db, b, ipHash) {
  const by = voterOf(b);
  const id = String(b.id || "");
  if (!/^[qr][a-z0-9]{8,24}$/.test(id)) throw new Bad("not_found", 404);
  await limit(db, "report", ipHash);
  const n = await db.cmd("SADD", `${P}rep:${id}`, by) ? Number(await db.cmd("SCARD", `${P}rep:${id}`)) : 0;
  if (n >= REPORTS_TO_HOLD) await setFlags(db, id, { hidden: true, held: true });   // waits for Jessica to look
  return { ok: true };
}

// change fields on a question or a reply
async function setFlags(db, id, fields) {
  if (/^q/.test(id)) {
    const q = await getQ(db, id);
    Object.assign(q, fields);
    await db.cmd("SET", `${P}q:${id}`, JSON.stringify(q));
    return;
  }
  const qid = await db.cmd("GET", `${P}owner:${id}`);
  if (!qid) throw new Bad("not_found", 404);
  const raw = await db.cmd("HGET", `${P}r:${qid}`, id);
  if (!raw) throw new Bad("not_found", 404);
  await db.cmd("HSET", `${P}r:${qid}`, id, JSON.stringify(Object.assign(JSON.parse(raw), fields)));
}

async function adminOp(db, b) {
  const id = String(b.id || "");
  if (b.op === "answer") {
    const q = await getQ(db, id);
    const text = String(b.text || "").trim().slice(0, 6000);
    q.answer = text ? { text, t: q.answer?.t || Date.now(), edited: q.answer ? Date.now() : undefined } : null;
    await db.cmd("SET", `${P}q:${id}`, JSON.stringify(q));
  } else if (b.op === "hide") {
    await setFlags(db, id, { hidden: !!b.on, held: false });
    if (!b.on) await db.cmd("DEL", `${P}rep:${id}`);
  } else if (b.op === "pin") {
    await setFlags(db, id, { pinned: !!b.on });
  } else if (b.op === "delete") {
    if (id[0] === "q") {
      await getQ(db, id);
      const rids = (await db.cmd("HKEYS", `${P}r:${id}`)) || [];
      await db.pipe([
        ["DEL", `${P}q:${id}`, `${P}r:${id}`, `${P}v:${id}`, `${P}rep:${id}`],
        ["ZREM", `${P}all`, id], ["ZREM", `${P}votes`, id, ...rids],
        ...rids.map((r) => ["DEL", `${P}v:${r}`, `${P}rep:${r}`, `${P}owner:${r}`]),
      ]);
    } else {
      const qid = await db.cmd("GET", `${P}owner:${id}`);
      if (!qid) throw new Bad("not_found", 404);
      await db.pipe([["HDEL", `${P}r:${qid}`, id], ["DEL", `${P}v:${id}`, `${P}rep:${id}`, `${P}owner:${id}`], ["ZREM", `${P}votes`, id]]);
    }
  } else throw new Bad("bad_op");
  return { ok: true };
}

// ---------- handler ----------
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  try {
    const db = store();
    if (!db) throw new Bad("no_store", 503);
    const admin = isAdmin(req);
    if (req.method === "GET") {
      const v = String(req.query?.voter || req.headers["x-voter"] || "");
      const voter = /^[a-z0-9]{16,64}$/i.test(v) ? hash("voter:" + v) : null;
      return res.status(200).json({ admin, ...(await list(db, admin, voter)) });
    }
    if (req.method !== "POST") throw new Bad("method", 405);
    let b = req.body;
    if (typeof b === "string") { try { b = JSON.parse(b); } catch { b = {}; } }
    b = b || {};
    const ipHash = hash("ip:" + clientIp(req));
    const ops = { ask, reply, vote, report };
    if (ops[b.op]) return res.status(200).json(await ops[b.op](db, b, ipHash));
    if (!admin) throw new Bad("not_allowed", 403);
    return res.status(200).json(await adminOp(db, b));
  } catch (e) {
    const status = e.status || 500;
    if (status === 500) console.error(e);
    return res.status(status).json({ error: e instanceof Bad ? e.message : "server" });
  }
};
