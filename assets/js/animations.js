/**
 * Owl.md Modern Animations
 * Focuses on micro-interactions and premium feel.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Systems
    new FloatingTilt();
    new CounterAnimation();
    new NavigationScroll();
});

/**
 * 3D Tilt Effect for Mockups & Cards
 * Adds a premium interactive feel on hover.
 */
class FloatingTilt {
    constructor() {
        this.elements = document.querySelectorAll('.floating, .bento-item, .theme-card');
        this.init();
    }

    init() {
        this.elements.forEach(el => {
            el.addEventListener('mousemove', (e) => this.handleMove(e, el));
            el.addEventListener('mouseleave', () => this.handleLeave(el));
        });
    }

    handleMove(e, el) {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Sensitivity
        const rotateX = ((y - centerY) / 20) * -1; // Invert for natural feel
        const rotateY = (x - centerX) / 20;

        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        el.style.transition = 'transform 0.1s ease'; // Snappy follow
    }

    handleLeave(el) {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        el.style.transition = 'transform 0.5s ease'; // Smooth reset
    }
}

/**
 * Number Counter Animation for Stats
 */
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-val');
        this.animated = false;
        this.init();
    }

    init() {
        // Use IntersectionObserver for better performance than scroll event
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animateCounters();
                    this.animated = true;
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats-row');
        if (statsSection) observer.observe(statsSection);
    }

    animateCounters() {
        this.counters.forEach(counter => {
            const originalText = counter.innerText;
            const target = parseFloat(originalText.replace(/,/g, '').replace(/\+/g, '').replace(/%/g, ''));
            
            if (isNaN(target)) return;

            const suffix = originalText.replace(/[0-9.]/g, '');
            const duration = 2000;
            const steps = 60;
            const stepValue = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += stepValue;
                if (current >= target) {
                    counter.innerText = originalText;
                    clearInterval(timer);
                } else {
                    // Format number?
                    counter.innerText = Math.floor(current) + suffix;
                }
            }, duration / steps);
        });
    }
}

/**
 * Navbar Logic (Cleaned up)
 */
class NavigationScroll {
    constructor() {
        this.nav = document.querySelector('.nav');
        if (this.nav) this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
        });
    }
}
