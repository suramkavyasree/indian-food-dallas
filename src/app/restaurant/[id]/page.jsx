'use client';

import './RestaurantDetailsPage.css';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';
import RatingForm from '@/components/RatingForm';
import ReviewList from '@/components/ReviewList';

export default function RestaurantDetailsPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRestaurantDetails = async () => {
    setLoading(true);
    try {
      const { data: restaurantData, error: restError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();

      if (restError) throw restError;

      const { data: dishes } = await supabase
        .from('dishes')
        .select('*')
        .eq('restaurant_id', id);

      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('restaurant_id', id)
        .order('created_at', { ascending: false });

      const recommendedDishes = dishes.filter((dish) => dish.is_recommended);
      const nonRecommendedDishes = dishes.filter((dish) => !dish.is_recommended);

      const groupedDishes = nonRecommendedDishes.reduce((acc, dish) => {
        const category = dish.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(dish);
        return acc;
      }, {});

      setRestaurant({
        ...restaurantData,
        recommendedDishes,
        groupedDishes,
        reviews,
      });
    } catch (error) {
      console.error('Error loading restaurant details:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!restaurant) return <p className="loading-text">Restaurant not found.</p>;

  return (
    <div className="restaurant-container relative">
      {/* Add Dish Button in Top-Right Corner */}
     

      <div className="restaurant-header">
        <h1 className="restaurant-title">{restaurant.name}</h1>
        <p className="restaurant-location">
          <FaMapMarkerAlt className="map-icon" />
          {restaurant.region} Region
        </p>
      </div>

      {/* Menu Section */}
      <div className="section">
        <h2 className="section-title">Menu</h2>

        {/* Recommended Dishes */}
        {restaurant.recommendedDishes.length > 0 && (
          <div>
            <h3>🌟 Top Recommended</h3>
            <ul className="menu-list">
              {restaurant.recommendedDishes.map((dish) => (
                <li key={dish.id} className="menu-card">
                  <span className="dish-name">{dish.name}</span>
                  <span className="dish-price">${dish.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Other Menu Items */}
        {Object.keys(restaurant.groupedDishes).map((category) => (
          <div key={category}>
            <h3>{category}</h3>
            <ul className="menu-list">
              {restaurant.groupedDishes[category].map((dish) => (
                <li key={dish.id} className="menu-card">
                  <span className="dish-name">{dish.name}</span>
                  <span className="dish-price">${dish.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="add-dish-container">
  <Link href="https://forms.gle/8W2bcCADzuswCgYZ7" target="_blank">
    <button className="add-dish-button">
      Add a Dish
    </button>
  </Link>
</div>


      {/* Reviews Section */}
      <div className="section">
        <h2 className="section-title">Leave a Review</h2>
        <RatingForm restaurantId={id} onReviewSubmitted={fetchRestaurantDetails} />
      </div>

      <div className="section">
        <h2 className="section-title">Customer Reviews</h2>
        <ReviewList restaurantId={id} reviews={restaurant.reviews} />
      </div>
    </div>
  );
}