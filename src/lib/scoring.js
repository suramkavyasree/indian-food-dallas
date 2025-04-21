// lib/scoring.js
import { analyzeSentiment } from './sentiment';

export function calculateRestaurantScore(reviews) {
  if (!reviews || reviews.length === 0) return null;

  const recentCutoff = new Date();
  recentCutoff.setDate(recentCutoff.getDate() - 30);

  let totalScore = 0;
  let count = 0;
  let positive = 0;
  let negative = 0;

  reviews.forEach((rev) => {
    const createdAt = new Date(rev.created_at);
    if (createdAt > recentCutoff) {
      const ratings = [
        rev.rating_taste,
        rev.rating_service,
        rev.rating_cleanliness,
        rev.rating_authenticity,
      ];

      if (ratings.every((r) => typeof r === 'number')) {
        const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        totalScore += avg;
        count++;
      }

      // Use the sentiment analysis function
      const sentiment = analyzeSentiment(rev.comment);  // Assuming there's a 'comment' field in the review
      if (sentiment === 'positive') positive++;
      if (sentiment === 'negative') negative++;
    }
  });

  const avgOverallRating = count ? totalScore / count : 0;

  // Calculate final score with weights for sentiment
  return (avgOverallRating * 3) + (positive * 2) - (negative * 1.5);
}
