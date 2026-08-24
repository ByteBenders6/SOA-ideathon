const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// =============================================
// DESTINATIONS DATA (9 Destinations)
// =============================================
const destinations = [
  {
    place_name: 'Puri',
    state: 'Odisha',
    category: 'Beach',
    is_popular: true,
    hidden_gem: 'Baliharchandi Beach',
    distance: '27km',
    description: 'Coastal temple town known for the Jagannath Temple and Puri Beach.',
    estimate_budget: 'Rs. 3,000-5,000',
    rating: '4.8/5',
    best_time_to_visit: 'Oct-Mar',
    crowd_level: 'Very High',
    peak_months: 'December, January, June, July',
    terrain_type: 'Flat/coastal',
    opening_time: '5:00 AM',
    closing_time: '10:00 PM',
    road_type: 'City roads + highway',
    road_condition: 'Good',
    vehicle_suitability: 'Car, bike, bus',
    traffic_warning: 'Heavy weekend/festival traffic',
    nearby_hotels: 'Hotel Puri Beach Resort, Pride Ananya Resort, Sterling Puri',
    nearby_restaurants: 'Wildgrass Restaurant, Chung Wah, Local restaurants'
  },
  {
    place_name: 'Konark',
    state: 'Odisha',
    category: 'Heritage',
    is_popular: true,
    hidden_gem: 'Kuruma Buddhist site',
    distance: '8km',
    description: 'UNESCO World Heritage Site, the 13th-century Sun Temple shaped like a giant chariot.',
    estimate_budget: 'Rs. 3,000-5,000',
    rating: '4.7/5',
    best_time_to_visit: 'Oct-Mar',
    crowd_level: 'High',
    peak_months: 'December, January, February',
    terrain_type: 'Flat/coastal',
    opening_time: '6:00 AM',
    closing_time: '6:00 PM',
    road_type: 'Coastal highway',
    road_condition: 'Good',
    vehicle_suitability: 'Car, bike, bus',
    traffic_warning: 'Tourist congestion near temple',
    nearby_hotels: 'Lotus Eco Resort, Toshali Sands',
    nearby_restaurants: 'Konark Garden Restaurant, Local restaurants'
  },
  {
    place_name: 'Balighai Beach',
    state: 'Odisha',
    category: 'Beach',
    is_popular: false,
    hidden_gem: 'Beleswar Beach',
    distance: '15km',
    description: 'Quieter beach experience close to Puri.',
    estimate_budget: 'Rs. 3,000-5,000',
    rating: '4.2/5*',
    best_time_to_visit: 'Oct-Mar',
    crowd_level: 'Medium',
    peak_months: 'December, January',
    terrain_type: 'Flat/coastal',
    opening_time: 'Daylight',
    closing_time: 'Daylight',
    road_type: 'City roads + coastal road',
    road_condition: 'Good',
    vehicle_suitability: 'Car, bike',
    traffic_warning: 'Weekend/festival congestion',
    nearby_hotels: 'Sterling Puri, Taj Puri Resort & Spa',
    nearby_restaurants: 'Puri restaurants for wider choice'
  },
  {
    place_name: 'Shillong',
    state: 'Meghalaya',
    category: 'Hill Station',
    is_popular: true,
    hidden_gem: 'Mawphlang Sacred Forest',
    distance: '25km',
    description: 'Meghalaya capital with hills, colonial charm and vibrant culture.',
    estimate_budget: 'Rs. 5,000-8,000',
    rating: '4.3/5',
    best_time_to_visit: 'Oct-Apr',
    crowd_level: 'High',
    peak_months: 'April, May, June, October',
    terrain_type: 'Hilly',
    opening_time: 'Varies by attraction',
    closing_time: 'Varies by attraction',
    road_type: 'Urban + mountain roads',
    road_condition: 'Good',
    vehicle_suitability: 'Car/taxi/shared cab',
    traffic_warning: 'Police Bazar congestion',
    nearby_hotels: 'Vivanta Meghalaya, The Heritage Club',
    nearby_restaurants: 'City Hut Dhaba, Café Shillong'
  },
  {
    place_name: 'Sohra',
    state: 'Meghalaya',
    category: 'Adventure',
    is_popular: true,
    hidden_gem: 'Wei SawDong Falls',
    distance: '9km',
    description: 'Known for waterfalls, living root bridges and limestone caves.',
    estimate_budget: 'Rs. 5,000-8,000',
    rating: '4.5/5',
    best_time_to_visit: 'Oct-Apr',
    crowd_level: 'High',
    peak_months: 'July, August, September, October',
    terrain_type: 'Hilly',
    opening_time: 'Varies by attraction',
    closing_time: 'Varies by attraction',
    road_type: 'Winding mountain road',
    road_condition: 'Fair',
    vehicle_suitability: 'Car/SUV/taxi',
    traffic_warning: 'Rain/fog can reduce visibility',
    nearby_hotels: 'The Crescent Hotel, Jiva Resort',
    nearby_restaurants: 'Orange Roots, Local Sohra restaurants'
  },
  {
    place_name: 'Laitlum Canyon',
    state: 'Meghalaya',
    category: 'Adventure',
    is_popular: false,
    hidden_gem: 'Replang Canyon',
    distance: '5km',
    description: 'Canyon with panoramic valley views away from city crowds.',
    estimate_budget: 'Rs. 5,000-8,000',
    rating: '4.6/5*',
    best_time_to_visit: 'Oct-Apr',
    crowd_level: 'Low',
    peak_months: 'October, November, December',
    terrain_type: 'Hilly',
    opening_time: 'Daylight',
    closing_time: 'Daylight',
    road_type: 'Mountain roads',
    road_condition: 'Fair',
    vehicle_suitability: 'Car/SUV',
    traffic_warning: 'Remote area, limited facilities',
    nearby_hotels: 'Hoopoe INN, nearby homestays',
    nearby_restaurants: 'Shillong city for wider choice'
  },
  {
    place_name: 'Shimla',
    state: 'Himachal Pradesh',
    category: 'Hill Station',
    is_popular: true,
    hidden_gem: 'Cheog',
    distance: '20km',
    description: 'Former summer capital of British India with colonial architecture.',
    estimate_budget: 'Rs. 6,000-8,000',
    rating: '4.6/5',
    best_time_to_visit: 'Mar-June',
    crowd_level: 'High',
    peak_months: 'April, May, June, December',
    terrain_type: 'High',
    opening_time: 'Varies by attraction',
    closing_time: 'Varies by attraction',
    road_type: 'Narrow hill + urban road',
    road_condition: 'Good',
    vehicle_suitability: 'Small car, taxi',
    traffic_warning: 'Heavy tourist traffic',
    nearby_hotels: 'Hotel Willow Banks, Hotel Combermere',
    nearby_restaurants: 'Hotel Willow Banks, Hotel Combermere'
  },
  {
    place_name: 'Mashobra',
    state: 'Himachal Pradesh',
    category: 'Hill Station',
    is_popular: false,
    hidden_gem: 'Shali Tibba',
    distance: '4km',
    description: 'Quieter Himalayan hill-station experience close to Shimla.',
    estimate_budget: 'Rs. 6,000-10,000',
    rating: '4.4/5',
    best_time_to_visit: 'Mar-Jun, Sep-Nov',
    crowd_level: 'Low',
    peak_months: 'April, May, June',
    terrain_type: 'Steep mountain',
    opening_time: 'Daylight',
    closing_time: 'Daylight',
    road_type: 'Narrow hill roads',
    road_condition: 'Good',
    vehicle_suitability: 'Small car, taxi',
    traffic_warning: 'Heavy tourist traffic in peak season',
    nearby_hotels: 'Club Mahindra Mashobra, The Oberoi Wildflower Hall',
    nearby_restaurants: 'Khyber at Mashobra'
  },
  {
    place_name: 'Chichoga',
    state: 'Himachal Pradesh',
    category: 'Adventure',
    is_popular: false,
    hidden_gem: 'Jogini Waterfall',
    distance: '2km',
    description: 'Quiet mountain-village setting close to Manali with beautiful surroundings.',
    estimate_budget: 'Rs. 8,000-12,000',
    rating: '4.3/5',
    best_time_to_visit: 'Mar-Jun, Sep-Nov',
    crowd_level: 'Low',
    peak_months: 'May, June, October',
    terrain_type: 'Mountain valley',
    opening_time: 'Daylight',
    closing_time: 'Evening',
    road_type: 'Narrow village roads',
    road_condition: 'Fair',
    vehicle_suitability: 'Small car, SUV',
    traffic_warning: 'Narrow lanes',
    nearby_hotels: 'The Orchard Greens, Zostel Manali',
    nearby_restaurants: 'Café 1947, Lazy Dog Lounge'
  }
];

