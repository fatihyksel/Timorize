# Fatih Yüksel'in Web Frontend Görevleri

**Front-end Test Videosu:** https://www.youtube.com/watch?v=Rye6e9R7oYk

---

## 1. Üye Olma (Kayıt) Sayfası
**API Endpoint:** `POST /api/auth/register`

### Görev
Kullanıcı kayıt işlemi için web sayfası tasarımı ve implementasyonu

### UI Bileşenleri
- Responsive kayıt formu (desktop ve mobile uyumlu)
- Email input alanı (`type="email"`, `autocomplete="email"`)
- Şifre input alanı (`type="password"`, şifre gücü göstergesi)
- Şifre tekrar input alanı
- Ad (`firstName`) ve Soyad (`lastName`) input alanı
- "Kayıt Ol" butonu (primary button)
- "Zaten hesabınız var mı? Giriş Yap" linki
- Loading spinner
- Form container (card / centered layout)

### Form Validasyonu
- HTML5 validation (`required`, `pattern`)
- JavaScript real-time validation
- Email format kontrolü (regex)
- Şifre kuralları (min 8 karakter + eşleşme)
- Ad ve soyad boş olamaz
- Tüm alanlar geçerli olmadan buton disabled
- Client-side + server-side validation

### Kullanıcı Deneyimi
- Inline hata mesajları
- Başarılı kayıt sonrası yönlendirme (login sayfası)
- Hata mesajları (örn: **409 Conflict**)
- Double-click koruması
- Accessible labels + ARIA attributes
- Keyboard navigation desteği

### Teknik Detaylar
- **Framework:** React + Vite
- **Form yönetimi:** Native + React State
- **State:** form, loading, error (Hooks)
- **Routing:** React Router
- **API:** Fetch + merkezi `api.js`

---
# 2. Giriş Yap (Login) Sayfası

**API Endpoint:** `POST /api/auth/login`

**Görev**  
Kayıtlı kullanıcının sisteme giriş yapabilmesi için web sayfası tasarımı ve implementasyonu.

### UI Bileşenleri
- Responsive giriş formu (desktop ve mobile uyumlu)
- Email input alanı (`type="email"`, `autocomplete="email"`)
- Şifre input alanı (`type="password"`, gözükme/gizlenme togglesı)
- **"Giriş Yap"** butonu (primary button style)
- **"Hesabınız yok mu? Kayıt Ol"** linki
- Loading spinner (giriş işlemi sırasında)
- Form container (card veya centered layout)

### Form Validasyonu
- HTML5 form validation (`required` attributes)
- JavaScript real-time validation
- Email format kontrolü (regex)
- Şifre boş olamaz kontrolü
- Tüm alanlar geçerli olmadan "Giriş Yap" butonu `disabled` durumda
- Client-side ve server-side validation

### Kullanıcı Deneyimi
- Form hatalarının input alanı altında inline gösterilmesi
- Başarılı giriş sonrası success notification ve ana Dashboard sayfasına yönlendirme
- Hata durumlarında kullanıcı dostu mesajlar  
  (örneğin: 401 Unauthorized → "Email veya şifre hatalı")

- Double-click koruması (form submission prevention)
- Accessible form labels ve ARIA attributes
- Keyboard navigation desteği (Tab, Enter tuşları)

### Teknik Detaylar
- **Framework:** React + Vite
- **Form yönetimi:** Native HTML5 + React State
- **State yönetimi:** form state, loading state, error state (useState ve useEffect hook’ları)
- **Routing:** React Router (başarılı giriş sonrası `/dashboard` yönlendirmesi)
- **API İletişimi:** Fetch API + merkezi `api.js` dosyası üzerinden istek yönetimi
- Token yönetimi (JWT token’ın localStorage veya httpOnly cookie’ye kaydedilmesi)
- SEO optimizasyonu (meta tags)
- Erişilebilirlik (WCAG 2.1 AA uyumu)

---
# 3. Kullanıcı Çıkış Yapma (Logout) Akışı

**API Endpoint / İşlem Türü**  
POST /api/auth/logout
Authentication: Bearer Token gerekli

**Görev**  
Kullanıcının aktif oturumunu güvenli bir şekilde sonlandırmak, token’ı temizlemek ve yetkisiz erişimleri engellemek.

### UI Bileşenleri
- Üst navigasyon barında sağ üstte **Kullanıcı / Profil İkonu** (avatar + dropdown tetikleyicisi)
- Profil ikonuna tıklayınca açılan **Dropdown Menu** veya **Profil Modal**:
  - **"Çıkış Yap" (Logout)** butonu 

### Kullanıcı Deneyimi (UX)
- Profil ikonu tüm sayfalarda sabit ve kolayca erişilebilir konumda
- Çıkış yap butonuna tıklayınca anında ve sorunsuz login sayfasına yönlendirme
- Çıkış sonrası back tuşuna basıldığında dashboard veya korumalı sayfaların tekrar görüntülenmemesi
- Başarılı çıkış sonrası opsiyonel success toast bildirimi (“Oturumunuz güvenli bir şekilde sonlandırıldı”)
- Erişilebilirlik: Klavye ile açılabilir dropdown ve buton (ARIA attributes, focus management)

