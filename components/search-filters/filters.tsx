'use client';

import type { ReactNode } from 'react';
import { DollarSign, Ruler, Users } from 'lucide-react';

type Range = [number, number];

interface FiltersProps {
  priceRange: Range;
  guestRange: Range;
  lengthRange: Range;
  onPriceChange: (range: Range) => void;
  onGuestChange: (range: Range) => void;
  onLengthChange: (range: Range) => void;
  onReset: () => void;
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function clampRange(range: Range, min: number, max: number): Range {
  return [
    Math.max(min, Math.min(max, range[0])),
    Math.max(min, Math.min(max, range[1])),
  ];
}

interface RangeControlProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  range: Range;
  min: number;
  max: number;
  step?: number;
  format?: (value: number) => string;
  onChange: (range: Range) => void;
  suffix?: string;
}

function RangeControl({
  icon,
  title,
  subtitle,
  range,
  min,
  max,
  step = 1,
  format = (value) => `${value}`,
  suffix,
  onChange,
}: RangeControlProps) {
  const update = (index: 0 | 1, value: number) => {
    const next: Range = [...range] as Range;
    next[index] = value;
    next[0] = Math.min(next[0], next[1]);
    next[1] = Math.max(next[0], next[1]);
    onChange(clampRange(next, min, max));
  };

  const minPercent = ((range[0] - min) / (max - min)) * 100;
  const maxPercent = ((range[1] - min) / (max - min)) * 100;

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground'>
        <span className='flex items-center gap-2 text-foreground tracking-normal'>
          {icon}
          {title}
        </span>
        {subtitle && <span className='tracking-[0.35em]'>{subtitle}</span>}
      </div>
      <div className='flex items-center justify-between text-sm font-semibold text-foreground'>
        <p className='text-[13px] text-muted-foreground'>
          {format(range[0])}
          {suffix}
        </p>
        <span className='text-muted-foreground'>to</span>
        <p className='text-[13px] text-muted-foreground'>
          {format(range[1])}
          {suffix}
        </p>
      </div>
      <div className='relative h-9'>
        <div className='pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center'>
          <div className='relative w-full'>
            <div className='h-[2px] w-full rounded-full bg-border/40' />
            <div
              className='absolute top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-foreground/40'
              style={{
                left: `${minPercent}%`,
                right: `${100 - maxPercent}%`,
              }}
            />
          </div>
        </div>
        <input
          type='range'
          min={min}
          max={max}
          step={step}
          value={range[0]}
          onChange={(event) => update(0, Number(event.target.value))}
          className='range-thumb absolute inset-0 appearance-none bg-transparent'
        />
        <input
          type='range'
          min={min}
          max={max}
          step={step}
          value={range[1]}
          onChange={(event) => update(1, Number(event.target.value))}
          className='range-thumb absolute inset-0 appearance-none bg-transparent'
        />
      </div>
      <style jsx>{`
        .range-thumb::-webkit-slider-runnable-track {
          height: 0;
          background: transparent;
        }
        .range-thumb::-moz-range-track {
          height: 0;
          background: transparent;
        }
        .range-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 9999px;
          border: 2px solid var(--background);
          background: #0f4c81;
          box-shadow: 0 4px 10px rgba(15, 76, 129, 0.25);
          cursor: pointer;
          position: relative;
          z-index: 2;
          margin-top: -9px;
        }
        .range-thumb::-moz-range-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 9999px;
          border: 2px solid var(--background);
          background: #0f4c81;
          box-shadow: 0 4px 10px rgba(15, 76, 129, 0.25);
          cursor: pointer;
          position: relative;
          z-index: 2;
          margin-top: -9px;
        }
      `}</style>
    </div>
  );
}

export default function Filters({
  priceRange,
  guestRange,
  lengthRange,
  onPriceChange,
  onGuestChange,
  onLengthChange,
  onReset,
}: FiltersProps) {
  return (
    <aside className='space-y-5 rounded-2xl border border-border/60 bg-card p-5 shadow-soft lg:space-y-4 lg:p-4'>
      <p className='text-[11px] uppercase tracking-[0.35em] text-muted-foreground'>
        Filters
      </p>

      <RangeControl
        icon={<DollarSign className='h-4 w-4' />}
        title='Price Range'
        subtitle='per week'
        range={priceRange}
        min={0}
        max={250000}
        step={5000}
        format={(value) => currency.format(value)}
        onChange={onPriceChange}
      />

      <RangeControl
        icon={<Users className='h-4 w-4' />}
        title='Guest Capacity'
        range={guestRange}
        min={0}
        max={20}
        onChange={onGuestChange}
        suffix=' guests'
      />

      <RangeControl
        icon={<Ruler className='h-4 w-4' />}
        title='Yacht Length'
        subtitle='feet'
        range={lengthRange}
        min={0}
        max={250}
        step={5}
        suffix=' ft'
        onChange={onLengthChange}
      />

      <button
        type='button'
        onClick={onReset}
        className='w-full rounded-2xl border border-border/60 bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-foreground/5'
      >
        Reset all filters
      </button>
    </aside>
  );
}
