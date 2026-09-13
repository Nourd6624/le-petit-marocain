// api/restaurant.js
//
// Fonction serveur Vercel (Node.js), séparée de /api/menu.
// Récupère la ligne unique de la table "Informations restaurant" dans Airtable.
// Le token Airtable n'est utilisé que côté serveur et n'est jamais renvoyé au navigateur.

const BASE_ID = 'appqMYJeNDf0iyXYY';
const TABLE_NAME = 'Informations restaurant';

// Extrait l'URL de la première photo d'un champ pièce jointe Airtable.
// Renvoie null si le champ est vide ou absent.
function extractPhotoUrl(photoField) {
  if (!Array.isArray(photoField) || photoField.length === 0) return null;
  const first = photoField[0];
  if (!first) return null;
  if (first.thumbnails && first.thumbnails.large && first.thumbnails.large.url) {
    return first.thumbnails.large.url;
  }
  return first.url || null;
}

// Récupère le premier (et normalement unique) enregistrement de la table.
async function fetchRestaurantRecord(token) {
  const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`);
  url.searchParams.set('maxRecords', '1');

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Airtable a répondu ${response.status}: ${detail}`);
  }

  const data = await response.json();
  return (data.records && data.records[0]) || null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  const token = process.env.AIRTABLE_TOKEN;
  if (!token) {
    console.error('AIRTABLE_TOKEN manquant dans les variables d\'environnement Vercel.');
    return res.status(500).json({ error: 'Configuration serveur incomplète.' });
  }

  try {
    const record = await fetchRestaurantRecord(token);
    const fields = (record && record.fields) || {};

    // Chaque champ est optionnel : si absent dans Airtable, on renvoie null
    // et le site conserve alors son contenu par défaut (voir index.html).
    const info = {
      name: (fields['Nom'] || '').trim() || null,
      photoUrl: extractPhotoUrl(fields['Photo accueil']),
      heroText: (fields['Texte accueil'] || '').trim() || null,
      phone: (fields['Téléphone'] || '').trim() || null,
      whatsapp: (fields['WhatsApp'] || '').trim() || null,
      address: (fields['Adresse'] || '').trim() || null,
      hours: (fields['Horaires'] || '').trim() || null,
    };

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(info);
  } catch (err) {
    console.error('Erreur lors de la récupération des informations restaurant Airtable:', err);
    return res.status(502).json({ error: 'Impossible de récupérer les informations du restaurant pour le moment.' });
  }
};
