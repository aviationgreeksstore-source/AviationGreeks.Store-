import { shopifyFetch } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import AddToCartButton from '@/components/product/AddToCartButton';
import ShakeToIdentRadar from '@/components/product/ShakeToIdentRadar';
import ProductRecommendations from '@/components/product/ProductRecommendations';
import FadeIn from '@/components/ui/FadeIn';
import { ReviewWidget } from '@/components/product/ReviewWidget';
import { getProductReviews } from '@/lib/judgeme';

const getProductQuery = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      shakeDiscount: metafield(namespace: "custom", key: "shake_discount_code") {
        value
      }
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
`;

type Product = {
  id: string;
  title: string;
  handle: string;
  descriptionHtml: string;
  shakeDiscount?: {
    value: string;
  } | null;
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

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const { handle } = params;

  let product: Product | null = null;
  let reviews: any[] = [];
  
  try {
    const { body } = await shopifyFetch<{ data: { product: Product | null } }>({
      query: getProductQuery,
      variables: { handle }
    });
    product = body.data?.product || null;

    if (product) {
      const rawId = product.id.split('/').pop(); // Extract numeric ID from gid://shopify/Product/...
      reviews = await getProductReviews({ handle: product.handle, externalId: rawId });
    }
  } catch (error) {
    console.error('Failed to fetch product:', error);
  }

  if (!product) {
    return notFound();
  }

  const variantId = product.variants?.edges?.[0]?.node?.id;
  const priceAmount = parseFloat(product.priceRange.minVariantPrice.amount || '0');
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.priceRange.minVariantPrice.currencyCode || 'USD',
  }).format(priceAmount);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-gray-800">
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
          
          {/* Left Column: Image */}
          <div className="flex-1">
            <ShakeToIdentRadar discountCode={product.shakeDiscount?.value}>
              <div className="aspect-[4/5] bg-neutral-900 rounded-sm overflow-hidden relative">
                {product.featuredImage?.url ? (
                  <Image 
                    src={product.featuredImage.url} 
                    alt={product.featuredImage.altText || product.title}
                    fill
                    priority 
                    className="object-cover w-full h-full pointer-events-none"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-600">
                    No Image Available
                  </div>
                )}
              </div>
            </ShakeToIdentRadar>
          </div>

          {/* Right Column: Details */}
          <div className="flex-1 flex flex-col pt-8 md:pt-16">
            <FadeIn delay={0.1}>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{product.title}</h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-2xl text-gray-300 font-light mb-8">{formattedPrice}</p>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <div 
                className="prose prose-invert prose-p:text-gray-400 max-w-none mb-12 font-light leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </FadeIn>

            <FadeIn delay={0.4}>
              <AddToCartButton 
                variantId={variantId} 
                productTitle={product.title} 
                price={formattedPrice} 
              />
            </FadeIn>
          </div>
          
        </div>

        <ReviewWidget reviews={reviews} productId={product.id.split('/').pop()} />

        {/* Product Recommendations */}
        <ProductRecommendations productId={product.id} />
      </main>
    </div>
  );
}
