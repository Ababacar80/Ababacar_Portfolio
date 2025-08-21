// ===== FONCTIONS UTILITAIRES POUR LES JAUGES =====
function calculateCircumference(radius) {
    return 2 * Math.PI * radius;
}

function animateCounter(element, targetValue, duration = 1500) {
    let startValue = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Fonction d'easing pour une animation plus fluide
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.round(startValue + (targetValue - startValue) * easeOutQuart);
        
        element.textContent = currentValue + '%';
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function animateProgressBar(progressBar, percentage, delay = 0) {
    setTimeout(() => {
        const radius = 50; // Rayon fixe
        const circumference = calculateCircumference(radius);
        const offset = circumference - (percentage / 100) * circumference;
        
        // Configuration initiale
        progressBar.style.strokeDasharray = circumference;
        progressBar.style.strokeDashoffset = circumference;
        
        // Animation du cercle de progression
        requestAnimationFrame(() => {
            progressBar.style.strokeDashoffset = offset;
        });
        
        // Animation du texte de pourcentage
        const skillItem = progressBar.closest('.skill-item');
        const progressText = skillItem.querySelector('.progress-text');
        if (progressText) {
            animateCounter(progressText, percentage, 1500);
        }
    }, delay);
}

// ===== INTERSECTION OBSERVER POUR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1, // threshold plus bas pour déclencher plus tôt
    rootMargin: '0px 0px -20px 0px' // marge plus petite
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
                        const percentage = parseInt(item.dataset.progress);
                        
                        if (progressBar && percentage) {
                            animateProgressBar(progressBar, percentage, 300);
                        }
                    }, index * 150);
                });
            }
            
            // Gestion améliorée des projets
            if (entry.target.classList.contains('projects-section')) {
                console.log('Section projets détectée et visible');
                const projectCards = entry.target.querySelectorAll('.project-card');
                console.log('Nombre de cartes projet trouvées:', projectCards.length);
                
                projectCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                        console.log(`Carte projet ${index + 1} animée`);
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

// ===== GESTIONNAIRE DE REDIMENSIONNEMENT =====
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Réinitialiser les jauges si elles sont déjà animées
        const animatedSkillItems = document.querySelectorAll('.skill-item.visible');
        animatedSkillItems.forEach(item => {
            const progressBar = item.querySelector('.progress-ring__progress');
            const percentage = parseInt(item.dataset.progress);
            
            if (progressBar && percentage) {
                // Réappliquer l'animation immédiatement
                animateProgressBar(progressBar, percentage, 0);
            }
        });
    }, 250);
});

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', () => {
    // Observer les éléments avec animations
    const animatedElements = document.querySelectorAll(
        '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .skills-with-bars, .projects-section, .education-section'
    );
    
    console.log('Éléments à observer:', animatedElements.length);
    
    animatedElements.forEach((el, index) => {
        console.log(`Observing element ${index + 1}:`, el.className);
        observer.observe(el);
    });

    // Animation d'entrée du header
    setTimeout(() => {
        const header = document.querySelector('.header');
        if (header) {
            header.classList.add('visible');
        }
    }, 200);
    
    // Debug pour vérifier les éléments projets
    const projectsSection = document.querySelector('.projects-section');
    const projectCards = document.querySelectorAll('.project-card');
    
    console.log('=== DIAGNOSTIC PROJETS ===');
    console.log('Section projets trouvée:', !!projectsSection);
    console.log('Nombre de cartes projet:', projectCards.length);
    
    if (projectsSection) {
        console.log('Classes de la section projets:', projectsSection.className);
        console.log('Style opacity initial:', getComputedStyle(projectsSection).opacity);
    }
    
    // Fallback si l'intersection observer ne fonctionne pas après 3 secondes
    setTimeout(() => {
        if (projectsSection && !projectsSection.classList.contains('visible')) {
            console.log('Fallback activé : forçage de l\'affichage des projets');
            projectsSection.classList.add('visible');
            projectCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 100);
            });
        }
    }, 3000);
});

// ===== FONCTION DE DEBUG POUR LES PROJETS =====
function debugProjects() {
    const projectsSection = document.querySelector('.projects-section');
    const projectCards = document.querySelectorAll('.project-card');
    
    console.log('=== DEBUG PROJETS DÉTAILLÉ ===');
    console.log('Section projets trouvée:', !!projectsSection);
    console.log('Nombre de cartes projet:', projectCards.length);
    
    if (projectsSection) {
        console.log('Section projets visible:', projectsSection.classList.contains('visible'));
        console.log('Style opacity:', getComputedStyle(projectsSection).opacity);
        console.log('Style transform:', getComputedStyle(projectsSection).transform);
        console.log('Classes de la section:', projectsSection.className);
    }
    
    projectCards.forEach((card, index) => {
        console.log(`Carte ${index + 1}:`, {
            visible: card.classList.contains('visible'),
            opacity: getComputedStyle(card).opacity,
            transform: getComputedStyle(card).transform,
            classes: card.className
        });
    });
    
    // Forcer l'affichage pour test
    console.log('Forçage de l\'affichage...');
    if (projectsSection) {
        projectsSection.classList.add('visible');
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
                console.log(`Carte ${index + 1} forcée visible`);
            }, index * 100);
        });
        console.log('Animation forcée appliquée');
    }
}

