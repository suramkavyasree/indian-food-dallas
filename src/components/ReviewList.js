// components/ReviewList.jsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ReviewList({ restaurantId, refreshTrigger }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });

      if (!error) setReviews(data);
      else console.error('Failed to fetch reviews:', error.message);
    };

    fetchReviews();
  }, [restaurantId, refreshTrigger]); // <- this will refetch on new submission

  if (reviews.length === 0) {
    return <p className="no-reviews">No reviews yet.</p>;
  }

  return (
    <div className="review-list">
      {reviews.map((review) => (
        <div key={review.id} className="review-card">
          <p className="review-comment">"{review.comment}"</p>
          <p className="review-meta">
            Taste: {review.rating_taste}/5 | 
            Service: {review.rating_service}/5 | 
            Cleanliness: {review.rating_cleanliness}/5 | 
            Authenticity: {review.rating_authenticity}/5
          </p>
        </div>
      ))}
    </div>
  );
}
