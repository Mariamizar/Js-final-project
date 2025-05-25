const header = document.querySelector("header");
const productsContainer = document.getElementById("products-container");
const paginationContainer = document.getElementById("pagination");
const sortBySelect = document.getElementById("sort-by");
const searchInput = document.querySelector(".search-input");
searchInput.addEventListener("input", handleSearch);

let allProducts = [];
let filteredProducts = [];
const productsPerPage = 6;
let currentPage = 1;

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  setupEventListeners();
});

async function fetchProducts() {
  try {
    const response = await fetch("./nike.json");
    allProducts = await response.json();
    filteredProducts = [...allProducts];
    renderProducts(currentPage);
    renderPagination();
  } catch (error) {
    console.error("Error loading products:", error);
    productsContainer.innerHTML = `
            <div class="alert alert-danger">
                Error loading products. Please try again later.
            </div>
        `;
  }
}

function handleScroll() {
  if (window.scrollY > 80) {
    header.classList.add("fixed-top", "bg-dark", "text-light");
    header.classList.remove("bg-light", "text-dark");
  } else {
    header.classList.remove("bg-dark", "fixed-top", "text-dark");
    header.classList.add("bg-light", "text-dark");
  }
}

function renderProducts(page) {
  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productsToShow = filteredProducts.slice(startIndex, endIndex);

  productsContainer.innerHTML = "";

  if (productsToShow.length === 0) {
    productsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <h4>No products found matching your criteria</h4>
                <button class="btn btn-link" onclick="resetFilters()">Reset filters</button>
            </div>
        `;
    return;
  }

  productsToShow.forEach((product) => {
    const productCard = `
    <div class="col-md-4 mb-4">
      <div class="card h-100 product-card" data-id="${
        product.id
      }"> <!-- Add data-id here -->
        <img src="${product.imageUrl}" class="card-img-top" alt="${
      product.Title
    }">
        <div class="card-body">
          <h5 class="card-title">${product.Title}</h5>
          <p class="card-text">${product.shortdescription}</p>
          <div class="d-flex justify-content-between align-items-center">
            <span class="price">$${product.price.toFixed(2)}</span>
    
          </div>
        </div>
      </div>
    </div>
  `;
    productsContainer.innerHTML += productCard;
  });

  setupProductClickHandlers();
}

document.querySelectorAll(".product-card").forEach((card) => {
  card.addEventListener("click", (e) => {
    if (e.target.closest(".btn-primary")) return;

    const productId = card.dataset.id;
    window.location.href = `product.html?id=${productId}`;
  });
});
function renderPagination() {
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  paginationContainer.innerHTML = "";

  if (totalPages <= 1) return;

  const prevBtn = `
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <a class="page-link" href="#" aria-label="Previous" data-page="prev">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
    `;
  paginationContainer.innerHTML += prevBtn;

  for (let i = 1; i <= totalPages; i++) {
    const pageItem = `
            <li class="page-item ${i === currentPage ? "active" : ""}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    paginationContainer.innerHTML += pageItem;
  }

  const nextBtn = `
        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <a class="page-link" href="#" aria-label="Next" data-page="next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `;
  paginationContainer.innerHTML += nextBtn;

  paginationContainer.querySelectorAll(".page-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetPage = link.dataset.page;

      if (targetPage === "prev" && currentPage > 1) {
        currentPage--;
      } else if (targetPage === "next" && currentPage < totalPages) {
        currentPage++;
      } else if (!isNaN(targetPage)) {
        currentPage = parseInt(targetPage);
      }

      renderProducts(currentPage);
      updatePaginationUI();
    });
  });
}

function updatePaginationUI() {
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const pageItems = paginationContainer.querySelectorAll(".page-item");

  pageItems.forEach((item, index) => {
    if (index === 0 || index === pageItems.length - 1) return;

    const pageNum = index;
    item.classList.toggle("active", pageNum === currentPage);
  });

  pageItems[0].classList.toggle("disabled", currentPage === 1);
  pageItems[pageItems.length - 1].classList.toggle(
    "disabled",
    currentPage === totalPages
  );
}

window.resetFilters = function () {
  genderCheckboxes.forEach((checkbox) => (checkbox.checked = false));
  priceCheckboxes.forEach((checkbox) => (checkbox.checked = false));

  sortBySelect.value = "featured";

  filteredProducts = [...allProducts];
  currentPage = 1;
  renderProducts(currentPage);
  renderPagination();
};

function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();

  filteredProducts = allProducts.filter((product) => {
    return (
      product.Title.toLowerCase().includes(searchTerm) ||
      product.shortdescription.toLowerCase().includes(searchTerm)
    );
  });

  currentPage = 1;
  renderProducts(currentPage);
  renderPagination();
}

function setupEventListeners() {
  searchInput.addEventListener("input", handleSearch);
  window.addEventListener("scroll", handleScroll);
}

function setupProductClickHandlers() {
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("a, button")) return;

      const productId = card.dataset.id;
      window.location.href = `product.html?id=${productId}`;
    });
  });
}

renderProducts(currentPage);
setupProductClickHandlers();
