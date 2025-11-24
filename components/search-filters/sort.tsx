'use client';

import { useState } from 'react';

const options = [
  { label: 'Name (A-Z)', value: 'name-asc' },
  { label: 'Name (Z-A)', value: 'name-desc' },
  { label: 'Price (Low-High)', value: 'price-asc' },
  { label: 'Price (High-Low)', value: 'price-desc' },
  { label: 'Length (Small-Large)', value: 'length-asc' },
  { label: 'Length (Large-Small)', value: 'length-desc' },
  { label: 'Capacity (Low-High)', value: 'capacity-asc' },
  { label: 'Capacity (High-Low)', value: 'capacity-desc' },
];

interface SortProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export default function Sort({
  defaultValue = 'name-asc',
  onChange,
}: SortProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className='relative sm:min-w-[220px]'>
      <select
        className='w-full appearance-none rounded-2xl border border-border/60 bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          onChange?.(event.target.value);
        }}
        aria-label='Sort yachts'
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className='pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground'>
        <svg
          className='h-4 w-4'
          viewBox='0 0 16 16'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M4 6l4 4 4-4'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </span>
    </div>
  );
}
