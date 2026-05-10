const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../../config/env');

const genAI = env.GEMINI_API_KEY ? new GoogleGenerativeAI(env.GEMINI_API_KEY) : null;

const providerStatus = (fallbackReason = null) => ({
  provider: genAI ? 'gemini' : 'fallback',
  model: genAI ? env.GEMINI_MODEL : null,
  liveIntegrationEnabled: Boolean(genAI),
  ...(fallbackReason ? { fallbackReason } : {})
});

const asNumber = (value) => Number(value || 0);

const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));

const compactTrip = (input) => {
  const trip = input.trip;
  const fallbackStops = input.stops || [];
  const stops = trip?.stops || fallbackStops;
  const activities = input.activities || stops.flatMap((stop) => stop.activities || []);
  const budgetItems = trip?.budgetItems || input.budgetItems || [];
  const startDate = trip?.startDate || input.startDate;
  const endDate = trip?.endDate || input.endDate;

  return {
    title: trip?.title || input.title || input.destination || 'RouteWise trip',
    destination: input.destination || stops.map((stop) => `${stop.cityName || stop.city}, ${stop.country}`).join(' -> '),
    startDate,
    endDate,
    durationDays: input.durationDays || calculateDays(startDate, endDate),
    travelStyle: input.travelStyle || 'balanced',
    preferences: input.preferences || [],
    budget: asNumber(input.budget || trip?.totalEstimatedBudget),
    stops: stops.map((stop) => ({
      city: stop.cityName || stop.city,
      country: stop.country,
      arrivalDate: stop.arrivalDate || stop.arrival,
      departureDate: stop.departureDate || stop.departure,
      orderIndex: stop.orderIndex,
      activities: (stop.activities || []).map((activity) => ({
        title: activity.title || activity.name,
        category: activity.category,
        estimatedCost: asNumber(activity.estimatedCost || activity.cost),
        durationMinutes: activity.durationMinutes,
        location: activity.location,
        startTime: activity.startTime || activity.time
      }))
    })),
    activities: activities.map((activity) => ({
      title: activity.title || activity.name,
      category: activity.category,
      estimatedCost: asNumber(activity.estimatedCost || activity.cost),
      durationMinutes: activity.durationMinutes,
      location: activity.location
    })),
    budgetItems: budgetItems.map((item) => ({
      category: item.category,
      title: item.title,
      amount: asNumber(item.amount),
      currency: item.currency || 'USD'
    })),
    notes: input.notes || input.prompt || ''
  };
};

const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return 1;
  return Math.max(1, Math.round((end - start) / 86400000) + 1);
};

const extractJson = (text) => {
  if (!text || typeof text !== 'string') return null;
  const cleaned = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const first = cleaned.indexOf('{');
    const last = cleaned.lastIndexOf('}');
    if (first === -1 || last === -1 || last <= first) return null;
    try {
      return JSON.parse(cleaned.slice(first, last + 1));
    } catch {
      return null;
    }
  }
};

const schemaPrompt = (task, trip, schema) => `You are RouteWise AI, a practical travel-planning assistant.
Return JSON only. Do not use markdown.
Task: ${task}
Trip context:
${JSON.stringify(trip, null, 2)}
Required JSON schema:
${JSON.stringify(schema, null, 2)}
Use concrete, actionable travel advice. Mention overloaded days, city order, rest windows, transport, local area choices, and estimated savings when relevant.`;

const callGeminiJson = async ({ task, input, schema, fallback, normalize }) => {
  if (!genAI) return { ...fallback, ...providerStatus('Live AI is not configured') };

  try {
    const model = genAI.getGenerativeModel({ model: env.GEMINI_MODEL });
    const result = await model.generateContent(schemaPrompt(task, compactTrip(input), schema));
    const text = result.response.text();
    const parsed = extractJson(text);
    if (!parsed) {
      return {
        ...fallback,
        ...providerStatus('Live AI response needed formatting cleanup'),
        rawText: text.slice(0, 1000)
      };
    }
    return { ...normalize(parsed), ...providerStatus() };
  } catch (error) {
    console.error('Live AI request failed. Returning structured fallback AI response.');
    return { ...fallback, ...providerStatus('Live AI is temporarily unavailable') };
  }
};

