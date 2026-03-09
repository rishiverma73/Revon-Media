document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    let cursorVisible = true;
    let cursorEnlarged = false;

    // Default position (off-screen)
    let endX = window.innerWidth / 2;
    let endY = window.innerHeight / 2;
    let _x = 0;
    let _y = 0;

    function setupCursor() {
        if (!cursorDot || !cursorOutline) return;

        // Hide on touch devices
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            cursorDot.style.display = 'none';
            cursorOutline.style.display = 'none';
            document.documentElement.style.cursor = 'auto';
            return;
        }

        document.addEventListener('mousedown', () => {
            cursorEnlarged = true;
            toggleCursorSize();
        });
        document.addEventListener('mouseup', () => {
            cursorEnlarged = false;
            toggleCursorSize();
        });
        document.addEventListener('mousemove', (e) => {
            cursorVisible = true;
            toggleCursorVisibility();
            endX = e.clientX;
            endY = e.clientY;
            cursorDot.style.top = endY + 'px';
            cursorDot.style.left = endX + 'px';
        });

        // Add hover effect to interactive elements
        const hoverables = document.querySelectorAll('a, button, .magnetic-btn, input, textarea');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorEnlarged = true;
                toggleCursorSize();
                if (el.classList.contains('magnetic-btn')) {
                    cursorOutline.classList.add('cursor-hover');
                }
            });
            el.addEventListener('mouseleave', () => {
                cursorEnlarged = false;
                toggleCursorSize();
                cursorOutline.classList.remove('cursor-hover');
            });
        });

        requestAnimationFrame(animateCursor);
    }

    function toggleCursorSize() {
        if (!cursorOutline) return;
        if (cursorEnlarged) {
            cursorOutline.style.transform = `translate(-50%, -50%) scale(1.5)`;
            cursorOutline.style.backgroundColor = 'rgba(228, 61, 18, 0.1)';
        } else {
            cursorOutline.style.transform = `translate(-50%, -50%) scale(1)`;
            cursorOutline.style.backgroundColor = 'transparent';
        }
    }

    function toggleCursorVisibility() {
        if (!cursorDot || !cursorOutline) return;
        if (cursorVisible) {
            cursorDot.style.opacity = 1;
            cursorOutline.style.opacity = 1;
        } else {
            cursorDot.style.opacity = 0;
            cursorOutline.style.opacity = 0;
        }
    }

    function animateCursor() {
        // Easing for outline (creates drag effect)
        _x += (endX - _x) / 6;
        _y += (endY - _y) / 6;
        if (cursorOutline) {
            cursorOutline.style.top = _y + 'px';
            cursorOutline.style.left = _x + 'px';
        }
        requestAnimationFrame(animateCursor);
    }

    setupCursor();

    // Mobile menu toggle
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileBtn.classList.remove('active');
            });
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3D Tilt Effect for Cards
    const tiltCards = document.querySelectorAll('.tilt-card, .tilt-card-subtle');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const multiplier = card.classList.contains('tilt-card-subtle') ? 5 : 15;

            const rotateX = ((y - centerY) / centerY) * -multiplier;
            const rotateY = ((x - centerX) / centerX) * multiplier;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // Magnetic Buttons Element
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;

            const span = btn.querySelector('span');
            if (span) {
                span.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            }
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
            const span = btn.querySelector('span');
            if (span) {
                span.style.transform = `translate(0px, 0px)`;
            }
        });
    });

    // Parallax Effect
    const parallaxElements = document.querySelectorAll('.parallax-element');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-speed') || 0.1;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Contact Form Submission (Redirect to WhatsApp)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            if (!nameInput || !emailInput || !messageInput) return;

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            if (!name || !email || !message) return;

            const btn = contactForm.querySelector('button');
            if (!btn) return;

            const span = btn.querySelector('span');
            const originalText = span ? span.innerText : btn.innerText;

            if (span) span.innerText = 'Redirecting...';
            else btn.innerText = 'Redirecting...';

            btn.style.opacity = '0.8';
            btn.style.pointerEvents = 'none';
            btn.classList.add('pulse-glow');

            setTimeout(() => {
                // WhatsApp number from the footer link
                const phone = '917323014696';

                // Construct message
                const text = `Hello Revon Media!%0A%0A*Name*: ${encodeURIComponent(name)}%0A*Email*: ${encodeURIComponent(email)}%0A*Message*: ${encodeURIComponent(message)}`;
                const whatsappUrl = `https://wa.me/${phone}?text=${text}`;

                // Open WhatsApp in new tab
                window.open(whatsappUrl, '_blank');

                if (span) span.innerText = 'Sent!';
                else btn.innerText = 'Sent!';

                btn.style.backgroundColor = '#25D366'; // WhatsApp Green
                btn.style.borderColor = '#25D366';
                btn.style.color = '#fff';
                btn.classList.remove('pulse-glow');
                btn.classList.remove('btn-outline');
                contactForm.reset();

                setTimeout(() => {
                    if (span) span.innerText = originalText;
                    else btn.innerText = originalText;

                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                    btn.style.color = '';
                    btn.style.pointerEvents = 'auto';
                    btn.style.opacity = '1';
                    if (btn.classList.contains('btn-outline-original')) {
                        btn.classList.add('btn-outline');
                    }
                }, 4000);
            }, 800);
        });

        // Save original status for reset
        const submitBtn = contactForm.querySelector('button');
        if (submitBtn && submitBtn.classList.contains('btn-outline')) {
            submitBtn.classList.add('btn-outline-original');
        }
    }

    // Scroll Intersector (Reveal Animations)
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    // Initial setup
    revealElements.forEach(el => {
        el.classList.add('scroll-hide');
    });

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scroll-show');
                    entry.target.classList.remove('scroll-hide');
                    // Stop observing once revealed
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => {
            el.classList.add('scroll-show');
            el.classList.remove('scroll-hide');
        });
    }
});
