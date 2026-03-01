/**
 * 基金记账簿官网 — 交互与动画
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initNavigation();
        initNavbarScroll();
        initSmoothScroll();
        initScreenshotCarousel();
        // Delay animation init to ensure layout is complete
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                initScrollAnimations();
            });
        });
    });

    /* ========================
       Navigation
       ======================== */
    function initNavigation() {
        var toggle = document.getElementById('navToggle');
        var links = document.getElementById('navLinks');
        if (!toggle || !links) return;

        toggle.addEventListener('click', function () {
            links.classList.toggle('nav-open');
            toggle.classList.toggle('active');
        });

        links.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                links.classList.remove('nav-open');
                toggle.classList.remove('active');
            });
        });
    }

    /* ========================
       Navbar scroll effect
       ======================== */
    function initNavbarScroll() {
        var navbar = document.getElementById('navbar');
        if (!navbar) return;

        function onScroll() {
            if (window.pageYOffset > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ========================
       Smooth scroll
       ======================== */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;

                var target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();
                var navH = document.querySelector('.navbar').offsetHeight;
                var top = target.getBoundingClientRect().top + window.pageYOffset - navH;

                window.scrollTo({ top: top, behavior: 'smooth' });
            });
        });
    }

    /* ========================
       Scroll-triggered animations
       ======================== */
    function initScrollAnimations() {
        var elements = document.querySelectorAll('[data-animate]');
        if (!elements.length) return;

        // Reveal an element with its configured delay
        function reveal(el) {
            var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
            setTimeout(function () {
                el.classList.add('is-visible');
            }, delay);
        }

        // For elements already in the viewport on load, reveal immediately
        elements.forEach(function (el) {
            var rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                reveal(el);
                el.setAttribute('data-revealed', 'true');
            }
        });

        // Observe remaining elements for scroll-triggered reveal
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        reveal(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
        );

        elements.forEach(function (el) {
            if (!el.getAttribute('data-revealed')) {
                observer.observe(el);
            }
        });
    }

    /* ========================
       Screenshot Carousel
       ======================== */
    function initScreenshotCarousel() {
        var track = document.getElementById('screenshotTrack');
        var prevBtn = document.getElementById('screenshotPrev');
        var nextBtn = document.getElementById('screenshotNext');
        var dotsContainer = document.getElementById('screenshotDots');

        if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

        var slides = track.querySelectorAll('.screenshot-slide');
        var dots = dotsContainer.querySelectorAll('.screenshot-dot');
        var currentIndex = 0;
        var total = slides.length;
        var autoTimer = null;

        function goTo(index) {
            if (index < 0) index = total - 1;
            if (index >= total) index = 0;
            currentIndex = index;

            track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function next() { goTo(currentIndex + 1); }
        function prev() { goTo(currentIndex - 1); }

        prevBtn.addEventListener('click', function () {
            prev();
            resetAuto();
        });

        nextBtn.addEventListener('click', function () {
            next();
            resetAuto();
        });

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                goTo(parseInt(this.getAttribute('data-index'), 10));
                resetAuto();
            });
        });

        // Touch support
        var startX = 0;
        var isDragging = false;

        track.addEventListener('touchstart', function (e) {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        track.addEventListener('touchend', function (e) {
            if (!isDragging) return;
            isDragging = false;
            var diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? next() : prev();
                resetAuto();
            }
        }, { passive: true });

        // Auto-play
        function startAuto() {
            autoTimer = setInterval(next, 4500);
        }

        function resetAuto() {
            clearInterval(autoTimer);
            startAuto();
        }

        startAuto();
    }

})();
