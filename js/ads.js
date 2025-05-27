/* ===== FILM DÜNYASı REKLAM SİSTEMİ JS ===== */

// Reklam Yönetim Sistemi
class AdManager {
    constructor() {
        this.isSeriesDetailPage = document.getElementById('series-detail') !== null;
        this.adViewCounts = {};
        this.popupShown = false;
        this.exitIntentShown = false;
        this.nativeAdRotationInterval = null;
        this.seriesDetailAdPositions = [];
        this.init();
        this.setupEventListeners();
        this.startRotation();
    }

    init() {
        console.log('🎬 Film Dünyası Reklam Sistemi Başlatıldı');
        this.hideAdsOnMobile();
        this.setupPopupAd();
        this.trackAdViews();
        this.logCookieStatus();
    }

    // Cookie durumunu konsola yazdır (debug için)
    logCookieStatus() {
        const adBlockerDetected = this.getCookie('adBlockerDetected');
        const popupShown = this.getCookie('popupShownToday');
        const exitIntentShown = this.getCookie('exitIntentShownToday');
        
        console.log('📊 Reklam Durumu:', {
            adBlocker: adBlockerDetected ? 'Tespit Edildi' : 'Tespit Edilmedi',
            popupShown: popupShown ? 'Gösterildi' : 'Gösterilmedi',
            exitIntent: exitIntentShown ? 'Gösterildi' : 'Gösterilmedi',
            seriesDetailPage: this.isSeriesDetailPage ? 'Evet' : 'Hayır'
        });
    }

    // Mobilde sticky reklamı gizle
    hideAdsOnMobile() {
        if (window.innerWidth <= 768) {
            const stickyAds = document.querySelectorAll('.ad-sticky-left, .ad-sticky-right');
            stickyAds.forEach(ad => {
                ad.style.display = 'none';
            });
            console.log('📱 Mobil cihazda sticky reklamlar gizlendi');
        }
    }

    // Popup reklam sistemi
    setupPopupAd() {
        if (!this.hasSeenPopupToday() && !this.isSeriesDetailPage) {
            setTimeout(() => {
                this.showPopupAd();
            }, 30000); // 30 saniye sonra popup göster (series detail hariç)
        } else if (this.isSeriesDetailPage && !this.hasSeenPopupToday()) {
            // Series detail sayfasında daha geç popup göster
            setTimeout(() => {
                this.showPopupAd();
            }, 60000); // 60 saniye sonra
        }
    }

    // Cookie kontrol fonksiyonları
    hasSeenPopupToday() {
        const lastShown = this.getCookie('popupShownToday');
        if (!lastShown) return false;
        
        const today = new Date().toDateString();
        return lastShown === today;
    }

