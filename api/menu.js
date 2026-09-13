// api/menu.js
//
// Fonction serveur Vercel (Node.js). Exécutée uniquement côté serveur :
// le token Airtable n'est jamais envoyé au navigateur.
// Le front-end (index.html) appelle simplement /api/menu.

const BASE_ID = 'appqMYJeNDf0iyXYY';
const TABLE_NAME = 'Menu';

// Récupère tous les enregistrements disponibles (avec pagination Airtable).
async function fetchAllRecords(token) {
  const records = [];
  let offset;

  do {
    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`);
    url.searchParams.set('filterByFormula', '{Disponible} = TRUE()');
    url.searchParams.set('pageSize', '100');
    if (offset) url.searchParams.set('offset', offset);

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`Airtable a répondu ${response.status}: ${detail}`);
    }

    const data = await response.json();
    records.push(...data.records);
    offset = data.offset; // présent seulement s'il reste des pages
  } while (offset);

  return records;
}

// Extrait l'URL de la première photo d'un champ pièce jointe Airtable.
// Renvoie null si le champ est vide ou absent (plat sans photo).
function extractPhotoUrl(photoField) {
  if (!Array.isArray(photoField) || photoField.length === 0) return null;
  const first = photoField[0];
  if (!first) return null;
  // On privilégie une miniature "large" (plus légère qu'un fichier original)
  // et on retombe sur l'URL complète si la miniature n'existe pas.
  if (first.thumbnails && first.thumbnails.large && first.thumbnails.large.url) {
    return first.thumbnails.large.url;
  }
  return first.url || null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  const token = process.env.AIRTABLE_TOKEN;
  if (!token) {
    // Ne jamais renvoyer de détail technique sensible au client.
    console.error('AIRTABLE_TOKEN manquant dans les variables d\'environnement Vercel.');
    return res.status(500).json({ error: 'Configuration serveur incomplète.' });
  }

  try {
    const records = await fetchAllRecords(token);

    const items = records
      .map((record) => {
        const fields = record.fields || {};
        return {
          id: record.id,
          name: (fields['Plat'] || '').trim(),
          category: (fields['Catégorie'] || '').trim(),
          description: (fields['Description'] || '').trim(),
          price: fields['Prix'] ?? null,
          photoUrl: extractPhotoUrl(fields['Photo']),
        };
      })
      .filter((item) => item.name && item.category);

    // Mise en cache légère côté CDN Vercel : évite de solliciter Airtable
    // à chaque visite, tout en restant à jour rapidement.
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ items });
  } catch (err) {
    console.error('Erreur lors de la récupération du menu Airtable:', err);
    return res.status(502).json({ error: "Impossible de récupérer le menu pour le moment." });
  }
};
