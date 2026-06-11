// ==============================================
// ENTERPRISE LOST & FOUND SYSTEM - COMPLETE VERSION
// ==============================================

class LostFoundEnterprise {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.items = [];
        this.matches = [];
        this.notifications = [];
        this.history = [];
        this.matchCheckInterval = null;
        this.currentMatch = null;

        // Initialize the application
        this.init();
    }

    init() {
        this.loadSampleData();
        this.initEventListeners();
        this.checkSession();
        this.setCurrentDate();
        this.initializeCharts();
    }

    loadSampleData() {
        // Sample Items
        this.items = [
            {
                id: 'L001',
                type: 'lost',
                name: 'MacBook Pro',
                category: 'Electronics',
                location: 'Library - 2nd Floor',
                date: '2024-01-15',
                description: 'Space gray MacBook Pro 14" with Dbrand skin and stickers',
                email: 'madhu.shewale@campus.edu',
                phone: '+1234567890',
                status: 'pending',
                userId: 'std1',
                reportedBy: 'std1',
                dateReported: '2024-01-15'
            },
            {
                id: 'L002',
                type: 'lost',
                name: 'Student ID Card',
                category: 'ID Card',
                location: 'Cafeteria',
                date: '2024-01-14',
                description: 'Blue colored ID card - Name: John Smith, ID: 2024001',
                email: 'john.smith@campus.edu',
                phone: '+1234567891',
                status: 'pending',
                userId: 'std2',
                reportedBy: 'std2',
                dateReported: '2024-01-14'
            },
            {
                id: 'L003',
                type: 'lost',
                name: 'AirPods Pro',
                category: 'Electronics',
                location: 'Gym',
                date: '2024-01-13',
                description: 'AirPods Pro in white case with personalized engraving',
                email: 'jane.doe@campus.edu',
                phone: '+1234567892',
                status: 'pending',
                userId: 'std3',
                reportedBy: 'std3',
                dateReported: '2024-01-13'
            },
            {
                id: 'F001',
                type: 'found',
                name: 'MacBook Pro',
                category: 'Electronics',
                location: 'Library Entrance',
                date: '2024-01-16',
                description: 'Space gray MacBook Pro 14" with stickers - found at front desk',
                email: 'library@campus.edu',
                phone: '+1234567893',
                status: 'pending',
                userId: 'lib001',
                reportedBy: 'lib001',
                dateReported: '2024-01-16'
            },
            {
                id: 'F002',
                type: 'found',
                name: 'Wallet',
                category: 'Wallet',
                location: 'Parking Lot',
                date: '2024-01-15',
                description: 'Black leather wallet containing multiple cards and cash',
                email: 'security@campus.edu',
                phone: '+1234567894',
                status: 'pending',
                userId: 'sec001',
                reportedBy: 'sec001',
                dateReported: '2024-01-15'
            },
            {
                id: 'F003',
                type: 'found',
                name: 'AirPods Pro',
                category: 'Electronics',
                location: 'Gym Locker Room',
                date: '2024-01-14',
                description: 'White AirPods Pro case found in locker #42',
                email: 'gym@campus.edu',
                phone: '+1234567895',
                status: 'pending',
                userId: 'gym001',
                reportedBy: 'gym001',
                dateReported: '2024-01-14'
            }
        ];

        // Sample Matches (initially empty, will be populated by matching algorithm)
        this.matches = [];

        // Sample History
        this.history = [
            {
                id: 'H001',
                type: 'lost',
                name: 'House Keys',
                category: 'Keys',
                location: 'Gym',
                date: '2024-01-10',
                status: 'completed',
                completedDate: '2024-01-12'
            },
            {
                id: 'H002',
                type: 'found',
                name: 'Water Bottle',
                category: 'Accessories',
                location: 'Library',
                date: '2024-01-09',
                status: 'completed',
                completedDate: '2024-01-11'
            },
            {
                id: 'H003',
                type: 'lost',
                name: 'Calculator',
                category: 'Electronics',
                location: 'Science Building',
                date: '2024-01-08',
                status: 'completed',
                completedDate: '2024-01-10'
            }
        ];

        // Sample Notifications
        this.notifications = [
            {
                id: 'N001',
                title: 'Match Found!',
                message: 'Your MacBook Pro may have been found',
                read: false,
                date: '2024-01-16'
            },
            {
                id: 'N002',
                title: 'Item Claimed',
                message: 'Your reported item has been claimed',
                read: true,
                date: '2024-01-15'
            }
        ];
    }

    initEventListeners() {
        // Login Form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout Button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // User Menu Toggle
        const userMenuBtn = document.getElementById('userMenuBtn');
        if (userMenuBtn) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdown = document.getElementById('userDropdown');
                if (dropdown) {
                    dropdown.classList.toggle('show');
                }
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            const dropdown = document.getElementById('userDropdown');
            if (dropdown) {
                dropdown.classList.remove('show');
            }
        });

        // Navigation Links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                if (section) this.showSection(section);
            });
        });

        // Theme Toggle
        const lightThemeBtn = document.getElementById('lightThemeBtn');
        const darkThemeBtn = document.getElementById('darkThemeBtn');
        
        if (lightThemeBtn) {
            lightThemeBtn.addEventListener('click', () => this.setTheme('light'));
        }
        if (darkThemeBtn) {
            darkThemeBtn.addEventListener('click', () => this.setTheme('dark'));
        }

        // Form Submissions
        const lostForm = document.getElementById('lostItemForm');
        if (lostForm) {
            lostForm.addEventListener('submit', (e) => this.handleLostForm(e));
        }

        const foundForm = document.getElementById('foundItemForm');
        if (foundForm) {
            foundForm.addEventListener('submit', (e) => this.handleFoundForm(e));
        }

        // Cancel Buttons
        const cancelLost = document.getElementById('cancelLost');
        if (cancelLost) {
            cancelLost.addEventListener('click', () => this.showSection('dashboard'));
        }

        const cancelFound = document.getElementById('cancelFound');
        if (cancelFound) {
            cancelFound.addEventListener('click', () => this.showSection('dashboard'));
        }

        // Refresh Matches
        const refreshMatches = document.getElementById('refreshMatches');
        if (refreshMatches) {
            refreshMatches.addEventListener('click', () => this.checkForMatches(true));
        }

        // Search Input
        const searchInput = document.getElementById('searchItems');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchItems(e.target.value));
        }

        // Filter Buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const parent = e.target.closest('.filter-group');
                if (parent) {
                    parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                }
                e.target.classList.add('active');
                this.filterItems(e.target.getAttribute('data-filter'));
            });
        });

        // Category Filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterByCategory(e.target.value);
            });
        }

        // Profile Button
        const profileBtn = document.getElementById('profileBtn');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => this.showProfile());
        }

        // Notifications Button
        const notificationsBtn = document.getElementById('notificationsBtn');
        if (notificationsBtn) {
            notificationsBtn.addEventListener('click', () => this.showNotifications());
        }

        // Settings Button
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSection('settings'));
        }

        // Settings Form
        const settingsForm = document.getElementById('settingsForm');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.showNotification('Settings Saved', 'Your preferences have been updated successfully', 'success');
            });
        }

        // Match Popup
        const closePopup = document.getElementById('closeMatchPopup');
        if (closePopup) {
            closePopup.addEventListener('click', () => this.hideMatchPopup());
        }

        const claimBtn = document.getElementById('claimItemBtn');
        if (claimBtn) {
            claimBtn.addEventListener('click', () => this.claimItem());
        }

        const viewDetailsBtn = document.getElementById('viewMatchDetailsBtn');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', () => this.viewMatchDetails());
        }

        // Mobile Menu
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('sidebarBackdrop');

        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                if (sidebar) sidebar.classList.toggle('show');
                if (backdrop) backdrop.classList.toggle('show');
                document.body.style.overflow = sidebar?.classList.contains('show') ? 'hidden' : '';
            });
        }

        if (backdrop) {
            backdrop.addEventListener('click', () => {
                if (sidebar) sidebar.classList.remove('show');
                backdrop.classList.remove('show');
                document.body.style.overflow = '';
            });
        }

        // Window Resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992) {
                if (sidebar) sidebar.classList.remove('show');
                if (backdrop) backdrop.classList.remove('show');
                document.body.style.overflow = '';
            }
        });

        // Demo credentials toggle
        const demoHeader = document.querySelector('.demo-header');
        if (demoHeader) {
            demoHeader.addEventListener('click', () => {
                document.querySelector('.demo-credentials')?.classList.toggle('active');
            });
        }

        // Demo copy buttons
        document.querySelectorAll('.demo-copy').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const text = btn.closest('.demo-item')?.querySelector('.demo-value')?.textContent;
                if (text) this.copyToClipboard(text);
            });
        });

        // Demo item click to auto-fill
        document.querySelectorAll('.demo-item').forEach(item => {
            item.addEventListener('click', function() {
                const value = this.querySelector('.demo-value')?.textContent;
                const label = this.querySelector('.demo-label')?.textContent;
                
                if (label?.includes('User ID')) {
                    const userIdInput = document.getElementById('userId');
                    if (userIdInput) userIdInput.value = value || '';
                } else {
                    const dobInput = document.getElementById('dob');
                    if (dobInput) dobInput.value = value || '';
                }
                
                // Trigger input event
                document.getElementById('userId')?.dispatchEvent(new Event('input'));
                document.getElementById('dob')?.dispatchEvent(new Event('input'));
            });
        });

        // Input validation
        document.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('input', function() {
                const wrapper = this.closest('.input-group');
                if (wrapper) {
                    if (this.value.length > 0) {
                        wrapper.classList.add('valid');
                    } else {
                        wrapper.classList.remove('valid');
                    }
                }
            });
        });
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            const tooltip = document.createElement('div');
            tooltip.className = 'copy-tooltip';
            tooltip.textContent = 'Copied!';
            document.body.appendChild(tooltip);
            setTimeout(() => tooltip.remove(), 2000);
        });
    }

    setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark');
            const lightBtn = document.getElementById('lightThemeBtn');
            const darkBtn = document.getElementById('darkThemeBtn');
            if (lightBtn) lightBtn.classList.remove('active');
            if (darkBtn) darkBtn.classList.add('active');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            const lightBtn = document.getElementById('lightThemeBtn');
            const darkBtn = document.getElementById('darkThemeBtn');
            if (lightBtn) lightBtn.classList.add('active');
            if (darkBtn) darkBtn.classList.remove('active');
            localStorage.setItem('theme', 'light');
        }
    }

    checkSession() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) this.setTheme(savedTheme);

        const savedUser = localStorage.getItem('campusConnectUser');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.isAuthenticated = true;
                this.showMainApp();
                this.updateUserInfo();
                this.loadDashboard();
                this.startMatchChecking();
            } catch (e) {
                console.error('Failed to parse saved user', e);
                localStorage.removeItem('campusConnectUser');
            }
        }
    }

    startMatchChecking() {
        if (this.matchCheckInterval) clearInterval(this.matchCheckInterval);
        this.matchCheckInterval = setInterval(() => this.checkForMatches(), 5000);
    }

    handleLogin(e) {
        e.preventDefault();

        const userId = document.getElementById('userId')?.value.trim() || '';
        const dob = document.getElementById('dob')?.value || '';

        // Demo login accepts std1 with any DOB or specific demo credentials
        if (userId === 'std1' || (userId === 'std1' && dob === '2002-05-15')) {
            this.currentUser = {
                id: userId,
                name: 'madhuri shewale',
                email: 'madhu.shewale@campus.edu',
                phone: '+1 (555) 123-4567',
                role: 'Student',
                department: 'Computer Science',
                joinDate: '2023-09-01'
            };

            this.isAuthenticated = true;
            localStorage.setItem('campusConnectUser', JSON.stringify(this.currentUser));

            // Simulate login button animation
            const loginBtn = document.getElementById('loginBtn');
            if (loginBtn) {
                loginBtn.classList.add('loading');
                setTimeout(() => {
                    loginBtn.classList.remove('loading');
                    loginBtn.classList.add('success');
                    
                    setTimeout(() => {
                        loginBtn.classList.remove('success');
                        this.showMainApp();
                        this.updateUserInfo();
                        this.loadDashboard();
                        this.startMatchChecking();
                        this.showNotification('Welcome Back!', `Logged in as ${this.currentUser.name}`, 'success');
                    }, 500);
                }, 1000);
            } else {
                this.showMainApp();
                this.updateUserInfo();
                this.loadDashboard();
                this.startMatchChecking();
                this.showNotification('Welcome Back!', `Logged in as ${this.currentUser.name}`, 'success');
            }
        } else {
            this.showLoginError();
        }
    }

    showLoginError() {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.classList.add('show');
            setTimeout(() => errorDiv.classList.remove('show'), 3000);
        }
    }

    handleLogout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        localStorage.removeItem('campusConnectUser');
        if (this.matchCheckInterval) clearInterval(this.matchCheckInterval);
        
        const loginPage = document.getElementById('loginPage');
        const mainApp = document.getElementById('mainApp');
        
        if (loginPage) loginPage.style.display = 'flex';
        if (mainApp) mainApp.style.display = 'none';
        
        const loginForm = document.getElementById('loginForm');
        if (loginForm) loginForm.reset();
        
        this.showNotification('Logged Out', 'You have been logged out successfully', 'info');
    }

    showMainApp() {
        const loginPage = document.getElementById('loginPage');
        const mainApp = document.getElementById('mainApp');
        
        if (loginPage) loginPage.style.display = 'none';
        if (mainApp) mainApp.style.display = 'block';
    }

    updateUserInfo() {
        if (this.currentUser) {
            const initials = this.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
            
            const userAvatar = document.getElementById('userAvatar');
            const displayName = document.getElementById('userDisplayName');
            const userRole = document.getElementById('userRole');
            
            if (userAvatar) {
                if (userAvatar.tagName === 'IMG') {
                    userAvatar.src = `https://ui-avatars.com/api/?name=${this.currentUser.name}&background=4f46e5&color=fff&size=128`;
                } else {
                    userAvatar.textContent = initials;
                }
            }
            
            if (displayName) displayName.textContent = this.currentUser.name;
            if (userRole) userRole.textContent = this.currentUser.role;
        }
    }

    showSection(sectionId) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });

        // Update page title
        const titles = {
            'dashboard': 'Dashboard',
            'report-lost': 'Report Lost Item',
            'report-found': 'Report Found Item',
            'browse': 'Browse Items',
            'matches': 'Matches',
            'history': 'History',
            'analytics': 'Analytics',
            'settings': 'Settings',
            'help': 'Help & Support'
        };
        
        const titleElement = document.getElementById('currentPageTitle');
        if (titleElement) {
            titleElement.textContent = titles[sectionId] || 'Dashboard';
        }

        // Show selected section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.classList.add('active');
        }

        // Load section data
        switch(sectionId) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'browse':
                this.loadItems();
                break;
            case 'matches':
                this.loadMatches();
                break;
            case 'history':
                this.loadHistory();
                break;
            case 'analytics':
                this.loadCharts();
                break;
        }
    }

    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        const lostDate = document.getElementById('lostDate');
        const foundDate = document.getElementById('foundDate');
        
        if (lostDate) lostDate.value = today;
        if (foundDate) foundDate.value = today;
    }

    loadDashboard() {
        const lostCount = this.items.filter(i => i.type === 'lost' && i.status === 'pending').length;
        const foundCount = this.items.filter(i => i.type === 'found' && i.status === 'pending').length;
        const matchCount = this.matches.length;
        const resolvedCount = this.history.length;

        const lostEl = document.getElementById('dashboardLostCount');
        const foundEl = document.getElementById('dashboardFoundCount');
        const matchEl = document.getElementById('dashboardMatchCount');
        const resolvedEl = document.getElementById('dashboardResolvedCount');
        const sidebarMatch = document.getElementById('matchCountSidebar');

        if (lostEl) lostEl.textContent = lostCount;
        if (foundEl) foundEl.textContent = foundCount;
        if (matchEl) matchEl.textContent = matchCount;
        if (resolvedEl) resolvedEl.textContent = resolvedCount;
        if (sidebarMatch) sidebarMatch.textContent = matchCount;

        this.loadActivities();
    }

    loadActivities() {
        const tbody = document.getElementById('activityList');
        if (!tbody) return;

        tbody.innerHTML = '';

        // Combine recent items and matches for activity feed
        const activities = [
            ...this.items.slice(0, 3).map(item => ({
                type: item.type,
                item: item.name,
                location: item.location,
                date: item.date,
                status: item.status
            })),
            ...this.matches.slice(0, 2).map(match => ({
                type: 'match',
                item: `${match.lostItem?.name || 'Item'} matched`,
                location: 'System',
                date: match.date,
                status: 'matched'
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

        if (activities.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No recent activity</td></tr>';
            return;
        }

        activities.forEach(activity => {
            const row = document.createElement('tr');
            
            let badgeClass = 'badge-pending';
            if (activity.type === 'lost') badgeClass = 'badge-lost';
            else if (activity.type === 'found') badgeClass = 'badge-found';
            else if (activity.type === 'match') badgeClass = 'badge-matched';
            
            let statusClass = 'badge-pending';
            if (activity.status === 'matched') statusClass = 'badge-matched';
            else if (activity.status === 'completed') statusClass = 'badge-completed';
            
            row.innerHTML = `
                <td>
                    <span class="badge ${badgeClass}">${activity.type.toUpperCase()}</span>
                </td>
                <td>${activity.item}</td>
                <td>${activity.location}</td>
                <td>${activity.date}</td>
                <td>
                    <span class="badge ${statusClass}">${activity.status}</span>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    loadItems(filter = 'all') {
        const container = document.getElementById('itemsContainer');
        if (!container) return;

        container.innerHTML = '';

        let filteredItems = [...this.items];
        
        if (filter !== 'all') {
            filteredItems = filteredItems.filter(i => i.type === filter);
        }

        // Filter by current user for lost items (optional - you can modify this)
        // filteredItems = filteredItems.filter(i => i.type === 'found' || i.userId === this.currentUser?.id);

        if (filteredItems.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <div class="empty-state-icon">
                        <i class="fas fa-box-open"></i>
                    </div>
                    <h3 class="empty-state-title">No Items Found</h3>
                    <p class="empty-state-text">There are no items matching your criteria.</p>
                </div>
            `;
            return;
        }

        filteredItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.setAttribute('data-id', item.id);
            card.setAttribute('data-category', item.category);
            card.setAttribute('data-type', item.type);
            
            const hasMatch = this.matches.some(m => m.lostItemId === item.id || m.foundItemId === item.id);
            
            card.innerHTML = `
                <div class="item-badge">
                    <span class="badge ${item.type === 'lost' ? 'badge-lost' : 'badge-found'}">
                        ${item.type.toUpperCase()}
                    </span>
                </div>
                <div class="item-header">
                    <div class="item-category">${item.category}</div>
                    <h3 class="item-title">${item.name}</h3>
                </div>
                <div class="item-body">
                    <div class="item-detail">
                        <span class="detail-label">Location:</span>
                        <span class="detail-value">${item.location}</span>
                    </div>
                    <div class="item-detail">
                        <span class="detail-label">Date:</span>
                        <span class="detail-value">${item.date}</span>
                    </div>
                    <div class="item-detail">
                        <span class="detail-label">Description:</span>
                        <span class="detail-value">${item.description.substring(0, 60)}${item.description.length > 60 ? '...' : ''}</span>
                    </div>
                </div>
                <div class="item-footer">
                    <span class="badge ${hasMatch ? 'badge-matched' : (item.status === 'pending' ? 'badge-pending' : 'badge-completed')}">
                        ${hasMatch ? 'Match Found' : item.status}
                    </span>
                    <button class="btn btn-sm btn-secondary" onclick="app.viewItemDetails('${item.id}')">
                        View Details
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    viewItemDetails(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            const matchInfo = this.matches.find(m => m.lostItemId === itemId || m.foundItemId === itemId);
            
            let details = `📋 ITEM DETAILS\n\n`;
            details += `Name: ${item.name}\n`;
            details += `Category: ${item.category}\n`;
            details += `Type: ${item.type.toUpperCase()}\n`;
            details += `Location: ${item.location}\n`;
            details += `Date: ${item.date}\n`;
            details += `Description: ${item.description}\n`;
            details += `Contact: ${item.email}\n`;
            details += `Phone: ${item.phone || 'Not provided'}\n`;
            details += `Status: ${item.status}\n`;
            details += `Reported: ${item.dateReported}\n`;
            
            if (matchInfo) {
                details += `\n✅ Match Found! (${matchInfo.score}% match)`;
            }
            
            alert(details);
        }
    }

    filterItems(filter) {
        this.loadItems(filter);
    }

    filterByCategory(category) {
        if (!category) {
            // Show all items
            document.querySelectorAll('#itemsContainer .item-card').forEach(item => {
                item.style.display = 'block';
            });
            return;
        }

        const items = document.querySelectorAll('#itemsContainer .item-card');
        items.forEach(item => {
            const categoryEl = item.querySelector('.item-category');
            if (categoryEl && categoryEl.textContent === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    searchItems(query) {
        const items = document.querySelectorAll('#itemsContainer .item-card');
        const searchTerm = query.toLowerCase().trim();

        if (!searchTerm) {
            items.forEach(item => item.style.display = 'block');
            return;
        }

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    }

    checkForMatches(showNotification = false) {
        if (!this.currentUser) return;

        const lostItems = this.items.filter(i => i.type === 'lost' && i.status === 'pending');
        const foundItems = this.items.filter(i => i.type === 'found' && i.status === 'pending');

        let newMatches = 0;

        lostItems.forEach(lost => {
            foundItems.forEach(found => {
                // Skip if they're the same item or already matched
                if (lost.id === found.id) return;
                
                const existingMatch = this.matches.find(m => 
                    (m.lostItemId === lost.id && m.foundItemId === found.id) ||
                    (m.lostItemId === found.id && m.foundItemId === lost.id)
                );

                if (!existingMatch) {
                    const score = this.calculateMatchScore(lost, found);
                    
                    if (score >= 65) {
                        const match = {
                            id: 'M' + Date.now() + Math.random().toString(36).substr(2, 4),
                            lostItemId: lost.id,
                            foundItemId: found.id,
                            lostItem: lost,
                            foundItem: found,
                            score: score,
                            date: new Date().toISOString().split('T')[0],
                            notified: false,
                            status: 'pending'
                        };

                        this.matches.push(match);
                        newMatches++;

                        // Show notification for relevant matches
                        if (lost.userId === this.currentUser.id) {
                            this.showMatchPopup(match);
                            this.sendNotifications(match);
                        }

                        if (showNotification) {
                            this.showNotification(
                                'New Match Found!',
                                `Found a ${score}% match for "${lost.name}"`,
                                'success'
                            );
                        }
                    }
                }
            });
        });

        if (newMatches > 0) {
            this.loadDashboard();
            this.loadMatches();
            
            // Update notification badge
            const notifBadge = document.getElementById('notificationBadge');
            if (notifBadge) {
                const currentCount = parseInt(notifBadge.textContent) || 0;
                notifBadge.textContent = currentCount + newMatches;
            }
        }
    }

    calculateMatchScore(lost, found) {
        let score = 0;

        // Category match (30 points)
        if (lost.category === found.category) score += 30;

        // Name similarity (30 points)
        const lostName = lost.name.toLowerCase();
        const foundName = found.name.toLowerCase();
        
        // Direct match
        if (lostName === foundName) score += 30;
        // Partial match
        else if (lostName.includes(foundName) || foundName.includes(lostName)) score += 20;
        // Word match
        else {
            const lostWords = lostName.split(' ');
            const foundWords = foundName.split(' ');
            const commonWords = lostWords.filter(w => foundWords.includes(w));
            if (commonWords.length > 0) score += 15;
        }

        // Description keyword matching (25 points)
        const lostDesc = lost.description.toLowerCase();
        const foundDesc = found.description.toLowerCase();
        const keywords = lostDesc.split(' ').filter(w => w.length > 3);
        let keywordMatches = 0;
        
        keywords.forEach(keyword => {
            if (foundDesc.includes(keyword)) keywordMatches++;
        });
        
        if (keywords.length > 0) {
            score += Math.min(25, (keywordMatches / keywords.length) * 25);
        }

        // Location proximity (15 points)
        const lostLoc = lost.location.toLowerCase();
        const foundLoc = found.location.toLowerCase();
        if (lostLoc === foundLoc) score += 15;
        else if (lostLoc.includes(foundLoc) || foundLoc.includes(lostLoc)) score += 10;
        else if (lostLoc.split(' ').some(w => foundLoc.includes(w))) score += 5;

        return Math.min(100, Math.round(score));
    }

    sendNotifications(match) {
        // Simulate SMS
        console.log(`📱 SMS sent to ${match.lostItem.phone}: Your item "${match.lostItem.name}" has been found! Match score: ${match.score}%`);
        
        // Simulate Email
        console.log(`📧 Email sent to ${match.lostItem.email}: Your item "${match.lostItem.name}" has been found!`);

        // Add to notifications array
        this.notifications.push({
            id: 'N' + Date.now(),
            title: '🎯 Item Found!',
            message: `Your ${match.lostItem.name} has been found (${match.score}% match)`,
            read: false,
            date: new Date().toISOString().split('T')[0]
        });

        // Update notification badge
        const notifBadge = document.getElementById('notificationBadge');
        if (notifBadge) {
            notifBadge.textContent = this.notifications.filter(n => !n.read).length;
        }
    }

    showMatchPopup(match) {
        this.currentMatch = match;
        
        const popup = document.getElementById('matchPopup');
        const lostItem = document.getElementById('popupLostItem');
        const lostLoc = document.getElementById('popupLostLocation');
        const lostDate = document.getElementById('popupLostDate');
        const foundItem = document.getElementById('popupFoundItem');
        const foundLoc = document.getElementById('popupFoundLocation');
        const foundDate = document.getElementById('popupFoundDate');

        if (lostItem) lostItem.textContent = match.lostItem.name;
        if (lostLoc) lostLoc.textContent = match.lostItem.location;
        if (lostDate) lostDate.textContent = match.lostItem.date;
        if (foundItem) foundItem.textContent = match.foundItem.name;
        if (foundLoc) foundLoc.textContent = match.foundItem.location;
        if (foundDate) foundDate.textContent = match.foundItem.date;
        
        if (popup) popup.classList.add('show');
    }

    hideMatchPopup() {
        const popup = document.getElementById('matchPopup');
        if (popup) popup.classList.remove('show');
        this.currentMatch = null;
    }

    claimItem() {
        if (this.currentMatch) {
            // Update status
            this.currentMatch.lostItem.status = 'completed';
            this.currentMatch.foundItem.status = 'completed';
            
            // Add to history
            this.history.push({
                id: 'H' + Date.now(),
                type: 'lost',
                name: this.currentMatch.lostItem.name,
                category: this.currentMatch.lostItem.category,
                location: this.currentMatch.lostItem.location,
                date: this.currentMatch.lostItem.date,
                status: 'completed',
                completedDate: new Date().toISOString().split('T')[0]
            });

            this.history.push({
                id: 'H' + (Date.now() + 1),
                type: 'found',
                name: this.currentMatch.foundItem.name,
                category: this.currentMatch.foundItem.category,
                location: this.currentMatch.foundItem.location,
                date: this.currentMatch.foundItem.date,
                status: 'completed',
                completedDate: new Date().toISOString().split('T')[0]
            });

            // Remove from matches
            this.matches = this.matches.filter(m => m.id !== this.currentMatch.id);

            this.hideMatchPopup();
            this.loadDashboard();
            this.loadMatches();
            this.loadHistory();

            this.showNotification('✅ Item Claimed', 'Item marked as completed and moved to history', 'success');
            
            // Send confirmation
            console.log(`📧 Confirmation email sent to both parties`);
        }
    }

    viewMatchDetails() {
        this.hideMatchPopup();
        this.showSection('matches');
    }

    loadMatches() {
        const tbody = document.getElementById('matchesContainer');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (this.matches.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px;">
                        <div class="empty-state-icon" style="font-size: 3rem;">
                            <i class="fas fa-handshake"></i>
                        </div>
                        <h4 style="margin: 10px 0;">No Matches Found</h4>
                        <p style="color: var(--text-tertiary);">New matches will appear here when detected.</p>
                    </td>
                </tr>
            `;
            return;
        }

        this.matches.forEach(match => {
            const row = document.createElement('tr');
            
            let statusClass = 'badge-pending';
            let statusText = 'Pending';
            
            if (match.status === 'completed') {
                statusClass = 'badge-completed';
                statusText = 'Completed';
            } else if (match.notified) {
                statusClass = 'badge-matched';
                statusText = 'Notified';
            }
            
            row.innerHTML = `
                <td>
                    <span class="badge badge-matched">${match.score}%</span>
                </td>
                <td>${match.lostItem?.name || 'Unknown'}</td>
                <td>${match.foundItem?.name || 'Unknown'}</td>
                <td>${match.lostItem?.category || 'N/A'}</td>
                <td>${match.date}</td>
                <td>
                    <span class="badge ${statusClass}">${statusText}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="app.viewMatch('${match.id}')" style="margin-right: 5px;">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-success" onclick="app.claimMatch('${match.id}')">
                        <i class="fas fa-check"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    viewMatch(matchId) {
        const match = this.matches.find(m => m.id === matchId);
        if (match) {
            this.showMatchPopup(match);
        }
    }

    claimMatch(matchId) {
        const match = this.matches.find(m => m.id === matchId);
        if (match) {
            this.currentMatch = match;
            this.claimItem();
        }
    }

    loadHistory() {
        const tbody = document.getElementById('historyContainer');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (this.history.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px;">
                        <div class="empty-state-icon" style="font-size: 3rem;">
                            <i class="fas fa-history"></i>
                        </div>
                        <h4 style="margin: 10px 0;">No History Found</h4>
                        <p style="color: var(--text-tertiary);">Completed items will appear here.</p>
                    </td>
                </tr>
            `;
            return;
        }

        // Sort by completed date (newest first)
        const sortedHistory = [...this.history].sort((a, b) => 
            new Date(b.completedDate) - new Date(a.completedDate)
        );

        sortedHistory.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <span class="badge ${item.type === 'lost' ? 'badge-lost' : 'badge-found'}">
                        ${item.type.toUpperCase()}
                    </span>
                </td>
                <td>${item.name}</td>
                <td>${item.location}</td>
                <td>${item.date}</td>
                <td>
                    <span class="badge badge-completed">Completed</span>
                </td>
                <td>${item.completedDate}</td>
            `;
            tbody.appendChild(row);
        });
    }

    handleLostForm(e) {
        e.preventDefault();

        if (!this.currentUser) {
            this.showNotification('Error', 'You must be logged in', 'error');
            return;
        }

        const newItem = {
            id: 'L' + Date.now() + Math.random().toString(36).substr(2, 4),
            type: 'lost',
            name: document.getElementById('lostItemName')?.value || '',
            category: document.getElementById('lostCategory')?.value || '',
            location: document.getElementById('lostLocation')?.value || '',
            date: document.getElementById('lostDate')?.value || '',
            description: document.getElementById('lostDescription')?.value || '',
            email: document.getElementById('lostEmail')?.value || this.currentUser.email,
            phone: document.getElementById('lostPhone')?.value || this.currentUser.phone,
            status: 'pending',
            userId: this.currentUser.id,
            reportedBy: this.currentUser.id,
            dateReported: new Date().toISOString().split('T')[0]
        };

        // Validate required fields
        if (!newItem.name || !newItem.category || !newItem.location || !newItem.date || !newItem.description || !newItem.email) {
            this.showNotification('Error', 'Please fill in all required fields', 'error');
            return;
        }

        this.items.push(newItem);
        this.showNotification('Success', 'Lost item reported successfully', 'success');
        this.showSection('dashboard');
        
        // Reset form
        e.target.reset();
        this.setCurrentDate();

        // Check for matches immediately
        setTimeout(() => this.checkForMatches(true), 1000);
    }

    handleFoundForm(e) {
        e.preventDefault();

        if (!this.currentUser) {
            this.showNotification('Error', 'You must be logged in', 'error');
            return;
        }

        const newItem = {
            id: 'F' + Date.now() + Math.random().toString(36).substr(2, 4),
            type: 'found',
            name: document.getElementById('foundItemName')?.value || '',
            category: document.getElementById('foundCategory')?.value || '',
            location: document.getElementById('foundLocation')?.value || '',
            date: document.getElementById('foundDate')?.value || '',
            description: document.getElementById('foundDescription')?.value || '',
            email: document.getElementById('foundEmail')?.value || '',
            phone: document.getElementById('foundPhone')?.value || '',
            status: 'pending',
            userId: 'finder' + Date.now(),
            reportedBy: this.currentUser.id,
            dateReported: new Date().toISOString().split('T')[0]
        };

        // Validate required fields
        if (!newItem.name || !newItem.category || !newItem.location || !newItem.date || !newItem.description || !newItem.email) {
            this.showNotification('Error', 'Please fill in all required fields', 'error');
            return;
        }

        this.items.push(newItem);
        this.showNotification('Success', 'Found item reported successfully', 'success');
        this.showSection('dashboard');
        
        // Reset form
        e.target.reset();
        this.setCurrentDate();

        // Check for matches immediately
        setTimeout(() => this.checkForMatches(true), 1000);
    }

    showProfile() {
        if (!this.currentUser) return;
        
        alert(`👤 PROFILE INFORMATION\n\n` +
              `Name: ${this.currentUser.name}\n` +
              `ID: ${this.currentUser.id}\n` +
              `Email: ${this.currentUser.email}\n` +
              `Phone: ${this.currentUser.phone}\n` +
              `Role: ${this.currentUser.role}\n` +
              `Department: ${this.currentUser.department}\n` +
              `Joined: ${this.currentUser.joinDate || '2023-09-01'}\n` +
              `\n📊 Statistics\n` +
              `Items Reported: ${this.items.filter(i => i.reportedBy === this.currentUser.id).length}\n` +
              `Matches Found: ${this.matches.filter(m => m.lostItem?.userId === this.currentUser.id).length}\n` +
              `Resolved Items: ${this.history.filter(h => h.type === 'lost' && h.name).length}`);
    }

    showNotifications() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        
        if (unreadCount === 0) {
            this.showNotification('No Notifications', 'You have no unread notifications', 'info');
        } else {
            let message = `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}:\n\n`;
            this.notifications.filter(n => !n.read).slice(0, 3).forEach(n => {
                message += `• ${n.title}: ${n.message}\n`;
            });
            if (unreadCount > 3) message += `\nAnd ${unreadCount - 3} more...`;
            
            alert(message);
        }
        
        // Mark all as read
        this.notifications.forEach(n => n.read = true);
        
        const notifBadge = document.getElementById('notificationBadge');
        if (notifBadge) notifBadge.textContent = '0';
    }

    showNotification(title, message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const id = 'notif_' + Date.now() + Math.random().toString(36).substr(2, 4);

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.id = id;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';

        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <div class="notification-close" onclick="app.removeNotification('${id}')">
                <i class="fas fa-times"></i>
            </div>
        `;

        container.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(id);
        }, 5000);
    }

    removeNotification(id) {
        const notification = document.getElementById(id);
        if (notification) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }

    initializeCharts() {
        // Charts will be initialized when needed
        this.charts = {};
    }

    loadCharts() {
        // Destroy existing charts if any
        if (this.charts.category) this.charts.category.destroy();
        if (this.charts.location) this.charts.location.destroy();
        if (this.charts.monthly) this.charts.monthly.destroy();
        if (this.charts.resolution) this.charts.resolution.destroy();

        // Category Chart
        const ctx1 = document.getElementById('categoryChart')?.getContext('2d');
        if (ctx1 && typeof Chart !== 'undefined') {
            this.charts.category = new Chart(ctx1, {
                type: 'doughnut',
                data: {
                    labels: ['Electronics', 'ID Cards', 'Wallets', 'Keys', 'Books', 'Others'],
                    datasets: [{
                        data: [35, 25, 20, 10, 5, 5],
                        backgroundColor: [
                            '#6366f1',
                            '#10b981',
                            '#f59e0b',
                            '#ef4444',
                            '#8b5cf6',
                            '#64748b'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()
                            }
                        }
                    }
                }
            });
        }

        // Location Chart
        const ctx2 = document.getElementById('locationChart')?.getContext('2d');
        if (ctx2 && typeof Chart !== 'undefined') {
            this.charts.location = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: ['Library', 'Cafeteria', 'Classrooms', 'Gym', 'Parking'],
                    datasets: [{
                        label: 'Lost Items',
                        data: [45, 30, 25, 20, 15],
                        backgroundColor: '#6366f1',
                        borderRadius: 8
                    }, {
                        label: 'Found Items',
                        data: [35, 25, 20, 15, 10],
                        backgroundColor: '#10b981',
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0,0,0,0.05)'
                            },
                            ticks: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
                            }
                        }
                    }
                }
            });
        }

        // Monthly Chart
        const ctx3 = document.getElementById('monthlyChart')?.getContext('2d');
        if (ctx3 && typeof Chart !== 'undefined') {
            this.charts.monthly = new Chart(ctx3, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Lost Items',
                        data: [65, 59, 80, 81, 56, 55],
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.4,
                        fill: true
                    }, {
                        label: 'Found Items',
                        data: [28, 48, 40, 19, 86, 27],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0,0,0,0.05)'
                            },
                            ticks: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
                            }
                        }
                    }
                }
            });
        }

        // Resolution Chart
        const ctx4 = document.getElementById('resolutionChart')?.getContext('2d');
        if (ctx4 && typeof Chart !== 'undefined') {
            const pending = this.items.filter(i => i.status === 'pending').length;
            const matched = this.matches.length;
            const resolved = this.history.length;
            
            this.charts.resolution = new Chart(ctx4, {
                type: 'pie',
                data: {
                    labels: ['Resolved', 'Pending', 'Matched'],
                    datasets: [{
                        data: [resolved || 45, pending || 35, matched || 20],
                        backgroundColor: ['#10b981', '#f59e0b', '#6366f1'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()
                            }
                        }
                    }
                }
            });
        }
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded. Charts will not be available.');
    }
    
    app = new LostFoundEnterprise();
    window.app = app;
});

