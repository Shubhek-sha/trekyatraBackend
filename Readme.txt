{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "full_name": "John Doe",
  "username": "johndoe",
  "profile_picture": "https://example.com/avatar.jpg",
  "phone": "+977-9841234567",
  "date_of_birth": "1990-05-15",
  "fitness_level": "high",
  "preferred_difficulty": "challenging",
  "preferred_max_duration": 14,
  "location_country": "Nepal",
  "location_city": "Kathmandu",
  "bio": "Adventure enthusiast and experienced trekker"
}


{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}

{
  "name": "Dhaulagiri Trek",
  "slug": "dhaulagiri-trek",
  "location": "Baglung",
  "region": "Dhaulagiri Region",
  "country": "Nepal",
  "difficulty": "extreme",
  "duration_days": 18,
  "distance_km": 200,
  "max_altitude": 5500,
  "altitude_gain": 3000,
  "starting_point": "Beni",
  "ending_point": "Marpha",
  "daily_trek_hours": 7,
  "temperature_range": "-10 to 15°C",
  "permits_required": true,
  "guide_mandatory": true,
  "fitness_level_required": "extreme",
  "water_availability": true,
  "food_availability": true,
  "mobile_network_availability": false,
  "risk_level": "high",
  "altitude_sickness_risk": true,
  "nearest_medical_facility_distance": 50,
  "evacuation_possible": true,
  "cost_min_usd": 2500,
  "cost_max_usd": 4500,
  "cultural_significance": "Sacred mountain to Hindu pilgrims",
  "group_size_min": 4,
  "group_size_max": 12,
  "popularity_score": 85,
  "is_active": true
}


GET http://localhost:5000/api/treks

GET http://localhost:5000/api/treks/1
GET http://localhost:5000/api/recommend/1
GET http://localhost:5000/api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...