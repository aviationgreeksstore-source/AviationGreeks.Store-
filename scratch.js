const domain = "if3x6e-n8.myshopify.com";
const storefrontAccessToken = "9f5896b831f9458a3f974872ac5aac52";
const apiVersion = "2024-04";

async function run() {
  // Get collections/products to get a variant ID
  let res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken
    },
    body: JSON.stringify({
      query: `
        query {
          products(first: 1) {
            edges {
              node {
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
      `
    })
  });
  let data = await res.json();
  const variantId = data.data.products.edges[0].node.variants.edges[0].node.id;

  // Create Cart
  res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken
    },
    body: JSON.stringify({
      query: `
        mutation cartCreate($input: CartInput) {
          cartCreate(input: $input) {
            cart {
              id
              lines(first: 100) {
                edges {
                  node {
                    id
                    quantity
                  }
                }
              }
            }
            userErrors {
              message
              field
            }
          }
        }
      `,
      variables: { input: { lines: [{ merchandiseId: variantId, quantity: 1 }] } }
    })
  });
  data = await res.json();
  console.log("Cart Create:", JSON.stringify(data, null, 2));
}
run();
