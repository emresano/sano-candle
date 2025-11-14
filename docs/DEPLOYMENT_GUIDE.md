# 🚀 Premium Candle Store - Deployment Rehberi

Bu rehber, Premium Candle Store projesini production ortamına deploy etmek için adım adım talimatlar içerir.

---

## 📋 Mimari Özet

**Frontend (Vite/React):**
- Platform: Vercel
- Domain: www.sanocandle.com
- SSL: Otomatik (Vercel tarafından)
- Environment Variable: `VITE_API_URL`

**Backend (Node/Express):**
- Platform: Railway veya Render
- Domain: api.sanocandle.com
- SSL: Otomatik (Railway/Render tarafından)
- Port: 8080 (veya platform tarafından atanan)

---

## 🏠 Local Development

### 1. Gereksinimler

- Node.js 18+
- pnpm 8+
- MySQL 8+

### 2. Kurulum

```bash
# Projeyi klonlayın
git clone <repository-url>
cd premium-candle-store

# Bağımlılıkları yükleyin
pnpm install

# .env dosyasını oluşturun
cp .env.example .env

# .env dosyasını düzenleyin (DATABASE_URL, SESSION_SECRET vb.)
nano .env
```

### 3. Veritabanı Kurulumu

```bash
# MySQL'de veritabanı oluşturun
mysql -u root -p
CREATE DATABASE premium_candles CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Veritabanı şemasını oluşturun
pnpm db:migrate

# Admin kullanıcısı oluşturun
pnpm seed:admin
# Varsayılan: username=admin, password=admin123
```

### 4. Backend'i Çalıştırın

```bash
# Terminalde backend'i başlatın
pnpm dev:api

# Çıktı: API server listening on port 4000
```

### 5. Frontend'i Çalıştırın

```bash
# Yeni bir terminalde frontend'i başlatın
pnpm dev:web

# Çıktı: Local: http://localhost:5173
```

### 6. Test Edin

- Frontend: http://localhost:5173
- Backend Health Check: http://localhost:4000/health
- Admin Panel: http://localhost:5173/admin (admin/admin123)

---

## 🌐 Production Deployment

### ADIM 1: Backend'i Railway'e Deploy Etme

#### 1.1 Railway Hesabı Oluşturun

1. https://railway.app adresine gidin
2. GitHub ile giriş yapın
3. "New Project" → "Deploy from GitHub repo" seçin

#### 1.2 Projeyi Bağlayın

1. GitHub repository'nizi seçin
2. "Add variables" butonuna tıklayın
3. Aşağıdaki environment variable'ları ekleyin:

```env
NODE_ENV=production
PORT=8080
DATABASE_URL=mysql://user:pass@host:3306/dbname
SESSION_SECRET=super_guclu_production_secret_key
SESSION_COOKIE_NAME=pc_session
SESSION_TTL_MS=604800000
BCRYPT_SALT_ROUNDS=12
CORS_ORIGIN=https://www.sanocandle.com,https://sanocandle.com
APP_BASE_URL=https://www.sanocandle.com
IYZICO_API_KEY=your_production_api_key
IYZICO_SECRET_KEY=your_production_secret_key
IYZICO_BASE_URL=https://api.iyzipay.com
```

#### 1.3 Build Ayarları

Railway otomatik olarak `apps/api` klasörünü tespit edecektir.

**Root Directory:** `apps/api`
**Build Command:** `pnpm build`
**Start Command:** `pnpm start`

#### 1.4 Veritabanı Kurulumu

**Seçenek A: Railway MySQL Plugin**
```bash
# Railway dashboard'da:
# 1. "New" → "Database" → "Add MySQL"
# 2. DATABASE_URL otomatik oluşturulacak
# 3. Railway CLI ile bağlanın:
railway login
railway link
railway run pnpm db:migrate
railway run pnpm seed:admin
```

**Seçenek B: Harici MySQL (PlanetScale, AWS RDS vb.)**
```bash
# DATABASE_URL'i manuel olarak ayarlayın
# Local'den migration çalıştırın:
DATABASE_URL=<production-url> pnpm db:migrate
DATABASE_URL=<production-url> pnpm seed:admin
```

#### 1.5 Custom Domain Bağlama

1. Railway dashboard → Settings → Domains
2. "Custom Domain" butonuna tıklayın
3. `api.sanocandle.com` girin
4. DNS sağlayıcınızda (Cloudflare, Namecheap vb.) CNAME kaydı ekleyin:
   ```
   Type: CNAME
   Name: api
   Value: <railway-provided-domain>
   ```
