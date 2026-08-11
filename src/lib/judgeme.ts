export interface JudgeMeReview {
  id: number;
  title: string;
  body: string;
  rating: number;
  reviewer: {
    name: string;
  };
  created_at: string;
}

const shopDomain = process.env.NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN;
const publicToken = process.env.NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN;

/**
 * Fetch product reviews from Judge.me API.
 * @param identifier Provide either `handle` (Shopify product handle) or `externalId` (Shopify product ID)
 */
export async function getProductReviews(identifier: { handle?: string; externalId?: string }): Promise<JudgeMeReview[]> {
  if (!shopDomain || !publicToken) {
    console.warn('Judge.me API tokens are missing from environment variables.');
    return [];
  }

  const url = new URL('https://judge.me/api/v1/reviews');
  url.searchParams.append('shop_domain', shopDomain);
  url.searchParams.append('api_token', publicToken);
  url.searchParams.append('per_page', '10');
  
  if (identifier.externalId) {
    url.searchParams.append('external_id', identifier.externalId);
  } else if (identifier.handle) {
    url.searchParams.append('handle', identifier.handle);
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Using Next.js cache feature to revalidate every hour
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      console.error(`Judge.me API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data.reviews || [];
  } catch (error) {
    console.error('Failed to fetch Judge.me reviews:', error);
    return [];
  }
}
