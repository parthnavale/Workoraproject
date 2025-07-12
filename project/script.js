// Supabase Configuration
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// Initialize Supabase client (only if Supabase is available)
let supabase = null;
try {
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch (error) {
    console.log('Supabase not configured, continuing without it');
}

// Global variables
let currentImageIndex = 0;
let isSubmittingWaitlist = false;
let currentUser = null;

const heroImages = [
    {
        url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Busy retail store with customers and staff working together"
    },
    {
        url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Modern electronics store with organized displays"
    },
    {
        url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Fashion retail store with clothing displays"
    },
    {
        url: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Grocery store with fresh produce and customers"
    },
    {
        url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
        alt: "Pharmacy with organized shelves and professional staff"
    }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - JavaScript is running!');
    initializeCarousel();
    initializeSmoothScrolling();
    initializeMobileMenu();
    initializeForms();
    initializeModals();
    initializeNavigation();
    initializeAnimations();
    checkAuthStatus();
});

// Carousel Functions
function initializeCarousel() {
    console.log('Initializing carousel...');
    
    // Auto-change images every 2 seconds
    const intervalId = setInterval(() => {
        console.log('Auto-rotation triggered');
        changeImage(1);
    }, 2000);
    
    console.log('Carousel initialized with auto-rotation, interval ID:', intervalId);
}

function populateCarousel() {
    const carouselContainer = document.querySelector('.image-carousel');
    if (!carouselContainer) {
        console.error('Carousel container not found');
        return;
    }
    
    // Check if images already exist (fallback images are present)
    const existingImages = carouselContainer.querySelectorAll('.carousel-image');
    if (existingImages.length > 0) {
        console.log('Images already exist, ensuring proper setup for dynamics');
        // Ensure first image is active and others are hidden
        existingImages.forEach((img, index) => {
            if (index === 0) {
                img.classList.add('active');
            } else {
                img.classList.remove('active');
            }
        });
        return;
    }
    
    console.log('Populating carousel with', heroImages.length, 'images');
    
    // Add images from heroImages array
    heroImages.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.alt;
        img.className = `carousel-image ${index === 0 ? 'active' : ''}`;
        carouselContainer.insertBefore(img, carouselContainer.firstChild); // Insert at beginning
        console.log('Added image:', image.url);
    });
    
    // Update indicators
    const indicatorsContainer = carouselContainer.querySelector('.carousel-indicators');
    if (indicatorsContainer) {
        indicatorsContainer.innerHTML = '';
        heroImages.forEach((_, index) => {
            const indicator = document.createElement('span');
            indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
            indicator.onclick = () => goToImage(index);
            indicatorsContainer.appendChild(indicator);
        });
    }
    
    console.log('Carousel populated successfully');
}

function changeImage(direction) {
    const images = document.querySelectorAll('.carousel-image');
    const indicators = document.querySelectorAll('.indicator');
    
    console.log('changeImage called with direction:', direction);
    console.log('Found', images.length, 'images');
    console.log('Current index:', currentImageIndex);
    
    if (images.length === 0) {
        console.log('No images found');
        return;
    }
    
    // Remove active class from current image and indicator
    images[currentImageIndex].classList.remove('active');
    if (indicators[currentImageIndex]) {
        indicators[currentImageIndex].classList.remove('active');
    }
    
    // Calculate new index
    currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
    
    // Add active class to new image and indicator
    images[currentImageIndex].classList.add('active');
    if (indicators[currentImageIndex]) {
        indicators[currentImageIndex].classList.add('active');
    }
    
    console.log('Changed to image', currentImageIndex);
}

function goToImage(index) {
    const images = document.querySelectorAll('.carousel-image');
    const indicators = document.querySelectorAll('.indicator');
    
    if (images.length === 0 || index < 0 || index >= images.length) return;
    
    // Remove active class from current image and indicator
    images[currentImageIndex].classList.remove('active');
    indicators[currentImageIndex].classList.remove('active');
    
    // Set new index
    currentImageIndex = index;
    
    // Add active class to new image and indicator
    images[currentImageIndex].classList.add('active');
    indicators[currentImageIndex].classList.add('active');
    
    console.log('Went to image', currentImageIndex);
}



// Navigation Functions
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    // Handle all anchor links
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
}

// Mobile Menu
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('show');
        });
    }
}

function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.classList.toggle('show');
    }
}

