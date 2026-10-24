document.addEventListener('DOMContentLoaded', () => {

    // --- SECCIÓN DE NAVEGACIÓN Y MODALES ---
    const contentWrappers = document.querySelectorAll('.content-wrapper');
    const navLinks = document.querySelectorAll('.navbar-links .nav-link:not([data-modal-target])');
    const internalLinks = document.querySelectorAll('.form-link');
    function showContent(targetId) { contentWrappers.forEach(w => w.classList.remove('active')); const wrapper = document.getElementById(targetId + 'Wrapper'); if (wrapper) wrapper.classList.add('active'); }
    navLinks.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); showContent(e.currentTarget.getAttribute('data-target')); }));
    internalLinks.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); showContent(e.currentTarget.getAttribute('data-target')); }));
    document.getElementById('brandLogo').addEventListener('click', (e) => { e.preventDefault(); showContent('loginContainer'); });
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const closeModalButtons = document.querySelectorAll('.close-modal-btn');
    const overlay = document.getElementById('modal-overlay');
    function openModal(modal) { if (modal) { modal.classList.add('active'); overlay.classList.add('active'); } }
    function closeModal(modal) { if (modal) { modal.classList.remove('active'); overlay.classList.remove('active'); } }
    modalTriggers.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); openModal(document.querySelector(btn.getAttribute('data-modal-target'))); }));
    closeModalButtons.forEach(btn => btn.addEventListener('click', () => closeModal(btn.closest('.modal'))));
    overlay.addEventListener('click', () => document.querySelectorAll('.modal.active').forEach(closeModal));
    const themeToggleButtons = { dark: document.getElementById('btn-dark-theme'), light: document.getElementById('btn-light-theme') };
    const body = document.body;
    function applyTheme(theme) { body.className = ''; body.classList.add(theme + '-theme'); localStorage.setItem('theme', theme); }
    themeToggleButtons.dark.addEventListener('click', () => applyTheme('dark'));
    themeToggleButtons.light.addEventListener('click', () => applyTheme('light'));
    applyTheme(localStorage.getItem('theme') || 'dark');

    // ======================================================
    // === LÓGICA DE FORMULARIOS (CONECTADA A PHP) ===
    // ======================================================
    
    // Formulario de Login
    const loginForm = document.getElementById('loginForm');
    if(loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const msg = document.getElementById("loginMessage");
            const formData = new FormData(this);

            msg.textContent = 'Verificando...';
            msg.className = "form-message";

            fetch('login.php', { method: 'POST', body: formData })
            .then(response => response.json().catch(() => { throw new Error("Respuesta inválida del servidor (no es JSON). Revisa el PHP."); }))
            .then(data => {
                msg.textContent = data.message;
                msg.className = data.success ? "form-message success" : "form-message error";
                if (data.success) {
                    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
                }
            })
            .catch(error => {
                msg.textContent = 'Error de conexión. Revisa la consola.';
                msg.className = "form-message error";
                console.error('Fetch Error:', error);
            });
        });
    }

    // Formulario de Registro
    const registerForm = document.getElementById('registerForm');
    if(registerForm) {
        registerForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const msg = document.getElementById("registerMessage");
            const formData = new FormData(this);

            msg.textContent = 'Procesando registro...';
            msg.className = "form-message";

            fetch('register.php', { method: 'POST', body: formData })
            .then(response => response.json().catch(() => {
                return response.text().then(text => { 
                    throw new Error("Respuesta inválida. El servidor dijo:\n" + text);
                });
            }))
            .then(data => {
                msg.textContent = data.message;
                msg.className = data.success ? "form-message success" : "form-message error";
                if (data.success) {
                    setTimeout(() => {
                        this.reset();
                        showContent('loginContainer');
                        document.getElementById('loginEmail').value = formData.get('email');
                    }, 2500);
                }
            })
            .catch(error => {
                msg.textContent = 'Error crítico. Revisa la consola.';
                msg.className = "form-message error";
                console.error('Fetch Error:', error);
            });
        });
    }
    
    // --- Simulación "Añadir al carrito" ---
    document.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', () => {
            const originalText = button.innerHTML;
            button.innerHTML = '¡Añadido! ✓';
            button.style.backgroundColor = '#4CAF50';
            setTimeout(() => { button.innerHTML = originalText; button.style.backgroundColor = ''; }, 1500);
        });
    });

    // --- SECCIÓN DE PARTÍCULAS ---
    const particleContainer = document.getElementById('particle-container');
    if (particleContainer) { const numParticles = 60; let particles = []; const mouse = { x: null, y: null, radius: 150 }; window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }); window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; }); function createParticles() { particleContainer.innerHTML = ''; particles = []; let containerSize = particleContainer.getBoundingClientRect(); for (let i = 0; i < numParticles; i++) { const size = Math.random() * 3 + 1; let particle = { x: Math.random() * containerSize.width, y: Math.random() * containerSize.height, size: size, baseX: Math.random() * containerSize.width, baseY: Math.random() * containerSize.height, density: (Math.random() * 30) + 1, element: document.createElement('div') }; particle.element.classList.add('particle'); particle.element.style.width = `${size}px`; particle.element.style.height = `${size}px`; particle.element.style.left = `${particle.x}px`; particle.element.style.top = `${particle.y}px`; particles.push(particle); particleContainer.appendChild(particle.element); } } function animateParticles() { requestAnimationFrame(animateParticles); particles.forEach(p => { let dx = mouse.x - p.x; let dy = mouse.y - p.y; let distance = Math.sqrt(dx * dx + dy * dy); if (distance < mouse.radius) { let forceDirectionX = dx / distance; let forceDirectionY = dy / distance; let force = (mouse.radius - distance) / mouse.radius; let directionX = forceDirectionX * force * p.density; let directionY = forceDirectionY * force * p.density; p.x -= directionX; p.y -= directionY; } else { if (p.x !== p.baseX) { p.x -= (p.x - p.baseX) / 20; } if (p.y !== p.baseY) { p.y -= (p.y - p.baseY) / 20; } } p.element.style.left = `${p.x}px`; p.element.style.top = `${p.y}px`; }); } createParticles(); animateParticles(); window.addEventListener('resize', createParticles); }
    
    // --- Estado inicial de la página ---
    showContent('loginContainer');
});