const products = [
    { id: 1, name: "Nike Air Max 2025", price: 250000, oldPrice: 299999, discount: 17, rating: "★★★★★", image: "nikeairmax.png" },
    { id: 2, name: "Adidas Ultraboost", price: 230000, oldPrice: 269999, discount: 15, rating: "★★★★★", image: "adidasultraboost.png" },
    { id: 3, name: "Jordan Retro 4", price: 280000, oldPrice: 329999, discount: 15, rating: "★★★★★", image: "jordan4.png" },
    { id: 4, name: "New Balance 990v6", price: 195000, oldPrice: 229999, discount: 15, rating: "★★★★★", image: "newbalance990.png" },
    { id: 5, name: "Yeezy Slide", price: 89000, oldPrice: 119999, discount: 26, rating: "★★★★★", image: "yeezyslide.png" },
    { id: 6, name: "Crocs Classic", price: 45000, oldPrice: 59999, discount: 25, rating: "★★★★★", image: "crocs.png" },
    { id: 7, name: "Nike Dunk Low", price: 165000, oldPrice: 189999, discount: 13, rating: "★★★★★", image: "nikedunk.png" },
    { id: 8, name: "Adidas Samba OG", price: 155000, oldPrice: 179999, discount: 14, rating: "★★★★★", image: "adidassamba.png" }
];

let cart = [];

// ========== ANIMATED COUNTERS ==========
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.innerText = Math.floor(target).toLocaleString();
            clearInterval(timer);
        } else {
            element.innerText = Math.floor(start).toLocaleString();
        }
    }, 16);
}

// Start counters when the section is visible
function startCounters() {
    const counters = document.querySelectorAll('.rating-number');
    const targets = [4.91, 4.85, 4.95];
    
    counters.forEach((counter, index) => {
        // Check if counter is visible
        const rect = counter.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !counter.hasAttribute('data-animated')) {
            counter.setAttribute('data-animated', 'true');
            animateCounter(counter, targets[index], 2000);
        }
    });
}

// ========== PRODUCT FUNCTIONS ==========
function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-img">
                <img src="${p.image}" class="product-image" onerror="this.src='https://placehold.co/150x150/1a1a1a/c9a03d?text=Shoe'">
            </div>
            <div class="product-info">
                <div class="product-title">${p.name}</div>
                <div class="product-price">
                    MWK ${p.price.toLocaleString()}
                    <span class="old-price">MWK ${p.oldPrice.toLocaleString()}</span>
                </div>
                <div class="product-rating">${p.rating} (4.5)</div>
                <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(i => i.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('overlay').classList.add('show');
}

function updateCart() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').innerText = count;
    
    const container = document.getElementById('cartItemsList');
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#888;">Your bag is empty</p>';
        document.getElementById('cartTotalPrice').innerText = 'MWK 0';
        return;
    }
    
    let total = 0;
    container.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="cart-item">
                <div><strong>${item.name}</strong> x${item.quantity}<br><small>MWK ${item.price.toLocaleString()}</small></div>
                <div>MWK ${itemTotal.toLocaleString()}</div>
                <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
    }).join('');
    
    document.getElementById('cartTotalPrice').innerText = `MWK ${total.toLocaleString()}`;
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const index = cart.findIndex(i => i.id === id);
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
            updateCart();
        });
    });
}

// ========== EVENT LISTENERS ==========
document.getElementById('closeCartBtn')?.addEventListener('click', () => {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('show');
});

document.getElementById('overlay')?.addEventListener('click', () => {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('show');
});

document.querySelector('.cart-icon')?.addEventListener('click', () => {
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('overlay').classList.add('show');
});

// Start counters when page loads and on scroll
window.addEventListener('load', () => {
    renderProducts();
    startCounters();
});

window.addEventListener('scroll', () => {
    startCounters();
});

// Initialize
renderProducts();