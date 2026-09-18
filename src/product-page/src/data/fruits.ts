import { FruitSpecimen } from '../types';

export const FRUIT_SPECIMENS: FruitSpecimen[] = [
  {
    id: 'apple',
    name: 'Apples',
    botanicalName: 'Malus domestica',
    tagline: 'Global Orchards • Single Cold Standard',
    heroHeadline: 'Different origins. Different seasons.',
    heroSubheadline: 'One uncompromising cold standard. Sourced directly from premier grower co-operatives in Washington, Chile, New Zealand, and South Africa for continuous Indian supply.',
    strongStatement: 'Different origins. Different seasons. One standard.',
    heroCta: 'Explore Apple Varieties',
    brixLevel: 15.8,
    acidity: 'Balanced Malic',
    harvestWindow: 'Continuous 12-Month Sourcing',
    origin: 'Washington, Chile & New Zealand',
    elevation: '420m – 780m',
    notes: ['Crisp Cell Wall', 'Natural Wax Bloom', 'Refractive Sugar Core'],
    description: 'Direct-orchard allocations grown in high-altitude volcanic soils with wide diurnal shifts, producing exceptionally dense cellular matrices that snap with acoustic brilliance.',
    flavorProfile: {
      sweetness: 88,
      tartness: 42,
      aroma: 92,
      crispness: 98,
    },
    // 02 Origin & Journey
    originStory: {
      growingRegions: [
        'Yakima Valley & Wenatchee, Washington (USA)',
        'Curicó & Maule Valleys (Chile)',
        "Hawke's Bay (New Zealand)",
        'South Tyrol & Trentino (Northern Italy)',
        'Ceres Valley, Western Cape (South Africa)',
      ],
      packhouse: 'Automated optical sort line: individual NIR infrared internal defect detection, acoustic firmness indexing, and food-grade hydro-cooling down to 1.0°C within 4 hours of tree harvest.',
      seasonWindow: 'Continuous multi-hemisphere rotation ensuring harvest-fresh fruit in India 52 weeks a year without prolonged hypobaric storage fatigue.',
      journeyRoute: 'Farm packhouse pre-cooling → CA Controlled Atmosphere marine reefer container (0.5°C, 92% RH) → Direct ocean freight to Nhava Sheva (Mumbai) & Chennai Port → Temperature-logged domestic fleet.',
      summary: 'From Northern Hemisphere autumn peaks to Southern Hemisphere fresh spring pickings, our cold chain ensures zero break in quality or firmness.',
    },
    // 03 Varieties
    varieties: [
      {
        id: 'royal-gala',
        name: 'Royal Gala',
        grade: 'Extra Fancy',
        brix: '13.5° – 14.8°',
        notes: 'Dense cream flesh with delicate yellow-red striping. Mild, aromatic sweetness with low acidity.',
        harvestWindow: 'Feb – Jul (Chile/NZ) • Aug – Dec (USA)',
        bestFor: 'High-volume retail & daily snacking',
        badge: 'Top Volume Mover',
      },
      {
        id: 'fuji',
        name: 'Red Fuji',
        grade: 'Extra Fancy Premium',
        brix: '15.0° – 17.2°',
        notes: 'Honey-sweet flavor profile with ultra-dense cellular snap and prolonged cold shelf retention.',
        harvestWindow: 'Apr – Sep (Southern) • Oct – Feb (Northern)',
        bestFor: 'Premium fruit gift packs & modern retail',
        badge: 'Highest Brix',
      },
      {
        id: 'granny-smith',
        name: 'Granny Smith',
        grade: 'Class 1 Export',
        brix: '11.8° – 13.0°',
        notes: 'Iconic vivid emerald green skin. Vibrant, punchy malic acidity with firm, mouthwatering crunch.',
        harvestWindow: 'Mar – Aug (South Africa/Chile) • Sep – Jan (USA)',
        bestFor: 'Culinary baking, salads & tart snacking',
        badge: 'Tart & Firm',
      },
      {
        id: 'pink-lady',
        name: 'Pink Lady (Cripps Pink)',
        grade: 'Premium Trademarked',
        brix: '14.0° – 15.5°',
        notes: 'Distinctive rose-pink blush over yellow base. Fizzy effervescent finish balancing sweetness and champagne acidity.',
        harvestWindow: 'May – Oct (NZ/South Africa) • Nov – Mar (Europe)',
        bestFor: 'Gourmet boutiques & luxury hospitality',
        badge: 'Gourmet Benchmark',
      },
      {
        id: 'red-delicious',
        name: 'Red Delicious',
        grade: 'Washington Extra Fancy',
        brix: '12.5° – 13.8°',
        notes: 'Deep crimson conical fruit with five prominent basal lobes. Tender sweet flesh with classic aromatic bouquet.',
        harvestWindow: 'Sep – Apr (USA/Washington)',
        bestFor: 'Traditional wholesale & institutional supply',
        badge: 'Classic Heritage',
      },
    ],
    // 04 Sensory Star Ratings
    sensoryRatings: {
      sweetness: 4.5,
      crispness: 5.0,
      juiciness: 4.8,
      acidity: 3.2,
      aroma: 4.3,
    },
    // 05 Season Calendar
    seasonality: [
      { country: 'Washington, USA', flag: '🇺🇸', region: 'Wenatchee & Yakima', activeMonths: [9, 10, 11, 12, 1, 2, 3, 4], status: 'active', journeyDays: '32 days' },
      { country: 'Chile', flag: '🇨🇱', region: 'Curicó Valley', activeMonths: [3, 4, 5, 6, 7, 8], status: 'peak', journeyDays: '38 days' },
      { country: 'New Zealand', flag: '🇳🇿', region: "Hawke's Bay", activeMonths: [4, 5, 6, 7, 8, 9], status: 'active', journeyDays: '28 days' },
      { country: 'South Africa', flag: '🇿🇦', region: 'Ceres Valley', activeMonths: [3, 4, 5, 6, 7], status: 'active', journeyDays: '22 days' },
      { country: 'Northern Italy', flag: '🇮🇹', region: 'South Tyrol', activeMonths: [10, 11, 12, 1, 2], status: 'upcoming', journeyDays: '26 days' },
    ],
    // 06 Quality Standards
    qualityGuide: {
      parameters: [
        { label: 'Colour Coverage', value: '70% – 95% Blush', desc: 'Uniform red striation according to Extra Fancy color charts with minimal ground-color shadow.' },
        { label: 'Firmness Index', value: '7.5 – 9.2 kg/cm²', desc: 'Measured via 11mm Magness-Taylor penetrometer at packhouse discharge and port arrival.' },
        { label: 'Soluble Solids (Brix)', value: '14.5° – 16.5° Bx', desc: 'Digital refractometer reading tested across inner core and sub-epidermal flesh samples.' },
        { label: 'Internal Defect Tolerance', value: '0% Internal Browning', desc: 'Full-spectrum optical sorting guarantees complete absence of core rot, bitter pit, and watercore.' },
      ],
      coldChainTemp: '0.5°C to 1.5°C (continuous USB datalogger validation)',
      firmnessSpec: 'Min 7.5 kg/cm² on arrival at Indian ports',
      brixSpec: 'Min 14.0° Brix across all commercial consignments',
      appearanceCheck: 'Free from russeting, hail marks, sunburn, and skin abrasions.',
    },
    // 07 Packing Specifications
    packingSpecs: {
      counts: ['80', '88', '100', '113', '125', '138', '150', '163'],
      grades: ['Washington Extra Fancy', 'Chilean Export Standard', 'New Zealand Class 1'],
      formats: [
        {
          name: 'Standard Telescopic Bushel Carton',
          netWeight: '18.0 kg – 19.8 kg net',
          desc: 'Heavy-duty 5-ply kraft corrugate outer with interlocking telescopic lid and anti-moisture wax coating.',
          specs: '5 layers • Molded paper-pulp or plastic pocket trays • Top protective cushion pad',
        },
        {
          name: 'Display Ready Euro Tray Pack',
          netWeight: '13.0 kg net',
          desc: 'Open-top single/double layer display tray suitable for high-end retail and supermarket merchandising.',
          specs: 'Single-touch store shelf transfer • Corner post reinforcement',
        },
      ],
      palletCapacity: '40ft Reefer Container: 20–22 Pallets • 1,176 to 1,280 Cartons (~22,500 kg payload)',
    },
    // 08 Availability
    availabilityData: {
      nowAvailable: [
        { variety: 'Royal Gala', origin: 'Washington, USA', count: 'Count 88 / 100', hub: 'Mumbai Cold Store' },
        { variety: 'Red Fuji', origin: 'Chile', count: 'Count 80 / 88', hub: 'Delhi / NCR Distribution' },
        { variety: 'Granny Smith', origin: 'South Africa', count: 'Count 113 / 125', hub: 'Bengaluru Logistics Park' },
      ],
      arrivingSoon: [
        { variety: 'Pink Lady', origin: 'New Zealand', eta: 'Vessel MSC Alizee • Arriving in 6 days', port: 'Nhava Sheva' },
        { variety: 'Royal Gala', origin: 'Chile', eta: 'Vessel Maersk Gateshead • Arriving in 11 days', port: 'Chennai Port' },
      ],
    },
  },
  {
    id: 'orange',
    name: 'Oranges',
    botanicalName: 'Citrus × sinensis',
    tagline: 'Sun-Drenched Groves • Prime Citrus Yield',
    heroHeadline: 'Bright, juicy and full of character.',
    heroSubheadline: 'Peak Mediterranean & Southern Hemisphere citrus. Sourced directly from established packhouses in Egypt, South Africa, Spain, and Australia for high-sugar table and juicing programs.',
    strongStatement: 'Bright, juicy and full of character.',
    heroCta: 'Explore Citrus Range',
    brixLevel: 13.5,
    acidity: 'Vibrant Citric',
    harvestWindow: 'Year-Round Citrus Pipeline',
    origin: 'Egypt, South Africa & Spain',
    elevation: '120m – 380m',
    notes: ['Aromatic Terpenes', 'Dense Juice Vesicles', 'Pristine Flavedo'],
    description: 'Cultivated in mineral-rich alluvium under intense Mediterranean and southern subtropical sunshine, delivering rich carotenoid pigment and bursting juice yield.',
    flavorProfile: {
      sweetness: 92,
      tartness: 50,
      aroma: 96,
      crispness: 65,
    },
    // 02 Origin & Journey
    originStory: {
      growingRegions: [
        'Nile Delta & Desert Reclamation Belts (Egypt)',
        'Citrusdal, Western Cape & Sundays River Valley (South Africa)',
        'Valencia & Andalusia (Spain)',
        'Riverina & Murray Valley (Australia)',
      ],
      packhouse: 'Electronic weight and optical camera sizers, hot-water de-greening wash, anti-fungal shield wax coating, and high-velocity pre-cooling to 4.0°C within 6 hours of orchard picking.',
      seasonWindow: 'Strategic counter-seasonal pairing: Egyptian crop supplies December through May; South African and Australian harvest seamlessly bridges June through November.',
      journeyRoute: 'Direct Mediterranean & African container lines to Mumbai (Nhava Sheva) and Mundra → Pre-cooled reefer holds maintaining 3.5°C throughout maritime transit.',
      summary: 'Consistent 52-week citrus availability for retail chains, institutional foodservice, and high-volume commercial juicing operations.',
    },
    // 03 Varieties
    varieties: [
      {
        id: 'valencia',
        name: 'Valencia Late',
        grade: 'Export Class 1',
        brix: '11.5° – 13.2°',
        notes: 'Golden-orange thin skin with world-class juice extraction (up to 52%). Vibrant sweet-tart citric balance.',
        harvestWindow: 'Feb – May (Egypt) • Jul – Nov (South Africa)',
        bestFor: 'Commercial cold-pressed juicing & bulk foodservice',
        badge: 'Maximum Juice Yield',
      },
      {
        id: 'navel',
        name: 'Washington Navel',
        grade: 'Extra Fancy Table',
        brix: '12.8° – 14.5°',
        notes: 'Characteristic umbilical apex. 100% seedless, thick easy-to-peel flavedo, and crisp segmented pulp.',
        harvestWindow: 'Dec – Mar (Egypt/Spain) • Jun – Sep (South Africa/Aus)',
        bestFor: 'Supermarket table retail & fruit bowls',
        badge: 'Premier Table Citrus',
      },
      {
        id: 'mandarin',
        name: 'Murcott / Afourer Mandarin',
        grade: 'Premium Easy-Peel',
        brix: '13.5° – 15.5°',
        notes: 'Glossy reddish-orange skin that separates with single-handed ease. Deep rich honeyed sugar notes.',
        harvestWindow: 'Jan – Apr (Northern) • Jul – Oct (Southern)',
        bestFor: 'Lunchbox snacks & modern premium retail',
        badge: 'Easy-Peel Favorite',
      },
      {
        id: 'cara-cara',
        name: 'Cara Cara Navel',
        grade: 'Gourmet Specialty',
        brix: '13.0° – 14.5°',
        notes: 'Rich ruby-red interior pulp tinted with natural lycopene. Lower perceptible acid with sweet berry undertones.',
        harvestWindow: 'Jan – Mar (Spain) • Jun – Aug (South Africa)',
        bestFor: 'Specialty culinary displays & premium boutiques',
        badge: 'Ruby Lycopene Flesh',
      },
      {
        id: 'clementine',
        name: 'Clementine',
        grade: 'Seedless Export',
        brix: '12.5° – 14.0°',
        notes: 'Small to medium spherical fruit with fragrant peel oils and succulent, tender seedless segments.',
        harvestWindow: 'Nov – Jan (Spain/Egypt) • May – Jul (South Africa)',
        bestFor: 'Grab-and-go packaging & institutional dining',
        badge: 'Seedless & Aromatic',
      },
    ],
    // 04 Sensory Star Ratings
    sensoryRatings: {
      sweetness: 4.4,
      crispness: 3.5,
      juiciness: 5.0,
      acidity: 3.4,
      aroma: 4.9,
      easyPeel: true,
      seedProfile: 'Seedless to low-seed (<2 seeds/fruit)',
    },
    // 05 Season Calendar
    seasonality: [
      { country: 'Egypt', flag: '🇪🇬', region: 'Nile Delta & Desert Road', activeMonths: [12, 1, 2, 3, 4, 5], status: 'peak', journeyDays: '14 days' },
      { country: 'South Africa', flag: '🇿🇦', region: 'Citrusdal & Eastern Cape', activeMonths: [6, 7, 8, 9, 10, 11], status: 'active', journeyDays: '20 days' },
      { country: 'Spain', flag: '🇪🇸', region: 'Valencia & Seville', activeMonths: [11, 12, 1, 2, 3], status: 'upcoming', journeyDays: '24 days' },
      { country: 'Australia', flag: '🇦🇺', region: 'Riverina', activeMonths: [7, 8, 9, 10], status: 'active', journeyDays: '22 days' },
    ],
    // 06 Quality Standards
    qualityGuide: {
      parameters: [
        { label: 'Juice Ratio', value: 'Min 48% by weight', desc: 'Laboratory press test guarantees maximum liquid volume per container.' },
        { label: 'Brix-to-Acid Ratio', value: '8.5:1 – 11.0:1', desc: 'Harmonious sugar-acid balance avoiding both watery flatness and sharp sourness.' },
        { label: 'Firmness & Skin Integrity', value: 'Sound, unwrinkled peel', desc: 'Turgid peel free from creasing, oleocellosis, stem-end rot, and albedo breakdown.' },
        { label: 'Appearance & Color', value: 'Full deep orange (Colour Stage 5-6)', desc: '100% natural colour development without residual green shoulders.' },
      ],
      coldChainTemp: '3.5°C to 5.5°C (prevents chilling injury while retaining flavedo firmness)',
      firmnessSpec: 'Firm, resilient fruit with tight buttons',
      brixSpec: 'Min 12.0° Brix for table varieties; Min 11.0° for juicing',
      appearanceCheck: 'Uniform wax glaze, intact calyx (green button), no skin punctures.',
    },
    // 07 Packing Specifications
    packingSpecs: {
      counts: ['48', '56', '64', '72', '80', '88', '100', '113'],
      grades: ['Class 1 Premium Export', 'Juicing Grade A'],
      formats: [
        {
          name: 'Telescopic Export Carton',
          netWeight: '15.0 kg net (approx 16.2 kg gross)',
          desc: 'High-strength fluted board engineered for high-humidity cold transit without sidewall bulging.',
          specs: 'Ventilated pattern • Interlocking corner tabs • 80 to 88 cartons per pallet',
        },
        {
          name: 'Open Top Bushel Box',
          netWeight: '10.0 kg / 15.0 kg net',
          desc: 'Quick inspection container preferred by metropolitan wholesale markets.',
          specs: 'Top-tier airflow • Quick pallet unstacking',
        },
      ],
      palletCapacity: '40ft Reefer Container: 20 Pallets • 1,600 Cartons of 15kg (~24,000 kg net citrus payload)',
    },
    // 08 Availability
    availabilityData: {
      nowAvailable: [
        { variety: 'Valencia Late', origin: 'Egypt', count: 'Count 64 / 72', hub: 'Navi Mumbai Cold Hub' },
        { variety: 'Washington Navel', origin: 'South Africa', count: 'Count 56 / 64', hub: 'Delhi Azadpur Terminal' },
        { variety: 'Murcott Mandarin', origin: 'South Africa', count: 'Count 88 / 100', hub: 'Hyderabad Distribution Hub' },
      ],
      arrivingSoon: [
        { variety: 'Valencia Oranges', origin: 'Egypt', eta: 'Vessel CMA CGM Mozart • 4 days', port: 'Nhava Sheva' },
        { variety: 'Navel Oranges', origin: 'South Africa', eta: 'Vessel Maersk Leon • 9 days', port: 'Mundra Port' },
      ],
    },
  },
  {
    id: 'dragonfruit',
    name: 'Dragon Fruit',
    botanicalName: 'Selenicereus undatus / polyrhizus',
    tagline: 'Direct-Air & Sea Cold Link • Vietnam Farm-Direct',
    heroHeadline: 'Exotic by nature. Exceptional by origin.',
    heroSubheadline: 'Pure Vietnamese Pitaya. Direct farm contracts in Binh Thuan, Long An and Tien Giang packed in the new FRU FRESH Vietnam branded export carton.',
    strongStatement: 'Exotic by nature. Exceptional by origin. Hero: Vietnam.',
    heroCta: 'Source Vietnamese Dragon Fruit',
    brixLevel: 14.8,
    acidity: 'Mild Malic-Citric',
    harvestWindow: 'Peak Harvest: May through December',
    origin: 'Binh Thuan & Long An (Vietnam)',
    elevation: '80m – 220m',
    notes: ['Jade-Green Bract Scales', 'Crisp Micro-Seeds', 'High-Betacyanin Pulp'],
    description: 'Hand-picked from certified GAP cactus plantations under warm tropical sea breezes. Chilled immediately at packing facilities to maintain brilliant jade-green scale coloration and turgid flesh.',
    flavorProfile: {
      sweetness: 84,
      tartness: 35,
      aroma: 94,
      crispness: 92,
    },
    // 02 Origin & Journey
    originStory: {
      growingRegions: [
        'Binh Thuan Province (The Dragon Fruit Capital of Vietnam)',
        'Chau Thanh & Tan Tru Districts, Long An Province',
        'Cho Gao District, Tien Giang (Mekong Delta)',
      ],
      packhouse: 'Dedicated FRU FRESH contract packhouse in Binh Thuan: ozone water wash, automated high-pressure air scale cleaning, electronic gram weight sizing, and protective foam sock packaging.',
      seasonWindow: 'Natural peak lighting harvest runs May to November; supplemental night-lighting extends year-round fresh weekly vessel arrivals into India.',
      journeyRoute: 'Ho Chi Minh Port / Cat Lai Port → Direct ocean container freight to Chennai & Nhava Sheva (10–12 days fast transit) → Temperature-controlled distribution.',
      summary: 'Strict end-to-end management from farm gate to Indian cold stores eliminates middleman degradation and maintains fresh green scales.',
    },
    // 03 Varieties
    varieties: [
      {
        id: 'white-flesh',
        name: 'White Flesh Pitaya',
        grade: 'Export Grade A',
        brix: '12.5° – 14.2°',
        notes: 'Snow-white crystalline flesh studded with crisp edible black seeds. Clean, refreshing kiwi-pear floral sweetness.',
        harvestWindow: 'Continuous (Peaks May – Nov)',
        bestFor: 'Everyday healthy retail, fruit salads & culinary garnishes',
        badge: 'Most Popular Volume',
      },
      {
        id: 'red-flesh',
        name: 'Red / Magenta Flesh Pitaya',
        grade: 'Export Grade A Premium',
        brix: '14.5° – 16.5°',
        notes: 'Deep violet-crimson pulp loaded with natural betacyanin pigments. Sweeter, richer berry-melon profile with dramatic visual impact.',
        harvestWindow: 'Jun – Dec (Vietnam)',
        bestFor: 'High-end culinary, smoothies, gourmet plating & gifting',
        badge: 'High Antioxidant Ruby',
      },
      {
        id: 'yellow-dragon',
        name: 'Yellow Dragon Fruit (Palora)',
        grade: 'Luxury Reserve',
        brix: '16.5° – 18.5°',
        notes: 'Bright yellow pebbled skin with sweet, honeyed translucent flesh. The sweetest cultivar in the pitaya family.',
        harvestWindow: 'Specialty Harvest Windows',
        bestFor: 'Luxury fruit boutique & top-tier hospitality',
        badge: 'Ultra-Sweet Specialty',
      },
    ],
    // 04 Sensory Star Ratings
    sensoryRatings: {
      sweetness: 4.3,
      crispness: 4.6,
      juiciness: 4.7,
      acidity: 2.1,
      aroma: 4.0,
      seedProfile: 'Dense microscopic black seeds providing delicate poppy seed crunch',
    },
    // 05 Season Calendar
    seasonality: [
      { country: 'Vietnam (Natural Season)', flag: '🇻🇳', region: 'Binh Thuan & Long An', activeMonths: [5, 6, 7, 8, 9, 10, 11], status: 'peak', journeyDays: '10 days' },
      { country: 'Vietnam (Light Season)', flag: '🇻🇳', region: 'Binh Thuan Foothills', activeMonths: [12, 1, 2, 3, 4], status: 'active', journeyDays: '12 days' },
    ],
    // 06 Quality Standards
    qualityGuide: {
      parameters: [
        { label: 'Scale Freshness', value: '100% Crisp Jade-Green', desc: 'Bract scales must be firm and vibrant green without yellowing, wilting, or necrotic brown tips.' },
        { label: 'Gram Weight Spec', value: '350g – 650g / fruit', desc: 'Strict electronic weight sorting ensures consistent fruit count and uniform customer presentation.' },
        { label: 'Skin Coloration', value: '90%+ Vivid Magenta', desc: 'Full deep rose-magenta coloration indicating optimal tree-ripening and peak sugar accumulation.' },
        { label: 'Flesh Texture', value: 'Crisp, dense, non-fibrous', desc: 'Zero translucency or water-soaking; uniform seed distribution throughout the pulp.' },
      ],
      coldChainTemp: '4.5°C to 6.5°C with 85-90% relative humidity',
      firmnessSpec: 'Firm turgid pericarp with zero pressure thumb marks',
      brixSpec: 'Min 13.0° Brix for White Flesh; Min 14.5° Brix for Red Flesh',
      appearanceCheck: 'Free from anthracnose spots, mechanical cuts, scale insect marks, and sunburn bleaching.',
      ripenessStages: [
        { stage: 'Stage 1: Early Harvest', label: 'Export Transport Firm', desc: 'Firm peel, scales 100% green, ideal for 12-day maritime journey.', optimal: false },
        { stage: 'Stage 2: Ready for Retail', label: 'Prime Sweetness & Color', desc: 'Deep magenta skin, tips turning slightly yellow, optimum sugar-crispness balance.', optimal: true },
        { stage: 'Stage 3: Peak Consumption', label: 'Maximum Aroma & Brix', desc: 'Fully softened flesh, peak sweetness, best consumed within 72 hours of retail purchase.', optimal: false },
      ],
    },
    // 07 Packing Specifications
    packingSpecs: {
      counts: ['10 Count (Large)', '12 Count (Medium-Large)', '14 Count (Medium)', '16 Count (Standard)'],
      grades: ['Super Premium Grade A', 'First Class Commercial'],
      formats: [
        {
          name: 'NEW FRU FRESH Vietnam Branded Carton',
          netWeight: '9.0 kg net / 9.8 kg gross',
          desc: 'Specially commissioned heavy-duty export carton with custom FRU FRESH artwork, moisture barrier, and high-ventilation design.',
          specs: 'White protective mesh foam sock on every single fruit • Double-wall corrugated kraft',
        },
        {
          name: 'Luxury Gift Box Packaging',
          netWeight: '4.0 kg net',
          desc: 'Premium presentation box featuring 6 or 8 top-tier fruit with gold foil accents, engineered for VIP gifting and festive demand.',
          specs: 'Individual nest cavities • Direct retail counter display',
        },
      ],
      palletCapacity: '40ft Reefer Container: 20 Pallets • 2,000 to 2,200 Cartons of 9kg (~19,000 kg net)',
      featuredCarton: {
        title: 'The New FRU FRESH Vietnam Branded Carton',
        desc: 'Engineered specifically for Indian transit conditions: reinforced structural corners prevent carton crushing in humid multi-stop cold chains. Branded with our official provenance seal.',
        highlight: '9.0 kg Net • 100% Inspected in Binh Thuan • Anti-Crush Kraft Fluting',
      },
    },
    // 08 Availability
    availabilityData: {
      nowAvailable: [
        { variety: 'White Flesh Dragon Fruit', origin: 'Binh Thuan, Vietnam', count: 'Count 12 / 14', hub: 'Vashi Wholesale Market (Mumbai)' },
        { variety: 'Red Flesh Dragon Fruit', origin: 'Long An, Vietnam', count: 'Count 10 / 12', hub: 'Bangalore Cold Chain Terminal' },
      ],
      arrivingSoon: [
        { variety: 'Fresh Vietnam Dragon Fruit', origin: 'Binh Thuan', eta: 'Vessel SITC Dalian • 3 days', port: 'Chennai Port' },
        { variety: 'Red Flesh Dragon Fruit', origin: 'Vietnam', eta: 'Vessel Wan Hai 315 • 7 days', port: 'Nhava Sheva' },
      ],
    },
  },
];
