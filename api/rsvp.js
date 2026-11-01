const crypto = require('crypto');
const { cmd } = require('../lib/redis');
const list = (a) => (Array.isArray(a) ? a.slice(0, 10).map((x) => String(x).slice(0, 60)) : []);
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const b = req.body || {};
    const name = String(b.name || '').trim().slice(0, 80);
    if (!name) return res.status(400).json({ error: 'name' });
    const key = 'guest:' + name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');
    const coming = !!b.coming;
    const prev = await cmd(['GET', key]);
    const old = prev ? JSON.parse(prev) : null;
    let code = old && old.code;
    if (coming && !code) {
      for (let i = 0; i < 20 && !code; i++) {
        const c = String(crypto.randomInt(0, 1e12)).padStart(12, '0');
        if (await cmd(['SET', 'code:' + c, key, 'NX'])) code = c;
      }
      if (!code) throw new Error('code');
    }
    const rec = {
      name, coming, drinks: list(b.drinks), diet: list(b.diet), other: String(b.other || '').slice(0, 200),
      meat: list(b.meat), code: code || null, at: new Date().toISOString(), used: old ? old.used || null : null,
    };
    await cmd(['SET', key, JSON.stringify(rec)]);
    await cmd(['SADD', 'guests', key]);
    res.status(200).json({ code: coming ? code : null });
  } catch (e) {
    res.status(500).json({ error: 'server' });
  }
};
