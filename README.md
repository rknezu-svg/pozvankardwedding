# Svatební web – nasazení na Vercel

1. Nahrajte složku na Vercel (nebo `npx vercel`).
2. Ve Vercelu: Storage → Marketplace → Upstash Redis → vytvořit a připojit k projektu (přidá proměnné KV_REST_API_URL a KV_REST_API_TOKEN).
3. Settings → Environment Variables: přidejte ADMIN_TOKEN (vlastní dlouhé heslo).
4. Redeploy.

- Web: /  (RSVP vygeneruje každému hostovi vlastní vstupenku s unikátním 12místným kódem)
- Odbavení u vchodu: /scan.html (zadáte ADMIN_TOKEN, čtečka QR funguje jako klávesnice a posílá kód + Enter)
- Seznam hostů (CSV): /api/export?token=VÁŠ_ADMIN_TOKEN
