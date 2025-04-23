// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // Create mobile menu if it doesn't exist
            if (!document.querySelector('.mobile-menu')) {
                const mobileMenu = document.createElement('div');
                mobileMenu.className = 'mobile-menu';
                
                // Clone navigation links
                const navClone = navLinks.cloneNode(true);
                mobileMenu.appendChild(navClone);
                
                // Clone auth buttons
                const authClone = authButtons.cloneNode(true);
                mobileMenu.appendChild(authClone);
                
                // Append to header
                document.querySelector('header').appendChild(mobileMenu);
                
                // Add styles for mobile menu
                const style = document.createElement('style');
                style.textContent = `
                    .hamburger.active span:nth-child(1) {
                        transform: rotate(45deg) translate(5px, 5px);
                    }
                    .hamburger.active span:nth-child(2) {
                        opacity: 0;
                    }
                    .hamburger.active span:nth-child(3) {
                        transform: rotate(-45deg) translate(5px, -5px);
                    }
                    .mobile-menu {
                        position: absolute;
                        top: 80px;
                        left: 0;
                        right: 0;
                        background-color: white;
                        padding: 20px;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                        z-index: 100;
                        display: none;
                    }
                    .mobile-menu.active {
                        display: block;
                    }
                    .mobile-menu .nav-links {
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                        margin-bottom: 20px;
                    }
                    .mobile-menu .auth-buttons {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                    }
                    .mobile-menu .auth-buttons button {
                        width: 100%;
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Toggle mobile menu
            const mobileMenu = document.querySelector('.mobile-menu');
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const mobileMenu = document.querySelector('.mobile-menu');
        const hamburger = document.querySelector('.hamburger');
        
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            if (!mobileMenu.contains(event.target) && !hamburger.contains(event.target)) {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const mobileMenu = document.querySelector('.mobile-menu');
            const hamburger = document.querySelector('.hamburger');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});

// Testimonials slider functionality
function initTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;
    
    // Clone testimonials for infinite scroll effect
    const testimonials = slider.querySelectorAll('.testimonial');
    testimonials.forEach(testimonial => {
        const clone = testimonial.cloneNode(true);
        slider.appendChild(clone);
    });
    
    // Auto-scroll functionality
    let scrollPosition = 0;
    const scrollSpeed = 2;
    const testimonialWidth = testimonials[0].offsetWidth + 30; // Width + gap
    const totalWidth = testimonialWidth * testimonials.length;
    
    let isScrolling = true;
    let animationId;
    
    function autoScroll() {
        if (!isScrolling) return;
        
        scrollPosition += scrollSpeed;
        
        // Reset position for infinite scroll effect
        if (scrollPosition >= totalWidth) {
            scrollPosition = 0;
        }
        
        slider.scrollLeft = scrollPosition;
        animationId = requestAnimationFrame(autoScroll);
    }
    
    // Start auto-scrolling
    autoScroll();
    
    // Pause on hover or touch
    slider.addEventListener('mouseenter', () => {
        isScrolling = false;
        cancelAnimationFrame(animationId);
    });
    
    slider.addEventListener('mouseleave', () => {
        isScrolling = true;
        autoScroll();
    });
    
    slider.addEventListener('touchstart', () => {
        isScrolling = false;
        cancelAnimationFrame(animationId);
    });
    
    slider.addEventListener('touchend', () => {
        isScrolling = true;
        autoScroll();
    });
}

// Initialize testimonials slider when DOM is loaded
document.addEventListener('DOMContentLoaded', initTestimonialsSlider);

// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email && isValidEmail(email)) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Thank you for subscribing!';
                successMessage.style.color = '#fff';
                successMessage.style.marginTop = '10px';
                
                // Remove any existing message
                const existingMessage = newsletterForm.querySelector('.success-message');
                if (existingMessage) {
                    newsletterForm.removeChild(existingMessage);
                }
                
                newsletterForm.appendChild(successMessage);
                emailInput.value = '';
                
                // Remove message after 3 seconds
                setTimeout(() => {
                    if (successMessage.parentNode === newsletterForm) {
                        newsletterForm.removeChild(successMessage);
                    }
                }, 3000);
            } else {
                // Show error for invalid email
                emailInput.style.borderColor = 'red';
                emailInput.style.backgroundColor = 'rgba(255, 0, 0, 0.05)';
                
                // Reset styles after 2 seconds
                setTimeout(() => {
                    emailInput.style.borderColor = '';
                    emailInput.style.backgroundColor = '';
                }, 2000);
            }
        });
    }
    
    // Search form in hero section
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        const searchBtn = searchBar.querySelector('.search-btn');
        const searchInput = searchBar.querySelector('input');
        
        searchBtn.addEventListener('click', function() {
            handleSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch(this.value);
            }
        });
    }
    
    // Book Now buttons
    const bookButtons = document.querySelectorAll('.event-card .btn-primary');
    bookButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const eventCard = this.closest('.event-card');
            const eventName = eventCard.querySelector('h3').textContent;
            
            alert(`You're about to book tickets for: ${eventName}\nThis would take you to the booking page in a real application.`);
        });
    });
});

// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Handle search functionality
function handleSearch(query) {
    query = query.trim();
    if (query) {
        alert(`Searching for: "${query}"\nIn a real application, this would show search results.`);
    }
}

// Sticky navigation on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('sticky');
        
        // Add styles for sticky navbar if not already added
        if (!document.querySelector('#sticky-navbar-styles')) {
            const style = document.createElement('style');
            style.id = 'sticky-navbar-styles';
            style.textContent = `
                .navbar.sticky {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    background-color: white;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    animation: slideDown 0.3s ease-out;
                }
                
                @keyframes slideDown {
                    from {
                        transform: translateY(-100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    } else {
        navbar.classList.remove('sticky');
    }
});

// Add animation on scroll
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in animation to elements when they come into view
    const animatedElements = document.querySelectorAll('.event-card, .category-card, .step, .testimonial');
    
    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .event-card, .category-card, .step, .testimonial {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .event-card.visible, .category-card.visible, .step.visible, .testimonial.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // Observe elements
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});
