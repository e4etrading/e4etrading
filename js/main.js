/* ============================================
   Е4Е ТРЕЙДИНГ — Main JS
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ========== Mobile Navigation ========== */
    var navToggle = document.querySelector('.nav-toggle');
    var navWrapper = document.querySelector('.header__nav-wrapper');
    var headerEl = document.querySelector('.header__inner');
    var overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    var scrollPos = 0;
    var menuIsOpen = false;

    function openMenu() {
        scrollPos = window.pageYOffset;
        document.body.appendChild(navWrapper);
        navToggle.classList.add('is-open');
        requestAnimationFrame(function () {
            navWrapper.classList.add('is-open');
        });
        overlay.classList.add('is-visible');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');
        document.body.style.top = -scrollPos + 'px';
        menuIsOpen = true;
    }

    function closeMenu() {
        navToggle.classList.remove('is-open');
        navWrapper.classList.remove('is-open');
        overlay.classList.remove('is-visible');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
        document.body.style.top = '';
        window.scrollTo(0, scrollPos);
        menuIsOpen = false;
        setTimeout(function () {
            if (!menuIsOpen) {
                headerEl.appendChild(navWrapper);
            }
        }, 350);
    }

    if (navToggle && navWrapper) {
        navToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (navToggle.classList.contains('is-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        overlay.addEventListener('click', closeMenu);

        document.querySelectorAll('.nav__link').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navToggle.classList.contains('is-open')) {
                closeMenu();
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 880 && navToggle.classList.contains('is-open')) {
                closeMenu();
            }
        });
    }

    /* ========== Scroll animations ========== */
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });

        document.querySelectorAll('.fade-up').forEach(function (el) {
            observer.observe(el);
        });
    } else {
        document.querySelectorAll('.fade-up').forEach(function (el) {
            el.classList.add('is-visible');
        });
    }

    /* ========== Contact form (Formspree) ========== */
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            let valid = true;
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(function (field) {
                if (!field.value.trim() || (field.type === 'checkbox' && !field.checked)) {
                    field.style.borderColor = 'var(--color-error)';
                    valid = false;
                } else {
                    field.style.borderColor = '';
                }
            });

            if (!valid) {
                showFormMessage('Будь ласка, заповніть усі обов\'язкові поля', 'error');
                return;
            }

            const submitBtn = form.querySelector('.form-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Надсилаємо...';

            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            }).then(function (response) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                if (response.ok) {
                    form.reset();
                    showFormMessage('Дякуємо! Ваше повідомлення надіслано. Ми зв\'яжемося з вами найближчим часом.', 'success');
                } else {
                    showFormMessage('Виникла помилка при надсиланні. Спробуйте ще раз.', 'error');
                }
            }).catch(function () {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                showFormMessage('Помилка мережі. Перевірте з\'єднання та спробуйте ще раз.', 'error');
            });
        });

        // Убираем красную рамку при редактировании
        form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(function (field) {
            field.addEventListener('input', function () {
                field.style.borderColor = '';
            });
        });
    }

    function showFormMessage(message, type) {
        let messageEl = document.querySelector('.form-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = 'form-message';
            const formCard = document.querySelector('.form-card');
            if (formCard) formCard.appendChild(messageEl);
        }
        messageEl.textContent = message;
        messageEl.className = 'form-message form-message--' + type;

        // Стили
        messageEl.style.cssText = 'margin-top: 1rem; padding: 1rem 1.25rem; border-radius: 8px; font-size: 0.925rem; font-weight: 500; animation: slideIn 0.4s ease;';
        if (type === 'success') {
            messageEl.style.background = 'rgba(16, 185, 129, 0.1)';
            messageEl.style.color = '#16a34a';
            messageEl.style.border = '1px solid rgba(16, 185, 129, 0.25)';
        } else {
            messageEl.style.background = 'rgba(239, 68, 68, 0.1)';
            messageEl.style.color = '#b91c1c';
            messageEl.style.border = '1px solid rgba(239, 68, 68, 0.25)';
        }

        if (type === 'success') {
            setTimeout(function () {
                messageEl.style.opacity = '0';
                messageEl.style.transition = 'opacity 0.4s ease';
                setTimeout(function () { messageEl.remove(); }, 400);
            }, 6000);
        }
    }

    /* ========== Phone number formatting ========== */
    const phoneInput = document.querySelector('input[name="phone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.startsWith('380')) value = value.substring(0, 12);
            else if (value.length > 10) value = value.substring(0, 10);

            if (value.length > 0) {
                if (value.startsWith('380')) {
                    value = '+' + value.substring(0, 3) + ' ' +
                        (value.substring(3, 5)) + ' ' +
                        (value.substring(5, 8)) + ' ' +
                        (value.substring(8, 10)) + ' ' +
                        (value.substring(10, 12));
                    value = value.trim();
                }
            }
            e.target.value = value;
        });
    }

    /* ========== Header scroll effect ========== */
    const header = document.querySelector('.header');
    if (header) {
        let lastScroll = 0;
        window.addEventListener('scroll', function () {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 50) {
                header.style.background = 'rgba(9, 13, 19, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.2)';
            } else {
                header.style.background = 'rgba(9, 13, 19, 0.92)';
                header.style.boxShadow = 'none';
            }
            lastScroll = currentScroll;
        });
    }

    /* ========== Counter animation for stats ========== */
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length && 'IntersectionObserver' in window) {
        const counterObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        counters.forEach(function (c) { counterObs.observe(c); });
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.count, 10);
        const duration = 1600;
        const start = performance.now();
        const suffix = el.dataset.suffix || '';

        function frame(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }
});

