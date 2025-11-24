import { AvailabilityStatus, Yacht } from '@/types/yacht';

const API_URL =
  'https://pub-c204b30aa1fc4cf795de75e4b73955f1.r2.dev/yachts.json';

const UNSPLASH_SEARCH_URL =
  'https://unsplash.com/napi/search/photos?query=yacht&per_page=30&page=1';
const useSourceYachtImages =
  process.env.NEXT_PUBLIC_USE_YACHT_SOURCE_IMAGES === 'true';

type RawYacht = {
  id?: number | string;
  uniqueName?: string;
  name: string;
  type?: string;
  region?: string;
  location?: string;
  length?: string;
  maxPassengers?: number;
  maxPassengersCruising?: number;
  bedrooms?: number;
  maxCrew?: number;
  url?: string;
  weeklyLowRetail?: string;
  currency?: string | null;
  toys?: string;
  isSpecialActive?: boolean;
  acceptsWeeklyCharters?: boolean;
  specialDescription?: string;
  shipyard?: string;
  range?: string;
  speed?: string;
};

export type AvailabilityInput = Pick<
  RawYacht,
  'isSpecialActive' | 'acceptsWeeklyCharters'
>;

type LegacyResponse = {
  data?: {
    yachtsWithInfos?: {
      nodes?: RawYacht[];
    };
  };
};

type UnsplashPhoto = {
  id: string;
  urls?: {
    raw?: string;
    full?: string;
    regular?: string;
    small?: string;
  };
};

type UnsplashSearchResponse = {
  results?: UnsplashPhoto[];
};

const fallbackUnsplashImages = [
  'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&h=900&q=80',
  'https://images.unsplash.com/photo-1469474968028-d79a25d0ecbe?auto=format&fit=crop&w=1600&h=900&q=80',
  'https://images.unsplash.com/photo-1499428665502-503f6c608263?auto=format&fit=crop&w=1600&h=900&q=80',
  'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1600&h=900&q=80',
  'https://images.unsplash.com/photo-1511302550-74f4a4b61274?auto=format&fit=crop&w=1600&h=900&q=80',
  'https://images.unsplash.com/photo-1495546968767-f0573cca821e?auto=format&fit=crop&w=1600&h=900&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&h=900&q=80',
  'https://images.unsplash.com/photo-1494599948593-3fdde6df39c5?auto=format&fit=crop&w=1600&h=900&q=80',
  'https://images.unsplash.com/photo-1521207412164-1770be672f6b?auto=format&fit=crop&w=1600&h=900&q=80',
  'https://images.unsplash.com/photo-1517167685282-958d0ba1eeda?auto=format&fit=crop&w=1600&h=900&q=80',
];

let cachedUnsplashImages: string[] | null = null;

const appendUnsplashParams = (url: string) =>
  url.includes('?')
    ? `${url}&auto=format&fit=crop&w=1600&h=900&q=80`
    : `${url}?auto=format&fit=crop&w=1600&h=900&q=80`;

const sanitizeImageUrl = (rawUrl?: string) => {
  if (!rawUrl) return undefined;
  try {
    const url = new URL(rawUrl);
    url.pathname = decodeURIComponent(url.pathname);
    return url;
  } catch {
    return undefined;
  }
};

const shouldFallbackToUnsplash = (url?: URL) =>
  !url ||
  url.hostname.endsWith('ankorstorageprod.blob.core.windows.net') ||
  !url.protocol.startsWith('http');

