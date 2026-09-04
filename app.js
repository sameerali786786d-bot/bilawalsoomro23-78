// Bilal Mobile Shop - Main JavaScript

// Sample Products Data (Realistic Pakistani market prices - Aug 2026)
const products = [
  { 
    id: 1, 
    name: "Samsung Galaxy A55 5G", 
    brand: "Samsung", 
    price: 112999, 
    oldPrice: 124999, 
    rating: 4.7, 
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop", 
    badge: "15% OFF" 
  },
  { 
    id: 2, 
    name: "iPhone 15 128GB", 
    brand: "Apple", 
    price: 234999, 
    oldPrice: 249999, 
    rating: 4.9, 
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop", 
    badge: "Hot" 
  },
  { 
    id: 3, 
    name: "Xiaomi Redmi Note 13 Pro", 
    brand: "Xiaomi", 
    price: 74999, 
    oldPrice: 84999, 
    rating: 4.6, 
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop", 
    badge: "12% OFF" 
  },
  { 
    id: 4, 
    name: "Oppo Reno 12F", 
    brand: "Oppo", 
    price: 89999, 
    oldPrice: 99999, 
    rating: 4.5, 
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop", 
    badge: "New" 
  },
  { 
    id: 5, 
    name: "Vivo V40e", 
    brand: "Vivo", 
    price: 79999, 
    oldPrice: 89999, 
    rating: 4.4, 
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop", 
    badge: "11% OFF" 
  },
  { 
    id: 6, 
    name: "Realme 12 Pro+", 
    brand: "Realme", 
    price: 94999, 
    oldPrice: 104999, 
    rating: 4.6, 
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff93?w=400&h=400&fit=crop", 
    badge: "Sale" 
  },
  { 
    id: 7, 
    name: "Infinix Note 40 Pro", 
    brand: "Infinix", 
    price: 54999, 
    oldPrice: 62999, 
    rating: 4.3, 
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop", 
    badge: "13% OFF" 
  },
  { 
    id: 8, 
    name: "Tecno Camon 30", 
    brand: "Tecno", 
    price: 49999, 
    oldPrice: 56999, 
    rating: 4.2, 
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop", 
    badge: "Best Value" 
  }
];

let cart = [];
let currentLang = 'en';

// Render Products
function renderProducts(list = products) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  
  grid.innerHTML = list.map(p => `
    <div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition product-card group">
      <div class="relative">
        <img src="${p.image}" alt="${p.name}" class="w-full h-56 object-cover group-hover:scale-105 transition duration-500" loading="lazy">
        <span class="absolute top-3 left-3 bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-full">${p.badge}</span>
        <button class="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:text-red-500" aria-label="Add to wishlist">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
        </button>
      </div>
      <div class="p-5">
        <p class="text-xs text-gray-500 mb-1">${p.brand}</p>
        <h3 class="font-semibold text-lg mb-2 line-clamp-2">${p.name}</h3>
        <div class="flex items-center gap-1 mb-3">
          <span class="text-yellow-400 text-sm">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))}</span>
          <span class="text-xs text-gray-500">(${p.rating})</span>
        </div>
        <div class="flex items-center gap-2 mb-4">
          <span class="text-xl font-bold text-secondary">Rs. ${p.price.toLocaleString()}</span>
          <span class="text-sm text-gray-400 line-through">Rs. ${p.oldPrice.toLocaleString()}</span>
        </div>
        <button onclick="addToCart(${p.id})" class="w-full bg-primary hover:bg-secondary text-white py-2.5 rounded-xl font-medium transition">
          Add to Cart
        </button>
      </div>
    </div>
  `).join('');
}

// Cart Functions
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
  
  // Small feedback
  const btn = event.target;
  const originalText = btn.textContent;
  btn.textContent = 'Added!';
  btn.classList.add('bg-green-600');
  setTimeout(() => {
    btn.textContent = originalText;
    btn.classList.remove('bg-green-600');
  }, 1000);
}

function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) cartCountEl.textContent = count;

  const cartItems = document.getElementById('cartItems');
  if (!cartItems) return;
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="text-center text-gray-500 py-10">Your cart is empty</p>';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="flex gap-4">
        <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg">
        <div class="flex-1">
          <h4 class="font-medium text-sm">${item.name}</h4>
          <p class="text-secondary font-semibold">Rs. ${item.price.toLocaleString()}</p>
          <div class="flex items-center gap-3 mt-2">
            <button onclick="changeQty(${item.id}, -1)" class="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700">-</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${item.id}, 1)" class="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700">+</button>
          </div>
        </div>
        <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700 self-start" aria-label="Remove item">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>
    `).join('');
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartTotalEl = document.getElementById('cartTotal');
  if (cartTotalEl) cartTotalEl.textContent = `Rs. ${total.toLocaleString()}`;
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    updateCartUI();
  }
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
}

function openCart() {
  document.getElementById('cartSidebar').classList.remove('translate-x-full');
  document.getElementById('cartOverlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartSidebar').classList.add('translate-x-full');
  document.getElementById('cartOverlay').classList.add('hidden');
  document.body.style.overflow = '';
}

// Filters
function filterProducts() {
  let filtered = [...products];
  const brand = document.getElementById('brandFilter')?.value;
  const sort = document.getElementById('sortFilter')?.value;

  if (brand) filtered = filtered.filter(p => p.brand === brand);

  if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'newest') filtered = filtered.slice().reverse();

  renderProducts(filtered);
}

// Search
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (!query) {
        filterProducts();
        return;
      }
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.brand.toLowerCase().includes(query)
      );
      renderProducts(filtered);
    });
  }
}

// Dark Mode
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  document.getElementById('moonIcon')?.classList.toggle('hidden', isDark);
  document.getElementById('sunIcon')?.classList.toggle('hidden', !isDark);
  
  // Save preference
  localStorage.setItem('darkMode', isDark ? 'true' : 'false');
}

// Load dark mode preference
function loadDarkMode() {
  if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
    document.getElementById('moonIcon')?.classList.add('hidden');
    document.getElementById('sunIcon')?.classList.remove('hidden');
  }
}

// Mobile Menu
function toggleMobileMenu() {
  document.getElementById('mobileMenu')?.classList.toggle('hidden');
}

// Language Toggle (basic demo - expands easily)
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ur' : 'en';
  const langText = document.getElementById('langText');
  if (langText) {
    langText.textContent = currentLang === 'en' ? 'اردو' : 'English';
  }
  // Note: Full Urdu translation can be added later with a translations object
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  loadDarkMode();
  setupSearch();
  
  // Event listeners for filters
  document.getElementById('brandFilter')?.addEventListener('change', filterProducts);
  document.getElementById('sortFilter')?.addEventListener('change', filterProducts);
  
  // Close cart on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });
});
