const { cmd } = require('../lib/redis');
const q = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
module.exports = async (req, res) => {
  const t = process.env.ADMIN_TOKEN;
  if (!t || req.query.token !== t) return res.status(401).end('token');
  const keys = await cmd(['SMEMBERS', 'guests']);
  const rows = [['Jméno', 'Přijde', 'Pije', 'Intolerance', 'Jiné', 'Maso', 'Kód', 'Odbaveno', 'Odpověď'].map(q).join(',')];
  for (const k of keys) {
    const g = JSON.parse(await cmd(['GET', k]));
    rows.push([g.name, g.coming ? 'ano' : 'ne', g.drinks.join('; '), g.diet.join('; '), g.other, g.meat.join('; '), g.code, g.used, g.at].map(q).join(','));
  }
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="hoste.csv"');
  res.end('\ufeff' + rows.join('\n'));
};