    setCookie(name, value, days = 1) {
        const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/`;
    }

    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    showPopupAd() {
        if (this.popupShown) return;
        
        const overlay = document.createElement('div');
        overlay.className = 'ad-popup-overlay';
        overlay.innerHTML = `
            <div class="ad-popup-content">
                <button class="ad-popup-close" onclick="adManager.closePopup()">&times;</button>
                <div style="text-align: center; padding: 20px;">
                    <h3 style="color: #e50914; margin-bottom: 15px;">🎬 Özel Teklif!</h3>
                    <p style="color: #fff; margin-bottom: 20px;">Premium üyelik ile reklamsız film deneyimi yaşayın!</p>
                    
                    <!-- Google AdSense Popup Reklam -->
                    <ins class="adsbygoogle"
                         style="display:block; width:300px; height:250px;"
                         data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                         data-ad-slot="POPUP-SLOT-ID"></ins>
                    
                    <div style="margin-top: 15px;">
                        <button onclick="adManager.closePopup()" style="background: #e50914; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Kapat</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        overlay.style.display = 'flex';
        
        // AdSense reklamını yükle
        if (window.adsbygoogle) {
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
        
        this.popupShown = true;
        this.setCookie('popupShownToday', new Date().toDateString());
        
        console.log('🎯 Popup reklam gösterildi');
    }

    closePopup() {
        const overlay = document.querySelector('.ad-popup-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Reklam görüntüleme takibi
    trackAdViews() {
        const ads = document.querySelectorAll('.ad-container');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.logAdView(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });

        ads.forEach(ad => {
            observer.observe(ad);
        });
        
        console.log(`👁️ ${ads.length} reklam görüntüleme takibi başlatıldı`);
    }

    logAdView(adElement) {
        const adType = this.getAdType(adElement);
        
        if (!this.adViewCounts[adType]) {
            this.adViewCounts[adType] = 0;
        }
        
        this.adViewCounts[adType]++;
        console.log(`📈 ${adType} reklamı görüntülendi (${this.adViewCounts[adType]}. kez)`);
        
        // Google Analytics veya başka tracking servisi burada çağrılabilir
        if (typeof gtag !== 'undefined') {
            gtag('event', 'ad_view', {
                'ad_type': adType,
                'page_type': this.isSeriesDetailPage ? 'series_detail' : 'other'
            });
        }
    }

    getAdType(element) {
        if (element.classList.contains('ad-header-banner')) return 'header_banner';
        if (element.classList.contains('ad-sidebar')) return 'sidebar';
        if (element.classList.contains('ad-large-banner')) return 'large_banner';
        if (element.classList.contains('ad-content-between')) return 'content_between';
        if (element.classList.contains('ad-native')) return 'native';
        if (element.classList.contains('ad-footer-banner')) return 'footer_banner';
        if (element.classList.contains('ad-sticky-left')) return 'sticky_left';
        if (element.classList.contains('ad-sticky-right')) return 'sticky_right';
        return 'unknown';
    }

    // Reklam rotasyonu
    startRotation() {
        this.rotateNativeAds();
        this.nativeAdRotationInterval = setInterval(() => {
            this.rotateNativeAds();
        }, 30000); // 30 saniyede bir native reklamları değiştir
    }

    rotateNativeAds() {
        const nativeAds = document.querySelectorAll('.ad-native');
        
        const adContents = [
            {
                icon: '🎬',
                title: 'En İyi Film Önerileri',
                description: 'Size özel seçilmiş en popüler filmleri keşfedin. Yeni çıkan yapımları kaçırmayın!'
            },
            {
                icon: '📺',
                title: 'Premium Dizi Koleksiyonu',
                description: 'Dünya\'nın en iyi dizilerini HD kalitede izleyin. Sınırsız erişim için üye olun!'
            },
            {
                icon: '🍿',
                title: 'Sinema Deneyimi',
                description: 'Evinizde sinema kalitesinde film izleme deneyimi. 4K ve Dolby Atmos desteği!'
            },
            {
                icon: '⭐',
                title: 'VIP Üyelik Avantajları',
                description: 'Reklamsız izleme, erken erişim ve özel içerikler. İlk ay ücretsiz deneyin!'
            },
            {
                icon: '🎭',
                title: 'Tiyatro ve Sanat',
                description: 'Dünyaca ünlü tiyatro oyunları ve sanat belgeselleri. Kültür dünyasına yolculuk!'
            }
        ];
        
        nativeAds.forEach((ad, index) => {
            const content = adContents[index % adContents.length];
            const imageEl = ad.querySelector('.ad-native-image');
            const titleEl = ad.querySelector('.ad-native-title');
            const descEl = ad.querySelector('.ad-native-description');
            
            if (imageEl && titleEl && descEl) {
                imageEl.textContent = content.icon;
                titleEl.textContent = content.title;
                descEl.textContent = content.description;
                
                // Smooth transition effect
                ad.style.opacity = '0.7';
                setTimeout(() => {
                    ad.style.opacity = '1';
                }, 300);
            }
        });
        
        console.log('🔄 Native reklamlar güncellendi');
    }

    // Event listeners
    setupEventListeners() {
        // Pencere boyutu değiştiğinde
        window.addEventListener('resize', () => {
            this.hideAdsOnMobile();
        });

        // Sayfa kapatılırken popup göster (exit intent)
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !this.hasSeenExitIntentToday()) {
                this.showExitIntentAd();
            }
        });

