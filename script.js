const closeMenuBtn = document.getElementById("closeMenuBtn");

if (closeMenuBtn) {
    closeMenuBtn.addEventListener("click", () => {
        if (typeof closeMobileMenu === 'function') closeMobileMenu();
        else mobileMenu.classList.add('hidden');
    });
}

const body = document.body;
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const siteNav = document.getElementById("siteNav");

// Robust scroll lock 
let _scrollLockPos = 0;
let _isScrollLocked = false;
function lockScroll() {
    if (_isScrollLocked) return;
    _scrollLockPos = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${_scrollLockPos}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    _isScrollLocked = true;
}

function unlockScroll() {
    if (!_isScrollLocked) return;
    document.body.style.position = '';
    const top = document.body.style.top;
    document.body.style.top = '';
    // restore scroll position
    window.scrollTo(0, _scrollLockPos || 0);
    _scrollLockPos = 0;
    _isScrollLocked = false;
}


        // Mobile menu open/close with smooth animations and scroll lock
        if (menuBtn && mobileMenu) {
            function openMobileMenu() {
                mobileMenu.classList.remove('hidden');
                // force reflow so the transition fires
                void mobileMenu.offsetWidth;
                mobileMenu.classList.add('open');
                // lock background scroll while menu is open
                lockScroll();
                menuBtn.setAttribute('aria-expanded', 'true');
            }

            function closeMobileMenu() {
                mobileMenu.classList.remove('open');
                mobileMenu.classList.add('closing');
                menuBtn.setAttribute('aria-expanded', 'false');
                // restore page scroll
                unlockScroll();

                const handler = function (e) {
                    if (e.target === mobileMenu) {
                        mobileMenu.classList.remove('closing');
                        mobileMenu.classList.add('hidden');
                        mobileMenu.removeEventListener('transitionend', handler);
                    }
                };
                mobileMenu.addEventListener('transitionend', handler);
            }

            menuBtn.addEventListener('click', () => {
                if (mobileMenu.classList.contains('open')) closeMobileMenu();
                else openMobileMenu();
            });

            // close mobile menu when a link is clicked (smooth close)
            mobileMenu.querySelectorAll('a').forEach((a) =>
                a.addEventListener('click', () => closeMobileMenu())
            );
        }

        // Add shadow when scrolled
        window.addEventListener("scroll", () => {
            if (window.scrollY > 20) siteNav.classList.add("shadow");
            else siteNav.classList.remove("shadow");
        });

        // reveal animations
        document.addEventListener("DOMContentLoaded", () => {
            document
                .querySelectorAll(".reveal")
                .forEach((el, i) =>
                    setTimeout(() => el.classList.add("visible"), i * 80)
                );
        });

        // smooth anchor scrolling
        document.querySelectorAll('a[href^="#"]').forEach((a) => {
            a.addEventListener("click", (e) => {
                const href = a.getAttribute("href");
                if (href && href.startsWith("#")) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: "smooth", block: "start" });
                        // close mobile menu if open (smooth close)
                        if (mobileMenu && mobileMenu.classList.contains('open')) closeMobileMenu();
                    }
                }

            
            });
        });
        // Testimonial rotation with touch swipe support
        const testimonials = document.querySelectorAll(".testimonial");
        const testimonialContainer = document.getElementById(
            "testimonialContainer"
        );
        let currentTestimonial = 0;
        let testimonialInterval;
        let touchStartX = 0;

        function showTestimonial(index) {
            testimonials.forEach((t, i) => {
                t.classList.toggle("active", i === index);
            });
        }

        function nextTestimonial() {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }

        function startAutoRotate() {
            if (testimonialInterval) clearInterval(testimonialInterval);
            testimonialInterval = setInterval(nextTestimonial, 5000);
        }

        if (testimonials.length > 0) {
            // Initialize: show first testimonial
            showTestimonial(0);
            startAutoRotate();

            // Touch swipe support for mobile
            if (testimonialContainer) {
                testimonialContainer.addEventListener("touchstart", (e) => {
                    touchStartX = e.touches[0].clientX;
                    if (testimonialInterval) clearInterval(testimonialInterval);
                });

                testimonialContainer.addEventListener("touchend", (e) => {
                    const touchEndX = e.changedTouches[0].clientX;
                    const swipeDistance = touchStartX - touchEndX;

                    // Swipe left → next, right → prev
                    if (swipeDistance > 50) {
                        nextTestimonial();
                    } else if (swipeDistance < -50) {
                        currentTestimonial =
                            (currentTestimonial - 1 + testimonials.length) %
                            testimonials.length;
                        showTestimonial(currentTestimonial);
                    }
                    startAutoRotate();
                });
            }
        }


