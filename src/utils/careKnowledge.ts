import { DiseaseCarePlan } from '../types';

/**
 * Normalizes raw model labels like "Tomato___Early_blight" into readable English
 */
export function formatDiseaseLabel(rawLabel: string): { crop: string; condition: string; isHealthy: boolean } {
  if (!rawLabel) {
    return { crop: 'Plant', condition: 'Unspecified Condition', isHealthy: false };
  }

  const isHealthy = rawLabel.toLowerCase().includes('healthy');
  
  // Format standard dataset patterns like "Tomato___Bacterial_spot" or "Potato_Early_Blight"
  let cleaned = rawLabel.replace(/___/g, ' - ').replace(/__/g, ' - ').replace(/_/g, ' ');
  const parts = cleaned.split('-').map((s) => s.trim());

  let crop = 'Plant';
  let condition = cleaned;

  if (parts.length >= 2) {
    crop = parts[0];
    condition = parts.slice(1).join(' - ');
  } else if (rawLabel.includes(' ')) {
    const spaceParts = rawLabel.split(' ');
    crop = spaceParts[0];
    condition = spaceParts.slice(1).join(' ');
  }

  // Capitalize properly
  const capitalize = (str: string) =>
    str
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  return {
    crop: capitalize(crop),
    condition: capitalize(condition),
    isHealthy,
  };
}

/**
 * Knowledge repository for tailored organic and agronomical care protocols
 */
