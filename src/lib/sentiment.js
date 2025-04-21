// lib/sentiment.js

// Simple sentiment analysis function (you could replace this with more advanced models if necessary)
export function analyzeSentiment(text) {
  // Basic sentiment analysis using some keywords
  const positiveWords = ['good', 'great', 'delicious', 'amazing', 'awesome'];
  const negativeWords = ['bad', 'horrible', 'disappointing', 'terrible', 'awful'];

  let sentimentScore = 0;
  
  // Convert the text to lowercase to ensure case-insensitive matching
  const lowerCaseText = text.toLowerCase();

  positiveWords.forEach(word => {
    if (lowerCaseText.includes(word)) sentimentScore++;
  });

  negativeWords.forEach(word => {
    if (lowerCaseText.includes(word)) sentimentScore--;
  });

  // Determine the sentiment label based on score
  if (sentimentScore > 0) {
    return 'positive';
  } else if (sentimentScore < 0) {
    return 'negative';
  } else {
    return 'neutral';
  }
}
