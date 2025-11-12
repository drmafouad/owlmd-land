/**
 * Main JavaScript File
 * Additional interactive features and utilities
 */

/**
 * Mobile Menu Toggle
 */
class MobileMenu {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.navLinks = document.querySelector('.nav-links');
        this.init();
    }

    init() {
        // Create mobile menu button if on mobile
        if (window.innerWidth <= 768) {
            this.createMenuButton();
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768 && !this.menuButton) {
                this.createMenuButton();
            } else if (window.innerWidth > 768 && this.menuButton) {
                this.removeMenuButton();
            }
        });
    }

    createMenuButton() {
        const button = document.createElement('button');
        button.className = 'menu-toggle';
        button.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        `;

        button.addEventListener('click', () => this.toggleMenu());
        this.nav.querySelector('.nav-content').appendChild(button);
        this.menuButton = button;

        // Add mobile menu styles
        this.addMobileStyles();
    }

    addMobileStyles() {
        if (!document.getElementById('mobile-menu-styles')) {
            const style = document.createElement('style');
            style.id = 'mobile-menu-styles';
            style.textContent = `
                .menu-toggle {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    border: none;
                    color: var(--text-primary);
                    cursor: pointer;
                    padding: 0.5rem;
                    z-index: 1001;
                }

                .nav-links.mobile-open {
                    display: flex !important;
                    flex-direction: column;
                    position: fixed;
                    top: 70px;
                    left: 0;
                    right: 0;
                    background: rgba(10, 14, 39, 0.98);
                    backdrop-filter: blur(20px);
                    padding: 2rem;
                    gap: 1.5rem;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .nav-links.mobile-open .nav-link {
                    font-size: 1.125rem;
                }
            `;
            document.head.appendChild(style);
        }
    }

    toggleMenu() {
        this.navLinks.classList.toggle('mobile-open');
    }

    removeMenuButton() {
        if (this.menuButton) {
            this.menuButton.remove();
            this.menuButton = null;
        }
        this.navLinks.classList.remove('mobile-open');
    }
}

/**
 * Feature Toggle/Accordion (for future use)
 */
class FeatureAccordion {
    constructor() {
        this.features = document.querySelectorAll('.feature-item');
        this.init();
    }

    init() {
        this.features.forEach(feature => {
            const header = feature.querySelector('.feature-header');
            if (header) {
                header.addEventListener('click', () => {
                    feature.classList.toggle('active');
                });
            }
        });
    }
}

/**
 * Screenshot Lazy Loading
 */
class LazyLoading {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            this.images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            this.images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }
}

/**
 * Video/GIF Autoplay on Scroll
 */
class MediaAutoplay {
    constructor() {
        this.videos = document.querySelectorAll('video[data-autoplay]');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.play();
                } else {
                    entry.target.pause();
                }
            });
        }, {
            threshold: 0.5
        });

        this.videos.forEach(video => observer.observe(video));
    }
}

/**
 * Copy to Clipboard Utility
 */
class CopyToClipboard {
    constructor() {
        this.buttons = document.querySelectorAll('[data-copy]');
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('click', () => {
                const text = button.dataset.copy;
                this.copyText(text);
                this.showFeedback(button);
            });
        });
    }

    async copyText(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }

    showFeedback(button) {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = 'var(--accent-green)';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }
}

/**
 * External Link Handler
 */
class ExternalLinks {
    constructor() {
        this.init();
    }

    init() {
        const links = document.querySelectorAll('a[href^="http"]');

        links.forEach(link => {
            // Add external link icon
            if (!link.hostname.includes(window.location.hostname)) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }
}

/**
 * Form Validation (for future newsletter/contact form)
 */
class FormValidation {
    constructor() {
        this.forms = document.querySelectorAll('form[data-validate]');
        this.init();
    }

    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required]');

        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showError(input, 'This field is required');
                isValid = false;
            } else if (input.type === 'email' && !this.validateEmail(input.value)) {
                this.showError(input, 'Please enter a valid email');
                isValid = false;
            } else {
                this.clearError(input);
            }
        });

        return isValid;
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showError(input, message) {
        const error = input.parentElement.querySelector('.error-message') ||
                     this.createErrorElement(message);

        input.classList.add('error');
        if (!input.parentElement.querySelector('.error-message')) {
            input.parentElement.appendChild(error);
        }
    }

    clearError(input) {
        input.classList.remove('error');
        const error = input.parentElement.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    }

    createErrorElement(message) {
        const error = document.createElement('span');
        error.className = 'error-message';
        error.textContent = message;
        error.style.cssText = 'color: #EF4444; font-size: 0.875rem; margin-top: 0.25rem;';
        return error;
    }
}

/**
 * Theme Switcher (Light/Dark mode - for future use)
 */
class ThemeSwitcher {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        document.documentElement.setAttribute('data-theme', this.theme);

        const toggleButton = document.querySelector('[data-theme-toggle]');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
    }
}

/**
 * Analytics Event Tracking
 */
class AnalyticsTracker {
    constructor() {
        this.init();
    }

    init() {
        // Track download button clicks
        const downloadButtons = document.querySelectorAll('[href*="play.google.com"]');
        downloadButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.trackEvent('download', 'click', 'google_play');
            });
        });

        // Track GitHub link clicks
        const githubLinks = document.querySelectorAll('[href*="github.com"]');
        githubLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('external_link', 'click', 'github');
            });
        });

        // Track section views
        this.trackSectionViews();
    }

    trackEvent(category, action, label) {
        // Integration point for analytics (GA4, Plausible, etc.)
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }

        // Plausible Analytics
        if (typeof plausible !== 'undefined') {
            plausible(action, { props: { category, label } });
        }

        console.log('Analytics:', category, action, label);
    }

    trackSectionViews() {
        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.trackEvent('section_view', 'view', entry.target.id);
                }
            });
        }, {
            threshold: 0.5
        });

        sections.forEach(section => observer.observe(section));
    }
}

/**
 * Performance Monitoring
 */
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Log page load time
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        });

        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.warn('Long task detected:', entry.duration.toFixed(2), 'ms');
                }
            });

            observer.observe({ entryTypes: ['longtask'] });
        }
    }
}

/**
 * Easter Egg (Fun secret feature)
 */
class EasterEgg {
    constructor() {
        this.sequence = [];
        this.code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            this.sequence.push(e.key);

            if (this.sequence.length > this.code.length) {
                this.sequence.shift();
            }

            if (this.sequence.join(',') === this.code.join(',')) {
                this.activate();
            }
        });
    }

    activate() {
        // Fun animation or special message
        const owl = document.querySelector('.logo-icon');
        if (owl) {
            owl.style.animation = 'rotate 1s ease-in-out';
            setTimeout(() => {
                owl.style.animation = '';
            }, 1000);
        }

        console.log('🦉 You found the secret! You\'re awesome!');
    }
}

/**
 * Initialize all features when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Core features
    new MobileMenu();
    new LazyLoading();
    new MediaAutoplay();
    new ExternalLinks();

    // Optional features
    new CopyToClipboard();
    new FormValidation();
    new AnalyticsTracker();
    new PerformanceMonitor();

    // Fun extras
    new EasterEgg();

    // Console message
    console.log(
        '%c🦉 Owl.md Landing Page',
        'font-size: 20px; font-weight: bold; color: #F59E0B;'
    );
    console.log(
        '%cBuilt with ❤️ by InjazApps',
        'font-size: 14px; color: #94A3B8;'
    );
});

/**
 * Service Worker Registration (for PWA functionality - future)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.registerServiceWorker('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}
