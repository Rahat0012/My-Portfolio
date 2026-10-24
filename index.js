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
        'Blockchain Developer',
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
    const subjectHidden = document.getElementById('form-subject-hidden');

    if (form) {
        const showStatus = (type, html) => {
            formStatus.className = `form-status ${type}`;
            formStatus.innerHTML = html;
            formStatus.style.display = 'block';
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                showStatus('error', '<i class="fa-solid fa-circle-exclamation"></i> Please fill in all fields.');
                return;
            }

            const originalBtnHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            if (subjectHidden) {
                subjectHidden.value = `[Portfolio] ${subject} - from ${name}`;
            }

            const mailtoFallback = () => {
                const mailtoUrl = `mailto:aminrahat700@gmail.com?subject=${encodeURIComponent('[Portfolio] ' + subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
                window.location.href = mailtoUrl;
            };

            // If browsing directly as a file:// (FormSubmit requires a web server)
            if (window.location.protocol === 'file:') {
                setTimeout(() => {
                    mailtoFallback();
                    showStatus('success', '📧 Opening your email app to send the message to <strong>aminrahat700@gmail.com</strong>.<br><small style="color:var(--text-muted);">(Note: On a live server or GitHub Pages, messages will send directly in the background!)</small>');
                    submitBtn.innerHTML = originalBtnHTML;
                    submitBtn.disabled = false;
                    form.reset();
                }, 600);
                return;
            }

            try {
                const response = await fetch('https://formsubmit.co/ajax/aminrahat700@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        _subject: `[Portfolio] ${subject} - from ${name}`,
                        message: message,
                        _captcha: 'false',
                        _template: 'table'
                    })
                });

                const data = await response.json();

                if (response.ok && (data.success === 'true' || data.success === true)) {
                    showStatus('success', '<i class="fa-solid fa-circle-check"></i> Message sent successfully! I will get back to you soon.');
                    form.reset();
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                        formStatus.className = 'form-status';
                    }, 6000);
                } else {
                    throw new Error(data.message || 'Form submission failed');
                }
            } catch (err) {
                console.warn('Direct send failed, opening email client fallback:', err);
                mailtoFallback();
                showStatus('info', '<i class="fa-solid fa-envelope-open-text"></i> Opening your email client to send the message directly to <strong>aminrahat700@gmail.com</strong>.');
            } finally {
                submitBtn.innerHTML = originalBtnHTML;
                submitBtn.disabled = false;
            }
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
