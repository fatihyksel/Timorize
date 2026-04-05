# 📘 API Dokümantasyonu
  Video: https://www.youtube.com/watch?v=wMDjEP8gm1w
 https://timorize.vercel.app
## 🔐 Authentication

### 1. Üye Olma (Register)
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "Fatih Yüksel",
  "email": "fatih@test.com",
  "password": "sifre123"
}
```

**Response:**
- `201 Created` → Kullanıcı başarıyla oluşturuldu.

---

### 2. Giriş Yapma (Login)
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "fatih@test.com",
  "password": "sifre123"
}
```

**Response:**
- `200 OK` → JWT Token başarıyla oluşturuldu.

---

### 3. Çıkış Yapma (Logout)
**Endpoint:** `POST /api/auth/logout`

**Authentication:** Bearer Token gerekli

**Response:**
- `200 OK` → Oturum başarıyla sonlandırıldı.

---

## 👤 Kullanıcı İşlemleri

### 4. Üyelik Silme (Delete User)
**Endpoint:** `DELETE /api/users/{userId}`

**Path Parameters:**
- `userId` (string, required)

**Authentication:** Bearer Token gerekli

**Response:**
- `204 No Content` → Kullanıcı ve tüm veriler silindi.

---

## 📅 Plan İşlemleri

### 5. Günlük Plan Oluşturma
**Endpoint:** `POST /api/plans`

**Authentication:** Bearer Token gerekli

**Request Body:**
```json
{
  "title": "Backend Sunumu",
  "description": "Postman test videoları çekilecek.",
  "date": "2026-04-05"
}
```

**Response:**
- `201 Created` → Plan oluşturuldu.

---

### 6. Günlük Planı Güncelleme
**Endpoint:** `PUT /api/plans/{planId}`

**Path Parameters:**
- `planId` (string, required)

**Authentication:** Bearer Token gerekli

**Request Body:**
```json
{
  "title": "Backend Sunumu (GÜNCELLENDİ)",
  "date": "2026-05-06"
}
```

**Response:**
- `200 OK` → Plan güncellendi.

---

## ⏱️ Zamanlayıcı (Timer) İşlemleri

### 7. Zamanlayıcı Kaydı Oluşturma
**Endpoint:** `POST /api/timers`

**Authentication:** Bearer Token gerekli

**Request Body:**
```json
{
  "taskName": "Final Hazirlik",
  "durationInMinutes": 25
}
```

**Response:**
- `201 Created` → Süre kaydedildi.

---

### 8. Kayıtlı Zamanları Listeleme
**Endpoint:** `GET /api/timers/logs`

**Authentication:** Bearer Token gerekli

**Response:**
- `200 OK` → Tüm kayıtlar listelendi.

---

### 9. Zaman Kaydı Silme
**Endpoint:** `DELETE /api/timers/logs/{logId}`

**Path Parameters:**
- `logId` (string, required)

**Authentication:** Bearer Token gerekli

**Response:**
- `204 No Content` → Kayıt silindi.

---

## 🧠 Zaman Teknikleri

### 10. Zaman Tekniği Seçme
**Endpoint:** `POST /api/techniques/select`

**Authentication:** Bearer Token gerekli

**Request Body:**
```json
{
  "techniqueName": "Pomodoro Tekniği"
}
```

**Response:**
- `200 OK` → Teknik seçildi.

---

### 11. Favori Zaman Tekniği Ekleme
**Endpoint:** `POST /api/techniques/favorite`

**Authentication:** Bearer Token gerekli

**Request Body:**
```json
{
  "techniqueName": "Pomodoro Tekniği"
}
```

**Response:**
- `200 OK` → Favorilere eklendi.
