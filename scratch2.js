const domain = "if3x6e-n8.myshopify.com";
const storefrontAccessToken = "9f5896b831f9458a3f974872ac5aac52";
const apiVersion = "2024-04";

async function run() {
  let res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken
    },
    body: JSON.stringify({
      query: `
        query {
          products(first: 5) {
            edges {
              node {
                title
                variants(first: 5) {
                  edges {
                    node {
                      id
                      title
                      availableForSale
                      quantityAvailable
                      price { amount }
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
  console.log("Products:", JSON.stringify(data, null, 2));
}
run();
