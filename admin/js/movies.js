// Movies Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const movieSearch = document.getElementById('movieSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortBy = document.getElementById('sortBy');
    const viewBtns = document.querySelectorAll('.view-btn');
    const moviesGrid = document.getElementById('moviesGrid');
    const addMovieBtn = document.getElementById('addMovieBtn');
    
    // Initialize movies page
    initMoviesPage();
    
    function initMoviesPage() {
        setupEventListeners();
        setupViewToggle();
        setupMovieActions();
        animateCards();
    }
    
    // Event Listeners
    function setupEventListeners() {
        // Search functionality
        if (movieSearch) {
            movieSearch.addEventListener('input', debounce(handleSearch, 300));
        }
        
        // Filter functionality
        if (categoryFilter) {
            categoryFilter.addEventListener('change', handleCategoryFilter);
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', handleStatusFilter);
        }
        
        if (sortBy) {
            sortBy.addEventListener('change', handleSort);
        }
        
        // Add new movie button
        if (addMovieBtn) {
            addMovieBtn.addEventListener('click', handleAddMovie);
        }
        
        // Pagination buttons
        const pageButtons = document.querySelectorAll('.page-btn');
        pageButtons.forEach(btn => {
            btn.addEventListener('click', handlePagination);
        });
    }
    
    // View Toggle (Grid/List)
    function setupViewToggle() {
        viewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const view = this.dataset.view;
                
                // Update button states
                viewBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Update grid view
                if (moviesGrid) {
                    if (view === 'list') {
                        moviesGrid.classList.add('list-view');
                        moviesGrid.classList.remove('grid-view');
                    } else {
                        moviesGrid.classList.add('grid-view');
                        moviesGrid.classList.remove('list-view');
                    }
                }
                
                // Show toast
                window.adminPanel.showToast(`Görünüm ${view === 'grid' ? 'izgara' : 'liste'} moduna geçirildi`, 'info');
            });
        });
    }
    
    // Movie Actions (Edit, View, Duplicate, Delete)
    function setupMovieActions() {
        // Edit buttons
        const editBtns = document.querySelectorAll('.btn-edit');
        editBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const movieCard = this.closest('.movie-admin-card');
                const movieTitle = movieCard.querySelector('h3').textContent;
                handleEditMovie(movieTitle);
            });
        });
        
        // View buttons
        const viewBtns = document.querySelectorAll('.btn-view');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const movieCard = this.closest('.movie-admin-card');
                const movieTitle = movieCard.querySelector('h3').textContent;
                handleViewMovie(movieTitle);
            });
        });
        
        // Duplicate buttons
        const duplicateBtns = document.querySelectorAll('.btn-duplicate');
        duplicateBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const movieCard = this.closest('.movie-admin-card');
                const movieTitle = movieCard.querySelector('h3').textContent;
                handleDuplicateMovie(movieTitle);
            });
        });
        
        // Delete buttons
        const deleteBtns = document.querySelectorAll('.btn-delete');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const movieCard = this.closest('.movie-admin-card');
                const movieTitle = movieCard.querySelector('h3').textContent;
                handleDeleteMovie(movieTitle, movieCard);
            });
        });
    }
    
    // Search Handler
    function handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const movieCards = document.querySelectorAll('.movie-admin-card');
        
        movieCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const categories = Array.from(card.querySelectorAll('.category-tag'))
                .map(tag => tag.textContent.toLowerCase());
            
            const matches = title.includes(searchTerm) || 
                          categories.some(cat => cat.includes(searchTerm));
            
            if (matches) {
                card.style.display = 'block';
                card.classList.add('fade-in-up');
            } else {
                card.style.display = 'none';
                card.classList.remove('fade-in-up');
            }
        });
        
        updateResultsCount();
    }
    
    // Category Filter Handler
    function handleCategoryFilter(e) {
        const selectedCategory = e.target.value.toLowerCase();
        const movieCards = document.querySelectorAll('.movie-admin-card');
        
        movieCards.forEach(card => {
            if (!selectedCategory) {
                card.style.display = 'block';
                return;
            }
            
            const categories = Array.from(card.querySelectorAll('.category-tag'))
                .map(tag => tag.textContent.toLowerCase());
            
            if (categories.some(cat => cat.includes(selectedCategory))) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        updateResultsCount();
        window.adminPanel.showToast('Filtreler uygulandı', 'info');
    }
    
    // Status Filter Handler
    function handleStatusFilter(e) {
        const selectedStatus = e.target.value;
        const movieCards = document.querySelectorAll('.movie-admin-card');
        
        movieCards.forEach(card => {
            if (!selectedStatus) {
                card.style.display = 'block';
                return;
            }
            
            const statusElement = card.querySelector('.movie-status');
            const status = statusElement.classList.contains(`status-${selectedStatus}`);
            
            if (status) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        updateResultsCount();
        window.adminPanel.showToast('Durum filtresi uygulandı', 'info');
    }
    
    // Sort Handler
    function handleSort(e) {
        const sortValue = e.target.value;
        const moviesContainer = document.querySelector('.movies-grid');
        const movieCards = Array.from(document.querySelectorAll('.movie-admin-card'));
        
        movieCards.sort((a, b) => {
            switch (sortValue) {
                case 'title-asc':
                    return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
                case 'title-desc':
                    return b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent);
                case 'rating-desc':
                    const ratingA = parseFloat(a.querySelector('.movie-rating').textContent.match(/[\d.]+/)[0]);
                    const ratingB = parseFloat(b.querySelector('.movie-rating').textContent.match(/[\d.]+/)[0]);
                    return ratingB - ratingA;
                case 'rating-asc':
                    const ratingA2 = parseFloat(a.querySelector('.movie-rating').textContent.match(/[\d.]+/)[0]);
                    const ratingB2 = parseFloat(b.querySelector('.movie-rating').textContent.match(/[\d.]+/)[0]);
                    return ratingA2 - ratingB2;
                default:
                    return 0;
            }
        });
        
        // Re-append sorted cards
        movieCards.forEach(card => {
            moviesContainer.appendChild(card);
        });
        
        window.adminPanel.showToast('Filmler sıralandı', 'info');
    }
    
    // Movie Actions
    function handleAddMovie() {
        window.adminPanel.showToast('Yeni film ekleme sayfasına yönlendiriliyorsunuz...', 'info');
        // Here you would typically redirect to add movie form
        console.log('Add new movie');
    }
    
    function handleEditMovie(title) {
        window.adminPanel.showToast(`"${title}" filmi düzenleniyor...`, 'info');
        // Here you would typically redirect to edit form
        console.log('Edit movie:', title);
    }
    
    function handleViewMovie(title) {
        window.adminPanel.showToast(`"${title}" filmi görüntüleniyor...`, 'info');
        // Here you would typically open movie details
        console.log('View movie:', title);
    }
    
    function handleDuplicateMovie(title) {
        if (window.adminPanel.showConfirm(`"${title}" filmini kopyalamak istediğinize emin misiniz?`)) {
            window.adminPanel.showToast(`"${title}" filmi kopyalandı`, 'success');
            console.log('Duplicate movie:', title);
        }
    }
    
    function handleDeleteMovie(title, cardElement) {
        if (window.adminPanel.showConfirm(`"${title}" filmini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
            // Add loading state
            window.adminPanel.showLoading(cardElement);
            
            // Simulate API call
            setTimeout(() => {
                cardElement.style.opacity = '0';
                cardElement.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    cardElement.remove();
                    updateResultsCount();
                    window.adminPanel.showToast(`"${title}" filmi silindi`, 'success');
                }, 300);
            }, 1000);
        }
    }
    
    // Pagination Handler
    function handlePagination(e) {
        const pageBtn = e.target.closest('.page-btn');
        if (!pageBtn || pageBtn.disabled || pageBtn.classList.contains('active')) {
            return;
        }
        
        // Update active state
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        pageBtn.classList.add('active');
        
        // Simulate page loading
        window.adminPanel.showLoading(moviesGrid);
        
        setTimeout(() => {
            window.adminPanel.hideLoading(moviesGrid);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            window.adminPanel.showToast('Sayfa yüklendi', 'info');
        }, 500);
    }
    
    // Utility Functions
    function updateResultsCount() {
        const visibleCards = document.querySelectorAll('.movie-admin-card[style*="display: block"], .movie-admin-card:not([style*="display: none"])');
        const total = document.querySelectorAll('.movie-admin-card').length;
        const visible = visibleCards.length;
        
        const paginationInfo = document.querySelector('.pagination-info span');
        if (paginationInfo) {
            paginationInfo.textContent = `${total} filmden ${visible} tanesi gösteriliyor`;
        }
    }
    
    function animateCards() {
        const cards = document.querySelectorAll('.movie-admin-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in-up');
            }, index * 100);
        });
    }
    
    // Debounce function for search
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
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + N for new movie
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            handleAddMovie();
        }
        
        // Escape to clear search
        if (e.key === 'Escape' && movieSearch) {
            movieSearch.value = '';
            movieSearch.dispatchEvent(new Event('input'));
        }
    });
});

// Export for external use
window.moviesPage = {
    refreshMovies: function() {
        location.reload();
    },
    
    addMovie: function(movieData) {
        console.log('Add movie:', movieData);
        // Implementation for adding movie
    },
    
    updateMovie: function(id, movieData) {
        console.log('Update movie:', id, movieData);
        // Implementation for updating movie
    },
    
    deleteMovie: function(id) {
        console.log('Delete movie:', id);
        // Implementation for deleting movie
    }
}; 