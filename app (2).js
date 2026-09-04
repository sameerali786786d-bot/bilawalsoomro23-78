// Bilal Mobile Shop - Main JavaScript with Login System (Admin + User)

// ==================== DEFAULT PRODUCTS ====================
const defaultProducts = [
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

// ==================== STATE ====================
let products = [];
let cart = [];
let currentLang = 'en';
let currentUser = null; // { id, name, email, role: 'admin' | 'user' }

// Default users (password is simple for demo)
const defaultUsers = [
  { id: 1, name: "Admin Bilal", email: "admin@bilalmobileshop.com", password: "admin123", role: "admin" },
  { id: 2, name: "Demo User", email: "user@example.com", password: "user123", role: "user" }
];

// ==================== AUTH SYSTEM ====================
function initAuth() {
  // Load users
  let users = JSON.parse(localStorage.getItem('bms_users') || 'null');
  if (!users) {
    users = defaultUsers;
    localStorage.setItem('bms_users', JSON.stringify(users));
  }

  // Load current user
  const saved = localStorage.getItem('bms_currentUser');
  if (saved) {
    currentUser = JSON.parse(saved);
  }

  updateAuthUI();
}

function getUsers() {
  return JSON.parse(localStorage.getItem('bms_users') || '[]');
}

function saveUsers(users) {
  localStorage.setItem('bms_users', JSON.stringify(users));
}

function login(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    return { success: false, message: "Invalid email or password" };
  }
  // Don't store password in currentUser
  currentUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  localStorage.setItem('bms_currentUser', JSON.stringify(currentUser));
  updateAuthUI();
  closeAuthModal();
  showToast(`Welcome back, ${user.name}!`);
  loadCart();
  updateCartUI();
  return { success: true };
}

function register(name, email, password) {
  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, message: "Email already registered" };
  }
  if (password.length < 4) {
    return { success: false, message: "Password must be at least 4 characters" };
  }
  const newUser = {
    id: Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    role: "user"   // only users can register, admin is fixed
  };
  users.push(newUser);
  saveUsers(users);
  // Auto login
  currentUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
  localStorage.setItem('bms_currentUser', JSON.stringify(currentUser));
  updateAuthUI();
  closeAuthModal();
  showToast("Account created successfully!");
  loadCart();
  updateCartUI();
  return { success: true };
}

function logout() {
  currentUser = null;
  localStorage.removeItem('bms_currentUser');
  cart = [];
  updateAuthUI();
  updateCartUI();
  closeAdminPanel();
  showToast("Logged out successfully");
}

function isAdmin() {
  return currentUser && currentUser.role === 'admin';
}

function isLoggedIn() {
  return !!currentUser;
}

// ==================== AUTH UI ====================
function updateAuthUI() {
  const loginBtn = document.getElementById('loginBtn');
  const userMenu = document.getElementById('userMenu');
  const adminBtn = document.getElementById('adminBtn');
  const userNameEl = document.getElementById('userName');
  const userRoleEl = document.getElementById('userRole');

  if (isLoggedIn()) {
    if (loginBtn) loginBtn.classList.add('hidden');
    if (userMenu) userMenu.classList.remove('hidden');
    if (userNameEl) userNameEl.textContent = currentUser.name;
    if (userRoleEl) {
      userRoleEl.textContent = currentUser.role === 'admin' ? 'Admin' : 'Customer';
      userRoleEl.className = currentUser.role === 'admin' 
        ? 'text-xs px-2 py-0.5 rounded-full bg-secondary text-white' 
        : 'text-xs px-2 py-0.5 rounded-full bg-green-500 text-white';
    }
    if (adminBtn) {
      adminBtn.classList.toggle('hidden', !isAdmin());
    }
  } else {
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (userMenu) userMenu.classList.add('hidden');
    if (adminBtn) adminBtn.classList.add('hidden');
  }
  // Re-render products so admin edit buttons appear
  renderProducts();
}

