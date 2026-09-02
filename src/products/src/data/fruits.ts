import { FruitSpecimen } from '../types';

export const FRUIT_SPECIMENS: FruitSpecimen[] = [
  {
    id: 'apple',
    name: 'Heritage Apple',
    botanicalName: 'Malus domestica',
    tagline: 'High-Elevation Cascade Cultivar',
    heroHeadline: 'Pristine cold-mountain Apple.',
    heroSubheadline: 'Cold-mountain crispness with delicate wildflower honey sweetness and an explosive, acoustic snap.',
    brixLevel: 15.8,
    acidity: 'Balanced Malic',
    harvestWindow: 'Autumn Harvest',
    origin: 'Cascade Slopes',
    elevation: '680m',
    notes: ['Wildflower Honey', 'Champagne Snap', 'Almond Blossom'],
    description: 'Cultivated in high-altitude orchards with crisp night breezes for dense cell structure and natural clarity.',
    flavorProfile: {
      sweetness: 88,
      tartness: 42,
      aroma: 92,
      crispness: 98,
    }
  },
  {
    id: 'orange',
    name: 'Tarocco Orange',
    botanicalName: 'Citrus × sinensis',
    tagline: 'Mount Etna Volcanic Citrus',
    heroHeadline: 'Sun-ripened volcanic Orange.',
    heroSubheadline: 'Volcanic mineral sweetness with deep raspberry undertones, vibrant crimson vesicles, and aromatic zest.',
    brixLevel: 16.5,
    acidity: 'Vibrant Citric',
    harvestWindow: 'Winter Zenith',
    origin: 'Mount Etna',
    elevation: '380m',
    notes: ['Crimson Raspberry', 'Candied Bergamot', 'Volcanic Mineral'],
    description: 'Grown in mineral-rich volcanic soil beneath Mount Etna. Diurnal shifts create rich anthocyanin depth.',
    flavorProfile: {
      sweetness: 92,
      tartness: 50,
      aroma: 96,
      crispness: 65,
    }
  }
];

