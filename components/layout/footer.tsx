import { Anchor } from 'lucide-react';

export default function Footer() {
  return (
    <footer className='border-t mt-20'>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
          <div className='flex items-center gap-2'>
            <Anchor className='h-5 w-5' />
            <span>Yacht Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