5. SSL otomatik olarak aktif olacak (Let's Encrypt)

---

### ADIM 2: Frontend'i Vercel'e Deploy Etme

#### 2.1 Vercel Hesabı Oluşturun

1. https://vercel.com adresine gidin
2. GitHub ile giriş yapın
3. "Add New Project" → GitHub repository'nizi seçin

#### 2.2 Build Ayarları

**Framework Preset:** Vite
**Root Directory:** `apps/web`
**Build Command:** `pnpm build`
**Output Directory:** `dist`

#### 2.3 Environment Variables

Vercel dashboard'da şu değişkeni ekleyin:

```env
VITE_API_URL=https://api.sanocandle.com
```

#### 2.4 Deploy

1. "Deploy" butonuna tıklayın
2. Build tamamlanacak (~2-3 dakika)
3. Vercel otomatik bir URL verecek (örn: `premium-candle-store.vercel.app`)

#### 2.5 Custom Domain Bağlama

1. Vercel dashboard → Settings → Domains
2. "Add" butonuna tıklayın
3. `www.sanocandle.com` ve `sanocandle.com` girin
4. DNS sağlayıcınızda A/CNAME kayıtları ekleyin:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
5. SSL otomatik olarak aktif olacak

---

### ADIM 3: Iyzipay (Iyzico) Konfigürasyonu

#### 3.1 Iyzipay Paneline Giriş

1. https://merchant.iyzipay.com adresine gidin
2. Hesabınıza giriş yapın
3. Ayarlar → API Anahtarları bölümüne gidin

#### 3.2 API Anahtarlarını Alın

- **API Key:** Kopyalayın
- **Secret Key:** Kopyalayın
- Railway environment variables'a ekleyin

#### 3.3 Callback URL'lerini Ayarlayın

Iyzipay panelinde şu URL'leri tanımlayın:

**Success Callback:**
```
https://api.sanocandle.com/api/payment/callback
```

**Failure Callback:**
```
https://api.sanocandle.com/api/payment/callback
```

**3D Secure Callback:**
```
https://api.sanocandle.com/api/payment/3d-callback
```

#### 3.4 Test Edin

1. Frontend'de bir ürün sepete ekleyin
2. Ödeme sayfasına gidin
3. Test kartı kullanın:
   ```
   Kart No: 5528790000000008
   CVV: 123
   Son Kullanma: 12/30
   Ad Soyad: Test User
   ```

---

## 🔄 Güncelleme ve Yeniden Deploy

### Backend Güncellemesi (Railway)

```bash
# Kod değişikliklerini commit edin
git add .
git commit -m "Backend güncellendi"
git push origin main

# Railway otomatik olarak yeniden deploy edecek
```

### Frontend Güncellemesi (Vercel)

```bash
# Kod değişikliklerini commit edin
git add .
git commit -m "Frontend güncellendi"
git push origin main

# Vercel otomatik olarak yeniden deploy edecek
```

---

## 🐛 Sorun Giderme

### Backend 500 Hatası

```bash
# Railway logs'u kontrol edin
railway logs

# Yaygın sorunlar:
# - DATABASE_URL yanlış
# - CORS_ORIGIN eksik
# - SESSION_SECRET eksik
```

### Frontend API Bağlantı Hatası

```bash
# Vercel environment variables kontrol edin
# VITE_API_URL doğru mu?

# Browser console'da kontrol edin:
console.log(import.meta.env.VITE_API_URL)
```

### CORS Hatası

```bash
# Backend .env dosyasında:
CORS_ORIGIN=https://www.sanocandle.com,https://sanocandle.com

# Virgülle ayrılmış, boşluk yok!
```

### Iyzipay Callback Çalışmıyor

```bash
# Callback URL'leri kontrol edin:
# - https:// ile başlamalı
# - api.sanocandle.com domain'i doğru mu?
# - Railway'de PORT=8080 ayarlı mı?
```

---

## 📊 Monitoring ve Logs

### Railway Logs

```bash
# CLI ile:
railway logs --tail

# Dashboard:
# Railway dashboard → Deployments → View Logs
```

### Vercel Logs

```bash
# CLI ile:
vercel logs <deployment-url>

# Dashboard:
# Vercel dashboard → Deployments → View Function Logs
```

---

## 🔒 Güvenlik Kontrol Listesi

- [ ] `SESSION_SECRET` production'da güçlü ve benzersiz
- [ ] `DATABASE_URL` güvenli (SSL enabled)
- [ ] CORS sadece gerekli origin'leri içeriyor
- [ ] Iyzipay API anahtarları production keys
- [ ] Admin şifresi değiştirildi (varsayılan: admin123)
- [ ] HTTPS her yerde aktif (Vercel + Railway otomatik)
- [ ] Environment variables GitHub'a commit edilmedi

---

## 📞 Destek

Sorun yaşarsanız:
1. Railway/Vercel logs'u kontrol edin
2. `.env` dosyalarını gözden geçirin
3. Bu rehberi tekrar okuyun
4. GitHub Issues'da soru sorun

---

**Deployment tamamlandı! 🎉**

Site: https://www.sanocandle.com
API: https://api.sanocandle.com/health
Admin: https://www.sanocandle.com/admin