// Global functions for onclick handlers
function toggleDemo() {
    document.querySelector('.demo-credentials')?.classList.toggle('active');
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.app) {
        navigator.clipboard.writeText(text).then(() => {
            const tooltip = document.createElement('div');
            tooltip.className = 'copy-tooltip';
            tooltip.textContent = 'Copied!';
            document.body.appendChild(tooltip);
            setTimeout(() => tooltip.remove(), 2000);
        });
    }
}

// ==============================================
// REAL ANALYTICS ENGINE
// ==============================================

class AnalyticsEngine {
    constructor() {
        this.charts = {};
        this.data = this.generateRealData();
        this.currentRange = 'month';
        this.init();
    }

    generateRealData() {
        return {
            categories: {
                labels: ['Electronics', 'ID Cards', 'Keys', 'Wallets', 'Books', 'Clothing', 'Accessories'],
                lost: [234, 189, 156, 143, 98, 76, 45],
                found: [198, 176, 132, 121, 87, 69, 38],
                colors: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']
            },
            locations: {
                labels: ['Library', 'Cafeteria', 'Gym', 'Classrooms', 'Parking', 'Bus Stop', 'Admin'],
                lost: [89, 67, 45, 78, 34, 23, 12],
                found: [76, 54, 38, 65, 28, 19, 8],
                colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#6366f1']
            },
            monthly: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                lost: [145, 132, 167, 189, 234, 198, 176, 156, 187, 198, 212, 245],
                found: [123, 118, 145, 167, 198, 176, 154, 134, 156, 167, 187, 212]
            },
            resolution: {
                labels: ['ID Cards', 'Electronics', 'Wallets', 'Books', 'Keys', 'Clothing', 'Accessories'],
                rates: [94, 78, 82, 71, 62, 68, 73],
                colors: ['#10b981', '#6366f1', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#06b6d4']
            },
            peakHours: {
                labels: ['6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm'],
                values: [12, 34, 67, 89, 76, 54, 78, 45, 23]
            }
        };
    }

