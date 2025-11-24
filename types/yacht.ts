export type AvailabilityStatus = 'available' | 'inquiry' | 'booked';

export interface Yacht {
  slug: string;
  name: string;
  location: string;
  region?: string;
  tagline?: string;
  description?: string;
  priceFrom: string;
  imageUrl: string;
  guests: number;
  cabins: number;
  length: string;
  buildYear?: number;
  badge?: string;
  amenities?: string[];
  crew?: number;
  range?: string;
  speed?: string;
  shipyard?: string;
  availability?: AvailabilityStatus;
}
