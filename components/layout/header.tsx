import { Anchor } from 'lucide-react';

export default function Header() {
  return (
    <header className='border-b sticky top-0 bg-background z-10'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center gap-2'>
          <Anchor className='h-6 w-6' />
          <h1>Yacht Charter</h1>
        </div>
      </div>
    </header>
  );
}
