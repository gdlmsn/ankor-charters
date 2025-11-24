'use client';

import { Search as SearchIcon } from 'lucide-react';
import { useState } from 'react';

interface SearchProps {
  placeholder?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export default function Search({
  placeholder = 'Search by name, length, or guests...',
  defaultValue = '',
  onChange,
}: SearchProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <label className='relative block w-full'>
      <SearchIcon className='pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
      <input
        type='search'
        placeholder={placeholder}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          onChange?.(event.target.value);
        }}
        className='w-full rounded-2xl border border-border/70 bg-card py-3 pl-12 pr-4 text-sm text-foreground shadow-sm outline-none transition focus:ring-2 focus:ring-ring focus:ring-offset-2'
      />
    </label>
  );
}