// =============================================
// CROWD DATA (9 Rows)
// =============================================
const crowdData = [
  { state: 'Odisha', destination: 'Puri', month: 'June', day_of_week: 'Saturday', best_season: 'Summer', peak_month: 'June', crowd_level: 'Very High' },
  { state: 'Odisha', destination: 'Konark', month: 'January', day_of_week: 'Saturday', best_season: 'Winter', peak_month: 'January', crowd_level: 'High' },
  { state: 'Odisha', destination: 'Balighai Beach', month: 'January', day_of_week: 'Saturday', best_season: 'Winter', peak_month: 'January', crowd_level: 'Medium' },
  { state: 'Meghalaya', destination: 'Shillong', month: 'April', day_of_week: 'Saturday', best_season: 'Summer', peak_month: 'April', crowd_level: 'High' },
  { state: 'Meghalaya', destination: 'Sohra', month: 'July', day_of_week: 'Saturday', best_season: 'Monsoon', peak_month: 'July', crowd_level: 'High' },
  { state: 'Meghalaya', destination: 'Laitlum Canyon', month: 'October', day_of_week: 'Saturday', best_season: 'Autumn', peak_month: 'October', crowd_level: 'Low' },
  { state: 'Himachal Pradesh', destination: 'Shimla', month: 'April', day_of_week: 'Saturday', best_season: 'Summer', peak_month: 'April', crowd_level: 'High' },
  { state: 'Himachal Pradesh', destination: 'Mashobra', month: 'April', day_of_week: 'Saturday', best_season: 'Summer', peak_month: 'April', crowd_level: 'Low' },
  { state: 'Himachal Pradesh', destination: 'Chichoga', month: 'May', day_of_week: 'Saturday', best_season: 'Summer', peak_month: 'May', crowd_level: 'Low' }
];

