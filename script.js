document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // PRELOADER
    // =========================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('loaded');
            }, 1200);
        });
        // Fallback in case load event already fired
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 2500);
    }

    // =========================================
    // PARTICLES BACKGROUND
    // =========================================
    const canvas = document.getElementById('particles-canvas');
    if (canvas && window.innerWidth > 900) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 50;
        const connectionDistance = 120;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(225, 6, 0, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = (1 - distance / connectionDistance) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(225, 6, 0, ${opacity})`;
                        ctx.lineWidth = 0.5;
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
            drawConnections();
            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    // =========================================
    // CURSOR GLOW (desktop only)
    // =========================================
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow && window.innerWidth > 900) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
            if (!cursorGlow.classList.contains('active')) {
                cursorGlow.classList.add('active');
            }
        });

        document.addEventListener('mouseleave', () => {
            cursorGlow.classList.remove('active');
        });
    }

    // =========================================
    // SCROLL REVEAL ANIMATIONS
    // =========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // =========================================
    // NAVBAR - Hide on scroll down, show on scroll up
    // =========================================
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (currentScrollY > 300 && currentScrollY > lastScrollY) {
            // Scrolling down past 300px
            navbar.classList.add('hidden');
        } else {
            // Scrolling up
            navbar.classList.remove('hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });

    // =========================================
    // MOBILE MENU
    // =========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('bx-menu');
                icon.classList.add('bx-x');
            } else {
                icon.classList.remove('bx-x');
                icon.classList.add('bx-menu');
            }
        });
    }

    // =========================================
    // SMOOTH SCROLL FOR ANCHORS
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navbarHeight = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.querySelector('i').classList.replace('bx-x', 'bx-menu');
                }
            }
        });
    });

    // =========================================
    // FEATURE CARDS - Staggered reveal
    // =========================================
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length > 0) {
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const cardIndex = Array.from(featureCards).indexOf(card);
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, cardIndex * 80);
                    cardObserver.unobserve(card);
                }
            });
        }, { threshold: 0.05 });

        featureCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            cardObserver.observe(card);
        });
    }

    // =========================================
    // STATION CARDS - Staggered reveal
    // =========================================
    const stationCards = document.querySelectorAll('.station-card');
    if (stationCards.length > 0) {
        const stationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const cardIndex = Array.from(stationCards).indexOf(card);
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateX(0)';
                    }, cardIndex * 150);
                    stationObserver.unobserve(card);
                }
            });
        }, { threshold: 0.2 });

        stationCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            stationObserver.observe(card);
        });
    }

});