function openAuthModal(mode = 'login') {
  const modal = document.getElementById('authModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  switchAuthTab(mode);
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
  // Clear forms
  document.getElementById('loginForm')?.reset();
  document.getElementById('registerForm')?.reset();
  document.getElementById('loginError')?.classList.add('hidden');
  document.getElementById('registerError')?.classList.add('hidden');
}

function switchAuthTab(mode) {
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const authTitle = document.getElementById('authTitle');

  if (mode === 'login') {
    loginTab?.classList.add('border-secondary', 'text-secondary');
    loginTab?.classList.remove('border-transparent', 'text-gray-500');
    registerTab?.classList.remove('border-secondary', 'text-secondary');
    registerTab?.classList.add('border-transparent', 'text-gray-500');
    loginForm?.classList.remove('hidden');
    registerForm?.classList.add('hidden');
    if (authTitle) authTitle.textContent = 'Login';
  } else {
    registerTab?.classList.add('border-secondary', 'text-secondary');
    registerTab?.classList.remove('border-transparent', 'text-gray-500');
    loginTab?.classList.remove('border-secondary', 'text-secondary');
    loginTab?.classList.add('border-transparent', 'text-gray-500');
    registerForm?.classList.remove('hidden');
    loginForm?.classList.add('hidden');
    if (authTitle) authTitle.textContent = 'Create Account';
  }
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');

  const result = login(email, password);
  if (!result.success) {
    if (errorEl) {
      errorEl.textContent = result.message;
      errorEl.classList.remove('hidden');
    }
  }
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const errorEl = document.getElementById('registerError');

  const result = register(name, email, password);
  if (!result.success) {
    if (errorEl) {
      errorEl.textContent = result.message;
      errorEl.classList.remove('hidden');
    }
  }
}

// ==================== PRODUCTS ====================
function loadProducts() {
  const saved = localStorage.getItem('bms_products');
  if (saved) {
    products = JSON.parse(saved);
  } else {
    products = [...defaultProducts];
    localStorage.setItem('bms_products', JSON.stringify(products));
  }
}

function saveProducts() {
  localStorage.setItem('bms_products', JSON.stringify(products));
}

function renderProducts(list = products) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  
  if (list.length === 0) {
    grid.innerHTML = '<p class="col-span-full text-center text-gray-500 py-16">No products found</p>';
    return;
  }

  grid.innerHTML = list.map(p => `
    <div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition product-card group">
      <div class="relative">
        <img src="${p.image}" alt="${p.name}" class="w-full h-56 object-cover group-hover:scale-105 transition duration-500" loading="lazy">
        <span class="absolute top-3 left-3 bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-full">${p.badge || 'New'}</span>
        ${isAdmin() ? `
          <div class="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition">
            <button onclick="editProduct(${p.id})" class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs" title="Edit">✏️</button>
            <button onclick="deleteProduct(${p.id})" class="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xs" title="Delete">🗑️</button>
          </div>
        ` : `
          <button class="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:text-red-500" aria-label="Add to wishlist">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </button>
        `}
      </div>
      <div class="p-5">
        <p class="text-xs text-gray-500 mb-1">${p.brand}</p>
        <h3 class="font-semibold text-lg mb-2 line-clamp-2">${p.name}</h3>
        <div class="flex items-center gap-1 mb-3">
          <span class="text-yellow-400 text-sm">${'★'.repeat(Math.floor(p.rating || 4))}${'☆'.repeat(5 - Math.floor(p.rating || 4))}</span>
          <span class="text-xs text-gray-500">(${p.rating || 4})</span>
        </div>
        <div class="flex items-center gap-2 mb-4">
          <span class="text-xl font-bold text-secondary">Rs. ${Number(p.price).toLocaleString()}</span>
          ${p.oldPrice ? `<span class="text-sm text-gray-400 line-through">Rs. ${Number(p.oldPrice).toLocaleString()}</span>` : ''}
        </div>
        <button onclick="addToCart(${p.id})" class="w-full bg-primary hover:bg-secondary text-white py-2.5 rounded-xl font-medium transition">
          Add to Cart
        </button>
      </div>
    </div>
  `).join('');
}

// ==================== CART ====================
function addToCart(id) {
  if (!isLoggedIn()) {
    openAuthModal('login');
    showToast("Please login to add items to cart");
    return;
  }

  const product = products.find(p => p.id === id);
  if (!product) return;
  
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  updateCartUI();
  
  // Small feedback
  const btn = event?.target;
  if (btn) {
    const originalText = btn.textContent;
    btn.textContent = 'Added!';
    btn.classList.add('bg-green-600');
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove('bg-green-600');
    }, 1000);
  }
}

function loadCart() {
  if (!currentUser) {
    cart = [];
    return;
  }
  const key = `bms_cart_${currentUser.id}`;
  cart = JSON.parse(localStorage.getItem(key) || '[]');
}

function saveCart() {
  if (!currentUser) return;
  const key = `bms_cart_${currentUser.id}`;
  localStorage.setItem(key, JSON.stringify(cart));
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
          <p class="text-secondary font-semibold">Rs. ${Number(item.price).toLocaleString()}</p>
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
    saveCart();
    updateCartUI();
  }
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function openCart() {
  if (!isLoggedIn()) {
    openAuthModal('login');
    showToast("Please login to view cart");
    return;
  }
  document.getElementById('cartSidebar').classList.remove('translate-x-full');
  document.getElementById('cartOverlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartSidebar').classList.add('translate-x-full');
  document.getElementById('cartOverlay').classList.add('hidden');
  document.body.style.overflow = '';
}

function checkout() {
  if (cart.length === 0) {
    showToast("Cart is empty");
    return;
  }
  showToast("Order placed successfully! (Demo) We will contact you soon.");
  cart = [];
  saveCart();
  updateCartUI();
  closeCart();
}

// ==================== FILTERS & SEARCH ====================
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

// ==================== ADMIN PANEL ====================
function openAdminPanel() {
  if (!isAdmin()) {
    showToast("Admin access only");
    return;
  }
  document.getElementById('adminPanel')?.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  renderAdminProducts();
}

