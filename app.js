document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const colorToggle = document.getElementById('colorToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const body = document.body;
    const actionButtons = document.querySelectorAll('.hero-actions .btn');

    // Initialize state
    let isMenuOpen = false;
    let currentTheme = 'soft'; // Default theme

    // Function to toggle mobile menu
    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            mobileNav.classList.add('active');
            // Animate hamburger to X
            mobileMenuBtn.querySelectorAll('span')[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            mobileMenuBtn.querySelectorAll('span')[1].style.opacity = '0';
            mobileMenuBtn.querySelectorAll('span')[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            mobileNav.classList.remove('active');
            // Reset hamburger animation
            mobileMenuBtn.querySelectorAll('span')[0].style.transform = 'none';
            mobileMenuBtn.querySelectorAll('span')[1].style.opacity = '1';
            mobileMenuBtn.querySelectorAll('span')[2].style.transform = 'none';
        }
    }

    // Function to toggle color theme
    function toggleColorTheme() {
        currentTheme = currentTheme === 'soft' ? 'modern' : 'soft';
        body.setAttribute('data-theme', currentTheme);

        const logo = document.getElementById('logo');
        if (currentTheme === 'soft') {
            logo.src = '/image/logo/KBcreative_rose.png';
        } else {
            logo.src = '/image/logo/logo_KBcreative_Bleu.png';
        }
        
        // Save preference to session storage (not using localStorage as per instructions)
        try {
            sessionStorage.setItem('theme', currentTheme);
        } catch (e) {
            console.log('Session storage not available');
        }
    }

    // Function to navigate to a page
    function navigateToPage(pageId) {
        // Hide all pages
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Update active nav link
            navLinks.forEach(link => {
                if (link.getAttribute('data-page') === pageId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            
            // Close mobile menu if open
            if (isMenuOpen) {
                toggleMobileMenu();
            }
            
            // Update URL hash without scrolling
            history.pushState(null, null, `#${pageId}`);
        }
    }

    // Add scroll animation to elements
    function addScrollAnimations() {
        const sections = document.querySelectorAll('.cv-section, .passion-category, .competence-category');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-on-scroll');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Event Listeners
    
    // Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Color Theme Toggle
    colorToggle.addEventListener('click', toggleColorTheme);
    
    // Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            navigateToPage(pageId);
        });
    });
    
    // Action buttons in hero section
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                navigateToPage(pageId);
            }
        });
    });

    // Handle direct navigation via URL hash
    function handleHashNavigation() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            // Check if the hash corresponds to a valid page ID
            const validPageIds = Array.from(pages).map(page => page.id);
            if (validPageIds.includes(hash)) {
                navigateToPage(hash);
            } else {
                // Default to home if hash is invalid
                navigateToPage('home');
            }
        }
    }

    // Initialize
    function init() {
        // Check for saved theme preference
        try {
            const savedTheme = sessionStorage.getItem('theme');
            if (savedTheme) {
                currentTheme = savedTheme;
                body.setAttribute('data-theme', currentTheme);
            }
        } catch (e) {
            console.log('Session storage not available');
        }
        
        // Handle URL hash navigation
        if (window.location.hash) {
            handleHashNavigation();
        }
        
        // Add scroll animations
        addScrollAnimations();
    }

    // Run initialization
    init();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashNavigation);
});