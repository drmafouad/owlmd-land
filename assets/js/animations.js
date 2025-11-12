/**
 * Scroll Animations System
 * Lightweight AOS (Animate On Scroll) implementation
 */

class ScrollAnimations {
    constructor() {
        this.elements = [];
        this.offset = 100; // Trigger animation 100px before element enters viewport
        this.init();
    }

    init() {
        // Find all elements with data-aos attribute
        this.elements = Array.from(document.querySelectorAll('[data-aos]'));

        // Initial check for elements already in viewport
        this.checkElements();

        // Listen to scroll events
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.checkElements());
    }

    handleScroll() {
        requestAnimationFrame(() => this.checkElements());
    }

    checkElements() {
        this.elements.forEach(element => {
            if (this.isInViewport(element) && !element.classList.contains('aos-animate')) {
                element.classList.add('aos-animate');
            }
        });
    }

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        return (
            rect.top <= windowHeight - this.offset &&
            rect.bottom >= 0
        );
    }
}

/**
 * Parallax Effect for Hero Section
 */
class ParallaxEffect {
    constructor() {
        this.parallaxElements = document.querySelectorAll('.parallax');
        this.init();
    }

    init() {
        if (this.parallaxElements.length === 0) return;

        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    handleScroll() {
        const scrolled = window.pageYOffset;

        this.parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    handleMouseMove(e) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const xPos = (clientX - innerWidth / 2) / innerWidth;
        const yPos = (clientY - innerHeight / 2) / innerHeight;

        // Apply subtle parallax to mockups
        const mockups = document.querySelectorAll('.phone-mockup');
        mockups.forEach(mockup => {
            const movement = 20; // Max movement in pixels
            const x = xPos * movement;
            const y = yPos * movement;
            mockup.style.transform = `translate(${x}px, ${y}px) translateZ(0)`;
        });
    }
}

/**
 * Scroll Progress Indicator
 */
class ScrollProgress {
    constructor() {
        this.createProgressBar();
        this.init();
    }

    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.transform = 'scaleX(0)';
        document.body.appendChild(progressBar);
        this.progressBar = progressBar;
    }

    init() {
        window.addEventListener('scroll', () => this.updateProgress());
    }

    updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / documentHeight);

        this.progressBar.style.transform = `scaleX(${progress})`;
    }
}

/**
 * Smooth Scroll for Navigation Links
 */
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                const target = document.getElementById(targetId);

                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed nav
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

/**
 * Navigation Background on Scroll
 */
class NavigationScroll {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.init();
    }

    init() {
        if (!this.nav) return;

        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        const scrolled = window.pageYOffset;

        if (scrolled > 50) {
            this.nav.style.background = 'rgba(10, 14, 39, 0.95)';
            this.nav.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
        } else {
            this.nav.style.background = 'rgba(10, 14, 39, 0.8)';
            this.nav.style.boxShadow = 'none';
        }
    }
}

/**
 * Floating Animation for Hero Mockup
 */
class FloatingAnimation {
    constructor() {
        this.mockups = document.querySelectorAll('.floating');
        this.init();
    }

    init() {
        // Mockups already have CSS animation, but we can add interactive tilt
        this.mockups.forEach(mockup => {
            mockup.addEventListener('mouseenter', () => {
                mockup.style.animationPlayState = 'paused';
            });

            mockup.addEventListener('mouseleave', () => {
                mockup.style.animationPlayState = 'running';
            });

            mockup.addEventListener('mousemove', (e) => {
                const rect = mockup.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                mockup.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            });

            mockup.addEventListener('mouseleave', () => {
                mockup.style.transform = '';
            });
        });
    }
}

/**
 * Counter Animation for Stats
 */
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-value');
        this.animated = false;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (!this.animated && this.isStatsInViewport()) {
                this.animateCounters();
                this.animated = true;
            }
        });
    }

    isStatsInViewport() {
        const stats = document.querySelector('.hero-stats');
        if (!stats) return false;

        const rect = stats.getBoundingClientRect();
        return rect.top <= window.innerHeight && rect.bottom >= 0;
    }

    animateCounters() {
        this.counters.forEach(counter => {
            const target = counter.textContent;

            // Check if it's a number
            if (target.match(/\d+/)) {
                const value = parseInt(target.match(/\d+/)[0]);
                const suffix = target.replace(/\d+/, '');
                let current = 0;
                const increment = value / 50; // 50 frames
                const duration = 2000; // 2 seconds
                const interval = duration / 50;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= value) {
                        counter.textContent = value + suffix;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current) + suffix;
                    }
                }, interval);
            }
        });
    }
}

/**
 * Theme Card Hover Effects
 */
class ThemeCardEffects {
    constructor() {
        this.cards = document.querySelectorAll('.theme-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.cards.forEach(c => {
                    if (c !== card) {
                        c.style.opacity = '0.6';
                    }
                });
            });

            card.addEventListener('mouseleave', () => {
                this.cards.forEach(c => {
                    c.style.opacity = '1';
                });
            });
        });
    }
}

/**
 * Feature Mockup Animations
 */
class FeatureMockupAnimations {
    constructor() {
        this.features = document.querySelectorAll('.feature-showcase');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const mockup = entry.target.querySelector('.phone-mockup');
                    if (mockup) {
                        mockup.style.animation = 'phoneFloat 6s ease-in-out infinite';
                    }
                }
            });
        }, {
            threshold: 0.5
        });

        this.features.forEach(feature => observer.observe(feature));
    }
}

/**
 * Initialize all animations when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all animation systems
    new ScrollAnimations();
    new ParallaxEffect();
    new ScrollProgress();
    new SmoothScroll();
    new NavigationScroll();
    new FloatingAnimation();
    new CounterAnimation();
    new ThemeCardEffects();
    new FeatureMockupAnimations();

    // Add loaded class to body for any CSS transitions
    document.body.classList.add('loaded');
});

/**
 * Performance optimization: Use passive event listeners
 */
if (window.addEventListener) {
    window.addEventListener('scroll', () => {}, { passive: true });
    window.addEventListener('touchmove', () => {}, { passive: true });
}
