/* ===== FILM DÜNYASı REKLAM SİSTEMİ JS ===== */

// Reklam Yönetim Sistemi
class AdManager {
    constructor() {
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
        const popupCookie = this.getCookie('filmdunyasi_popup_shown');
        const exitCookie = this.getCookie('filmdunyasi_exit_intent_shown');
        
        console.log('🍪 Cookie Durumu:');
        console.log(`   Popup: ${popupCookie ? 'Bugün gösterildi' : 'Henüz gösterilmedi'}`);
        console.log(`   Exit Intent: ${exitCookie ? 'Bugün gösterildi' : 'Henüz gösterilmedi'}`);
        
        if (popupCookie) {
            const date = new Date(parseInt(popupCookie));
            console.log(`   Son popup: ${date.toLocaleString('tr-TR')}`);
        }
    }

    // Mobilde sticky reklamı gizle
    hideAdsOnMobile() {
        if (window.innerWidth <= 1024) {
            const stickyAd = document.querySelector('.ad-sticky-right');
            if (stickyAd) {
                stickyAd.style.display = 'none';
            }
        }
    }

    // Popup reklam sistemi
    setupPopupAd() {
        // Cookie kontrolü - günde bir kez göster
        if (!this.hasSeenPopupToday()) {
            // 30 saniye sonra popup göster
            setTimeout(() => {
                this.showPopupAd();
            }, 30000);
        }
    }

    // Cookie kontrol fonksiyonları
    hasSeenPopupToday() {
        const lastShown = this.getCookie('filmdunyasi_popup_shown');
        if (!lastShown) return false;
        
        const lastShownDate = new Date(parseInt(lastShown));
        const today = new Date();
        
        // Aynı gün mü kontrol et
        return lastShownDate.toDateString() === today.toDateString();
    }

    setCookie(name, value, days = 1) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    showPopupAd() {
        // Cookie'ye bugünün tarihini kaydet
        this.setCookie('filmdunyasi_popup_shown', Date.now().toString(), 1);
        
        // Popup HTML'i oluştur
        const popupHTML = `
            <div class="ad-popup-overlay" id="adPopup">
                <div class="ad-popup-content">
                    <button class="ad-popup-close" onclick="adManager.closePopup()">&times;</button>
                    <div style="text-align: center; padding: 20px;">
                        <h3 style="color: #e50914; margin-bottom: 15px;">🎰 Özel Fırsat!</h3>
                        <p style="color: #ccc; margin-bottom: 20px;">
                            Güvenilir bahis sitesinde %100 hoşgeldin bonusu!
                        </p>
                        <button style="background: #e50914; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: bold;">
                            Hemen Katıl
                        </button>
                        <p style="color: #666; font-size: 11px; margin-top: 15px;">
                            Bu mesaj günde sadece bir kez gösterilir
                        </p>
                    </div>
                </div>
            </div>
        `;

        // Popup'ı sayfaya ekle
        document.body.insertAdjacentHTML('beforeend', popupHTML);
        
        // Popup'ı göster
        const popup = document.getElementById('adPopup');
        popup.style.display = 'flex';

        // 15 saniye sonra otomatik kapat (biraz daha uzun süre)
        setTimeout(() => {
            this.closePopup();
        }, 15000);
        
        console.log('🎯 Popup reklam gösterildi - Bir sonraki gösterim: Yarın');
    }

    closePopup() {
        const popup = document.getElementById('adPopup');
        if (popup) {
            popup.style.display = 'none';
            popup.remove();
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
            threshold: 0.5 // %50 görünür olduğunda say
        });

