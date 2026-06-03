// Product catalog - Shoes
const products = [
    { id: 1, name: "Nike Air Max 2025", price: 250000, oldPrice: 299999, discount: 17, cashback: "5% cashback", category: "men", image: "nikeairmax.png" },
    { id: 2, name: "Adidas Ultraboost", price: 230000, oldPrice: 269999, discount: 15, cashback: "5% cashback", category: "men", image: "adidasultraboost.png" },
    { id: 3, name: "Jordan Retro 4", price: 280000, oldPrice: 329999, discount: 15, cashback: "3% cashback", category: "men", image: "jordan4.png" },
    { id: 4, name: "New Balance 990v6", price: 195000, oldPrice: 229999, discount: 15, cashback: "4% cashback", category: "men", image: "newbalance990.png" },
    { id: 5, name: "Yeezy Slide", price: 89000, oldPrice: 119999, discount: 26, cashback: "5% cashback", category: "slides", image: "yeezyslide.png" },
    { id: 6, name: "Crocs Classic", price: 45000, oldPrice: 59999, discount: 25, cashback: "4% cashback", category: "casual", image: "crocs.png" },
    { id: 7, name: "Nike Dunk Low", price: 165000, oldPrice: 189999, discount: 13, cashback: "5% cashback", category: "men", image: "nikedunk.png" },
    { id: 8, name: "Adidas Samba OG", price: 155000, oldPrice: 179999, discount: 14, cashback: "3% cashback", category: "men", image: "adidassamba.png" }
];

let cart = [];

// Render product grid
function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}" class="product-image">
            </div>
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

// Update cart UI
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
}

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

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();

    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) cartIcon.addEventListener('click', openCartSidebar);

    const closeBtn = document.getElementById('closeCartBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeCartSidebar);

    const overlay = document.getElementById('overlay');
    if (overlay) overlay.addEventListener('click', closeCartSidebar);
});