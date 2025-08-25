
        document.addEventListener('DOMContentLoaded', () => {
            const $ = selector => document.querySelector(selector);
            const $$ = selector => document.querySelectorAll(selector);

            let cart = [];

            const products = [
                { id: 1, name: 'Drone X1', price: 299, image: 'img/Dron.jpg', desc: 'Drone de alta velocidad con IA integrada.' },
                { id: 2, name: 'SmartWatch Neo', price: 199, image: 'img/smartwach.jpg', desc: 'Reloj inteligente con proyección holográfica.' },
                { id: 3, name: 'Neural Headset', price: 499, image: 'img/Mente.jpg', desc: 'Controla tus dispositivos con tu mente.' }
            ];

            function renderProducts() {
                const container = $('#products-container');
                if (!container) return;

                container.innerHTML = products.map(p => `
                    <div class="product-card">
                        <img src="${p.image}" alt="${p.name}">
                        <h3>${p.name}</h3>
                        <p>${p.desc}</p>
                        <p class="price">$${p.price}</p>
                        <button class="add-to-cart-btn" data-id="${p.id}">
                            Añadir al carrito
                        </button>
                    </div>
                `).join('');

                $$('.add-to-cart-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = parseInt(e.currentTarget.dataset.id);
                        const product = products.find(p => p.id === id);
                        addToCart(product.name, product.price);
                    });
                });
            }

            function addToCart(name, price) {
                const existing = cart.find(item => item.name === name);
                if (existing) {
                    existing.quantity += 1;
                } else {
                    cart.push({ name, price, quantity: 1 });
                }
                updateCart();
                showNotification(`${name} añadido al carrito ✅`);
            }

            function updateCart() {
                const items = $('#cart-items');
                if (!items) return;
                items.innerHTML = '';

                if (cart.length === 0) {
                    items.innerHTML = '<li style="text-align:center;color:#b0b0d0">Tu carrito está vacío</li>';
                    $('#cart-total').textContent = '0.00';
                    $('#cart-count').textContent = '0';
                    return;
                }

                let total = 0;
                cart.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <div>
                            <strong>${item.name}</strong> ×${item.quantity}
                            <div style="font-size:0.8rem;opacity:0.8;">$${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                        <button onclick="removeFromCart('${item.name}')" style="color:#ff2a6d; background:none; border:none; cursor:pointer;">×</button>
                    `;
                    items.appendChild(li);
                    total += item.price * item.quantity;
                });

                $('#cart-total').textContent = total.toFixed(2);
                $('#cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
            }

            window.removeFromCart = function(name) {
                cart = cart.filter(item => item.name !== name);
                updateCart();
                showNotification('Producto eliminado 🗑️');
            }

            function toggleCart() {
                $('#cart-sidebar').classList.toggle('active');
                $('#overlay').classList.toggle('active');
                document.body.style.overflow = $('#cart-sidebar').classList.contains('active') ? 'hidden' : '';
            }

            function checkout() {
                if (cart.length === 0) {
                    showNotification('Tu carrito está vacío ❌', 'error');
                    return;
                }
                showNotification('¡Gracias por tu compra! Serás redirigido al pago 💳', 'success');
                setTimeout(() => {
                    cart = [];
                    updateCart();
                    toggleCart();
                }, 1500);
            }

            // Eventos
            $('#cart-button')?.addEventListener('click', toggleCart);
            $('.cart-close')?.addEventListener('click', toggleCart);
            $('#checkout-btn')?.addEventListener('click', checkout);
            $('.mobile-menu-close')?.addEventListener('click', () => {
                $('#mobile-menu').classList.remove('active');
                $('#overlay').classList.remove('active');
                document.body.style.overflow = '';
            });
            $('.menu-toggle')?.addEventListener('click', () => {
                $('#mobile-menu').classList.toggle('active');
                $('#overlay').classList.toggle('active');
                document.body.style.overflow = $('#mobile-menu').classList.contains('active') ? 'hidden' : '';
            });
            $('#overlay')?.addEventListener('click', () => {
                if ($('#cart-sidebar')?.classList.contains('active')) toggleCart();
                if ($('#mobile-menu')?.classList.contains('active')) $('.mobile-menu-close').click();
            });
            $('#search')?.addEventListener('input', searchProducts);
            $('#search-clear')?.addEventListener('click', clearSearch);

            // Búsqueda
            function searchProducts() {
                const term = $('#search')?.value.toLowerCase().trim() || '';
                $('#search-clear').style.display = term ? 'block' : 'none';

                $$('.product-card').forEach(card => {
                    const text = card.textContent.toLowerCase();
                    card.style.display = text.includes(term) ? 'block' : 'none';
                });
            }

            function clearSearch() {
                $('#search').value = '';
                $('#search-clear').style.display = 'none';
                searchProducts();
            }

            // Inicializar
            renderProducts();
            updateCart();
        });

        function showNotification(message, type = 'info') {
            const bgColor = type === 'error' ? '#ff2a6d' : '#00ff9d';
            const color = bgColor === '#00ff9d' ? 'black' : 'white';

            const notification = document.createElement('div');
            notification.innerHTML = `
                <div style="
                    position: fixed; bottom: 20px; right: 20px;
                    background: ${bgColor}; color: ${color};
                    padding: 14px 20px; border-radius: 8px;
                    box-shadow: 0 0 20px rgba(0, 243, 255, 0.4);
                    z-index: 2000; transform: translateX(120%);
                    transition: transform 0.4s ease; max-width: 320px;
                    text-align: center; font-size: 0.95rem; font-weight: 500;
                ">${message}</div>
            `;
            document.body.appendChild(notification);
            setTimeout(() => notification.firstChild.style.transform = 'translateX(0)', 100);
            setTimeout(() => {
                notification.firstChild.style.transform = 'translateX(120%)';
                setTimeout(() => { if (notification.parentNode) document.body.removeChild(notification); }, 400);
            }, 3000);
        }