### Teknik Detaylar
- `localStorage.removeItem('timorize_token')` ile JWT token temizlenir
- Kullanıcı `/login` sayfasına yönlendirilir
- Tüm kullanıcı state’leri sıfırlanır
- Token yoksa korumalı sayfalara erişim engellenir

---

# 4.Zamanlayıcı ve Görev Yönetimi (Dashboard) Sayfası

* **API Endpoint:** `GET /api/timers/logs` ve `POST /api/timers ve DELETE /api/timers/logs/{logId}`
* **Görev:** Kullanıcının çalışma oturumlarını (Pomodoro vb. teknikler) takip edebileceği, sayacı yönetebileceği ve tamamlanan oturumları sisteme kaydedebileceği ve silebilcegi ana etkileşim panelinin tasarımı ve implementasyonu.

### UI Bileşenleri
* Modern ve odaklanmayı artıran **Karanlık Tema (Dark Mode)** arayüzü (göz yormayan renk paleti).
* Üst Navigasyon: Zamanlayıcı, Takvim sekmeleri ve Kullanıcı Profil ikonu (avatar + dropdown).
* **Zamanlayıcı Modülü (Sol Panel):**
  * "Kronometre" ve "Zamanlayıcı" arası geçiş sağlayan Tab yapısı.
  * Büyük dijital süre göstergesi (ör: `00:25:00`) + animasyonlu odaklanma çemberi (progress ring).
  * Başlat/Durdur (Play/Pause), Sıfırla (Reset) butonları.
  * "Süre (Dakika)" belirleme input alanı (`type="number"`, min=1).
  * "Görev" ismi input alanı ("Ne üzerinde çalışıyorsunuz?" placeholder’lı).
  * Çalışma Tekniği seçimi için Dropdown (Pomodoro, Custom, Short Break vb.).
  * "Oturumu Kaydet" butonu (primary stil).
* **Kayıtlar Modülü (Sağ Panel):**
  * Sağ üstte toplam oturum sayısını gösteren dinamik Badge (ör: 12 oturum).
  * Geçmiş kayıtların listelendiği alan (kart veya tablo görünümü).
  * Geçmiş kayıtları silme butonu.

### Form Validasyonu ve Mantık (Logic)
* Süre alanının sadece pozitif tam sayılar kabul etmesi (real-time JavaScript kontrolü).
* Kullanıcı süreyi tamamlamadan veya sayaç aktifken **"Oturumu Kaydet"** butonunun `disabled` tutulması.
* Görev adı boş bırakıldığında kaydetme işleminin engellenmesi.
* Client-side ve server-side validation desteği.

### Kullanıcı Deneyimi (UX)
* **Empty State** gösterimi: Sağ panelde henüz kayıt yoksa şu mesaj görünür:  
  *"Henüz kayıt yok. Süreyi tamamladıktan sonra oturumu kaydedebilirsiniz."*
* Butonlarda ve sekmelerde belirgin Hover, Active ve Focus efektleri.
* Aktif sekmenin arka plan rengi ve vurgu ile belirtilmesi.
* Oturum kaydedildikten sonra başarı toast bildirimi ve listenin otomatik yenilenmesi.
* Klavye desteği (Space tuşu ile başlat/durdur).

### Teknik Detaylar
* Zamanlayıcı mantığı: React `useState` ve `useEffect` hook’ları ile `setInterval` kullanılarak geliştirilmesi (interval temizleme işlemleri dahil).
* Component State: Sayaç durumu, kalan süre, görev adı ve seçilen teknik lokal state’lerde tutulur.
* API İletişimi: "Oturumu Kaydet" butonuna basıldığında veriler toplanıp `POST /api/timers` endpoint’ine gönderilir. Mevcut kayıtlar `GET /api/timers/logs` ile çekilir.
* Responsive tasarım (mobilde paneller alt alta gelir).
* Erişilebilirlik standartlarına uyum (ARIA labels, live regions).

---


---

## 5. Hesap Silme Akışı
**API Endpoint:** `DELETE /api/users/{userId}`

### Görev
Kullanıcı hesabını silme UI akışı

### UI Bileşenleri
- "Hesabı Sil" butonu (danger)
- Modal dialog
- Çift onay mekanizması
- Warning iconlar

### Kullanıcı Deneyimi
- Güçlü görsel uyarılar (kırmızı, ikonlar)
- Açık mesajlar ("Bu işlem geri alınamaz")
- Her zaman iptal seçeneği
- Loading indicator
- Silme sonrası logout + yönlendirme

### Akış Adımları
1. "Hesabı Sil" butonuna tıklama  
2. İlk uyarı modalı  
3. Son onay ekranı  
4. API çağrısı  
5. Logout + login sayfasına yönlendirme  

### Teknik Detaylar
- Modal/Dialog component
- Error handling
- Token temizleme (`clearToken`)
- localStorage & sessionStorage temizliği
- React Router ile redirect

```}
