// Series Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const searchInput = document.getElementById('searchSeries');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    const viewToggleBtns = document.querySelectorAll('.view-btn');
    const seriesGrid = document.getElementById('seriesGrid');
    const addSeriesBtn = document.getElementById('addSeriesBtn');
    const seriesCards = document.querySelectorAll('.movie-admin-card');
    
    // Initialize series management
    initSeriesManagement();
    
    function initSeriesManagement() {
        initSearch();
        initFilters();
        initViewToggle();
        initSeriesActions();
        initKeyboardShortcuts();
    }
    
    // Search functionality
    function initSearch() {
        let searchTimeout;
        
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    filterSeries();
                }, 300); // 300ms debounce
            });
        }
    }
    
    // Filter functionality
    function initFilters() {
        [categoryFilter, statusFilter, sortFilter].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', filterSeries);
            }
        });
    }
    
    // View toggle functionality
    function initViewToggle() {
        viewToggleBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                viewToggleBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const view = this.getAttribute('data-view');
                toggleView(view);
            });
        });
    }
    
    function toggleView(view) {
        if (view === 'list') {
            seriesGrid.classList.add('list-view');
        } else {
            seriesGrid.classList.remove('list-view');
        }
        
        // Save preference
        localStorage.setItem('seriesViewPreference', view);
    }
    
    // Series actions (CRUD operations)
    function initSeriesActions() {
        // Add new series
        if (addSeriesBtn) {
            addSeriesBtn.addEventListener('click', function() {
                showAddSeriesModal();
            });
        }
        
        // Action buttons on each series card
        seriesCards.forEach(card => {
            const editBtn = card.querySelector('.btn-edit');
            const viewBtn = card.querySelector('.btn-view');
            const duplicateBtn = card.querySelector('.btn-duplicate');
            const deleteBtn = card.querySelector('.btn-delete');
            
            if (editBtn) {
                editBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const seriesTitle = card.querySelector('h3').textContent;
                    editSeries(seriesTitle);
                });
            }
            
            if (viewBtn) {
                viewBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const seriesTitle = card.querySelector('h3').textContent;
                    viewSeries(seriesTitle);
                });
            }
            
            if (duplicateBtn) {
                duplicateBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const seriesTitle = card.querySelector('h3').textContent;
                    duplicateSeries(seriesTitle);
                });
            }
            
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const seriesTitle = card.querySelector('h3').textContent;
                    deleteSeries(seriesTitle);
                });
            }
        });
    }
    
    // Filter series based on search and filters
    function filterSeries() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedCategory = categoryFilter ? categoryFilter.value : '';
        const selectedStatus = statusFilter ? statusFilter.value : '';
        const sortBy = sortFilter ? sortFilter.value : 'name';
        
        let visibleCards = Array.from(seriesCards).filter(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const category = card.querySelector('.category-tag').textContent.toLowerCase();
            const statusElement = card.querySelector('.movie-status');
            const status = statusElement ? statusElement.textContent.toLowerCase() : '';
            
            // Search filter
            const matchesSearch = title.includes(searchTerm);
            
            // Category filter
            const matchesCategory = !selectedCategory || category === selectedCategory;
            
            // Status filter  
            const matchesStatus = !selectedStatus || status.includes(selectedStatus);
            
            return matchesSearch && matchesCategory && matchesStatus;
        });
        
        // Hide all cards first
        seriesCards.forEach(card => {
            card.style.display = 'none';
        });
        
        // Sort visible cards
        visibleCards = sortSeries(visibleCards, sortBy);
        
        // Show filtered and sorted cards
        visibleCards.forEach(card => {
            card.style.display = 'block';
        });
        
        // Update results count
        updateResultsCount(visibleCards.length);
        
        // Show loading animation
        showLoadingEffect();
    }
    
    function sortSeries(cards, sortBy) {
        return cards.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.querySelector('h3').textContent.localeCompare(
                        b.querySelector('h3').textContent
                    );
                case 'name-desc':
                    return b.querySelector('h3').textContent.localeCompare(
                        a.querySelector('h3').textContent
                    );
                case 'rating':
                    const ratingA = parseFloat(a.querySelector('.movie-rating').textContent.split(' ')[1]);
                    const ratingB = parseFloat(b.querySelector('.movie-rating').textContent.split(' ')[1]);
                    return ratingB - ratingA;
                case 'rating-asc':
                    const ratingA2 = parseFloat(a.querySelector('.movie-rating').textContent.split(' ')[1]);
                    const ratingB2 = parseFloat(b.querySelector('.movie-rating').textContent.split(' ')[1]);
                    return ratingA2 - ratingB2;
                case 'date':
                case 'date-asc':
                    return 0; // Tarih sıralaması için daha sonra eklenebilir
                case 'seasons':
                    const seasonsA = parseInt(a.querySelector('.movie-year').textContent);
                    const seasonsB = parseInt(b.querySelector('.movie-year').textContent);
                    return seasonsB - seasonsA;
                case 'episodes':
                    const episodesA = parseInt(a.querySelector('.movie-views').textContent.split(' ')[1]);
                    const episodesB = parseInt(b.querySelector('.movie-views').textContent.split(' ')[1]);
                    return episodesB - episodesA;
                default:
                    return 0;
            }
        });
    }
    
    function updateResultsCount(count) {
        const paginationInfo = document.querySelector('.pagination-info span');
        if (paginationInfo) {
            const total = seriesCards.length;
            paginationInfo.innerHTML = `Gösterilen: <strong>1-${count}</strong> / Toplam: <strong>${total}</strong> dizi`;
        }
    }
    
    function showLoadingEffect() {
        seriesGrid.style.opacity = '0.7';
        setTimeout(() => {
            seriesGrid.style.opacity = '1';
        }, 200);
    }
    
    // CRUD Operations
    function showAddSeriesModal() {
        if (window.adminPanel) {
            window.adminPanel.showToast('Yeni dizi ekleme modalı açılıyor...', 'info');
        }
        // TODO: Implement add series modal
        console.log('Add Series Modal');
    }
    
    function editSeries(seriesTitle) {
        if (window.adminPanel) {
            window.adminPanel.showToast(`Dizi ${seriesTitle} düzenleniyor...`, 'info');
        }
        // TODO: Implement edit series functionality
        console.log('Edit Series:', seriesTitle);
    }
    
    function viewSeries(seriesTitle) {
        if (window.adminPanel) {
            window.adminPanel.showToast(`Dizi ${seriesTitle} görüntüleniyor...`, 'info');
        }
        // TODO: Navigate to series detail view
        console.log('View Series:', seriesTitle);
    }
    
    function duplicateSeries(seriesTitle) {
        if (window.adminPanel && window.adminPanel.showConfirm) {
            window.adminPanel.showConfirm(
                'Bu diziyi kopyalamak istediğinizden emin misiniz?',
                () => {
                    if (window.adminPanel) {
                        window.adminPanel.showToast(`Dizi ${seriesTitle} kopyalandı`, 'success');
                    }
                    // TODO: Implement duplicate series functionality
                    console.log('Duplicate Series:', seriesTitle);
                }
            );
        }
    }
    
    function deleteSeries(seriesTitle) {
        if (window.adminPanel && window.adminPanel.showConfirm) {
            window.adminPanel.showConfirm(
                'Bu diziyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
                () => {
                    const card = document.querySelector(`[data-title="${seriesTitle}"]`).closest('.movie-admin-card');
                    if (card) {
                        card.style.opacity = '0.5';
                        card.style.transform = 'scale(0.9)';
                        
                        setTimeout(() => {
                            card.remove();
                            updateResultsCount(document.querySelectorAll('.movie-admin-card').length);
                            if (window.adminPanel) {
                                window.adminPanel.showToast('Dizi başarıyla silindi', 'success');
                            }
                        }, 300);
                    }
                    // TODO: Implement actual delete functionality with backend
                    console.log('Delete Series:', seriesTitle);
                }
            );
        }
    }
    
    // Keyboard shortcuts
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Ctrl + N: Add new series
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                showAddSeriesModal();
            }
            
            // Escape: Clear search
            if (e.key === 'Escape') {
                if (searchInput) {
                    searchInput.value = '';
                    filterSeries();
                    searchInput.focus();
                }
            }
            
            // Ctrl + F: Focus search
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
        });
    }
    
    // Pagination functionality
    function initPagination() {
        const pageNumbers = document.querySelectorAll('.page-number');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        pageNumbers.forEach(btn => {
            btn.addEventListener('click', function() {
                if (!this.classList.contains('active')) {
                    pageNumbers.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    const page = parseInt(this.textContent);
                    loadPage(page);
                }
            });
        });
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                const currentPage = document.querySelector('.page-number.active');
                const pageNum = parseInt(currentPage.textContent);
                if (pageNum > 1) {
                    loadPage(pageNum - 1);
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                const currentPage = document.querySelector('.page-number.active');
                const pageNum = parseInt(currentPage.textContent);
                const maxPage = 8; // This should come from backend
                if (pageNum < maxPage) {
                    loadPage(pageNum + 1);
                }
            });
        }
    }
    
    function loadPage(page) {
        // Show loading
        if (window.adminPanel) {
            window.adminPanel.showLoading(seriesGrid);
        }
        
        // Simulate API call
        setTimeout(() => {
            // Hide loading
            if (window.adminPanel) {
                window.adminPanel.hideLoading(seriesGrid);
            }
            
            // Update pagination buttons
            document.querySelectorAll('.page-number').forEach(btn => {
                btn.classList.remove('active');
                if (parseInt(btn.textContent) === page) {
                    btn.classList.add('active');
                }
            });
            
            // Update prev/next button states
            const prevBtn = document.querySelector('.prev-btn');
            const nextBtn = document.querySelector('.next-btn');
            
            if (prevBtn) {
                prevBtn.disabled = page === 1;
            }
            
            if (nextBtn) {
                nextBtn.disabled = page === 8; // Max page
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            if (window.adminPanel) {
                window.adminPanel.showToast(`Sayfa ${page} yüklendi`, 'success');
            }
            
        }, 800);
    }
    
    // Initialize pagination
    initPagination();
    
    // Load saved view preference
    const savedView = localStorage.getItem('seriesViewPreference') || 'grid';
    const viewBtn = document.querySelector(`[data-view="${savedView}"]`);
    if (viewBtn) {
        viewBtn.click();
    }
    
    // Auto-save search and filter preferences
    function savePreferences() {
        const preferences = {
            search: searchInput ? searchInput.value : '',
            category: categoryFilter ? categoryFilter.value : '',
            status: statusFilter ? statusFilter.value : '',
            sort: sortFilter ? sortFilter.value : 'name'
        };
        localStorage.setItem('seriesFilterPreferences', JSON.stringify(preferences));
    }
    
    // Load saved preferences
    function loadPreferences() {
        const saved = localStorage.getItem('seriesFilterPreferences');
        if (saved) {
            const preferences = JSON.parse(saved);
            
            if (searchInput && preferences.search) {
                searchInput.value = preferences.search;
            }
            if (categoryFilter && preferences.category) {
                categoryFilter.value = preferences.category;
            }
            if (statusFilter && preferences.status) {
                statusFilter.value = preferences.status;
            }
            if (sortFilter && preferences.sort) {
                sortFilter.value = preferences.sort;
            }
            
            // Apply filters
            filterSeries();
        }
    }
    
    // Save preferences on change
    [searchInput, categoryFilter, statusFilter, sortFilter].forEach(element => {
        if (element) {
            element.addEventListener('change', savePreferences);
            element.addEventListener('input', savePreferences);
        }
    });
    
    // Load preferences on page load
    loadPreferences();
    
    // Series card hover effects
    seriesCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '';
        });
    });
    
    // Initialize tooltips
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[title]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                const title = this.getAttribute('title');
                if (title) {
                    // Create tooltip (simple implementation)
                    const tooltip = document.createElement('div');
                    tooltip.className = 'tooltip';
                    tooltip.textContent = title;
                    tooltip.style.cssText = `
                        position: absolute;
                        background: #0f172a;
                        color: #f8fafc;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 12px;
                        pointer-events: none;
                        z-index: 1000;
                        border: 1px solid #334155;
                    `;
                    document.body.appendChild(tooltip);
                    
                    // Position tooltip
                    const rect = this.getBoundingClientRect();
                    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                    tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
                    
                    this._tooltip = tooltip;
                }
            });
            
            element.addEventListener('mouseleave', function() {
                if (this._tooltip) {
                    document.body.removeChild(this._tooltip);
                    this._tooltip = null;
                }
            });
        });
    }
    
    // Initialize tooltips
    initTooltips();
    
    console.log('Series Management initialized successfully');
});

// Export functions for external use
window.seriesManagement = {
    filterSeries: function() {
        // Trigger filter from external code
        const event = new Event('input');
        const searchInput = document.getElementById('searchSeries');
        if (searchInput) {
            searchInput.dispatchEvent(event);
        }
    },
    
    addSeries: function() {
        const addBtn = document.getElementById('addSeriesBtn');
        if (addBtn) {
            addBtn.click();
        }
    }
}; 