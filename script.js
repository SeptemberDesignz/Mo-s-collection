const products = [
    { id: 1, name: "Adidas Samba", price: 35000, oldPrice: 40000, image: "adidas Samba.jpg", category: "men", tags: ["sport","new"], description: "Classic Adidas Samba sneakers. Perfect for everyday wear." },
    { id: 2, name: "Black Heels", price: 38000, oldPrice: 43000, image: "Black look_Shoes_.jpg", category: "women", tags: ["women","sale"], description: "Elegant black heels for formal occasions." },
    { id: 3, name: "Men Palm Slipper", price: 28000, oldPrice: 32999, image: "Men palm slipper.jpg", category: "men", tags: ["men"], description: "Comfortable palm slippers for casual wear." },
    { id: 4, name: "Penny Lug Sole Loafer", price: 19500, oldPrice: 22999, image: "penny.jpg", category: "men", tags: ["men","new"], description: "Classic penny loafers with lug sole." },
    { id: 5, name: "crocs", price: 9000, oldPrice: 11999, image: "crocs.jpeg", category: "kids", tags: ["kids","sport"], description: "Lightweight and comfortable crocs for kids." },
    { id: 6, name: "Heels Type(S)", price: 45000, oldPrice: 59999, image: "Heels2.jpeg", category: "women", tags: ["women","sale"], description: "Stylish statement heels for special events." },
    { id: 7, name: "Kids Decent Shoe", price: 35000, oldPrice: 39999, image: "kids1.jpeg", category: "kids", tags: ["kids"], description: "Quality school shoes for kids." },
    { id: 8, name: "Women Slides", price: 15000, oldPrice: 19999, image: "Women Slide3.jpeg", category: "women", tags: ["women","sale"], description: "Comfortable slides for everyday wear." }
];

let cart = [];
let currentPage = "home";
let searchQuery = "";
let currentProduct = null;
let selectedSize = null;
let modalQuantity = 1;

const sizeOptions = {
    men: ["EU 39", "EU 40", "EU 41", "EU 42", "EU 43", "EU 44"],
    women: ["EU 35", "EU 36", "EU 37", "EU 38", "EU 39", "EU 40"],
    kids: ["EU 28", "EU 29", "EU 30", "EU 31", "EU 32", "EU 33"]
};

function getSizesForProduct(product) {
    if (product.category === "men") return sizeOptions.men;
    if (product.category === "women") return sizeOptions.women;
    return sizeOptions.kids;
}

function showToast(message) {
    let toast = document.getElementById('toastMsg');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastMsg';
        toast.style.cssText = 'position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:#1a1a2e; color:#c9a03d; padding:10px 20px; border-radius:40px; font-size:0.85rem; z-index:2000; opacity:0; transition:opacity 0.3s; pointer-events:none; font-family:sans-serif; white-space:nowrap;';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 2000);
}

function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    currentProduct = product;
    selectedSize = null;
    modalQuantity = 1;
    const modalBody = document.getElementById('modalBody');
    const sizes = getSizesForProduct(product);
    modalBody.innerHTML = `
        <div class="modal-image">
            <img src="${product.image}" onerror="this.src='https://placehold.co/300x300/f8f8f8/c9a03d?text=Shoe'">
        </div>
        <div class="modal-info">
            <h2>${product.name}</h2>
            <div class="modal-price">MWK ${product.price.toLocaleString()} <span style="text-decoration:line-through; color:#999; margin-left:10px;">MWK ${product.oldPrice.toLocaleString()}</span></div>
            <p>${product.description}</p>
            <div class="size-selector"><label>Select Size:</label><div class="size-options">${sizes.map(size => `<button class="size-btn" data-size="${size}">${size}</button>`).join('')}</div></div>
            <div class="quantity-selector"><label>Quantity:</label><div class="quantity-control"><button class="quantity-btn" id="modalQtyMinus">-</button><input type="number" class="quantity-input" id="modalQuantity" value="1" min="1" max="10"><button class="quantity-btn" id="modalQtyPlus">+</button></div></div>
            <button class="modal-add-to-cart" id="modalAddToCartBtn">Add to Cart — MWK ${product.price.toLocaleString()}</button>
        </div>
    `;
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedSize = btn.dataset.size;
        });
    });
    const qtyInput = document.getElementById('modalQuantity');
    document.getElementById('modalQtyMinus')?.addEventListener('click', () => { if (modalQuantity > 1) { modalQuantity--; qtyInput.value = modalQuantity; updateModalPrice(); } });
    document.getElementById('modalQtyPlus')?.addEventListener('click', () => { if (modalQuantity < 10) { modalQuantity++; qtyInput.value = modalQuantity; updateModalPrice(); } });
    qtyInput?.addEventListener('change', (e) => { let val = parseInt(e.target.value); if (isNaN(val) || val < 1) val = 1; if (val > 10) val = 10; modalQuantity = val; qtyInput.value = modalQuantity; updateModalPrice(); });
    document.getElementById('modalAddToCartBtn')?.addEventListener('click', () => { if (!selectedSize) { showToast("Please select a size!"); return; } for (let i = 0; i < modalQuantity; i++) addToCart(product.id); document.getElementById('productModal').classList.remove('show'); showToast(`${modalQuantity}x ${product.name} (${selectedSize}) added!`); });
    document.getElementById('productModal').classList.add('show');
}

