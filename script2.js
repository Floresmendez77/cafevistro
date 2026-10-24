/**
 * @file Aplicación del Dashboard de EcotiendaHN
 * @description Script principal que gestiona el estado, la interacción con la API y la renderización de la interfaz de usuario del panel de control.
 * @version 2.0.0
 * @author Tu Nombre (o el del equipo)
 * @license MIT
 */

// Usamos el modo estricto para un código más limpio y seguro.
"use strict";

const App = {
    // --- 1. ESTADO Y CONFIGURACIÓN ---
    // Un único lugar para todos los datos dinámicos de la aplicación.
    state: {
        currentUser: null,
        products: [],
        cart: [],
        userOrders: [],
        ecoPoints: 0,
        discountApplied: false,
        elementToFocusOnModalClose: null, // Para accesibilidad
    },

    // Almacenamiento de constantes y configuraciones.
    config: {
        POINTS_TO_LEMPIRAS: 0.10,
        BLOG_POSTS: [
            { id: 1, title: "5 Cambios Sencillos para un Hogar más Ecológico", content: "Descubre cómo pequeños cambios como usar bolsas reutilizables, cambiar a cepillos de bambú y optar por detergentes biodegradables pueden tener un gran impacto en la salud de nuestro planeta. Reducir el consumo de plásticos de un solo uso es un excelente primer paso. ¡Empieza hoy!" },
            { id: 2, title: "¿Por qué elegir bambú? El material del futuro", content: "El bambú no es solo para los pandas. Crece increíblemente rápido, no requiere pesticidas y es 100% biodegradable. Su resistencia y versatilidad lo convierten en la alternativa perfecta al plástico en productos de uso diario como cepillos de dientes, utensilios de cocina y mucho más." }
        ]
    },

    // Un único lugar para almacenar referencias a los elementos del DOM.
    dom: {},

    // --- 2. INICIALIZACIÓN ---
    /**
     * Inicia la aplicación. Se llama cuando el DOM está completamente cargado.
     */
    init() {
        try {
            this.cacheDomElements();
            this.setupEventListeners();
            this.api.checkSession().then(() => this.loadInitialData());
        } catch (error) {
            console.error("Error crítico durante la inicialización:", error);
            this.utils.showToast("Error crítico al cargar la aplicación. Por favor, recarga la página.", 'error');
        }
    },

    /**
     * Busca y almacena en caché los elementos del DOM para un acceso rápido y eficiente.
     */
    cacheDomElements() {
        this.dom.sidebar = document.getElementById('sidebar-nav');
        this.dom.mainContent = document.querySelector('.main-content');
        this.dom.contentSections = this.dom.mainContent.querySelectorAll('.content-section');
        this.dom.welcomeMessage = document.getElementById('welcome-message');
        this.dom.productCount = document.getElementById('product-count');
        this.dom.ordersCount = document.getElementById('orders-count');
        this.dom.ecoPoints = document.getElementById('eco-points');
        this.dom.productGridContainer = document.getElementById('product-grid-container');
        this.dom.cartCount = document.getElementById('cart-count');
        this.dom.toastContainer = document.getElementById('toast-container');
        this.dom.pageOverlay = document.querySelector('.page-overlay');
        this.dom.menuToggle = document.querySelector('.menu-toggle');
        // Plantillas
        this.dom.productCardTemplate = document.getElementById('product-card-template');
    },

    // --- 3. MANEJADORES DE EVENTOS ---
    /**
     * Configura todos los listeners de eventos de la aplicación, usando delegación cuando es posible.
     */
    setupEventListeners() {
        // Delegación de eventos en el sidebar para una mayor eficiencia.
        this.dom.sidebar.addEventListener('click', this.handlers.handleSidebarClick.bind(this));

        // Delegación de eventos en el grid de productos.
        this.dom.productGridContainer.addEventListener('click', this.handlers.handleProductGridClick.bind(this));

        // Listener para el menú móvil
        this.dom.menuToggle.addEventListener('click', this.handlers.toggleMobileMenu.bind(this));
        this.dom.pageOverlay.addEventListener('click', this.handlers.closeAllOverlays.bind(this));

        // Listener global para cerrar modales con la tecla 'Escape'.
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.handlers.closeAllOverlays();
        });
    },

    /**
     * Contiene las funciones que se ejecutan en respuesta a los eventos del usuario.
     */
    handlers: {
        handleSidebarClick(e) {
            const navLink = e.target.closest('.nav-link');
            if (!navLink) return;

            e.preventDefault();
            this.state.elementToFocusOnModalClose = navLink; // Guardar para accesibilidad

            const targetId = navLink.dataset.target;
            const modalTarget = navLink.dataset.modalTarget;

            if (targetId) this.utils.setActiveSection(targetId);
            if (modalTarget) this.utils.openModal(document.querySelector(modalTarget));
        },

        handleProductGridClick(e) {
            const card = e.target.closest('.product-card');
            if (!card) return;

            // Lógica para expandir/colapsar detalles
            const mainInfo = e.target.closest('.product-card__main-info');
            if (mainInfo) {
                card.classList.toggle('product-card--expanded');
            }
            // Lógica para añadir al carrito
            const addToCartBtn = e.target.closest('.add-to-cart-btn'); // Suponiendo que añadas este botón
            if (addToCartBtn) {
                // Lógica para añadir al carrito...
            }
        },

        toggleMobileMenu() {
            const isExpanded = this.dom.menuToggle.getAttribute('aria-expanded') === 'true';
            this.dom.menuToggle.setAttribute('aria-expanded', !isExpanded);
            this.dom.sidebar.classList.toggle('sidebar--open');
            this.dom.pageOverlay.classList.toggle('page-overlay--active');
        },

        closeAllOverlays() {
            // Cierra modales
            document.querySelectorAll('.modal').forEach(modal => this.utils.closeModal(modal));
            // Cierra sidebar móvil
            if (this.dom.sidebar.classList.contains('sidebar--open')) {
                this.handlers.toggleMobileMenu.call(this);
            }
        }
    },

    // --- 4. LÓGICA DE API (Red) ---
    /**
     * Módulo para gestionar todas las comunicaciones con el servidor.
     */
    api: {
        async checkSession() {
            try {
                const res = await fetch('check_session.php');
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();

                if (data.loggedin && data.nombre) {
                    App.state.currentUser = { id: data.user_id, nombre: data.nombre };
                } else {
                    window.location.href = 'index.html';
                }
            } catch (error) {
                console.error("Fallo en la verificación de sesión:", error);
                window.location.href = 'index.html';
            }
        },
        async getProducts() {
            // Simulación de una llamada a la API
            return [
                { id: 1, nombre: 'Cepillo de Dientes de Bambú', precio: '85.00', imagen_url: 'path/to/image.jpg', descripcion: 'Sostenible y ecológico.' },
                { id: 2, nombre: 'Bolsas de Malla Reutilizables (Set de 5)', precio: '250.00', imagen_url: 'path/to/image2.jpg', descripcion: 'Ideal para frutas y verduras.' }
            ];
        },
        // ... otras llamadas a la API (getOrders, createOrder) seguirían este patrón.
    },

    /**
     * Carga todos los datos iniciales necesarios para el dashboard.
     */
    async loadInitialData() {
        if (this.dom.welcomeMessage) {
            this.dom.welcomeMessage.textContent = `Bienvenido, ${this.state.currentUser.nombre.split(' ')[0]}`;
        }
        try {
            // Usamos Promise.all para cargar datos en paralelo
            const [productsData] = await Promise.all([
                this.api.getProducts(),
                // this.api.getOrders()
            ]);

            this.state.products = productsData;
            this.render.catalog();
            this.render.stats();

        } catch (error) {
            console.error("Error al cargar datos iniciales:", error);
            this.utils.showToast("No se pudieron cargar los datos del panel.", "error");
        }
    },

    // --- 5. LÓGICA DE RENDERIZADO ---
    /**
     * Módulo para actualizar el DOM.
     */
    render: {
        /**
         * Renderiza el catálogo de productos usando la plantilla.
         */
        catalog() {
            App.dom.productGridContainer.innerHTML = ''; // Limpiar antes de renderizar
            if (App.state.products.length === 0) {
                App.dom.productGridContainer.innerHTML = "<p>No hay productos disponibles en este momento.</p>";
                return;
            }
            const fragment = document.createDocumentFragment();
            App.state.products.forEach(product => {
                fragment.appendChild(this.productCard(product));
            });
            App.dom.productGridContainer.appendChild(fragment);
        },

        /**
         * Crea una tarjeta de producto individual a partir de la plantilla.
         * @param {object} product - El objeto del producto.
         * @returns {Node} - El elemento de la tarjeta del producto clonado y rellenado.
         */
        productCard(product) {
            const clone = App.dom.productCardTemplate.content.cloneNode(true);
            const card = clone.querySelector('.product-card');
            card.dataset.productId = product.id;
            clone.querySelector('.product-card__image').src = product.imagen_url;
            clone.querySelector('.product-card__image').alt = product.nombre;
            clone.querySelector('.product-card__name').textContent = product.nombre;
            clone.querySelector('.product-card__price').textContent = `L. ${parseFloat(product.precio).toFixed(2)}`;
            // Rellenar más detalles si es necesario
            return clone;
        },

        stats() {
            if (App.dom.productCount) App.dom.productCount.textContent = App.state.products.length;
            if (App.dom.ordersCount) App.dom.ordersCount.textContent = App.state.userOrders.length;
            if (App.dom.ecoPoints) App.dom.ecoPoints.textContent = App.state.ecoPoints;
        }
    },

    // --- 6. FUNCIONES UTILITARIAS ---
    /**
     * Módulo de funciones de ayuda reutilizables.
     */
    utils: {
        setActiveSection(targetId) {
            App.dom.contentSections.forEach(section => {
                section.classList.toggle('content-section--active', section.id === targetId);
            });
            App.dom.sidebar.querySelectorAll('.nav-link').forEach(link => {
                link.classList.toggle('nav-link--active', link.dataset.target === targetId);
            });
        },

        openModal(modalElement) {
            if (!modalElement) return;

            this.state.elementToFocusOnModalClose = document.activeElement;
            modalElement.hidden = false;
            modalElement.classList.add('modal--active');
            App.dom.pageOverlay.classList.add('page-overlay--active');

            const focusableElements = modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstFocusableElement = focusableElements[0];

            firstFocusableElement?.focus();

            // Focus Trap
            modalElement.addEventListener('keydown', this.focusTrap);
        },

        closeModal(modalElement) {
            if (!modalElement || modalElement.hidden) return;

            modalElement.hidden = true;
            modalElement.classList.remove('modal--active');
            App.dom.pageOverlay.classList.remove('page-overlay--active');
            modalElement.removeEventListener('keydown', this.focusTrap);

            this.state.elementToFocusOnModalClose?.focus();
        },

        focusTrap(e) {
            if (e.key !== 'Tab') return;

            const focusableElements = e.currentTarget.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        },

        showToast(message, type = 'info') {
            if (!App.dom.toastContainer) return;
            const toast = document.createElement('div');
            toast.className = `toast toast--${type}`;
            const icon = type === 'error' ? 'fa-times-circle' : 'fa-check-circle';
            toast.innerHTML = `<i class="fas ${icon}" aria-hidden="true"></i> ${message}`;
            App.dom.toastContainer.appendChild(toast);
            setTimeout(() => {
                toast.classList.add('toast--hiding');
                toast.addEventListener('transitionend', () => toast.remove());
            }, 4000);
        }
    }
};

// Iniciar la aplicación cuando el documento esté listo.
document.addEventListener('DOMContentLoaded', () => App.init());