document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('eventifyUser')) || null;
    
    // If no user is logged in, redirect to login page
    if (!user || !user.isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update user name in the dashboard
    updateUserInfo(user);
    
    // User dropdown toggle
    const userDropdown = document.querySelector('.user-dropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (userDropdown) {
        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        if (dropdownMenu.classList.contains('active')) {
            dropdownMenu.classList.remove('active');
        }
    });
    
    // Notifications panel toggle
    const notificationsIcon = document.querySelector('.notifications');
    const notificationPanel = document.querySelector('.notification-panel');
    
    if (notificationsIcon) {
        notificationsIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationPanel.classList.toggle('active');
        });
    }
    
    // Close notification panel when clicking outside
    document.addEventListener('click', function(e) {
        if (notificationPanel && notificationPanel.classList.contains('active') && !notificationPanel.contains(e.target)) {
            notificationPanel.classList.remove('active');
        }
    });
    
    // Mark all notifications as read
    const markAllReadBtn = document.querySelector('.mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            const unreadItems = document.querySelectorAll('.notification-item.unread');
            unreadItems.forEach(item => {
                item.classList.remove('unread');
            });
            
            // Update notification badge
            updateNotificationBadge();
        });
    }
    
    // Mark individual notification as read
    const markReadBtns = document.querySelectorAll('.mark-read');
    markReadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const notificationItem = this.closest('.notification-item');
            notificationItem.classList.remove('unread');
            
            // Fade out and remove after animation
            notificationItem.style.opacity = '0';
            setTimeout(() => {
                notificationItem.remove();
                updateNotificationBadge();
            }, 300);
        });
    });
    
    // Mobile sidebar toggle
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    
    if (hamburger && sidebar) {
        hamburger.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            this.classList.toggle('active');
            
            // Add overlay if sidebar is active
            if (sidebar.classList.contains('active')) {
                const overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                overlay.style.zIndex = '999';
                document.body.appendChild(overlay);
                
                overlay.addEventListener('click', function() {
                    sidebar.classList.remove('active');
                    hamburger.classList.remove('active');
                    document.body.removeChild(this);
                });
            } else {
                const overlay = document.querySelector('.sidebar-overlay');
                if (overlay) {
                    document.body.removeChild(overlay);
                }
            }
        });
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show confirmation dialog
            if (confirm('Are you sure you want to log out?')) {
                // Clear user data from localStorage
                localStorage.removeItem('eventifyUser');
                
                // Redirect to home page
                window.location.href = 'index.html';
            }
        });
    }
    
    // Helper functions
    function updateUserInfo(user) {
        // Update user name in welcome message
        const userFirstName = document.querySelector('.user-first-name');
        if (userFirstName) {
            userFirstName.textContent = user.firstName || user.name || 'User';
        }
        
        // Update user name in dropdown
        const userName = document.querySelector('.user-name');
        if (userName) {
            userName.textContent = user.name || user.email.split('@')[0];
        }
        
        // Update user avatar if available
        const userAvatar = document.querySelector('.user-avatar');
        if (userAvatar && user.avatar) {
            userAvatar.src = user.avatar;
        }
    }
    
    function updateNotificationBadge() {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        const badge = document.querySelector('.notification-badge');
        
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }
    
    // Initialize event listeners for booking buttons
    initializeBookingButtons();
    
    function initializeBookingButtons() {
        const bookButtons = document.querySelectorAll('.event-card .btn-primary');
        bookButtons.forEach(button => {
            if (button.textContent.includes('Book')) {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const eventCard = this.closest('.event-card');
                    const eventName = eventCard.querySelector('h3').textContent;
                    
                    // Redirect to event details page with query parameter
                    window.location.href = `event-details.html?event=${encodeURIComponent(eventName)}`;
                });
            }
        });
    }
    
    // Add animation to stats cards
    animateStatsCards();
    
    function animateStatsCards() {
        const statValues = document.querySelectorAll('.stat-value');
        
        statValues.forEach(value => {
            const finalValue = value.textContent;
            
            // Check if it's a number or currency
            if (finalValue.includes('$')) {
                const numericValue = parseFloat(finalValue.replace('$', ''));
                animateValue(value, 0, numericValue, 1500, true);
            } else {
                const numericValue = parseInt(finalValue);
                animateValue(value, 0, numericValue, 1000, false);
            }
        });
    }
    
    function animateValue(element, start, end, duration, isCurrency) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);
            
            if (isCurrency) {
                element.textContent = '$' + currentValue.toFixed(2);
            } else {
                element.textContent = currentValue;
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                // Ensure final value is exactly as specified
                if (isCurrency) {
                    element.textContent = '$' + end.toFixed(2);
                } else {
                    element.textContent = end;
                }
            }
        };
        
        window.requestAnimationFrame(step);
    }
});
