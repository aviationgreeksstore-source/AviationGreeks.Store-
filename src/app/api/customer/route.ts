import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';

// ---------------------------------------------------------------------------
// GraphQL query — fetches everything the Pilot Dossier needs to display
// ---------------------------------------------------------------------------
const CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      firstName
      lastName
      email
      acceptsMarketing
      defaultAddress {
        address1
        address2
        city
        provinceCode
        zip
        countryCode
      }
    }
  }
`;

// ---------------------------------------------------------------------------
// TypeScript shapes
// ---------------------------------------------------------------------------
interface CustomerQueryResponse {
  customer: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    acceptsMarketing: boolean;
    defaultAddress: {
      address1: string | null;
      address2: string | null;
      city: string | null;
      provinceCode: string | null;
      zip: string | null;
      countryCode: string | null;
    } | null;
  } | null;
}

// ---------------------------------------------------------------------------
// GET /api/customer
// Reads the customer access token from:
//   1. Authorization: Bearer <token>  header (preferred, sent by the client)
//   2. shopify_customer_access_token cookie (fallback)
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  try {
    // --- Resolve the customer access token -----------------------------------
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7).trim()
      : null;

    const cookieToken = request.cookies.get('shopify_customer_access_token')?.value ?? null;

    const customerAccessToken = bearerToken || cookieToken;

    if (!customerAccessToken) {
      return NextResponse.json(
        { error: 'Unauthorized: No active customer session found.' },
        { status: 401 }
      );
    }

    // --- Execute the Storefront API query -----------------------------------
    const response = await shopifyFetch<{ data: CustomerQueryResponse }>({
      query: CUSTOMER_QUERY,
      variables: { customerAccessToken },
      cache: 'no-store'
    });

    const customer = (response.body as any)?.data?.customer ?? null;

    if (!customer) {
      // Token exists but is expired / invalid
      return NextResponse.json(
        { error: 'Unauthorized: Customer session is invalid or has expired.' },
        { status: 401 }
      );
    }

    // --- Shape and return the profile ---------------------------------------
    return NextResponse.json({
      success: true,
      customer: {
        firstName: customer.firstName ?? '',
        lastName: customer.lastName ?? '',
        email: customer.email,
        acceptsMarketing: customer.acceptsMarketing,
        defaultAddress: customer.defaultAddress
          ? {
              address1: customer.defaultAddress.address1 ?? '',
              address2: customer.defaultAddress.address2 ?? '',
              city: customer.defaultAddress.city ?? '',
              provinceCode: customer.defaultAddress.provinceCode ?? '',
              zip: customer.defaultAddress.zip ?? '',
              countryCode: customer.defaultAddress.countryCode ?? ''
            }
          : null
      }
    });
  } catch (error: any) {
    console.error('[API /api/customer GET Exception]:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error?.message || 'Failed to retrieve operative profile.'
      },
      { status: 500 }
    );
  }
}
