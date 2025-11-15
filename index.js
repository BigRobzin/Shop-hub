// Product Images
const images = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&h=800&fit=crop'
];


// App State

let selectedSize = 'M';
let selectedColor = 'Black';
let quantity = 1;
let cart = [];


// Image Handling
function changeImage(index) {
  if (typeof index !== 'number' || index < 0 || index >= images.length) return;
  const mainImg = document.getElementById('main-img');
  // if we have a main image element, animate swap: fade out -> change src -> fade in
  if (mainImg) {
    mainImg.classList.add('fade-out');
    setTimeout(() => {
      mainImg.src = images[index];
      // This reforce reflow then remove the class so it fades back in
      void mainImg.offsetWidth;
      mainImg.classList.remove('fade-out');
    }, 180);
  }

  const thumbnails = document.querySelectorAll('.thumbnail');
  thumbnails.forEach(t => t.classList.remove('active'));
  if (thumbnails[index]) thumbnails[index].classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const thumbs = document.querySelectorAll('.thumbnail');
  thumbs.forEach((t, i) => {
    t.removeEventListener('click', t._boundClick);
    const bound = () => changeImage(i);
    t.addEventListener('click', bound);
    // keep a reference so we can avoid duplicate listeners if this runs again
    t._boundClick = bound;
  });
});

// Option Selection

function selectSize(btn, size) {
  document.querySelectorAll('#size-options .option-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedSize = size;
}

function selectColor(btn, color) {
  document.querySelectorAll('#color-options .option-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedColor = color;
}

// Quantity Management

function changeQuantity(change) {
  quantity = Math.max(1, quantity + change);
  document.getElementById('quantity').textContent = quantity;
}

// Cart Management
function addToCart() {
  const item = {
    id: Date.now(),
    name: 'Premium Wireless Headphones',
    price: 299.99,
    size: selectedSize,
    color: selectedColor,
    quantity: quantity,
    // Use whatever image is currently displayed as the product image
    image: (document.getElementById('main-img') || {}).src || images[0]
  };

  cart.push(item);
  updateCart();

  //  Button feedback animation
  const btn = document.getElementById('add-cart-btn');
  btn.textContent = '✓ Added to Cart!';
  btn.classList.add('added');

  setTimeout(() => {
    btn.textContent = '🛒 Add to Cart';
    btn.classList.remove('added');
  }, 2000);

  // Reset quantity
  quantity = 1;
  document.getElementById('quantity').textContent = quantity;
}

// Cart Sidebar

function toggleCart() {
  document.getElementById('cart-overlay').classList.toggle('active');
  document.getElementById('cart-sidebar').classList.toggle('active');
}

// Cart Display Update
function updateCart() {
  document.getElementById('cart-count').textContent = cart.length;

  // Empty cart state
  if (cart.length === 0) {
    document.getElementById('cart-content').innerHTML = `
      <div class="empty-cart">Your cart is empty</div>
    `;
    return;
  }

  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Generate HTML for cart items
  let html = '<div class="cart-items">';
  cart.forEach(item => {
    html += `
      <div class="cart-item">
        <div class="cart-item-content">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-info">${item.color} • ${item.size}</div>
            <div class="cart-item-price">$${item.price}</div>
          </div>
        </div>
        <div class="cart-item-controls">
          <div class="cart-quantity-controls">
            <button class="cart-quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">−</button>
            <span>${item.quantity}</span>
            <button class="cart-quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
          </div>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    `;
  });
  html += '</div>';

  // Add total and checkout button
  html += `
    <div class="cart-total">
      <div class="total-row">
        <span class="total-label">Total</span>
        <span class="total-amount">$${total.toFixed(2)}</span>
      </div>
      <button class="checkout-btn">Checkout</button>
    </div>
  `;

  document.getElementById('cart-content').innerHTML = html;
}

// Update Item Quantity
function updateCartQuantity(id, change) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity = Math.max(1, item.quantity + change);
    updateCart();
  }
}

// Remove Item from Cart
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCart();
}
