document.addEventListener('DOMContentLoaded', function () {
  const quoteCartGrid = document.querySelector('.quote-cart-grid');
  const quoteCartFooter = document.querySelector('.quote-footer');
  // const quoteCartHeading = document.querySelector(".quote-card-heading");
  const quoteAddidtionalRemarksContainer = document.querySelector(
    '.quote-additional-remarks-div'
  );

  function renderQuoteCart() {
    const loader = document.getElementById('quote-cart-loader');
    loader.style.display = 'block'; // Show loader
    quoteCartGrid.innerHTML = ''; // Optional: clear grid for new render

    // Use requestAnimationFrame to ensure loader is visible before blocking render
    requestAnimationFrame(() => {
      let quoteCart = JSON.parse(localStorage.getItem('quoteCart')) || [];

      if (quoteCart.length === 0) {
        quoteCartGrid.innerHTML = '<p>Please add products to quote cart</p>';
        quoteCartFooter.style.display = 'none';
        // quoteCartHeading?.style.display = "none";
        quoteAddidtionalRemarksContainer.style.display = 'none';
        loader.style.display = 'none'; // Hide loader
        return;
      } else {
        // quoteCartHeading?.style.display = "block";
        quoteCartFooter.style.display = 'flex';
        quoteAddidtionalRemarksContainer.style.display = 'flex';
      }

      // console.log(quoteCart);
      quoteCartGrid.innerHTML = '';

      quoteCart.forEach(
        (
          {
            product,
            rawId,
            currentPageUrl,
            listOfQuantities,
            quantityMinMax,
            productProjectInformation,
            customization,
            dimensions,
            projectProduct,
          },
          productIndex
        ) => {
          if (!product) return;

          const quoteCartItem = document.createElement('div');
          quoteCartItem.className = 'quote-cart-item';

          quoteCartItem.setAttribute('data-product-index', productIndex);
          quoteCartItem.setAttribute('data-product-handle', product.handle);

          // static data rendering - start
          const quoteItemProductImageTextButtonsContainer =
            document.createElement('div');
          quoteItemProductImageTextButtonsContainer.className =
            'quote-cart-item-product-image-text-buttons';

          const quoteItemProductImageText = document.createElement('div');
          quoteItemProductImageText.className =
            'quote-cart-item-product-image-text';

          const quoteItemProductText = document.createElement('div');
          quoteItemProductText.className = 'quote-cart-item-product-text';
          quoteItemProductText.innerHTML = `
            <h3><a href=${currentPageUrl}>${product.title}</a></h3>
          `;

          const defaultImage = `https://cdn.shopify.com/s/files/1/0924/3099/1671/files/default-product.png?v=1748501246`;

          // product selected variant sku
          const productSKU = document.createElement('p');

          product.variants.forEach((variant) => {
            if (parseInt(variant.id) === parseInt(rawId)) {
              productSKU.innerText = variant.sku ? `SKU: ${variant.sku}` : '';

              const imageUrl =
                variant?.image?.url || product.images?.[0]?.url || defaultImage;

              quoteItemProductImageText.innerHTML = `
                <img src="${imageUrl}" alt="${product.handle}" width="70" height="70" />
              `;
            }
          });

          quoteItemProductText.appendChild(productSKU);
          quoteItemProductImageText.appendChild(quoteItemProductText);
          quoteItemProductImageTextButtonsContainer.appendChild(
            quoteItemProductImageText
          );

          // buttons - delete and edit
          const buttonsContainer = document.createElement('div');
          buttonsContainer.className = 'quote-cart-item-product-buttons-group';
          buttonsContainer.innerHTML = `
            <button id="quote-product-delete-button" class="button button--small button--error delete-btn">Delete</button>
            <button class="button button--small edit-btn">Edit</button>
            <button class="button button--primary button--small save-changes-btn" style="display:none;">Save Changes</button>
            <button class="button button--small cancel-changes-btn" style="display:none;">Cancel Changes</button>
          `;
          quoteItemProductImageTextButtonsContainer.appendChild(
            buttonsContainer
          );

          const cartItemErrorDiv = document.createElement('div');
          cartItemErrorDiv.className = 'cart-item-error-div';
          cartItemErrorDiv.style.display = 'none';
          quoteItemProductImageTextButtonsContainer.appendChild(
            cartItemErrorDiv
          );
          quoteCartItem.appendChild(quoteItemProductImageTextButtonsContainer);

          const quoteCartItemProductDetails = document.createElement('div');
          quoteCartItemProductDetails.className =
            'quote-cart-item-product-details-static';

          // Create new containers for left and right sections
          const leftDetailsContainer = document.createElement('div');
          leftDetailsContainer.className =
            'quote-cart-item-product-details-static__left';

          quoteCartItemProductDetails.appendChild(leftDetailsContainer);

          const rightDetailsContainer = document.createElement('div');
          rightDetailsContainer.className =
            'quote-cart-item-product-details-static__right';

          quoteCartItemProductDetails.appendChild(rightDetailsContainer);

          // Wrap everything inside a parent container
          const productDetailsContainer = document.createElement('div');
          productDetailsContainer.className =
            ' quote-cart-item-detail quote-cart-item-detail__quantity';

          const productQunatityVariantsDiv = document.createElement('div');
          productQunatityVariantsDiv.className =
            'product-quantity-variant-details-container';

          function createQuantitySection(listOfQuantities) {
            const container = document.createElement('div');
            container.className =
              'quote-cart-item-detail quote-cart-item-detail__customization';

            const label = document.createElement('div');
            label.className = 'quote-cart-item-detail__label';
            label.textContent = 'Quantities';

            const valueDisplay = document.createElement('div');
            valueDisplay.textContent = listOfQuantities.join(', ');

            container.appendChild(label);
            container.appendChild(valueDisplay);

            return container;
          }

          function createProjectDescription(description) {
            const container = document.createElement('div');
            container.className =
              'quote-cart-item-detail quote-cart-item-detail__customization';

            const label = document.createElement('div');
            label.className = 'quote-cart-item-detail__label';
            label.textContent = 'Project Description';

            const value = document.createElement('div');
            value.textContent = description;

            container.appendChild(label);
            container.appendChild(value);

            return container;
          }

          function createCustomizationSection(customization) {
            const container = document.createElement('div');
            container.className =
              'quote-cart-item-detail quote-cart-item-detail__customization';

            const label = document.createElement('div');
            label.className = 'quote-cart-item-detail__label';
            label.textContent = 'Product Options';

            const list = document.createElement('ul');
            list.className = 'quote-cart-item-detail__customization-list';

            customization.forEach(({ name, value }) => {
              const item = document.createElement('li');
              item.innerHTML = `<div class="customization-list__label">${name}</div> <div class="customization-list__value">${value}</div>`;
              list.appendChild(item);
            });

            container.appendChild(label);
            container.appendChild(list);

            return container;
          }

          function createDimensionsSection(dimensions) {
            const order = ['L', 'W', 'H', 'D', 'Di'];

            // Filter and order dimension values
            const orderedDimensions = order
              .map((code) => dimensions.find((d) => d.code === code))
              .filter(Boolean);

            const codes = orderedDimensions.map((d) => d.code);
            const values = orderedDimensions.map((d) => `${d.value}\u201D`);

            const container = document.createElement('div');
            container.className =
              'quote-cart-item-detail quote-cart-item-detail__dimensions';

            const label = document.createElement('div');
            label.className = 'quote-cart-item-detail__label';
            label.textContent = `Dimensions (${codes.join(' × ')})`;

            const valueText = document.createElement('div');
            valueText.textContent = values.join(' × ');

            container.appendChild(label);
            container.appendChild(valueText);

            return container;
          }

          function createProjectProductSection(projectProduct) {
            const container = document.createElement('div');
            container.className =
              'quote-cart-item-detail quote-cart-item-detail__customization';

            const label = document.createElement('div');
            label.className = 'quote-cart-item-detail__label';
            label.textContent = 'Project Product';

            const value = document.createElement('div');
            value.textContent = projectProduct;

            container.appendChild(label);
            container.appendChild(value);

            return container;
          }

          // For variant section, we can create a function to handle the rendering
          // function createVariantSection(product, rawId) {
          //   if (product.variants.length === 1) return null; // Skip rendering if only one variant

          //   const wrapper = document.createElement('div');

          //   // Create label container
          //   const labelContainer = document.createElement('div');
          //   labelContainer.className = 'variant-label';

          //   const label = document.createElement('label');
          //   label.textContent = 'Variants';
          //   labelContainer.appendChild(label);

          //   // Create variant value container
          //   const variantValueContainer = document.createElement('div');
          //   variantValueContainer.className = 'each-variant-labels-container';

          //   // Match and append the variant title
          //   const matchedVariant = product.variants.find(
          //     (v) => parseInt(v.id) === parseInt(rawId)
          //   );

          //   if (matchedVariant) {
          //     const variantLabel = document.createElement('label');
          //     variantLabel.textContent = matchedVariant.title;
          //     variantValueContainer.appendChild(variantLabel);
          //   }

          //   // Assemble and return full section
          //   wrapper.appendChild(labelContainer);
          //   wrapper.appendChild(variantValueContainer);
          //   return wrapper;
          // }

          // // Variant section rendering
          // const variantSection = createVariantSection(product, rawId);
          // if (variantSection) {
          //   productQunatityVariantsDiv.appendChild(variantSection);
          // }

          // Quantity section rendering
          const quantitySection = createQuantitySection(listOfQuantities);
          productDetailsContainer.appendChild(quantitySection);

          // Project description section rendering
          productDetailsContainer.appendChild(productQunatityVariantsDiv);
          leftDetailsContainer.appendChild(productDetailsContainer);

          // Usage
          const projectInfoSection = createProjectDescription(
            productProjectInformation
          );
          rightDetailsContainer.appendChild(projectInfoSection);

          // Dimensions rendering
          if (Array.isArray(dimensions) && dimensions.length > 0) {
            const dimensionsSection = createDimensionsSection(dimensions);
            leftDetailsContainer.appendChild(dimensionsSection);
          }

          // Customization rendering
          if (Array.isArray(customization) && customization.length > 0) {
            const customizationSection =
              createCustomizationSection(customization);
            leftDetailsContainer.appendChild(customizationSection);
          }

          const projectProductSection =
            createProjectProductSection(projectProduct);
          rightDetailsContainer.appendChild(projectProductSection);

          quoteCartItem.appendChild(quoteCartItemProductDetails);

          // static data rendering - end

          // editing block rendering - start
          const editingBlock = document.createElement('div');
          editingBlock.className = 'product-details-edit-container';
          editingBlock.style.display = 'none';
          const variantAndQuantityEditBlock = document.createElement('div');

          const quantityEditBlock = document.createElement('div');
          quantityEditBlock.className = 'cart-quantity-input-text-container';
          quantityEditBlock.innerHTML = `
              <div class="cart-quantity-input-heading">
                    <h5>Quantity</h5>
                  </div>
            `;

          const quantityInputEditingBlock = document.createElement('div');

          const quantityInputItemContainer = document.createElement('div');
          quantityInputItemContainer.className =
            'cart-quantity-input-items-container';
          quantityInputItemContainer.innerHTML = `
              <input type="number" id="cart-product-item-quantity" min=${quantityMinMax.min} placeholder="Min ${quantityMinMax.min}">
              <button id="cart-add-new-quantity">Add Quantity</button>
            `;
          quantityInputEditingBlock.appendChild(quantityInputItemContainer);

          const errorDiv = document.createElement('div');
          errorDiv.className = 'quantity-input-error-div';
          quantityInputEditingBlock.appendChild(errorDiv);

          const addedQuantitiesContainer = document.createElement('div');
          addedQuantitiesContainer.className = 'cart-added-quantity-container';

          listOfQuantities.forEach((quantity) => {
            const quantityDiv = document.createElement('div');
            quantityDiv.innerHTML = `<label>${quantity}</label><button id="cart-delete-quantity">x</button>`;
            addedQuantitiesContainer.appendChild(quantityDiv);
          });

          quantityInputEditingBlock.appendChild(addedQuantitiesContainer);
          quantityEditBlock.appendChild(quantityInputEditingBlock);
          variantAndQuantityEditBlock.appendChild(quantityEditBlock);

          if (1 === product.variants.length) {
          } else {
            const variantEditBlock = document.createElement('div');
            variantEditBlock.innerHTML = `<p class="variant-options-label">Variant/Options values:</p>`;
            const variantEditOptionContainer = document.createElement('div');
            variantEditOptionContainer.className = 'variant-options-container';

            product.variants.forEach((variant) => {
              const eachVariantDiv = document.createElement('div');
              eachVariantDiv.setAttribute('data-variant-id', variant.id);
              eachVariantDiv.innerHTML = `${variant.title}`;

              if (parseInt(rawId) === parseInt(variant.id)) {
                eachVariantDiv.classList.add('active-variant');
              }
              variantEditOptionContainer.appendChild(eachVariantDiv);
            });
            variantEditBlock.appendChild(variantEditOptionContainer);
            variantAndQuantityEditBlock.appendChild(variantEditBlock);
          }

          editingBlock.appendChild(variantAndQuantityEditBlock);

          const projectInfoEditBlock = document.createElement('div');
          projectInfoEditBlock.innerHTML = `
              <div class="quote-cart-item-product-project-info">
                <label class="quote-project-info-label">Project Description</label><textarea name="project-info-textarea">${productProjectInformation}</textarea>
              </div>
            `;
          editingBlock.appendChild(projectInfoEditBlock);
          quoteCartItem.appendChild(editingBlock);
          // editing block rendering - end

          quoteCartGrid.appendChild(quoteCartItem);
        }
      );
      loader.style.display = 'none'; // Hide loader after rendering is complete
    });
  }

  // Initial render
  renderQuoteCart();

  let pendingDeleteIndex = null;
  const deletePopup = document.getElementById(
    'quote-item-delete-overlay-intermediate'
  );

  let openFlag = false;
  quoteCartGrid.addEventListener('click', function (e) {
    const editBtn = e.target.closest('.edit-btn');
    if (editBtn) {
      if (openFlag) {
        const cartItem = editBtn.closest('.quote-cart-item');
        cartItem.querySelector('.cart-item-error-div').innerHTML =
          'You can edit only one cart item at a time.';
        cartItem.querySelector('.cart-item-error-div').style.display = 'flex';

        return;
      }
      const cartItem = editBtn.closest('.quote-cart-item');
      cartItem.querySelector('.product-details-edit-container').style.display =
        'flex';
      cartItem.querySelector(
        '.quote-cart-item-product-details-static'
      ).style.display = 'none';
      cartItem.querySelector('.save-changes-btn').style.display = 'block';
      cartItem.querySelector('.cancel-changes-btn').style.display = 'block';
      cartItem.querySelector('.delete-btn').style.display = 'none';
      editBtn.style.display = 'none';
      openFlag = true;
      return;
    }
    const saveBtn = e.target.closest('.save-changes-btn');
    if (saveBtn) {
      // console.log(123);
      const cartItem = saveBtn.closest('.quote-cart-item');
      const index = parseInt(cartItem.getAttribute('data-product-index'));
      const updatedQtyDiv = cartItem.querySelectorAll(
        '.cart-added-quantity-container div'
      );
      // console.log(updatedQtyDiv);
      const projectInfo = cartItem.querySelector(
        '.quote-cart-item-product-project-info textarea'
      ).value;
      let allQuantities = [];
      updatedQtyDiv.forEach((div) => {
        const label = div.querySelector('label');
        const q = parseInt(label.innerHTML);
        allQuantities.push(q);
      });
      // console.log(allQuantities);

      const updatedVariantDiv = cartItem.querySelector(
        '.variant-options-container .active-variant'
      );
      console.log(updatedVariantDiv);

      const variantId = updatedVariantDiv?.getAttribute('data-variant-id');
      const productHandle = cartItem.getAttribute('data-product-handle');
      let quoteCart = JSON.parse(localStorage.getItem('quoteCart') || '[]');
      if (variantId) {
        const updatedURL = `{{request.origin}}/products/${productHandle}?variant=${variantId}`;
        quoteCart[index].rawId = variantId;
        quoteCart[index].currentPageUrl = updatedURL;
      }
      // Validate and update
      if (allQuantities) {
        // console.log("hello");
        quoteCart[index].listOfQuantities = allQuantities;

        quoteCart[index].productProjectInformation = projectInfo;

        localStorage.setItem('quoteCart', JSON.stringify(quoteCart));
        // console.log("cart:", quoteCart);
      }
      openFlag = false;
      renderQuoteCart();
      return;
    }
    // cancel changes button
    const cancelBtn = e.target.closest('.cancel-changes-btn');
    if (cancelBtn) {
      openFlag = false;
      renderQuoteCart();
      // const cartItem = cancelBtn.closest('.quote-cart-item');
      // cartItem.querySelector('.product-details-edit-container').style.display = "none";
      // cartItem.querySelector('.save-changes-btn').style.display = "none";
      // cartItem.querySelector('.cancel-changes-btn').style.display = "none";
      // cartItem.querySelector('.quote-cart-item-product-details-static').style.display = "flex";
      // cartItem.querySelector('.edit-btn').style.display = "block";
    }

    // Variant Option Selection
    const variantDiv = e.target.closest('.variant-options-container div');
    if (variantDiv) {
      const cartItem = variantDiv.closest('.quote-cart-item');
      const productIndex = parseInt(
        cartItem.getAttribute('data-product-index')
      );
      const variantOptions = cartItem.querySelectorAll(
        '.variant-options-container div'
      );

      variantOptions.forEach((el) => el.classList.remove('active-variant'));
      variantDiv.classList.add('active-variant');
      return;
    }

    // Handle DELETE button in cart
    const deleteBtn = e.target.closest('#quote-product-delete-button');
    if (deleteBtn) {
      e.preventDefault();
      const quoteCartItem = deleteBtn.closest('.quote-cart-item');
      pendingDeleteIndex = parseInt(
        quoteCartItem.getAttribute('data-product-index')
      );
      deletePopup.style.display = 'flex';
      return;
    }

    // // Add new quantity
    const addNewQuantity = e.target.closest('#cart-add-new-quantity');
    if (addNewQuantity) {
      e.preventDefault();
      // let quoteCart = JSON.parse(localStorage.getItem("quoteCart") || "[]");

      const quoteCartItem = addNewQuantity.closest('.quote-cart-item');
      const productIndex = parseInt(
        quoteCartItem.getAttribute('data-product-index')
      );
      const errorDiv = quoteCartItem.querySelector('.quantity-input-error-div');
      const addedQuantitesContainer = quoteCartItem.querySelector(
        '.cart-added-quantity-container'
      );

      const quantityInput = quoteCartItem.querySelector(
        '#cart-product-item-quantity'
      );
      const minValue = parseInt(quantityInput.min);
      // const maxValue = parseInt(quantityInput.max);
      const value = quantityInput ? quantityInput.value : null;

      const inputValue = value.trim(); // assuming `value` is from your input
      const parsedValue = parseInt(inputValue);
      const quantityContainer = quoteCartItem.querySelector(
        '.cart-added-quantity-container'
      );
      const existingQuantities = [
        ...quantityContainer.querySelectorAll('label'),
      ].map((label) => parseInt(label.textContent));

      errorDiv.style.display = 'none';
      errorDiv.innerHTML = ''; // Clear previous error

      if (!inputValue) {
        errorDiv.innerHTML = `<span>Please add quantity.</span>`;
        errorDiv.style.padding = '0 0 10px 0';
        errorDiv.style.display = 'block';
      } else if (isNaN(parsedValue) || parsedValue < minValue) {
        errorDiv.innerHTML = `<span>You can add quantity greater or equal to ${minValue} for this product.</span>`;
        errorDiv.style.padding = '0 0 10px 0';
        errorDiv.style.display = 'block';
      } else if (existingQuantities.includes(parsedValue)) {
        errorDiv.innerHTML = `<span>This quantity has already been added.</span>`;
        errorDiv.style.display = 'block';
        errorDiv.style.padding = '0 0 10px 0';
      } else {
        const newQuantityDiv = document.createElement('div');
        newQuantityDiv.innerHTML = `
          <label>${parsedValue}</label><button id="cart-delete-quantity">x</button>
        `;
        quantityContainer.appendChild(newQuantityDiv);
        quantityInput.value = '';
      }

      return;
    }

    // // Delete quantity
    const deleteQuantity = e.target.closest('#cart-delete-quantity');
    if (deleteQuantity) {
      e.preventDefault();
      // let quoteCart = JSON.parse(localStorage.getItem("quoteCart") || "[]");

      const quoteCartItem = deleteQuantity.closest('.quote-cart-item');
      const productIndex = parseInt(
        quoteCartItem.getAttribute('data-product-index')
      );

      const quantityWrapper = deleteQuantity.closest('div');
      quantityWrapper.remove();
      // const quantityText = quantityWrapper.querySelector("label");

      return;
    }
  });

  // quoteCartGrid.addEventListener("change", function (e) {
  //   if (e.target.name === "project-info-textarea") {
  //     const cartItem = e.target.closest(".quote-cart-item");
  //     const productIndex = parseInt(
  //       cartItem.getAttribute("data-product-index")
  //     );

  //     let quoteCart = JSON.parse(localStorage.getItem("quoteCart") || "[]");

  //     if (quoteCart[productIndex]) {
  //       quoteCart[productIndex].productProjectInformation =
  //         e.target.value.trim();
  //       localStorage.setItem("quoteCart", JSON.stringify(quoteCart));
  //       // console.log("Updated quoteCart with project info:", quoteCart);
  //       renderQuoteCart();
  //     }
  //   }
  // });

  document.addEventListener('click', function (e) {
    // Cancel button in popup
    if (e.target.classList.contains('popup-item-delete-quote-cancel')) {
      deletePopup.style.display = 'none';
      pendingDeleteIndex = null;
    }

    // Confirm Delete in popup
    if (e.target.classList.contains('popup-item-delete-quote')) {
      if (pendingDeleteIndex !== null) {
        let quoteCart = JSON.parse(localStorage.getItem('quoteCart') || '[]');
        quoteCart.splice(pendingDeleteIndex, 1);
        localStorage.setItem('quoteCart', JSON.stringify(quoteCart));
        renderQuoteCart();
        deletePopup.style.display = 'none';
        pendingDeleteIndex = null;
      }
    }
  });
});
document.addEventListener('keydown', function (e) {
  const input = e.target;
  if (input.id === 'cart-product-item-quantity') {
    // Prevent unwanted characters
    if (['e', 'E', '+', '-'].includes(e.key)) {
      e.preventDefault();
    }

    // Trigger add on Enter
    if (e.key === 'Enter') {
      const addButton = input
        .closest('.quote-cart-item')
        .querySelector('#cart-add-new-quantity');

      if (addButton) {
        addButton.click();
      }
    }
  }
});

// Prefill textarea from localStorage
window.addEventListener('DOMContentLoaded', () => {
  const savedRemarks = localStorage.getItem('additionalRemarks');
  if (savedRemarks !== null) {
    document.getElementById('quote-additional-remarks').value = savedRemarks;
  }
});
function changeAdditionalRemarks() {
  const remarks = document.getElementById('quote-additional-remarks').value;
  localStorage.setItem('additionalRemarks', remarks);
}
