const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function shopifyFetch<T>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  variables
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: any;
}): Promise<{ status: number; body: T }> {
  try {
    const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION || '2024-04';
    const result = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken!,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache,
      ...(tags && { next: { tags } })
    });

    let body;
    const text = await result.text();
    try {
      body = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse JSON response from Shopify. Status:', result.status, 'Text:', text);
      throw new Error(`Invalid JSON response: ${text}`);
    }

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    console.error('Error fetching from Shopify:', e);
    throw {
      error: e,
      query
    };
  }
}

const cartFragment = `
  fragment cart on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                title
                handle
                featuredImage {
                  url(transform: { maxWidth: 400, preferredContentType: WEBP })
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

const cartCreateMutation = `
  mutation cartCreate($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;

const cartLinesAddMutation = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;

const getCartQuery = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...cart
    }
  }
  ${cartFragment}
`;

export async function createCart(): Promise<any> {
  try {
    const { body } = await shopifyFetch<{ data: { cartCreate: { cart: any } } }>({
      query: cartCreateMutation,
      cache: 'no-store'
    });
    return body.data?.cartCreate?.cart;
  } catch (error) {
    console.error('Failed to create cart:', error);
    return null;
  }
}

export async function addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]): Promise<any> {
  try {
    const { body } = await shopifyFetch<{ data: { cartLinesAdd: { cart: any } } }>({
      query: cartLinesAddMutation,
      variables: { cartId, lines },
      cache: 'no-store'
    });
    return body.data?.cartLinesAdd?.cart;
  } catch (error) {
    console.error('Failed to add to cart:', error);
    throw new Error('Failed to add to cart API call');
  }
}

export async function getCart(cartId: string): Promise<any> {
  try {
    const { body } = await shopifyFetch<{ data: { cart: any } }>({
      query: getCartQuery,
      variables: { cartId },
      cache: 'no-store'
    });
    return body.data?.cart;
  } catch (error) {
    console.error('Failed to get cart:', error);
    return null;
  }
}

const cartLinesRemoveMutation = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<any> {
  try {
    const { body } = await shopifyFetch<{ data: { cartLinesRemove: { cart: any } } }>({
      query: cartLinesRemoveMutation,
      variables: { cartId, lineIds },
      cache: 'no-store'
    });
    return body.data?.cartLinesRemove?.cart;
  } catch (error) {
    console.error('Failed to remove from cart:', error);
    throw new Error('Failed to remove from cart API call');
  }
}

const cartLinesUpdateMutation = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;

export async function updateCartLines(cartId: string, lines: { id: string; quantity: number }[]): Promise<any> {
  try {
    const { body } = await shopifyFetch<{ data: { cartLinesUpdate: { cart: any } } }>({
      query: cartLinesUpdateMutation,
      variables: { cartId, lines },
      cache: 'no-store'
    });
    return body.data?.cartLinesUpdate?.cart;
  } catch (error) {
    console.error('Failed to update cart lines:', error);
    throw new Error('Failed to update cart lines API call');
  }
}

const getCollectionsQuery = `
  query getCollections {
    collections(first: 100, sortKey: TITLE) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url(transform: { maxWidth: 800, preferredContentType: WEBP })
            altText
          }
        }
      }
    }
  }
`;

const getCollectionQuery = `
  query getCollection($handle: String!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        url(transform: { maxWidth: 800, preferredContentType: WEBP })
        altText
      }
      products(first: 100) {
        edges {
          node {
            id
            title
            handle
            featuredImage {
              url(transform: { maxWidth: 800, preferredContentType: WEBP })
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

export async function getCollections(): Promise<any[]> {
  try {
    const { body } = await shopifyFetch<{ data: { collections: { edges: any[] } } }>({
      query: getCollectionsQuery,
      cache: 'no-store'
    });
    return body.data?.collections?.edges?.map((edge) => edge.node) || [];
  } catch (error) {
    console.error('Failed to get collections:', error);
    return [];
  }
}

export async function getCollection(handle: string): Promise<any> {
  try {
    const { body } = await shopifyFetch<{ data: { collection: any } }>({
      query: getCollectionQuery,
      variables: { handle },
      cache: 'no-store'
    });
    return body.data?.collection;
  } catch (error) {
    console.error('Failed to get collection:', error);
    return null;
  }
}

const getProductRecommendationsQuery = `
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      id
      title
      handle
      featuredImage {
        url(transform: { maxWidth: 800, preferredContentType: WEBP })
        altText
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 1) {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;

export async function getProductRecommendations(productId: string): Promise<any[]> {
  try {
    const { body } = await shopifyFetch<{ data: { productRecommendations: any[] } }>({
      query: getProductRecommendationsQuery,
      variables: { productId },
      cache: 'no-store'
    });
    return body.data?.productRecommendations || [];
  } catch (error) {
    console.error('Failed to get product recommendations:', error);
    return [];
  }
}

const searchProductsQuery = `
  query searchProducts($query: String!) {
    products(first: 100, query: $query) {
      edges {
        node {
          id
          title
          handle
          featuredImage {
            url(transform: { maxWidth: 800, preferredContentType: WEBP })
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export async function searchProducts(query: string): Promise<any[]> {
  try {
    const { body } = await shopifyFetch<{ data: { products: { edges: any[] } } }>({
      query: searchProductsQuery,
      variables: { query },
      cache: 'no-store'
    });
    return body.data?.products?.edges?.map((edge) => edge.node) || [];
  } catch (error) {
    console.error('Failed to search products:', error);
    return [];
  }
}