// Smooth anchor scrolling with mobile menu close
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return; 
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // close mobile menu (if open)
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
    }
  });
});

    
    ;(function () {
        const COUNTER_DURATION = 1200;
        const aboutSection = document.getElementById('about');
        let animating = false;

        function formatNumber(value) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        function resetCounts() {
            const counts = document.querySelectorAll('.count');
            counts.forEach((el) => {
                const suffix = el.getAttribute('data-suffix') || '';
                el.textContent = '0' + suffix;
            });
        }

        function animateCounters() {
            const counts = Array.from(document.querySelectorAll('.count'));
            if (!counts.length) return;
            if (animating) return;
            animating = true;

            const startTime = performance.now();
            const targets = counts.map((el) => {
                const t = parseInt(el.getAttribute('data-target') || '0', 10) || 0;
                const suffix = el.getAttribute('data-suffix') || '';
                return { el, target: t, suffix };
            });

            function step(now) {
                const elapsed = Math.min(now - startTime, COUNTER_DURATION);
                const progress = elapsed / COUNTER_DURATION;

                targets.forEach(({ el, target, suffix }) => {
                    const value = Math.floor(target * progress);
                    el.textContent = formatNumber(value) + suffix;
                });

                if (elapsed < COUNTER_DURATION) {
                    requestAnimationFrame(step);
                } else {
                    targets.forEach(({ el, target, suffix }) => {
                        el.textContent = formatNumber(target) + suffix;
                    });
                    animating = false;
                }
            }

            requestAnimationFrame(step);
        }

        if ('IntersectionObserver' in window && aboutSection) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                       
                        resetCounts();
                        
                        setTimeout(animateCounters, 60);
                    } else {
                        
                        resetCounts();
                    }
                });
            }, { threshold: 0.35 });

            io.observe(aboutSection);
        } else {
           
            document.addEventListener('DOMContentLoaded', () => {
                resetCounts();
                setTimeout(animateCounters, 300);
            });
        }
    })();

   
        (function () {
            function sanitizeNameInput(el) {
                if (!el) return;
                // remove digits on input
                el.addEventListener('input', (e) => {
                    const pos = el.selectionStart;
                    const newVal = el.value.replace(/\d+/g, '');
                    if (newVal !== el.value) {
                        el.value = newVal;
                        try { el.setSelectionRange(Math.max(0, pos - 1), Math.max(0, pos - 1)); } catch (er) { }
                    }
                });

                // prevent pasting numbers
                el.addEventListener('paste', (e) => {
                    e.preventDefault();
                    const text = (e.clipboardData || window.clipboardData).getData('text') || '';
                    el.value += text.replace(/\d+/g, '');
                });
            }

            function sanitizePhoneInput(el) {
                if (!el) return;
                // live-format as US phone number while typing
                function formatUS(digits) {
                    if (!digits) return '';
                    // allow leading 1 for country code
                    const leadingOne = digits[0] === '1';
                    let main = leadingOne ? digits.slice(1) : digits;
                    if (main.length > 10) main = main.slice(0, 10);

                    let formatted = '';
                    if (leadingOne) formatted = '1 ';

                    if (main.length <= 3) {
                        formatted += main;
                    } else if (main.length <= 6) {
                        formatted += '(' + main.slice(0, 3) + ') ' + main.slice(3);
                    } else {
                        formatted += '(' + main.slice(0, 3) + ') ' + main.slice(3, 6) + '-' + main.slice(6);
                    }

                    return formatted;
                }

                el.addEventListener('input', (e) => {
                    const selStart = el.selectionStart;
                    // keep only digits internally
                    const rawDigits = el.value.replace(/\D+/g, '');
                    const limited = rawDigits.slice(0, 11);
                    const formatted = formatUS(limited);
                    el.value = formatted;
                    // try to restore cursor near the end (best-effort)
                    try { el.setSelectionRange(el.value.length, el.value.length); } catch (er) { }
                });

                // paste: accept digits only and format
                el.addEventListener('paste', (e) => {
                    e.preventDefault();
                    const text = (e.clipboardData || window.clipboardData).getData('text') || '';
                    const digits = text.replace(/\D+/g, '');
                    const combined = (el.value.replace(/\D+/g, '') + digits).slice(0, 11);
                    el.value = formatUS(combined);
                });
            }

            document.addEventListener('DOMContentLoaded', () => {
                // Hero form fields
                const heroName = document.getElementById('hero_name');
                const heroPhone = document.getElementById('hero_phone');
                sanitizeNameInput(heroName);
                sanitizePhoneInput(heroPhone);

                const heroForm = document.getElementById('heroForm');
                if (heroForm) {
                    heroForm.addEventListener('submit', (e) => {
                        const phoneVal = (heroPhone && heroPhone.value) ? heroPhone.value.replace(/\D+/g, '') : '';
                        if (!(phoneVal.length === 10 || phoneVal.length === 11)) {
                            e.preventDefault();
                            alert('Please enter a valid US phone number (10 or 11 digits).');
                            if (heroPhone) heroPhone.focus();
                            return false;
                        }
                    });
                }

                // Contact form name sanitization + submit check
                const contactName = document.querySelector('#contactForm input[name="name"]');
                sanitizeNameInput(contactName);

                const contactForm = document.getElementById('contactForm');
                if (contactForm) {
                    contactForm.addEventListener('submit', (e) => {
                        const nameVal = (contactName && contactName.value) ? contactName.value : '';
                        if (/\d/.test(nameVal)) {
                            e.preventDefault();
                            alert('Name cannot contain numbers.');
                            if (contactName) contactName.focus();
                            return false;
                        }
                    });
                }
            });
        })();


