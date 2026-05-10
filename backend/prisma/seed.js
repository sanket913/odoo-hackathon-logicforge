const bcrypt = require('bcrypt');
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
  { name: 'Cape Town', country: 'South Africa', region: 'Africa', costIndex: 3.2, popularity: 89, imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99' }
];

const activityTemplates = [
  { category: 'heritage', title: 'Old quarter heritage walk', description: 'A guided route through historic streets and landmark architecture.', estimatedCost: 45, budgetLevel: BudgetLevel.MEDIUM, location: 'Historic center' },
  { category: 'food', title: 'Local food crawl', description: 'Taste signature dishes across market stalls and neighborhood favorites.', estimatedCost: 55, budgetLevel: BudgetLevel.MEDIUM, location: 'Central market' },
  { category: 'adventure', title: 'Scenic active half-day', description: 'A light adventure option with strong views and flexible pacing.', estimatedCost: 75, budgetLevel: BudgetLevel.HIGH, location: 'Outdoor district' },
  { category: 'culture', title: 'Museum and culture pass', description: 'A compact cultural loop with one museum and one local performance or gallery.', estimatedCost: 40, budgetLevel: BudgetLevel.MEDIUM, location: 'Arts district' },
  { category: 'nature', title: 'Park and viewpoint reset', description: 'Green space, skyline views, and a slower afternoon between busy plans.', estimatedCost: 10, budgetLevel: BudgetLevel.LOW, location: 'City park' },
  { category: 'shopping', title: 'Design and market browse', description: 'Independent shops, crafts, and local design without overloading the day.', estimatedCost: 35, budgetLevel: BudgetLevel.MEDIUM, location: 'Market lane' },
  { category: 'nightlife', title: 'Evening neighborhood crawl', description: 'Low-pressure bars, music spots, and late-night bites in a walkable area.', estimatedCost: 60, budgetLevel: BudgetLevel.MEDIUM, location: 'Nightlife quarter' },
  { category: 'relaxation', title: 'Slow morning wellness block', description: 'A calm start with coffee, a spa or bathhouse option, and unplanned time.', estimatedCost: 50, budgetLevel: BudgetLevel.MEDIUM, location: 'Wellness district' }
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
    data: cities.flatMap((city) =>
      activityTemplates.map((activity) => ({
        cityName: city.name,
        country: city.country,
        title: `${city.name} ${activity.title}`,
        description: activity.description,
        category: activity.category,
        estimatedCost: activity.estimatedCost,
        budgetLevel: activity.budgetLevel,
        location: activity.location
      }))
    )
  });

  const passwordHash = await bcrypt.hash('Password123!', 12);
  await prisma.user.upsert({
    where: { email: 'demo@routewise.app' },
    update: { name: 'RouteWise Demo', passwordHash },
    create: {
      name: 'RouteWise Demo',
      email: 'demo@routewise.app',
      passwordHash
    }
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
