// ===== FONCTIONS UTILITAIRES POUR LES JAUGES =====
function calculateProgressValue(percentage, radius = 35) {
    const circumference = 2 * Math.PI * radius;
    const progress = circumference - (percentage / 100) * circumference;
    return progress;
}

function getCurrentRadius() {
    if (window.innerWidth <= 480) {
        return 25; // Très petit écran
    } else if (window.innerWidth <= 768) {
        return 30; // Tablette/mobile
    }
    return 35; // Desktop
}

function getCurrentCenter(radius) {
    return radius + 5; // Centrage dans le SVG
}

// ===== MISE À JOUR DES JAUGES SELON LA TAILLE D'ÉCRAN =====
function updateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-ring__progress');
    const radius = getCurrentRadius();
    const center = getCurrentCenter(radius);
    const circumference = 2 * Math.PI * radius;
    
    progressBars.forEach((bar, index) => {
        const skillItem = bar.closest('.skill-item');
        const progressText = skillItem.querySelector('.progress-text');
        const circle = skillItem.querySelector('.progress-ring__circle');
        
        if (!progressText) return;
        
        const percentage = parseInt(progressText.textContent);
        const progressValue = calculateProgressValue(percentage, radius);
        
        // Mettre à jour les propriétés CSS
        bar.style.strokeDasharray = circumference;
        bar.style.strokeDashoffset = circumference;
        bar.style.setProperty('--progress', progressValue);
        
        // Mettre à jour les attributs des cercles
        if (circle) {
            circle.setAttribute('r', radius);
            circle.setAttribute('cx', center);
            circle.setAttribute('cy', center);
        }
        
        bar.setAttribute('r', radius);
        bar.setAttribute('cx', center);
        bar.setAttribute('cy', center);
    });
}

// ===== INTERSECTION OBSERVER POUR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Gestion spéciale pour les jauges de compétences
            if (entry.target.classList.contains('skills-with-bars')) {
                const skillItems = entry.target.querySelectorAll('.skill-item');
                skillItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                        
                        // Animer la jauge après que l'élément soit visible
                        const progressBar = item.querySelector('.progress-ring__progress');
                        if (progressBar) {
                            // Délai pour l'animation de la jauge
                            setTimeout(() => {
                                progressBar.classList.add('animate');
                            }, 300);
                        }
                    }, index * 150);
                });
            }
            
            // Gestion des projets
            if (entry.target.classList.contains('projects-section')) {
                const projectCards = entry.target.querySelectorAll('.project-card');
                projectCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 150);
                });
            }

            // Gestion de l'éducation
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

// ===== OBSERVER SPÉCIFIQUE POUR LES JAUGES =====
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target;
            const skillItem = progressBar.closest('.skill-item');
            
            // Vérifier si l'élément parent est visible
            if (skillItem && skillItem.classList.contains('visible')) {
                setTimeout(() => {
                    progressBar.classList.add('animate');
                }, 200);
            } else {
                // Réessayer après un délai si le parent n'est pas encore visible
                setTimeout(() => {
                    if (skillItem && skillItem.classList.contains('visible')) {
                        progressBar.classList.add('animate');
                    }
                }, 500);
            }
        }
    });
}, { 
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
});

// ===== FONCTION D'INITIALISATION =====
function initializeProgressBars() {
    // S'assurer que les jauges ont les bonnes dimensions
    updateProgressBars();
    
    // Observer toutes les jauges
    const progressBars = document.querySelectorAll('.progress-ring__progress');
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
}

// ===== GESTIONNAIRE DE REDIMENSIONNEMENT =====
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        updateProgressBars();
        
        // Réinitialiser les animations si nécessaire
        const visibleProgressBars = document.querySelectorAll('.progress-ring__progress.animate');
        visibleProgressBars.forEach(bar => {
            bar.classList.remove('animate');
            setTimeout(() => {
                bar.classList.add('animate');
            }, 100);
        });
    }, 250);
});

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les jauges
    initializeProgressBars();
    
    // Observer les éléments avec animations
    const animatedElements = document.querySelectorAll(
        '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .skills-with-bars, .projects-section, .education-section'
    );
    animatedElements.forEach(el => observer.observe(el));

    // Animation d'entrée du header
    setTimeout(() => {
        const header = document.querySelector('.header');
        if (header) {
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }
    }, 200);
});

