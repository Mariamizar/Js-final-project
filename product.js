document.addEventListener("DOMContentLoaded", () => {
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (productId) {
    fetchProductDetails(productId);
  } else {
    showError("Product not found");
  }
});

async function fetchProductDetails(productId) {
  try {
    const response = await fetch("./nike.json");
    const products = await response.json();
    const product = products.find((p) => p.id == productId);

    if (product) {
      renderProductDetails(product);
    } else {
      showError("Product not found");
    }
  } catch (error) {
    console.error("Error:", error);
    showError("Error loading product");
  }
}

function renderProductDetails(product) {
  const container = document.getElementById("product-details");
  container.innerHTML = `
    <div class="product-detail">
      <div class="product-image">
        <img src="${product.imageUrl}" alt="${
    product.Title
  }"> <!-- Changed from product.name -->
      </div>
      <div class="product-info">
        <h1>${product.Title}</h1> <!-- Changed from product.name -->
        <p class="price">$${product.price.toFixed(2)}</p>
        <p class="description">${
          product.shortdescription
        }</p> <!-- Changed from product.description -->
        <button class="add-to-cart">Add to Cart</button>
      </div>
    </div>
  `;
}

function showError(message) {
  document.getElementById("product-details").innerHTML = `
    <div class="error">
      <p>${message}</p>
      <a href="main.html" class="back-link">← Back to Products</a>
    </div>
  `;
}
