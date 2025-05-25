// Comments Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Elements
    const commentSearch = document.getElementById('commentSearch');
    const statusFilter = document.getElementById('statusFilter');
    const contentTypeFilter = document.getElementById('contentTypeFilter');
    const dateFilter = document.getElementById('dateFilter');
    const sortBy = document.getElementById('sortBy');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const commentsGrid = document.getElementById('commentsGrid');
    const commentCards = document.querySelectorAll('.comment-card');
    const bulkActionsBtn = document.getElementById('bulkActionsBtn');
    
    // Search Functionality
    if (commentSearch) {
        commentSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterAndDisplayComments();
        });
    }
    
    // Filter Functionality
    if (statusFilter) {
        statusFilter.addEventListener('change', filterAndDisplayComments);
    }
    
    if (contentTypeFilter) {
        contentTypeFilter.addEventListener('change', filterAndDisplayComments);
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', filterAndDisplayComments);
    }
    
    // Sort Functionality
    if (sortBy) {
        sortBy.addEventListener('change', function() {
            sortComments();
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
            commentsGrid.classList.remove('list-view');
            commentsGrid.classList.add('grid-view');
        } else {
            listViewBtn.classList.add('active');
            commentsGrid.classList.remove('grid-view');
            commentsGrid.classList.add('list-view');
        }
    }
    
    // Filter and Display Comments
    function filterAndDisplayComments() {
        const searchTerm = commentSearch ? commentSearch.value.toLowerCase() : '';
        const statusValue = statusFilter ? statusFilter.value : '';
        const contentTypeValue = contentTypeFilter ? contentTypeFilter.value : '';
        const dateValue = dateFilter ? dateFilter.value : '';
        
        commentCards.forEach(card => {
            const commentText = card.querySelector('.comment-text').textContent.toLowerCase();
            const userName = card.querySelector('.user-name').textContent.toLowerCase();
            const contentTitle = card.querySelector('.content-info h4').textContent.toLowerCase();
            const commentStatus = card.getAttribute('data-status');
            const contentType = card.getAttribute('data-content-type');
            const commentDate = card.getAttribute('data-date');
            
            let showCard = true;
            
            // Search filter
            if (searchTerm && 
                !commentText.includes(searchTerm) && 
                !userName.includes(searchTerm) && 
                !contentTitle.includes(searchTerm)) {
                showCard = false;
            }
            
            // Status filter
            if (statusValue && commentStatus !== statusValue) {
                showCard = false;
            }
            
            // Content type filter
            if (contentTypeValue && contentType !== contentTypeValue) {
                showCard = false;
            }
            
            // Date filter
            if (dateValue && !matchesDateFilter(commentDate, dateValue)) {
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
    
    // Date Filter Matching
    function matchesDateFilter(commentDate, filterValue) {
        const commentDateTime = new Date(commentDate);
        const now = new Date();
        
        switch (filterValue) {
            case 'today':
                return commentDateTime.toDateString() === now.toDateString();
            case 'week':
                const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
                return commentDateTime >= weekAgo;
            case 'month':
                const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
                return commentDateTime >= monthAgo;
            case 'year':
                const yearAgo = new Date(now - 365 * 24 * 60 * 60 * 1000);
                return commentDateTime >= yearAgo;
            default:
                return true;
        }
    }
    
    // Sort Comments
    function sortComments() {
        const sortValue = sortBy.value;
        const cardsArray = Array.from(commentCards);
        
        cardsArray.sort((a, b) => {
            const aDate = new Date(a.getAttribute('data-date'));
            const bDate = new Date(b.getAttribute('data-date'));
            const aStatus = a.getAttribute('data-status');
            const bStatus = b.getAttribute('data-status');
            
            // Get rating values
            const aRatingText = a.querySelector('.rating-text').textContent;
            const bRatingText = b.querySelector('.rating-text').textContent;
            const aRating = parseFloat(aRatingText.split('/')[0]);
            const bRating = parseFloat(bRatingText.split('/')[0]);
            
            switch (sortValue) {
                case 'date_desc':
                    return bDate - aDate;
                case 'date_asc':
                    return aDate - bDate;
                case 'rating_desc':
                    return bRating - aRating;
                case 'rating_asc':
                    return aRating - bRating;
                case 'status_pending':
                    // Pending first, then others
                    if (aStatus === 'pending' && bStatus !== 'pending') return -1;
                    if (aStatus !== 'pending' && bStatus === 'pending') return 1;
                    return bDate - aDate; // Secondary sort by date
                default:
                    return bDate - aDate;
            }
        });
        
        // Clear and re-append sorted cards
        commentsGrid.innerHTML = '';
        cardsArray.forEach(card => {
            commentsGrid.appendChild(card);
        });
    }
    
    // Update Results Count
    function updateResultsCount() {
        const visibleCards = document.querySelectorAll('.comment-card[style*="block"], .comment-card:not([style*="none"])').length;
        const totalCards = commentCards.length;
        
        const paginationInfo = document.querySelector('.pagination-info span');
        if (paginationInfo) {
            paginationInfo.textContent = `${visibleCards} / ${totalCards} yorum gösteriliyor`;
        }
    }
    
    // Comment Action Handlers
    function setupCommentActions() {
        commentCards.forEach(card => {
            // Approve button
            const approveBtn = card.querySelector('.btn-approve');
            if (approveBtn) {
                approveBtn.addEventListener('click', function() {
                    const userName = card.querySelector('.user-name').textContent;
                    const contentTitle = card.querySelector('.content-info h4').textContent;
                    approveComment(card, userName, contentTitle);
                });
            }
            
            // Edit button
            const editBtn = card.querySelector('.btn-edit');
            if (editBtn) {
                editBtn.addEventListener('click', function() {
                    const userName = card.querySelector('.user-name').textContent;
                    editComment(card, userName);
                });
            }
            
            // Reply button
            const replyBtn = card.querySelector('.btn-reply');
            if (replyBtn) {
                replyBtn.addEventListener('click', function() {
                    const userName = card.querySelector('.user-name').textContent;
                    const contentTitle = card.querySelector('.content-info h4').textContent;
                    replyToComment(card, userName, contentTitle);
                });
            }
            
            // View button
            const viewBtn = card.querySelector('.btn-view');
            if (viewBtn) {
                viewBtn.addEventListener('click', function() {
                    const userName = card.querySelector('.user-name').textContent;
                    const contentTitle = card.querySelector('.content-info h4').textContent;
                    viewComment(card, userName, contentTitle);
                });
            }
            
            // Delete button
            const deleteBtn = card.querySelector('.btn-delete');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    const userName = card.querySelector('.user-name').textContent;
                    const contentTitle = card.querySelector('.content-info h4').textContent;
                    deleteComment(card, userName, contentTitle);
                });
            }
            
            // Ban button (for spam comments)
            const banBtn = card.querySelector('.btn-ban');
            if (banBtn) {
                banBtn.addEventListener('click', function() {
                    const userName = card.querySelector('.user-name').textContent;
                    const userEmail = card.querySelector('.user-email').textContent;
                    banUser(card, userName, userEmail);
                });
            }
        });
    }
    
    // Comment Action Functions
    function approveComment(card, userName, contentTitle) {
        if (confirm(`${userName} kullanıcısının "${contentTitle}" için yazdığı yorumu onaylamak istediğinizden emin misiniz?`)) {
            const statusElement = card.querySelector('.comment-status');
            statusElement.textContent = 'Onaylı';
            statusElement.className = 'comment-status status-approved';
            card.setAttribute('data-status', 'approved');
            
            // Update action buttons
            const approveBtn = card.querySelector('.btn-approve');
            if (approveBtn) {
                approveBtn.style.display = 'none';
            }
            
            adminPanel.showToast(`${userName} kullanıcısının yorumu onaylandı!`, 'success');
            console.log('Approve comment:', userName, contentTitle);
            // TODO: Implement approve functionality
        }
    }
    
    function editComment(card, userName) {
        adminPanel.showToast(`${userName} kullanıcısının yorumu düzenleniyor...`, 'info');
        console.log('Edit comment:', userName);
        // TODO: Implement edit functionality
    }
    
    function replyToComment(card, userName, contentTitle) {
        adminPanel.showToast(`${userName} kullanıcısının yorumuna yanıt yazılıyor...`, 'info');
        console.log('Reply to comment:', userName, contentTitle);
        // TODO: Implement reply functionality
    }
    
    function viewComment(card, userName, contentTitle) {
        adminPanel.showToast(`${userName} kullanıcısının yorumu detayları görüntüleniyor...`, 'info');
        console.log('View comment details:', userName, contentTitle);
        // TODO: Implement view details functionality
    }
    
    function deleteComment(card, userName, contentTitle) {
        if (confirm(`${userName} kullanıcısının "${contentTitle}" için yazdığı yorumu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
            adminPanel.showToast(`${userName} kullanıcısının yorumu silindi!`, 'success');
            card.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                card.remove();
                updateResultsCount();
            }, 300);
            console.log('Delete comment:', userName, contentTitle);
            // TODO: Implement delete functionality
        }
    }
    
    function banUser(card, userName, userEmail) {
        if (confirm(`${userName} (${userEmail}) kullanıcısını yasaklamak istediğinizden emin misiniz? Bu kullanıcı artık yorum yapamayacak.`)) {
            adminPanel.showToast(`${userName} kullanıcısı yasaklandı!`, 'warning');
            
            // Update card appearance
            card.style.opacity = '0.6';
            card.style.pointerEvents = 'none';
            
            // Add banned indicator
            const userInfo = card.querySelector('.user-info');
            const bannedBadge = document.createElement('span');
            bannedBadge.className = 'user-role-badge banned';
            bannedBadge.style.background = 'rgba(239, 68, 68, 0.2)';
            bannedBadge.style.color = '#ef4444';
            bannedBadge.style.fontSize = '10px';
            bannedBadge.style.padding = '2px 6px';
            bannedBadge.style.borderRadius = '4px';
            bannedBadge.style.marginLeft = '8px';
            bannedBadge.textContent = 'YASAKLI';
            userInfo.appendChild(bannedBadge);
            
            console.log('Ban user:', userName, userEmail);
            // TODO: Implement ban user functionality
        }
    }
    
    // Bulk Actions
    if (bulkActionsBtn) {
        bulkActionsBtn.addEventListener('click', function() {
            adminPanel.showToast('Toplu işlemler menüsü açılıyor...', 'info');
            console.log('Bulk actions');
            // TODO: Implement bulk actions modal/menu
        });
    }
    
    // Keyboard Shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl + F - Focus search
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            if (commentSearch) {
                commentSearch.focus();
            }
        }
        
        // Ctrl + A - Approve all pending comments
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            if (confirm('Tüm bekleyen yorumları onaylamak istediğinizden emin misiniz?')) {
                const pendingComments = document.querySelectorAll('.comment-card[data-status="pending"]');
                pendingComments.forEach(card => {
                    const statusElement = card.querySelector('.comment-status');
                    statusElement.textContent = 'Onaylı';
                    statusElement.className = 'comment-status status-approved';
                    card.setAttribute('data-status', 'approved');
                    
                    const approveBtn = card.querySelector('.btn-approve');
                    if (approveBtn) {
                        approveBtn.style.display = 'none';
                    }
                });
                adminPanel.showToast(`${pendingComments.length} bekleyen yorum onaylandı!`, 'success');
            }
        }
        
        // Escape - Clear search and filters
        if (e.key === 'Escape') {
            if (commentSearch && commentSearch === document.activeElement) {
                commentSearch.value = '';
                filterAndDisplayComments();
                commentSearch.blur();
            } else {
                // Clear all filters
                if (commentSearch) commentSearch.value = '';
                if (statusFilter) statusFilter.value = '';
                if (contentTypeFilter) contentTypeFilter.value = '';
                if (dateFilter) dateFilter.value = '';
                filterAndDisplayComments();
                adminPanel.showToast('Tüm filtreler temizlendi', 'info');
            }
        }
    });
    
    // Quick Action Shortcuts
    document.addEventListener('keydown', function(e) {
        // Only work when not in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            return;
        }
        
        // P - Show only pending comments
        if (e.key === 'p' || e.key === 'P') {
            statusFilter.value = 'pending';
            filterAndDisplayComments();
            adminPanel.showToast('Bekleyen yorumlar gösteriliyor', 'info');
        }
        
        // A - Show only approved comments
        if (e.key === 'a' || e.key === 'A') {
            statusFilter.value = 'approved';
            filterAndDisplayComments();
            adminPanel.showToast('Onaylı yorumlar gösteriliyor', 'info');
        }
        
        // R - Show only rejected comments
        if (e.key === 'r' || e.key === 'R') {
            statusFilter.value = 'rejected';
            filterAndDisplayComments();
            adminPanel.showToast('Reddedilen yorumlar gösteriliyor', 'info');
        }
        
        // S - Show only spam comments
        if (e.key === 's' || e.key === 'S') {
            statusFilter.value = 'spam';
            filterAndDisplayComments();
            adminPanel.showToast('Spam yorumlar gösteriliyor', 'info');
        }
    });
    
    // Initialize
    setupCommentActions();
    updateResultsCount();
    
    // Auto-save search state
    if (commentSearch) {
        const savedSearch = localStorage.getItem('commentSearch');
        if (savedSearch) {
            commentSearch.value = savedSearch;
            filterAndDisplayComments();
        }
        
        commentSearch.addEventListener('input', function() {
            localStorage.setItem('commentSearch', this.value);
        });
    }
    
    // Auto-save filter states
    if (statusFilter) {
        const savedStatusFilter = localStorage.getItem('commentStatusFilter');
        if (savedStatusFilter) {
            statusFilter.value = savedStatusFilter;
            filterAndDisplayComments();
        }
        
        statusFilter.addEventListener('change', function() {
            localStorage.setItem('commentStatusFilter', this.value);
        });
    }
    
    if (contentTypeFilter) {
        const savedContentTypeFilter = localStorage.getItem('commentContentTypeFilter');
        if (savedContentTypeFilter) {
            contentTypeFilter.value = savedContentTypeFilter;
            filterAndDisplayComments();
        }
        
        contentTypeFilter.addEventListener('change', function() {
            localStorage.setItem('commentContentTypeFilter', this.value);
        });
    }
    
    if (dateFilter) {
        const savedDateFilter = localStorage.getItem('commentDateFilter');
        if (savedDateFilter) {
            dateFilter.value = savedDateFilter;
            filterAndDisplayComments();
        }
        
        dateFilter.addEventListener('change', function() {
            localStorage.setItem('commentDateFilter', this.value);
        });
    }
    
    console.log('Comments management initialized');
}); 