const CARE_DATABASE: Record<string, Partial<DiseaseCarePlan>> = {
  'early blight': {
    severity: 'moderate',
    summary:
      'Early Blight (caused by Alternaria solani) produces concentric dark brown ring spots on mature leaves, leading to yellowing and defoliation.',
    organicRemedies: [
      'Apply bio-fungicides containing Bacillus subtilis or Trichoderma viride early in the morning.',
      'Spray dilute copper soap fungicide or 1% Bordeaux mixture on lower foliage.',
      'Neem oil foliar spray (5ml per liter) every 7–10 days to inhibit fungal spore development.',
    ],
    preventiveMeasures: [
      'Mulch heavily around the plant base with clean straw to prevent soil splashing onto bottom leaves.',
      'Prune the lowest 12 inches of foliage to enhance airflow and sunlight penetration.',
      'Practice 3-year crop rotation; avoid planting nightshades (tomatoes, potatoes, eggplants) consecutively.',
    ],
    wateringAdvice:
      'Water strictly at soil level using drip or soaker hoses. Avoid wetting leaves or watering in late afternoon/evening.',
    soilSunlightTips:
      'Ensure at least 6–8 hours of direct sunshine. Maintain soil pH between 6.2–6.8 with balanced slow-release potassium.',
    chemicalAdvice:
      'Chlorothalonil or Azoxystrobin applied according to local agricultural extension safety intervals if infection crosses 20% foliage.',
  },
  'late blight': {
    severity: 'high',
    summary:
      'Late Blight (Phytophthora infestans) is an aggressive water mold causing rapid water-soaked lesions, white spore fuzz under damp conditions, and stem collapse.',
    organicRemedies: [
      'Immediately isolate infected plants and remove severely infected branches in sealed bags (do not compost).',
      'Copper-based fungicidal sprays can slow down spore germination on surrounding healthy foliage.',
      'Potassium bicarbonate foliar sprays to alter surface pH against spore proliferation.',
    ],
    preventiveMeasures: [
      'Destroy any volunteer potato tubers or infected nightshade remnants before each growing season.',
      'Provide ample spacing (at least 24–36 inches between plants) to minimize prolonged canopy moisture.',
      'Choose resistant cultivars (e.g., Mountain Merit, Defiant PhR) for damp coastal or rainy regions.',
    ],
    wateringAdvice:
      'Cease all overhead sprinklers immediately. Keep foliage completely dry, especially during humid overcast periods.',
    soilSunlightTips:
      'Plant in full sun with well-draining raised beds to prevent pooled water around root systems.',
    chemicalAdvice:
      'Mancozeb or Cymoxanil preventative treatment if widespread outbreaks are reported in your county/district.',
  },
  'bacterial spot': {
    severity: 'moderate',
    summary:
      'Bacterial Spot (Xanthomonas spp.) causes small, angular, dark water-soaked spots with yellow halos on leaves and scabby lesions on fruits.',
    organicRemedies: [
      'Apply fixed copper hydroxide combined with certified bio-bactericide (e.g. Bacillus amyloliquefaciens).',
      'Spray garlic and horticultural soap extract to suppress bacterial population on leaf surfaces.',
    ],
    preventiveMeasures: [
      'Disinfect all pruning shears, stakes, and cages with 70% alcohol between plants.',
      'Never prune, tie, or harvest plants while foliage is wet from dew or rain.',
      'Use certified pathogen-free seeds and hot-water treated seedlings.',
    ],
    wateringAdvice:
      'Water directly into the root zone via drip lines. Avoid overhead splash that easily spreads bacterial cells.',
    soilSunlightTips:
      'Elevate plant canopies with sturdy trellising to accelerate wind drying after rain.',
  },
  'powdery mildew': {
    severity: 'moderate',
    summary:
      'Powdery Mildew presents as powdery white or grayish fungal patches covering upper leaf surfaces, stunting photosynthesis.',
    organicRemedies: [
      'Milk-water spray (40% milk to 60% water) sprayed in full sunlight produces natural antiseptic free-radicals.',
      'Potassium bicarbonate or baking soda solution (1 tsp baking soda + 1/2 tsp vegetable oil per quart of water).',
      'Sulfur dust or wettable sulfur applied during cooler morning temperatures (below 85°F / 30°C).',
    ],
    preventiveMeasures: [
      'Thin dense center foliage to encourage constant gentle breeze through the interior canopy.',
      'Plant mildew-tolerant seed varieties and avoid over-fertilizing with excessive quick-release nitrogen.',
    ],
    wateringAdvice:
      'Water deeply once or twice a week at the base rather than shallow daily watering.',
    soilSunlightTips:
      'Position plants in high-light areas; fungal conidia thrive in warm, shaded, humid stagnant microclimates.',
  },
  'leaf mold': {
    severity: 'moderate',
    summary:
      'Leaf Mold (Passalora fulva) causes pale green to yellowish spots on upper leaf surfaces with olive-velvet mold growth underneath.',
    organicRemedies: [
      'Copper soap fungicides applied to both upper and lower leaf surfaces.',
      'Increase greenhouse or indoor ventilation immediately with oscillating fans.',
    ],
    preventiveMeasures: [
      'Keep relative humidity strictly below 85% in greenhouses or enclosed tunnels.',
      'Space plants widely and prune suckers to promote rapid moisture evaporation.',
    ],
    wateringAdvice:
      'Early morning root watering so any incidental splashes evaporate rapidly during morning warmth.',
    soilSunlightTips:
      'Maximize natural daylight exposure and avoid cold, damp stagnant air pockets.',
  },
  'septoria leaf spot': {
    severity: 'moderate',
    summary:
      'Septoria Leaf Spot displays numerous circular spots with dark brown margins and sunken grayish centers, specked with tiny black fruiting bodies.',
    organicRemedies: [
      'Pinch off the lowest affected leaves as soon as initial spots emerge.',
      'Bio-fungicide containing Bacillus pumilus or liquid copper octanoate.',
    ],
    preventiveMeasures: [
      'Apply a 2-inch organic pine or straw mulch barrier over the soil bed.',
      'Clean garden beds thoroughly at the end of the season; remove and burn or bag fallen debris.',
    ],
    wateringAdvice:
      'Drip irrigation only. Keep watering cycles strictly restricted to sunrise hours.',
    soilSunlightTips:
      'Full sun exposure; ensure well-aerated sandy loam or loamy garden soil.',
  },
  'rust': {
    severity: 'moderate',
    summary:
      'Rust diseases create distinctive reddish-orange, powdery pustules under leaves, causing premature yellowing and leaf drop.',
    organicRemedies: [
      'Dust with organic sulfur early in the season before spores spread.',
      'Neem oil or horticultural oil spray every 7–10 days on lower leaf surfaces.',
    ],
    preventiveMeasures: [
      'Remove alternate host weeds and grasses growing adjacent to your crop boundaries.',
      'Avoid high-density planting that restricts cross-ventilation.',
    ],
    wateringAdvice:
      'Ensure soil drainage is swift; avoid pooling around root collars.',
    soilSunlightTips:
      'Bright direct sunlight and well-aerated soil amended with compost.',
  },
  'healthy': {
    severity: 'healthy',
    summary:
      'The leaf exhibits vibrant chlorophyll coloration, strong cellular turgor, and no macroscopic fungal, bacterial, or necrotic lesions.',
    organicRemedies: [
      'Maintain existing balanced cultural practices.',
      'Apply mild seaweed extract or compost tea monthly as a general foliar tonic.',
    ],
    preventiveMeasures: [
      'Conduct weekly scouting of both upper and lower leaf surfaces for early signs of pests or spotting.',
      'Maintain steady soil moisture and keep garden tools sanitized.',
      'Rotate crops season-to-season to preserve soil biodiversity.',
    ],
    wateringAdvice:
      'Continue standard watering schedule suited for this crop species (allow top 1–2 inches of soil to dry before re-watering).',
    soilSunlightTips:
      'Maintain standard optimal photoperiod and fertile, loose, organically rich soil.',
  },
};

