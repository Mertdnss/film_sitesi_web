// Categories Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Elements
    const categorySearch = document.getElementById('categorySearch');
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortBy = document.getElementById('sortBy');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const categoriesGrid = document.getElementById('categoriesGrid');
    const categoryCards = document.querySelectorAll('.category-card');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    
    // Search Functionality
    if (categorySearch) {
        categorySearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterAndDisplayCategories();
        });
    }
    
    // Filter Functionality
    if (typeFilter) {
        typeFilter.addEventListener('change', filterAndDisplayCategories);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterAndDisplayCategories);
    }
    
    // Sort Functionality
    if (sortBy) {
        sortBy.addEventListener('change', function() {
            sortCategories();
        });
    }
    
    // View Toggle Functionality
    if (gridViewBtn && listViewBtn) {
        gridViewBtn.addEventListener('click', function() {
            setActiveView('grid');
        });
        
        listViewBtn.addEventListener('click', function() {
            setActiveView('list');
        });
    }
    
    function setActiveView(view) {
        // Remove active class from all view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (view === 'grid') {
            gridViewBtn.classList.add('active');
            categoriesGrid.classList.remove('list-view');
            categoriesGrid.classList.add('grid-view');
        } else {
            listViewBtn.classList.add('active');
            categoriesGrid.classList.remove('grid-view');
            categoriesGrid.classList.add('list-view');
        }
    }
    
    // Filter and Display Categories
    function filterAndDisplayCategories() {
        const searchTerm = categorySearch ? categorySearch.value.toLowerCase() : '';
        const typeValue = typeFilter ? typeFilter.value : '';
        const statusValue = statusFilter ? statusFilter.value : '';
        
        categoryCards.forEach(card => {
            const categoryName = card.querySelector('h3').textContent.toLowerCase();
            const categoryType = card.getAttribute('data-type');
            const categoryStatus = card.getAttribute('data-status');
            
            let showCard = true;
            
            // Search filter
            if (searchTerm && !categoryName.includes(searchTerm)) {
                showCard = false;
            }
            
            // Type filter
            if (typeValue) {
                if (typeValue === 'film' && !['film', 'both'].includes(categoryType)) {
                    showCard = false;
                }
                if (typeValue === 'series' && !['series', 'both'].includes(categoryType)) {
                    showCard = false;
                }
                if (typeValue === 'both' && categoryType !== 'both') {
                    showCard = false;
                }
            }
            
            // Status filter
            if (statusValue && categoryStatus !== statusValue) {
                showCard = false;
            }
            
            // Show/hide card
            if (showCard) {
                card.style.display = 'block';
                card.classList.add('fade-in-up');
            } else {
                card.style.display = 'none';
                card.classList.remove('fade-in-up');
            }
        });
        
        updateResultsCount();
    }
    
    // Sort Categories
    function sortCategories() {
        const sortValue = sortBy.value;
        const cardsArray = Array.from(categoryCards);
        
        cardsArray.sort((a, b) => {
            const aName = a.querySelector('h3').textContent;
            const bName = b.querySelector('h3').textContent;
            
            // Get content counts
            const aFilmCount = parseInt(a.querySelector('.category-meta span:first-child').textContent.match(/\d+/)[0]);
            const bFilmCount = parseInt(b.querySelector('.category-meta span:first-child').textContent.match(/\d+/)[0]);
            const aSeriesCount = parseInt(a.querySelector('.category-meta span:nth-child(2)').textContent.match(/\d+/)[0]);
            const bSeriesCount = parseInt(b.querySelector('.category-meta span:nth-child(2)').textContent.match(/\d+/)[0]);
            const aTotalContent = aFilmCount + aSeriesCount;
            const bTotalContent = bFilmCount + bSeriesCount;
            
            switch (sortValue) {
                case 'name_asc':
                    return aName.localeCompare(bName);
                case 'name_desc':
                    return bName.localeCompare(aName);
                case 'content_count_desc':
                    return bTotalContent - aTotalContent;
                case 'content_count_asc':
                    return aTotalContent - bTotalContent;
                case 'created_desc':
                    // Simulate creation date by card order
                    return 0;
                case 'created_asc':
                    // Simulate creation date by card order
                    return 0;
                default:
                    return 0;
            }
        });
        
        // Clear and re-append sorted cards
        categoriesGrid.innerHTML = '';
        cardsArray.forEach(card => {
            categoriesGrid.appendChild(card);
        });
    }
    
    // Update Results Count
    function updateResultsCount() {
        const visibleCards = document.querySelectorAll('.category-card[style*="block"], .category-card:not([style*="none"])').length;
        const totalCards = categoryCards.length;
        
        const paginationInfo = document.querySelector('.pagination-info span');
        if (paginationInfo) {
            paginationInfo.textContent = `${visibleCards} / ${totalCards} kategori gösteriliyor`;
        }
    }
    
    // Category Action Handlers
    function setupCategoryActions() {
        categoryCards.forEach(card => {
            // Edit button
            const editBtn = card.querySelector('.btn-edit');
            if (editBtn) {
                editBtn.addEventListener('click', function() {
                    const categoryName = card.querySelector('h3').textContent;
                    editCategory(card, categoryName);
                });
            }
            
            // View button
            const viewBtn = card.querySelector('.btn-view');
            if (viewBtn) {
                viewBtn.addEventListener('click', function() {
                    const categoryName = card.querySelector('h3').textContent;
                    viewCategory(card, categoryName);
                });
            }
            
            // Duplicate button
            const duplicateBtn = card.querySelector('.btn-duplicate');
            if (duplicateBtn) {
                duplicateBtn.addEventListener('click', function() {
                    const categoryName = card.querySelector('h3').textContent;
                    duplicateCategory(card, categoryName);
                });
            }
            
            // Delete button
            const deleteBtn = card.querySelector('.btn-delete');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    const categoryName = card.querySelector('h3').textContent;
                    deleteCategory(card, categoryName);
                });
            }
            
            // Activate button (for inactive categories)
            const activateBtn = card.querySelector('.btn-activate');
            if (activateBtn) {
                activateBtn.addEventListener('click', function() {
                    const categoryName = card.querySelector('h3').textContent;
                    activateCategory(card, categoryName);
                });
            }
        });
    }
    
    // CRUD Operations
    function editCategory(card, categoryName) {
        adminPanel.showToast(`${categoryName} kategorisi düzenleniyor...`, 'info');
        console.log('Edit category:', categoryName);
        // TODO: Implement edit functionality
    }
    
    function viewCategory(card, categoryName) {
        adminPanel.showToast(`${categoryName} kategorisi görüntüleniyor...`, 'info');
        console.log('View category:', categoryName);
        // TODO: Implement view functionality
    }
    
    function duplicateCategory(card, categoryName) {
        if (confirm(`${categoryName} kategorisini kopyalamak istediğinizden emin misiniz?`)) {
            adminPanel.showToast(`${categoryName} kategorisi kopyalandı!`, 'success');
            console.log('Duplicate category:', categoryName);
            // TODO: Implement duplicate functionality
        }
    }
    
    function deleteCategory(card, categoryName) {
        if (confirm(`${categoryName} kategorisini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
            adminPanel.showToast(`${categoryName} kategorisi silindi!`, 'success');
            card.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                card.remove();
                updateResultsCount();
            }, 300);
            console.log('Delete category:', categoryName);
            // TODO: Implement delete functionality
        }
    }
    
    function activateCategory(card, categoryName) {
        if (confirm(`${categoryName} kategorisini aktifleştirmek istediğinizden emin misiniz?`)) {
            const statusElement = card.querySelector('.category-status');
            statusElement.textContent = 'Aktif';
            statusElement.className = 'category-status status-active';
            card.setAttribute('data-status', 'active');
            
            // Change activate button to delete button
            const activateBtn = card.querySelector('.btn-activate');
            if (activateBtn) {
                activateBtn.className = 'action-btn btn-delete';
                activateBtn.title = 'Sil';
                activateBtn.innerHTML = '<i class="fas fa-trash"></i>';
            }
            
            adminPanel.showToast(`${categoryName} kategorisi aktifleştirildi!`, 'success');
            console.log('Activate category:', categoryName);
            // TODO: Implement activate functionality
        }
    }
    
    // Add New Category
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', function() {
            adminPanel.showToast('Yeni kategori ekleme formu açılıyor...', 'info');
            console.log('Add new category');
            // TODO: Implement add category modal/form
        });
    }
    
    // Keyboard Shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl + F - Focus search
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            if (categorySearch) {
                categorySearch.focus();
            }
        }
        
        // Ctrl + N - Add new category
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            if (addCategoryBtn) {
                addCategoryBtn.click();
            }
        }
        
        // Escape - Clear search
        if (e.key === 'Escape') {
            if (categorySearch && categorySearch === document.activeElement) {
                categorySearch.value = '';
                filterAndDisplayCategories();
                categorySearch.blur();
            }
        }
    });
    
    // Initialize
    setupCategoryActions();
    updateResultsCount();
    
    // Auto-save search state
    if (categorySearch) {
        const savedSearch = localStorage.getItem('categorySearch');
        if (savedSearch) {
            categorySearch.value = savedSearch;
            filterAndDisplayCategories();
        }
        
        categorySearch.addEventListener('input', function() {
            localStorage.setItem('categorySearch', this.value);
        });
    }
    
    // Auto-save filter states
    if (typeFilter) {
        const savedTypeFilter = localStorage.getItem('categoryTypeFilter');
        if (savedTypeFilter) {
            typeFilter.value = savedTypeFilter;
            filterAndDisplayCategories();
        }
        
        typeFilter.addEventListener('change', function() {
            localStorage.setItem('categoryTypeFilter', this.value);
        });
    }
    
    if (statusFilter) {
        const savedStatusFilter = localStorage.getItem('categoryStatusFilter');
        if (savedStatusFilter) {
            statusFilter.value = savedStatusFilter;
            filterAndDisplayCategories();
        }
        
        statusFilter.addEventListener('change', function() {
            localStorage.setItem('categoryStatusFilter', this.value);
        });
    }
    
    console.log('Categories management initialized');
}); 