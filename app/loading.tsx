'use client';

import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import Hero from '@/components/layout/hero';

export default function Loading() {
  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <Hero />
      <main className='container mx-auto px-4 py-12'>
        <div className='flex flex-col gap-8'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <div className='h-10 w-64 rounded-2xl bg-muted/30 animate-pulse' />
            <div className='h-10 w-32 rounded-xl bg-muted/30 animate-pulse' />
          </div>
          <div className='grid gap-6 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]'>
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className='h-72 rounded-3xl border border-border/70 bg-muted/20 shadow-soft animate-pulse'
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
