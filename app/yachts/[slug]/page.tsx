import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Anchor, BedDouble, HelpCircle, Ruler, Users } from 'lucide-react';

import Button from '@/components/ui/button';
import { fetchYachtBySlug } from '@/services/yacht-service';

interface YachtDetailPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 3600;
export const dynamicParams = true;

const toFeet = (length?: string) => {
  if (!length) return '—';
  const match = length.match(/([\d.]+)/);
  if (!match) return length;
  const meters = parseFloat(match[1]);
  if (Number.isNaN(meters)) return length;
  const feet = Math.round(meters * 3.28084);
  return `${feet} ft`;
};

const formatCrew = (crew?: number) =>
  typeof crew === 'number' && crew > 0 ? `${crew} crew` : '—';

export default async function YachtDetailPage({
  params,
}: YachtDetailPageProps) {
  const { slug } = params;
  const yacht = await fetchYachtBySlug(slug);

  if (!yacht) {
    notFound();
  }

  const stats = [
    {
      label: 'Length',
      value: toFeet(yacht.length),
      icon: <Ruler className='h-5 w-5 text-muted-foreground' />,
    },
    {
      label: 'Capacity',
      value: `${yacht.guests} guests`,
      icon: <Users className='h-5 w-5 text-muted-foreground' />,
    },
    {
      label: 'Cabins',
      value: `${yacht.cabins} cabins`,
      icon: <BedDouble className='h-5 w-5 text-muted-foreground' />,
    },
    {
      label: 'Crew',
      value: formatCrew(yacht.crew),
      icon: <Anchor className='h-5 w-5 text-muted-foreground' />,
    },
  ];

  const specifications = [
    { label: 'Length', value: toFeet(yacht.length) },
    { label: 'Guest Capacity', value: `${yacht.guests} guests` },
    { label: 'Cabins', value: `${yacht.cabins}` },
    { label: 'Crew Members', value: formatCrew(yacht.crew) },
  ];

  const amenities = yacht.amenities ?? [];

  const description =
    yacht.description ??
    'Experience a charter-ready yacht curated by Ankor specialists. Personalized itineraries, curated crews, and concierge-level provisioning for every voyage.';

  return (
    <main className='bg-background pb-16'>
      <div className='container mx-auto flex items-center px-4 py-6'>
        <Link
          href='/'
          className='inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-foreground/70'
        >
          <span aria-hidden='true'>&larr;</span> Back to listings
        </Link>
      </div>
      <section className='relative h-[420px] overflow-hidden border border-border/70 bg-card shadow-soft rounded-none'>
        <Image
          src={yacht.imageUrl}
          alt={yacht.name}
          fill
          priority
          loading='eager'
          className='object-cover'
          sizes='(max-width: 768px) 100vw, 90vw'
          unoptimized
        />
        <div className='absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/80' />
        <div className='relative z-10 flex h-full flex-col justify-end gap-4 p-8 text-white md:p-12'>
          <p className='text-xs uppercase tracking-[0.4em] text-white/80'>
            {yacht.region ?? 'Worldwide'} &middot; {yacht.location}
          </p>
          <h1 className='text-3xl font-semibold uppercase tracking-[0.3em] md:text-4xl'>
            {yacht.name}
          </h1>
        </div>
      </section>

      <div className='container mx-auto mt-10 grid gap-10 px-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)]'>
        <div className='space-y-8'>
          <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
            {stats.map((stat) => (
              <div
                key={stat.label}
                className='rounded-3xl border border-border/70 bg-card p-4 text-sm shadow-soft'
              >
                <div className='flex items-center gap-3 text-muted-foreground'>
                  {stat.icon}
                  <span className='text-[11px] uppercase tracking-[0.35em]'>
                    {stat.label}
                  </span>
                </div>
                <p className='mt-2 text-lg font-semibold text-foreground'>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <article className='space-y-8 rounded-3xl border border-border/70 bg-card p-6 shadow-soft'>
            <div>
              <h2 className='text-lg font-semibold text-foreground'>
                About this yacht
              </h2>
              <p className='mt-3 text-base leading-relaxed text-muted-foreground'>
                {description}
              </p>
            </div>

            <div className='space-y-3'>
              <h3 className='text-sm font-semibold uppercase tracking-[0.35em] text-muted-foreground'>
                Features & Amenities
              </h3>
              <div className='flex flex-wrap gap-3'>
                {amenities.length === 0 && (
                  <span className='text-sm text-muted-foreground'>
                    Amenities available upon request.
                  </span>
                )}
                {amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className='rounded-full border border-border/60 px-4 py-1.5 text-xs font-semibold text-foreground'
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className='text-sm font-semibold uppercase tracking-[0.35em] text-muted-foreground'>
                Specifications
              </h3>
              <div className='mt-3 grid gap-x-6 gap-y-4 text-sm text-foreground sm:grid-cols-2'>
                {specifications.map((spec) => (
                  <div key={spec.label}>
                    <p className='text-[10px] uppercase tracking-[0.35em] text-muted-foreground'>
                      {spec.label}
                    </p>
                    <p className='text-base font-semibold'>{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>

        <aside className='space-y-6'>
          <div className='rounded-3xl border border-border/70 bg-card p-6 shadow-soft'>
            <p className='text-[10px] uppercase tracking-[0.35em] text-muted-foreground'>
              Charter Rate
            </p>
            <p className='mt-2 text-3xl font-semibold text-foreground'>
              {yacht.priceFrom}
            </p>
            <p className='text-xs text-muted-foreground'>
              Per week • plus expenses
            </p>
            {yacht.buildYear && (
              <p className='mt-4 text-sm text-muted-foreground'>
                Built in {yacht.buildYear}
              </p>
            )}
            {yacht.shipyard && (
              <p className='text-sm text-muted-foreground'>
                Builder: {yacht.shipyard}
              </p>
            )}
            <Button className='mt-6 w-full'>Request Booking</Button>
            <p className='mt-2 text-xs text-muted-foreground'>
              Final rate may vary based on season and availability.
            </p>
          </div>

          <div className='rounded-3xl border border-border/70 bg-card p-6 shadow-soft'>
            <div className='flex items-center gap-3 text-foreground'>
              <HelpCircle className='h-5 w-5' />
              <div>
                <p className='text-base font-semibold'>Need assistance?</p>
                <p className='text-sm text-muted-foreground'>
                  Our charter specialists are available 24/7.
                </p>
              </div>
            </div>
            <Link
              href='/'
              className='mt-4 block rounded-2xl border border-border/60 px-4 py-2 text-center text-sm font-semibold text-foreground hover:bg-foreground/5'
            >
              Contact Us
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