function updateModalPrice() {
    const btn = document.getElementById('modalAddToCartBtn');
    if (btn && currentProduct) btn.innerHTML = `Add to Cart — MWK ${(currentProduct.price * modalQuantity).toLocaleString()}`;
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(i => i.id === id);
    if (existing) { existing.quantity++; if (selectedSize) existing.selectedSize = selectedSize; }
    else { cart.push({ ...product, quantity: 1, selectedSize: selectedSize || "Default" }); }
    updateCart();
    showToast(`${product.name} added to bag!`);
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('overlay').classList.add('show');
}

function updateCart() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').innerText = count;
    const container = document.getElementById('cartItemsList');
    if (cart.length === 0) { container.innerHTML = '<p style="text-align:center; color:#888;">Your bag is empty</p>'; document.getElementById('cartTotalPrice').innerText = 'MWK 0'; return; }
    let total = 0;
    container.innerHTML = cart.map(item => { const itemTotal = item.price * item.quantity; total += itemTotal; return `<div class="cart-item"><div><strong>${item.name}</strong> x${item.quantity}<br><small>Size: ${item.selectedSize || 'Default'}</small><br><small>MWK ${item.price.toLocaleString()}</small></div><div>MWK ${itemTotal.toLocaleString()}</div><button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button></div>`; }).join('');
    document.getElementById('cartTotalPrice').innerText = `MWK ${total.toLocaleString()}`;
    document.querySelectorAll('.remove-item').forEach(btn => { btn.addEventListener('click', () => { const id = parseInt(btn.dataset.id); const index = cart.findIndex(i => i.id === id); if (cart[index].quantity > 1) cart[index].quantity--; else cart.splice(index, 1); updateCart(); }); });
}

