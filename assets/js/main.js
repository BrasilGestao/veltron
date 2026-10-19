/* ==========================================================================
   VELTRON E-COMMERCE - CORE JAVASCRIPT ENGINE (ATUALIZADO & CORRIGIDO)
   ========================================================================== */

const productsData = [
    {
        id: 'vel-01',
        name: 'Relógio VELTRON Minimal Black Steel',
        category: 'relogios',
        subType: 'aço',
        price: 149.90,
        oldPrice: 189.90,
        isBestSeller: true,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        description: 'Caixa em aço escovado preto, mostrador analógico minimalista e pulseira metálica ajustável. Design imponente.'
    },
    {
        id: 'vel-02',
        name: 'Pulseira Aço Elos Curb VELTRON',
        category: 'pulseiras',
        subType: 'pulseiras',
        price: 99.90,
        oldPrice: null,
        isBestSeller: true,
        image: 'https://images.unsplash.com/photo-1611591475179-6703be79b35c?w=800&q=80',
        description: 'Pulseira em aço inoxidável 316L com elos curb de 8mm. Fecho de pressão com gravação da marca.'
    },
    {
        id: 'vel-03',
        name: 'Colar Prata Corrente Pendant VELTRON',
        category: 'colares',
        subType: 'colares',
        price: 119.90,
        oldPrice: 139.90,
        isBestSeller: false,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
        description: 'Corrente masculina em liga de prata de alta durabilidade com pingente geométrico exclusivo.'
    },
    {
        id: 'vel-04',
        name: 'Anel Masculino VELTRON Monogram',
        category: 'aneis',
        subType: 'aneis',
        price: 89.90,
        oldPrice: null,
        isBestSeller: true,
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
        description: 'Anel estilo com superfície polida e acabamento interno anatômico para máximo conforto.'
    },
    {
        id: 'vel-05',
        name: 'Relógio VELTRON Silver Chrono',
        category: 'relogios',
        subType: 'aço',
        price: 149.90,
        oldPrice: 179.90,
        isBestSeller: false,
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80',
        description: 'Design esportivo com toque de alta joalheria. Pulseira prateada e resistente à água.'
    },
    {
        id: 'vel-06',
        name: 'Pulseira Couro Trançado & Fecho Prata',
        category: 'pulseiras',
        subType: 'couro',
        price: 94.90,
        oldPrice: null,
        isBestSeller: false,
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
        description: 'Couro legítimo trançado duplo com fecho magnético em liga metálica prateada.'
    }
];

let cart = JSON.parse(localStorage.getItem('veltron_cart')) || [];
let activeCategory = 'todos';
let activeSubFilter = 'todos';
let searchQuery = '';

let productsGrid, cartBadge, cartDrawer, cartBackdrop, cartItemsContainer, cartSubtotal, checkoutBtn;

document.addEventListener('DOMContentLoaded', () => {
    initDOM();
    initApp();
});

function initDOM() {
    productsGrid = document.getElementById('productsGrid');
    cartBadge = document.getElementById('cartBadge');
    cartDrawer = document.getElementById('cartDrawer');
    cartBackdrop = document.getElementById('cartBackdrop');
    cartItemsContainer = document.getElementById('cartItemsContainer');
    cartSubtotal = document.getElementById('cartSubtotal');
    checkoutBtn = document.getElementById('checkoutBtn');
}

function initApp() {
    renderProducts();
    updateCartUI();
    setupEventListeners();
    setupScrollAnimations();
    highlightActiveMenu(); // <--- Correção definitiva do sublinhado do menu
}

/* MARCAÇÃO AUTOMÁTICA E PRECISA DO MENU ATIVO */
function highlightActiveMenu() {
    let currentPath = window.location.pathname.split('/').pop();
    if (!currentPath || currentPath === '') {
        currentPath = 'index.html';
    }

    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');

        if (linkHref === currentPath || (currentPath === 'index.html' && (linkHref === 'index.html' || linkHref === '#'))) {
            link.classList.add('active');
        }
    });
}

function renderProducts() {
    if (!productsGrid) return;
    productsGrid.innerHTML = '';

    const pageCategory = productsGrid.dataset.pageCategory;

    let filtered = productsData.filter(p => {
        let matches = true;

        if (pageCategory) {
            if (pageCategory === 'relogios') {
                matches = p.category === 'relogios';
            } else if (pageCategory === 'joias') {
                matches = p.category === 'pulseiras' || p.category === 'colares' || p.category === 'aneis';
            } else if (pageCategory === 'acessorios') {
                matches = p.category === 'acessorios' || p.category === 'pulseiras';
            } else if (pageCategory === 'novidades') {
                matches = p.isBestSeller;
            }
        } else {
            matches = activeCategory === 'todos' || p.category === activeCategory;
        }

        if (activeSubFilter !== 'todos') {
            matches = matches && (p.subType === activeSubFilter || p.category === activeSubFilter);
        }

        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matches && matchesSearch;
    });

    const sortValue = document.getElementById('sortSelect')?.value;
    if (sortValue === 'menor-preco') filtered.sort((a, b) => a.price - b.price);
    if (sortValue === 'maior-preco') filtered.sort((a, b) => b.price - a.price);

    const resultsCountEl = document.getElementById('resultsCount');
    if (resultsCountEl) {
        resultsCountEl.textContent = `Exibindo ${filtered.length} produto(s)`;
    }

    if (filtered.length === 0) {
        productsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--color-silver-muted);"><p>Nenhum produto encontrado nesta categoria.</p></div>`;
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.innerHTML = `
            ${product.isBestSeller ? '<span class="badge-tag">DESTAQUE</span>' : ''}
            <div class="product-img-box">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-prices">
                    <span class="current-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                    ${product.oldPrice ? `<span class="old-price">R$ ${product.oldPrice.toFixed(2).replace('.', ',')}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn btn-outline btn-sm" onclick="openQuickView('${product.id}')">DETALHES</button>
                    <button class="btn btn-primary btn-sm" onclick="addToCart('${product.id}')">COMPRAR</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

function addToCart(productId) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        const prod = productsData.find(p => p.id === productId);
        if (prod) cart.push({ ...prod, quantity: 1 });
    }
    saveCart();
    openCart();
}

