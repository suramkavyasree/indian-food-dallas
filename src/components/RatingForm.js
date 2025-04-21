import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient'; // ✅ Import supabase client
import './RatingStyles.css';

const StarRating = ({ name, value, onChange }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`star-icon ${star <= value ? 'filled' : ''}`}
          onClick={() => onChange(name, star)}
        />
      ))}
    </div>
  );
};

const RatingForm = ({ restaurantId, onReviewSubmitted }) => {
  const [ratings, setRatings] = useState({
    taste: 0,
    service: 0,
    cleanliness: 0,
    authenticity: 0,
    comment: '',
  });

  const handleStarChange = (name, value) => {
    setRatings((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRatings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure all ratings are between 1 and 5
    const isValid = ['taste', 'service', 'cleanliness', 'authenticity'].every(
      (key) => ratings[key] >= 1 && ratings[key] <= 5
    );
  
    if (!isValid) {
      alert('Please provide a rating (1–5) for all categories.');
      return;
    }
  
    try {
      const { data, error } = await supabase.from('reviews').insert([
        {
          restaurant_id: restaurantId,
          rating_taste: ratings.taste,
          rating_service: ratings.service,
          rating_cleanliness: ratings.cleanliness,
          rating_authenticity: ratings.authenticity,
          comment: ratings.comment,
        },
      ]);
  
      if (error) throw error;
  
      console.log('✅ Review inserted:', data);
      onReviewSubmitted?.();
      setRatings({
        taste: 0,
        service: 0,
        cleanliness: 0,
        authenticity: 0,
        comment: '',
      });
    } catch (error) {
      console.error('❌ Supabase insert error:', error.message, error.details || error);
    }
  };
  
  
  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      {['taste', 'service', 'cleanliness', 'authenticity'].map((category) => (
        <div key={category} style={{ marginBottom: '12px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </label>
          <StarRating name={category} value={ratings[category]} onChange={handleStarChange} />
        </div>
      ))}

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Comment</label>
        <textarea
          name="comment"
          value={ratings.comment}
          onChange={handleChange}
          rows="4"
          placeholder="Write your review..."
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '6px',
          }}
        />
      </div>

      <button
        type="submit"
        style={{
          backgroundColor: '#f97316',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Submit Review
      </button>
    </form>
  );
};

export default RatingForm;
