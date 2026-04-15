// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Hero Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

if (prevBtn && nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Auto-slide
    setInterval(nextSlide, 5000);
}

// Dark/Light Mode Toggle
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark' || (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    body.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', () => {
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
});

// Animated Counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + (target > 100 ? '' : '%');
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target + (target > 100 ? '' : '%');
            }
        };
        updateCounter();
    });
}

// Intersection Observer for counters
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }
});

// Contact Form Validation
function initFormValidation() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    const submitBtn = form.querySelector('button[type="submit"]');

    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', validateField);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            showModal('Thank you! Your message has been sent. We\'ll get back to you soon.');
            form.reset();
        }
    });

    function validateField(e) {
        const field = e.target;
        const fieldWrapper = field.closest('.form-group');
        const errorMsg = fieldWrapper.querySelector('.error-message');
        const successMsg = fieldWrapper.querySelector('.success-message');

        // Remove existing messages
        if (errorMsg) errorMsg.remove();
        if (successMsg) successMsg.remove();

        let isValid = true;
        let errorMessage = '';

        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        } else if (field.type === 'tel') {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(field.value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        } else if (field.required && !field.value.trim()) {
            isValid = false;
            errorMessage = `${field.previousElementSibling.textContent} is required`;
        }

        if (!isValid) {
            field.classList.add('error');
            if (errorMessage) {
                const errorEl = document.createElement('div');
                errorEl.className = 'error-message';
                errorEl.textContent = errorMessage;
                fieldWrapper.appendChild(errorEl);
            }
        } else {
            field.classList.add('success');
            field.classList.remove('error');
        }
    }

    function validateForm() {
        let isValid = true;
        inputs.forEach(input => {
            validateField({ target: input });
            if (input.classList.contains('error')) isValid = false;
        });
        return isValid;
    }
}

// Modal Functions
function showModal(message) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-check-circle" style="font-size: 4rem; color: var(--accent-color); margin-bottom: 1rem;"></i>
                <h2>Success!</h2>
                <p>${message}</p>
                <button onclick="this.closest('.modal').remove()" style="background: var(--accent-color); color: var(--text-dark); padding: 1rem 2rem; border: none; border-radius: var(--border-radius); font-weight: 600; cursor: pointer;">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Close modal
    modal.querySelector('.close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Gallery Lightbox (if gallery exists)
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            showModal(`
                <div style="text-align: center;">
                    <img src="${imgSrc}" style="max-width: 100%; max-height: 70vh; border-radius: var(--border-radius);">
                    <button onclick="this.closest('.modal').remove()" style="margin-top: 1rem; background: var(--accent-color); color: var(--text-dark); padding: 1rem 2rem; border: none; border-radius: var(--border-radius); font-weight: 600; cursor: pointer;">Close</button>
                </div>
            `);
        });
    });
}

// Smooth Scrolling for Anchor Links
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

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'var(--white)';
        header.style.backdropFilter = 'none';
    }
});

// Initialize all features on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initFormValidation();
    initGallery();
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});