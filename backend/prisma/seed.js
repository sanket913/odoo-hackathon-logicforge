const { PrismaClient, BudgetLevel } = require('@prisma/client');

const prisma = new PrismaClient();

const cities = [
  { name: 'Paris', country: 'France', region: 'Europe', costIndex: 4.5, popularity: 98, imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34' },
  { name: 'Rome', country: 'Italy', region: 'Europe', costIndex: 4.0, popularity: 96, imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5' },
  { name: 'Barcelona', country: 'Spain', region: 'Europe', costIndex: 3.8, popularity: 95, imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4' },
  { name: 'Tokyo', country: 'Japan', region: 'East Asia', costIndex: 4.7, popularity: 99, imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf' },
  { name: 'Kyoto', country: 'Japan', region: 'East Asia', costIndex: 4.1, popularity: 94, imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e' },
  { name: 'Seoul', country: 'South Korea', region: 'East Asia', costIndex: 3.9, popularity: 93, imageUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241' },
  { name: 'Dubai', country: 'United Arab Emirates', region: 'Middle East', costIndex: 4.6, popularity: 92, imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c' },
  { name: 'Bali', country: 'Indonesia', region: 'Southeast Asia', costIndex: 2.6, popularity: 96, imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4' },
  { name: 'Singapore', country: 'Singapore', region: 'Southeast Asia', costIndex: 4.3, popularity: 91, imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd' },
  { name: 'Bangkok', country: 'Thailand', region: 'Southeast Asia', costIndex: 2.7, popularity: 94, imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365' },
  { name: 'New York', country: 'United States', region: 'North America', costIndex: 5.0, popularity: 97, imageUrl: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee' },
  { name: 'Amsterdam', country: 'Netherlands', region: 'Europe', costIndex: 4.4, popularity: 90, imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4' },
  { name: 'Istanbul', country: 'Turkey', region: 'Europe/Asia', costIndex: 3.1, popularity: 93, imageUrl: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b' },
  { name: 'Santorini', country: 'Greece', region: 'Europe', costIndex: 4.2, popularity: 95, imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff' },
  { name: 'Sydney', country: 'Australia', region: 'Oceania', costIndex: 4.6, popularity: 91, imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9' },
  { name: 'Cape Town', country: 'South Africa', region: 'Africa', costIndex: 3.2, popularity: 89, imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99' },
  { name: 'Jaipur', country: 'India', region: 'South Asia', costIndex: 2.2, popularity: 94, imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41' },
  { name: 'Udaipur', country: 'India', region: 'South Asia', costIndex: 2.4, popularity: 90, imageUrl: 'https://images.unsplash.com/photo-1597074866923-dc0589150358' },
  { name: 'Jodhpur', country: 'India', region: 'South Asia', costIndex: 2.1, popularity: 88, imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245' },
  { name: 'Varanasi', country: 'India', region: 'South Asia', costIndex: 1.9, popularity: 91, imageUrl: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca' },
  { name: 'Rishikesh', country: 'India', region: 'South Asia', costIndex: 2.0, popularity: 87, imageUrl: 'https://images.unsplash.com/photo-1610715936287-6c2ad208cdbf' },
  { name: 'Manali', country: 'India', region: 'South Asia', costIndex: 2.3, popularity: 89, imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23' },
  { name: 'Goa', country: 'India', region: 'South Asia', costIndex: 2.8, popularity: 93, imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2' },
  { name: 'Alleppey', country: 'India', region: 'South Asia', costIndex: 2.6, popularity: 86, imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944' },
  { name: 'Munnar', country: 'India', region: 'South Asia', costIndex: 2.2, popularity: 85, imageUrl: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2' },
  { name: 'Amritsar', country: 'India', region: 'South Asia', costIndex: 2.0, popularity: 88, imageUrl: 'https://images.unsplash.com/photo-1609947017136-9daf32a5eb16' },
  { name: 'Agra', country: 'India', region: 'South Asia', costIndex: 2.2, popularity: 96, imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523' },
  { name: 'Mumbai', country: 'India', region: 'South Asia', costIndex: 3.0, popularity: 92, imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f' },
  { name: 'Delhi', country: 'India', region: 'South Asia', costIndex: 2.8, popularity: 91, imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5' },
  { name: 'Kutch', country: 'India', region: 'South Asia', costIndex: 2.4, popularity: 82, imageUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3' },
  { name: 'Hampi', country: 'India', region: 'South Asia', costIndex: 2.0, popularity: 84, imageUrl: 'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788' },
  { name: 'Mysuru', country: 'India', region: 'South Asia', costIndex: 2.1, popularity: 86, imageUrl: 'https://images.unsplash.com/photo-1600112356915-089abb8fc71a' },
  { name: 'Coorg', country: 'India', region: 'South Asia', costIndex: 2.5, popularity: 84, imageUrl: 'https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf' }
];

const activitySuggestions = [
  { cityName: 'Jaipur', country: 'India', title: 'Jaipur City Palace Tour', description: 'Explore courtyards, royal galleries, and architecture in the heart of the Pink City.', category: 'heritage', estimatedCost: 28, budgetLevel: BudgetLevel.MEDIUM, location: 'City Palace' },
  { cityName: 'Jaipur', country: 'India', title: 'Hawa Mahal Photo Walk', description: 'A golden-hour walk around Hawa Mahal, Johari Bazaar, and nearby chai stops.', category: 'culture', estimatedCost: 12, budgetLevel: BudgetLevel.LOW, location: 'Hawa Mahal' },
  { cityName: 'Jaipur', country: 'India', title: 'Amber Fort Light Show', description: 'Evening storytelling and fort views after a slower afternoon.', category: 'culture', estimatedCost: 18, budgetLevel: BudgetLevel.LOW, location: 'Amber Fort' },
  { cityName: 'Udaipur', country: 'India', title: 'Udaipur Lake Pichola Boat Ride', description: 'A scenic lake loop with palace views and a relaxed sunset pace.', category: 'relaxation', estimatedCost: 24, budgetLevel: BudgetLevel.MEDIUM, location: 'Lake Pichola' },
  { cityName: 'Jodhpur', country: 'India', title: 'Jodhpur Mehrangarh Fort Visit', description: 'Walk the ramparts, museum rooms, and blue-city viewpoints.', category: 'heritage', estimatedCost: 20, budgetLevel: BudgetLevel.MEDIUM, location: 'Mehrangarh Fort' },
  { cityName: 'Varanasi', country: 'India', title: 'Varanasi Ganga Aarti', description: 'Attend the evening river ceremony with time for the ghats before dusk.', category: 'culture', estimatedCost: 8, budgetLevel: BudgetLevel.LOW, location: 'Dashashwamedh Ghat' },
  { cityName: 'Rishikesh', country: 'India', title: 'Rishikesh River Rafting', description: 'A guided rafting run with safety gear and a post-ride riverside meal.', category: 'adventure', estimatedCost: 36, budgetLevel: BudgetLevel.MEDIUM, location: 'Ganga river stretch' },
  { cityName: 'Manali', country: 'India', title: 'Manali Solang Valley Adventure', description: 'Plan a half-day for mountain views, adventure activities, and flexible weather buffers.', category: 'adventure', estimatedCost: 42, budgetLevel: BudgetLevel.MEDIUM, location: 'Solang Valley' },
  { cityName: 'Goa', country: 'India', title: 'Goa Beach Shack Food Trail', description: 'Sample seafood, poi, and local snacks across a relaxed beach-shack crawl.', category: 'food', estimatedCost: 32, budgetLevel: BudgetLevel.MEDIUM, location: 'North Goa beach belt' },
  { cityName: 'Alleppey', country: 'India', title: 'Kerala Backwater Houseboat', description: 'Slow cruise through canals, coconut groves, and a traditional onboard meal.', category: 'relaxation', estimatedCost: 95, budgetLevel: BudgetLevel.HIGH, location: 'Alleppey backwaters' },
  { cityName: 'Munnar', country: 'India', title: 'Munnar Tea Plantation Walk', description: 'Walk tea slopes with a local guide and add a tasting stop.', category: 'nature', estimatedCost: 18, budgetLevel: BudgetLevel.LOW, location: 'Tea estates' },
  { cityName: 'Amritsar', country: 'India', title: 'Amritsar Golden Temple Visit', description: 'Visit the complex respectfully and leave time for langar and nearby lanes.', category: 'heritage', estimatedCost: 5, budgetLevel: BudgetLevel.LOW, location: 'Golden Temple' },
  { cityName: 'Agra', country: 'India', title: 'Agra Taj Mahal Sunrise Tour', description: 'Start early for softer light, lower heat, and a calmer route through the monument.', category: 'heritage', estimatedCost: 30, budgetLevel: BudgetLevel.MEDIUM, location: 'Taj Mahal' },
  { cityName: 'Mumbai', country: 'India', title: 'Mumbai Street Food Walk', description: 'Try vada pav, pav bhaji, kebabs, and kulfi with short transfers between stops.', category: 'food', estimatedCost: 26, budgetLevel: BudgetLevel.MEDIUM, location: 'Fort and Girgaon' },
  { cityName: 'Delhi', country: 'India', title: 'Delhi Heritage Walk', description: 'A guided Old Delhi route with history, markets, and food stops kept close together.', category: 'heritage', estimatedCost: 24, budgetLevel: BudgetLevel.MEDIUM, location: 'Old Delhi' },
  { cityName: 'Kutch', country: 'India', title: 'Kutch White Desert Visit', description: 'Plan sunset over the salt flats with time for craft villages and a warm layer.', category: 'nature', estimatedCost: 38, budgetLevel: BudgetLevel.MEDIUM, location: 'White Rann' },
  { cityName: 'Hampi', country: 'India', title: 'Hampi Ruins Cycling Tour', description: 'Cycle between temples, boulders, and riverside viewpoints with a midday break.', category: 'adventure', estimatedCost: 20, budgetLevel: BudgetLevel.LOW, location: 'Hampi ruins' },
  { cityName: 'Mysuru', country: 'India', title: 'Mysuru Palace Visit', description: 'Tour the palace and pair it with nearby markets instead of another long transfer.', category: 'heritage', estimatedCost: 14, budgetLevel: BudgetLevel.LOW, location: 'Mysuru Palace' },
  { cityName: 'Coorg', country: 'India', title: 'Coorg Coffee Plantation Tour', description: 'Walk through coffee estates, learn processing basics, and finish with a tasting.', category: 'nature', estimatedCost: 22, budgetLevel: BudgetLevel.MEDIUM, location: 'Coffee estate' },
  { cityName: 'Bali', country: 'Indonesia', title: 'Bali Temple Trail', description: 'Cluster two temples with rice terraces and a cafe stop to avoid backtracking.', category: 'culture', estimatedCost: 34, budgetLevel: BudgetLevel.MEDIUM, location: 'Ubud and central Bali' },
  { cityName: 'Tokyo', country: 'Japan', title: 'Tokyo Food Alley Walk', description: 'A compact evening through izakaya lanes, ramen counters, and dessert stops.', category: 'food', estimatedCost: 58, budgetLevel: BudgetLevel.MEDIUM, location: 'Shinjuku' },
  { cityName: 'Paris', country: 'France', title: 'Paris Museum Pass Day', description: 'Use one focused museum day with cafe breaks instead of scattering galleries across the trip.', category: 'culture', estimatedCost: 72, budgetLevel: BudgetLevel.HIGH, location: 'Central Paris' },
  { cityName: 'Rome', country: 'Italy', title: 'Rome Colosseum Guided Walk', description: 'A timed entry and guided route through the Colosseum, Forum, and nearby streets.', category: 'heritage', estimatedCost: 65, budgetLevel: BudgetLevel.HIGH, location: 'Colosseum and Roman Forum' },
  { cityName: 'Dubai', country: 'United Arab Emirates', title: 'Dubai Desert Safari', description: 'Evening dunes, dinner, and stargazing after a slower morning in the city.', category: 'adventure', estimatedCost: 82, budgetLevel: BudgetLevel.HIGH, location: 'Dubai desert conservation area' },
  { cityName: 'Singapore', country: 'Singapore', title: 'Singapore Gardens by the Bay', description: 'Pair the domes, Supertree Grove, and nearby hawker dinner in one easy route.', category: 'nature', estimatedCost: 38, budgetLevel: BudgetLevel.MEDIUM, location: 'Marina Bay' },
  { cityName: 'Bangkok', country: 'Thailand', title: 'Bangkok Floating Market', description: 'Start early for canals, snacks, and a calmer return before afternoon traffic.', category: 'shopping', estimatedCost: 45, budgetLevel: BudgetLevel.MEDIUM, location: 'Floating market district' },
  { cityName: 'Seoul', country: 'South Korea', title: 'Seoul Night Market', description: 'Street snacks, indie shops, and transit-friendly evening energy.', category: 'nightlife', estimatedCost: 40, budgetLevel: BudgetLevel.MEDIUM, location: 'Myeongdong or Hongdae' },
  { cityName: 'Santorini', country: 'Greece', title: 'Santorini Sunset Cruise', description: 'A slow evening on the caldera with swimming stops and dinner onboard.', category: 'relaxation', estimatedCost: 120, budgetLevel: BudgetLevel.HIGH, location: 'Caldera coast' }
];

async function main() {
  for (const city of cities) {
    await prisma.city.upsert({
      where: { name_country: { name: city.name, country: city.country } },
      update: city,
      create: city
    });
  }

  await prisma.activitySuggestion.deleteMany();
  await prisma.activitySuggestion.createMany({
    data: activitySuggestions
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seed data created.');
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
