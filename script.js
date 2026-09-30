const products = [
  {
    id: "espresso",
    name: "Classic Espresso",
    category: "Coffee",
    description:
      "Rich and bold espresso shot, the perfect foundation for any coffee lover.",
    price: 3.5,
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "cappuccino",
    name: "Heritage Cappuccino",
    category: "Coffee",
    description:
      "Traditional cappuccino with velvety steamed milk and perfect foam.",
    price: 4.5,
    image:
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "latte",
    name: "Artisan Latte",
    category: "Coffee",
    description:
      "Smooth espresso with expertly steamed milk and beautiful latte art.",
    price: 4.75,
    image:
      "https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "americano",
    name: "Signature Americano",
    category: "Coffee",
    description: "Bright, balanced espresso softened by silky hot water.",
    price: 3.25,
    image:
      "https://images.unsplash.com/photo-1497515114629-f640c541c8f8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "macchiato",
    name: "Caramel Macchiato",
    category: "Coffee",
    description: "Sweet caramel notes wrapped in espresso and steamed milk.",
    price: 5,
    image:
      "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "mocha",
    name: "Mocha",
    category: "Coffee",
    description: "Velvety chocolate and espresso in perfect balance.",
    price: 4.75,
    image:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "tea",
    name: "Green Tea",
    category: "Food",
    description: "A calm, fragrant tea served with a fresh citrus note.",
    price: 3,
    image:
      "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "cake",
    name: "Chocolate Cake",
    category: "Desserts",
    description: "Dense dark chocolate cake with a silky ganache finish.",
    price: 5.5,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "croissant",
    name: "Croissant",
    category: "Food",
    description: "Buttery, flaky pastry baked fresh each morning.",
    price: 3.25,
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
  },
];

let activeCategory = "all";
let cart = JSON.parse(localStorage.getItem("nebo-cart") || "[]");
let theme = localStorage.getItem("nebo-theme") || "light";
let selectedProduct = null;
let selectedQty = 1;

const productGrid = document.getElementById("productGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartToggle = document.getElementById("cartToggle");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const modal = document.getElementById("productModal");
const modalContent = document.getElementById("modalContent");
const modalClose = document.querySelector(".modal-close");
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

function init() {
  applyTheme(theme);
  renderProducts();
  renderCart();
  attachEvents();
}

function attachEvents() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      activeCategory = button.dataset.category;
      renderProducts();
    });
  });

  cartToggle.addEventListener("click", openCart);
  closeCart.addEventListener("click", closeCartPanel);
  cartOverlay.addEventListener("click", closeCartPanel);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCartPanel();
      closeModal();
    }
  });

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal-backdrop")) {
      closeModal();
    }
  });

  themeToggle.addEventListener("click", () => {
    theme = theme === "light" ? "dark" : "light";
    applyTheme(theme);
    localStorage.setItem("nebo-theme", theme);
  });

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
  });
}

function applyTheme(nextTheme) {
  document.body.classList.toggle("dark", nextTheme === "dark");
  const icon = themeToggle.querySelector("i");
  icon.className =
    nextTheme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

function renderProducts() {
  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((item) => item.category === activeCategory);

  productGrid.innerHTML = "";
  filtered.forEach((product, index) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="card-body">
        <div class="card-top">
          <h3>${product.name}</h3>
          <span class="price-tag">$${product.price.toFixed(2)}</span>
        </div>
        <p>${product.description}</p>
        <div class="card-actions">
          <span class="eyebrow">${product.category}</span>
          <button class="add-btn" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    `;

    card.style.animation = `fadeIn 0.35s ease both`;
    card.style.animationDelay = `${index * 70}ms`;
    card.addEventListener("click", (event) => {
      if (event.target.closest(".add-btn")) return;
      openModal(product);
    });

    card.querySelector(".add-btn").addEventListener("click", (event) => {
      event.stopPropagation();
      addToCart(product.id, 1);
    });

    productGrid.appendChild(card);
  });
}

function openModal(product) {
  selectedProduct = product;
  selectedQty = 1;
  modalContent.innerHTML = `
    <div class="modal-content-layout">
      <img src="${product.image}" alt="${product.name}" />
      <div>
        <p class="eyebrow">${product.category}</p>
        <h3 id="modalTitle">${product.name}</h3>
        <p>${product.description}</p>
        <p class="price-tag" style="font-size: 1.2rem; margin-top: 0.8rem;">$${product.price.toFixed(2)}</p>
        <div class="quantity-row">
          <label for="modalQty">Quantity</label>
          <input id="modalQty" type="number" min="1" max="10" value="1" />
        </div>
        <button class="add-btn" id="modalAddBtn">Add to Cart</button>
      </div>
    </div>
  `;

  const quantityInput = document.getElementById("modalQty");
  document.getElementById("modalAddBtn").addEventListener("click", () => {
    addToCart(product.id, Number(quantityInput.value) || 1);
    closeModal();
  });

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function addToCart(productId, quantity) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity });
  }

  localStorage.setItem("nebo-cart", JSON.stringify(cart));
  renderCart();
  openCart();
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML =
      '<div class="empty-state">Your cart is delightfully empty. Add a drink or pastry to begin.</div>';
    subtotalEl.textContent = "$0.00";
    taxEl.textContent = "$0.00";
    totalEl.textContent = "$0.00";
    return;
  }

  cartItems.innerHTML = "";
  let subtotal = 0;

  cart.forEach((entry) => {
    const product = products.find((item) => item.id === entry.id);
    if (!product) return;

    const itemTotal = product.price * entry.quantity;
    subtotal += itemTotal;

    const item = document.createElement("div");
    item.className = "cart-item";
    item.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div style="flex:1;">
        <div class="cart-item-name">${product.name}</div>
        <div>$${product.price.toFixed(2)}</div>
        <div class="quantity-controls">
          <button data-action="decrease" data-id="${product.id}">-</button>
          <span>${entry.quantity}</span>
          <button data-action="increase" data-id="${product.id}">+</button>
          <button data-action="remove" data-id="${product.id}" style="margin-left:0.3rem;">×</button>
        </div>
      </div>
    `;

    cartItems.appendChild(item);
  });

  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  taxEl.textContent = `$${tax.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;

  cartItems.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () =>
      updateCartQuantity(button.dataset.id, button.dataset.action),
    );
  });
}

function updateCartQuantity(productId, action) {
  const entry = cart.find((item) => item.id === productId);
  if (!entry) return;

  if (action === "increase") {
    entry.quantity += 1;
  } else if (action === "decrease") {
    entry.quantity -= 1;
  } else if (action === "remove") {
    cart = cart.filter((item) => item.id !== productId);
  }

  if (entry && entry.quantity <= 0) {
    cart = cart.filter((item) => item.id !== productId);
  }

  localStorage.setItem("nebo-cart", JSON.stringify(cart));
  renderCart();
}

function openCart() {
  cartOverlay.classList.add("open");
  cartSidebar.classList.add("open");
}

function closeCartPanel() {
  cartOverlay.classList.remove("open");
  cartSidebar.classList.remove("open");
}

init();
