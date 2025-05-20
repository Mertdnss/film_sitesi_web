// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Hero Slider Functionality
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;

    // Function to show a specific slide
    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Update current slide index
        currentSlide = index;
    }

    // Function to show the next slide
    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= slides.length) {
            next = 0;
        }
        showSlide(next);
    }

    // Function to show the previous slide
    function prevSlide() {
        let prev = currentSlide - 1;
        if (prev < 0) {
            prev = slides.length - 1;
        }
        showSlide(prev);
    }

    // Start automatic slideshow
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Stop automatic slideshow
    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    // Event listeners for buttons
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            stopSlideshow();
            startSlideshow();
        });

        nextBtn.addEventListener('click', function() {
            nextSlide();
            stopSlideshow();
            startSlideshow();
        });
    }

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            stopSlideshow();
            startSlideshow();
        });
    });

    // Initialize the hero slideshow if elements exist
    if (slides.length > 0 && dots.length > 0) {
        startSlideshow();
    }

    // Movie and Series Sliders
    const initializeSlider = (sliderSelector) => {
        const slider = document.querySelector(sliderSelector);
        if (!slider) return;

        const sliderContent = slider.querySelector('.slider-content');
        const sliderControls = slider.querySelector('.slider-controls');
        const prevButton = sliderControls.querySelector('.slider-prev');
        const nextButton = sliderControls.querySelector('.slider-next');
        
        let isDown = false;
        let startX;
        let scrollLeft;
        const sensitivity = 1.2; // Scroll sensitivity
        const cardWidth = sliderContent.querySelector('.movie-card').offsetWidth + 20; // card width + gap
        
        // Click events for buttons
        nextButton.addEventListener('click', () => {
            sliderContent.scrollBy({
                left: cardWidth * 3,
                behavior: 'smooth'
            });
        });
        
        prevButton.addEventListener('click', () => {
            sliderContent.scrollBy({
                left: -cardWidth * 3,
                behavior: 'smooth'
            });
        });
        
        // Mouse events for drag scrolling
        sliderContent.addEventListener('mousedown', (e) => {
            isDown = true;
            sliderContent.classList.add('grabbing');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = sliderContent.scrollLeft;
        });
        
        sliderContent.addEventListener('mouseleave', () => {
            isDown = false;
            sliderContent.classList.remove('grabbing');
        });
        
        sliderContent.addEventListener('mouseup', () => {
            isDown = false;
            sliderContent.classList.remove('grabbing');
        });
        
        sliderContent.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * sensitivity;
            sliderContent.scrollLeft = scrollLeft - walk;
        });
    };
    
    // Initialize both sliders
    initializeSlider('.movie-slider');
    initializeSlider('.series-slider');

    // Mobile Menu Toggle with animations
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('nav');
    const backdrop = document.querySelector('.menu-backdrop');

    hamburgerMenu.addEventListener('click', function() {
        // Toggle navigation and animation classes
        nav.classList.toggle('open');
        hamburgerMenu.classList.toggle('active');
        
        if (backdrop) {
            backdrop.classList.toggle('active');
        }
        
        // Transform hamburger to X
        const bars = this.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.toggle('animate'));
    });

    // Close mobile menu when clicking outside
    if (backdrop) {
        backdrop.addEventListener('click', function() {
            nav.classList.remove('open');
            hamburgerMenu.classList.remove('active');
            this.classList.remove('active');
            
            const bars = hamburgerMenu.querySelectorAll('.bar');
            bars.forEach(bar => bar.classList.remove('animate'));
        });
    }

    // Handle window resize for responsive menu
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            nav.classList.remove('open');
            hamburgerMenu.classList.remove('active');
            
            if (backdrop) {
                backdrop.classList.remove('active');
            }
            
            const bars = hamburgerMenu.querySelectorAll('.bar');
            bars.forEach(bar => bar.classList.remove('animate'));
        }
    });

    // Search functionality with animation
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    const searchBox = document.querySelector('.search-box');

    searchButton.addEventListener('click', function() {
        performSearch();
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    searchInput.addEventListener('focus', function() {
        searchBox.classList.add('focused');
    });

    searchInput.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            searchBox.classList.remove('focused');
        }
    });

    function performSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm !== '') {
            // Add animation for search submission
            searchBox.classList.add('searching');
            
            setTimeout(() => {
                searchBox.classList.remove('searching');
                // In a real application, we would redirect to a search results page
                alert('Arama yapılıyor: ' + searchTerm);
                
                // Clear search input
                searchInput.value = '';
                searchBox.classList.remove('focused');
            }, 600);
        }
    }

    // Movie hover animations
    const movieCards = document.querySelectorAll('.movie-card');
    
    movieCards.forEach(card => {
        // Add entrance animation when cards come into view
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('appear');
                            observer.unobserve(entry.target);
                        }, Math.random() * 300); // Staggered animation
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(card);
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            card.classList.add('appear');
        }
        
        // Hover effects
        card.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.movie-overlay');
            const img = this.querySelector('img');
            
            if (overlay) overlay.style.opacity = '1';
            if (img) img.style.transform = 'scale(1.05)';
            
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.movie-overlay');
            const img = this.querySelector('img');
            
            if (overlay) overlay.style.opacity = '0';
            if (img) img.style.transform = '';
            
            this.classList.remove('hover');
        });
    });

    // Category item animations
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('appear');
                            observer.unobserve(entry.target);
                        }, Math.random() * 300);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(item);
        } else {
            item.classList.add('appear');
        }
    });

    // Add parallax effect to hero slider
    const heroSection = document.querySelector('.hero-slider');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition < 600) {
                const slideImages = document.querySelectorAll('.slide img');
                slideImages.forEach(img => {
                    img.style.transform = `translateY(${scrollPosition * 0.2}px)`;
                });
            }
        });
    }
}); 