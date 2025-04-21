'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useSession } from '@/auth/useSession';
import RestaurantCard from './RestaurantCard';
import { isWithinRadius } from '@/lib/geo';
import { calculateRestaurantScore } from '@/lib/scoring'; // ⬅️ NEW
import Link from 'next/link';
import './RestaurantGrid.css';

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

        const enriched = restaurantsData.map((r) => {
          const restaurantReviews = reviewsData.filter((rev) => rev.restaurant_id === r.id);
          return {
            ...r,
            dishes: dishesData.filter((d) => d.restaurant_id === r.id),
            reviews: restaurantReviews,
            score: calculateRestaurantScore(restaurantReviews), // ⬅️ Add score here
          };
        });

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userCoords = [position.coords.latitude, position.coords.longitude];
            const nearby = enriched.filter((r) => isWithinRadius(userCoords, [r.latitude, r.longitude]));
            setRestaurants(nearby);
            setFilteredRestaurants(nearby);
            setLoading(false);
          },
          (err) => {
            console.warn('Location error:', err.message);
            setRestaurants(enriched);
            setFilteredRestaurants(enriched);
            setLoading(false);
          }
        );
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="restaurant-grid">
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : filteredRestaurants.length === 0 ? (
        <p className="no-results-text">No restaurants near you within 10 miles.</p>
      ) : (
        filteredRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            openMenuId={openMenuId}
            toggleMenu={toggleMenu}
          />
        ))
      )}

      {/* Add a Restaurant */}
      <div className="text-center mb-6">
        <Link href="https://forms.gle/ucuafDnmeJLpVGoSA" target="_blank">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition">
            Add a Restaurant
          </button>
        </Link>
      </div>
    </div>
  );
}