/**
 * Returns comprehensive care recommendation for a given disease label
 */
export function getCareRecommendation(rawLabel?: string): DiseaseCarePlan {
  if (!rawLabel) {
    return getGeneralCarePlan();
  }

  const { crop, condition, isHealthy } = formatDiseaseLabel(rawLabel);
  const lowerCond = condition.toLowerCase();

  // Search in database
  let matchedKey = Object.keys(CARE_DATABASE).find((key) => lowerCond.includes(key));
  if (isHealthy) matchedKey = 'healthy';

  const entry = matchedKey ? CARE_DATABASE[matchedKey] : null;

  if (entry) {
    return {
      crop,
      condition,
      severity: entry.severity || (isHealthy ? 'healthy' : 'moderate'),
      summary: entry.summary || `Observed signs of ${condition} in ${crop}.`,
      organicRemedies: entry.organicRemedies || [
        'Apply organic neem foliar spray (5ml/L) in early morning.',
        'Prune affected foliage with sterilized shears and dispose away from the field.',
      ],
      preventiveMeasures: entry.preventiveMeasures || [
        'Ensure proper plant spacing for sunlight and air penetration.',
        'Clean fallen leaves and garden debris around the root zone.',
        'Rotate crops annually to disrupt soil-borne pathogens.',
      ],
      wateringAdvice:
        entry.wateringAdvice ||
        'Water at soil level via drip irrigation; avoid leaf wetting.',
      soilSunlightTips:
        entry.soilSunlightTips ||
        'Provide full sunlight (6–8 hrs daily) and fertile, well-draining soil.',
      chemicalAdvice: entry.chemicalAdvice,
    };
  }

  // Fallback for custom or unrecognized labels
  return {
    crop,
    condition,
    severity: isHealthy ? 'healthy' : 'moderate',
    summary: `Identified condition: ${condition} on ${crop}. AI diagnosis indicates potential foliar stress or pathogen development.`,
    organicRemedies: [
      'Isolate symptomatic plants or trim heavily damaged leaves.',
      'Spray organic neem oil extract or copper-based bio-fungicide during early morning hours.',
      'Apply compost tea or bio-stimulants to strengthen systemic acquired resistance (SAR).',
    ],
    preventiveMeasures: [
      'Improve air circulation by pruning dense inner branches.',
      'Never handle or cultivate foliage while moist with morning dew or rain.',
      'Disinfect pruning tools with rubbing alcohol between plants.',
    ],
    wateringAdvice:
      'Avoid overhead sprinklers. Direct water to the base of the stem and allow topsoil to breathe between waterings.',
    soilSunlightTips:
      'Ensure adequate sunlight (6+ hours) and avoid compacted or waterlogged soil.',
  };
}

/**
 * Default general plant care guidelines when no specific diagnosis is present
 */
export function getGeneralCarePlan(): DiseaseCarePlan {
  return {
    crop: 'General Crops & Houseplants',
    condition: 'General Plant Wellness & Prevention Guide',
    severity: 'healthy',
    summary:
      'Proactive care and preventative horticulture are the best defenses against pests and pathogens before visual symptoms emerge.',
    organicRemedies: [
      'Proactive neem oil foliar spray (1–2 times monthly) as a natural deterrent against soft-bodied pests and fungal spores.',
      'Apply mycorrhizal fungi at root zone during transplanting to boost nutrient uptake and pathogen resistance.',
      'Incorporate worm castings or mature compost into the top 2 inches of soil.',
    ],
    preventiveMeasures: [
      'Maintain good spacing between plants (18–36 inches for heavy crops) to prevent stagnant humidity pockets.',
      'Always sterilize pruners and shears with 70% isopropyl alcohol or 10% bleach solution between cuts.',
      'Scout the undersides of leaves weekly with a 10x hand lens for early nymph colonies or fungal spots.',
    ],
    wateringAdvice:
      'Always follow the "finger test": insert your finger 1–2 inches into soil. Water only when dry, and water directly at the base.',
    soilSunlightTips:
      'Ensure pots have unobstructed drainage holes. Match plant varieties with their required photoperiod (full sun vs partial shade).',
  };
}
