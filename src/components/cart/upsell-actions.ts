'use server'

import { getProductRecommendations } from '@/lib/shopify';

export async function fetchAIRecommendation(productId: string) {
  try {
    // Fetch recommendations based on the provided product ID
    const recommendations = await getProductRecommendations(productId);
    
    // Return exactly 1 highly relevant product (or null if none exist)
    if (recommendations && recommendations.length > 0) {
      return recommendations[0];
    }
    return null;
  } catch (error) {
    console.error('AI Loadmaster failed to compute payload:', error);
    return null;
  }
}
