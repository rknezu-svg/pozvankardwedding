const { cmd } = require('../lib/redis');
module.exports = async (req, res) => {
  const t = process.env.ADMIN_TOKEN;
  if (!t || req.headers['x-token'] !== t) return res.status(401).json({ error: 'token' });
  try {
    const code = String(req.query.code || '').replace(/\D/g, '');
    const key = code && (await cmd(['GET', 'code:' + code]));
    if (!key) return res.json({ valid: false });
    const g = JSON.parse(await cmd(['GET', key]));
    if (!g.coming) return res.json({ valid: false });
    if (g.used) return res.json({ valid: true, name: g.name, already: g.used });
    if (req.query.checkin === '1') { g.used = new Date().toISOString(); await cmd(['SET', key, JSON.stringify(g)]); }
    res.json({ valid: true, name: g.name, already: null });
  } catch (e) {
    res.status(500).json({ error: 'server' });
  }
};