function closeAdminPanel() {
  document.getElementById('adminPanel')?.classList.add('hidden');
  document.body.style.overflow = '';
  // Reset form
  document.getElementById('productForm')?.reset();
  document.getElementById('productId').value = '';
  document.getElementById('formTitle').textContent = 'Add New Product';
  document.getElementById('submitBtn').textContent = 'Add Product';
}

function renderAdminProducts() {
  const tbody = document.getElementById('adminProductList');
  if (!tbody) return;

  tbody.innerHTML = products.map(p => `
    <tr class="border-b dark:border-gray-700">
      <td class="py-3 px-2">
        <img src="${p.image}" class="w-12 h-12 object-cover rounded" alt="">
      </td>
      <td class="py-3 px-2 font-medium">${p.name}</td>
      <td class="py-3 px-2">${p.brand}</td>
      <td class="py-3 px-2">Rs. ${Number(p.price).toLocaleString()}</td>
      <td class="py-3 px-2">
        <button onclick="editProduct(${p.id})" class="text-blue-500 hover:underline mr-3">Edit</button>
        <button onclick="deleteProduct(${p.id})" class="text-red-500 hover:underline">Delete</button>
      </td>
    </tr>
  `).join('');
}

function handleProductForm(e) {
  e.preventDefault();
  if (!isAdmin()) return;

  const id = document.getElementById('productId').value;
  const name = document.getElementById('pName').value.trim();
  const brand = document.getElementById('pBrand').value.trim();
  const price = Number(document.getElementById('pPrice').value);
  const oldPrice = Number(document.getElementById('pOldPrice').value) || null;
  const rating = Number(document.getElementById('pRating').value) || 4.5;
  const image = document.getElementById('pImage').value.trim() || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop';
  const badge = document.getElementById('pBadge').value.trim() || 'New';

  if (!name || !brand || !price) {
    showToast("Please fill required fields");
    return;
  }

  if (id) {
    // Edit
    const idx = products.findIndex(p => p.id === Number(id));
    if (idx !== -1) {
      products[idx] = { ...products[idx], name, brand, price, oldPrice, rating, image, badge };
      showToast("Product updated");
    }
  } else {
    // Add
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    products.push({ id: newId, name, brand, price, oldPrice, rating, image, badge });
    showToast("Product added");
  }

  saveProducts();
  renderProducts();
  renderAdminProducts();
  document.getElementById('productForm').reset();
  document.getElementById('productId').value = '';
  document.getElementById('formTitle').textContent = 'Add New Product';
  document.getElementById('submitBtn').textContent = 'Add Product';
}

function editProduct(id) {
  if (!isAdmin()) return;
  const p = products.find(x => x.id === id);
  if (!p) return;

  openAdminPanel();
  document.getElementById('productId').value = p.id;
  document.getElementById('pName').value = p.name;
  document.getElementById('pBrand').value = p.brand;
  document.getElementById('pPrice').value = p.price;
  document.getElementById('pOldPrice').value = p.oldPrice || '';
  document.getElementById('pRating').value = p.rating || 4.5;
  document.getElementById('pImage').value = p.image;
  document.getElementById('pBadge').value = p.badge || '';
  document.getElementById('formTitle').textContent = 'Edit Product';
  document.getElementById('submitBtn').textContent = 'Update Product';
}

function deleteProduct(id) {
  if (!isAdmin()) return;
  if (!confirm('Are you sure you want to delete this product?')) return;
  products = products.filter(p => p.id !== id);
  saveProducts();
  renderProducts();
  renderAdminProducts();
  showToast("Product deleted");
}

// ==================== MISC ====================
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  document.getElementById('moonIcon')?.classList.toggle('hidden', isDark);
  document.getElementById('sunIcon')?.classList.toggle('hidden', !isDark);
  localStorage.setItem('darkMode', isDark ? 'true' : 'false');
}

function loadDarkMode() {
  if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
    document.getElementById('moonIcon')?.classList.add('hidden');
    document.getElementById('sunIcon')?.classList.remove('hidden');
  }
}

function toggleMobileMenu() {
  document.getElementById('mobileMenu')?.classList.toggle('hidden');
}

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ur' : 'en';
  const langText = document.getElementById('langText');
  if (langText) {
    langText.textContent = currentLang === 'en' ? 'اردو' : 'English';
  }
}

function showToast(msg) {
  // Simple toast
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg z-[60] transition-all duration-300 opacity-0';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.remove('opacity-0');
  toast.classList.add('opacity-100');
  setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0');
  }, 2500);
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  initAuth();
  loadCart();
  renderProducts();
  updateCartUI();
  loadDarkMode();
  setupSearch();
  
  // Event listeners
  document.getElementById('brandFilter')?.addEventListener('change', filterProducts);
  document.getElementById('sortFilter')?.addEventListener('change', filterProducts);
  
  document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
  document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
  document.getElementById('productForm')?.addEventListener('submit', handleProductForm);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      closeAuthModal();
      closeAdminPanel();
    }
  });
});
