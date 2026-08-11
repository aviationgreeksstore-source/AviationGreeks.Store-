import { shopifyFetch } from '@/lib/shopify';
import LandingClient from './LandingClient';

const getProductsQuery = `
  query getProducts {
    products(first: 10) {
      edges {
        node {
          id
          title
          handle
          featuredImage {
            url
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
    }
  }
`;

export default async function Home() {
  let products: any[] = [];
  try {
    const { body } = await shopifyFetch<{
      data: {
        products: {
          edges: Array<{
            node: {
              id: string;
              title: string;
              handle: string;
              featuredImage?: {
                url: string;
                altText: string;
              } | null;
              priceRange: {
                minVariantPrice: {
                  amount: string;
                  currencyCode: string;
                };
              };
              variants: {
                edges: Array<{
                  node: {
                    id: string;
                  };
                }>;
              };
            };
          }>;
        };
      };
    }>({
      query: getProductsQuery,
    });
    products = body.data?.products?.edges || [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }

  return (
    <>
      <LandingClient products={products} />
    </>
  );
}
