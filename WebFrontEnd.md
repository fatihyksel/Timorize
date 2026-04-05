# Web Frontend Görev Dağılımı

**Web Frontend Adresi:** [https://timorize-uera.vercel.app/](https://timorize-uera.vercel.app/)



---

## Grup Üyelerinin Web Frontend Görevleri

1. [ Web Frontend Görevleri](Web-Frontend-Gorevleri.md)


---


# Genel Web Frontend Prensipleri (Timorize Projesi)

## 1. Responsive Tasarım
- **Mobile-First Yaklaşımı:** Tasarımlar öncelikle mobil cihazlar için kurgulanmış, ardından masaüstü ekranlara genişletilmiştir.
- **Esnek Düzenler (Flexible Layouts):** Arayüz inşasında CSS Flexbox ve Grid mimarileri kullanılmıştır.
- **Ekran Kırılma Noktaları (Breakpoints):**  
  - Mobil: 768px altı  
  - Tablet: 768px - 1024px  
  - Masaüstü: 1024px üstü  
- **Kullanıcı Etkileşimi:** Mobil cihazlarda rahat kullanım için dokunmatik hedefler minimum **44x44px** olarak ayarlanmıştır.

## 2. Tasarım Sistemi
- **Arayüz Çerçevesi:** Özelleştirilmiş modern CSS mimarisi ve bileşen yapısı kullanılmıştır.
- **Tipografi ve Renkler:** Google Fonts (Inter) entegre edilmiş, CSS Variables ile tutarlı bir renk paleti oluşturulmuştur.
- **Boşluk ve Hizalama:** 8px grid sistemi baz alınarak tutarlı padding ve margin değerleri uygulanmıştır.

## 3. Performans Optimizasyonu
- **Derleme ve Sıkıştırma:** Vite sayesinde CSS ve JavaScript dosyaları otomatik olarak küçültülmüş (minification).
- **Gereksiz Kod Temizliği:** Tree shaking ile kullanılmayan kodlar projeye dahil edilmemiştir.

## 4. SEO (Arama Motoru Optimizasyonu)
- **Semantik Yapı:** HTML5 semantik etiketleri kullanılarak sayfa hiyerarşisi optimize edilmiştir.
- **Meta Veriler:** Sayfa başlıkları ve açıklamaları amaca uygun şekilde düzenlenmiştir.

## 5. Erişilebilirlik (Accessibility)
- **Görünürlük ve Kontrast:** Minimum 4.5:1 kontrast oranı sağlanmıştır.
- **Klavye Navigasyonu:** Tab ile gezinme desteklenmiş ve aktif elemanlar görsel olarak vurgulanmıştır.

## 6. Tarayıcı Uyumluluğu (Browser Compatibility)
- **Modern Tarayıcı Desteği:** Chrome, Firefox, Safari ve Edge’in güncel sürümleriyle test edilmiştir.
- **ES6+ Optimizasyonu:** Modern JavaScript kodları tüm tarayıcılara uyumlu hale getirilmiştir.

## 7. State Management (Durum Yönetimi)
- **Lokal Durum Yönetimi:** React Hooks ve component state kullanılmıştır.
- **Form Yönetimi:** Controlled Components yaklaşımı ile anlık doğrulama yapılmıştır.

## 8. Yönlendirme (Routing)
- **SPA Mimarisi:** Client-side routing uygulanmıştır.
- **Bulut Yönlendirme Optimizasyonu:** Vercel üzerinde tüm rotalar `index.html` dosyasına yönlendirilerek deep linking desteklenmiştir.

## 9. API Entegrasyonu
- **İstemci Mimarisi:** Fetch API kullanılmıştır.
- **Merkezi İstek Yönetimi:** `api.js` dosyasında merkezi yapı kurulmuş ve environment variables ile yönetilmiştir.
- **Güvenlik ve Hata Yakalama:** JWT token’lar Authorization header’a eklenmiş, hatalar try-catch ile yönetilmiştir.

## 10. Test Süreçleri
- **Uçtan Uca (E2E) Test:** Kullanıcı işlemleri manuel olarak test edilip belgelenmiştir.
- **Performans ve Ağ Testleri:** Chrome DevTools ile analiz yapılmıştır.

## 11. Build ve Dağıtım (Deployment)
- **Derleme Aracı:** Vite tercih edilmiştir.
- **CI/CD Hattı:** GitHub → Vercel otomatik deployment kurulmuştur.
- **Güvenlik Politikaları (CSP):** Content Security Policy ayarları Vercel üzerinden yapılandırılmıştır.