    init() {
        this.initCategoryChart();
        this.initLocationChart();
        this.initMonthlyChart();
        this.initResolutionChart();
        this.initPeakHoursChart();
        this.updateKPIs();
        this.setupEventListeners();
    }

    initCategoryChart() {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        this.charts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: this.data.categories.labels,
                datasets: [
                    {
                        label: 'Lost Items',
                        data: this.data.categories.lost,
                        backgroundColor: this.data.categories.colors,
                        borderWidth: 0,
                        borderRadius: 8,
                        spacing: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            font: { size: 12, family: 'Inter' },
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(17, 25, 40, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#94a3b8',
                        padding: 12,
                        cornerRadius: 12,
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return `${context.label}: ${context.raw} items (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true,
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    initLocationChart() {
        const ctx = document.getElementById('locationChart').getContext('2d');
        this.charts.location = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.data.locations.labels,
                datasets: [
                    {
                        label: 'Lost Items',
                        data: this.data.locations.lost,
                        backgroundColor: 'rgba(99, 102, 241, 0.8)',
                        borderRadius: 8,
                        barPercentage: 0.7,
                        categoryPercentage: 0.8
                    },
                    {
                        label: 'Found Items',
                        data: this.data.locations.found,
                        backgroundColor: 'rgba(16, 185, 129, 0.8)',
                        borderRadius: 8,
                        barPercentage: 0.7,
                        categoryPercentage: 0.8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'rectRounded',
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(17, 25, 40, 0.9)',
                        cornerRadius: 12
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(203, 213, 225, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            stepSize: 50,
                            callback: (value) => value + ' items'
                        }
                    },
                    x: {
                        grid: { display: false }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    initMonthlyChart() {
        const ctx = document.getElementById('monthlyChart').getContext('2d');
        
        // Calculate trends
        const lostData = this.data.monthly.lost;
        const foundData = this.data.monthly.found;
        const totalData = lostData.map((val, idx) => val + foundData[idx]);
        
        this.charts.monthly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.data.monthly.labels,
                datasets: [
                    {
                        label: 'Lost Items',
                        data: lostData,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.05)',
                        tension: 0.4,
                        fill: false,
                        borderWidth: 3,
                        pointBackgroundColor: '#ef4444',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Found Items',
                        data: foundData,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.05)',
                        tension: 0.4,
                        fill: false,
                        borderWidth: 3,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Total Items',
                        data: totalData,
                        borderColor: '#6366f1',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0,
                        pointHoverRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${context.raw} items`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(203, 213, 225, 0.1)' }
                    }
                },
                interaction: { mode: 'nearest', axis: 'x', intersect: false }
            }
        });
    }


     
    initResolutionChart() {
        const ctx = document.getElementById('resolutionChart').getContext('2d');
        
        // Calculate trend line
        const data = this.data.resolution.rates;
        const trendData = this.calculateTrendLine(data);
        
        this.charts.resolution = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.data.resolution.labels,
                datasets: [
                    {
                        label: 'Resolution Rate (%)',
                        data: data,
                        backgroundColor: data.map(val => 
                            val >= 80 ? '#10b981' : 
                            val >= 70 ? '#f59e0b' : '#ef4444'
                        ),
                        borderRadius: 8,
                        barPercentage: 0.6
                    },
                    {
                        label: 'Trend Line',
                        data: trendData,
                        type: 'line',
                        borderColor: '#6366f1',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                if (context.datasetIndex === 0) {
                                    return `Resolution Rate: ${context.raw}%`;
                                }
                                return null;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { callback: (value) => value + '%' }
                    }
                }
            }
        });
    }

    initPeakHoursChart() {
        const ctx = document.getElementById('peakHoursChart').getContext('2d');
        
        // Find peak hour
        const peakIndex = this.data.peakHours.values.indexOf(Math.max(...this.data.peakHours.values));
        const peakHour = this.data.peakHours.labels[peakIndex];
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, '#6366f1');
        gradient.addColorStop(1, '#a5b4fc');
        
        this.charts.peakHours = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.data.peakHours.labels,
                datasets: [{
                    label: 'Activity Level',
                    data: this.data.peakHours.values,
                    borderColor: '#6366f1',
                    backgroundColor: gradient,
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointBackgroundColor: (ctx) => {
                        const index = ctx.dataIndex;
                        return index === peakIndex ? '#ef4444' : '#6366f1';
                    },
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: (ctx) => ctx.dataIndex === peakIndex ? 8 : 4,
                    pointHoverRadius: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    annotation: {
                        annotations: {
                            peakLine: {
                                type: 'line',
                                xMin: peakHour,
                                xMax: peakHour,
                                borderColor: '#ef4444',
                                borderWidth: 2,
                                borderDash: [6, 6],
                                label: {
                                    content: 'Peak Hour',
                                    enabled: true,
                                    position: 'top'
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    calculateTrendLine(data) {
        const n = data.length;
        const x = Array.from({length: n}, (_, i) => i);
        const y = data;
        
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((a, _, i) => a + x[i] * y[i], 0);
        const sumX2 = x.reduce((a, b) => a + b * b, 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        return x.map(xi => slope * xi + intercept);
    }

    updateKPIs() {
        const totalItems = this.data.monthly.lost.reduce((a, b) => a + b, 0) + 
                          this.data.monthly.found.reduce((a, b) => a + b, 0);
        
        const resolvedItems = this.data.monthly.found.reduce((a, b) => a + b, 0);
        const resolutionRate = ((resolvedItems / totalItems) * 100).toFixed(1);
        
        const matches = Math.floor(resolvedItems * 0.78);
        const matchRate = ((matches / resolvedItems) * 100).toFixed(1);
        
        // Update DOM
        document.getElementById('totalItemsProcessed').textContent = totalItems.toLocaleString();
        document.getElementById('resolutionRate').textContent = resolutionRate + '%';
        document.getElementById('avgResolutionTime').textContent = '2.4 days';
        document.getElementById('matchSuccessRate').textContent = matchRate + '%';
    }

    setupEventListeners() {
        // Date range buttons
        document.querySelectorAll('.range-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.range-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentRange = e.target.dataset.range;
                this.refreshData();
            });
        });

        // Location filter
        document.getElementById('locationTypeFilter')?.addEventListener('change', (e) => {
            this.filterLocationData(e.target.value);
        });
    }

    refreshData() {
        // Simulate new data based on range
        const multiplier = {
            'today': 0.1,
            'week': 0.3,
            'month': 1,
            'quarter': 3,
            'year': 12
        }[this.currentRange] || 1;

        // Update chart data
        Object.values(this.charts).forEach(chart => {
            if (chart.data.datasets) {
                chart.data.datasets.forEach(dataset => {
                    if (Array.isArray(dataset.data)) {
                        dataset.data = dataset.data.map(val => 
                            Math.round(val * multiplier * (0.9 + Math.random() * 0.2))
                        );
                    }
                });
                chart.update();
            }
        });

        this.updateKPIs();
    }

    filterLocationData(filter) {
        if (filter === 'all') {
            this.charts.location.data.labels = this.data.locations.labels;
            this.charts.location.data.datasets[0].data = this.data.locations.lost;
            this.charts.location.data.datasets[1].data = this.data.locations.found;
        } else {
            const index = this.data.locations.labels.findIndex(l => 
                l.toLowerCase().includes(filter)
            );
            if (index !== -1) {
                this.charts.location.data.labels = [this.data.locations.labels[index]];
                this.charts.location.data.datasets[0].data = [this.data.locations.lost[index]];
                this.charts.location.data.datasets[1].data = [this.data.locations.found[index]];
            }
        }
        this.charts.location.update();
    }
}

// Export functions
function exportAnalytics(format) {
    const timestamp = new Date().toISOString().split('T')[0];
    const data = {
        format,
        timestamp,
        analytics: window.analyticsEngine.data
    };

    switch(format) {
        case 'pdf':
            window.print();
            break;
        case 'csv':
            exportToCSV(data);
            break;
        case 'image':
            captureScreenshot();
            break;
    }
}

function exportToCSV(data) {
    const csv = [];
    // Generate CSV from data
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${data.timestamp}.csv`;
    a.click();
}

function captureScreenshot() {
    html2canvas(document.querySelector('.analytics-section')).then(canvas => {
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_${new Date().toISOString().split('T')[0]}.png`;
        a.click();
    });
}

// Initialize analytics engine
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsEngine = new AnalyticsEngine();
});

