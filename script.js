// === EmailJS configuration (replace placeholders with your EmailJS IDs) ===
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_HERO = 'YOUR_TEMPLATE_HERO';
const EMAILJS_TEMPLATE_CONTACT = 'YOUR_TEMPLATE_CONTACT';
const EMAILJS_USER_ID = 'YOUR_USER_ID'; // public key

if (window.emailjs && typeof emailjs.init === 'function') {
    try { emailjs.init(EMAILJS_USER_ID); } catch (e) { console.warn('emailjs.init failed', e); }
} else {
    console.warn('EmailJS SDK not detected. Make sure the SDK script is included before script.js');
}

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


        // Mobile menu open/close with smooth animations and scroll lock
        if (menuBtn && mobileMenu) {
            function openMobileMenu() {
                mobileMenu.classList.remove('hidden');
                // force reflow so the transition fires
                void mobileMenu.offsetWidth;
                mobileMenu.classList.add('open');
                document.body.style.overflow = 'hidden';
                menuBtn.setAttribute('aria-expanded', 'true');
            }

            function closeMobileMenu() {
                mobileMenu.classList.remove('open');
                mobileMenu.classList.add('closing');
                menuBtn.setAttribute('aria-expanded', 'false');
                // allow page to scroll again
                document.body.style.overflow = '';

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