const ask = (input) => {
  const trip = compactTrip(input);
  const prompt = String(input.prompt || input.notes || input.destination || '').trim();
  const lower = prompt.toLowerCase();
  const destinationHint =
    trip.destination ||
    (lower.includes('bali') && 'Bali') ||
    (lower.includes('jaipur') && 'Jaipur') ||
    (lower.includes('tokyo') && 'Tokyo') ||
    'your destination';
  const fallback = {
    title: destinationHint === 'your destination' ? 'RouteWise travel guidance' : `${destinationHint} travel ideas`,
    answer:
      destinationHint === 'your destination'
        ? 'Build the day around one anchor area, add one food stop nearby, and leave a flexible evening so the plan stays comfortable.'
        : `For ${destinationHint}, cluster sights by neighborhood, start with one signature cultural stop, add a local food experience, and keep one slower block for transit or rest.`,
    suggestions: [
      `Choose one walkable base in ${destinationHint} to reduce local transport time.`,
      'Plan no more than three timed activities in a day.',
      'Add one flexible evening after a long transfer or early start.'
    ],
    estimatedBudgetTips: [
      'Book intercity transfers early and compare train, bus, and shared car options.',
      'Use markets, food streets, or casual local restaurants for one meal each day.',
      'Stay near the old town or main transit area to cut daily ride costs.'
    ],
    bestFor: ['balanced planners', 'food-focused travelers', 'culture seekers'],
    nextSteps: [
      'Pick travel dates and a target budget.',
      'Add the first stop and one anchor activity.',
      'Run the stress meter once the day plan has three or more activities.'
    ]
  };

  return callGeminiJson({
    task: `Answer this free-form travel planning question directly: "${prompt}".`,
    input: { ...input, notes: prompt },
    fallback,
    schema: {
      title: 'string',
      answer: 'string',
      suggestions: ['string'],
      estimatedBudgetTips: ['string'],
      bestFor: ['string'],
      nextSteps: ['string']
    },
    normalize: (parsed) => ({
      title: String(parsed.title || fallback.title),
      answer: String(parsed.answer || parsed.response || fallback.answer),
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : fallback.suggestions,
      estimatedBudgetTips: Array.isArray(parsed.estimatedBudgetTips)
        ? parsed.estimatedBudgetTips
        : fallback.estimatedBudgetTips,
      bestFor: Array.isArray(parsed.bestFor) ? parsed.bestFor : fallback.bestFor,
      nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : fallback.nextSteps
    })
  });
};

const buildStress = (input) => {
  const trip = compactTrip(input);
  const activitiesPerDay = trip.activities.length / Math.max(1, trip.durationDays);
  const citySwitches = Math.max(0, trip.stops.length - 1);
  const switchIntensity = citySwitches / Math.max(1, trip.durationDays);
  const totalActivityCost = trip.activities.reduce((sum, item) => sum + asNumber(item.estimatedCost), 0);
  const totalBudgetItems = trip.budgetItems.reduce((sum, item) => sum + asNumber(item.amount), 0);
  const estimatedCost = Math.max(totalActivityCost, totalBudgetItems);

  let stressScore = 15;
  const reasons = [];
  const fixes = [];

  if (activitiesPerDay > 3) {
    stressScore += 30;
    reasons.push(`Average pace is ${activitiesPerDay.toFixed(1)} activities per day.`);
    fixes.push('Move one paid or timed activity into a lighter day.');
  }
  if (switchIntensity > 0.45) {
    stressScore += 30;
    reasons.push('The route changes cities frequently for the trip length.');
    fixes.push('Add a two-night stay before the next long transfer.');
  }
  if (trip.budget && estimatedCost > trip.budget) {
    stressScore += 20;
    reasons.push('Estimated costs are trending over the target budget.');
    fixes.push('Swap one intercity transfer or premium activity for a cheaper alternative.');
  }
  if (!trip.stops.length) {
    reasons.push('No stops are planned yet.');
    fixes.push('Add the first city and one anchor activity to make the itinerary measurable.');
  }

  const score = clamp(stressScore, 0, 100);
  const stressLevel = score > 65 ? 'High' : score > 35 ? 'Moderate' : 'Low';

  return {
    stressScore: score,
    stressLevel,
    reasons: reasons.length ? reasons : ['The itinerary has a manageable pace and enough planning room.'],
    fixes: fixes.length ? fixes : ['Keep one flexible evening open after arrival or major transfers.']
  };
};

