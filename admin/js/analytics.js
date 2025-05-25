// Analytics Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Elements
    const dateRangeFilter = document.getElementById('dateRangeFilter');
    const metricTypeFilter = document.getElementById('metricTypeFilter');
    const comparisonFilter = document.getElementById('comparisonFilter');
    const refreshDataBtn = document.getElementById('refreshDataBtn');
    const exportReportBtn = document.getElementById('exportReportBtn');
    const chartBtns = document.querySelectorAll('.chart-btn');
    const statCards = document.querySelectorAll('.stat-card');
    const categoryBars = document.querySelectorAll('.category-fill');
    
    // Initialize
    initializeAnalytics();
    setupEventListeners();
    animateCharts();
    
    function initializeAnalytics() {
        console.log('Analytics dashboard initialized');
        
        // Load saved filter preferences
        loadFilterPreferences();
        
        // Animate stat cards on load
        setTimeout(() => {
            statCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-in-up');
                }, index * 100);
            });
        }, 300);
        
        // Animate category bars
        setTimeout(() => {
            categoryBars.forEach((bar, index) => {
                setTimeout(() => {
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                }, index * 150);
            });
        }, 800);
    }
    
    function setupEventListeners() {
        // Date range filter
        if (dateRangeFilter) {
            dateRangeFilter.addEventListener('change', function() {
                handleDateRangeChange(this.value);
                saveFilterPreferences();
            });
        }
        
        // Metric type filter
        if (metricTypeFilter) {
            metricTypeFilter.addEventListener('change', function() {
                handleMetricTypeChange(this.value);
                saveFilterPreferences();
            });
        }
        
        // Comparison filter
        if (comparisonFilter) {
            comparisonFilter.addEventListener('change', function() {
                handleComparisonChange(this.value);
                saveFilterPreferences();
            });
        }
        
        // Refresh data button
        if (refreshDataBtn) {
            refreshDataBtn.addEventListener('click', function() {
                refreshAnalyticsData();
            });
        }
        
        // Export report button
        if (exportReportBtn) {
            exportReportBtn.addEventListener('click', function() {
                exportAnalyticsReport();
            });
        }
        
        // Chart period buttons
        chartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const period = this.getAttribute('data-period');
                handleChartPeriodChange(period, this);
            });
        });
        
        // Keyboard shortcuts
        setupKeyboardShortcuts();
    }
    
    function handleDateRangeChange(value) {
        adminPanel.showToast(`Tarih aralığı değiştirildi: ${getDateRangeLabel(value)}`, 'info');
        
        // Update all metrics based on new date range
        updateMetrics(value);
        updateCharts(value);
        updateActivities(value);
        
        console.log('Date range changed:', value);
        // TODO: Implement backend data fetching
    }
    
    function handleMetricTypeChange(value) {
        const label = getMetricTypeLabel(value);
        adminPanel.showToast(`Metrik türü değiştirildi: ${label}`, 'info');
        
        // Show/hide relevant sections
        filterMetricSections(value);
        
        console.log('Metric type changed:', value);
        // TODO: Implement metric filtering
    }
    
    function handleComparisonChange(value) {
        const label = getComparisonLabel(value);
        adminPanel.showToast(`Karşılaştırma modu: ${label}`, 'info');
        
        // Update comparison indicators
        updateComparisonIndicators(value);
        
        console.log('Comparison changed:', value);
        // TODO: Implement comparison data
    }
    
    function handleChartPeriodChange(period, button) {
        // Remove active class from all chart buttons
        button.parentNode.querySelectorAll('.chart-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
        
        adminPanel.showToast(`Grafik dönemi: ${period} gün`, 'info');
        
        // Update chart data
        updateChartData(period);
        
        console.log('Chart period changed:', period);
        // TODO: Implement chart data update
    }
    
    function refreshAnalyticsData() {
        const refreshIcon = refreshDataBtn.querySelector('i');
        
        // Add spinning animation
        refreshIcon.classList.add('fa-spin');
        refreshDataBtn.disabled = true;
        
        adminPanel.showToast('Veriler yenileniyor...', 'info');
        
        // Simulate data refresh
        setTimeout(() => {
            refreshIcon.classList.remove('fa-spin');
            refreshDataBtn.disabled = false;
            
            // Re-animate charts and stats
            animateCharts();
            animateStats();
            
            adminPanel.showToast('Veriler başarıyla yenilendi!', 'success');
            console.log('Analytics data refreshed');
            // TODO: Implement real data refresh
        }, 2000);
    }
    
    function exportAnalyticsReport() {
        const exportIcon = exportReportBtn.querySelector('i');
        const originalIcon = exportIcon.className;
        
        // Change icon to loading
        exportIcon.className = 'fas fa-spinner fa-spin';
        exportReportBtn.disabled = true;
        
        adminPanel.showToast('Rapor hazırlanıyor...', 'info');
        
        // Simulate report generation
        setTimeout(() => {
            exportIcon.className = originalIcon;
            exportReportBtn.disabled = false;
            
            // Create and download a dummy report
            generateDummyReport();
            
            adminPanel.showToast('Rapor başarıyla indirildi!', 'success');
            console.log('Report exported');
            // TODO: Implement real report generation
        }, 3000);
    }
    
    function generateDummyReport() {
        const reportData = generateReportData();
        const csv = convertToCSV(reportData);
        downloadCSV(csv, 'analytics-report.csv');
    }
    
    function generateReportData() {
        const currentDate = new Date();
        const dateRange = dateRangeFilter.value || 'month';
        
        return {
            generated_at: currentDate.toISOString(),
            date_range: dateRange,
            metrics: {
                total_views: '1,247,862',
                active_users: '34,672',
                avg_watch_time: '89dk',
                engagement_rate: '73.2%'
            },
            top_categories: [
                { name: 'Aksiyon', percentage: '28.5%' },
                { name: 'Komedi', percentage: '22.1%' },
                { name: 'Dram', percentage: '18.7%' },
                { name: 'Bilim Kurgu', percentage: '15.3%' },
                { name: 'Romantik', percentage: '12.8%' }
            ],
            top_content: [
                { rank: 1, title: 'Breaking Bad', views: '47.2K', type: 'Dizi' },
                { rank: 2, title: 'Inception', views: '39.8K', type: 'Film' },
                { rank: 3, title: 'Stranger Things', views: '35.6K', type: 'Dizi' },
                { rank: 4, title: 'The Matrix', views: '32.1K', type: 'Film' },
                { rank: 5, title: 'Game of Thrones', views: '28.9K', type: 'Dizi' }
            ]
        };
    }
    
    function convertToCSV(data) {
        let csv = 'Film Dünyası - Analytics Raporu\n';
        csv += `Oluşturulma Tarihi: ${new Date(data.generated_at).toLocaleString('tr-TR')}\n`;
        csv += `Tarih Aralığı: ${getDateRangeLabel(data.date_range)}\n\n`;
        
        csv += 'GENEL METRİKLER\n';
        csv += 'Metrik,Değer\n';
        csv += `Toplam Görüntülenme,${data.metrics.total_views}\n`;
        csv += `Aktif Kullanıcı,${data.metrics.active_users}\n`;
        csv += `Ortalama İzleme Süresi,${data.metrics.avg_watch_time}\n`;
        csv += `Etkileşim Oranı,${data.metrics.engagement_rate}\n\n`;
        
        csv += 'POPÜLER KATEGORİLER\n';
        csv += 'Kategori,Yüzde\n';
        data.top_categories.forEach(cat => {
            csv += `${cat.name},${cat.percentage}\n`;
        });
        csv += '\n';
        
        csv += 'EN ÇOK İZLENEN İÇERİKLER\n';
        csv += 'Sıra,Başlık,Görüntülenme,Tür\n';
        data.top_content.forEach(content => {
            csv += `${content.rank},${content.title},${content.views},${content.type}\n`;
        });
        
        return csv;
    }
    
    function downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    
    function animateCharts() {
        // Re-animate category bars
        categoryBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 50);
            }, index * 100);
        });
        
        // Animate sample data points
        const dataPoints = document.querySelectorAll('.data-point');
        dataPoints.forEach((point, index) => {
            setTimeout(() => {
                point.style.transform = 'scale(0)';
                setTimeout(() => {
                    point.style.transform = 'scale(1)';
                }, 50);
            }, index * 100);
        });
    }
    
    function animateStats() {
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 100);
            }, index * 50);
        });
    }
    
    function updateMetrics(dateRange) {
        // Update stat numbers based on date range
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            // Add a subtle animation while updating
            stat.style.opacity = '0.6';
            setTimeout(() => {
                stat.style.opacity = '1';
            }, 300);
        });
    }
    
    function updateCharts(dateRange) {
        // Update chart displays
        const chartContainers = document.querySelectorAll('.chart-container');
        
        chartContainers.forEach(container => {
            container.style.opacity = '0.7';
            setTimeout(() => {
                container.style.opacity = '1';
            }, 500);
        });
    }
    
    function updateActivities(dateRange) {
        // Update activities list
        const activities = document.querySelectorAll('.activity-item');
        
        activities.forEach((activity, index) => {
            setTimeout(() => {
                activity.style.transform = 'translateX(-10px)';
                activity.style.opacity = '0.7';
                setTimeout(() => {
                    activity.style.transform = 'translateX(0)';
                    activity.style.opacity = '1';
                }, 200);
            }, index * 100);
        });
    }
    
    function filterMetricSections(metricType) {
        const sections = {
            all: ['.analytics-overview', '.analytics-charts', '.performance-metrics', '.analytics-activities'],
            content: ['.analytics-overview', '.analytics-charts'],
            users: ['.analytics-overview', '.performance-metrics'],
            engagement: ['.analytics-charts', '.analytics-activities'],
            revenue: ['.analytics-overview', '.performance-metrics']
        };
        
        // Hide all sections first
        const allSections = document.querySelectorAll('.analytics-overview, .analytics-charts, .performance-metrics, .analytics-activities');
        allSections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Show relevant sections
        const sectionsToShow = sections[metricType] || sections.all;
        sectionsToShow.forEach(selector => {
            const section = document.querySelector(selector);
            if (section) {
                section.style.display = 'block';
            }
        });
    }
    
    function updateComparisonIndicators(comparison) {
        const statChanges = document.querySelectorAll('.stat-change');
        
        statChanges.forEach(change => {
            // Update comparison text based on type
            const text = change.textContent;
            if (comparison === 'previous') {
                change.textContent = text.replace(/\(.*?\)/, '(önceki döneme göre)');
            } else if (comparison === 'year_ago') {
                change.textContent = text.replace(/\(.*?\)/, '(geçen yıla göre)');
            } else if (comparison === 'industry') {
                change.textContent = text.replace(/\(.*?\)/, '(sektör ortalaması)');
            } else {
                // Reset to original
                change.textContent = text.replace(/\(.*?\)/, '(önceki aya göre)');
            }
        });
    }
    
    function updateChartData(period) {
        // Simulate chart data update
        const dataPoints = document.querySelectorAll('.data-point');
        
        // Generate random data based on period
        const ranges = {
            '7': { min: 20, max: 35 },
            '30': { min: 25, max: 50 },
            '90': { min: 30, max: 60 }
        };
        
        const range = ranges[period] || ranges['30'];
        
        dataPoints.forEach(point => {
            const randomValue = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
            point.textContent = `${randomValue}K`;
            point.style.height = `${randomValue}px`;
        });
    }
    
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Ctrl + R - Refresh data
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                refreshAnalyticsData();
            }
            
            // Ctrl + E - Export report
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                exportAnalyticsReport();
            }
            
            // Number keys for quick date range selection
            if (e.key >= '1' && e.key <= '5' && !e.ctrlKey && !e.altKey) {
                e.preventDefault();
                const dateRanges = ['today', 'week', 'month', 'quarter', 'year'];
                const index = parseInt(e.key) - 1;
                if (dateRangeFilter && dateRanges[index]) {
                    dateRangeFilter.value = dateRanges[index];
                    handleDateRangeChange(dateRanges[index]);
                }
            }
        });
    }
    
    function saveFilterPreferences() {
        const preferences = {
            dateRange: dateRangeFilter?.value,
            metricType: metricTypeFilter?.value,
            comparison: comparisonFilter?.value
        };
        
        localStorage.setItem('analyticsFilters', JSON.stringify(preferences));
    }
    
    function loadFilterPreferences() {
        const saved = localStorage.getItem('analyticsFilters');
        if (saved) {
            try {
                const preferences = JSON.parse(saved);
                
                if (dateRangeFilter && preferences.dateRange) {
                    dateRangeFilter.value = preferences.dateRange;
                }
                
                if (metricTypeFilter && preferences.metricType) {
                    metricTypeFilter.value = preferences.metricType;
                    filterMetricSections(preferences.metricType);
                }
                
                if (comparisonFilter && preferences.comparison) {
                    comparisonFilter.value = preferences.comparison;
                    updateComparisonIndicators(preferences.comparison);
                }
            } catch (e) {
                console.log('Error loading filter preferences:', e);
            }
        }
    }
    
    // Helper functions
    function getDateRangeLabel(value) {
        const labels = {
            today: 'Bugün',
            week: 'Bu Hafta',
            month: 'Bu Ay',
            quarter: 'Bu Çeyrek',
            year: 'Bu Yıl',
            custom: 'Özel Tarih'
        };
        return labels[value] || 'Bilinmeyen';
    }
    
    function getMetricTypeLabel(value) {
        const labels = {
            all: 'Tüm Metrikler',
            content: 'İçerik Performansı',
            users: 'Kullanıcı Aktivitesi',
            engagement: 'Etkileşim Metrikleri',
            revenue: 'Gelir Analizi'
        };
        return labels[value] || 'Bilinmeyen';
    }
    
    function getComparisonLabel(value) {
        const labels = {
            none: 'Karşılaştırma Yok',
            previous: 'Önceki Dönem',
            year_ago: 'Geçen Yıl',
            industry: 'Sektör Ortalaması'
        };
        return labels[value] || 'Bilinmeyen';
    }
    
    // Auto-refresh data every 5 minutes
    setInterval(() => {
        if (document.visibilityState === 'visible') {
            refreshAnalyticsData();
        }
    }, 5 * 60 * 1000);
    
    console.log('Analytics management initialized');
}); 