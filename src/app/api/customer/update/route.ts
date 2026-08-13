import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';

const CUSTOMER_UPDATE_MUTATION = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        email
        acceptsMarketing
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

interface CustomerUpdateResponse {
  data?: {
    customerUpdate?: {
      customer: {
        id: string;
        email: string;
        acceptsMarketing: boolean;
        firstName?: string;
        lastName?: string;
      } | null;
      customerUserErrors: Array<{
        code: string;
        field: string[];
        message: string;
      }>;
    };
  };
  errors?: Array<{ message: string }>;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { acceptsMarketing, customerAccessToken: tokenFromBody } = body;

    // Check for authorization token in Header or Request Body
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    const customerAccessToken = bearerToken || tokenFromBody;

    if (!customerAccessToken) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing active Customer Access Token.' },
        { status: 401 }
      );
    }

    if (typeof acceptsMarketing !== 'boolean') {
      return NextResponse.json(
        { error: 'Bad Request: "acceptsMarketing" boolean value is required.' },
        { status: 400 }
      );
    }

    // Quietly update the customer profile via Shopify Storefront API
    const response = await shopifyFetch<CustomerUpdateResponse['data']>({
      query: CUSTOMER_UPDATE_MUTATION,
      variables: {
        customerAccessToken,
        customer: {
          acceptsMarketing
        }
      },
      cache: 'no-store'
    });

    const updatePayload = response?.body?.customerUpdate;
    const errors = updatePayload?.customerUserErrors;

    if (errors && errors.length > 0) {
      console.error('[Shopify Customer Update Error]:', errors);
      return NextResponse.json(
        {
          error: 'Shopify customer update failed.',
          details: errors
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      acceptsMarketing: updatePayload?.customer?.acceptsMarketing ?? acceptsMarketing,
      operativeId: updatePayload?.customer?.id,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[API /api/customer/update Exception]:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error?.message || 'Failed to update marketing frequency settings.'
      },
      { status: 500 }
    );
  }
}