        ads.forEach(ad => {
            observer.observe(ad);
        });
    }

    logAdView(adElement) {
        const adType = this.getAdType(adElement);
        console.log(`📊 Reklam Görüntülendi: ${adType}`);
        
        // Burada gerçek projede analytics servisine gönderebilirsiniz
        // Google Analytics, Facebook Pixel vb.
    }

    getAdType(element) {
        if (element.classList.contains('ad-header-banner')) return 'Header Banner';
        if (element.classList.contains('ad-large-banner')) return 'Large Banner';
        if (element.classList.contains('ad-sidebar')) return 'Sidebar';
        if (element.classList.contains('ad-content-between')) return 'Content Between';
        if (element.classList.contains('ad-native')) return 'Native Ad';
        if (element.classList.contains('ad-footer-banner')) return 'Footer Banner';
        if (element.classList.contains('ad-sticky-right')) return 'Sticky Right';
        return 'Unknown';
    }

    // Reklam rotasyonu
    startRotation() {
        // Native reklamları her 60 saniyede bir değiştir
        setInterval(() => {
            this.rotateNativeAds();
        }, 60000);
    }

    rotateNativeAds() {
        const nativeAds = [
            {
                icon: '🎮',
                title: 'En İyi Oyun Deneyimi',
                description: 'Yeni nesil oyunlar ve en güncel haberler için bizi takip edin. Özel indirimler ve kampanyalardan ilk siz haberdar olun!'
            },
            {
                icon: '💰',
                title: 'Güvenli Bahis Deneyimi',
                description: 'Lisanslı bahis sitesinde güvenle oynayın. Yüksek oranlar, canlı bahis ve anında para çekme imkanı!'
            },
            {
                icon: '🛒',
                title: 'Online Alışveriş',
                description: 'En uygun fiyatlarla teknoloji ürünleri. Ücretsiz kargo ve hızlı teslimat avantajı!'
            },
            {
                icon: '📱',
                title: 'Mobil Uygulama',
                description: 'Film Dünyası mobil uygulamasını indirin. Offline izleme ve özel içerikler!'
            },
            {
                icon: '🎬',
                title: 'Premium Üyelik',
                description: 'Reklamsız izleme, 4K kalite ve erken erişim için premium üye olun!'
            }
        ];

        const nativeAdElements = document.querySelectorAll('.ad-native');
        
        nativeAdElements.forEach((adElement, index) => {
            const randomAd = nativeAds[Math.floor(Math.random() * nativeAds.length)];
            
            const iconElement = adElement.querySelector('.ad-native-image');
            const titleElement = adElement.querySelector('.ad-native-title');
            const descElement = adElement.querySelector('.ad-native-description');
            
            if (iconElement && titleElement && descElement) {
                // Fade out
                adElement.style.opacity = '0.5';
                
                setTimeout(() => {
                    iconElement.textContent = randomAd.icon;
                    titleElement.textContent = randomAd.title;
                    descElement.textContent = randomAd.description;
                    
                    // Fade in
                    adElement.style.opacity = '1';
                }, 300);
            }
        });
    }

    // Event listeners
    setupEventListeners() {
        // Pencere boyutu değiştiğinde
        window.addEventListener('resize', () => {
            this.hideAdsOnMobile();
        });

        // Sayfa kapatılırken popup göster (exit intent)
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0) {
                // Sadece bir kez göster ve cookie kontrolü
                if (!this.exitIntentShown && !this.hasSeenExitIntentToday()) {
                    this.showExitIntentAd();
                    this.exitIntentShown = true;
                }
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
        const lastShown = this.getCookie('filmdunyasi_exit_intent_shown');
        if (!lastShown) return false;
        
        const lastShownDate = new Date(parseInt(lastShown));
        const today = new Date();
        
        return lastShownDate.toDateString() === today.toDateString();
    }

    showExitIntentAd() {
        // Exit intent cookie'sini kaydet
        this.setCookie('filmdunyasi_exit_intent_shown', Date.now().toString(), 1);
        
        const exitAdHTML = `
            <div class="ad-popup-overlay" id="exitIntentAd">
                <div class="ad-popup-content">
                    <button class="ad-popup-close" onclick="adManager.closeExitIntent()">&times;</button>
                    <div style="text-align: center; padding: 20px;">
                        <h3 style="color: #e50914; margin-bottom: 15px;">🎬 Bekle!</h3>
                        <p style="color: #ccc; margin-bottom: 20px;">
                            Gitmeden önce premium üyeliğimizi incele!<br>
                            İlk ay sadece 9.99₺
                        </p>
                        <button style="background: #e50914; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-right: 10px;">
                            Premium Ol
                        </button>
                        <button onclick="adManager.closeExitIntent()" style="background: #333; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer;">
                            Hayır Teşekkürler
                        </button>
                        <p style="color: #666; font-size: 11px; margin-top: 15px;">
                            Bu mesaj günde sadece bir kez gösterilir
                        </p>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', exitAdHTML);
        document.getElementById('exitIntentAd').style.display = 'flex';
        
        console.log('🚪 Exit intent popup gösterildi - Bir sonraki gösterim: Yarın');
    }

    closeExitIntent() {
        const exitAd = document.getElementById('exitIntentAd');
        if (exitAd) {
            exitAd.style.display = 'none';
            exitAd.remove();
        }
    }

    trackAdClick(adElement) {
        const adType = this.getAdType(adElement);
        console.log(`🖱️ Reklam Tıklandı: ${adType}`);
        
        // Gerçek projede analytics'e gönder
        // gtag('event', 'ad_click', { ad_type: adType });
    }

    // AdSense entegrasyonu için hazır fonksiyonlar
    loadAdSense() {
        // AdSense script'ini yükle
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
    }

    replaceWithAdSense(containerId, adSlot, adFormat = 'auto') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                     data-ad-slot="${adSlot}"
                     data-ad-format="${adFormat}"></ins>
            `;
            
            // AdSense'i başlat
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
    }

    // A/B Test için reklam pozisyonları
    runAdPositionTest() {
        const testGroup = Math.random() < 0.5 ? 'A' : 'B';
        
        if (testGroup === 'B') {
            // B grubunda farklı reklam pozisyonları
            const headerBanner = document.querySelector('.ad-header-banner');
            if (headerBanner) {
                headerBanner.style.position = 'sticky';
                headerBanner.style.top = '0';
                headerBanner.style.zIndex = '999';
            }
        }
        
        console.log(`🧪 A/B Test Grubu: ${testGroup}`);
    }

    // Test amaçlı cookie temizleme (console'dan çağırılabilir)
    clearAdCookies() {
        this.setCookie('filmdunyasi_popup_shown', '', -1);
        this.setCookie('filmdunyasi_exit_intent_shown', '', -1);
        console.log('🧹 Reklam cookie\'leri temizlendi - Popup\'lar tekrar gösterilecek');
        this.logCookieStatus();
    }

    // Test amaçlı hemen popup göster (console'dan çağırılabilir)
    forceShowPopup() {
        console.log('🧪 Test amaçlı popup gösteriliyor...');
        this.showPopupAd();
    }

    // Reklam çoğaltma fonksiyonu - Test için (console'dan çağırılabilir)
    multiplyAds(count = 3) {
        console.log(`🔄 ${count} adet reklam çoğaltılıyor...`);
        
        const headerBanner = document.querySelector('.ad-header-banner');
        const bottomBanner = document.querySelector('.ad-bottom-banner');
        
        if (headerBanner) {
            for (let i = 1; i <= count; i++) {
                const clone = headerBanner.cloneNode(true);
                clone.querySelector('.ad-text').textContent = `🎬 Çoğaltılmış Reklam ${i} 🎬`;
                headerBanner.parentNode.insertBefore(clone, headerBanner.nextSibling);
            }
        }
        
        if (bottomBanner) {
            for (let i = 1; i <= count; i++) {
                const clone = bottomBanner.cloneNode(true);
                clone.querySelector('.ad-text').textContent = `🎯 Çoğaltılmış Alt Reklam ${i} 🎯`;
                bottomBanner.parentNode.insertBefore(clone, bottomBanner.nextSibling);
            }
        }
        
        console.log(`✅ Reklamlar çoğaltıldı! Sayfa yüksekliği otomatik arttı.`);
        console.log(`📏 Yeni sayfa yüksekliği: ${document.body.scrollHeight}px`);
        console.log(`💡 Kullanım: adManager.clearMultipliedAds() ile temizleyebilirsiniz`);
    }

    // Çoğaltılmış reklamları temizle (console'dan çağırılabilir)
    clearMultipliedAds() {
        const allAds = document.querySelectorAll('.ad-header-banner, .ad-bottom-banner');
        let removedCount = 0;
        
        allAds.forEach((ad, index) => {
            const text = ad.querySelector('.ad-text');
            if (text && text.textContent.includes('Çoğaltılmış')) {
                ad.remove();
                removedCount++;
            }
        });
        
        console.log(`🗑️ ${removedCount} adet çoğaltılmış reklam temizlendi`);
        console.log(`📏 Yeni sayfa yüksekliği: ${document.body.scrollHeight}px`);
    }
}

