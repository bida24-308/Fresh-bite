/* ================================================
   FRESHBITE - MAIN JavaScript
   Global functionality and interactions
   ================================================ */

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Smooth scrolling for anchor links
    setupSmoothScroll();

    // Navbar scroll effect
    setupNavbarScroll();

    // Initialize animations on scroll
    setupScrollAnimations();
});

// Toggle mobile menu
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    }
}

// Smooth scroll for anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// Navbar scroll effect
function setupNavbarScroll() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.08)';
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
}

// Scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe feature cards, testimonials, etc.
    document.querySelectorAll('.feature-card, .testimonial-card, .plan-card, .team-member').forEach(el => {
        observer.observe(el);
    });
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInUp 0.3s ease;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideInDown 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Local storage utilities
const Storage = {
    set: (key, value) => localStorage.setItem(`freshbite_${key}`, JSON.stringify(value)),
    get: (key) => {
        const item = localStorage.getItem(`freshbite_${key}`);
        return item ? JSON.parse(item) : null;
    },
    remove: (key) => localStorage.removeItem(`freshbite_${key}`),
    clear: () => localStorage.clear()
};

// Shopping cart management
const Cart = {
    items: Storage.get('cart') || [],
    
    add: function(item) {
        const existingItem = this.items.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity || 1;
        } else {
            this.items.push({ ...item, quantity: item.quantity || 1 });
        }
        this.save();
        showToast(`${item.name} added to cart!`);
        return this.items.length;
    },
    
    remove: function(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.save();
        showToast('Item removed from cart');
    },
    
    update: function(itemId, quantity) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            item.quantity = quantity;
            this.save();
        }
    },
    
    clear: function() {
        this.items = [];
        this.save();
    },
    
    save: function() {
        Storage.set('cart', this.items);
    },
    
    getTotal: function() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    getCount: function() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }
};

// User preferences
const UserPreferences = {
    get: function() {
        return Storage.get('preferences') || {
            dietary: [],
            cuisines: [],
            allergies: [],
            calorieTarget: '1500-2000'
        };
    },
    
    set: function(preferences) {
        Storage.set('preferences', preferences);
        showToast('Preferences updated!');
    }
};

// Analytics tracking
const Analytics = {
    trackEvent: function(category, action, label = '') {
        const event = {
            timestamp: new Date(),
            category,
            action,
            label
        };
        
        let events = Storage.get('analytics') || [];
        events.push(event);
        if (events.length > 100) events = events.slice(-100);
        Storage.set('analytics', events);
        
        console.log('Analytics Event:', event);
    }
};

// Form validation
const FormValidator = {
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    validatePhone: function(phone) {
        const re = /^\d{10}$|^\d{3}-\d{3}-\d{4}$|^\(\d{3}\)\s?\d{3}-\d{4}$/;
        return re.test(phone.replace(/\D/g, ''));
    },
    
    validateZipCode: function(zip) {
        const re = /^\d{5}(-\d{4})?$/;
        return re.test(zip);
    },
    
    validateForm: function(formData) {
        const errors = [];
        
        if (!formData.name || formData.name.trim().length < 2) {
            errors.push('Please enter a valid name');
        }
        
        if (formData.email && !this.validateEmail(formData.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (formData.phone && !this.validatePhone(formData.phone)) {
            errors.push('Please enter a valid phone number');
        }
        
        if (formData.zip && !this.validateZipCode(formData.zip)) {
            errors.push('Please enter a valid ZIP code');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
};

// Pricing API (mock)
const PricingAPI = {
    getPlans: function() {
        return [
            {
                id: 'casual',
                name: 'Casual',
                description: 'Perfect for trying us out',
                meals: 2,
                servings: 2,
                pricing: { monthly: 49, quarterly: 44.1, yearly: 39.2 }
            },
            {
                id: 'premium',
                name: 'Premium',
                description: 'Most popular choice',
                meals: 5,
                servings: 2,
                pricing: { monthly: 99, quarterly: 89.1, yearly: 79.2 }
            },
            {
                id: 'elite',
                name: 'Elite',
                description: 'Maximum benefits',
                meals: 7,
                servings: 3,
                pricing: { monthly: 149, quarterly: 134.1, yearly: 119.2 }
            }
        ];
    },
    
    getMeals: function() {
        return [
            {
                id: 1,
                name: 'Thai Green Curry',
                cuisine: 'Asian',
                dietary: ['Vegan'],
                price: 8.99,
                calories: 380,
                protein: 12
            },
            {
                id: 2,
                name: 'Grilled Lamb Mediterranean',
                cuisine: 'Mediterranean',
                dietary: ['Gluten-Free'],
                price: 10.99,
                calories: 520,
                protein: 38
            },
            {
                id: 3,
                name: 'Slow-Cooked Beef Stew',
                cuisine: 'American',
                dietary: ['Paleo'],
                price: 9.49,
                calories: 450,
                protein: 35
            },
            {
                id: 4,
                name: 'Chickpea Falafel Wrap',
                cuisine: 'Mediterranean',
                dietary: ['Vegan', 'Vegetarian'],
                price: 7.99,
                calories: 340,
                protein: 14
            },
            {
                id: 5,
                name: 'Grilled Salmon & Quinoa',
                cuisine: 'Mediterranean',
                dietary: ['Keto'],
                price: 11.99,
                calories: 420,
                protein: 42
            },
            {
                id: 6,
                name: 'Rainbow Buddha Bowl',
                cuisine: 'Plant-Based',
                dietary: ['Vegan', 'Gluten-Free'],
                price: 8.49,
                calories: 380,
                protein: 16
            }
        ];
    }
};

// Export utilities
window.FreshBite = {
    Cart,
    Storage,
    UserPreferences,
    Analytics,
    FormValidator,
    PricingAPI,
    showToast,
    formatCurrency
};

console.log('FreshBite main.js loaded successfully!');
