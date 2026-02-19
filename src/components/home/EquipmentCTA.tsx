import Link from 'next/link';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EquipmentCTA() {
  return (
    <section className="bg-gradient-to-br from-sky-800 via-sky-700 to-slate-800 px-4 py-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
          <Search className="h-7 w-7 text-sky-200" />
        </div>
        <h2 className="text-3xl font-bold text-white">Equipment Registry</h2>
        <p className="max-w-xl text-lg text-sky-200">
          Buying a used glider? Look up its service history by serial number. Every
          service we perform is recorded and publicly accessible — like checking an MOT
          history.
        </p>
        <Link href="/equipment">
          <Button size="lg" className="bg-white text-sky-800 hover:bg-sky-50">
            Search Equipment
          </Button>
        </Link>
      </div>
    </section>
  );
}
