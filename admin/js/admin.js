// Admin Panel JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle elements
    const sidebar = document.querySelector('.admin-sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    
    // Profile dropdown
    const profileDropdown = document.querySelector('.admin-profile-dropdown');
    
    // Initialize admin panel
    initSidebar();
    initProfileDropdown();
    initNotifications();
    
    // Sidebar functionality
    function initSidebar() {
        // Mobile sidebar toggle
        if (mobileSidebarToggle) {
            mobileSidebarToggle.addEventListener('click', function() {
                toggleSidebar();
            });
        }
        
        // Desktop sidebar toggle
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function() {
                toggleSidebar();
            });
        }
        
        // Backdrop click to close sidebar
        if (sidebarBackdrop) {
            sidebarBackdrop.addEventListener('click', function() {
                closeSidebar();
            });
        }
        
        // Close sidebar on window resize if mobile
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeSidebar();
            }
        });
        
        // Handle menu item clicks
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                // Remove active class from all items
                menuItems.forEach(mi => mi.classList.remove('active'));
                // Add active class to clicked item
                this.classList.add('active');
                
                // Close mobile sidebar after menu item click
                if (window.innerWidth <= 768) {
                    closeSidebar();
                }
            });
        });
    }
    
    function toggleSidebar() {
        if (sidebar && sidebarBackdrop) {
            sidebar.classList.toggle('active');
            sidebarBackdrop.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        }
    }
    
    function closeSidebar() {
        if (sidebar && sidebarBackdrop) {
            sidebar.classList.remove('active');
            sidebarBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Profile dropdown functionality
    function initProfileDropdown() {
        if (profileDropdown) {
            const profileBtn = profileDropdown.querySelector('.profile-btn');
            const dropdownMenu = profileDropdown.querySelector('.profile-dropdown-menu');
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!profileDropdown.contains(e.target)) {
                    profileDropdown.classList.remove('active');
                }
            });
        }
    }
    
    // Notifications functionality
    function initNotifications() {
        const notificationBtn = document.querySelector('.notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', function() {
                // Show notification panel (to be implemented)
                console.log('Notifications clicked');
            });
        }
    }
    
    // Chart initialization (placeholder)
    function initCharts() {
        // This would integrate with Chart.js or similar library
        const chartElements = document.querySelectorAll('canvas');
        chartElements.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            // Placeholder for chart implementation
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#666';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Grafik yükleniyor...', canvas.width/2, canvas.height/2);
        });
    }
    
    // Initialize charts if canvas elements exist
    if (document.querySelector('canvas')) {
        initCharts();
    }
    
    // Utility functions
    function showToast(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span>${message}</span>
                <button class="toast-close">&times;</button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
        
        // Close button functionality
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        });
    }
    
    // Confirm dialog
    function showConfirm(message, callback) {
        const confirmed = confirm(message);
        if (confirmed && callback) {
            callback();
        }
        return confirmed;
    }
    
    // Loading state
    function showLoading(element) {
        if (element) {
            element.classList.add('loading');
            element.style.pointerEvents = 'none';
        }
    }
    
    function hideLoading(element) {
        if (element) {
            element.classList.remove('loading');
            element.style.pointerEvents = '';
        }
    }
    
    // Animation on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.stat-card, .chart-container, .recent-activities');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(el => observer.observe(el));
    }
    
    // Initialize animations
    animateOnScroll();
    
    // Export functions globally
    window.adminPanel = {
        showToast: showToast,
        showConfirm: showConfirm,
        showLoading: showLoading,
        hideLoading: hideLoading,
        toggleSidebar: toggleSidebar,
        closeSidebar: closeSidebar
    };
    
    console.log('Admin Panel initialized successfully');
});

// CSS for toast notifications (will be added to admin.css later if needed)
const toastStyles = `
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        min-width: 300px;
        color: #f8fafc;
    }
    
    .toast.show {
        transform: translateX(0);
    }
    
    .toast-content {
        padding: 16px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .toast-content span {
        color: #f8fafc;
        font-size: 14px;
        line-height: 1.4;
    }
    
    .toast-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #cbd5e1;
        margin-left: 10px;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
    
    .toast-close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #f8fafc;
    }
    
    .toast-success {
        border-left: 4px solid #10b981;
        background: #1e293b;
    }
    
    .toast-success .toast-content span {
        color: #f8fafc;
    }
    
    .toast-error {
        border-left: 4px solid #ef4444;
        background: #1e293b;
    }
    
    .toast-error .toast-content span {
        color: #f8fafc;
    }
    
    .toast-warning {
        border-left: 4px solid #f59e0b;
        background: #1e293b;
    }
    
    .toast-warning .toast-content span {
        color: #f8fafc;
    }
    
    .toast-info {
        border-left: 4px solid #3b82f6;
        background: #1e293b;
    }
    
    .toast-info .toast-content span {
        color: #f8fafc;
    }
    
    .loading {
        position: relative;
        opacity: 0.6;
    }
    
    .loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid #e50914;
        border-top: 2px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Toast Animations */
    .toast {
        opacity: 0;
        transform: translateX(100%) scale(0.8);
    }
    
    .toast.show {
        opacity: 1;
        transform: translateX(0) scale(1);
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    
    /* Mobile Responsive */
    @media (max-width: 768px) {
        .toast {
            top: 10px;
            right: 10px;
            left: 10px;
            min-width: auto;
            max-width: calc(100vw - 20px);
        }
        
        .toast-content {
            padding: 12px 16px;
        }
        
        .toast-content span {
            font-size: 13px;
        }
    }
`;

// Add toast styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = toastStyles;
document.head.appendChild(styleSheet); 