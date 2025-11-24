'use client';

import Link from 'next/link';

type Availability = 'available' | 'inquiry' | 'booked';

export interface YachtRow {
  id: string;
  slug: string;
  href: string;
  name: string;
  location: string;
  length: string;
  guests: number;
  cabins: number;
  priceFrom: string;
  availability: Availability;
  category?: string;
}

interface YachtTableProps {
  data?: YachtRow[];
}

const fallbackData: YachtRow[] = [
  {
    id: 'aurora',
    slug: 'aurora',
    href: '/yachts/aurora',
    name: 'M/Y Aurora',
    location: 'Amalfi Coast',
    length: '42m',
    guests: 10,
    cabins: 5,
    priceFrom: '€165,000',
    availability: 'available',
    category: 'Motor',
  },
  {
    id: 'serenity',
    slug: 'serenity',
    href: '/yachts/serenity',
    name: 'M/Y Serenity',
    location: 'Croatia',
    length: '38m',
    guests: 12,
    cabins: 6,
    priceFrom: '€145,000',
    availability: 'inquiry',
    category: 'Motor',
  },
  {
    id: 'elysian',
    slug: 'elysian',
    href: '/yachts/elysian',
    name: 'S/Y Elysian',
    location: 'Greek Isles',
    length: '33m',
    guests: 8,
    cabins: 4,
    priceFrom: '€110,000',
    availability: 'booked',
    category: 'Sailing',
  },
];

const statusStyles: Record<Availability, string> = {
  available: 'bg-secondary/15 text-secondary',
  inquiry: 'bg-accent/15 text-accent',
  booked: 'bg-muted text-muted-foreground',
};

export default function YachtTable({ data = fallbackData }: YachtTableProps) {
  return (
    <section className='rounded-3xl border border-border/80 bg-card text-card-foreground shadow-soft ring-1 ring-border/60'>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-border/60 text-left text-sm'>
          <caption className='sr-only'>
            Current charter-ready yachts with pricing and capacity
          </caption>
          <thead className='bg-muted/30 text-xs uppercase tracking-[0.25em] text-muted-foreground/90'>
            <tr>
              <th scope='col' className='px-6 py-4 font-medium'>
                Yacht
              </th>
              <th scope='col' className='px-6 py-4 font-medium'>
                Category
              </th>
              <th scope='col' className='px-6 py-4 font-medium'>
                Specs
              </th>
              <th scope='col' className='px-6 py-4 font-medium'>
                From / week
              </th>
              <th scope='col' className='px-6 py-4 font-medium'>
                Status
              </th>
              <th scope='col' className='px-6 py-4 font-medium text-right'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border/50'>
            {data.map((yacht) => (
              <tr
                key={yacht.id}
                className='transition-colors hover:bg-surface/60'
              >
                <td className='px-6 py-4'>
                  <div className='font-semibold text-foreground'>
                    <Link
                      href={yacht.href}
                      className='transition-colors hover:text-foreground/70'
                    >
                      {yacht.name}
                    </Link>
                  </div>
                  <div className='text-xs uppercase tracking-[0.3em] text-muted-foreground'>
                    {yacht.category ?? 'Yacht'} • {yacht.length}
                  </div>
                </td>
                <td className='px-6 py-4 text-muted-foreground'>
                  {yacht.location}
                </td>
                <td className='px-6 py-4 text-muted-foreground'>
                  {yacht.guests} pax · {yacht.cabins} cabins
                </td>
                <td className='px-6 py-4 font-semibold'>{yacht.priceFrom}</td>
                <td className='px-6 py-4'>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyles[yacht.availability]
                    }`}
                  >
                    {yacht.availability}
                  </span>
                </td>
                <td className='px-6 py-4 text-right'>
                  <Link
                    href={yacht.href}
                    className='text-xs font-semibold uppercase tracking-[0.3em] text-foreground transition-colors hover:text-foreground/70'
                  >
                    Explore
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
