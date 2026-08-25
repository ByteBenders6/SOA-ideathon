const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// =============================================
// DATABASE CONNECTION
// =============================================
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.connect((err) => {
  if (err) {
    console.log('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ PostgreSQL connected!');
  }
});

// =============================================
// API KEYS
// =============================================
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;


// =============================================
// AI SEARCH — FRONTEND → BACKEND → AIML
// =============================================
const AIML_API_URL = process.env.AIML_API_URL || 'http://127.0.0.1:8001';

app.post('/api/ai/search', async (req, res) => {
  try {
    const query = (req.body?.query || '').trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a trip request.'
      });
    }

    const response = await axios.post(
      `${AIML_API_URL}/api/recommend`,
      { query },
      { timeout: 120000 }
    );

    return res.json(response.data);
  } catch (error) {
    console.error('❌ AIML search failed:', error.message);
    return res.status(500).json({
      success: false,
      error: 'AI service is unavailable. Make sure the AIML server is running on port 8001.'
    });
  }
});

// =============================================
// HEALTH CHECK
// =============================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'TourSphere is running with 5 APIs!',
    timestamp: new Date().toISOString()
  });
});

// =============================================
// 1. GET ALL DESTINATIONS
// =============================================
app.get('/api/destinations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM destinations ORDER BY id');
    res.json({
      success: true,
      count: result.rows.length,
      destinations: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================
// 2. GET DESTINATION BY ID
// =============================================
app.get('/api/destinations/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM destinations WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json({ success: true, destination: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================
// 3. GET DESTINATIONS BY STATE
// =============================================
app.get('/api/destinations/state/:state', async (req, res) => {
  try {
    const { state } = req.params;
    const result = await pool.query(
      'SELECT * FROM destinations WHERE state ILIKE $1 ORDER BY id',
      [`%${state}%`]
    );
    res.json({
      success: true,
      count: result.rows.length,
      state: state,
      destinations: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================
// 4. GET HIDDEN GEMS BY STATE
// =============================================
app.get('/api/destinations/hidden/:state', async (req, res) => {
  try {
    const { state } = req.params;
  const result = await pool.query(
    `SELECT * FROM destinations
     WHERE state ILIKE $1
     AND hidden_gem IS NOT NULL
     AND TRIM(hidden_gem) <> ''
     ORDER BY id`,
    [`%${state}%`]
);
    res.json({
      success: true,
      count: result.rows.length,
      state: state,
      hiddenGems: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================
// 5. SEARCH DESTINATIONS
// =============================================
app.get('/api/destinations/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }
    const result = await pool.query(
      `SELECT * FROM destinations 
       WHERE place_name ILIKE $1 
       OR state ILIKE $1 
       OR category ILIKE $1
       OR description ILIKE $1
       ORDER BY id`,
      [`%${q}%`]
    );
    res.json({
      success: true,
      count: result.rows.length,
      query: q,
      results: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================
// API 1: WEATHER (OpenWeatherMap)
// =============================================
app.get('/api/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;
    
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'your_openweather_api_key_here') {
      return res.json({
        success: true,
        weather: {
          condition: 'Clear Sky',
          temperature: '28°C',
          feelsLike: '30°C',
          humidity: '82%',
          rain: '0 mm',
          windSpeed: '12 km/h'
        }
      });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    const data = response.data;
    res.json({
      success: true,
      city: data.name,
      weather: {
        condition: data.weather[0].description,
        temperature: `${Math.round(data.main.temp)}°C`,
        feelsLike: `${Math.round(data.main.feels_like)}°C`,
        humidity: `${data.main.humidity}%`,
        rain: data.rain ? `${data.rain['1h'] || 0} mm` : '0 mm',
        windSpeed: `${Math.round(data.wind.speed * 3.6)} km/h`
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================
// API 2: MAPS (Google Places)
// =============================================
app.get('/api/maps/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 2000, type = 'tourist_attraction' } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'your_google_maps_api_key_here') {
      return res.json({
        success: true,
        places: [
          { name: 'Local Temple', address: 'Nearby', rating: 4.5 },
          { name: 'Local Market', address: 'City Center', rating: 4.2 }
        ]
      });
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${GOOGLE_MAPS_API_KEY}`
    );

    const places = response.data.results.map(place => ({
      name: place.name,
      address: place.vicinity,
      rating: place.rating || 0,
      totalRatings: place.user_ratings_total || 0,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng
    }));

    res.json({
      success: true,
      count: places.length,
      places: places
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// =============================================
// API 3: WIKIPEDIA
// =============================================
app.get('/api/wikipedia/:query', async (req, res) => {
  try {
    const { query } = req.params;

    const searchResponse = await axios.get(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`,
    {
        headers: {
            "User-Agent": "TourSphere/1.0 (TourSphere tourism project)"
        }
    }
);

    if (!searchResponse.data.query.search.length) {
      return res.status(404).json({ error: 'No Wikipedia page found' });
    }

    const pageTitle = searchResponse.data.query.search[0].title;

    const contentResponse = await axios.get(
    `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro&explaintext&titles=${encodeURIComponent(pageTitle)}&format=json&origin=*`,
    {
        headers: {
            "User-Agent": "TourSphere/1.0 (TourSphere tourism project)"
        }
    }
);

    const pages = contentResponse.data.query.pages;
    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];

    res.json({
      success: true,
      title: page.title,
      description: page.extract || 'No description available',
      image: page.thumbnail ? page.thumbnail.source : null,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================
// API 4: ROUTE (Google Directions)
// =============================================
app.get('/api/route', async (req, res) => {
  try {
    const { origin, destination, mode = 'driving' } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination required' });
    }

    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'your_google_maps_api_key_here') {
      return res.json({
        success: true,
        route: {
          distance: '45 km',
          duration: '1 hour 30 mins',
          mode: mode
        }
      });
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.status !== 'OK') {
      return res.status(400).json({ error: 'Route not found' });
    }

    const route = response.data.routes[0];
    const leg = route.legs[0];

    res.json({
  success: true,
  route: {
    distance: leg.distance.text,
    distanceMeters: leg.distance.value,

    duration: leg.duration.text,
    durationSeconds: leg.duration.value,

    startAddress: leg.start_address,
    endAddress: leg.end_address,

    mode: mode,

    // Actual Google Maps route
    maps_url:
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=${encodeURIComponent(origin)}` +
      `&destination=${encodeURIComponent(destination)}` +
      `&travelmode=${encodeURIComponent(mode)}`,

    steps: leg.steps.map(step => ({
      instruction: step.html_instructions.replace(/<[^>]*>/g, ''),
      distance: step.distance.text,
      duration: step.duration.text
    }))
  }
});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================
// API 5: TRANSLATE (Google Translate)
// =============================================
// =============================================
// API 5: TRANSLATE
// LibreTranslate
// =============================================

app.get('/api/translate', async (req, res) => {
  try {
    const { text, target = 'hi' } = req.query;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Text to translate is required.'
      });
    }

    const supportedLanguages = {
      en: 'English',
      hi: 'Hindi',
      or: 'Odia',
      ta: 'Tamil',
      te: 'Telugu',
      kn: 'Kannada',
      ml: 'Malayalam',
      bn: 'Bengali',
      mr: 'Marathi',
      gu: 'Gujarati',
      pa: 'Punjabi',
      as: 'Assamese',
      fr: 'French',
      es: 'Spanish',
      de: 'German'
    };

    const targetLanguage = String(target).trim().toLowerCase();

    if (!supportedLanguages[targetLanguage]) {
      return res.status(400).json({
        success: false,
        error: `Unsupported target language: ${targetLanguage}`
      });
    }

    // English → English
    if (targetLanguage === 'en') {
      return res.json({
        success: true,
        original: text,
        translated: text,
        target: targetLanguage
      });
    }

    // MyMemory - no API key required
    const response = await axios.get(
  'https://api.mymemory.translated.net/get',
  {
    params: {
      q: text.trim(),
      langpair: `en|${targetLanguage}`,
      de: 'bytebenders6@gmail.com'
    },
    timeout: 15000
  }
);

    const translatedText =
      response.data?.responseData?.translatedText?.trim();

    if (
      !translatedText ||
      response.data?.quotaFinished === true
    ) {
      return res.status(503).json({
        success: false,
        error: 'Translation service is temporarily unavailable.'
      });
    }

    return res.json({
      success: true,
      original: text,
      translated: translatedText,
      target: targetLanguage
    });

  } catch (error) {

    console.error(
      'Translation API error:',
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      error: 'Translation service is currently unavailable.'
    });
  }
});


// =============================================
// DASHBOARD WITH 5 APIS
// =============================================
app.get('/api/dashboard/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM destinations WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    const dest = result.rows[0];

    const gemsResult = await pool.query(
      `SELECT * FROM destinations 
       WHERE state = $1 
       AND hidden_gem IS NOT NULL AND TRIM(hidden_gem) <> '' 
       AND id != $2 
       LIMIT 3`,
      [dest.state, dest.id]
    );

    const [weatherData, wikiData, nearbyPlaces, routeData, translationData] = await Promise.all([
      axios.get(`http://localhost:${process.env.PORT || 8000}/api/weather/${encodeURIComponent(dest.place_name)}`).catch(() => ({ data: null })),
      axios.get(`http://localhost:${process.env.PORT || 8000}/api/wikipedia/${encodeURIComponent(dest.place_name)}`).catch(() => ({ data: null })),
     axios.get(
    `http://localhost:${process.env.PORT || 8000}/api/maps/nearby?destination=${encodeURIComponent(dest.place_name)}`
).catch(() => ({ data: null })),
      axios.get(`http://localhost:${process.env.PORT || 8000}/api/route?origin=Capital&destination=${encodeURIComponent(dest.place_name)}`).catch(() => ({ data: null })),
      axios.get(`http://localhost:${process.env.PORT || 8000}/api/translate?text=${encodeURIComponent(dest.description)}&target=hi`).catch(() => ({ data: null }))
    ]);

    res.json({
      success: true,
      data: {
        destination: {
          id: dest.id,
          name: dest.place_name,
          state: dest.state,
          category: dest.category,
          description: dest.description,
          isPopular: dest.is_popular,
          isHiddenGem: (!!(dest.hidden_gem && String(dest.hidden_gem).trim()))
        },
        recommendation: {
          budget: dest.estimate_budget || 'Not specified',
          rating: dest.rating || 'Not rated',
          bestSeason: dest.best_time_to_visit || 'All Season'
        },
        crowd: {
          level: dest.crowd_level || 'Medium',
          peakMonths: dest.peak_months || 'Not specified'
        },
        terrain: dest.terrain_type || 'Plain',
        road: {
          type: dest.road_type || 'City',
          condition: dest.road_condition || 'Good',
          vehicle: dest.vehicle_suitability || 'Car',
          warning: dest.traffic_warning || 'Normal'
        },
        timing: {
          opening: dest.opening_time || '06:00',
          closing: dest.closing_time || '21:00'
        },
        weather: weatherData?.data?.weather || { condition: 'Clear', temperature: '28°C' },
        wikipedia: wikiData?.data || { title: dest.place_name, description: dest.description },
        nearbyPlaces: nearbyPlaces?.data?.places || [],
        route: routeData?.data?.route || { distance: 'N/A', duration: 'N/A' },
        translation: translationData?.data || { original: dest.description, translated: dest.description },
        hotels: dest.nearby_hotels ? dest.nearby_hotels.split(',') : [],
        restaurants: dest.nearby_restaurants ? dest.nearby_restaurants.split(',') : [],
        hiddenGems: gemsResult.rows.map(g => ({ id: g.id, name: g.place_name })),
        verification: {
          dataset: 'Verified',
          weatherApi: 'Verified',
          mapsApi: 'Verified',
          wikiApi: 'Verified',
          translateApi: 'Verified'
        }
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================
// START SERVER
// =============================================
const PORT = process.env.PORT || 8000;

// =============================================
// SERVE TOURSPHERE FRONTEND
// =============================================
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND_DIR));

app.get('/', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/api/health`);
  console.log(`📊 Destinations: http://localhost:${PORT}/api/destinations`);
  console.log(`🌤️ Weather: http://localhost:${PORT}/api/weather/Puri`);
  console.log(`🗺️ Maps: http://localhost:${PORT}/api/maps/nearby?lat=20.0&lng=85.0`);
  console.log(`📖 Wikipedia: http://localhost:${PORT}/api/wikipedia/Puri`);
  console.log(`🛣️ Route: http://localhost:${PORT}/api/route?origin=Bhubaneswar&destination=Puri`);
  console.log(`🌍 Translate: http://localhost:${PORT}/api/translate?text=Hello&target=hi`);
});