function renderProducts() {
    let filtered = [...products];
    if (searchQuery.trim() !== "") { const q = searchQuery.toLowerCase(); filtered = filtered.filter(p => p.name.toLowerCase().includes(q)); }
    const grid = document.getElementById('productGrid');
    if (filtered.length === 0) { grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px;">No products found!</div>`; return; }
    grid.innerHTML = filtered.map(p => `<div class="product-card"><div class="product-img"><img src="${p.image}" class="product-image" onerror="this.src='https://placehold.co/160x160/f8f8f8/c9a03d?text=Shoe'"></div><div class="product-info"><div class="product-title">${p.name}</div><div class="product-price">MWK ${p.price.toLocaleString()} <span class="old-price">MWK ${p.oldPrice.toLocaleString()}</span></div><button class="view-details" data-id="${p.id}">Quick View</button><button class="add-to-cart" data-id="${p.id}">Add to Cart</button></div></div>`).join('');
    document.querySelectorAll('.view-details').forEach(btn => { btn.addEventListener('click', (e) => { e.stopPropagation(); openProductModal(parseInt(btn.dataset.id)); }); });
    document.querySelectorAll('.add-to-cart').forEach(btn => { btn.addEventListener('click', (e) => { e.stopPropagation(); addToCart(parseInt(btn.dataset.id)); }); });
}

function renderFilteredProducts(productsToShow) {
    const grid = document.getElementById('productGrid');
    if (productsToShow.length === 0) { grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px;">No products in this category!</div>`; return; }
    grid.innerHTML = productsToShow.map(p => `<div class="product-card"><div class="product-img"><img src="${p.image}" class="product-image" onerror="this.src='https://placehold.co/160x160/f8f8f8/c9a03d?text=Shoe'"></div><div class="product-info"><div class="product-title">${p.name}</div><div class="product-price">MWK ${p.price.toLocaleString()} <span class="old-price">MWK ${p.oldPrice.toLocaleString()}</span></div><button class="view-details" data-id="${p.id}">Quick View</button><button class="add-to-cart" data-id="${p.id}">Add to Cart</button></div></div>`).join('');
    document.querySelectorAll('.view-details').forEach(btn => { btn.addEventListener('click', (e) => { e.stopPropagation(); openProductModal(parseInt(btn.dataset.id)); }); });
    document.querySelectorAll('.add-to-cart').forEach(btn => { btn.addEventListener('click', (e) => { e.stopPropagation(); addToCart(parseInt(btn.dataset.id)); }); });
}

function navigateTo(page) {
    currentPage = page;
    document.querySelectorAll('.nav-links a').forEach(link => { if (link.dataset.page === page) link.classList.add('active'); else link.classList.remove('active'); });
    const heroBanner = document.querySelector('.hero-banner');
    const categorySection = document.querySelector('.category-grid');
    const promoBanner = document.querySelector('.promo-banner');
    const newsletter = document.querySelector('.newsletter');
    if (page === "home") { if (heroBanner) heroBanner.style.display = "block"; if (categorySection) categorySection.style.display = "grid"; if (promoBanner) promoBanner.style.display = "block"; if (newsletter) newsletter.style.display = "block"; renderProducts(); }
    else { if (heroBanner) heroBanner.style.display = "none"; if (categorySection) categorySection.style.display = "none"; if (promoBanner) promoBanner.style.display = "block"; if (newsletter) newsletter.style.display = "block";
        if (page === "mens") renderFilteredProducts(products.filter(p => p.category === "men"));
        else if (page === "womens") renderFilteredProducts(products.filter(p => p.category === "women"));
        else if (page === "kids") renderFilteredProducts(products.filter(p => p.category === "kids"));
        else if (page === "sport") renderFilteredProducts(products.filter(p => p.tags.includes("sport")));
        else if (page === "sale") renderFilteredProducts(products.filter(p => p.tags.includes("sale")));
        else if (page === "new") renderFilteredProducts(products.filter(p => p.tags.includes("new")));
    }
}

function openCheckout() { if (cart.length === 0) { showToast("Your cart is empty!"); return; } document.querySelectorAll('.checkout-step').forEach(step => step.classList.remove('active')); document.getElementById('checkoutStep1').classList.add('active'); displayCheckoutCart(); document.getElementById('checkoutModal').classList.add('show'); }
function displayCheckoutCart() { const container = document.getElementById('checkoutCartItems'); let total = 0; if (cart.length === 0) { container.innerHTML = '<p>Your cart is empty</p>'; document.getElementById('checkoutTotalAmount').innerHTML = 'MWK 0'; return; } container.innerHTML = cart.map(item => { const itemTotal = item.price * item.quantity; total += itemTotal; return `<div class="checkout-cart-item"><div><strong>${item.name}</strong> x${item.quantity}<br><small>Size: ${item.selectedSize || 'Default'}</small></div><div>MWK ${itemTotal.toLocaleString()}</div></div>`; }).join(''); document.getElementById('checkoutTotalAmount').innerHTML = `MWK ${total.toLocaleString()}`; }
function generateOrderNumber() { const prefix = 'MO'; const date = new Date(); return `${prefix}${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}${Math.floor(Math.random()*10000).toString().padStart(4,'0')}`; }
function placeOrder() { const fullName = document.getElementById('fullName').value.trim(); const phoneNumber = document.getElementById('phoneNumber').value.trim(); const city = document.getElementById('citySelect').value; const address = document.getElementById('address').value.trim(); const paymentMethod = document.querySelector('input[name="payment"]:checked').value; if (!fullName) { showToast("Enter full name"); return; } if (!phoneNumber) { showToast("Enter phone number"); return; } if (!city) { showToast("Select city"); return; } if (!address) { showToast("Enter address"); return; } const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0); const orderNumber = generateOrderNumber(); const orderDate = new Date().toLocaleString(); let paymentName = paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "airtel" ? "Airtel Money" : "TNM Mpamba"; document.getElementById('orderNumber').innerHTML = orderNumber; document.getElementById('orderDate').innerHTML = orderDate; const order = { orderNumber, date: orderDate, customer: { fullName, phoneNumber, city, address }, items: [...cart], total, paymentMethod: paymentName, status: "Processing" }; let orders = JSON.parse(localStorage.getItem('mo_orders') || '[]'); orders.push(order); localStorage.setItem('mo_orders', JSON.stringify(orders)); document.querySelectorAll('.checkout-step').forEach(step => step.classList.remove('active')); document.getElementById('checkoutStep4').classList.add('active'); cart = []; updateCart(); showToast(`Order placed! #${orderNumber}`); }
function closeCheckout() { document.getElementById('checkoutModal').classList.remove('show'); }
function openTrackingModal() { document.getElementById('trackingForm').style.display = 'block'; document.getElementById('trackingResult').style.display = 'none'; document.getElementById('trackingModal').classList.add('show'); }
function closeTrackingModal() { document.getElementById('trackingModal').classList.remove('show'); }
function trackOrder() { const orderNumber = document.getElementById('trackOrderNumber').value.trim().toUpperCase(); const phoneNumber = document.getElementById('trackPhoneNumber').value.trim(); if (!orderNumber || !phoneNumber) { showToast("Enter both fields!"); return; } const orders = JSON.parse(localStorage.getItem('mo_orders') || '[]'); const order = orders.find(o => o.orderNumber === orderNumber && o.customer.phoneNumber === phoneNumber); if (!order) { showToast("Order not found!"); return; } let itemsHtml = ''; order.items.forEach(item => { itemsHtml += `<div>${item.name} x${item.quantity} - Size: ${item.selectedSize || 'Default'} - MWK ${(item.price * item.quantity).toLocaleString()}</div>`; }); const resultHtml = `<div style="background:#f8f9fa; padding:15px; border-radius:12px;"><h4>Order #${order.orderNumber}</h4><p><strong>Status:</strong> ${order.status}</p><p><strong>Date:</strong> ${order.date}</p><p><strong>Total:</strong> MWK ${order.total.toLocaleString()}</p><p><strong>Payment:</strong> ${order.paymentMethod}</p><p><strong>Delivery:</strong> ${order.customer.address}, ${order.customer.city}</p><p><strong>Items:</strong></p>${itemsHtml}</div><button onclick="closeTrackingModal()" style="margin-top:15px; padding:10px; background:#c9a03d; color:white; border:none; border-radius:30px; cursor:pointer;">Close</button>`; document.getElementById('trackingResult').innerHTML = resultHtml; document.getElementById('trackingForm').style.display = 'none'; document.getElementById('trackingResult').style.display = 'block'; }

const categories = [
    { icon: "fas fa-shoe-prints", name: "Men's Shoes", page: "mens" },
    { icon: "fas fa-female", name: "Women's Shoes", page: "womens" },
    { icon: "fas fa-child", name: "Kids' Shoes", page: "kids" },
    { icon: "fas fa-running", name: "Sports", page: "sport" },
    { icon: "fas fa-tag", name: "Sale", page: "sale" }
];
function buildCategoryGrid() { const grid = document.getElementById('categoryGrid'); if (!grid) return; grid.innerHTML = categories.map(cat => `<div class="category-card" data-page="${cat.page}"><i class="${cat.icon}"></i><h4>${cat.name}</h4></div>`).join(''); document.querySelectorAll('.category-card').forEach(card => { card.addEventListener('click', () => navigateTo(card.dataset.page)); }); }

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('modalCloseBtn')?.addEventListener('click', () => document.getElementById('productModal').classList.remove('show'));
    document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); navigateTo(link.dataset.page); }));
    document.getElementById('searchBtn')?.addEventListener('click', () => { searchQuery = document.getElementById('searchInput').value; navigateTo("home"); });
    document.getElementById('heroShopBtn')?.addEventListener('click', () => navigateTo("sale"));
    document.getElementById('promoShopBtn')?.addEventListener('click', () => navigateTo("sale"));
    document.getElementById('topBar')?.addEventListener('click', () => navigateTo("sale"));
    document.getElementById('logoLink')?.addEventListener('click', () => navigateTo("home"));
    document.getElementById('subscribeBtn')?.addEventListener('click', () => { const email = document.getElementById('newsletterEmail')?.value; if (!email || !email.includes('@')) showToast("Enter valid email!"); else { showToast(`Subscribed! ${email}`); document.getElementById('newsletterEmail').value = ''; } });
    document.getElementById('cartIconBtn')?.addEventListener('click', () => { document.getElementById('cartSidebar').classList.add('open'); document.getElementById('overlay').classList.add('show'); });
    document.getElementById('closeCartBtn')?.addEventListener('click', () => { document.getElementById('cartSidebar').classList.remove('open'); document.getElementById('overlay').classList.remove('show'); });
    document.getElementById('overlay')?.addEventListener('click', () => { document.getElementById('cartSidebar').classList.remove('open'); document.getElementById('overlay').classList.remove('show'); });
    document.getElementById('checkoutBtn')?.addEventListener('click', () => { if (cart.length === 0) showToast("Cart is empty!"); else openCheckout(); });
    document.getElementById('checkoutNext1')?.addEventListener('click', () => { document.getElementById('checkoutStep1').classList.remove('active'); document.getElementById('checkoutStep2').classList.add('active'); });
    document.getElementById('checkoutBack2')?.addEventListener('click', () => { document.getElementById('checkoutStep2').classList.remove('active'); document.getElementById('checkoutStep1').classList.add('active'); });
    document.getElementById('checkoutNext2')?.addEventListener('click', () => { const fullName = document.getElementById('fullName').value.trim(); const phone = document.getElementById('phoneNumber').value.trim(); const city = document.getElementById('citySelect').value; const address = document.getElementById('address').value.trim(); if (!fullName) { showToast("Enter full name"); return; } if (!phone) { showToast("Enter phone number"); return; } if (!city) { showToast("Select city"); return; } if (!address) { showToast("Enter address"); return; } document.getElementById('checkoutStep2').classList.remove('active'); document.getElementById('checkoutStep3').classList.add('active'); });
    document.getElementById('checkoutBack3')?.addEventListener('click', () => { document.getElementById('checkoutStep3').classList.remove('active'); document.getElementById('checkoutStep2').classList.add('active'); });
    document.getElementById('checkoutNext3')?.addEventListener('click', () => placeOrder());
    document.getElementById('checkoutCloseBtn')?.addEventListener('click', () => closeCheckout());
    document.getElementById('checkoutDoneBtn')?.addEventListener('click', () => { closeCheckout(); showToast("Thank you!"); });
    document.getElementById('trackingLink')?.addEventListener('click', (e) => { e.preventDefault(); openTrackingModal(); });
    document.getElementById('trackingCloseBtn')?.addEventListener('click', closeTrackingModal);
    document.getElementById('trackOrderBtn')?.addEventListener('click', trackOrder);
    document.getElementById('whatsappFloatBtn')?.addEventListener('click', (e) => { e.preventDefault(); window.open('https://wa.me/265991234567', '_blank'); });
    document.getElementById('aboutLink')?.addEventListener('click', (e) => { e.preventDefault(); showToast("Premium footwear since 2025 | Blantyre, Malawi"); });
    document.getElementById('contactLink')?.addEventListener('click', (e) => { e.preventDefault(); showToast("Email: support@moscollection.mw | Phone: +265 991 234 567"); });
    document.getElementById('returnsLink')?.addEventListener('click', (e) => { e.preventDefault(); showToast("30-day return policy on unworn shoes"); });
    document.getElementById('faqLink')?.addEventListener('click', (e) => { e.preventDefault(); showToast("FAQs: Contact us for help"); });
    document.querySelectorAll('.social-links a').forEach(link => { link.addEventListener('click', (e) => { e.preventDefault(); showToast("Follow us for exclusive drops!"); }); });
    buildCategoryGrid();
    renderProducts();
    updateCart();
});