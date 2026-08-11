'use server';

/**
 * Newsletter Signup Server Action
 * 
 * Currently logs subscriptions to the console.
 * 
 * To connect to a real provider, uncomment ONE of the integration
 * blocks below and set the corresponding environment variable:
 * 
 *   RESEND_API_KEY        → for Resend
 *   MAILCHIMP_API_KEY     → for Mailchimp
 *   MAILCHIMP_LIST_ID     → for Mailchimp
 * 
 * Or it will use Shopify's customerCreate mutation by default
 * if your Shopify storefront credentials are already set.
 */

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

type NewsletterResult = {
  success: boolean;
  message: string;
};

export async function subscribeToNewsletter(
  _prevState: NewsletterResult | null,
  formData: FormData
): Promise<NewsletterResult> {
  const email = formData.get('email') as string | null;

  // --- Validation ---
  if (!email || email.trim() === '') {
    return { success: false, message: 'Please enter your email address.' };
  }

  const trimmedEmail = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  try {
    // =============================================
    // OPTION 1: Shopify Customer Creation (Default)
    // =============================================
    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION || '2024-04';

    if (domain && token) {
      const mutation = `
        mutation customerCreate($input: CustomerCreateInput!) {
          customerCreate(input: $input) {
            customer {
              id
              email
            }
            customerUserErrors {
              code
              field
              message
            }
          }
        }
      `;

      const response = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': token,
        },
        body: JSON.stringify({
          query: mutation,
          variables: {
            input: {
              email: trimmedEmail,
              acceptsMarketing: true,
            },
          },
        }),
      });

      const body = await response.json();
      const errors = body.data?.customerCreate?.customerUserErrors;

      if (errors && errors.length > 0) {
        // "TAKEN" means they're already subscribed — treat as success
        if (errors[0].code === 'TAKEN') {
          return { success: true, message: "You're already part of the squadron! ✈️" };
        }
        console.error('Shopify customerCreate error:', errors);
        return { success: false, message: errors[0].message || 'Subscription failed.' };
      }

      console.log('✅ Newsletter signup via Shopify:', trimmedEmail);
      return { success: true, message: 'Welcome to the squadron! ✈️' };
    }

    // =============================================
    // OPTION 2: Resend (uncomment & set RESEND_API_KEY)
    // =============================================
    /*
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const response = await fetch('https://api.resend.com/audiences/YOUR_AUDIENCE_ID/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Resend error:', error);
        return { success: false, message: 'Subscription failed. Please try again.' };
      }

      console.log('✅ Newsletter signup via Resend:', trimmedEmail);
      return { success: true, message: 'Welcome to the squadron! ✈️' };
    }
    */

    // =============================================
    // OPTION 3: Mailchimp (uncomment & set keys)
    // =============================================
    /*
    const mailchimpKey = process.env.MAILCHIMP_API_KEY;
    const listId = process.env.MAILCHIMP_LIST_ID;
    if (mailchimpKey && listId) {
      const dc = mailchimpKey.split('-').pop(); // e.g. "us21"
      const response = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`anystring:${mailchimpKey}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: trimmedEmail,
          status: 'subscribed',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.title === 'Member Exists') {
          return { success: true, message: "You're already part of the squadron! ✈️" };
        }
        console.error('Mailchimp error:', error);
        return { success: false, message: 'Subscription failed. Please try again.' };
      }

      console.log('✅ Newsletter signup via Mailchimp:', trimmedEmail);
      return { success: true, message: 'Welcome to the squadron! ✈️' };
    }
    */

    // =============================================
    // FALLBACK: Console log (no provider configured)
    // =============================================
    console.log('📧 Newsletter signup (no provider configured):', trimmedEmail);
    return { success: true, message: 'Welcome to the squadron! ✈️' };

  } catch (error) {
    console.error('Newsletter signup error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}
