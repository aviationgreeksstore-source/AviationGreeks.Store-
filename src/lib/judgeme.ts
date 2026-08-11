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

export interface SubmitReviewPayload {
  name: string;
  email: string;
  rating: number;
  title: string;
  body: string;
  id: string; // The Shopify Product ID
}

/**
 * Submit a product review to Judge.me API.
 */
export async function submitProductReview(payload: SubmitReviewPayload) {
  if (!shopDomain || !publicToken) {
    throw new Error('Judge.me API tokens are missing.');
  }

  const url = new URL('https://judge.me/api/v1/reviews');
  
  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        shop_domain: shopDomain,
        platform: 'shopify',
        id: payload.id,
        email: payload.email,
        name: payload.name,
        rating: payload.rating,
        title: payload.title,
        body: payload.body,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Judge.me API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to submit Judge.me review:', error);
    throw error;
  }
}
