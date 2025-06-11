document.addEventListener('DOMContentLoaded', function () {
  const quoteButton = document.getElementById('add-to-quote');

  async function fetchProduct(productHandle) {
    const shopify_domain = 'pakfactory-v-2.myshopify.com';
    const shopify_token = '623c45a87058bc44bfaba2b61f819581';

    const query = `
    {
      product(handle: "${productHandle}") {
        title
        handle
        images(first: 1) {
          edges {
            node {
              url
            }
          }
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              sku
              price {
                amount
              }
              image {
                url
              }
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
    // console.log(data);
    // console.log(data.data.product);
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
    console.log(rawId);
    const productHandle = document
      .querySelector('.hidden-product-handle')
      .getAttribute('hidden-product-handle');
    // console.log(productHandle);
    const productProjectInformation = document.querySelector(
      '.project-detail__description textarea'
    ).value;
    // console.log(productProjectInformation);

    const quantityInputOnProductPage = document.querySelector(
      '#product-item-quantity'
    );
    const quantityMinMax = {
      min: quantityInputOnProductPage.min,
    };

    const currentPageUrl = new URL(window.location.href);
    let listOfQuantities = [];
    const errorDiv = document.querySelector('.quantity-input-error-div');
    const dropDownsDiv = document.querySelectorAll(
      '.added-quantity-container div'
    );
    // console.log(dropDownsDiv.length);
    if (!dropDownsDiv || 0 === dropDownsDiv.length) {
      errorDiv.innerHTML = `<span>Please add quantity to add product to quote.</span>`;
      errorDiv.style.display = 'block';
      return;
    }
    dropDownsDiv.forEach((div) => {
      const value = div.querySelector('label').innerText;
      if (value != '') {
        listOfQuantities.push(parseInt(value));
      }
    });

    const rawProduct = await fetchProduct(productHandle);
    if (rawProduct) {
      // console.log("Raw Product: ",rawProduct);
      let product = {
        ...rawProduct,
        variants: rawProduct.variants.edges.map((edge) => edge.node),
        images: rawProduct.images.edges.map((edge) => edge.node), // optional, if you want image URLs directly
      };
      product.variants.forEach((variant) => {
        const fullId = variant.id;
        const idComponents = fullId.split('/');
        const len = idComponents.length;
        const variantId = idComponents[len - 1];
        variant.id = variantId;
      });
      // console.log('product',product);

      let quoteCart;
      try {
        quoteCart = JSON.parse(localStorage.getItem('quoteCart')) || [];
      } catch (e) {
        console.warn('Invalid localStorage data for quoteCart. Resetting it.');
        quoteCart = [];
      }

      // Add new product
      if (
        product &&
        rawId &&
        currentPageUrl &&
        listOfQuantities.length != 0 &&
        quantityMinMax.length != 0
      ) {
        quoteCart.push({
          product,
          rawId,
          currentPageUrl,
          listOfQuantities,
          quantityMinMax,
          productProjectInformation,
        });

        localStorage.setItem('quoteCart', JSON.stringify(quoteCart));
        // Redirect to quote cart page
        // window.location.href = "https://pakfactory-v-2.myshopify.com/pages/quote-cart";
        popupIntermediate.style.display = 'flex';
        continueBrowsingButton.addEventListener('click', () => {
          window.location.href = currentProductUrl;
        });
      }
    }
  });
});
