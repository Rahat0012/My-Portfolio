/* ============================================================
   PROJECT.JS — Portfolio Interactive Features
   Junayed Amin Rahat
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===== TYPED TEXT ANIMATION =====
    const typedEl = document.getElementById('typed');
    const phrases = [
        'CSE Student',
        'Flutter Developer',
        'Java Programmer',
        'Problem Solver',
        'Web Developer'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 120;

    function typeEffect() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            typedEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 60;
        } else {
            typedEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 120;
        }

        if (!isDeleting && charIndex === current.length) {
            isDeleting = true;
            typeDelay = 1600; // pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeDelay = 400;
        }

        setTimeout(typeEffect, typeDelay);
    }

    setTimeout(typeEffect, 600);


    // ===== NAVBAR SCROLL — HIDE ON DOWN, SHOW ON UP =====
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;

                // Scroll down to hide, scroll up to show
                if (currentScrollY > lastScrollY && currentScrollY > 80) {
                    navbar.classList.add('nav-hidden');
                } else {
                    navbar.classList.remove('nav-hidden');
                }

                // Background change
                if (currentScrollY > 60) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                // Back to top button
                if (currentScrollY > 400) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }

                lastScrollY = currentScrollY;
                highlightActiveNavLink();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });


    // ===== ACTIVE NAV LINK HIGHLIGHT =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightActiveNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }


    // ===== HAMBURGER MENU =====
    const hamburger = document.getElementById('hamburger');
    const navLinksEl = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        navLinksEl.classList.toggle('open');
        const spans = hamburger.querySelectorAll('span');
        if (navLinksEl.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Close menu on nav link click
    navLinksEl.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinksEl.classList.remove('open');
            hamburger.querySelectorAll('span').forEach(s => {
                s.style.transform = '';
                s.style.opacity = '';
            });
        });
    });


    // ===== BACK TO TOP =====
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // ===== SCROLL ANIMATIONS (AOS-like) =====
    const animatedEls = document.querySelectorAll('[data-aos]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    animatedEls.forEach(el => observer.observe(el));


    // ===== CONTACT FORM =====
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simulate sending (replace with real backend/EmailJS if needed)
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                formStatus.className = 'form-status success';
                formStatus.textContent = '✅ Message sent! I\'ll get back to you soon.';
                submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
                submitBtn.disabled = false;
                form.reset();

                setTimeout(() => {
                    formStatus.className = 'form-status';
                    formStatus.textContent = '';
                }, 5000);
            }, 1800);
        });
    }


    // ===== SMOOTH HOVER EFFECT ON PROJECT CARDS =====
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
            card.style.transform = `translateY(-8px) rotateX(${y}deg) rotateY(${x}deg)`;
            card.style.transition = 'transform 0.1s';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.4s ease';
        });
    });

});
