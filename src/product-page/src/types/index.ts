export type FruitId = 'apple' | 'orange' | 'dragonfruit';

export interface FruitSpecimen {
  id: string;
  name: string;
  botanicalName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
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
}

export interface PartnershipInquiry {
  name: string;
  organization: string;
  email: string;
  tier: 'culinary' | 'boutique' | 'private_collector';
  varietyInterest: string[];
  message: string;
}
