document.addEventListener("DOMContentLoaded", () => {
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
    <div class="product-container">
      <div class="main-image">
        <img src="${product.imageUrl}" alt="${product.Title}">
      </div>
      <div class="product-info">
         <img class="small-image" src="${product.imageUrl}" alt="Small ${product.Title}">
        <h2 class="product-title">${product.Title}</h2>
        <p class="product-description">${product.shortdescription}</p>
     
        <button class="view-btn">View Product Details</button>
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