// =============================================
// SEED FUNCTION
// =============================================
async function seedDatabase() {
  try {
    console.log('🌱 Connecting to PostgreSQL...');
    const client = await pool.connect();

    // =============================================
    // CREATE DESTINATIONS TABLE
    // =============================================
    console.log('🌱 Creating destinations table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS destinations (
        id SERIAL PRIMARY KEY,
        place_name VARCHAR(200) NOT NULL,
        state VARCHAR(100) NOT NULL,
        category VARCHAR(50),
        UNIQUE (place_name, state),
        is_popular BOOLEAN DEFAULT false,
        hidden_gem VARCHAR(200),
        distance VARCHAR(50),
        description TEXT,
        estimate_budget VARCHAR(100),
        rating VARCHAR(10),
        best_time_to_visit VARCHAR(50),
        crowd_level VARCHAR(20),
        peak_months VARCHAR(200),
        terrain_type VARCHAR(50),
        opening_time VARCHAR(30),
        closing_time VARCHAR(30),
        road_type VARCHAR(100),
        road_condition VARCHAR(20),
        vehicle_suitability VARCHAR(100),
        traffic_warning TEXT,
        nearby_hotels TEXT,
        nearby_restaurants TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // =============================================
    // CREATE CROWD DATA TABLE
    // =============================================
    console.log('🌱 Creating crowd_data table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS crowd_data (
        id SERIAL PRIMARY KEY,
        state VARCHAR(100) NOT NULL,
        destination VARCHAR(200) NOT NULL,
        month VARCHAR(20) NOT NULL,
        day_of_week VARCHAR(20) NOT NULL,
        best_season VARCHAR(20) NOT NULL,
        peak_month VARCHAR(20) NOT NULL,
        crowd_level VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // =============================================
    // SEED DESTINATIONS
    // =============================================
    console.log('🌱 Seeding destinations...');

    for (const dest of destinations) {
      await client.query(
        `INSERT INTO destinations (
          place_name, state, category, is_popular, hidden_gem, distance,
          description, estimate_budget, rating, best_time_to_visit,
          crowd_level, peak_months, terrain_type, opening_time, closing_time,
          road_type, road_condition, vehicle_suitability, traffic_warning,
          nearby_hotels, nearby_restaurants
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        ON CONFLICT (place_name, state) DO UPDATE SET
          category = EXCLUDED.category,
          is_popular = EXCLUDED.is_popular,
          hidden_gem = EXCLUDED.hidden_gem,
          distance = EXCLUDED.distance,
          description = EXCLUDED.description,
          estimate_budget = EXCLUDED.estimate_budget,
          rating = EXCLUDED.rating,
          best_time_to_visit = EXCLUDED.best_time_to_visit,
          crowd_level = EXCLUDED.crowd_level,
          peak_months = EXCLUDED.peak_months,
          terrain_type = EXCLUDED.terrain_type,
          opening_time = EXCLUDED.opening_time,
          closing_time = EXCLUDED.closing_time,
          road_type = EXCLUDED.road_type,
          road_condition = EXCLUDED.road_condition,
          vehicle_suitability = EXCLUDED.vehicle_suitability,
          traffic_warning = EXCLUDED.traffic_warning,
          nearby_hotels = EXCLUDED.nearby_hotels,
          nearby_restaurants = EXCLUDED.nearby_restaurants,
          updated_at = NOW()
        `,
        [
          dest.place_name,
          dest.state,
          dest.category,
          dest.is_popular,
          dest.hidden_gem,
          dest.distance,
          dest.description,
          dest.estimate_budget,
          dest.rating,
          dest.best_time_to_visit,
          dest.crowd_level,
          dest.peak_months,
          dest.terrain_type,
          dest.opening_time,
          dest.closing_time,
          dest.road_type,
          dest.road_condition,
          dest.vehicle_suitability,
          dest.traffic_warning || null,
          dest.nearby_hotels || null,
          dest.nearby_restaurants || null
        ]
      );
    }

    // =============================================
    // SEED CROWD DATA
    // =============================================
    console.log('🌱 Seeding crowd data...');

    for (const crowd of crowdData) {
      await client.query(
        `INSERT INTO crowd_data (
          state, destination, month, day_of_week, best_season, peak_month, crowd_level
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          crowd.state,
          crowd.destination,
          crowd.month,
          crowd.day_of_week,
          crowd.best_season,
          crowd.peak_month,
          crowd.crowd_level
        ]
      );
    }

    console.log(`✅ ${destinations.length} destinations seeded successfully!`);
    console.log(`✅ ${crowdData.length} crowd data entries seeded successfully!`);
    client.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();