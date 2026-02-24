/* ============================================
   CODEHUNT 2K26 — INTERACTIVE ENGINE
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // PARTICLE SYSTEM
    // ==========================================
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = Math.random() > 0.7 ? '178, 75, 255' : '0, 229, 255';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    this.x -= dx * 0.01;
                    this.y -= dy * 0.01;
                    this.opacity = Math.min(this.opacity + 0.02, 0.8);
                }
            }

            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 12000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 229, 255, ${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero-section');
    const navLinksAll = document.querySelectorAll('.nav-link');

    // Robot BG parallax
    const cssRobot = document.getElementById('cssRobot');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Robot background parallax: fade as user scrolls
        if (cssRobot) {
            const scrollFactor = Math.min(scrollY / 800, 1);
            const opacity = 0.35 - scrollFactor * 0.3;
            cssRobot.style.opacity = Math.max(opacity, 0.03);
        }

        // Active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // HAMBURGER MENU
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ==========================================
    // SCROLL REVEAL ANIMATIONS
    // ==========================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    // Hero elements
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.slide-up').forEach(el => {
        heroObserver.observe(el);
    });

    // Cards with stagger
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay * 150);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-card').forEach(el => {
        cardObserver.observe(el);
    });

    // Section headers reveal
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.section-header').forEach(el => {
        headerObserver.observe(el);
    });

    // ==========================================
    // MOBILE PARTICLE OPTIMIZATION
    // ==========================================
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Reduce particles on mobile for performance
    if (isMobile() && particles.length > 30) {
        particles.length = 30;
    }

    // ==========================================
    // REGISTER BUTTON — Google Form redirect
    // ==========================================
    // Registration is now handled entirely via Google Forms.
    // No local form processing needed.

    // ==========================================
    // TOAST NOTIFICATION
    // ==========================================
    function showToast(title, message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<strong>${title}</strong><p>${message}</p>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('out');
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    }

    // ==========================================
    // SMOOTH SCROLL FOR ANCHORS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ==========================================
    // TYPED TEXT EFFECT
    // ==========================================
    const typedEl = document.querySelector('.typed-text');
    if (typedEl) {
        const fullText = typedEl.textContent;
        typedEl.textContent = '';
        let i = 0;
        function typeChar() {
            if (i < fullText.length) {
                typedEl.textContent += fullText.charAt(i);
                i++;
                setTimeout(typeChar, 60);
            }
        }
        // Start typing after hero appears
        setTimeout(typeChar, 1200);
    }

    // ==========================================
    // TOUCH RIPPLE EFFECT ON BUTTONS
    // ==========================================
    document.querySelectorAll('.btn-primary, .btn-submit').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 0; height: 0;
                border-radius: 50%;
                background: rgba(255,255,255,0.4);
                transform: translate(-50%, -50%);
                animation: ripple-out 0.6s ease-out forwards;
                pointer-events: none;
                left: ${e.offsetX}px;
                top: ${e.offsetY}px;
            `;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Inject the ripple keyframe if not present
    if (!document.querySelector('#rippleStyle')) {
        const style = document.createElement('style');
        style.id = 'rippleStyle';
        style.textContent = `
            @keyframes ripple-out {
                to { width: 300px; height: 300px; opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    // PARALLAX TILT ON ABOUT CARDS (desktop only)
    // ==========================================
    if (!isMobile()) {
        document.querySelectorAll('.about-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -5;
                const rotateY = (x - centerX) / centerX * 5;
                card.style.transform = `translateY(-12px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
});