function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }
    saveCart();
}

function saveCart() {
    localStorage.setItem('veltron_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) cartBadge.textContent = totalCount;

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color: var(--color-silver-muted); margin-top:20px;">Seu carrinho está vazio.</p>';
        if (cartSubtotal) cartSubtotal.textContent = 'R$ 0,00';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    if (cartSubtotal) cartSubtotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function openCart() {
    if (cartDrawer && cartBackdrop) {
        cartDrawer.classList.add('open');
        cartBackdrop.classList.add('open');
        cartDrawer.setAttribute('aria-hidden', 'false');
    }
}

function closeCart() {
    if (cartDrawer && cartBackdrop) {
        cartDrawer.classList.remove('open');
        cartBackdrop.classList.remove('open');
        cartDrawer.setAttribute('aria-hidden', 'true');
    }
}

function openQuickView(productId) {
    const prod = productsData.find(p => p.id === productId);
    if (!prod) return;

    const modalContent = document.getElementById('modalProductContent');
    if (!modalContent) return;

    modalContent.innerHTML = `
        <div class="modal-grid">
            <img src="${prod.image}" alt="${prod.name}" class="modal-img">
            <div>
                <h3 class="modal-title">${prod.name}</h3>
                <p class="current-price" style="font-size: 1.3rem; margin-bottom: 12px;">R$ ${prod.price.toFixed(2).replace('.', ',')}</p>
                <p class="modal-desc">${prod.description}</p>
                <button class="btn btn-primary btn-block" onclick="addToCart('${prod.id}'); closeQuickView();">ADICIONAR AO CARRINHO</button>
            </div>
        </div>
    `;
    document.getElementById('productModalBackdrop')?.classList.add('open');
}

function closeQuickView() {
    document.getElementById('productModalBackdrop')?.classList.remove('open');
}

function setupEventListeners() {
    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
        document.getElementById('mobileDrawer')?.classList.toggle('open');
    });

    document.getElementById('cartToggleBtn')?.addEventListener('click', openCart);
    document.getElementById('cartCloseBtn')?.addEventListener('click', closeCart);
    cartBackdrop?.addEventListener('click', closeCart);
    document.getElementById('modalCloseBtn')?.addEventListener('click', closeQuickView);

    document.getElementById('searchInput')?.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderProducts();
    });

    document.getElementById('sortSelect')?.addEventListener('change', () => {
        renderProducts();
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            if (e.target.dataset.subfilter) {
                activeSubFilter = e.target.dataset.subfilter;
            } else {
                activeCategory = e.target.dataset.category;
            }
            renderProducts();
        });
    });

    checkoutBtn?.addEventListener('click', () => {
        closeCart();
        document.getElementById('checkoutModalBackdrop')?.classList.add('open');
    });

    document.getElementById('checkoutCloseBtn')?.addEventListener('click', () => {
        document.getElementById('checkoutModalBackdrop')?.classList.remove('open');
    });

    document.getElementById('whatsappCheckoutForm')?.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('clientName').value;
        const phone = document.getElementById('clientPhone').value;
        const address = document.getElementById('clientAddress').value;
        const payment = document.getElementById('clientPayment').value;

        let totalOrder = 0;
        let itemsFormatted = '';

        cart.forEach((item, index) => {
            const sub = item.price * item.quantity;
            totalOrder += sub;
            itemsFormatted += `%0A${index + 1}. *${encodeURIComponent(item.name)}*%0A   Qtd: ${item.quantity} | R$ ${sub.toFixed(2).replace('.', ',')}%0A`;
        });

        let message = `*NOVO PEDIDO - VELTRON*%0A`;
        message += `-----------------------------------%0A`;
        message += `*DADOS DO CLIENTE:*%0A`;
        message += `Nome: ${encodeURIComponent(name)}%0A`;
        message += `Telefone: ${encodeURIComponent(phone)}%0A`;
        message += `Endereço: ${encodeURIComponent(address)}%0A%0A`;
        message += `*ITENS DO PEDIDO:*${itemsFormatted}%0A`;
        message += `-----------------------------------%0A`;
        message += `*TOTAL:* R$ ${totalOrder.toFixed(2).replace('.', ',')}%0A`;
        message += `*PAGAMENTO:* ${encodeURIComponent(payment)}%0A`;
        message += `-----------------------------------%0A`;
        message += `Aguardando confirmação do pedido.`;

        const whatsappNumber = '5527999999999';
        const url = `https://wa.me/${whatsappNumber}?text=${message}`;

        window.open(url, '_blank');

        cart = [];
        saveCart();
        document.getElementById('checkoutModalBackdrop')?.classList.remove('open');
        document.getElementById('whatsappCheckoutForm').reset();
    });
}

function setupScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;

    const observerOptions = { threshold: 0.1 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card, .category-card, .feature-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}