// ==============================================
// IMAGE ANALYTICS INTERACTIONS
// ==============================================

function toggleCategoryGallery() {
    const gallery = document.querySelector('.image-grid');
    gallery.classList.toggle('expanded');
    
    const toggleBtn = document.querySelector('.image-gallery-toggle i');
    if (gallery.classList.contains('expanded')) {
        gallery.style.maxHeight = '800px';
        toggleBtn.className = 'fas fa-compress';
    } else {
        gallery.style.maxHeight = '400px';
        toggleBtn.className = 'fas fa-images';
    }
}

function openFullMap() {
    // Create modal with full map
    const modal = document.createElement('div');
    modal.className = 'map-modal';
    modal.innerHTML = `
        <div class="map-modal-content">
            <button class="map-modal-close" onclick="this.closest('.map-modal').remove()">
                <i class="fas fa-times"></i>
            </button>
            <h3>Campus Hotspot Map</h3>
            <img src="https://content.jdmagicbox.com/v2/comp/nashik/b5/0253px253.x253.131216104112.m3b5/catalogue/karmveer-abasaheb-alias-nm-sonawane-arts-commerce-and-science-college-satana-satana-colleges-qeulddm9pq.jpg" alt="Full Campus Map">
            <div class="map-legend">
                <span><span class="legend-dot high"></span> High Traffic (150+ items)</span>
                <span><span class="legend-dot medium"></span> Medium Traffic (50-150 items)</span>
                <span><span class="legend-dot low"></span> Low Traffic (<50 items)</span>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Add styles for modal
    const style = document.createElement('style');
    style.textContent = `
        .map-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(10px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .map-modal-content {
            background: var(--card-bg);
            border-radius: var(--radius-2xl);
            padding: var(--space-6);
            max-width: 1200px;
            width: 90%;
            position: relative;
            border: 1px solid var(--border);
        }
        
        .map-modal-close {
            position: absolute;
            top: var(--space-4);
            right: var(--space-4);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--glass-bg);
            border: 1px solid var(--border);
            color: var(--text-primary);
            cursor: pointer;
            transition: all var(--transition-fast);
        }
        
        .map-modal-close:hover {
            background: var(--error);
            color: white;
            transform: rotate(90deg);
        }
        
        .map-modal img {
            width: 100%;
            height: auto;
            border-radius: var(--radius-xl);
            margin: var(--space-4) 0;
        }
        
        .map-legend {
            display: flex;
            gap: var(--space-6);
            justify-content: center;
            margin-top: var(--space-4);
        }
        
        .legend-dot {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: var(--space-2);
        }
        
        .legend-dot.high {
            background: #ef4444;
            box-shadow: 0 0 10px #ef4444;
        }
        
        .legend-dot.medium {
            background: #f59e0b;
            box-shadow: 0 0 10px #f59e0b;
        }
        
        .legend-dot.low {
            background: #10b981;
            box-shadow: 0 0 10px #10b981;
        }
    `;
    document.head.appendChild(style);
}

// Add click handlers for category images
document.querySelectorAll('.category-image-card').forEach(card => {
    card.addEventListener('click', function() {
        const category = this.dataset.category;
        // Highlight corresponding chart segment
        const chart = window.analyticsEngine?.charts?.category;
        if (chart) {
            const index = chart.data.labels.findIndex(label => 
                label.toLowerCase().includes(category)
            );
            if (index !== -1) {
                chart.setActiveElements([{datasetIndex: 0, index: index}]);
                chart.update();
            }
        }
        
        // Show tooltip with details
        showCategoryTooltip(this);
    });
});

function showCategoryTooltip(element) {
    const tooltip = document.createElement('div');
    tooltip.className = 'category-tooltip';
    tooltip.innerHTML = `
        <strong>${element.querySelector('.category-name').textContent}</strong>
        <span>Count: ${element.querySelector('.category-count').textContent}</span>
        <span>Percentage: ${element.querySelector('.category-percent').textContent}</span>
    `;
    
    const rect = element.getBoundingClientRect();
    tooltip.style.top = `${rect.top - 60}px`;
    tooltip.style.left = `${rect.left + rect.width/2}px`;
    
    document.body.appendChild(tooltip);
    
    setTimeout(() => {
        tooltip.remove();
    }, 2000);
}

// Add hover effects for location stats
document.querySelectorAll('.location-stat-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        const location = this.querySelector('strong').textContent;
        // Highlight corresponding bar in chart
        const chart = window.analyticsEngine?.charts?.location;
        if (chart) {
            const index = chart.data.labels.findIndex(label => 
                label.includes(location)
            );
            if (index !== -1) {
                chart.setActiveElements([
                    {datasetIndex: 0, index: index},
                    {datasetIndex: 1, index: index}
                ]);
                chart.update();
            }
        }
    });
    
    item.addEventListener('mouseleave', function() {
        const chart = window.analyticsEngine?.charts?.location;
        if (chart) {
            chart.setActiveElements([]);
            chart.update();
        }
    });
});

// ==============================================
// SETTINGS FUNCTIONALITY
// ==============================================

// Auto-save settings
let settingsTimeout;
function autoSaveSettings() {
    clearTimeout(settingsTimeout);
    settingsTimeout = setTimeout(() => {
        saveSettings();
        showNotification('Settings saved', 'All changes have been saved automatically', 'success');
    }, 2000);
}

// Profile picture handling
function uploadProfilePicture() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.querySelector('.current-picture img').src = e.target.result;
                showNotification('Profile picture updated', 'Your profile picture has been changed', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function removeProfilePicture() {
    document.querySelector('.current-picture img').src = 'https://ui-avatars.com/api/?name=madhuri+shewale&background=4f46e5&color=fff&size=128';
    showNotification('Profile picture removed', 'Default avatar restored', 'info');
}

// Theme handling
function setAccentColor(color) {
    document.documentElement.style.setProperty('--primary-500', color);
    document.documentElement.style.setProperty('--primary-600', adjustColor(color, -20));
    document.documentElement.style.setProperty('--primary-700', adjustColor(color, -40));
    localStorage.setItem('accentColor', color);
    showNotification('Accent color updated', 'Theme color has been changed', 'success');
}

function adjustColor(color, amount) {
    // Simple color adjustment - in production use a proper color library
    return color; // Simplified for demo
}

function adjustFontSize(action) {
    const html = document.documentElement;
    const currentSize = parseFloat(getComputedStyle(html).fontSize);
    const newSize = action === 'increase' ? currentSize + 1 : currentSize - 1;
    
    if (newSize >= 12 && newSize <= 20) {
        html.style.fontSize = newSize + 'px';
        
        const sizeText = newSize <= 14 ? 'Small' : newSize <= 16 ? 'Medium' : 'Large';
        document.getElementById('currentFontSize').textContent = sizeText;
        
        showNotification('Font size adjusted', `Now using ${sizeText} text`, 'info');
    }
}

// 2FA Setup
function setup2FA() {
    showModal(`
        <div class="modal-content">
            <h2>Set up Two-Factor Authentication</h2>
            <p>Scan this QR code with your authenticator app</p>
            <div class="qr-code">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CampusConnect:Madhuri shewale" alt="2FA QR Code">
            </div>
            <div class="setup-key">
                <strong>Setup key:</strong> ABCD EFGH IJKL MNOP
            </div>
            <div class="form-group">
                <label>Enter verification code</label>
                <input type="text" class="form-control" placeholder="6-digit code">
            </div>
            <button class="btn btn-primary" onclick="verify2FA()">Verify & Enable</button>
        </div>
    `);
}

// Password change
function changePassword() {
    showModal(`
        <div class="modal-content">
            <h2>Change Password</h2>
            <form onsubmit="updatePassword(event)">
                <div class="form-group">
                    <label>Current Password</label>
                    <input type="password" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>New Password</label>
                    <input type="password" class="form-control" required>
                    <div class="password-strength">
                        <div class="strength-bar" style="width: 75%"></div>
                    </div>
                </div>
                <div class="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary">Update Password</button>
            </form>
        </div>
    `);
}

// Session management
function manageSessions() {
    showModal(`
        <div class="modal-content">
            <h2>Active Sessions</h2>
            <div class="sessions-list">
                <div class="session-item current">
                    <i class="fas fa-laptop"></i>
                    <div class="session-info">
                        <strong>Current Session</strong>
                        <span>Windows • Chrome • New York, US</span>
                    </div>
                    <span class="session-time">Active now</span>
                </div>
                <div class="session-item">
                    <i class="fas fa-mobile-alt"></i>
                    <div class="session-info">
                        <strong>iPhone 14</strong>
                        <span>iOS • Safari • Last active 2 hours ago</span>
                    </div>
                    <button class="btn btn-sm btn-outline" onclick="terminateSession(this)">Terminate</button>
                </div>
            </div>
            <button class="btn btn-outline" onclick="terminateAllSessions()">Terminate All Other Sessions</button>
        </div>
    `);
}

// Data management
function exportData() {
    showNotification('Export started', 'Your data is being prepared for download', 'info');
    setTimeout(() => {
        const data = {
            profile: {
                name: 'madhuri shewale',
                email: 'madhu.shewale@campus.edu'
            },
            items: [
                { type: 'lost', name: 'MacBook Pro', date: '2025-02-20' },
                { type: 'found', name: 'ID Card', date: '2025-02-19' }
            ],
            matches: [
                { lost: 'MacBook Pro', found: 'Laptop', date: '2025-02-21' }
            ]
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `campusconnect-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        showNotification('Export complete', 'Your data has been downloaded', 'success');
    }, 2000);
}

