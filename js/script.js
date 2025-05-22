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
        let startY;
        let lastScrollPosition = 0;
        let isAnimating = false; // Animasyon durumunu takip etmek için
        const sensitivity = 1.2; // Scroll sensitivity
        const cardWidth = sliderContent.querySelector('.movie-card').offsetWidth + 20; // card width + gap
        
        // Check if slider is at the end - Manual kontrol için
        function isAtEnd() {
            return sliderContent.scrollWidth - sliderContent.scrollLeft <= sliderContent.clientWidth + 50;
        }
        
        // Check if slider is at the beginning - Manual kontrol için
        function isAtStart() {
            return sliderContent.scrollLeft <= 50;
        }
        
        // Başa git
        function goToStart() {
            if (isAnimating) return; // Animasyon devam ediyorsa işlem yapma
            
            isAnimating = true;
            sliderContent.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
            
            // Animasyon bittikten sonra bayrağı sıfırla
            setTimeout(() => {
                isAnimating = false;
            }, 500);
        }
        
        // Sona git
        function goToEnd() {
            if (isAnimating) return; // Animasyon devam ediyorsa işlem yapma
            
            isAnimating = true;
            sliderContent.scrollTo({
                left: sliderContent.scrollWidth - sliderContent.clientWidth,
                behavior: 'smooth'
            });
            
            // Animasyon bittikten sonra bayrağı sıfırla
            setTimeout(() => {
                isAnimating = false;
            }, 500);
        }
        
        // Click events for buttons
        nextButton.addEventListener('click', () => {
            if (isAnimating) return; // Animasyon devam ediyorsa işlem yapma
            
            if (isAtEnd()) {
                goToStart();
            } else {
                isAnimating = true;
                sliderContent.scrollBy({
                    left: cardWidth * 3,
                    behavior: 'smooth'
                });
                
                // Animasyon bittikten sonra bayrağı sıfırla
                setTimeout(() => {
                    isAnimating = false;
                }, 500);
            }
        });
        
        prevButton.addEventListener('click', () => {
            if (isAnimating) return; // Animasyon devam ediyorsa işlem yapma
            
            if (isAtStart()) {
                goToEnd();
            } else {
                isAnimating = true;
                sliderContent.scrollBy({
                    left: -cardWidth * 3,
                    behavior: 'smooth'
                });
                
                // Animasyon bittikten sonra bayrağı sıfırla
                setTimeout(() => {
                    isAnimating = false;
                }, 500);
            }
        });
        
        // Mouse events for drag scrolling
        sliderContent.addEventListener('mousedown', (e) => {
            if (isAnimating) return; // Animasyon devam ediyorsa işlem yapma
            
            isDown = true;
            sliderContent.classList.add('grabbing');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = sliderContent.scrollLeft;
            lastScrollPosition = scrollLeft;
        });
        
        sliderContent.addEventListener('mouseleave', () => {
            isDown = false;
            sliderContent.classList.remove('grabbing');
        });
        
        sliderContent.addEventListener('mouseup', (e) => {
            isDown = false;
            sliderContent.classList.remove('grabbing');
            
            // Kaydırma sona yakınsa ve fare bırakıldıysa, başa dön
            if (isAtEnd() && scrollLeft !== sliderContent.scrollLeft) {
                goToStart();
            }
            // Kaydırma başa yakınsa ve fare bırakıldıysa, sona git
            else if (isAtStart() && scrollLeft !== sliderContent.scrollLeft) {
                goToEnd();
            }
        });
        
        sliderContent.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            if (isAnimating) return; // Animasyon devam ediyorsa işlem yapma
            
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * sensitivity;
            sliderContent.scrollLeft = scrollLeft - walk;
        });
        
        // Mobil dokunmatik olayları
        sliderContent.addEventListener('touchstart', (e) => {
            if (isAnimating) return; // Animasyon devam ediyorsa işlem yapma
            
            isDown = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            scrollLeft = sliderContent.scrollLeft;
            lastScrollPosition = scrollLeft;
        }, { passive: true });
        
        sliderContent.addEventListener('touchend', (e) => {
            isDown = false;
            
            // Kaydırma sona yakınsa ve dokunma bitti, başa dön
            if (isAtEnd() && scrollLeft !== sliderContent.scrollLeft) {
                goToStart();
            }
            // Kaydırma başa yakınsa ve dokunma bitti, sona git
            else if (isAtStart() && scrollLeft !== sliderContent.scrollLeft) {
                goToEnd();
            }
        });
        
        sliderContent.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            if (isAnimating) return; // Animasyon devam ediyorsa işlem yapma
            
            const x = e.touches[0].clientX;
            const y = e.touches[0].clientY;
            
            // Dikey kaydırmadan daha çok yatay kaydırma varsa sayfanın kaymasını engelle
            const xDiff = Math.abs(x - startX);
            const yDiff = Math.abs(y - startY);
            
            if (xDiff > yDiff) {
                e.preventDefault();
            }
            
            const walk = (startX - x) * sensitivity;
            sliderContent.scrollLeft = scrollLeft + walk;
        }, { passive: false });
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
        
        // Menü açıkken body'nin scroll'unu engelle
        if (nav.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking outside
    if (backdrop) {
        backdrop.addEventListener('click', function() {
            closeMenu();
        });
    }
    
    // Kapatma fonksiyonu
    function closeMenu() {
        nav.classList.remove('open');
        hamburgerMenu.classList.remove('active');
        if (backdrop) {
            backdrop.classList.remove('active');
        }
        
        const bars = hamburgerMenu.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.remove('animate'));
        
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
        if (e.key === 'Escape' && nav.classList.contains('open')) {
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