const recommend = (input) => {
  const trip = compactTrip(input);
  const fallback = {
    recommendations: [
      {
        type: 'activity',
        title: trip.destination ? `Walkable highlights in ${trip.destination}` : 'Walkable city highlights',
        reason: 'Keeps the day practical by clustering sights, food, and downtime.',
        estimatedCost: 45,
        localTip: 'Stay near the old town or transit core to reduce local transport time.'
      },
      {
        type: 'food',
        title: 'Market-led food evening',
        reason: 'Food markets create a flexible dinner plan without a fixed reservation.',
        estimatedCost: 35,
        localTip: 'Go early, then leave the late evening open.'
      }
    ]
  };

  return callGeminiJson({
    task: 'Suggest activities, destinations, food experiences, transport ideas, and local tips based on the trip.',
    input,
    fallback,
    schema: {
      recommendations: [
        { type: 'activity | destination | food | transport | local_tip', title: 'string', reason: 'string', estimatedCost: 0, localTip: 'string' }
      ]
    },
    normalize: (parsed) => ({
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : fallback.recommendations
    })
  });
};

const improveItinerary = (input) => {
  const stress = buildStress(input);
  const trip = compactTrip(input);
  const fallback = {
    routeQualityScore: clamp(85 - stress.stressScore / 2, 0, 100),
    tripStressLevel: stress.stressLevel,
    overloadedDays: stress.stressScore > 35 ? ['Review days with more than three timed activities.'] : [],
    routeIssues: stress.reasons,
    pacingSuggestions: stress.fixes,
    betterRouteOrder: trip.stops.map((stop) => stop.city).filter(Boolean),
    restDaySuggestions: ['Add a rest evening after the longest transfer.']
  };

  return callGeminiJson({
    task: 'Analyze trip stops, dates, activities, travel density, and pacing.',
    input,
    fallback,
    schema: {
      routeQualityScore: 0,
      tripStressLevel: 'Low | Moderate | High',
      overloadedDays: ['string'],
      routeIssues: ['string'],
      pacingSuggestions: ['string'],
      betterRouteOrder: ['string'],
      restDaySuggestions: ['string']
    },
    normalize: (parsed) => ({
      routeQualityScore: clamp(parsed.routeQualityScore ?? fallback.routeQualityScore, 0, 100),
      tripStressLevel: ['Low', 'Moderate', 'High'].includes(parsed.tripStressLevel) ? parsed.tripStressLevel : fallback.tripStressLevel,
      overloadedDays: Array.isArray(parsed.overloadedDays) ? parsed.overloadedDays : fallback.overloadedDays,
      routeIssues: Array.isArray(parsed.routeIssues) ? parsed.routeIssues : fallback.routeIssues,
      pacingSuggestions: Array.isArray(parsed.pacingSuggestions) ? parsed.pacingSuggestions : fallback.pacingSuggestions,
      betterRouteOrder: Array.isArray(parsed.betterRouteOrder) ? parsed.betterRouteOrder : fallback.betterRouteOrder,
      restDaySuggestions: Array.isArray(parsed.restDaySuggestions) ? parsed.restDaySuggestions : fallback.restDaySuggestions
    })
  });
};