        // Reklam tıklama takibi
        document.addEventListener('click', (e) => {
            if (e.target.closest('.ad-container')) {
                this.trackAdClick(e.target.closest('.ad-container'));
            }
        });
    }

    hasSeenExitIntentToday() {
        const lastShown = this.getCookie('exitIntentShownToday');
        if (!lastShown) return false;
        
        const today = new Date().toDateString();
        return lastShown === today;
    }

    showExitIntentAd() {
        if (this.exitIntentShown) return;
        
        const overlay = document.createElement('div');
        overlay.className = 'ad-popup-overlay';
        overlay.innerHTML = `
            <div class="ad-popup-content">
                <button class="ad-popup-close" onclick="adManager.closeExitIntent()">&times;</button>
                <div style="text-align: center; padding: 20px;">
                    <h3 style="color: #e50914; margin-bottom: 15px;">🚪 Gitmeden Önce!</h3>
                    <p style="color: #fff; margin-bottom: 20px;">En iyi film tekliflerini kaçırmayın!</p>
                    
                    <!-- Google AdSense Exit Intent Reklam -->
                    <ins class="adsbygoogle"
                         style="display:block; width:300px; height:250px;"
                         data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                         data-ad-slot="EXIT-INTENT-SLOT-ID"></ins>
                    
                    <div style="margin-top: 15px;">
                        <button onclick="adManager.closeExitIntent()" style="background: #e50914; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Devam Et</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        overlay.style.display = 'flex';
        
        // AdSense reklamını yükle
        if (window.adsbygoogle) {
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
        
        this.exitIntentShown = true;
        this.setCookie('exitIntentShownToday', new Date().toDateString());
        
        console.log('🚪 Exit intent reklam gösterildi');
    }

    closeExitIntent() {
        const overlay = document.querySelector('.ad-popup-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    trackAdClick(adElement) {
        const adType = this.getAdType(adElement);
        console.log(`🖱️ ${adType} reklamına tıklandı`);
        
        // Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'ad_click', {
                'ad_type': adType,
                'page_type': this.isSeriesDetailPage ? 'series_detail' : 'other'
            });
        }
    }

    // AdSense entegrasyonu için hazır fonksiyonlar
    loadAdSense() {
        // Google AdSense script'i zaten head'de yüklü
        // AdSense reklamlarını başlat
        if (window.adsbygoogle) {
            const adsenseElements = document.querySelectorAll('.adsbygoogle');
            adsenseElements.forEach(ad => {
                try {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                } catch (e) {
                    console.warn('AdSense yükleme hatası:', e);
                }
            });
            console.log(`📢 ${adsenseElements.length} AdSense reklamı yüklendi`);
        }
    }

    replaceWithAdSense(containerId, adSlot, adFormat = 'auto') {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                 data-ad-slot="${adSlot}"
                 data-ad-format="${adFormat}"
                 data-full-width-responsive="true"></ins>
        `;
        
        if (window.adsbygoogle) {
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
    }

    // A/B Test için reklam pozisyonları
    runAdPositionTest() {
        console.log('🧪 Reklam pozisyon testi başlatılıyor...');
        
        const testPositions = [
            'header-banner',
            'content-between',
            'sidebar-top',
            'sidebar-middle',
            'sidebar-bottom',
            'footer-banner'
        ];
        
        testPositions.forEach(position => {
            console.log(`📍 Test pozisyonu: ${position}`);
        });
    }

    // Test amaçlı cookie temizleme (console'dan çağırılabilir)
    clearAdCookies() {
        document.cookie = 'popupShownToday=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'exitIntentShownToday=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        console.log('🗑️ Reklam çerezleri temizlendi');
    }

    // Test amaçlı hemen popup göster (console'dan çağırılabilir)
    forceShowPopup() {
        this.popupShown = false;
        this.showPopupAd();
    }

    // Reklam çoğaltma fonksiyonu - Test için (console'dan çağırılabilir)
    multiplyAds(count = 3) {
        console.log(`🔢 Reklamlar ${count} katına çıkarılıyor...`);
        
        const existingAds = document.querySelectorAll('.ad-container:not(.ad-sticky-left):not(.ad-sticky-right)');
        
        existingAds.forEach(ad => {
            for (let i = 1; i < count; i++) {
                const clone = ad.cloneNode(true);
                clone.style.marginTop = '20px';
                ad.parentNode.insertBefore(clone, ad.nextSibling);
            }
        });
        
        console.log(`✅ ${existingAds.length * count} reklam aktif`);
    }

    // Çoğaltılmış reklamları temizle (console'dan çağırılabilir)
    clearMultipliedAds() {
        const allAds = document.querySelectorAll('.ad-container');
        const originalAds = [];
        
        allAds.forEach(ad => {
            if (!originalAds.some(orig => orig.className === ad.className)) {
                originalAds.push(ad);
            } else {
                ad.remove();
            }
        });
        
        console.log('🧹 Çoğaltılmış reklamlar temizlendi');
    }
}

// Sayfa yüklendiğinde reklam sistemini başlat
document.addEventListener('DOMContentLoaded', () => {
    window.adManager = new AdManager();
});

// Lazy loading için intersection observer
function setupLazyAdLoading() {
    const lazyAds = document.querySelectorAll('.ad-container[data-lazy="true"]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadLazyAd(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '100px'
    });
    
    lazyAds.forEach(ad => observer.observe(ad));
}

function loadLazyAd(adElement) {
    const adContent = adElement.querySelector('.ad-content');
    if (adContent && adContent.dataset.adSrc) {
        const img = document.createElement('img');
        img.src = adContent.dataset.adSrc;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        adContent.appendChild(img);
        
        adElement.removeAttribute('data-lazy');
    }
}

// Reklam blocker tespiti
function detectAdBlocker() {
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox';
    testAd.style.position = 'absolute';
    testAd.style.left = '-10000px';
    document.body.appendChild(testAd);
    
    setTimeout(() => {
        if (testAd.offsetHeight === 0) {
            showAdBlockerMessage();
            adManager.setCookie('adBlockerDetected', 'true');
        }
        document.body.removeChild(testAd);
    }, 100);
}

function showAdBlockerMessage() {
    console.log('🚫 AdBlocker tespit edildi');
    
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e50914;
        color: white;
        padding: 15px;
        border-radius: 8px;
        z-index: 10000;
        max-width: 300px;
        font-size: 14px;
    `;
    message.innerHTML = `
        <strong>🎬 Film Dünyası</strong><br>
        Reklam engelleyici tespit edildi. Sitemizi desteklemek için lütfen reklam engelleyiciyi kapatın.
        <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: white; cursor: pointer; margin-left: 10px;">&times;</button>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        if (message.parentElement) {
            message.remove();
        }
    }, 10000);
}

// Sayfa yüklendiğinde AdBlocker kontrolü
window.addEventListener('load', () => {
    detectAdBlocker();
    setupLazyAdLoading();
}); 