// Sayfa yüklendiğinde reklam sistemini başlat
document.addEventListener('DOMContentLoaded', () => {
    window.adManager = new AdManager();
});

// Lazy loading için intersection observer
function setupLazyAdLoading() {
    const lazyAds = document.querySelectorAll('.ad-container[data-lazy]');
    
    const adObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const ad = entry.target;
                // Lazy reklam yükle
                loadLazyAd(ad);
                adObserver.unobserve(ad);
            }
        });
    });

    lazyAds.forEach(ad => adObserver.observe(ad));
}

function loadLazyAd(adElement) {
    // Lazy reklam yükleme mantığı
    console.log('🔄 Lazy reklam yükleniyor...');
    
    // Placeholder'ı gerçek reklamla değiştir
    setTimeout(() => {
        adElement.classList.add('loaded');
        console.log('✅ Lazy reklam yüklendi');
    }, 1000);
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
            console.log('🚫 AdBlocker tespit edildi');
            showAdBlockerMessage();
        }
        document.body.removeChild(testAd);
    }, 100);
}

function showAdBlockerMessage() {
    const messageHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; background: #e50914; color: white; padding: 10px; text-align: center; z-index: 10001;">
            <p>🚫 Reklam engelleyici tespit edildi. Sitemizi desteklemek için lütfen reklam engelleyiciyi kapatın.</p>
            <button onclick="this.parentElement.remove()" style="background: white; color: #e50914; border: none; padding: 5px 10px; border-radius: 3px; margin-left: 10px;">
                Kapat
            </button>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', messageHTML);
}

// Sayfa yüklendiğinde AdBlocker kontrolü
window.addEventListener('load', () => {
    detectAdBlocker();
    setupLazyAdLoading();
}); 