// Product catalog (Apple only)
const products = [
    { id: 1, name: "iPhone 15 Pro", price: 1250000, oldPrice: 1399999, discount: 11, cashback: "5% cashback", icon: "📱", category: "phone" },
    { id: 2, name: "iPhone 15 Pro Max", price: 1450000, oldPrice: 1599999, discount: 9, cashback: "5% cashback", icon: "📱", category: "phone" },
    { id: 3, name: "AirPods Pro 2", price: 329000, oldPrice: 399000, discount: 18, cashback: "3% cashback", icon: "🎧", category: "audio" },
    { id: 4, name: "Apple Watch Series 9", price: 499000, oldPrice: 549000, discount: 9, cashback: "4% cashback", icon: "⌚", category: "watch" },
    { id: 5, name: "MacBook Air M2", price: 1650000, oldPrice: 1899000, discount: 13, cashback: "5% cashback", icon: "💻", category: "mac" },
    { id: 6, name: "iPad Pro 11-inch", price: 899000, oldPrice: 999000, discount: 10, cashback: "4% cashback", icon: "📱", category: "ipad" },
    { id: 7, name: "MacBook Pro 14", price: 2299000, oldPrice: 2599000, discount: 12, cashback: "5% cashback", icon: "💻", category: "mac" },
    { id: 8, name: "AirPods Max", price: 599000, oldPrice: 679000, discount: 12, cashback: "3% cashback", icon: "🎧", category: "audio" }
];

let cart = [];

// Render product grid
function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-img">${product.icon}</div>
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-price">
                    MWK ${product.price.toLocaleString()}
                    ${product.oldPrice ? `<span class="old-price">MWK ${product.oldPrice.toLocaleString()}</span>` : ''}
                    ${product.discount ? `<span class="discount-badge">-${product.discount}%</span>` : ''}
                </div>
                <div class="cashback">💰 ${product.cashback}</div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `).join('');

    // Attach event listeners to all 'Add to Cart' buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.getAttribute('data-id'));
            addToCart(id);
        });
    });
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    openCartSidebar();
}

// Update cart UI (count, items, total)
function updateCartUI() {
    const cartCountSpan = document.getElementById('cartCount');
    const cartItemsContainer = document.getElementById('cartItemsList');
    const cartTotalSpan = document.getElementById('cartTotalPrice');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountSpan) cartCountSpan.innerText = totalItems;

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg" style="text-align:center; padding: 24px;">Your bag is empty</p>';
        if (cartTotalSpan) cartTotalSpan.innerText = 'MWK 0';
        return;
    }

    let totalPrice = 0;
    cartItemsContainer.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        return `
            <div class="cart-item">
                <div class="cart-item-details">
                    <p>${item.name} <span style="font-size:0.75rem;">x${item.quantity}</span></p>
                    <small>MWK ${item.price.toLocaleString()}</small>
                </div>
                <div class="cart-item-price">MWK ${itemTotal.toLocaleString()}</div>
                <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
    }).join('');

    if (cartTotalSpan) cartTotalSpan.innerText = `MWK ${totalPrice.toLocaleString()}`;

    // Remove item listeners
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.getAttribute('data-id'));
            removeFromCart(id);
        });
    });
}

function removeFromCart(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
    }
    updateCartUI();
    if (cart.length === 0 && document.getElementById('cartSidebar').classList.contains('open')) {
        // keep sidebar but update empty state
    }
}

// Sidebar logic
function openCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('show');
}

function closeCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
}

// Event listeners when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();

    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) cartIcon.addEventListener('click', openCartSidebar);

    const closeBtn = document.getElementById('closeCartBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeCartSidebar);

    const overlay = document.getElementById('overlay');
    if (overlay) overlay.addEventListener('click', closeCartSidebar);
});