// ================= FORM SUBMIT HANDLER =================
const heroForm = document.getElementById('heroForm');
const contactForm = document.getElementById('contactForm');

if (heroForm) {
    heroForm.addEventListener('submit', e => {
        e.preventDefault();
        sendEmail(heroForm);
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        sendEmail(contactForm);
    });
}

// ================= NAME SANITIZATION & PHONE FORMAT (hero + contact) =================
function attachSimpleSanitizers(nameId, phoneId) {
    const nameEl = document.getElementById(nameId);
    if (nameEl) {
        nameEl.addEventListener('input', () => {
            nameEl.value = nameEl.value.replace(/[^a-zA-Z\s.'-]/g, '');
        });
    }

    const phoneEl = document.getElementById(phoneId);
    if (phoneEl) {
        phoneEl.setAttribute('maxlength', '14');
    }
}

attachSimpleSanitizers('hero_name', 'hero_phone');
attachSimpleSanitizers('contact_name', 'contact_phone');

const formatPhone = digits => {
    if (digits.length > 6)
        return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6,10)}`;
    if (digits.length > 3)
        return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
    return digits ? `(${digits}` : '';
};

// live-format on input for any phone fields
document.addEventListener('input', (e) => {
    const el = e.target;
    if (!el || el.tagName !== 'INPUT') return;
    if (el.id === 'hero_phone' || el.id === 'contact_phone') {
        let digits = el.value.replace(/\D/g, '').slice(0, 10);
        el.value = formatPhone(digits);
    }
});

document.addEventListener('blur', (e) => {
    const el = e.target;
    if (!el || el.tagName !== 'INPUT') return;
    if (el.id === 'hero_phone' || el.id === 'contact_phone') {
        let digits = el.value.replace(/\D/g, '');
        el.value = digits.length === 10 ? formatPhone(digits) : digits;
    }
}, true);

// ================= SEND EMAIL =================
async function sendEmail(form) {
    if (!form) return;
    if (form.dataset.sending === 'true') return;
    form.dataset.sending = 'true';

    // ===== SUBMIT BUTTON + LOADER =====
    const submitBtn = form.querySelector("button[type='submit']");
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
            '<span class="spinner-border spinner-border-sm"></span> Sending...';
    }

    const nameField = form.querySelector('input[name="name"]');
    const emailField = form.querySelector('input[name="email"]');
    const phoneField = form.querySelector('input[name="phone"]');
    const messageField = form.querySelector('textarea[name="message"]');

    const userName = nameField && nameField.value.trim()
        ? nameField.value.trim().split(' ')[0]
        : 'there';

    const phoneDigits = phoneField?.value.replace(/\D/g, '') || '';

    if (phoneDigits.length !== 10) {
        Swal.fire({
            title: "Invalid Phone 😕",
            text: "Please enter a valid 10-digit phone number.",
            icon: "warning",
            confirmButtonColor: "#137752"
        });

        form.dataset.sending = 'false';
        phoneField?.focus();

        // loader OFF
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
        return;
    }

    phoneField.value = formatPhone(phoneDigits);

    const data = {
        name: nameField?.value.trim() || '',
        email: emailField?.value.trim() || '',
        phone: phoneField?.value.trim() || '',
        message: messageField?.value.trim() || ''
    };

    try {
        const res = await fetch(
            "https://script.google.com/macros/s/AKfycbyu2FndqTvHx1WzF7OY-TnxrHraypDkBX4DLmzBpoTVRqEmd_0bnjrokgwmIO9N-nEQzA/exec",
            {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(data)
            }
        );

        const result = await res.json();

        if (result.status === "success") {
            Swal.fire({
                title: `Thank you, ${userName}!`,
                html: `
                    <p style="font-size:15px;">
                         We’ve received your message.<br>
                       Our team will connect with you shortly.
                    </p>
                    <p style="margin-top:18px;font-weight:bold;font-size:1.1rem;color:#000;">
              – Ember Brokerage Team
            </p>
                `,
                icon: "success",
                confirmButtonText: "Close",
                confirmButtonColor: "#137752"
            });

            form.reset();
        } else {
            throw new Error("Submission failed");
        }
    } catch (err) {
        Swal.fire({
            title: "Oops! 😬",
            text: "Something went wrong. Please try again.",
            icon: "error",
            confirmButtonColor: "#137752"
        });
    } finally {
        form.dataset.sending = 'false';

        // ===== LOADER OFF =====
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }
}

