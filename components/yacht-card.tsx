import Image from 'next/image';
import Link from 'next/link';

import Button from './ui/button';
import { Card, CardTitle } from './ui/card';

const cn = (...classes: Array<string | false | undefined>) =>
  classes.filter(Boolean).join(' ');

const IconShell = ({ children }: { children: React.ReactNode }) => (
  <svg
    viewBox='0 0 24 24'
    role='img'
    aria-hidden='true'
    className='h-4 w-4 text-muted-foreground'
  >
    {children}
  </svg>
);

const UsersIcon = () => (
  <IconShell>
    <path
      d='M5 20c0-2.209 2.239-4 5-4s5 1.791 5 4'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
    />
    <circle
      cx='10'
      cy='8'
      r='3'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
    />
    <path
      d='M15 11.5c1.657 0 3 1.343 3 3.5'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
    />
  </IconShell>
);

const BedIcon = () => (
  <IconShell>
    <rect
      x='3'
      y='8'
      width='18'
      height='9'
      rx='1.5'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
    />
    <path
      d='M3 13h18'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
    />
  </IconShell>
);

const RulerIcon = () => (
  <IconShell>
    <rect
      x='3'
      y='6'
      width='18'
      height='6'
      rx='1'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
    />
    <path
      d='M6 6v6M10 6v4M14 6v4M18 6v4'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
    />
  </IconShell>
);

const CalendarIcon = () => (
  <IconShell>
    <rect
      x='4'
      y='6'
      width='16'
      height='13'
      rx='2'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
    />
    <path
      d='M8 4v4M16 4v4M4 10h16'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
    />
  </IconShell>
);

interface YachtCardProps {
  name: string;
  location: string;
  priceFrom: string;
  imageUrl: string;
  guests: number;
  cabins: number;
  length: string;
  buildYear?: number;
  badge?: string;
  tagline?: string;
  slug?: string;
  className?: string;
  href?: string;
}

export default function YachtCard({
  name,
  tagline,
  location,
  priceFrom,
  imageUrl,
  guests,
  cabins,
  length,
  buildYear,
  badge = 'Featured',
  slug,
  className,
  href,
}: YachtCardProps) {
  const normalizedHref =
    href ??
    (slug
      ? `/yachts/${slug}`
      : `/yachts/${name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')}`);

  return (
    <Link
      href={normalizedHref}
      className='group block h-full rounded-[1.75rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
    >
      <Card
        className={cn(
          'flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-pop p-0',
          className
        )}
      >
        <div className='relative h-56 w-full overflow-hidden'>
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes='(max-width: 768px) 100vw, 50vw'
            className='object-cover transition-transform duration-500 group-hover:scale-105'
            priority
            loading='eager'
            unoptimized
          />
          <div className='absolute bottom-3 left-4 right-4 text-white drop-shadow'>
            <p className='text-xs uppercase tracking-[0.25em]'>{location}</p>
          </div>
        </div>
        <div className='flex flex-col gap-4 px-4 pb-3 pt-3'>
          <CardTitle className='text-xl uppercase tracking-[0.2em]'>
            {name}
            {tagline && <span className='sr-only'> &mdash; {tagline}</span>}
          </CardTitle>
          <dl className='flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-surface px-3 py-2.5 text-sm font-semibold text-foreground'>
          <div className='flex items-center gap-2'>
            <UsersIcon />
              <dd aria-label='Guests'>{guests}</dd>
            </div>
            <div className='flex items-center gap-2'>
            <BedIcon />
              <dd aria-label='Cabins'>{cabins}</dd>
            </div>
            <div className='flex items-center gap-2'>
            <RulerIcon />
              <dd aria-label='Length'>{length}</dd>
            </div>
            {buildYear && (
              <div className='flex items-center gap-2'>
              <CalendarIcon />
                <dd aria-label='Built year'>{buildYear}</dd>
              </div>
            )}
          </dl>
          <div className='h-px rounded-full bg-border/60' />
          <div className='flex flex-col gap-3 rounded-2xl bg-surface px-3 py-2.5 text-sm text-foreground sm:flex-row sm:items-center sm:justify-between'>
            <div className='space-y-0.5'>
              <p className='text-[9px] uppercase tracking-[0.35em] text-muted-foreground'>
                From
              </p>
              <p className='text-xl font-semibold text-foreground'>
                {priceFrom}
              </p>
              <p className='text-xs text-muted-foreground'>Per week</p>
            </div>
            <Button
              variant='outline'
              size='sm'
              className='w-full max-w-[130px] justify-center border border-border/70 bg-transparent text-xs font-semibold uppercase tracking-[0.3em] text-foreground hover:bg-foreground/5'
            >
              Explore
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