// ===== FONCTION DE TEST POUR TOUS LES ÉLÉMENTS =====
function testAllAnimations() {
    console.log('=== TEST DE TOUTES LES ANIMATIONS ===');
    
    // Forcer toutes les animations
    const allAnimatedElements = document.querySelectorAll('.fade-in, .projects-section, .education-section, .skills-section');
    allAnimatedElements.forEach(el => el.classList.add('visible'));
    
    const allCards = document.querySelectorAll('.project-card, .education-item, .skill-item');
    allCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 50);
    });
    
    console.log('Toutes les animations forcées');
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
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .skill-item');
        animatedElements.forEach(el => el.classList.add('visible'));
        
        // Animer toutes les jauges immédiatement
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach(item => {
            const progressBar = item.querySelector('.progress-ring__progress');
            const percentage = parseInt(item.dataset.progress);
            
            if (progressBar && percentage) {
                animateProgressBar(progressBar, percentage, 0);
            }
        });
    });
}

// ===== FALLBACK POUR CSS CUSTOM PROPERTIES =====
if (!CSS.supports('color', 'var(--fake-var)')) {
    console.log('CSS Custom Properties non supportées, utilisation de valeurs fixes');
    
    document.addEventListener('DOMContentLoaded', () => {
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach(item => {
            const progressBar = item.querySelector('.progress-ring__progress');
            const percentage = parseInt(item.dataset.progress);
            
            if (progressBar && percentage) {
                const radius = 50;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (percentage / 100) * circumference;
                
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
                
                fallbackObserver.observe(item);
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
            const skillItems = document.querySelectorAll('.skill-item');
            console.log('Jauges trouvées:', skillItems.length);
            
            skillItems.forEach((item, index) => {
                const progressBar = item.querySelector('.progress-ring__progress');
                const percentage = parseInt(item.dataset.progress);
                
                console.log(`Jauge ${index + 1}:`, {
                    visible: item.offsetWidth > 0 && item.offsetHeight > 0,
                    percentage: percentage,
                    hasProgressBar: !!progressBar,
                    hasVisibleClass: item.classList.contains('visible'),
                    progressBarStyles: progressBar ? {
                        strokeDasharray: progressBar.style.strokeDasharray,
                        strokeDashoffset: progressBar.style.strokeDashoffset
                    } : null
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
    console.log('Portfolio chargé avec succès - Jauges optimisées pour mobile et desktop');
    trackEvent('portfolio_loaded', {
        timestamp: Date.now()
    });
});

// ===== FONCTION SPÉCIFIQUE POUR TESTER LES JAUGES =====
function testGauges() {
    console.log('Test des jauges...');
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach((item, index) => {
        const percentage = parseInt(item.dataset.progress);
        const progressBar = item.querySelector('.progress-ring__progress');
        const progressText = item.querySelector('.progress-text');
        
        console.log(`Test jauge ${index + 1}:`, {
            percentage,
            hasProgressBar: !!progressBar,
            hasProgressText: !!progressText,
            currentText: progressText?.textContent,
            isVisible: item.classList.contains('visible')
        });
        
        if (progressBar && percentage) {
            // Force l'animation pour tester
            setTimeout(() => {
                animateProgressBar(progressBar, percentage, 0);
            }, index * 200);
        }
    });
}

// ===== FALLBACK SI INTERSECTION OBSERVER N'EST PAS SUPPORTÉ =====
if (!('IntersectionObserver' in window)) {
    // Fallback pour les navigateurs anciens
    document.addEventListener('DOMContentLoaded', () => {
        // Afficher tous les éléments immédiatement
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .skill-item');
        animatedElements.forEach(el => el.classList.add('visible'));
        
        // Animer toutes les jauges
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            const progressBar = item.querySelector('.progress-ring__progress');
            const percentage = parseInt(item.dataset.progress);
            
            if (progressBar && percentage) {
                setTimeout(() => {
                    animateProgressBar(progressBar, percentage, 0);
                }, index * 200);
            }
        });
    });
}

// Exposer les fonctions de debug dans la console
window.debugProjects = debugProjects;
window.testAllAnimations = testAllAnimations;
window.testGauges = testGauges;