import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import Hero from '@/components/layout/hero';
import YachtList from '@/components/yacht-list';
import { fetchYachts } from '@/services/yacht-service';
import type { Yacht } from '@/types/yacht';

export default async function Home() {
  let yachts: Yacht[] = [];
  let loadError: string | null = null;

  try {
    yachts = await fetchYachts();
  } catch (error) {
    console.error('[home] Failed to load yachts', error);
    loadError =
      'We were unable to load the current fleet. Please refresh to try again.';
  }

  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <Hero />
      <main className='container mx-auto px-4 py-12'>
        {loadError ? (
          <div className='rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-destructive'>
            <h2 className='text-xl font-semibold'>Something went wrong</h2>
            <p className='mt-2 text-sm text-destructive/80'>{loadError}</p>
            <p className='mt-4 text-xs text-destructive/70'>
              If the problem persists contact your Ankor concierge.
            </p>
          </div>
        ) : (
          <YachtList yachts={yachts} />
        )}
      </main>
      <Footer />
    </div>
  );
}
