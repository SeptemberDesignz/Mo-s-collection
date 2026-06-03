const products = [
    { id: 1, name: "Adidas Samba", price: 35000, oldPrice: 40000, image: "adidas Samba.jpg" },
    { id: 2, name: "Black Heels", price: 38000, oldPrice: 43000, image: "Black look_Shoes_.jpg" },
    { id: 3, name: "Men Palm Slipper", price: 28000, oldPrice: 32999, image: "Men palm slipper.jpg" },
    { id: 4, name: "Penny Lug Sole Loafer", price: 19500, oldPrice: 22999, image: "penny.jpg" },
    { id: 5, name: "crocs", price: 9000, oldPrice: 11999, image: "crocs.jpeg" },
    { id: 6, name: "Heels Type(S)", price: 45000, oldPrice: 59999, image: "Heels2.jpeg" },
    { id: 7, name: "Kids Decent Shoe", price: 35000, oldPrice: 39999, image: "kids1.jpeg" },
    { id: 8, name: "Women Slides", price: 15000, oldPrice: 19999, image: "Women Slide3.jpeg" }
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