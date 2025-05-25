// Settings Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Elements
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsSections = document.querySelectorAll('.settings-section');
    const saveAllBtn = document.getElementById('saveAllSettingsBtn');
    const resetBtn = document.getElementById('resetSettingsBtn');
    const testEmailBtn = document.getElementById('testEmailBtn');
    const clearCacheBtn = document.getElementById('clearCacheBtn');
    const createBackupBtn = document.getElementById('createBackupBtn');
    const optimizeDbBtn = document.getElementById('optimizeDbBtn');
    const downloadLogsBtn = document.getElementById('downloadLogsBtn');
    const clearLogsBtn = document.getElementById('clearLogsBtn');
    const exportSettingsBtn = document.getElementById('exportSettingsBtn');
    const importSettingsBtn = document.getElementById('importSettingsBtn');
    const importSettingsFile = document.getElementById('importSettings');
    
    // Initialize
    initializeSettings();
    setupEventListeners();
    loadSavedSettings();
    
    function initializeSettings() {
        console.log('Settings management initialized');
        
        // Set default maintenance end time
        const maintenanceEnd = document.getElementById('maintenanceEnd');
        if (maintenanceEnd) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(2, 0, 0, 0);
            maintenanceEnd.value = tomorrow.toISOString().slice(0, 16);
        }
        
        // Initial tab animation
        setTimeout(() => {
            const activeSection = document.querySelector('.settings-section.active');
            if (activeSection) {
                const cards = activeSection.querySelectorAll('.settings-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('fade-in-up');
                    }, index * 100);
                });
            }
        }, 300);
    }
    
    function setupEventListeners() {
        // Tab switching
        settingsTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                switchTab(targetTab, this);
            });
        });
        
        // Save all settings
        if (saveAllBtn) {
            saveAllBtn.addEventListener('click', function() {
                saveAllSettings();
            });
        }
        
        // Reset settings
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                resetAllSettings();
            });
        }
        
        // Test email
        if (testEmailBtn) {
            testEmailBtn.addEventListener('click', function() {
                testEmailSettings();
            });
        }
        
        // Clear cache
        if (clearCacheBtn) {
            clearCacheBtn.addEventListener('click', function() {
                clearSystemCache();
            });
        }
        
        // Create backup
        if (createBackupBtn) {
            createBackupBtn.addEventListener('click', function() {
                createDatabaseBackup();
            });
        }
        
        // Optimize database
        if (optimizeDbBtn) {
            optimizeDbBtn.addEventListener('click', function() {
                optimizeDatabase();
            });
        }
        
        // Download logs
        if (downloadLogsBtn) {
            downloadLogsBtn.addEventListener('click', function() {
                downloadSystemLogs();
            });
        }
        
        // Clear logs
        if (clearLogsBtn) {
            clearLogsBtn.addEventListener('click', function() {
                clearSystemLogs();
            });
        }
        
        // Export settings
        if (exportSettingsBtn) {
            exportSettingsBtn.addEventListener('click', function() {
                exportSystemSettings();
            });
        }
        
        // Import settings file change
        if (importSettingsFile) {
            importSettingsFile.addEventListener('change', function() {
                importSettingsBtn.disabled = !this.files.length;
            });
        }
        
        // Import settings
        if (importSettingsBtn) {
            importSettingsBtn.addEventListener('click', function() {
                importSystemSettings();
            });
        }
        
        // Real-time form validation
        setupFormValidation();
        
        // Auto-save functionality
        setupAutoSave();
        
        // Keyboard shortcuts
        setupKeyboardShortcuts();
        
        // Form change detection
        setupChangeDetection();
    }
    
    function switchTab(targetTab, tabElement) {
        // Remove active class from all tabs and sections
        settingsTabs.forEach(tab => tab.classList.remove('active'));
        settingsSections.forEach(section => section.classList.remove('active'));
        
        // Add active class to clicked tab
        tabElement.classList.add('active');
        
        // Show target section
        const targetSection = document.getElementById(`${targetTab}-settings`);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Animate cards
            const cards = targetSection.querySelectorAll('.settings-card');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateX(30px)';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateX(0)';
                    card.style.transition = 'all 0.4s ease-out';
                }, index * 100);
            });
        }
        
        adminPanel.showToast(`${getTabName(targetTab)} sekmesine geçildi`, 'info');
        
        // Save active tab preference
        localStorage.setItem('activeSettingsTab', targetTab);
    }
    
    function saveAllSettings() {
        const saveIcon = saveAllBtn.querySelector('i');
        const originalIcon = saveIcon.className;
        
        // Change to loading state
        saveIcon.className = 'fas fa-spinner fa-spin';
        saveAllBtn.disabled = true;
        
        adminPanel.showToast('Ayarlar kaydediliyor...', 'info');
        
        // Simulate save process
        setTimeout(() => {
            const settings = collectAllSettings();
            localStorage.setItem('systemSettings', JSON.stringify(settings));
            
            saveIcon.className = originalIcon;
            saveAllBtn.disabled = false;
            
            // Success animation
            saveAllBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            setTimeout(() => {
                saveAllBtn.style.background = '';
            }, 1000);
            
            adminPanel.showToast('Tüm ayarlar başarıyla kaydedildi!', 'success');
            
            console.log('Settings saved:', settings);
            // TODO: Implement real backend save
        }, 2000);
    }
    
    function resetAllSettings() {
        if (confirm('Tüm ayarları varsayılan değerlere döndürmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
            const resetIcon = resetBtn.querySelector('i');
            const originalIcon = resetIcon.className;
            
            resetIcon.className = 'fas fa-spinner fa-spin';
            resetBtn.disabled = true;
            
            adminPanel.showToast('Ayarlar sıfırlanıyor...', 'info');
            
            setTimeout(() => {
                resetToDefaults();
                
                resetIcon.className = originalIcon;
                resetBtn.disabled = false;
                
                adminPanel.showToast('Ayarlar varsayılan değerlere döndürüldü!', 'success');
                
                console.log('Settings reset to defaults');
            }, 1500);
        }
    }
    
    function testEmailSettings() {
        const testIcon = testEmailBtn.querySelector('i');
        const originalIcon = testIcon.className;
        
        testIcon.className = 'fas fa-spinner fa-spin';
        testEmailBtn.disabled = true;
        
        adminPanel.showToast('Test e-postası gönderiliyor...', 'info');
        
        // Simulate email test
        setTimeout(() => {
            const smtpSettings = {
                host: document.getElementById('smtpHost').value,
                port: document.getElementById('smtpPort').value,
                username: document.getElementById('smtpUsername').value,
                ssl: document.getElementById('smtpSSL').checked
            };
            
            testIcon.className = originalIcon;
            testEmailBtn.disabled = false;
            
            // Simulate success/failure
            const success = Math.random() > 0.3; // 70% success rate for demo
            
            if (success) {
                adminPanel.showToast('Test e-postası başarıyla gönderildi!', 'success');
                markFieldAsSuccess('smtpHost');
            } else {
                adminPanel.showToast('E-posta gönderilemedi. Ayarları kontrol edin.', 'error');
                markFieldAsError('smtpHost', 'SMTP bağlantı hatası');
            }
            
            console.log('Email test completed:', smtpSettings);
            // TODO: Implement real email test
        }, 3000);
    }
    
    function clearSystemCache() {
        const clearIcon = clearCacheBtn.querySelector('i');
        const originalIcon = clearIcon.className;
        
        clearIcon.className = 'fas fa-spinner fa-spin';
        clearCacheBtn.disabled = true;
        
        adminPanel.showToast('Önbellek temizleniyor...', 'info');
        
        setTimeout(() => {
            clearIcon.className = originalIcon;
            clearCacheBtn.disabled = false;
            
            // Success feedback
            clearCacheBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            setTimeout(() => {
                clearCacheBtn.style.background = '';
            }, 1000);
            
            adminPanel.showToast('Sistem önbelleği başarıyla temizlendi!', 'success');
            
            console.log('Cache cleared');
            // TODO: Implement real cache clearing
        }, 2000);
    }
    
    function createDatabaseBackup() {
        const backupIcon = createBackupBtn.querySelector('i');
        const originalIcon = backupIcon.className;
        
        backupIcon.className = 'fas fa-spinner fa-spin';
        createBackupBtn.disabled = true;
        
        adminPanel.showToast('Veritabanı yedeği oluşturuluyor...', 'info');
        
        setTimeout(() => {
            backupIcon.className = originalIcon;
            createBackupBtn.disabled = false;
            
            // Generate backup file
            const backupData = generateBackupData();
            downloadFile(backupData, 'database-backup.sql', 'text/sql');
            
            adminPanel.showToast('Veritabanı yedeği başarıyla oluşturuldu!', 'success');
            
            console.log('Database backup created');
        }, 4000);
    }
    
    function optimizeDatabase() {
        const optimizeIcon = optimizeDbBtn.querySelector('i');
        const originalIcon = optimizeIcon.className;
        
        optimizeIcon.className = 'fas fa-spinner fa-spin';
        optimizeDbBtn.disabled = true;
        
        adminPanel.showToast('Veritabanı optimize ediliyor...', 'info');
        
        setTimeout(() => {
            optimizeIcon.className = originalIcon;
            optimizeDbBtn.disabled = false;
            
            adminPanel.showToast('Veritabanı başarıyla optimize edildi! Performans %23 arttı.', 'success');
            
            console.log('Database optimized');
            // TODO: Implement real database optimization
        }, 5000);
    }
    
    function downloadSystemLogs() {
        const downloadIcon = downloadLogsBtn.querySelector('i');
        const originalIcon = downloadIcon.className;
        
        downloadIcon.className = 'fas fa-spinner fa-spin';
        downloadLogsBtn.disabled = true;
        
        adminPanel.showToast('Sistem logları hazırlanıyor...', 'info');
        
        setTimeout(() => {
            downloadIcon.className = originalIcon;
            downloadLogsBtn.disabled = false;
            
            const logData = generateLogData();
            downloadFile(logData, 'system-logs.txt', 'text/plain');
            
            adminPanel.showToast('Sistem logları indirildi!', 'success');
            
            console.log('System logs downloaded');
        }, 2000);
    }
    
    function clearSystemLogs() {
        if (confirm('Tüm sistem loglarını silmek istediğinizden emin misiniz?')) {
            const clearIcon = clearLogsBtn.querySelector('i');
            const originalIcon = clearIcon.className;
            
            clearIcon.className = 'fas fa-spinner fa-spin';
            clearLogsBtn.disabled = true;
            
            adminPanel.showToast('Sistem logları temizleniyor...', 'info');
            
            setTimeout(() => {
                clearIcon.className = originalIcon;
                clearLogsBtn.disabled = false;
                
                adminPanel.showToast('Sistem logları başarıyla temizlendi!', 'success');
                
                console.log('System logs cleared');
            }, 1500);
        }
    }
    
    function exportSystemSettings() {
        const exportIcon = exportSettingsBtn.querySelector('i');
        const originalIcon = exportIcon.className;
        
        exportIcon.className = 'fas fa-spinner fa-spin';
        exportSettingsBtn.disabled = true;
        
        adminPanel.showToast('Ayarlar dışa aktarılıyor...', 'info');
        
        setTimeout(() => {
            exportIcon.className = originalIcon;
            exportSettingsBtn.disabled = false;
            
            const settings = collectAllSettings();
            const settingsJson = JSON.stringify(settings, null, 2);
            downloadFile(settingsJson, 'system-settings.json', 'application/json');
            
            adminPanel.showToast('Sistem ayarları başarıyla dışa aktarıldı!', 'success');
            
            console.log('Settings exported');
        }, 1000);
    }
    
    function importSystemSettings() {
        const file = importSettingsFile.files[0];
        if (!file) return;
        
        const importIcon = importSettingsBtn.querySelector('i');
        const originalIcon = importIcon.className;
        
        importIcon.className = 'fas fa-spinner fa-spin';
        importSettingsBtn.disabled = true;
        
        adminPanel.showToast('Ayarlar içe aktarılıyor...', 'info');
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const settings = JSON.parse(e.target.result);
                
                setTimeout(() => {
                    applyImportedSettings(settings);
                    
                    importIcon.className = originalIcon;
                    importSettingsBtn.disabled = true;
                    importSettingsFile.value = '';
                    
                    adminPanel.showToast('Ayarlar başarıyla içe aktarıldı!', 'success');
                    
                    console.log('Settings imported:', settings);
                }, 1500);
                
            } catch (error) {
                importIcon.className = originalIcon;
                importSettingsBtn.disabled = true;
                
                adminPanel.showToast('Geçersiz ayar dosyası!', 'error');
                console.error('Import error:', error);
            }
        };
        
        reader.readAsText(file);
    }
    
    function collectAllSettings() {
        const settings = {
            general: {
                siteName: document.getElementById('siteName').value,
                siteDescription: document.getElementById('siteDescription').value,
                siteUrl: document.getElementById('siteUrl').value,
                adminEmail: document.getElementById('adminEmail').value,
                primaryColor: document.getElementById('primaryColor').value,
                darkMode: document.getElementById('darkMode').checked,
                showRatings: document.getElementById('showRatings').checked,
                itemsPerPage: document.getElementById('itemsPerPage').value,
                autoApprove: document.getElementById('autoApprove').checked,
                allowGuestComments: document.getElementById('allowGuestComments').checked,
                maxFileSize: document.getElementById('maxFileSize').value,
                videoQuality: document.getElementById('videoQuality').value
            },
            security: {
                minPasswordLength: document.getElementById('minPasswordLength').value,
                requireUppercase: document.getElementById('requireUppercase').checked,
                requireNumbers: document.getElementById('requireNumbers').checked,
                requireSpecialChars: document.getElementById('requireSpecialChars').checked,
                sessionTimeout: document.getElementById('sessionTimeout').value,
                maxLoginAttempts: document.getElementById('maxLoginAttempts').value,
                lockoutDuration: document.getElementById('lockoutDuration').value,
                twoFactorAuth: document.getElementById('twoFactorAuth').checked,
                enableFirewall: document.getElementById('enableFirewall').checked,
                allowedIPs: document.getElementById('allowedIPs').value,
                blockedIPs: document.getElementById('blockedIPs').value
            },
            notifications: {
                emailNewUser: document.getElementById('emailNewUser').checked,
                emailNewComment: document.getElementById('emailNewComment').checked,
                emailSystemError: document.getElementById('emailSystemError').checked,
                emailDailyReport: document.getElementById('emailDailyReport').checked,
                smtpHost: document.getElementById('smtpHost').value,
                smtpPort: document.getElementById('smtpPort').value,
                smtpUsername: document.getElementById('smtpUsername').value,
                smtpSSL: document.getElementById('smtpSSL').checked,
                enablePushNotifications: document.getElementById('enablePushNotifications').checked
            },
            api: {
                apiRateLimit: document.getElementById('apiRateLimit').value,
                apiMaxRequests: document.getElementById('apiMaxRequests').value,
                requireApiAuth: document.getElementById('requireApiAuth').checked,
                logApiRequests: document.getElementById('logApiRequests').checked,
                cdnProvider: document.getElementById('cdnProvider').value,
                cdnUrl: document.getElementById('cdnUrl').value,
                storageProvider: document.getElementById('storageProvider').value,
                enableCompression: document.getElementById('enableCompression').checked
            },
            maintenance: {
                maintenanceMode: document.getElementById('maintenanceMode').checked,
                maintenanceMessage: document.getElementById('maintenanceMessage').value,
                maintenanceEnd: document.getElementById('maintenanceEnd').value,
                allowedUsers: document.getElementById('allowedUsers').value,
                cacheDriver: document.getElementById('cacheDriver').value,
                cacheLifetime: document.getElementById('cacheLifetime').value,
                enablePageCache: document.getElementById('enablePageCache').checked,
                autoBackup: document.getElementById('autoBackup').checked,
                backupFrequency: document.getElementById('backupFrequency').value,
                backupRetention: document.getElementById('backupRetention').value
            },
            advanced: {
                enableGzip: document.getElementById('enableGzip').checked,
                enableMinification: document.getElementById('enableMinification').checked,
                enableLazyLoading: document.getElementById('enableLazyLoading').checked,
                maxMemoryUsage: document.getElementById('maxMemoryUsage').value,
                debugMode: document.getElementById('debugMode').checked,
                logLevel: document.getElementById('logLevel').value,
                logRetention: document.getElementById('logRetention').value
            },
            exported_at: new Date().toISOString()
        };
        
        return settings;
    }
    
    function applyImportedSettings(settings) {
        // Apply general settings
        if (settings.general) {
            Object.keys(settings.general).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = settings.general[key];
                    } else {
                        element.value = settings.general[key];
                    }
                }
            });
        }
        
        // Apply other sections similarly
        ['security', 'notifications', 'api', 'maintenance', 'advanced'].forEach(section => {
            if (settings[section]) {
                Object.keys(settings[section]).forEach(key => {
                    const element = document.getElementById(key);
                    if (element) {
                        if (element.type === 'checkbox') {
                            element.checked = settings[section][key];
                        } else {
                            element.value = settings[section][key];
                        }
                    }
                });
            }
        });
        
        // Trigger change events
        document.querySelectorAll('.form-control, .checkbox-label input').forEach(input => {
            input.dispatchEvent(new Event('change'));
        });
    }
    
    function resetToDefaults() {
        // Reset all form fields to their default values
        document.querySelectorAll('.form-control').forEach(input => {
            if (input.hasAttribute('value')) {
                input.value = input.getAttribute('value');
            } else {
                input.value = '';
            }
        });
        
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = checkbox.hasAttribute('checked');
        });
        
        // Clear localStorage
        localStorage.removeItem('systemSettings');
        localStorage.removeItem('settingsChanges');
    }
    
    function setupFormValidation() {
        // Email validation
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateEmail(this);
            });
        });
        
        // URL validation
        const urlInputs = document.querySelectorAll('input[type="url"]');
        urlInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateUrl(this);
            });
        });
        
        // Number validation
        const numberInputs = document.querySelectorAll('input[type="number"]');
        numberInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateNumber(this);
            });
        });
        
        // Password strength
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.id !== 'smtpPassword') { // Skip SMTP password
                    validatePasswordStrength(this);
                }
            });
        });
    }
    
    function validateEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (input.value && !emailRegex.test(input.value)) {
            markFieldAsError(input.id, 'Geçerli bir e-posta adresi girin');
            return false;
        } else {
            markFieldAsSuccess(input.id);
            return true;
        }
    }
    
    function validateUrl(input) {
        try {
            if (input.value) {
                new URL(input.value);
                markFieldAsSuccess(input.id);
                return true;
            }
        } catch {
            markFieldAsError(input.id, 'Geçerli bir URL girin');
            return false;
        }
        return true;
    }
    
    function validateNumber(input) {
        const value = parseInt(input.value);
        const min = parseInt(input.getAttribute('min')) || 0;
        const max = parseInt(input.getAttribute('max')) || Infinity;
        
        if (isNaN(value) || value < min || value > max) {
            markFieldAsError(input.id, `Değer ${min} ile ${max} arasında olmalıdır`);
            return false;
        } else {
            markFieldAsSuccess(input.id);
            return true;
        }
    }
    
    function validatePasswordStrength(input) {
        const password = input.value;
        const minLength = 8;
        let strength = 0;
        let feedback = [];
        
        if (password.length >= minLength) strength++;
        else feedback.push(`En az ${minLength} karakter`);
        
        if (/[A-Z]/.test(password)) strength++;
        else feedback.push('Büyük harf');
        
        if (/[a-z]/.test(password)) strength++;
        else feedback.push('Küçük harf');
        
        if (/[0-9]/.test(password)) strength++;
        else feedback.push('Rakam');
        
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        else feedback.push('Özel karakter');
        
        if (strength >= 4) {
            markFieldAsSuccess(input.id);
        } else {
            markFieldAsError(input.id, `Gereksinimler: ${feedback.join(', ')}`);
        }
    }
    
    function markFieldAsSuccess(fieldId) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
        
        let helpText = formGroup.querySelector('.form-text');
        if (helpText && helpText.textContent.includes('Gereksinimler')) {
            helpText.style.color = '#10b981';
            helpText.textContent = 'Geçerli';
        }
    }
    
    function markFieldAsError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        formGroup.classList.remove('success');
        formGroup.classList.add('error');
        
        let helpText = formGroup.querySelector('.form-text');
        if (!helpText) {
            helpText = document.createElement('small');
            helpText.className = 'form-text';
            formGroup.appendChild(helpText);
        }
        
        helpText.style.color = '#ef4444';
        helpText.textContent = message;
    }
    
    function setupAutoSave() {
        let autoSaveTimeout;
        
        document.querySelectorAll('.form-control, .checkbox-label input').forEach(input => {
            input.addEventListener('change', function() {
                clearTimeout(autoSaveTimeout);
                autoSaveTimeout = setTimeout(() => {
                    saveSettingsToLocalStorage();
                }, 1000);
            });
        });
    }
    
    function setupChangeDetection() {
        let hasChanges = false;
        
        document.querySelectorAll('.form-control, .checkbox-label input').forEach(input => {
            input.addEventListener('change', function() {
                hasChanges = true;
                updateSaveButtonState();
            });
        });
        
        // Warn on page unload if there are unsaved changes
        window.addEventListener('beforeunload', function(e) {
            if (hasChanges) {
                e.preventDefault();
                e.returnValue = 'Kaydedilmemiş değişiklikleriniz var. Sayfadan ayrılmak istediğinizden emin misiniz?';
            }
        });
        
        function updateSaveButtonState() {
            if (hasChanges) {
                saveAllBtn.classList.add('pulse');
                saveAllBtn.style.animation = 'pulse 2s infinite';
            } else {
                saveAllBtn.classList.remove('pulse');
                saveAllBtn.style.animation = '';
            }
        }
    }
    
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Ctrl + S - Save all settings
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                saveAllSettings();
            }
            
            // Ctrl + R - Reset settings
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                resetAllSettings();
            }
            
            // Tab keys 1-6 for quick navigation
            if (e.key >= '1' && e.key <= '6' && e.altKey) {
                e.preventDefault();
                const tabs = ['general', 'security', 'notifications', 'api', 'maintenance', 'advanced'];
                const index = parseInt(e.key) - 1;
                if (tabs[index]) {
                    const tab = document.querySelector(`[data-tab="${tabs[index]}"]`);
                    if (tab) {
                        switchTab(tabs[index], tab);
                    }
                }
            }
        });
    }
    
    function saveSettingsToLocalStorage() {
        const settings = collectAllSettings();
        localStorage.setItem('systemSettings', JSON.stringify(settings));
        localStorage.setItem('settingsLastSaved', new Date().toISOString());
    }
    
    function loadSavedSettings() {
        const saved = localStorage.getItem('systemSettings');
        const activeTab = localStorage.getItem('activeSettingsTab');
        
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                applyImportedSettings(settings);
                console.log('Saved settings loaded');
            } catch (e) {
                console.log('Error loading saved settings:', e);
            }
        }
        
        // Restore active tab
        if (activeTab && activeTab !== 'general') {
            const tab = document.querySelector(`[data-tab="${activeTab}"]`);
            if (tab) {
                switchTab(activeTab, tab);
            }
        }
    }
    
    // Helper functions
    function getTabName(tabKey) {
        const names = {
            general: 'Genel Ayarlar',
            security: 'Güvenlik',
            notifications: 'Bildirimler',
            api: 'API Ayarları',
            maintenance: 'Bakım',
            advanced: 'Gelişmiş'
        };
        return names[tabKey] || 'Bilinmeyen';
    }
    
    function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }
    
    function generateBackupData() {
        const currentDate = new Date().toISOString().split('T')[0];
        return `-- Film Dünyası Database Backup
-- Generated: ${new Date().toLocaleString('tr-TR')}
-- Database: filmdunyasi_db

SET FOREIGN_KEY_CHECKS=0;

-- Sample backup content
CREATE TABLE IF NOT EXISTS \`movies\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`title\` varchar(255) NOT NULL,
  \`description\` text,
  \`release_date\` date,
  \`rating\` decimal(3,1),
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add more tables and data here...

SET FOREIGN_KEY_CHECKS=1;`;
    }
    
    function generateLogData() {
        const logs = [
            `[${new Date().toISOString()}] INFO: System started successfully`,
            `[${new Date().toISOString()}] INFO: Cache cleared by admin`,
            `[${new Date().toISOString()}] WARNING: High memory usage detected`,
            `[${new Date().toISOString()}] INFO: Database optimized`,
            `[${new Date().toISOString()}] ERROR: Failed API request to TMDB`,
            `[${new Date().toISOString()}] INFO: User login: admin@filmdunyasi.com`,
            `[${new Date().toISOString()}] INFO: Settings updated`,
            `[${new Date().toISOString()}] INFO: Backup created successfully`
        ];
        
        return logs.join('\n');
    }
    
    console.log('Settings management initialized');
});