// Modal Functions
function initializeModals() {
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

function showLoginModal(userType = '') {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function showRegisterModal(userType = '') {
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Pre-select user type if provided
        if (userType) {
            const select = document.getElementById('registerType');
            if (select) {
                select.value = userType;
            }
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Form Handling
function initializeForms() {
    // Waitlist Form
    const waitlistForm = document.getElementById('waitlistForm');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', handleWaitlistSubmit);
    }
    
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }
}

async function handleWaitlistSubmit(e) {
    e.preventDefault();
    
    if (isSubmittingWaitlist) return;
    
    const emailInput = document.getElementById('waitlistEmail');
    const email = emailInput.value.trim();
    
    if (!email) {
        showToast('Please enter your email address', 'error');
        return;
    }
    
    isSubmittingWaitlist = true;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Joining...';
    submitBtn.disabled = true;
    
    try {
        const { error } = await supabase
            .from('waitlist_signups')
            .insert([{
                email: email,
                signup_type: 'general',
                source: 'homepage_cta'
            }]);
        
        if (error) {
            if (error.code === '23505') { // Unique constraint violation
                showToast('This email is already on our waitlist!', 'error');
            } else {
                throw error;
            }
        } else {
            showToast('🎉 You\'re on the waitlist! We\'ll notify you when we launch.', 'success');
            emailInput.value = '';
        }
    } catch (error) {
        console.error('Waitlist signup error:', error);
        if (error.message?.toLowerCase().includes('network')) {
            showToast('Network error: Please check your internet connection or try again later.', 'error');
        } else if (error.message?.toLowerCase().includes('invalid api key')) {
            showToast('Supabase credentials are invalid. Please contact support.', 'error');
        } else {
            showToast('Failed to join waitlist. Please try again.', 'error');
        }
    } finally {
        isSubmittingWaitlist = false;
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

async function handleLoginSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            throw error;
        }
        
        showToast('Login successful!', 'success');
        closeModal('loginModal');
        
        // Store user data
        currentUser = data.user;
        
        // Redirect based on user type
        const userType = data.user?.user_metadata?.user_type;
        if (userType === 'business') {
            window.location.href = '/business-dashboard.html';
        } else if (userType === 'worker') {
            window.location.href = '/worker-dashboard.html';
        } else {
            window.location.href = '/dashboard.html';
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showToast(error.message || 'Login failed. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    }
}

async function handleRegisterSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const userType = document.getElementById('registerType').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    if (!name || !email || !password || !userType) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters long', 'error');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name,
                    user_type: userType
                }
            }
        });
        
        if (error) {
            if (error.message.includes('already registered')) {
                showToast('This email is already registered. Please login instead.', 'error');
            } else {
                throw error;
            }
        } else {
            showToast('Registration successful! Please check your email to verify your account.', 'success');
            closeModal('registerModal');
            
            // Clear form
            document.getElementById('registerForm').reset();
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        showToast(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
    }
}

// Authentication Functions
async function checkAuthStatus() {
    if (!supabase) {
        console.log('Supabase not available, skipping auth check');
        updateAuthUI(false);
        return;
    }
    
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            currentUser = user;
            updateAuthUI(true);
        } else {
            updateAuthUI(false);
        }
    } catch (error) {
        console.error('Auth check error:', error);
        updateAuthUI(false);
    }
}

function updateAuthUI(isLoggedIn) {
    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) return;
    
    if (isLoggedIn) {
        authButtons.innerHTML = `
            <span class="user-welcome">Welcome, ${currentUser?.user_metadata?.full_name || 'User'}!</span>
            <button class="btn btn-outline" onclick="handleLogout()">Logout</button>
        `;
    } else {
        authButtons.innerHTML = `
            <button class="btn btn-outline" onclick="showLoginModal()">Login</button>
            <button class="btn btn-primary" onclick="showRegisterModal()">Register</button>
        `;
    }
}

async function handleLogout() {
    if (!supabase) {
        console.log('Supabase not available');
        return;
    }
    
    try {
        await supabase.auth.signOut();
        currentUser = null;
        updateAuthUI(false);
        showToast('Logged out successfully', 'success');
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Logout failed. Please try again.', 'error');
    }
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    // Remove existing classes
    toast.classList.remove('success', 'error', 'info', 'show');
    
    // Add new class and message
    toast.classList.add(type);
    toast.textContent = message;
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

// Animation Functions
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature, .step, .trust-item, .about-feature, .team-member');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Scroll-based navigation highlighting
window.addEventListener('scroll', debounce(function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, 100));

// Utility Functions
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

// Handle window resize
window.addEventListener('resize', debounce(function() {
    // Close mobile menu on resize
    const nav = document.querySelector('.nav');
    if (nav && window.innerWidth > 768) {
        nav.classList.remove('show');
    }
}, 250));

// Error handling for Supabase connection
window.addEventListener('error', function(e) {
    if (e.message.includes('Supabase')) {
        showToast('Connection error. Please check your internet connection.', 'error');
    }
});

// Export functions for global access
window.showLoginModal = showLoginModal;
window.showRegisterModal = showRegisterModal;
window.closeModal = closeModal;
window.toggleMobileMenu = toggleMobileMenu;
window.changeImage = changeImage;
window.goToImage = goToImage;
window.handleLogout = handleLogout; 