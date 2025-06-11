document.addEventListener('DOMContentLoaded', function () {
  const quoteButton = document.getElementById('add-to-quote');

  /**
   * Scan #capabilities-section for all hidden inputs
   * with a data-name attribute, and return {name,value}.
   */
  function getCustomizationOptions() {
    const container = document.getElementById('capabilities-section');
    console.log('[getCustomizationOptions] container:', container);
    if (!container) {
      console.warn('[getCustomizationOptions] no #capabilities-section found');
      return [];
    }

    // Grab all the hidden inputs you rendered in your dropdown snippet
    const inputs = container.querySelectorAll(
      'input[type="hidden"][data-name]'
    );
    console.log('[getCustomizationOptions] found inputs:', inputs);

    return Array.from(inputs).map((input) => ({
      name: input.dataset.name,
      value: input.value,
    }));
  }

  async function fetchProduct(productHandle) {
    const shopify_domain = 'pakfactory-v-2.myshopify.com';
    const shopify_token = '623c45a87058bc44bfaba2b61f819581';

    const query = `
    {
      product(handle: "${productHandle}") {
        title
        handle
        images(first: 1) {
          edges { node { url } }
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              sku
              price { amount }
              image { url }
            }
          }
        }
      }
    }
    `;

    const response = await fetch(
      `https://${shopify_domain}/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': shopify_token,
        },
        body: JSON.stringify({ query }),
      }
    );

    const data = await response.json();
    return data.data.product;
  }

  quoteButton.addEventListener('click', async function () {
    const currentProductUrl = new URL(window.location.href);
    const popupIntermediate = document.getElementById(
      'quote-popup-overlay-intermediate'
    );
    const continueBrowsingButton = popupIntermediate.querySelector(
      '.popup-quote-continue'
    );

    const rawId = document
      .querySelector('#hidden-variant-id')
      .getAttribute('hidden-product-variant-id');

    const productHandle = document
      .querySelector('.hidden-product-handle')
      .getAttribute('hidden-product-handle');

    const productProjectInformation = document.querySelector(
      '.project-detail__description textarea'
    ).value;

    const quantityInputOnProductPage = document.querySelector(
      '#product-item-quantity'
    );
    const quantityMinMax = {
      min: quantityInputOnProductPage.min,
    };

    // Build quantities list
    const dropDownsDiv = document.querySelectorAll(
      '.added-quantity-container div'
    );
    const errorDiv = document.querySelector('.quantity-input-error-div');
    if (!dropDownsDiv || dropDownsDiv.length === 0) {
      errorDiv.innerHTML = `<span>Please add quantity to add product to quote.</span>`;
      errorDiv.style.display = 'block';
      return;
    }

    const listOfQuantities = [];
    dropDownsDiv.forEach((div) => {
      const value = div.querySelector('label').innerText;
      if (value !== '') {
        listOfQuantities.push(parseInt(value, 10));
      }
    });

    // Grab customization options
    const customization = getCustomizationOptions();

    // Fetch product data
    const rawProduct = await fetchProduct(productHandle);
    if (!rawProduct) return;

    // Normalize edges to arrays
    let product = {
      ...rawProduct,
      variants: rawProduct.variants.edges.map((edge) => edge.node),
      images: rawProduct.images.edges.map((edge) => edge.node),
    };
    product.variants.forEach((variant) => {
      const parts = variant.id.split('/');
      variant.id = parts[parts.length - 1];
    });

    // Load or init quoteCart
    let quoteCart;
    try {
      quoteCart = JSON.parse(localStorage.getItem('quoteCart')) || [];
    } catch {
      console.warn('Invalid localStorage data for quoteCart. Resetting it.');
      quoteCart = [];
    }

    // Only push if everything’s valid
    if (
      product &&
      rawId &&
      listOfQuantities.length > 0 &&
      quantityMinMax.min != null
    ) {
      quoteCart.push({
        product,
        rawId,
        currentProductUrl,
        listOfQuantities,
        quantityMinMax,
        productProjectInformation,
        customization, // ← here’s your new field
      });

      localStorage.setItem('quoteCart', JSON.stringify(quoteCart));

      popupIntermediate.style.display = 'flex';
      continueBrowsingButton.addEventListener('click', () => {
        window.location.href = currentProductUrl;
      });
    }
  });
});