const loadUnsplashImages = async () => {
  if (cachedUnsplashImages?.length) {
    return cachedUnsplashImages;
  }

  try {
    const response = await fetch(UNSPLASH_SEARCH_URL, {
      headers: {
        Accept: 'application/json',
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Unsplash images');
    }

    const payload = (await response.json()) as UnsplashSearchResponse;
    const urls =
      payload.results
        ?.map((photo) => {
          const candidate =
            photo.urls?.regular ??
            photo.urls?.full ??
            photo.urls?.raw ??
            photo.urls?.small;
          return candidate ? appendUnsplashParams(candidate) : null;
        })
        .filter((value): value is string => Boolean(value)) ?? [];

    if (urls.length) {
      cachedUnsplashImages = urls;
      return urls;
    }
  } catch (error) {
    console.warn('[yacht-service] Unsplash lookup failed', error);
  }

  cachedUnsplashImages = fallbackUnsplashImages;
  return cachedUnsplashImages;
};

const formatCurrency = (amount?: string, currencyCode?: string | null) => {
  if (!amount) return '—';
  const numeric = Number(amount);
  if (Number.isNaN(numeric)) return amount;

  const currency = currencyCode && currencyCode.trim() ? currencyCode : 'USD';

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(numeric);
  } catch {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(numeric);
  }
};

export const parseLength = (value?: string) => {
  if (!value) return '—';
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return value;
  return `${Math.round(numeric)}m`;
};

const parseAmenities = (value?: string) =>
  value
    ? value
        .split(';')
        .map((item) => item.trim())
        .filter(Boolean)
    : undefined;

export const normalizeAvailability = (
  raw: AvailabilityInput
): AvailabilityStatus => {
  if (raw.isSpecialActive) return 'inquiry';
  if (raw.acceptsWeeklyCharters === false) return 'booked';
  return 'available';
};

const toArray = (payload: unknown): RawYacht[] => {
  if (Array.isArray(payload)) return payload;
  const legacy = payload as LegacyResponse;
  if (legacy?.data?.yachtsWithInfos?.nodes) {
    return legacy.data.yachtsWithInfos.nodes ?? [];
  }
  return [];
};

async function requestYachts(): Promise<RawYacht[]> {
  const response = await fetch(API_URL, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error('Failed to load yachts.');
  }

  const payload = await response.json();
  return toArray(payload);
}

const selectUnsplashImage = (seed: number, pool: string[]) => {
  if (!pool.length) {
    return fallbackUnsplashImages[0];
  }
  const index = Math.abs(seed) % pool.length;
  return pool[index];
};

const resolveImageUrl = (
  rawUrl: string | undefined,
  seed: number,
  unsplashPool: string[]
) => {
  const fallback = selectUnsplashImage(seed, unsplashPool);

  if (!useSourceYachtImages) {
    return fallback;
  }

  const normalized = sanitizeImageUrl(rawUrl);
  if (shouldFallbackToUnsplash(normalized)) {
    return fallback;
  }
  return normalized!.toString();
};

const mapYacht = (
  raw: RawYacht,
  index: number,
  unsplashPool: string[]
): Yacht => {
  const slug = String(raw.id ?? raw.uniqueName ?? index);

  return {
    slug,
    name: raw.name,
    location: raw.location ?? raw.region ?? raw.type ?? 'Worldwide',
    region: raw.region ?? raw.type,
    tagline: raw.specialDescription ?? undefined,
    description: raw.specialDescription ?? undefined,
    priceFrom: formatCurrency(raw.weeklyLowRetail, raw.currency),
    imageUrl: resolveImageUrl(raw.url, index, unsplashPool),
    guests: raw.maxPassengers ?? raw.maxPassengersCruising ?? 0,
    cabins: raw.bedrooms ?? 0,
    length: parseLength(raw.length),
    buildYear: undefined,
    badge: raw.isSpecialActive ? 'New Listing' : undefined,
    amenities: parseAmenities(raw.toys),
    crew: raw.maxCrew,
    range: raw.range ?? undefined,
    speed: raw.speed ?? undefined,
    shipyard: raw.shipyard ?? undefined,
    availability: normalizeAvailability(raw),
  };
};

export async function fetchYachts(): Promise<Yacht[]> {
  const [nodes, unsplashPool] = await Promise.all([
    requestYachts(),
    loadUnsplashImages(),
  ]);
  return nodes.map((node, index) => mapYacht(node, index, unsplashPool));
}

export async function fetchYachtBySlug(
  slug: string
): Promise<Yacht | undefined> {
  const yachts = await fetchYachts();
  return yachts.find((yacht) => yacht.slug === slug);
}