const optimizeBudget = (input) => {
  const trip = compactTrip(input);
  const currentEstimatedCost =
    trip.budgetItems.reduce((sum, item) => sum + asNumber(item.amount), 0) ||
    trip.activities.reduce((sum, item) => sum + asNumber(item.estimatedCost), 0) ||
    trip.budget;
  const fallback = {
    currentEstimatedCost,
    possibleSavings: Math.round(currentEstimatedCost * 0.12),
    categorySuggestions: [
      { category: 'transport', suggestion: 'Compare train and shared transfer legs before booking.', estimatedSavings: Math.round(currentEstimatedCost * 0.05) },
      { category: 'stay', suggestion: 'Stay near the old town or transit hub to reduce daily local transport.', estimatedSavings: Math.round(currentEstimatedCost * 0.04) }
    ],
    budgetRiskLevel: trip.budget && currentEstimatedCost > trip.budget ? 'High' : 'Moderate',
    cheaperAlternatives: ['Replace one premium activity with a free viewpoint or self-guided walk.']
  };

  return callGeminiJson({
    task: 'Analyze budget categories and suggest realistic savings.',
    input,
    fallback,
    schema: {
      currentEstimatedCost: 0,
      possibleSavings: 0,
      categorySuggestions: [{ category: 'string', suggestion: 'string', estimatedSavings: 0 }],
      budgetRiskLevel: 'Low | Moderate | High',
      cheaperAlternatives: ['string']
    },
    normalize: (parsed) => ({
      currentEstimatedCost: asNumber(parsed.currentEstimatedCost || fallback.currentEstimatedCost),
      possibleSavings: asNumber(parsed.possibleSavings || fallback.possibleSavings),
      categorySuggestions: Array.isArray(parsed.categorySuggestions) ? parsed.categorySuggestions : fallback.categorySuggestions,
      budgetRiskLevel: ['Low', 'Moderate', 'High'].includes(parsed.budgetRiskLevel) ? parsed.budgetRiskLevel : fallback.budgetRiskLevel,
      cheaperAlternatives: Array.isArray(parsed.cheaperAlternatives) ? parsed.cheaperAlternatives : fallback.cheaperAlternatives
    })
  });
};

const generateSummary = (input) => {
  const trip = compactTrip(input);
  const fallback = {
    title: trip.title,
    shortSummary: trip.destination
      ? `A practical RouteWise itinerary through ${trip.destination}, balancing highlights, food, transit, and downtime.`
      : 'A practical RouteWise itinerary balancing highlights, food, transit, and downtime.',
    highlights: trip.stops.slice(0, 4).map((stop) => stop.city).filter(Boolean),
    bestFor: ['culture seekers', 'food-focused travelers', 'balanced planners'],
    shareCaption: 'Here is the RouteWise plan: thoughtful pacing, useful budget checks, and room to breathe.'
  };

  return callGeminiJson({
    task: 'Generate a polished trip recap for sharing.',
    input,
    fallback,
    schema: {
      title: 'string',
      shortSummary: 'string',
      highlights: ['string'],
      bestFor: ['string'],
      shareCaption: 'string'
    },
    normalize: (parsed) => ({
      title: String(parsed.title || fallback.title),
      shortSummary: String(parsed.shortSummary || parsed.summary || fallback.shortSummary),
      highlights: Array.isArray(parsed.highlights) ? parsed.highlights : fallback.highlights,
      bestFor: Array.isArray(parsed.bestFor) ? parsed.bestFor : fallback.bestFor,
      shareCaption: String(parsed.shareCaption || fallback.shareCaption)
    })
  });
};

const stressMeter = (input) => {
  const fallback = buildStress(input);

  return callGeminiJson({
    task: 'Calculate itinerary stress from real trip data and return only stress meter JSON.',
    input,
    fallback,
    schema: {
      stressScore: 0,
      stressLevel: 'Low | Moderate | High',
      reasons: ['string'],
      fixes: ['string']
    },
    normalize: (parsed) => ({
      stressScore: clamp(parsed.stressScore ?? fallback.stressScore, 0, 100),
      stressLevel: ['Low', 'Moderate', 'High'].includes(parsed.stressLevel) ? parsed.stressLevel : fallback.stressLevel,
      reasons: Array.isArray(parsed.reasons) ? parsed.reasons : fallback.reasons,
      fixes: Array.isArray(parsed.fixes) ? parsed.fixes : fallback.fixes
    })
  });
};

module.exports = {
  ask,
  recommend,
  improveItinerary,
  optimizeBudget,
  generateSummary,
  stressMeter
};
