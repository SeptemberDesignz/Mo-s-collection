// ALL 8 PRODUCTS - NONE DELETED!
const products = [
    { id: 1, name: "Adidas Samba", price: 35000, oldPrice: 40000, image: "adidas Samba.jpg", category: "men", tags: ["sport","new"] },
    { id: 2, name: "Black Heels", price: 38000, oldPrice: 43000, image: "Black look_Shoes_.jpg", category: "women", tags: ["women","sale"] },
    { id: 3, name: "Men Palm Slipper", price: 28000, oldPrice: 32999, image: "Men palm slipper.jpg", category: "men", tags: ["men"] },
    { id: 4, name: "Penny Lug Sole Loafer", price: 19500, oldPrice: 22999, image: "penny.jpg", category: "men", tags: ["men","new"] },
    { id: 5, name: "crocs", price: 9000, oldPrice: 11999, image: "crocs.jpeg", category: "kids", tags: ["kids","sport"] },
    { id: 6, name: "Heels Type(S)", price: 45000, oldPrice: 59999, image: "Heels2.jpeg", category: "women", tags: ["women","sale"] },
    { id: 7, name: "Kids Decent Shoe", price: 35000, oldPrice: 39999, image: "kids1.jpeg", category: "kids", tags: ["kids"] },
    { id: 8, name: "Women Slides", price: 15000, oldPrice: 19999, image: "Women Slide3.jpeg", category: "women", tags: ["women","sale"] }
];

let cart = [];
let currentPage = "home";
let searchQuery = "";

// Page navigation function - OPENS DIFFERENT PAGES
function navigateTo(page) {
    currentPage = page;
    
    // Update active nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.dataset.page === page) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Show different content based on page
    const heroBanner = document.querySelector('.hero-banner');
    const categorySection = document.querySelector('.category-grid');
    const promoBanner = document.querySelector('.promo-banner');
    const newsletter = document.querySelector('.newsletter');
    
    if (page === "home") {
        if (heroBanner) heroBanner.style.display = "block";
        if (categorySection) categorySection.style.display = "grid";
        if (promoBanner) promoBanner.style.display = "block";
        if (newsletter) newsletter.style.display = "block";
        renderProducts(); // Show all products
    } else if (page === "mens") {
        if (heroBanner) heroBanner.style.display = "none";
        if (categorySection) categorySection.style.display = "none";
        if (promoBanner) promoBanner.style.display = "block";
        if (newsletter) newsletter.style.display = "block";
        const mensProducts = products.filter(p => p.category === "men");
        renderFilteredProducts(mensProducts);
    } else if (page === "womens") {
        if (heroBanner) heroBanner.style.display = "none";
        if (categorySection) categorySection.style.display = "none";
        if (promoBanner) promoBanner.style.display = "block";
        if (newsletter) newsletter.style.display = "block";
        const womensProducts = products.filter(p => p.category === "women");
        renderFilteredProducts(womensProducts);
    } else if (page === "kids") {
        if (heroBanner) heroBanner.style.display = "none";
        if (categorySection) categorySection.style.display = "none";
        if (promoBanner) promoBanner.style.display = "block";
        if (newsletter) newsletter.style.display = "block";
        const kidsProducts = products.filter(p => p.category === "kids");
        renderFilteredProducts(kidsProducts);
    } else if (page === "sport") {
        if (heroBanner) heroBanner.style.display = "none";
        if (categorySection) categorySection.style.display = "none";
        if (promoBanner) promoBanner.style.display = "block";
        if (newsletter) newsletter.style.display = "block";
        const sportProducts = products.filter(p => p.tags.includes("sport"));
        renderFilteredProducts(sportProducts);
    } else if (page === "sale") {
        if (heroBanner) heroBanner.style.display = "none";
        if (categorySection) categorySection.style.display = "none";
        if (promoBanner) promoBanner.style.display = "block";
        if (newsletter) newsletter.style.display = "block";
        const saleProducts = products.filter(p => p.tags.includes("sale"));
        renderFilteredProducts(saleProducts);
    } else if (page === "new") {
        if (heroBanner) heroBanner.style.display = "none";
        if (categorySection) categorySection.style.display = "none";
        if (promoBanner) promoBanner.style.display = "block";
        if (newsletter) newsletter.style.display = "block";
        const newProducts = products.filter(p => p.tags.includes("new"));
        renderFilteredProducts(newProducts);
    }
    
    showToast(`Viewing: ${page.toUpperCase()}`);
}

