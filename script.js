// ===== GLOBAL VARIABLES =====
let currentSlide = 0;
let currentTestimonial = 0;
const heroSlides = document.querySelectorAll('.hero__slide');
const testimonialCards = document.querySelectorAll('.testimonial__card');
const testimonialDots = document.querySelectorAll('.dot');

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Initialize all functionality
    initNavigation();
    initHeroSlider();
    initPortfolioFilter();
    initTestimonialSlider();
    initLightbox();
    initContactForm();
    initScrollEffects();
    initSmoothScrolling();
});

// ===== NAVIGATION =====
function initNavigation() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.getElementById('header');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY >= 50) {
            header.classList.add('scroll-header');
        } else {
            header.classList.remove('scroll-header');
        }
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 150;
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav__link[href*=${sectionId}]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                correspondingLink?.classList.add('active-link');
            } else {
                correspondingLink?.classList.remove('active-link');
            }
        });
    });
}

// ===== HERO SLIDER =====
function initHeroSlider() {
    if (heroSlides.length === 0) return;

    // Auto slide functionality
    setInterval(() => {
        heroSlides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % heroSlides.length;
        heroSlides[currentSlide].classList.add('active');
    }, 5000);

    // Preload images
    heroSlides.forEach(slide => {
        const img = new Image();
        img.src = slide.style.backgroundImage.slice(5, -2);
    });
}

// ===== PORTFOLIO FILTER =====
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter__btn');
    const portfolioItems = document.querySelectorAll('.portfolio__item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.classList.remove('hide');
                    item.style.display = 'block';
                    // Trigger reflow for animation
                    item.offsetHeight;
                    item.classList.add('loading');
                } else {
                    item.classList.add('hide');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== TESTIMONIAL SLIDER =====
function initTestimonialSlider() {
    const prevBtn = document.querySelector('.testimonial__prev');
    const nextBtn = document.querySelector('.testimonial__next');

    if (!prevBtn || !nextBtn) return;

    function showTestimonial(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        testimonialDots.forEach(dot => dot.classList.remove('active'));
        
        if (testimonialCards[index] && testimonialDots[index]) {
            testimonialCards[index].classList.add('active');
            testimonialDots[index].classList.add('active');
        }
    }

    prevBtn.addEventListener('click', () => {
        currentTestimonial = currentTestimonial === 0 ? testimonialCards.length - 1 : currentTestimonial - 1;
        showTestimonial(currentTestimonial);
    });

    nextBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    });

    // Dot navigation
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentTestimonial = index;
            showTestimonial(currentTestimonial);
        });
    });

    // Auto slide testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }, 8000);
}

// ===== LIGHTBOX =====
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox__image');
    const lightboxClose = document.querySelector('.lightbox__close');
    const portfolioViews = document.querySelectorAll('.portfolio__view');

    portfolioViews.forEach(view => {
        view.addEventListener('click', (e) => {
            e.stopPropagation();
            const imageSrc = view.getAttribute('data-image');
            lightboxImg.src = imageSrc;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.querySelector('.contact__form');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Reset form labels
            const labels = contactForm.querySelectorAll('label');
            labels.forEach(label => {
                label.style.top = '15px';
                label.style.fontSize = '1rem';
                label.style.color = '#666';
            });
        }, 2000);
    });

    // Enhanced form field animations
    const formGroups = document.querySelectorAll('.form__group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        const label = group.querySelector('label');
        
        if (!input || !label) return;

        input.addEventListener('focus', () => {
            label.style.top = '-10px';
            label.style.left = '10px';
            label.style.fontSize = '0.9rem';
            label.style.color = '#d4af37';
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                label.style.top = '15px';
                label.style.left = '15px';
                label.style.fontSize = '1rem';
                label.style.color = '#666';
            }
        });

        // Check if field has value on page load
        if (input.value) {
            label.style.top = '-10px';
            label.style.left = '10px';
            label.style.fontSize = '0.9rem';
            label.style.color = '#d4af37';
        }
    });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero');
        
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.feature__card, .service__card, .portfolio__item');
    
    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('loading');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimized scroll handler
const optimizedScrollHandler = throttle(() => {
    // Header scroll effect
    const header = document.getElementById('header');
    if (window.scrollY >= 50) {
        header.classList.add('scroll-header');
    } else {
        header.classList.remove('scroll-header');
    }
    
    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 150;
        const sectionId = current.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav__link[href*=${sectionId}]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            correspondingLink?.classList.add('active-link');
        } else {
            correspondingLink?.classList.remove('active-link');
        }
    });
}, 100);

// Replace the scroll event listener with optimized version
window.addEventListener('scroll', optimizedScrollHandler);

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loading');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature__card, .service__card, .portfolio__item');
    animateElements.forEach(el => observer.observe(el));
});

// ===== PRELOADER =====
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// ===== LAZY LOADING IMAGES =====
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

// ===== PERFORMANCE OPTIMIZATIONS =====

// Preload critical images
const criticalImages = [
    'https://images.unsplash.com/photo-1519741497674-611481863552',
    'https://images.unsplash.com/photo-1606216794074-735e91aa2c92',
    'https://images.unsplash.com/photo-1511578314322-379afb476865'
];

criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
});

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ===== ACCESSIBILITY ENHANCEMENTS =====

// Keyboard navigation for portfolio
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('portfolio__view')) {
            e.preventDefault();
            focusedElement.click();
        }
    }
});

// Focus management for mobile menu
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navClose && navMenu) {
    navToggle.addEventListener('click', () => {
        setTimeout(() => {
            navClose.focus();
        }, 100);
    });
    
    navClose.addEventListener('click', () => {
        navToggle.focus();
    });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // You could send this to an error tracking service
});

// ===== ANALYTICS TRACKING =====
function trackEvent(eventName, eventData = {}) {
    // Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // You can add other analytics services here
    console.log('Event tracked:', eventName, eventData);
}

// Track important user interactions
document.addEventListener('click', (e) => {
    if (e.target.matches('.btn--primary')) {
        trackEvent('cta_click', {
            button_text: e.target.textContent,
            page_location: window.location.href
        });
    }
    
    if (e.target.matches('.portfolio__view')) {
        trackEvent('portfolio_view', {
            image_category: e.target.closest('.portfolio__item').dataset.category
        });
    }
});

// Track form submissions
document.addEventListener('submit', (e) => {
    if (e.target.matches('.contact__form')) {
        trackEvent('form_submit', {
            form_type: 'contact',
            page_location: window.location.href
        });
    }
});

// ===== CONSOLE WELCOME MESSAGE =====
console.log(`
🎉 Welcome to Flashback Wedding!
📸 Professional Wedding Photography Services
🌟 Capturing Moments, Creating Memories

Built with ❤️ for beautiful weddings and love stories.
`);

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initHeroSlider,
        initPortfolioFilter,
        initTestimonialSlider,
        initLightbox,
        initContactForm,
        debounce,
        throttle
    };
}