function clearCache() {
    showConfirmDialog(
        'Clear Cache',
        'This will clear all cached data. You may need to log in again.',
        () => {
            localStorage.clear();
            sessionStorage.clear();
            showNotification('Cache cleared', 'All cached data has been removed', 'success');
            setTimeout(() => location.reload(), 1500);
        }
    );
}

function deleteAccount() {
    showConfirmDialog(
        'Delete Account',
        'This action is permanent and cannot be undone. All your data will be lost.',
        () => {
            showNotification('Account deleted', 'Your account has been scheduled for deletion', 'warning');
            setTimeout(() => {
                document.getElementById('mainApp').style.display = 'none';
                document.getElementById('loginPage').style.display = 'flex';
            }, 3000);
        },
        'danger'
    );
}

// Settings save/reset
function saveSettings() {
    const settings = {
        profile: {
            name: document.getElementById('displayName')?.value,
            email: document.getElementById('emailAddress')?.value,
            phone: document.getElementById('phoneNumber')?.value,
            department: document.getElementById('department')?.value
        },
        notifications: {
            email: document.getElementById('emailNotifications')?.checked,
            sms: document.getElementById('smsNotifications')?.checked,
            push: document.getElementById('pushNotifications')?.checked
        },
        privacy: {
            shareProfile: document.getElementById('shareProfile')?.checked,
            showContact: document.getElementById('showContact')?.checked,
            showActivity: document.getElementById('showActivity')?.checked
        },
        theme: document.querySelector('input[name="theme"]:checked')?.value
    };
    
    localStorage.setItem('userSettings', JSON.stringify(settings));
    showNotification('Settings saved', 'Your preferences have been updated', 'success');
}