function renderFilteredProducts(productsToShow) {
    const grid = document.getElementById('productGrid');
    if (productsToShow.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px;">No products found in this category 😢</div>`;
        return;
    }
    grid.innerHTML = productsToShow.map(p => `
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
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            addToCart(id);
        });
    });
}

function renderProducts() {
    let filtered = [...products];
    if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(q));
    }
    
    const grid = document.getElementById('productGrid');
    if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px;">No products found 😢 Try another search!</div>`;
        return;
    }
    grid.innerHTML = filtered.map(p => `
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
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            addToCart(id);
        });
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
    showToast(`${product.name} added to bag!`);
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

function showToast(message) {
    let toast = document.getElementById('toastMsg');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastMsg';
        toast.style.cssText = 'position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:#1a1a2e; color:#c9a03d; padding:10px 20px; border-radius:40px; font-size:0.85rem; z-index:2000; opacity:0; transition:opacity 0.3s; pointer-events:none; white-space:nowrap; font-family:sans-serif;';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 2000);
}

// OPEN EXTERNAL PAGES / LINKS
function openPage(url) {
    window.open(url, '_blank');
}

function showPageMessage(pageName) {
    showToast(`Opening ${pageName} page...`);
    // Simulate page navigation - in real site, would redirect
    setTimeout(() => {
        alert(`📍 NAVIGATION: You clicked on "${pageName}".\n\nIn a real website, this would open a new page.`);
    }, 100);
}

// BUILD CATEGORY CARDS
const categories = [
    { icon: "fas fa-shoe-prints", name: "Men's Shoes", filter: "mens", page: "mens" },
    { icon: "fas fa-female", name: "Women's Shoes", filter: "womens", page: "womens" },
    { icon: "fas fa-child", name: "Kids' Shoes", filter: "kids", page: "kids" },
    { icon: "fas fa-running", name: "Sports", filter: "sport", page: "sport" },
    { icon: "fas fa-tag", name: "Sale", filter: "sale", page: "sale" }
];

function buildCategoryGrid() {
    const grid = document.getElementById('categoryGrid');
    if (!grid) return;
    grid.innerHTML = categories.map(cat => `
        <div class="category-card" data-page="${cat.page}">
            <i class="${cat.icon}"></i>
            <h4>${cat.name}</h4>
        </div>
    `).join('');
    
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const page = card.dataset.page;
            navigateTo(page);
            showToast(`Showing ${card.querySelector('h4').innerText}`);
        });
    });
}

// ========== INITIALIZE ALL BUTTONS ==========

// Navigation links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        navigateTo(page);
    });
});

// Search
document.getElementById('searchBtn')?.addEventListener('click', () => {
    searchQuery = document.getElementById('searchInput').value;
    currentPage = "home";
    document.querySelector('.hero-banner').style.display = "block";
    document.querySelector('.category-grid').style.display = "grid";
    renderProducts();
});
document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchQuery = e.target.value;
        currentPage = "home";
        document.querySelector('.hero-banner').style.display = "block";
        document.querySelector('.category-grid').style.display = "grid";
        renderProducts();
    }
});

// Hero Shop Now
document.getElementById('heroShopBtn')?.addEventListener('click', () => {
    navigateTo("sale");
    showToast("Limited time sale! Up to 10% off!");
});

// Promo Shop Now
document.getElementById('promoShopBtn')?.addEventListener('click', () => {
    navigateTo("sale");
    showToast("Extra 10% off on orders over MWK 150,000!");
});

// Subscribe
document.getElementById('subscribeBtn')?.addEventListener('click', () => {
    const email = document.getElementById('newsletterEmail')?.value;
    if (!email || !email.includes('@')) {
        showToast("❌ Please enter a valid email address!");
    } else {
        showToast(`✅ Subscribed! ${email} will receive updates!`);
        document.getElementById('newsletterEmail').value = '';
    }
});

// Cart controls
document.getElementById('cartIconBtn')?.addEventListener('click', () => {
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('overlay').classList.add('show');
});
document.getElementById('closeCartBtn')?.addEventListener('click', () => {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('show');
});
document.getElementById('overlay')?.addEventListener('click', () => {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('show');
});
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (cart.length === 0) {
        showToast("Your bag is empty! Add some shoes first 👟");
    } else {
        const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
        showToast(`✅ Order placed! Total: MWK ${total.toLocaleString()}. Thank you!`);
        cart = [];
        updateCart();
        document.getElementById('cartSidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('show');
    }
});

// Logo click - goes home
document.getElementById('logoLink')?.addEventListener('click', () => {
    navigateTo("home");
    searchQuery = "";
    document.getElementById('searchInput').value = "";
    showToast("Back to Home");
});

// Top bar click
document.getElementById('topBar')?.addEventListener('click', () => {
    navigateTo("sale");
});

// Footer links - OPEN PAGES / SHOW MESSAGES
document.getElementById('aboutLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    showPageMessage("About Us");
});
document.getElementById('contactLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    showPageMessage("Contact Us");
});
document.getElementById('returnsLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    showPageMessage("Returns Policy");
});
document.getElementById('faqLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    showPageMessage("FAQs");
});

// Footer category links
document.querySelectorAll('.footer-col a[data-cat]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = link.dataset.cat;
        navigateTo(cat);
    });
});

// Social media links
document.getElementById('facebookLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    openPage('https://facebook.com');
    showToast("Opening Facebook...");
});
document.getElementById('instagramLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    openPage('https://instagram.com');
    showToast("Opening Instagram...");
});
document.getElementById('twitterLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    openPage('https://twitter.com');
    showToast("Opening Twitter...");
});
document.getElementById('tiktokLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    openPage('https://tiktok.com');
    showToast("Opening TikTok...");
});

// Initialize
buildCategoryGrid();
renderProducts();
updateCart();