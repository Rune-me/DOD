const productsDiv = document.getElementById("products");
const params = new URLSearchParams(window.location.search);
const category = params.get("cat"); // make sure URL has ?cat=someCategory
const titleEl = document.getElementById("title");

// Paste your Web App URL here
const PRODUCTS_API_URL = "https://script.google.com/macros/s/AKfycbwrxSzJ7rnPqhAfOry3FDnhDDzZpAco939CNGloiAJUzWMhIDakgTztQKLX4d56AgvttQ/exec";

if (titleEl && category) {
  titleEl.innerText = category.toUpperCase();
}

if (!productsDiv) {
  console.error("Products container not found");
} else {
  fetch(PRODUCTS_API_URL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    })
    .then(data => {
      // Debug: log data
      console.log("All products:", data);

      const filtered = data.filter(
        p => p.category.toLowerCase() === category.toLowerCase()
      );

      // Debug: log filtered products
      console.log("Filtered products:", filtered);

      if (filtered.length === 0) {
        productsDiv.innerHTML = "<p>No products found in this category.</p>";
        return;
      }

      filtered.forEach(product => {
        const buyButtonHTML = product.stock === 0
          ? `<button class="view-btn" disabled style="background: gray; cursor: not-allowed;">Out of Stock</button>`
          : `<button class="view-btn">View Details</button>`;

        const productHTML = `
          <div class="product-card" onclick="openProduct(${product.id})">
            <img src="${product.image1}" alt="${product.name}">
            <div class="product-info">
              <h3>${product.name}</h3>
              <div class="price">₹${product.price}</div>
              ${buyButtonHTML}
            </div>
          </div>
        `;
        productsDiv.innerHTML += productHTML;
      });
    })
    .catch(err => {
      console.error("Error loading products:", err);
      productsDiv.innerHTML = "<p>Failed to load products.</p>";
    });
}

function openProduct(id) {
  window.location.href = `product.html?id=${id}`;
}
