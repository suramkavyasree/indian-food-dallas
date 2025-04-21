'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useSession } from '@/auth/useSession';
import RestaurantCard from './RestaurantCard';
import Link from 'next/link';

export default function RestaurantGrid() {
  const { session, loading: sessionLoading } = useSession();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: restaurantsData, error } = await supabase.from('restaurants').select('*');
        if (error) throw error;
        const { data: dishesData } = await supabase.from('dishes').select('*');
        const { data: reviewsData } = await supabase.from('reviews').select('*');

        const enriched = restaurantsData.map((r) => ({
          ...r,
          dishes: dishesData.filter((d) => d.restaurant_id === r.id),
          reviews: reviewsData.filter((rev) => rev.restaurant_id === r.id),
        }));

        setRestaurants(enriched);
        setFilteredRestaurants(enriched);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Conditionally render Logout button */}
      {session ? (
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center gap-3">
            <img
              src={`https://ui-avatars.com/api/?name=${session.user.email}`}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <p className="text-gray-700 font-medium">{session.user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="text-center mb-6">
          <p className="text-lg text-gray-600">You are not logged in.</p>
        </div>
      )}

      {/* Add Button */}
      <div className="text-center mb-6">
        <Link href="https://docs.google.com/forms/d/1y_mRQa2ccI4Y7BLzLNOVj2D7SORDOttZkmmI2YYSsLw" target="_blank">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition">
            Add
          </button>
        </Link>
      </div>

      {/* Restaurant list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} openMenuId={openMenuId} toggleMenu={toggleMenu} />
          ))
        )}
      </div>
    </>
  );
}