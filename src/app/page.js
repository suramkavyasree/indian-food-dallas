'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/auth/useSession';
import RestaurantGrid from '@/components/RestaurantGrid';

export default function Home() {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/login'); // redirect to login if not logged in
    }
  }, [loading, session, router]);

  if (loading) return <div className="text-center mt-10">Loading session...</div>;
  if (!session) return null;

  return (
    <main className="bg-gray-100 min-h-screen px-4 py-8">
      <RestaurantGrid />
    </main>
  );
}
