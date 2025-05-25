// Users Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const searchInput = document.getElementById('searchUsers');
    const roleFilter = document.getElementById('roleFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    const viewToggleBtns = document.querySelectorAll('.view-btn');
    const usersGrid = document.getElementById('usersGrid');
    const addUserBtn = document.getElementById('addUserBtn');
    const userCards = document.querySelectorAll('.movie-admin-card');
    
    // Initialize users management
    initUsersManagement();
    
    function initUsersManagement() {
        initSearch();
        initFilters();
        initViewToggle();
        initUserActions();
        initKeyboardShortcuts();
    }
    
    // Search functionality
    function initSearch() {
        let searchTimeout;
        
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    filterUsers();
                }, 300); // 300ms debounce
            });
        }
    }
    
    // Filter functionality
    function initFilters() {
        [roleFilter, statusFilter, sortFilter].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', filterUsers);
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
            usersGrid.classList.add('list-view');
        } else {
            usersGrid.classList.remove('list-view');
        }
        
        // Save preference
        localStorage.setItem('usersViewPreference', view);
    }
    
    // User actions (CRUD operations)
    function initUserActions() {
        // Add new user
        if (addUserBtn) {
            addUserBtn.addEventListener('click', function() {
                showAddUserModal();
            });
        }
        
        // Action buttons on each user card
        userCards.forEach(card => {
            const editBtn = card.querySelector('.btn-edit');
            const viewBtn = card.querySelector('.btn-view');
            const banBtn = card.querySelector('.btn-ban');
            const unbanBtn = card.querySelector('.btn-unban');
            const activateBtn = card.querySelector('.btn-activate');
            const approveBtn = card.querySelector('.btn-approve');
            const resendBtn = card.querySelector('.btn-resend');
            const deleteBtn = card.querySelector('.btn-delete');
            
            if (editBtn) {
                editBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const userName = card.querySelector('h3').textContent;
                    editUser(userName);
                });
            }
            
            if (viewBtn) {
                viewBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const userName = card.querySelector('h3').textContent;
                    viewUser(userName);
                });
            }
            
            if (banBtn) {
                banBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const userName = card.querySelector('h3').textContent;
                    banUser(userName);
                });
            }
            
            if (unbanBtn) {
                unbanBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const userName = card.querySelector('h3').textContent;
                    unbanUser(userName);
                });
            }
            
            if (activateBtn) {
                activateBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const userName = card.querySelector('h3').textContent;
                    activateUser(userName);
                });
            }
            
            if (approveBtn) {
                approveBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const userName = card.querySelector('h3').textContent;
                    approveUser(userName);
                });
            }
            
            if (resendBtn) {
                resendBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const userName = card.querySelector('h3').textContent;
                    resendEmail(userName);
                });
            }
            
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const userName = card.querySelector('h3').textContent;
                    deleteUser(userName);
                });
            }
        });
    }
    
    // Filter users based on search and filters
    function filterUsers() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedRole = roleFilter ? roleFilter.value : '';
        const selectedStatus = statusFilter ? statusFilter.value : '';
        const sortBy = sortFilter ? sortFilter.value : 'name';
        
        let visibleCards = Array.from(userCards).filter(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            const email = card.querySelector('.user-email').textContent.toLowerCase();
            const roleElement = card.querySelector('.user-role-badge');
            const role = roleElement ? roleElement.textContent.toLowerCase() : '';
            const statusElement = card.querySelector('.movie-status');
            const status = statusElement ? statusElement.textContent.toLowerCase() : '';
            
            // Search filter (name or email)
            const matchesSearch = name.includes(searchTerm) || email.includes(searchTerm);
            
            // Role filter
            const matchesRole = !selectedRole || role.includes(selectedRole);
            
            // Status filter  
            const matchesStatus = !selectedStatus || status.includes(selectedStatus);
            
            return matchesSearch && matchesRole && matchesStatus;
        });
        
        // Hide all cards first
        userCards.forEach(card => {
            card.style.display = 'none';
        });
        
        // Sort visible cards
        visibleCards = sortUsers(visibleCards, sortBy);
        
        // Show filtered and sorted cards
        visibleCards.forEach(card => {
            card.style.display = 'block';
        });
        
        // Update results count
        updateResultsCount(visibleCards.length);
        
        // Show loading animation
        showLoadingEffect();
    }
    
    function sortUsers(cards, sortBy) {
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
                case 'email':
                    return a.querySelector('.user-email').textContent.localeCompare(
                        b.querySelector('.user-email').textContent
                    );
                case 'date':
                case 'date-asc':
                case 'last-activity':
                    return 0; // Tarih sıralaması için daha sonra eklenebilir
                default:
                    return 0;
            }
        });
    }
    
    function updateResultsCount(count) {
        const paginationInfo = document.querySelector('.pagination-info span');
        if (paginationInfo) {
            const total = userCards.length;
            paginationInfo.innerHTML = `Gösterilen: <strong>1-${count}</strong> / Toplam: <strong>${total}</strong> kullanıcı`;
        }
    }
    
    function showLoadingEffect() {
        usersGrid.style.opacity = '0.7';
        setTimeout(() => {
            usersGrid.style.opacity = '1';
        }, 200);
    }
    
    // CRUD Operations
    function showAddUserModal() {
        if (window.adminPanel) {
            window.adminPanel.showToast('Yeni kullanıcı ekleme modalı açılıyor...', 'info');
        }
        // TODO: Implement add user modal
        console.log('Add User Modal');
    }
    
    function editUser(userName) {
        if (window.adminPanel) {
            window.adminPanel.showToast(`Kullanıcı ${userName} düzenleniyor...`, 'info');
        }
        // TODO: Implement edit user functionality
        console.log('Edit User:', userName);
    }
    
    function viewUser(userName) {
        if (window.adminPanel) {
            window.adminPanel.showToast(`Kullanıcı ${userName} profili görüntüleniyor...`, 'info');
        }
        // TODO: Navigate to user profile view
        console.log('View User:', userName);
    }
    
    function banUser(userName) {
        if (window.adminPanel && window.adminPanel.showConfirm) {
            window.adminPanel.showConfirm(
                `${userName} kullanıcısını yasaklamak istediğinizden emin misiniz?`,
                () => {
                    // Update status to banned
                    updateUserStatus(userName, 'banned', 'Yasaklı');
                    if (window.adminPanel) {
                        window.adminPanel.showToast(`Kullanıcı ${userName} yasaklandı`, 'warning');
                    }
                    console.log('Ban User:', userName);
                }
            );
        }
    }
    
    function unbanUser(userName) {
        if (window.adminPanel && window.adminPanel.showConfirm) {
            window.adminPanel.showConfirm(
                `${userName} kullanıcısının yasağını kaldırmak istediğinizden emin misiniz?`,
                () => {
                    // Update status to active
                    updateUserStatus(userName, 'active', 'Aktif');
                    if (window.adminPanel) {
                        window.adminPanel.showToast(`Kullanıcı ${userName} yasağı kaldırıldı`, 'success');
                    }
                    console.log('Unban User:', userName);
                }
            );
        }
    }
    
    function activateUser(userName) {
        if (window.adminPanel && window.adminPanel.showConfirm) {
            window.adminPanel.showConfirm(
                `${userName} kullanıcısını aktif etmek istediğinizden emin misiniz?`,
                () => {
                    // Update status to active
                    updateUserStatus(userName, 'active', 'Aktif');
                    if (window.adminPanel) {
                        window.adminPanel.showToast(`Kullanıcı ${userName} aktif edildi`, 'success');
                    }
                    console.log('Activate User:', userName);
                }
            );
        }
    }
    
    function approveUser(userName) {
        if (window.adminPanel && window.adminPanel.showConfirm) {
            window.adminPanel.showConfirm(
                `${userName} kullanıcısını onaylamak istediğinizden emin misiniz?`,
                () => {
                    // Update status to active
                    updateUserStatus(userName, 'active', 'Aktif');
                    if (window.adminPanel) {
                        window.adminPanel.showToast(`Kullanıcı ${userName} onaylandı`, 'success');
                    }
                    console.log('Approve User:', userName);
                }
            );
        }
    }
    
    function resendEmail(userName) {
        if (window.adminPanel) {
            window.adminPanel.showToast(`${userName} kullanıcısına doğrulama e-postası gönderiliyor...`, 'info');
            
            // Simulate email sending
            setTimeout(() => {
                if (window.adminPanel) {
                    window.adminPanel.showToast(`${userName} kullanıcısına e-posta gönderildi`, 'success');
                }
            }, 1500);
        }
        console.log('Resend Email:', userName);
    }
    
    function deleteUser(userName) {
        if (window.adminPanel && window.adminPanel.showConfirm) {
            window.adminPanel.showConfirm(
                `${userName} kullanıcısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`,
                () => {
                    const card = Array.from(userCards).find(card => 
                        card.querySelector('h3').textContent === userName
                    );
                    
                    if (card) {
                        card.style.opacity = '0.5';
                        card.style.transform = 'scale(0.9)';
                        
                        setTimeout(() => {
                            card.remove();
                            updateResultsCount(document.querySelectorAll('.movie-admin-card').length);
                            if (window.adminPanel) {
                                window.adminPanel.showToast('Kullanıcı başarıyla silindi', 'success');
                            }
                        }, 300);
                    }
                    console.log('Delete User:', userName);
                }
            );
        }
    }
    
    function updateUserStatus(userName, statusClass, statusText) {
        const card = Array.from(userCards).find(card => 
            card.querySelector('h3').textContent === userName
        );
        
        if (card) {
            const statusElement = card.querySelector('.movie-status');
            if (statusElement) {
                // Remove old status classes
                statusElement.className = statusElement.className.replace(/status-\w+/g, '');
                // Add new status class
                statusElement.classList.add(`status-${statusClass}`);
                statusElement.textContent = statusText;
                
                // Update action buttons based on new status
                updateActionButtons(card, statusClass);
            }
        }
    }
    
    function updateActionButtons(card, status) {
        const actions = card.querySelector('.movie-actions');
        if (!actions) return;
        
        // Remove existing status-specific buttons
        const banBtn = actions.querySelector('.btn-ban');
        const unbanBtn = actions.querySelector('.btn-unban');
        const activateBtn = actions.querySelector('.btn-activate');
        const approveBtn = actions.querySelector('.btn-approve');
        
        // Remove all status-specific buttons
        [banBtn, unbanBtn, activateBtn, approveBtn].forEach(btn => {
            if (btn) btn.remove();
        });
        
        // Add appropriate button based on status
        const deleteBtn = actions.querySelector('.btn-delete');
        
        if (status === 'active') {
            const newBanBtn = createActionButton('btn-ban', 'fas fa-ban', 'Yasakla');
            newBanBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const userName = card.querySelector('h3').textContent;
                banUser(userName);
            });
            actions.insertBefore(newBanBtn, deleteBtn);
        } else if (status === 'banned') {
            const newUnbanBtn = createActionButton('btn-unban', 'fas fa-user-check', 'Yasağı Kaldır');
            newUnbanBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const userName = card.querySelector('h3').textContent;
                unbanUser(userName);
            });
            actions.insertBefore(newUnbanBtn, deleteBtn);
        }
    }
    
    function createActionButton(className, iconClass, title) {
        const button = document.createElement('button');
        button.className = `action-btn ${className}`;
        button.title = title;
        button.innerHTML = `<i class="${iconClass}"></i>`;
        return button;
    }
    
    // Keyboard shortcuts
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Ctrl + N: Add new user
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                showAddUserModal();
            }
            
            // Escape: Clear search
            if (e.key === 'Escape') {
                if (searchInput) {
                    searchInput.value = '';
                    filterUsers();
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
    
    // Load saved view preference
    const savedView = localStorage.getItem('usersViewPreference') || 'grid';
    const viewBtn = document.querySelector(`[data-view="${savedView}"]`);
    if (viewBtn) {
        viewBtn.click();
    }
    
    // Auto-save search and filter preferences
    function savePreferences() {
        const preferences = {
            search: searchInput ? searchInput.value : '',
            role: roleFilter ? roleFilter.value : '',
            status: statusFilter ? statusFilter.value : '',
            sort: sortFilter ? sortFilter.value : 'name'
        };
        localStorage.setItem('usersFilterPreferences', JSON.stringify(preferences));
    }
    
    // Load saved preferences
    function loadPreferences() {
        const saved = localStorage.getItem('usersFilterPreferences');
        if (saved) {
            const preferences = JSON.parse(saved);
            
            if (searchInput && preferences.search) {
                searchInput.value = preferences.search;
            }
            if (roleFilter && preferences.role) {
                roleFilter.value = preferences.role;
            }
            if (statusFilter && preferences.status) {
                statusFilter.value = preferences.status;
            }
            if (sortFilter && preferences.sort) {
                sortFilter.value = preferences.sort;
            }
            
            // Apply filters
            filterUsers();
        }
    }
    
    // Save preferences on change
    [searchInput, roleFilter, statusFilter, sortFilter].forEach(element => {
        if (element) {
            element.addEventListener('change', savePreferences);
            element.addEventListener('input', savePreferences);
        }
    });
    
    // Load preferences on page load
    loadPreferences();
    
    console.log('Users Management initialized successfully');
});

// Export functions for external use
window.usersManagement = {
    filterUsers: function() {
        // Trigger filter from external code
        const event = new Event('input');
        const searchInput = document.getElementById('searchUsers');
        if (searchInput) {
            searchInput.dispatchEvent(event);
        }
    },
    
    addUser: function() {
        const addBtn = document.getElementById('addUserBtn');
        if (addBtn) {
            addBtn.click();
        }
    }
}; 