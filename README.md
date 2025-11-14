# 🕯️ Premium Candle Store

Modern, full-stack e-ticaret platformu - Premium el yapımı mumlar için.

## 🎯 Özellikler

- ✅ Modern React frontend (Vite + TypeScript)
- ✅ RESTful API backend (Express + TypeScript)
- ✅ MySQL veritabanı (Drizzle ORM)
- ✅ Iyzipay (Iyzico) ödeme entegrasyonu
- ✅ Admin paneli (ürün, sipariş, koleksiyon yönetimi)
- ✅ Responsive tasarım (mobil uyumlu)
- ✅ Session-based authentication
- ✅ Email bildirimleri (SMTP)

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js 18+
- pnpm 8+
- MySQL 8+

### Kurulum

```bash
# Bağımlılıkları yükleyin
pnpm install

# .env dosyasını oluşturun
cp .env.example .env

# Veritabanını oluşturun ve migrate edin
pnpm db:migrate

# Admin kullanıcısı oluşturun
pnpm seed:admin
```

### Development

```bash
# Backend'i çalıştırın (Terminal 1)
pnpm dev:api

# Frontend'i çalıştırın (Terminal 2)
pnpm dev:web
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Admin Panel: http://localhost:5173/admin (admin/admin123)

## 📦 Deployment

Detaylı deployment rehberi için: [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md)

**Önerilen Mimari:**
- Frontend: Vercel
- Backend: Railway veya Render
- Database: PlanetScale, Railway MySQL, veya AWS RDS

## 📚 Dokümantasyon

- [Deployment Rehberi](./docs/DEPLOYMENT_GUIDE.md) - Production deployment adımları
- [Kullanım Kılavuzu](./docs/PREMIUM_CANDLE_STORE_USAGE_GUIDE.md) - Detaylı özellikler ve kullanım

## 🛠️ Teknoloji Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- Axios
- Zustand (state management)

**Backend:**
- Node.js
- Express
- TypeScript
- Drizzle ORM
- MySQL
- Iyzipay SDK
- Nodemailer

## 📁 Proje Yapısı

```
premium-candle-store/
├── apps/
│   ├── api/          # Backend (Express API)
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   ├── services/
│   │   │   └── server.ts
│   │   └── package.json
│   └── web/          # Frontend (React)
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── context/
│       │   └── lib/
│       └── package.json
├── drizzle/          # Database schema
├── docs/             # Documentation
└── package.json      # Root workspace
```

## 🔐 Güvenlik

- Session-based authentication
- Bcrypt password hashing
- CORS protection
- SQL injection protection (Drizzle ORM)
- Environment variable management

## 📄 Lisans

Private - All rights reserved

## 👨‍💻 Geliştirici

Emre - Premium Candle Store

---

**Not:** Production deployment öncesi mutlaka [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md) dosyasını okuyun!
