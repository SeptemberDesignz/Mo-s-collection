const products = [
    { id: 1, name: "Nike Air Max 2025", price: 250000, oldPrice: 299999, image: "nikeairmax.png" },
    { id: 2, name: "Adidas Ultraboost", price: 230000, oldPrice: 269999, image: "adidasultraboost.png" },
    { id: 3, name: "Jordan Retro 4", price: 280000, oldPrice: 329999, image: "jordan4.png" },
    { id: 4, name: "New Balance 990v6", price: 195000, oldPrice: 229999, image: "newbalance990.png" },
    { id: 5, name: "Yeezy Slide", price: 89000, oldPrice: 119999, image: "yeezyslide.png" },
    { id: 6, name: "Crocs Classic", price: 45000, oldPrice: 59999, image: "crocs.png" },
    { id: 7, name: "Nike Dunk Low", price: 165000, oldPrice: 189999, image: "nikedunk.png" },
    { id: 8, name: "Adidas Samba OG", price: 155000, oldPrice: 179999, image: "adidassamba.png" }
];

let cart = [];

function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-img">
                <img src="${p.image}" class="product-image" onerror="this.src='https://placehold.co/160x160/f8f8f8/c9a03d?text=Shoe'">
            </div>
            <div class="product-info">
                <div class="product-title">${p.name}</div>
                <div class="product-price">
                    MWK ${p.price.toLocaleString()}
                    <span class="old-price">MWK ${p.oldPrice.toLocaleString()}</span>
                </div>
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

// Event Listeners
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

// Initialize
renderProducts();