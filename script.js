// ===== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Special handling for skill items
            if (entry.target.classList.contains('skills-with-bars')) {
                const skillItems = entry.target.querySelectorAll('.skill-item');
                skillItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 100);
                });
            }
            
            // Special handling for project cards
            if (entry.target.classList.contains('projects-section')) {
                const projectCards = entry.target.querySelectorAll('.project-card');
                projectCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 150);
                });
            }

            // Special handling for education items
            if (entry.target.classList.contains('education-section')) {
                const educationItems = entry.target.querySelectorAll('.education-item');
                educationItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 150);
                });
            }
        }
    });
}, observerOptions);

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', () => {
    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .skills-with-bars, .projects-section, .education-section');
    animatedElements.forEach(el => observer.observe(el));

    // Animate circular progress bars when they become visible
    const progressBars = document.querySelectorAll('.progress-ring__progress');
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => progressObserver.observe(bar));

    // Header entrance animation
    setTimeout(() => {
        const header = document.querySelector('.header');
        if (header) {
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }
    }, 200);
});

// ===== INITIAL HEADER STYLES =====
// Add initial styles to header for entrance animation
const header = document.querySelector('.header');
if (header) {
    header.style.opacity = '0';
    header.style.transform = 'translateY(-30px)';
    header.style.transition = 'all 1s ease-out';
}

// ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== SCROLL TO TOP FUNCTIONALITY =====
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button based on scroll position
window.addEventListener('scroll', () => {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    }
});

// ===== LAZY LOADING FOR IMAGES =====
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== ACCESSIBILITY IMPROVEMENTS =====
// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Skip to main content with keyboard shortcut
    if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        const main = document.querySelector('main');
        if (main) {
            main.focus();
            main.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// ===== CONTACT FORM ENHANCEMENT (if form exists) =====
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add form validation and submission logic here
        console.log('Form submitted');
    });
}

// ===== THEME TOGGLE (optional feature) =====
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Load saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}

// ===== PRINT OPTIMIZATION =====
window.addEventListener('beforeprint', () => {
    // Hide animations and optimize for print
    document.body.classList.add('print-mode');
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('print-mode');
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // You could send error reports to a logging service here
});

// ===== PROGRESSIVE ENHANCEMENT =====
// Only run advanced features if browser supports them
if ('IntersectionObserver' in window) {
    console.log('Intersection Observer supported - animations enabled');
} else {
    console.log('Intersection Observer not supported - fallback styles applied');
    // Add fallback styles or polyfill
}

// ===== ANALYTICS HELPER (optional) =====
function trackEvent(eventName, properties = {}) {
    // Integration point for analytics services
    console.log('Event tracked:', eventName, properties);
    // Example: gtag('event', eventName, properties);
}

// Track page load
trackEvent('page_view', {
    page: window.location.pathname,
    timestamp: new Date().toISOString()
});

// ===== UTILITIES =====
// Utility function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Utility function to get CSS custom property value
function getCSSCustomProperty(property) {
    return getComputedStyle(document.documentElement).getPropertyValue(property);
}

// Utility function to set CSS custom property
function setCSSCustomProperty(property, value) {
    document.documentElement.style.setProperty(property, value);
}