function resetSettings() {
    showConfirmDialog(
        'Reset Settings',
        'This will restore all settings to default values. Continue?',
        () => {
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                if (cb.id.includes('notifications') || cb.id === 'showContact') {
                    cb.checked = true;
                } else {
                    cb.checked = false;
                }
            });
            
            document.querySelector('input[value="light"]').checked = true;
            document.getElementById('displayName').value = 'madhuri shewale';
            document.getElementById('emailAddress').value = 'madhu.shewale@campus.edu';
            
            showNotification('Settings reset', 'All settings restored to default', 'info');
        }
    );
}

function discardChanges() {
    showConfirmDialog(
        'Discard Changes',
        'All unsaved changes will be lost. Continue?',
        () => {
            location.reload();
        }
    );
}

// ==============================================
// HELP SECTION FUNCTIONALITY
// ==============================================

// Search functionality
document.getElementById('helpSearch')?.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question span').textContent.toLowerCase();
        if (question.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

// Keyboard shortcut for search
document.addEventListener('keydown', function(e) {
    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        document.getElementById('helpSearch')?.focus();
    }
});

// FAQ toggle
function toggleFAQ(element) {
    element.classList.toggle('active');
    
    const answer = element.querySelector('.faq-answer');
    const icon = element.querySelector('.fa-chevron-down');
    
    if (element.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
    } else {
        answer.style.maxHeight = '0';
        icon.style.transform = 'rotate(0deg)';
    }
}