// ===== STYLES INITIAUX POUR LE HEADER =====
const header = document.querySelector('.header');
if (header) {
    header.style.opacity = '0';
    header.style.transform = 'translateY(-30px)';
    header.style.transition = 'all 1s ease-out';
}

// ===== SMOOTH SCROLLING POUR LES LIENS D'ANCRAGE =====
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

// ===== LAZY LOADING POUR LES IMAGES =====
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

// ===== FONCTION DEBOUNCE =====
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

// ===== SUPPORT CLAVIER =====
document.addEventListener('keydown', (e) => {
    // Raccourci Ctrl+M pour aller au contenu principal
    if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        const main = document.querySelector('main');
        if (main) {
            main.focus();
            main.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// ===== GESTION DU FORMULAIRE DE CONTACT =====
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Formulaire de contact soumis');
        // Ajouter ici la logique de validation et d'envoi
    });
}

// ===== TOGGLE THEME (FONCTIONNALITÉ OPTIONNELLE) =====
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Charger le thème sauvegardé
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}

// ===== OPTIMISATION POUR L'IMPRESSION =====
window.addEventListener('beforeprint', () => {
    document.body.classList.add('print-mode');
    // Forcer l'affichage de tous les éléments pour l'impression
    const hiddenElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    hiddenElements.forEach(el => {
        el.classList.add('visible');
    });
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('print-mode');
});

// ===== GESTION D'ERREURS GLOBALE =====
window.addEventListener('error', (e) => {
    console.error('Erreur JavaScript détectée:', e.error);
    // Ici vous pourriez envoyer l'erreur à un service de logging
});

// ===== VÉRIFICATION DU SUPPORT DES FONCTIONNALITÉS =====
if ('IntersectionObserver' in window) {
    console.log('Intersection Observer supporté - animations activées');
} else {
    console.log('Intersection Observer non supporté - styles de fallback appliqués');
    // Appliquer immédiatement la classe visible à tous les éléments
    document.addEventListener('DOMContentLoaded', () => {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
        animatedElements.forEach(el => el.classList.add('visible'));
    });
}

// ===== FALLBACK POUR CSS CUSTOM PROPERTIES =====
if (!CSS.supports('color', 'var(--fake-var)')) {
    console.log('CSS Custom Properties non supportées, utilisation de valeurs fixes');
    
    document.addEventListener('DOMContentLoaded', () => {
        const progressBars = document.querySelectorAll('.progress-ring__progress');
        progressBars.forEach(bar => {
            const skillItem = bar.closest('.skill-item');
            const progressText = skillItem.querySelector('.progress-text');
            if (progressText) {
                const percentage = parseInt(progressText.textContent);
                const radius = getCurrentRadius();
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (percentage / 100) * circumference;
                
                // Appliquer directement la valeur sans CSS custom property
                bar.style.strokeDashoffset = offset + 'px';
                
                // Observer pour déclencher l'animation
                const fallbackObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                entry.target.style.strokeDashoffset = offset + 'px';
                            }, 300);
                        }
                    });
                }, { threshold: 0.5 });
                
                fallbackObserver.observe(bar);
            }
        });
    });
}

// ===== ANALYTICS ET TRACKING =====
function trackEvent(eventName, properties = {}) {
    console.log('Événement tracké:', eventName, properties);
    // Intégration avec Google Analytics ou autre service
    // Exemple: gtag('event', eventName, properties);
}

// Tracker le chargement de la page
trackEvent('page_view', {
    page: window.location.pathname,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    screenSize: `${window.screen.width}x${window.screen.height}`
});

