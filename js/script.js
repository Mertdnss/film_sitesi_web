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

    // Movie and Series Sliders - Mobile Optimized
    const initializeSlider = (sliderSelector) => {
        const slider = document.querySelector(sliderSelector);
        if (!slider) return;

        const sliderContent = slider.querySelector('.slider-content');
        const sliderControls = slider.querySelector('.slider-controls');
        const prevButton = sliderControls?.querySelector('.slider-prev');
        const nextButton = sliderControls?.querySelector('.slider-next');
        
        if (!sliderContent || !prevButton || !nextButton) return;
        
        let isAnimating = false;
        let startX = 0;
        let scrollLeft = 0;
        let isDragging = false;
        let startY = 0;
        let rafId = null;
        
        // Mobile detection
        const isMobile = window.innerWidth <= 768;
        const isTouch = 'ontouchstart' in window;
        
        // Get card width for scrolling
        function getCardWidth() {
            const card = sliderContent.querySelector('.movie-card');
            if (!card) return 250;
            return card.offsetWidth + parseInt(getComputedStyle(sliderContent).gap || '20');
        }
        
        // Smooth scroll with better performance
        function smoothScrollTo(targetPosition, duration = 300) {
            if (isAnimating) return;
            
            isAnimating = true;
            const startPosition = sliderContent.scrollLeft;
            const distance = targetPosition - startPosition;
            let startTime = null;
            
            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                
                // Easing function (ease-out)
                const ease = 1 - Math.pow(1 - progress, 3);
                
                sliderContent.scrollLeft = startPosition + (distance * ease);
                
                if (progress < 1) {
                    rafId = requestAnimationFrame(animation);
                } else {
                    isAnimating = false;
                    rafId = null;
                }
            }
            
            rafId = requestAnimationFrame(animation);
        }
        
        // Check scroll positions
        function isAtStart() {
            return sliderContent.scrollLeft <= 5;
        }
        
        function isAtEnd() {
            const maxScroll = sliderContent.scrollWidth - sliderContent.clientWidth;
            return sliderContent.scrollLeft >= maxScroll - 5;
        }
        
        // Get cards to scroll count based on screen size
        function getScrollAmount() {
            if (isMobile) {
                return window.innerWidth <= 480 ? 1 : 2; // Very small screens: 1, mobile: 2
            }
            return 3; // Desktop: 3 cards
        }
        
        // Next button functionality
        function handleNext() {
            if (isAnimating) return;
            
            const cardWidth = getCardWidth();
            const scrollAmount = getScrollAmount();
            const targetScroll = sliderContent.scrollLeft + (cardWidth * scrollAmount);
            const maxScroll = sliderContent.scrollWidth - sliderContent.clientWidth;
            
            if (targetScroll >= maxScroll) {
                // Go to start if at end
                smoothScrollTo(0);
            } else {
                smoothScrollTo(targetScroll);
            }
        }
        
        // Previous button functionality
        function handlePrev() {
            if (isAnimating) return;
            
            const cardWidth = getCardWidth();
            const scrollAmount = getScrollAmount();
            const targetScroll = sliderContent.scrollLeft - (cardWidth * scrollAmount);
            
            if (targetScroll <= 0) {
                // Go to end if at start
                const maxScroll = sliderContent.scrollWidth - sliderContent.clientWidth;
                smoothScrollTo(maxScroll);
            } else {
                smoothScrollTo(targetScroll);
            }
        }
        
        // Button event listeners
        nextButton.addEventListener('click', handleNext);
        prevButton.addEventListener('click', handlePrev);
        
        // Touch/Mouse drag functionality
        function handleStart(clientX, clientY) {
            if (isAnimating) {
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    isAnimating = false;
                }
            }
            
            isDragging = true;
            startX = clientX;
            startY = clientY;
            scrollLeft = sliderContent.scrollLeft;
            sliderContent.style.scrollBehavior = 'auto';
        }
        
        function handleMove(clientX, clientY) {
            if (!isDragging) return;
            
            const diffX = Math.abs(clientX - startX);
            const diffY = Math.abs(clientY - startY);
            
            // Only scroll horizontally if movement is more horizontal than vertical
            if (diffX > diffY) {
                const walkX = (startX - clientX) * 1.5; // Scroll sensitivity
                const newScrollLeft = scrollLeft + walkX;
                
                // Limit scroll boundaries
                const maxScroll = sliderContent.scrollWidth - sliderContent.clientWidth;
                sliderContent.scrollLeft = Math.max(0, Math.min(newScrollLeft, maxScroll));
                
                return true; // Prevent default
            }
            return false;
        }
        
        function handleEnd() {
            if (!isDragging) return;
            
            isDragging = false;
            sliderContent.style.scrollBehavior = 'smooth';
            
            // Snap to card if moved significantly
            const cardWidth = getCardWidth();
            const currentScroll = sliderContent.scrollLeft;
            const cardIndex = Math.round(currentScroll / cardWidth);
            const targetScroll = cardIndex * cardWidth;
            const maxScroll = sliderContent.scrollWidth - sliderContent.clientWidth;
            
            // Ensure target is within bounds
            const finalTarget = Math.max(0, Math.min(targetScroll, maxScroll));
            
            if (Math.abs(currentScroll - finalTarget) > 5) {
                smoothScrollTo(finalTarget, 200);
            }
        }
        
        // Mouse events (desktop)
        if (!isTouch) {
            sliderContent.addEventListener('mousedown', (e) => {
                e.preventDefault();
                handleStart(e.clientX, e.clientY);
                sliderContent.style.cursor = 'grabbing';
            });
            
            sliderContent.addEventListener('mousemove', (e) => {
                if (handleMove(e.clientX, e.clientY)) {
                    e.preventDefault();
                }
            });
            
            sliderContent.addEventListener('mouseup', () => {
                handleEnd();
                sliderContent.style.cursor = 'grab';
            });
            
            sliderContent.addEventListener('mouseleave', () => {
                handleEnd();
                sliderContent.style.cursor = 'grab';
            });
        }
        
        // Touch events (mobile)
        let touchStartTime = 0;
        
        sliderContent.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            const touch = e.touches[0];
            handleStart(touch.clientX, touch.clientY);
        }, { passive: true });
        
        sliderContent.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            if (handleMove(touch.clientX, touch.clientY)) {
                e.preventDefault();
            }
        }, { passive: false });
        
        sliderContent.addEventListener('touchend', (e) => {
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            
            // Quick swipe detection
            if (touchDuration < 300 && Math.abs(startX - e.changedTouches[0].clientX) > 50) {
                const direction = startX > e.changedTouches[0].clientX ? 'next' : 'prev';
                if (direction === 'next') {
                    handleNext();
                } else {
                    handlePrev();
                }
            } else {
                handleEnd();
            }
        });
        
        // Resize handler
        function handleResize() {
            // Update mobile detection
            const newIsMobile = window.innerWidth <= 768;
            if (newIsMobile !== isMobile) {
                // Re-initialize if screen size category changed
                location.reload(); // Simple approach for this case
            }
        }
        
        // Throttled resize listener
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 250);
        });
        
        // Cleanup function
        return () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            nextButton.removeEventListener('click', handleNext);
            prevButton.removeEventListener('click', handlePrev);
        };
    };
    
    // Initialize both sliders
    initializeSlider('.movie-slider');
    initializeSlider('.series-slider');

    // Mobile Menu Toggle with animations
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('nav');
    const backdrop = document.querySelector('.menu-backdrop');

    // Hamburger menü varsa event listener ekle
    if (hamburgerMenu && nav) {
    hamburgerMenu.addEventListener('click', function() {
        // Toggle navigation and animation classes
            nav.classList.toggle('mobile-active');
        hamburgerMenu.classList.toggle('active');
        
        if (backdrop) {
            backdrop.classList.toggle('active');
        }
        
        // Transform hamburger to X
        const bars = this.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.toggle('animate'));
        
        // Menü açıkken body'nin scroll'unu engelle
            if (nav.classList.contains('mobile-active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    }

    // Close mobile menu when clicking outside
    if (backdrop) {
        backdrop.addEventListener('click', function() {
            closeMenu();
        });
    }
    
    // Kapatma fonksiyonu
    function closeMenu() {
        if (nav) nav.classList.remove('mobile-active');
        if (hamburgerMenu) hamburgerMenu.classList.remove('active');
        if (backdrop) {
            backdrop.classList.remove('active');
        }
        
        if (hamburgerMenu) {
        const bars = hamburgerMenu.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.remove('animate'));
        }
        
        document.body.style.overflow = '';
    }

    // Handle window resize for responsive menu
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            closeMenu();
        }
    });

    // ESC tuşuna basınca menüyü kapat
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav && nav.classList.contains('mobile-active')) {
            closeMenu();
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

    // Dizi Detay Sayfası - Sezon Sekmeleri
    const seasonTabs = document.querySelectorAll('.season-tab');
    const seasonContents = document.querySelectorAll('.season-content');
    
    if (seasonTabs.length > 0 && seasonContents.length > 0) {
        seasonTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Aktif sekmeleri kaldır
                seasonTabs.forEach(t => t.classList.remove('active'));
                seasonContents.forEach(c => c.classList.remove('active'));
                
                // Tıklanan sekmeyi aktif yap
                tab.classList.add('active');
                
                // İlgili içeriği göster
                const targetSeason = tab.getAttribute('data-season');
                const targetContent = document.getElementById(`season-${targetSeason}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    // Yorum derecelendirme yıldızları
    const ratingStars = document.querySelectorAll('.rating i');
    const ratingInput = document.querySelector('input[name="rating"]');
    
    if (ratingStars.length > 0 && ratingInput) {
        ratingStars.forEach(star => {
            star.addEventListener('mouseenter', () => {
                const rating = star.getAttribute('data-rating');
                
                // Önceki yıldızları dolu, sonrakileri boş yap
                ratingStars.forEach(s => {
                    if (s.getAttribute('data-rating') <= rating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });
            
            star.addEventListener('click', () => {
                const rating = star.getAttribute('data-rating');
                ratingInput.value = rating;
            });
        });
        
        // Mouse ayrıldığında, seçili olan derecenin görünmesi
        const ratingContainer = document.querySelector('.rating');
        if (ratingContainer) {
            ratingContainer.addEventListener('mouseleave', () => {
                const currentRating = ratingInput.value;
                
                ratingStars.forEach(s => {
                    if (s.getAttribute('data-rating') <= currentRating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });
        }
    }

    // Kategori sayfası için görünüm değiştirme ve filtreleme
    const initCategoryPage = () => {
        // Görünüm değiştirme butonları
        const gridViewBtn = document.querySelector('.grid-view');
        const listViewBtn = document.querySelector('.list-view');
        const contentGrid = document.querySelector('.content-grid');
        const contentList = document.querySelector('.content-list');

        if (gridViewBtn && listViewBtn && contentGrid && contentList) {
            // Izgara görünümü
            gridViewBtn.addEventListener('click', function() {
                if (!this.classList.contains('active')) {
                    this.classList.add('active');
                    listViewBtn.classList.remove('active');
                    contentGrid.style.display = 'grid';
                    contentList.style.display = 'none';
                    
                    // Kullanıcı tercihini localStorage'a kaydet
                    localStorage.setItem('categoryViewMode', 'grid');
                }
            });

            // Liste görünümü
            listViewBtn.addEventListener('click', function() {
                if (!this.classList.contains('active')) {
                    this.classList.add('active');
                    gridViewBtn.classList.remove('active');
                    contentList.style.display = 'flex';
                    contentGrid.style.display = 'none';
                    
                    // Kullanıcı tercihini localStorage'a kaydet
                    localStorage.setItem('categoryViewMode', 'list');
                }
            });
            
            // Sayfa yüklendiğinde localStorage'dan tercihi al
            const viewMode = localStorage.getItem('categoryViewMode');
            if (viewMode === 'list') {
                listViewBtn.click();
            } else {
                gridViewBtn.click();
            }
        }
        
        // Filtre temizleme butonu
        const clearFiltersBtn = document.querySelector('.clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', function() {
                // Checkbox'ları varsayılana getir
                document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
                    if (checkbox.closest('.filter-group h4').textContent === 'İçerik Tipi') {
                        checkbox.checked = true; // İçerik tipi checkbox'ları varsayılan olarak seçili
                    } else {
                        checkbox.checked = false; // Diğerleri seçili değil
                    }
                });
                
                // Radio butonları varsayılana getir
                document.querySelector('.rating-filter input[value="all"]').checked = true;
                
                // Range slider'ı varsayılana getir
                const yearMinInput = document.getElementById('year-range-min');
                const yearMaxInput = document.getElementById('year-range-max');
                const yearMinDisplay = document.getElementById('year-min');
                const yearMaxDisplay = document.getElementById('year-max');
                
                if (yearMinInput && yearMaxInput) {
                    yearMinInput.value = 2000;
                    yearMaxInput.value = 2024;
                    
                    if (yearMinDisplay && yearMaxDisplay) {
                        yearMinDisplay.textContent = 2000;
                        yearMaxDisplay.textContent = 2024;
                    }
                }
            });
        }
        
        // Yıl range slider fonksiyonu
        const yearMinInput = document.getElementById('year-range-min');
        const yearMaxInput = document.getElementById('year-range-max');
        const yearMinDisplay = document.getElementById('year-min');
        const yearMaxDisplay = document.getElementById('year-max');
        
        if (yearMinInput && yearMaxInput && yearMinDisplay && yearMaxDisplay) {
            // Min değer değiştiğinde
            yearMinInput.addEventListener('input', function() {
                const minVal = parseInt(this.value);
                const maxVal = parseInt(yearMaxInput.value);
                
                // Min değerin max değerden büyük olmamasını sağla
                if (minVal > maxVal) {
                    this.value = maxVal;
                    yearMinDisplay.textContent = maxVal;
                } else {
                    yearMinDisplay.textContent = minVal;
                }
            });
            
            // Max değer değiştiğinde
            yearMaxInput.addEventListener('input', function() {
                const maxVal = parseInt(this.value);
                const minVal = parseInt(yearMinInput.value);
                
                // Max değerin min değerden küçük olmamasını sağla
                if (maxVal < minVal) {
                    this.value = minVal;
                    yearMaxDisplay.textContent = minVal;
                } else {
                    yearMaxDisplay.textContent = maxVal;
                }
            });
        }
        
        // Filtreleri uygula butonu
        const applyFiltersBtn = document.querySelector('.apply-filters-btn');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', function() {
                // Filtre uygulandı efekti
                const filterSidebar = document.querySelector('.filter-sidebar');
                if (filterSidebar) {
                    filterSidebar.classList.add('filter-applied');
                    setTimeout(() => {
                        filterSidebar.classList.remove('filter-applied');
                    }, 500);
                    
                    // Mobil görünümde ise filtre panelini kapat
                    if (window.innerWidth <= 992 && filterSidebar.classList.contains('active')) {
                        filterSidebar.classList.remove('active');
                        document.body.classList.remove('sidebar-open');
                        
                        // Filtreler butonunu güncelle
                        const mobileFilterToggle = document.querySelector('.mobile-filter-toggle');
                        if (mobileFilterToggle) {
                            mobileFilterToggle.innerHTML = '<i class="fas fa-filter"></i> Filtreler';
                        }
                        
                        // Backdrop'u kaldır
                        const filterBackdrop = document.querySelector('.filter-backdrop');
                        if (filterBackdrop) {
                            filterBackdrop.remove();
                        }
                    }
                }
                
                // Burada backend entegrasyonu yapılacak
                // Şimdilik sadece bir görsel feedback verelim
                const resultsCount = document.querySelector('.results-count span');
                if (resultsCount) {
                    // Rastgele sonuç sayısı göster (demo için)
                    const randomCount = Math.floor(Math.random() * 80) + 10;
                    resultsCount.textContent = `${randomCount} sonuç bulundu`;
                }
            });
        }
        
        // Mobil uyumluluk için sidebar açma/kapama
        const mobileFilterToggle = document.createElement('button');
        mobileFilterToggle.className = 'mobile-filter-toggle';
        mobileFilterToggle.innerHTML = '<i class="fas fa-filter"></i> Filtreler';
        
        const categoryContent = document.querySelector('.category-content .container');
        if (categoryContent) {
            categoryContent.insertBefore(mobileFilterToggle, categoryContent.firstChild);
            
            mobileFilterToggle.addEventListener('click', function() {
                const filterSidebar = document.querySelector('.filter-sidebar');
                if (filterSidebar) {
                    if (filterSidebar.classList.contains('active')) {
                        filterSidebar.classList.remove('active');
                        document.body.classList.remove('sidebar-open');
                        this.innerHTML = '<i class="fas fa-filter"></i> Filtreler';
                    } else {
                        filterSidebar.classList.add('active');
                        document.body.classList.add('sidebar-open');
                        this.innerHTML = '<i class="fas fa-times"></i> Kapat';
                        
                        // Filtre sidebar'ını kapatmak için ESC tuşu eventi
                        const closeFilterOnEsc = (e) => {
                            if (e.key === 'Escape' && filterSidebar.classList.contains('active')) {
                                filterSidebar.classList.remove('active');
                                document.body.classList.remove('sidebar-open');
                                mobileFilterToggle.innerHTML = '<i class="fas fa-filter"></i> Filtreler';
                                document.removeEventListener('keydown', closeFilterOnEsc);
                                
                                // Backdrop'u kaldır
                                const filterBackdrop = document.querySelector('.filter-backdrop');
                                if (filterBackdrop) {
                                    filterBackdrop.remove();
                                }
                            }
                        };
                        
                        document.addEventListener('keydown', closeFilterOnEsc);
                        
                        // Kapatma butonunu oluştur ve sidebar'a ekle
                        if (!filterSidebar.querySelector('.close-sidebar-btn')) {
                            const closeBtn = document.createElement('button');
                            closeBtn.className = 'close-sidebar-btn';
                            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
                            
                            // Sidebar'ın en üstüne ekle
                            if (filterSidebar.firstChild) {
                                filterSidebar.insertBefore(closeBtn, filterSidebar.firstChild);
                            } else {
                                filterSidebar.appendChild(closeBtn);
                            }
                            
                            // Kapatma butonuna tıklama olayı
                            closeBtn.addEventListener('click', function() {
                                filterSidebar.classList.remove('active');
                                document.body.classList.remove('sidebar-open');
                                mobileFilterToggle.innerHTML = '<i class="fas fa-filter"></i> Filtreler';
                                
                                // Backdrop'u kaldır
                                const filterBackdrop = document.querySelector('.filter-backdrop');
                                if (filterBackdrop) {
                                    filterBackdrop.remove();
                                }
                            });
                        }
                        
                        // Backdrop oluştur
                        if (!document.querySelector('.filter-backdrop')) {
                            const backdrop = document.createElement('div');
                            backdrop.className = 'filter-backdrop';
                            document.body.appendChild(backdrop);
                            
                            // Backdrop'a tıklandığında sidebar'ı kapat
                            backdrop.addEventListener('click', function() {
                                filterSidebar.classList.remove('active');
                                document.body.classList.remove('sidebar-open');
                                mobileFilterToggle.innerHTML = '<i class="fas fa-filter"></i> Filtreler';
                                this.remove();
                            });
                        }
                    }
                }
            });
        }

        // Sıralama değiştiğinde
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                // Burada sıralama değiştiğinde backend entegrasyonu yapılacak
                // Şimdilik sadece konsola yazdıralım
                console.log('Sıralama değişti: ' + this.value);
            });
        }
    };

    // Kategori sayfası init
    initCategoryPage();
    
    // Arama sonuçları sayfası işlevselliği
    const initSearchResultsPage = () => {
        // Sayfa ID'sini kontrol et
        const searchResultsPage = document.getElementById('search-results-page');
        if (!searchResultsPage) return;
        
        // Sayfa parametrelerini al
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('q') || 'Batman'; // Varsayılan olarak Batman
        
        // Başlık ve sonuç sayısını güncelle
        const searchTermElement = document.getElementById('searchTerm');
        const resultCountElement = document.getElementById('resultCount');
        
        if (searchTermElement) {
            searchTermElement.textContent = searchQuery;
        }
        
        // Mobil filtre butonu oluştur - Sayfa yüklendiğinde hemen çalışması için konum değiştirildi
        createMobileFilterToggle();
        
        // Görünüm değiştirme butonları
        const gridViewBtn = document.querySelector('.grid-view');
        const listViewBtn = document.querySelector('.list-view');
        const contentGrid = document.querySelector('.content-grid');
        const contentList = document.querySelector('.content-list');

        if (gridViewBtn && listViewBtn && contentGrid && contentList) {
            // Izgara görünümü
            gridViewBtn.addEventListener('click', function() {
                if (!this.classList.contains('active')) {
                    this.classList.add('active');
                    listViewBtn.classList.remove('active');
                    contentGrid.style.display = 'grid';
                    contentList.style.display = 'none';
                    
                    // Kullanıcı tercihini localStorage'a kaydet
                    localStorage.setItem('searchViewMode', 'grid');
                }
            });

            // Liste görünümü
            listViewBtn.addEventListener('click', function() {
                if (!this.classList.contains('active')) {
                    this.classList.add('active');
                    gridViewBtn.classList.remove('active');
                    contentList.style.display = 'flex';
                    contentGrid.style.display = 'none';
                    
                    // Kullanıcı tercihini localStorage'a kaydet
                    localStorage.setItem('searchViewMode', 'list');
                }
            });
            
            // Sayfa yüklendiğinde localStorage'dan tercihi al
            const viewMode = localStorage.getItem('searchViewMode');
            if (viewMode === 'list') {
                listViewBtn.click();
            } else {
                gridViewBtn.click();
            }
        }
        
        // Filtre temizleme butonu
        const clearFiltersBtn = document.querySelector('.clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', function() {
                // Checkbox'ları varsayılana getir
                document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = true;
                });
                
                // Radio butonları varsayılana getir
                document.querySelector('.rating-filter input[value="all"]').checked = true;
                
                // Range slider'ı varsayılana getir
                const yearMinInput = document.getElementById('year-range-min');
                const yearMaxInput = document.getElementById('year-range-max');
                const yearMinDisplay = document.getElementById('year-min');
                const yearMaxDisplay = document.getElementById('year-max');
                
                if (yearMinInput && yearMaxInput) {
                    yearMinInput.value = 1980;
                    yearMaxInput.value = 2024;
                    
                    if (yearMinDisplay && yearMaxDisplay) {
                        yearMinDisplay.textContent = 1980;
                        yearMaxDisplay.textContent = 2024;
                    }
                }
            });
        }
        
        // Yıl range slider fonksiyonu
        const yearMinInput = document.getElementById('year-range-min');
        const yearMaxInput = document.getElementById('year-range-max');
        const yearMinDisplay = document.getElementById('year-min');
        const yearMaxDisplay = document.getElementById('year-max');
        
        if (yearMinInput && yearMaxInput && yearMinDisplay && yearMaxDisplay) {
            // Min değer değiştiğinde
            yearMinInput.addEventListener('input', function() {
                const minVal = parseInt(this.value);
                const maxVal = parseInt(yearMaxInput.value);
                
                // Min değerin max değerden büyük olmamasını sağla
                if (minVal > maxVal) {
                    this.value = maxVal;
                    yearMinDisplay.textContent = maxVal;
                } else {
                    yearMinDisplay.textContent = minVal;
                }
            });
            
            // Max değer değiştiğinde
            yearMaxInput.addEventListener('input', function() {
                const maxVal = parseInt(this.value);
                const minVal = parseInt(yearMinInput.value);
                
                // Max değerin min değerden küçük olmamasını sağla
                if (maxVal < minVal) {
                    this.value = minVal;
                    yearMaxDisplay.textContent = minVal;
                } else {
                    yearMaxDisplay.textContent = maxVal;
                }
            });
        }
        
        // Filtreleri uygula butonu
        const applyFiltersBtn = document.querySelector('.apply-filters-btn');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', function() {
                // Filtre uygulandı efekti
                const filterSidebar = document.querySelector('.filter-sidebar');
                if (filterSidebar) {
                    filterSidebar.classList.add('filter-applied');
                    setTimeout(() => {
                        filterSidebar.classList.remove('filter-applied');
                    }, 500);
                    
                    // Mobil görünümde ise filtre panelini kapat
                    if (window.innerWidth <= 992 && filterSidebar.classList.contains('active')) {
                        filterSidebar.classList.remove('active');
                        document.body.classList.remove('sidebar-open');
                        
                        // Backdrop'u kaldır
                        const filterBackdrop = document.querySelector('.filter-backdrop');
                        if (filterBackdrop) {
                            filterBackdrop.remove();
                        }
                    }
                }
                
                // Filtreleme için gerekli veriler burada toplanır ve API'ye gönderilir
                const selectedTypes = [];
                document.querySelectorAll('.filter-group:nth-child(1) input[type="checkbox"]:checked').forEach(cb => {
                    selectedTypes.push(cb.parentElement.textContent.trim());
                });
                
                const selectedGenres = [];
                document.querySelectorAll('.filter-group:nth-child(2) input[type="checkbox"]:checked').forEach(cb => {
                    selectedGenres.push(cb.parentElement.textContent.trim());
                });
                
                const yearRange = {
                    min: parseInt(yearMinInput.value),
                    max: parseInt(yearMaxInput.value)
                };
                
                const ratingValue = document.querySelector('.rating-filter input[name="rating"]:checked').value;
                
                // Bu verilerle API çağrısı yapılır (şimdilik gösterim amaçlı)
                console.log('Filtreler uygulanıyor:', {
                    types: selectedTypes,
                    genres: selectedGenres,
                    yearRange: yearRange,
                    rating: ratingValue
                });
                
                // Yapay olarak bir yükleme efekti oluşturalım
                const movieCards = document.querySelectorAll('.movie-card');
                movieCards.forEach(card => {
                    card.style.opacity = '0.5';
                    card.style.pointerEvents = 'none';
                });
                
                setTimeout(() => {
                    // Normal görünüme geri dön
                    movieCards.forEach(card => {
                        card.style.opacity = '1';
                        card.style.pointerEvents = 'auto';
                    });
                    
                    // Sonuç sayısını güncelle
                    if (resultCountElement) {
                        const randomCount = Math.floor(Math.random() * 15) + 5;
                        resultCountElement.textContent = randomCount;
                        
                        // Sonuç sayısını diğer alanda da güncelle
                        const resultsCountSpan = document.querySelector('.results-count span');
                        if (resultsCountSpan) {
                            resultsCountSpan.textContent = `${randomCount} sonuç bulundu`;
                        }
                    }
                }, 1000);
            });
        }
        
        // Mobil filtre butonu oluştur
        function createMobileFilterToggle() {
            // Zaten bir mobil filtre butonu varsa işlem yapma
            if (document.querySelector('.mobile-filter-toggle')) {
                // Buton zaten varsa görünürlüğünü kontrol et
                const mobileFilterToggle = document.querySelector('.mobile-filter-toggle');
                if (window.innerWidth <= 992) {
                    mobileFilterToggle.style.display = 'block';
                } else {
                    mobileFilterToggle.style.display = 'none';
                }
                return;
            }
            
            const mobileFilterToggle = document.createElement('button');
            mobileFilterToggle.className = 'mobile-filter-toggle';
            mobileFilterToggle.innerHTML = '<i class="fas fa-filter"></i> Filtreler';
            
            const searchContent = document.querySelector('.search-content .container');
            const searchGrid = document.querySelector('.search-grid');
            
            if (searchContent && searchGrid) {
                // Buton sayfada yoksa ekle
                searchContent.insertBefore(mobileFilterToggle, searchGrid);
                
                // Tıklama olayını ekle
                mobileFilterToggle.addEventListener('click', function() {
                    const filterSidebar = document.querySelector('.filter-sidebar');
                    if (filterSidebar) {
                        if (filterSidebar.classList.contains('active')) {
                            closeMobileFilter();
                        } else {
                            openMobileFilter();
                        }
                    }
                });
                
                // Ekran boyutuna göre görünürlüğü ayarla
                if (window.innerWidth <= 992) {
                    mobileFilterToggle.style.display = 'block';
                } else {
                    mobileFilterToggle.style.display = 'none';
                }
            }
        }
        
        // Mobil filtreyi aç
        function openMobileFilter() {
            const filterSidebar = document.querySelector('.filter-sidebar');
            const mobileFilterToggle = document.querySelector('.mobile-filter-toggle');
            
            if (filterSidebar && mobileFilterToggle) {
                filterSidebar.classList.add('active');
                document.body.classList.add('sidebar-open');
                mobileFilterToggle.innerHTML = '<i class="fas fa-times"></i> Kapat';
                
                // Backdrop oluştur
                if (!document.querySelector('.filter-backdrop')) {
                    const backdrop = document.createElement('div');
                    backdrop.className = 'filter-backdrop';
                    document.body.appendChild(backdrop);
                    
                    backdrop.addEventListener('click', closeMobileFilter);
                }
                
                // Kapatma butonunu ekle
                if (!filterSidebar.querySelector('.close-sidebar-btn')) {
                    const closeBtn = document.createElement('button');
                    closeBtn.className = 'close-sidebar-btn';
                    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
                    
                    if (filterSidebar.firstChild) {
                        filterSidebar.insertBefore(closeBtn, filterSidebar.firstChild);
                    } else {
                        filterSidebar.appendChild(closeBtn);
                    }
                    
                    closeBtn.addEventListener('click', closeMobileFilter);
                }
            }
        }
        
        // Mobil filtreyi kapat
        function closeMobileFilter() {
            const filterSidebar = document.querySelector('.filter-sidebar');
            const mobileFilterToggle = document.querySelector('.mobile-filter-toggle');
            
            if (filterSidebar) {
                filterSidebar.classList.remove('active');
                document.body.classList.remove('sidebar-open');
                
                if (mobileFilterToggle) {
                    mobileFilterToggle.innerHTML = '<i class="fas fa-filter"></i> Filtreler';
                }
                
                const filterBackdrop = document.querySelector('.filter-backdrop');
                if (filterBackdrop) {
                    filterBackdrop.remove();
                }
            }
        }
        
        // Pencere boyutu değiştiğinde mobil filtre butonunu kontrol et
        window.addEventListener('resize', () => {
            createMobileFilterToggle();
            
            if (window.innerWidth > 992) {
                // Mobil filtre açıksa kapat
                closeMobileFilter();
            }
        });

        // Film kartları için hover efektleri
        const movieCards = document.querySelectorAll('#search-results-page .movie-card');
        
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
        });
        
        // Arama kutusu işlevselliği
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        
        if (searchInput && searchButton) {
            // Aramayı işle
            const processSearch = () => {
                const query = searchInput.value.trim();
                if (query.length > 2) {
                    // Gerçek uygulamada burada bir yönlendirme yapılır
                    window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
                }
            };
            
            // Arama butonuna tıklama
            searchButton.addEventListener('click', processSearch);
            
            // Enter tuşuna basma
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    processSearch();
                }
            });
            
            // Mevcut arama terimini ara kutusuna yerleştir
            if (searchQuery && searchQuery !== 'Batman') {
                searchInput.value = searchQuery;
            }
        }
    };
    
    // Arama sonuçları sayfası init
    initSearchResultsPage();

    // Initialize all functions when page loads
    initCategoryPage();
    initSearchResultsPage();
    
    // ===== LOGIN REGISTER PAGE FUNCTIONALITY =====
    const initLoginRegisterPage = () => {
        // Check if we're on the login-register page
        if (!document.getElementById('login-register-page')) return;
        
        // Tab switching functionality
        const authTabs = document.querySelectorAll('.auth-tab');
        const formContainers = document.querySelectorAll('.auth-form-container');
        
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Remove active class from all tabs and containers
                authTabs.forEach(t => t.classList.remove('active'));
                formContainers.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding form container
                const targetContainer = document.getElementById(`${targetTab}-form`);
                if (targetContainer) {
                    targetContainer.classList.add('active');
                }
            });
        });
        
        // Handle links that switch between forms
        const formSwitchLinks = document.querySelectorAll('[data-tab]');
        formSwitchLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = link.dataset.tab;
                
                // Find and click the corresponding tab
                const targetTabButton = document.querySelector(`.auth-tab[data-tab="${targetTab}"]`);
                if (targetTabButton) {
                    targetTabButton.click();
                }
            });
        });
        
        // Password toggle functionality
        const passwordToggles = document.querySelectorAll('.password-toggle');
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const targetId = toggle.dataset.target;
                const passwordInput = document.getElementById(targetId);
                const icon = toggle.querySelector('i');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
        
        // Password strength indicator
        const registerPassword = document.getElementById('register-password');
        if (registerPassword) {
            const strengthBar = document.querySelector('.strength-fill');
            const strengthText = document.querySelector('.strength-text');
            
            registerPassword.addEventListener('input', () => {
                const password = registerPassword.value;
                const strength = calculatePasswordStrength(password);
                
                // Update strength bar
                strengthBar.style.width = strength.percentage + '%';
                strengthText.textContent = strength.text;
                
                // Update bar color based on strength
                strengthBar.style.background = strength.color;
            });
        }
        
        // Password confirmation validation
        const confirmPassword = document.getElementById('register-confirm-password');
        if (confirmPassword && registerPassword) {
            confirmPassword.addEventListener('input', () => {
                const password = registerPassword.value;
                const confirm = confirmPassword.value;
                
                if (confirm && password !== confirm) {
                    confirmPassword.style.borderColor = '#ff4757';
                } else {
                    confirmPassword.style.borderColor = '';
                }
            });
        }
        
        // Form validation
        const forms = document.querySelectorAll('.auth-form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                const formType = form.closest('.auth-form-container').id;
                
                // Validate form based on type
                if (validateForm(form, formType)) {
                    // Form is valid, proceed with submission
                    console.log('Form validation passed:', formType);
                    // Here you would typically send the data to your backend
                    showSuccessMessage('Form submitted successfully!');
                } else {
                    showErrorMessage('Please check your form data and try again.');
                }
            });
        });
        
        // Search box focus animation
        const searchBox = document.querySelector('.search-box');
        const searchInput = searchBox?.querySelector('input');
        
        if (searchInput) {
            searchInput.addEventListener('focus', () => {
                searchBox.classList.add('focused');
            });
            
            searchInput.addEventListener('blur', () => {
                searchBox.classList.remove('focused');
            });
        }
    };
    
    // Password strength calculation function
    function calculatePasswordStrength(password) {
        let score = 0;
        let feedback = [];
        
        if (password.length === 0) {
            return {
                percentage: 0,
                text: 'Şifre gücü',
                color: '#ddd'
            };
        }
        
        // Length check
        if (password.length >= 8) score += 25;
        else feedback.push('En az 8 karakter');
        
        // Uppercase check
        if (/[A-Z]/.test(password)) score += 25;
        else feedback.push('Büyük harf');
        
        // Lowercase check
        if (/[a-z]/.test(password)) score += 25;
        else feedback.push('Küçük harf');
        
        // Number check
        if (/\d/.test(password)) score += 25;
        else feedback.push('Rakam');
        
        // Special character check
        if (/[^A-Za-z0-9]/.test(password)) score += 10;
        
        let text, color;
        
        if (score < 30) {
            text = 'Zayıf';
            color = '#ff4757';
        } else if (score < 60) {
            text = 'Orta';
            color = '#ffa502';
        } else if (score < 90) {
            text = 'İyi';
            color = '#2ed573';
        } else {
            text = 'Mükemmel';
            color = '#2ed573';
        }
        
        return {
            percentage: Math.min(score, 100),
            text: text,
            color: color
        };
    }
    
    // Form validation function
    function validateForm(form, formType) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            // Remove previous error styling
            input.style.borderColor = '';
            
            // Check if field is empty
            if (!input.value.trim()) {
                input.style.borderColor = '#ff4757';
                isValid = false;
                return;
            }
            
            // Email validation
            if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    input.style.borderColor = '#ff4757';
                    isValid = false;
                    return;
                }
            }
            
            // Password validation for register form
            if (formType === 'register-form' && input.name === 'password') {
                if (input.value.length < 8) {
                    input.style.borderColor = '#ff4757';
                    isValid = false;
                    return;
                }
            }
            
            // Confirm password validation
            if (input.name === 'confirm_password') {
                const passwordInput = form.querySelector('[name="password"]');
                if (passwordInput && input.value !== passwordInput.value) {
                    input.style.borderColor = '#ff4757';
                    isValid = false;
                    return;
                }
            }
        });
        
        // Check required checkboxes for register form
        if (formType === 'register-form') {
            const requiredCheckboxes = form.querySelectorAll('input[type="checkbox"][required]');
            requiredCheckboxes.forEach(checkbox => {
                if (!checkbox.checked) {
                    // Highlight the checkbox container
                    const container = checkbox.closest('.checkbox-container');
                    if (container) {
                        container.style.color = '#ff4757';
                        setTimeout(() => {
                            container.style.color = '';
                        }, 3000);
                    }
                    isValid = false;
                }
            });
        }
        
        return isValid;
    }
    
    // Success message function
    function showSuccessMessage(message) {
        // Create and show success message
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #2ed573, #26d063);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(46,213,115,0.3);
            z-index: 10000;
            font-weight: 500;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 3000);
    }
    
    // Error message function
    function showErrorMessage(message) {
        // Create and show error message
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #ff4757, #ff3838);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(255,71,87,0.3);
            z-index: 10000;
            font-weight: 500;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 3000);
    }
    
    // Initialize login-register page
    initLoginRegisterPage();
    
    // ===== PROFILE PAGE FUNCTIONALITY =====
    
    // Profile Page Initialization
    const initProfilePage = () => {
        const profilePage = document.getElementById('profile-page');
        if (!profilePage) return;
        
        // Tab Switching
        initProfileTabs();
        
        // View Toggle (Grid/List)
        initViewToggle();
        
        // Profile Actions
        initProfileActions();
        
        // Remove from List/Favorites
        initRemoveActions();
        
        // Load More functionality
        initLoadMore();
        
        // Filter functionality
        initWatchedFilter();
    };
    
    // Profile Tabs Functionality
    function initProfileTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all tabs
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab
                button.classList.add('active');
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
                
                // Animate tab change
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 150);
            });
        });
    }
    
    // View Toggle (Grid/List)
    function initViewToggle() {
        const gridViewBtn = document.querySelector('.view-btn.grid-view');
        const listViewBtn = document.querySelector('.view-btn.list-view');
        const contentGrid = document.querySelector('.content-grid');
        
        if (gridViewBtn && listViewBtn && contentGrid) {
            gridViewBtn.addEventListener('click', () => {
                gridViewBtn.classList.add('active');
                listViewBtn.classList.remove('active');
                contentGrid.classList.remove('list-mode');
                contentGrid.classList.add('grid-mode');
            });
            
            listViewBtn.addEventListener('click', () => {
                listViewBtn.classList.add('active');
                gridViewBtn.classList.remove('active');
                contentGrid.classList.remove('grid-mode');
                contentGrid.classList.add('list-mode');
            });
        }
    }
    
    // Profile Actions (Edit Profile, Settings)
    function initProfileActions() {
        const editProfileBtn = document.querySelector('.edit-profile-btn');
        const settingsBtn = document.querySelector('.settings-btn');
        const editCoverBtn = document.querySelector('.edit-cover-btn');
        const editAvatarBtn = document.querySelector('.edit-avatar-btn');
        
        // Edit Profile
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => {
                showProfileEditModal();
            });
        }
        
        // Settings
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                showSettingsModal();
            });
        }
        
        // Edit Cover Photo
        if (editCoverBtn) {
            editCoverBtn.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const coverImg = document.querySelector('.profile-cover img');
                            if (coverImg) {
                                coverImg.src = e.target.result;
                                showSuccessMessage('Kapak fotoğrafı güncellendi!');
                            }
                        };
                        reader.readAsDataURL(file);
                    }
                };
                input.click();
            });
        }
        
        // Edit Avatar
        if (editAvatarBtn) {
            editAvatarBtn.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const avatarImg = document.querySelector('.profile-avatar img');
                            const profileImgs = document.querySelectorAll('.profile-img');
                            if (avatarImg) {
                                avatarImg.src = e.target.result;
                                // Update profile images in dropdown too
                                profileImgs.forEach(img => {
                                    img.src = e.target.result;
                                });
                                showSuccessMessage('Profil fotoğrafı güncellendi!');
                            }
                        };
                        reader.readAsDataURL(file);
                    }
                };
                input.click();
            });
        }
    }
    
    // Remove from List/Favorites
    function initRemoveActions() {
        const removeButtons = document.querySelectorAll('.remove-from-list, .remove-from-favorites');
        
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const movieCard = button.closest('.movie-card');
                const isFromFavorites = button.classList.contains('remove-from-favorites');
                
                if (movieCard) {
                    // Animate removal
                    movieCard.style.transform = 'scale(0.8)';
                    movieCard.style.opacity = '0';
                    
                    setTimeout(() => {
                        movieCard.remove();
                        const message = isFromFavorites ? 
                            'Film favorilerden çıkarıldı!' : 
                            'Film izleme listesinden çıkarıldı!';
                        showSuccessMessage(message);
                        
                        // Update counter in tab if exists
                        updateTabCounter(isFromFavorites ? 'favorites' : 'watchlist');
                    }, 300);
                }
            });
        });
    }
    
    // Load More functionality
    function initLoadMore() {
        const loadMoreBtns = document.querySelectorAll('.load-more .btn');
        
        loadMoreBtns.forEach(button => {
            button.addEventListener('click', () => {
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yükleniyor...';
                button.disabled = true;
                
                // Simulate loading
                setTimeout(() => {
                    button.innerHTML = 'Daha Fazla Yükle';
                    button.disabled = false;
                    showSuccessMessage('Daha fazla içerik yüklendi!');
                }, 1500);
            });
        });
    }
    
    // Watched Filter
    function initWatchedFilter() {
        const watchedFilter = document.getElementById('watched-filter');
        
        if (watchedFilter) {
            watchedFilter.addEventListener('change', () => {
                const selectedValue = watchedFilter.value;
                console.log('Filter changed to:', selectedValue);
                
                // Add loading effect
                const watchedList = document.querySelector('.watched-list');
                if (watchedList) {
                    watchedList.style.opacity = '0.5';
                    setTimeout(() => {
                        watchedList.style.opacity = '1';
                        showSuccessMessage('Filtre uygulandı!');
                    }, 500);
                }
            });
        }
    }
    
    // Update Tab Counter
    function updateTabCounter(tabType) {
        const tabBtn = document.querySelector(`[data-tab="${tabType}"]`);
        if (tabBtn) {
            const text = tabBtn.textContent;
            const match = text.match(/\((\d+)\)/);
            if (match) {
                const currentCount = parseInt(match[1]);
                const newText = text.replace(/\(\d+\)/, `(${currentCount - 1})`);
                tabBtn.innerHTML = tabBtn.innerHTML.replace(text, newText);
            }
        }
    }
    
    // Show Profile Edit Modal (placeholder)
    function showProfileEditModal() {
        // This would show a modal for editing profile
        showSuccessMessage('Profil düzenleme modalı yakında eklenecek!');
    }
    
    // Show Settings Modal (placeholder)
    function showSettingsModal() {
        // This would show settings modal
        showSuccessMessage('Ayarlar modalı yakında eklenecek!');
    }
    
    // ===== PROFILE DROPDOWN FUNCTIONALITY =====
    
    // Profile Dropdown
    const initProfileDropdown = () => {
        console.log('initProfileDropdown çalışıyor...');
        const profileDropdowns = document.querySelectorAll('.profile-dropdown');
        console.log('Bulunan dropdown sayısı:', profileDropdowns.length);
        
        // Önceki event listener'ları temizle
        profileDropdowns.forEach(dropdown => {
            const newDropdown = dropdown.cloneNode(true);
            dropdown.parentNode.replaceChild(newDropdown, dropdown);
        });
        
        // Güncellenmiş dropdown'ları tekrar seç
        const updatedDropdowns = document.querySelectorAll('.profile-dropdown');
        
        updatedDropdowns.forEach((dropdown, index) => {
            const trigger = dropdown.querySelector('.profile-trigger');
            const menu = dropdown.querySelector('.profile-menu');
            
            console.log(`Dropdown ${index + 1} - trigger:`, !!trigger, 'menu:', !!menu);
            
            if (trigger && menu) {
                const screenWidth = window.innerWidth;
                const isMobile = screenWidth <= 992;
                
                console.log(`Ekran genişliği: ${screenWidth}, Mobil: ${isMobile}`);
                
                if (!isMobile) {
                    // Masaüstü - Hover events
                    console.log('Masaüstü hover event\'leri ekleniyor...');
                    
                    dropdown.addEventListener('mouseenter', (e) => {
                        console.log('🖱️ MASAÜSTÜ: Mouse enter - dropdown açılıyor');
                        dropdown.classList.add('open');
                    });
                    
                    dropdown.addEventListener('mouseleave', (e) => {
                        console.log('🖱️ MASAÜSTÜ: Mouse leave - dropdown kapanıyor');
                        dropdown.classList.remove('open');
                    });
                    
                    // Test için trigger'a da event ekle
                    trigger.addEventListener('mouseenter', (e) => {
                        console.log('🖱️ TRIGGER: Mouse enter');
                    });
                    
                } else {
                    // Mobil - Click events
                    console.log('Mobil click event\'leri ekleniyor...');
                    
                    trigger.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('📱 MOBİL: Click - dropdown toggle');
                        
                        // Diğer açık dropdown'ları kapat
                        updatedDropdowns.forEach(otherDropdown => {
                            if (otherDropdown !== dropdown) {
                                otherDropdown.classList.remove('open');
                            }
                        });
                        
                        dropdown.classList.toggle('open');
                    });
                }
            }
        });
        
        // Body click ile kapatma (hem masaüstü hem mobil için)
        const handleBodyClick = (e) => {
            const isClickInsideDropdown = e.target.closest('.profile-dropdown');
            if (!isClickInsideDropdown) {
                updatedDropdowns.forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
            }
        };
        
        // Önceki body click listener'ı kaldır
        document.removeEventListener('click', handleBodyClick);
        // Yeni listener ekle
        document.addEventListener('click', handleBodyClick);
        
        // ESC tuşu ile kapatma
        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                updatedDropdowns.forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
            }
        };
        
        // Önceki ESC listener'ı kaldır
        document.removeEventListener('keydown', handleEscKey);
        // Yeni listener ekle
        document.addEventListener('keydown', handleEscKey);
    };

    // Initialize Profile functionality
    initProfilePage();
    initProfileDropdown();

    // Window resize event'i - dropdown'ları yeniden başlat
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Tüm dropdown'ları kapat
            document.querySelectorAll('.profile-dropdown').forEach(dropdown => {
                dropdown.classList.remove('open');
            });
            // Dropdown'ları yeniden başlat
            initProfileDropdown();
        }, 300);
    });
    
    // Handle Logout
    function handleLogout() {
        const confirmLogout = confirm('Çıkış yapmak istediğinizden emin misiniz?');
        if (confirmLogout) {
            // Simulate logout process
            showSuccessMessage('Çıkış yapılıyor...');
            setTimeout(() => {
                // Redirect to login page
                window.location.href = 'login-register.html';
            }, 1500);
        }
    }

    // Contact Page Functions
    const initContactPage = () => {
        console.log('=== CONTACT PAGE INIT START ===');
        
        const contactPage = document.getElementById('contact-page');
        console.log('Contact page element found:', contactPage);
        
        if (!contactPage) {
            console.log('Contact page not found, exiting');
            return;
        }

        console.log('Initializing FAQ and Contact Form...');
        initFAQToggle();
        initContactForm();
        console.log('=== CONTACT PAGE INIT END ===');
    };

    // FAQ Toggle Functionality - Simplified Version
    function initFAQToggle() {
        console.log('=== FAQ TOGGLE INIT START ===');
        
        // Window load sonrası da kontrol et
        setTimeout(() => {
            const faqItems = document.querySelectorAll('.faq-item');
            console.log('FAQ items found after timeout:', faqItems.length);
            
            if (faqItems.length === 0) {
                console.log('No FAQ items found!');
                return;
            }
            
            faqItems.forEach((item, index) => {
                console.log(`Setting up FAQ item ${index}:`, item);
                
                const question = item.querySelector('.faq-question');
                const answer = item.querySelector('.faq-answer');
                
                if (!question) {
                    console.log(`No question found for item ${index}`);
                    return;
                }
                
                if (!answer) {
                    console.log(`No answer found for item ${index}`);
                    return;
                }
                
                // Click event'i direkt item'a da ekle
                item.addEventListener('click', function(e) {
                    console.log(`FAQ item ${index} clicked!`);
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Mevcut durumu kontrol et
                    const isActive = item.classList.contains('active');
                    console.log(`Item ${index} current state - active:`, isActive);
                    
                    // Önce tüm FAQ'ları kapat
                    faqItems.forEach((otherItem, otherIndex) => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            console.log(`Closed FAQ item ${otherIndex}`);
                        }
                    });
                    
                    // Bu item'ı toggle yap
                    if (isActive) {
                        item.classList.remove('active');
                        console.log(`Removed active from item ${index}`);
                    } else {
                        item.classList.add('active');
                        console.log(`Added active to item ${index}`);
                    }
                });
                
                // Question'a da ayrı bir listener ekle
                question.addEventListener('click', function(e) {
                    console.log(`FAQ question ${index} clicked!`);
                    e.preventDefault();
                    e.stopPropagation();
                    // Parent item'ın click event'ini tetikle
                    item.click();
                });
                
                console.log(`FAQ item ${index} setup completed`);
            });
            
            console.log('=== FAQ TOGGLE INIT COMPLETED ===');
        }, 100);
    }

    // Contact Form Validation and Submission
    function initContactForm() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        
        // Real-time validation for inputs
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateInput(input);
            });
            
            input.addEventListener('input', () => {
                // Remove error state on input
                if (input.classList.contains('error')) {
                    input.classList.remove('error');
                    removeErrorMessage(input);
                }
            });
        });

        // Form submission
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            // Validate all inputs
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            // Check privacy policy checkbox
            const privacyCheckbox = contactForm.querySelector('input[name="privacy"]');
            if (!privacyCheckbox.checked) {
                showErrorMessage('Gizlilik politikasını kabul etmelisiniz.');
                isValid = false;
            }
            
            if (isValid) {
                submitContactForm(contactForm);
            }
        });
    }

    // Validate individual input
    function validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        const name = input.name;
        let isValid = true;
        let errorMessage = '';

        // Remove previous error state
        input.classList.remove('error');
        removeErrorMessage(input);

        // Required field validation
        if (input.hasAttribute('required') && !value) {
            errorMessage = 'Bu alan zorunludur.';
            isValid = false;
        }
        // Email validation
        else if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Geçerli bir e-posta adresi giriniz.';
                isValid = false;
            }
        }
        // Phone validation
        else if (type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                errorMessage = 'Geçerli bir telefon numarası giriniz.';
                isValid = false;
            }
        }
        // Text length validation
        else if (name === 'message' && value && value.length < 10) {
            errorMessage = 'Mesaj en az 10 karakter olmalıdır.';
            isValid = false;
        }

        if (!isValid) {
            input.classList.add('error');
            showInputError(input, errorMessage);
        }

        return isValid;
    }

    // Show input-specific error
    function showInputError(input, message) {
        const inputWrapper = input.closest('.input-wrapper') || input.closest('.form-group');
        let errorElement = inputWrapper.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            inputWrapper.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #f44336;
            font-size: 0.85rem;
            margin-top: 0.5rem;
            display: block;
        `;
    }

    // Remove error message
    function removeErrorMessage(input) {
        const inputWrapper = input.closest('.input-wrapper') || input.closest('.form-group');
        const errorElement = inputWrapper.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Submit contact form
    function submitContactForm(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Reset button
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
            
            // Show success message
            showContactSuccessMessage();
            
            // Reset form
            form.reset();
            
            // Scroll to top of form
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 2000);
    }

    // Show success message for contact form
    function showContactSuccessMessage() {
        // Remove existing messages
        const existingMessage = document.querySelector('.contact-success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const successMessage = document.createElement('div');
        successMessage.className = 'contact-success-message';
        successMessage.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #4caf50, #66bb6a);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                margin-bottom: 2rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                box-shadow: 0 10px 25px rgba(76, 175, 80, 0.3);
                animation: slideInFromTop 0.5s ease-out;
            ">
                <i class="fas fa-check-circle" style="font-size: 1.2rem;"></i>
                <div>
                    <strong>Mesajınız başarıyla gönderildi!</strong>
                    <p style="margin: 0.25rem 0 0 0; opacity: 0.9; font-size: 0.9rem;">
                        En kısa sürede size dönüş yapacağız.
                    </p>
                </div>
            </div>
        `;
        
        const contactForm = document.querySelector('.contact-form-section');
        contactForm.insertBefore(successMessage, contactForm.firstChild);
        
        // Auto remove after 8 seconds
        setTimeout(() => {
            if (successMessage && successMessage.parentNode) {
                successMessage.style.transition = 'all 0.5s ease-out';
                successMessage.style.opacity = '0';
                successMessage.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    if (successMessage && successMessage.parentNode) {
                        successMessage.remove();
                    }
                }, 500);
            }
        }, 8000);
    }

    // Initialize all page functions
    initMovieSliders();
    initMobileMenu();
    initSearchFunctionality();
    initCategoryPage();
    initSearchResultsPage();
    initLoginRegisterPage();
    initProfilePage();
    initProfileDropdown();
    initContactPage(); // Add contact page initialization

    // Add CSS animation for success message
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInFromTop {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .contact-form .input-wrapper input.error,
        .contact-form .input-wrapper select.error,
        .contact-form .input-wrapper textarea.error {
            border-color: #f44336 !important;
            background: rgba(244, 67, 54, 0.1) !important;
        }
    `;
    document.head.appendChild(style);

});

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 