// Live chat
function startLiveChat() {
    showModal(`
        <div class="modal-content chat-modal">
            <h2>Live Chat Support</h2>
            <div class="chat-messages" id="chatMessages">
                <div class="message support">
                    <div class="message-content">
                        Hello! How can we help you today?
                    </div>
                    <span class="message-time">Just now</span>
                </div>
            </div>
            <div class="chat-input">
                <input type="text" placeholder="Type your message..." id="chatInput">
                <button onclick="sendChatMessage()">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `);
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        const messages = document.getElementById('chatMessages');
        messages.innerHTML += `
            <div class="message user">
                <div class="message-content">${message}</div>
                <span class="message-time">Just now</span>
            </div>
        `;
        input.value = '';
        
        // Simulate response
        setTimeout(() => {
            messages.innerHTML += `
                <div class="message support">
                    <div class="message-content">Thank you for your message. A support agent will be with you shortly.</div>
                    <span class="message-time">Just now</span>
                </div>
            `;
            messages.scrollTop = messages.scrollHeight;
        }, 1000);
    }
}

// Email support
function sendEmail() {
    window.location.href = 'mailto:support@campusconnect.com?subject=Support Request';
}

// Phone support
function callSupport() {
    window.location.href = 'tel:+18005551234';
}

// Schedule call
function scheduleCall() {
    showModal(`
        <div class="modal-content">
            <h2>Schedule a Call</h2>
            <form onsubmit="bookCall(event)">
                <div class="form-group">
                    <label>Select Date</label>
                    <input type="date" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Select Time</label>
                    <select class="form-control" required>
                        <option>9:00 AM - 10:00 AM</option>
                        <option>10:00 AM - 11:00 AM</option>
                        <option>11:00 AM - 12:00 PM</option>
                        <option>1:00 PM - 2:00 PM</option>
                        <option>2:00 PM - 3:00 PM</option>
                        <option>3:00 PM - 4:00 PM</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="tel" class="form-control" placeholder="+1 (555) 123-4567" required>
                </div>
                <div class="form-group">
                    <label>Reason for Call</label>
                    <textarea class="form-control" rows="3" placeholder="Briefly describe your issue..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Schedule Call</button>
            </form>
        </div>
    `);
}