// Tracker les interactions avec les projets
document.addEventListener('click', (e) => {
    if (e.target.matches('.btn')) {
        const projectCard = e.target.closest('.project-card');
        if (projectCard) {
            const projectTitle = projectCard.querySelector('.project-title')?.textContent;
            trackEvent('project_link_click', {
                project: projectTitle,
                linkType: e.target.classList.contains('btn-primary') ? 'live' : 'github'
            });
        }
    }
});

// ===== FONCTIONS UTILITAIRES =====
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function getCSSCustomProperty(property) {
    return getComputedStyle(document.documentElement).getPropertyValue(property);
}

function setCSSCustomProperty(property, value) {
    document.documentElement.style.setProperty(property, value);
}

// ===== DÉTECTION DE PERFORMANCE =====
function checkPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                
                if (pageLoadTime > 3000) {
                    console.warn('Page lente détectée, temps de chargement:', pageLoadTime + 'ms');
                    // Désactiver certaines animations pour améliorer les performances
                    document.body.classList.add('reduced-motion');
                }
                
                trackEvent('performance', {
                    loadTime: pageLoadTime,
                    domReady: perfData.domContentLoadedEventEnd - perfData.navigationStart
                });
            }, 0);
        });
    }
}

checkPerformance();

// ===== GESTION DE LA CONNECTIVITÉ =====
function handleConnectionChange() {
    if ('navigator' in window && 'onLine' in navigator) {
        window.addEventListener('online', () => {
            console.log('Connexion rétablie');
            document.body.classList.remove('offline');
        });
        
        window.addEventListener('offline', () => {
            console.log('Connexion perdue');
            document.body.classList.add('offline');
        });
    }
}

handleConnectionChange();

// ===== MODE DEBUG =====
if (window.location.search.includes('debug=true')) {
    console.log('Mode debug activé');
    
    // Ajouter des informations de debug
    const debugInfo = {
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        userAgent: navigator.userAgent,
        supports: {
            intersectionObserver: 'IntersectionObserver' in window,
            customProperties: CSS.supports('color', 'var(--fake-var)'),
            backdropFilter: CSS.supports('backdrop-filter', 'blur(10px)')
        }
    };
    
    console.table(debugInfo);
    
    // Vérifier les jauges en mode debug
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const progressBars = document.querySelectorAll('.progress-ring__progress');
            console.log('Jauges trouvées:', progressBars.length);
            
            progressBars.forEach((bar, index) => {
                const rect = bar.getBoundingClientRect();
                const computedStyle = getComputedStyle(bar);
                
                console.log(`Jauge ${index + 1}:`, {
                    visible: rect.width > 0 && rect.height > 0,
                    strokeDasharray: computedStyle.strokeDasharray,
                    strokeDashoffset: computedStyle.strokeDashoffset,
                    hasAnimateClass: bar.classList.contains('animate'),
                    customProperty: bar.style.getPropertyValue('--progress')
                });
            });
        }, 2000);
    });
}

// ===== DÉTECTION DE REDUCED MOTION =====
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduced-motion');
    console.log('Préférence utilisateur: mouvement réduit détecté');
}

// ===== PRÉCHARGEMENT DES RESSOURCES =====
function preloadCriticalResources() {
    // Précharger les polices si nécessaire
    const fontUrls = [
        // Ajouter les URLs des polices si utilisées
    ];
    
    fontUrls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.href = url;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
}

// ===== INITIALISATION FINALE =====
document.addEventListener('DOMContentLoaded', () => {
    preloadCriticalResources();
    
    // Log de succès de chargement
    console.log('Portfolio chargé avec succès');
    trackEvent('portfolio_loaded', {
        timestamp: Date.now()
    });
});

function setGauge(value) {
  const circle = document.querySelector('.progress');
  const text = document.getElementById('gauge-value');

  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference;

  const offset = circumference - (value / 100) * circumference;
  circle.style.strokeDashoffset = offset;

  text.textContent = value + "%";
}

// Exemple : anime la jauge à 75%
setGauge(75);
