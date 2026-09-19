export type FruitId = 'apple' | 'orange' | 'dragonfruit';

export interface VarietyItem {
  id: string;
  name: string;
  grade: string;
  brix: string;
  notes: string;
  harvestWindow: string;
  bestFor: string;
  badge?: string;
}

export interface SeasonOriginItem {
  country: string;
  region: string;
  activeMonths: number[]; // 1-12
  status: 'peak' | 'active' | 'upcoming';
  journeyDays: string;
}

export interface QualityParameter {
  label: string;
  value: string;
  desc: string;
}

export interface RipenessStage {
  stage: string;
  label: string;
  desc: string;
  optimal: boolean;
}

export interface PackingFormat {
  name: string;
  netWeight: string;
  desc: string;
  specs: string;
}

export interface FruitSpecimen {
  id: string;
  name: string;
  botanicalName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  strongStatement: string;
  brixLevel: number;
  acidity: string;
  harvestWindow: string;
  origin: string;
  notes: string[];
  description: string;
  elevation: string;
  flavorProfile: {
    sweetness: number;
    tartness: number;
    aroma: number;
    crispness: number;
  };
  // 02 Origin & Journey
  originStory: {
    growingRegions: string[];
    packhouse: string;
    seasonWindow: string;
    journeyRoute: string;
    summary: string;
  };
  // 03 Varieties
  varieties: VarietyItem[];
  // 04 Sensory Star Ratings (1-5)
  sensoryRatings: {
    sweetness: number;
    crispness: number;
    juiciness: number;
    acidity: number;
    aroma: number;
    easyPeel?: boolean;
    seedProfile?: string;
  };
  // 05 Season Calendar
  seasonality: SeasonOriginItem[];
  // 06 Quality Standards
  qualityGuide: {
    parameters: QualityParameter[];
    coldChainTemp: string;
    firmnessSpec: string;
    brixSpec: string;
    appearanceCheck: string;
    ripenessStages?: RipenessStage[];
  };
  // 07 Packing Specifications
  packingSpecs: {
    counts: string[];
    grades: string[];
    formats: PackingFormat[];
    palletCapacity: string;
    featuredCarton?: {
      title: string;
      desc: string;
      highlight: string;
    };
  };
  // 08 Availability
  availabilityData: {
    nowAvailable: { variety: string; origin: string; count: string; hub: string }[];
    arrivingSoon: { variety: string; origin: string; eta: string; port: string }[];
  };
}

export interface PartnershipInquiry {
  name: string;
  organization: string;
  email: string;
  tier: 'culinary' | 'boutique' | 'private_collector';
  varietyInterest: string[];
  message: string;
}
