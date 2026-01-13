/**
 * 基金记账簿官网交互脚本
 */

(function() {
    'use strict';

    // DOM Ready
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initSmoothScroll();
        initScrollAnimations();
        initNavbarScroll();
    });

    /**
     * 移动端导航菜单
     */
    function initNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (navToggle && navLinks) {
            navToggle.addEventListener('click', function() {
                navLinks.classList.toggle('nav-open');
                navToggle.classList.toggle('active');
            });

            // 点击链接后关闭菜单
            navLinks.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() {
                    navLinks.classList.remove('nav-open');
                    navToggle.classList.remove('active');
                });
            });
        }
    }

    /**
     * 平滑滚动
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');

                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * 滚动动画
     */
    function initScrollAnimations() {
        const animateElements = document.querySelectorAll(
            '.feature-card, .highlight-item, .screenshot-item'
        );

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animateElements.forEach(function(el, index) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transitionDelay = (index % 4) * 0.1 + 's';
            observer.observe(el);
        });
    }

    /**
     * 导航栏滚动效果
     */
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            // 添加阴影效果
            if (currentScroll > 10) {
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.boxShadow = 'none';
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    /**
     * 截图横向滚动（可选：鼠标拖拽）
     */
    function initScreenshotScroll() {
        const scrollContainer = document.querySelector('.screenshot-scroll');
        if (!scrollContainer) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        scrollContainer.addEventListener('mousedown', function(e) {
            isDown = true;
            scrollContainer.classList.add('active');
            startX = e.pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
        });

        scrollContainer.addEventListener('mouseleave', function() {
            isDown = false;
            scrollContainer.classList.remove('active');
        });

        scrollContainer.addEventListener('mouseup', function() {
            isDown = false;
            scrollContainer.classList.remove('active');
        });

        scrollContainer.addEventListener('mousemove', function(e) {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 2;
            scrollContainer.scrollLeft = scrollLeft - walk;
        });
    }

})();
