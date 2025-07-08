const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

const GOOGLE_API_KEY = functions.config().google.api_key;
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 horas

exports.getGoogleReviews = functions.https.onRequest(async (req, res) => {
  // Suporte a CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const placeId = req.query.placeId || req.body.placeId;
  if (!placeId) {
    return res.status(400).json({error: "Missing placeId"});
  }

  const cacheRef = db.collection("google_reviews_cache").doc(placeId);

  try {
    // 1. Tenta buscar do cache
    const cacheDoc = await cacheRef.get();
    const now = Date.now();

    if (cacheDoc.exists) {
      const data = cacheDoc.data();
      if (now - data.cachedAt < CACHE_TTL) {
        // Cache válido
        return res.json(data.result);
      }
    }

    // 2. Busca da API do Google
    const baseUrl =
      "https://maps.googleapis.com/maps/api/place/details/json?";
    const params =
      `place_id=${placeId}` +
      `&fields=reviews,rating,user_ratings_total,name,geometry,formatted_address,photos` +
      `&key=${GOOGLE_API_KEY}`;
    const url = baseUrl + params;
    const response = await axios.get(url);

    if (response.data.status !== "OK") {
      return res.status(400).json({
        error: response.data.status,
        details: response.data.error_message,
      });
    }

    // 3. Salva no cache
    await cacheRef.set({
      result: response.data.result,
      cachedAt: now,
    });

    return res.json(response.data.result);
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch Google Reviews",
      details: err.message,
    });
  }
});

// Função de teste simples para validar deploy
exports.helloWorld = functions.https.onRequest((req, res) => {
  res.status(200).send("Hello from Firebase Functions!");
});