function bookCall(e) {
    e.preventDefault();
    closeModal();
    showNotification('Call scheduled', 'Our team will call you at the selected time', 'success');
}

// ==============================================
// UI UTILITIES
// ==============================================

function showModal(content) {
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()"></div>
        <div class="modal-container">
            <button class="modal-close" onclick="closeModal()">
                <i class="fas fa-times"></i>
            </button>
            ${content}
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeModal() {
    const modal = document.querySelector('.custom-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

function showConfirmDialog(title, message, onConfirm, type = 'default') {
    showModal(`
        <div class="modal-content confirm-dialog">
            <h2>${title}</h2>
            <p>${message}</p>
            <div class="dialog-actions">
                <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button class="btn ${type === 'danger' ? 'btn-danger' : 'btn-primary'}" onclick="confirmAction()">Confirm</button>
            </div>
        </div>
    `);
    
    window.confirmAction = () => {
        closeModal();
        onConfirm();
    };
}

function showNotification(title, message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const id = 'notif_' + Date.now();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.id = id;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <div class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </div>
    `;
    
    container.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => notification.remove(), 5000);
}

// Initialize settings from localStorage
document.addEventListener('DOMContentLoaded', function() {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Apply saved settings
        if (settings.theme) {
            document.querySelector(`input[value="${settings.theme}"]`).checked = true;
            if (settings.theme === 'dark') {
                document.body.classList.add('dark');
            }
        }
        
        // Add auto-save listeners
        document.querySelectorAll('.settings-form input, .settings-form select, .settings-form textarea').forEach(input => {
            input.addEventListener('change', autoSaveSettings);
            input.addEventListener('keyup', autoSaveSettings);
        });
    }
});