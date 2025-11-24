'use client';

import { useMemo, useState } from 'react';
import { Filter, LayoutGrid, List } from 'lucide-react';

import type { Yacht } from '@/types/yacht';
import YachtCard from './yacht-card';
import YachtTable, { type YachtRow } from './yacht-table';
import Sort from './search-filters/sort';
import SearchInput from './search-filters/search';
import FiltersPanel from './search-filters/filters';

interface YachtListProps {
  yachts: Yacht[];
}

const parsePrice = (value: string) => Number(value.replace(/[^\d.]/g, '')) || 0;

const parseLengthFeet = (value: string) => {
  if (!value) return 0;
  const meters = value.match(/([\d.]+)\s*m/i);
  if (meters) {
    return Number(meters[1]) * 3.28084;
  }
  const feet = value.match(/([\d.]+)/);
  return feet ? Number(feet[1]) : 0;
};

export default function YachtList({ yachts }: YachtListProps) {
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortValue, setSortValue] = useState('name-asc');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 250000]);
  const [guestRange, setGuestRange] = useState<[number, number]>([0, 20]);
  const [lengthRange, setLengthRange] = useState<[number, number]>([0, 250]);

  const filteredFeatured = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return yachts.filter((yacht) => {
      const price = parsePrice(yacht.priceFrom);
      const lengthFt = parseLengthFeet(yacht.length);
      const guests = yacht.guests ?? 0;
      const matchesRanges =
        price >= priceRange[0] &&
        price <= priceRange[1] &&
        guests >= guestRange[0] &&
        guests <= guestRange[1] &&
        lengthFt >= lengthRange[0] &&
        lengthFt <= lengthRange[1];

      if (!matchesRanges) return false;
      if (!query) return true;

      const haystack = [
        yacht.name,
        yacht.location,
        yacht.tagline,
        yacht.length,
        yacht.priceFrom,
        guests.toString(),
        yacht.buildYear?.toString() ?? '',
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [yachts, searchQuery, priceRange, guestRange, lengthRange]);

  const statsLabel = useMemo(() => {
    const count = filteredFeatured.length;
    return `Showing ${count} of ${yachts.length} yachts`;
  }, [filteredFeatured.length, yachts.length]);

  const sortedFeatured = useMemo(() => {
    const list = [...filteredFeatured];
    list.sort((a, b) => {
      switch (sortValue) {
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return parsePrice(a.priceFrom) - parsePrice(b.priceFrom);
        case 'price-desc':
          return parsePrice(b.priceFrom) - parsePrice(a.priceFrom);
        case 'length-asc':
          return parseLengthFeet(a.length) - parseLengthFeet(b.length);
        case 'length-desc':
          return parseLengthFeet(b.length) - parseLengthFeet(a.length);
        case 'capacity-asc':
          return a.guests - b.guests;
        case 'capacity-desc':
          return b.guests - a.guests;
        case 'name-asc':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return list;
  }, [filteredFeatured, sortValue]);

  const tableRows = useMemo<YachtRow[]>(() => {
    const statuses = ['available', 'inquiry', 'booked'] as const;
    return sortedFeatured.map((yacht, index) => {
      const slug = yacht.slug ?? `${yacht.name}-${index}`;
      return {
        id: slug,
        slug,
        href: `/yachts/${slug}`,
        name: yacht.name,
        location: yacht.location ?? '—',
        length: yacht.length,
        guests: yacht.guests,
        cabins:
          yacht.cabins ?? Math.max(2, Math.round((yacht.guests ?? 0) / 2)),
        priceFrom: yacht.priceFrom,
        availability: yacht.availability ?? statuses[index % statuses.length],
        category: yacht.region,
      };
    });
  }, [sortedFeatured]);

  return (
    <section className='space-y-6'>
      <div className='space-y-3'>
        <SearchInput
          defaultValue={searchQuery}
          onChange={setSearchQuery}
          placeholder='Search by name, length, price, guests, or year...'
        />
        <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4'>
            <Sort
              defaultValue={sortValue}
              onChange={(value) => setSortValue(value)}
            />
            <button
              type='button'
              onClick={() => setFiltersOpen((prev) => !prev)}
              className='inline-flex items-center justify-center gap-2 rounded-2xl border border-border/70 bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-foreground/5 lg:hidden'
            >
              <Filter className='h-4 w-4' />
              {filtersOpen ? 'Hide filters' : 'Show filters'}
            </button>
          </div>
          <div className='flex items-center justify-between gap-3 sm:justify-end'>
            <p className='text-sm text-muted-foreground lg:hidden'>
              {statsLabel}
            </p>
            <div className='inline-flex items-center overflow-hidden rounded-xl border border-border/60 bg-surface'>
              <button
                type='button'
                onClick={() => setView('grid')}
                className={`flex items-center justify-center px-4 py-2 ${
                  view === 'grid'
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-label='Grid view'
              >
                <LayoutGrid className='h-4 w-4' />
              </button>
              <button
                type='button'
                onClick={() => setView('table')}
                className={`flex items-center justify-center px-4 py-2 ${
                  view === 'table'
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-label='Table view'
              >
                <List className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>
        {filtersOpen && (
          <div className='lg:hidden'>
            <FiltersPanel
              priceRange={priceRange}
              guestRange={guestRange}
              lengthRange={lengthRange}
              onPriceChange={setPriceRange}
              onGuestChange={setGuestRange}
              onLengthChange={setLengthRange}
              onReset={() => {
                setPriceRange([0, 250000]);
                setGuestRange([0, 20]);
                setLengthRange([0, 250]);
              }}
            />
          </div>
        )}
      </div>

      <div className='grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)]'>
        <div className='hidden self-start lg:sticky lg:top-24 lg:block'>
          <FiltersPanel
            priceRange={priceRange}
            guestRange={guestRange}
            lengthRange={lengthRange}
            onPriceChange={setPriceRange}
            onGuestChange={setGuestRange}
            onLengthChange={setLengthRange}
            onReset={() => {
              setPriceRange([0, 250000]);
              setGuestRange([0, 20]);
              setLengthRange([0, 250]);
            }}
          />
        </div>

        <div className='space-y-3'>
          <p className='hidden text-sm text-muted-foreground lg:block'>
            {statsLabel}
          </p>
          {view === 'grid' ? (
            <div className='grid gap-8 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]'>
              {sortedFeatured.map((yacht) => (
                <YachtCard key={yacht.slug ?? yacht.name} {...yacht} />
              ))}
            </div>
          ) : (
            <YachtTable data={tableRows} />
          )}
        </div>
      </div>
    </section>
  );
}
