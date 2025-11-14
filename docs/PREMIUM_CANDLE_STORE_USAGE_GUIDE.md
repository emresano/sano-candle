# Premium Candle Store – Kullanım ve Bakım Rehberi

Bu doküman, **premium-candle-store** projesini indirip yerel ortamda çalıştırmak, geliştirmek, üretime almak ve bakımını üstlenmek için gereken tüm adımları ayrıntılı olarak açıklar. Aynı içeriğin özetlenmiş PDF sürümü `docs/PREMIUM_CANDLE_STORE_USAGE_GUIDE.pdf` dosyasında bulunur.

---

## 1. Kurulum ve Başlatma

**Ön koşullar**
- Node.js 20.x veya üzeri (LTS önerilir). `node -v` ile doğrulayın.
- Paket yöneticisi olarak `pnpm` (projede workspace yapısı kullanıldığı için). Eğer sisteminizde yoksa `npm install -g pnpm` veya `corepack enable && corepack prepare pnpm@latest --activate` komutlarını çalıştırın.
- MySQL 8.x erişimi (lokal sunucu veya bulut). Projede Drizzle ORM MySQL kullanır.

**Adımlar**
1. İndirilen arşivi açın ve proje klasörünü (ör. `premium-candle-store`) istediğiniz dizine taşıyın.
2. Visual Studio Code → `File > Open Folder` seçeneğiyle kök klasörü (`premium-candle-store/new-app`) açın.
3. VS Code içinde yeni bir terminal açın (`Ctrl+``). Terminal zaten proje kökünde değilse `cd premium-candle-store/new-app` komutunu çalıştırın.
4. Ortam değişkenleri dosyasını hazırlayın:
   ```bash
   cp .env.example .env
   ```
   `.env` içinde MySQL bağlantınızı ve oturum ayarlarını (aşağıda ayrıntısı var) güncelleyin.
5. Bağımlılıkları yükleyin:
   ```bash
   pnpm install
   ```
   Sisteminizde `pnpm` yoksa kurulum aşamasında belirttiğimiz komutu kullanın. Bu komut, kök `pnpm-workspace.yaml` dosyası sayesinde hem API hem Web uygulamasının paketlerini çeker.
6. Geliştirme sunucularını ayrı terminallerde çalıştırın:
   ```bash
   pnpm dev:api     #  http://localhost:4000
   pnpm dev:web     #  http://localhost:5173
   ```
   İlk çalıştırmada Drizzle ORM şemasına göre MySQL veritabanınızı hazırlamak için `pnpm db:migrate` komutunu kullanın (komut Drizzle CLI ile `drizzle-kit` script’i olarak tanımlanmıştır).
   > Projede yeni tablolar (`site_settings`, `checkout_sessions` vb.) eklendiğinde güncel şemayı uygulamak için repoyu güncelledikten sonra da `pnpm db:migrate` çalıştırmayı unutmayın.

**Doğrulama**
- `http://localhost:5173` adresini tarayıcıda açın, ana sayfadaki tüm bölümler (kahraman görseli, koleksiyon kartları, öne çıkan ürünler, bülten) sorunsuz yüklenmelidir.
- `/shop`, `/product/<slug>`, `/cart`, `/checkout`, `/about`, `/contact` sayfalarına gezinerek SPA yönlendirmesini test edin.
- `/admin` sayfasına gidip oluşturduğunuz yönetici hesabı ile giriş yaptıktan sonra ürün CRUD ve sipariş durum güncelleme arayüzlerinin beklendiği gibi çalıştığını doğrulayın. Yönetici hesabı yoksa `pnpm seed:admin -- <kullanıcıAdı> <email> <şifre> [Ad Soyad]` komutuyla bir kullanıcı oluşturabilirsiniz.
- API için `curl http://localhost:4000/health` veya Postman ile `/api/catalog/products` gibi uç noktaları deneyin.

> Not: Bu rehber hazırlanırken CI ortamında `pnpm install` komutu çalıştırılmaya çalışılmış ancak sistemde pnpm binary’si sağlanmadığı için komut başarısız olmuştur. Lokal makinenizde pnpm kuruluysa sorunsuz çalışacaktır.

---

## 2. Yapı ve Dosya Sistemi

```
premium-candle-store/
└─ new-app/
   ├─ apps/
   │  ├─ api/         → Express + Drizzle tabanlı REST API
   │  └─ web/         → Vite + React istemci arayüzü
   ├─ drizzle/        → Drizzle ORM tablo şemaları, ilişkiler ve migrasyonlar
   ├─ docs/           → Kullanım kılavuzları (bu dosya + PDF)
   ├─ drizzle.config.ts
   ├─ pnpm-workspace.yaml
   └─ package.json
```

**Önemli Dosyalar**
- `apps/api/src/server.ts`: Express uygulaması, middleware ve yönlendirmeler.
- `apps/api/src/routes/*.ts`: Auth, katalog, sepet, sipariş, bülten/iletişim uç noktaları.
- `apps/api/src/env.ts`: Zorunlu ortam değişkenlerini merkezi olarak kontrol eder.
- `apps/api/src/services/*`: İş kuralları (ürün CRUD, sipariş yaratma, session yönetimi vb.).
- `apps/web/src/pages/*`: Landing, koleksiyon, detay, sepet, checkout, admin vb. React sayfaları.
- `apps/web/src/context/*`: Dil, kimlik doğrulama, sepet sağlayıcıları.
- `drizzle/schema.ts`: MySQL tablolarının Drizzle ORM tanımı.
- `drizzle/relations.ts`: Tablo ilişkileri.
- `drizzle/migrations`: `drizzle-kit` tarafından oluşturulan SQL migrasyonları (örn. `0000_initial.sql`).
- `pnpm-workspace.yaml`: API ve Web paketlerini aynı monorepo içinde yönetir.
- `vite.config.ts` (web) ve `package.json` dosyalarındaki script’ler Vercel uyumlu üretim build’i sağlar (`pnpm build`).

---

## 3. Düzenleme ve Geliştirme

### 3.1 Tasarım Değişiklikleri
- **Bileşenler**: Navbar, footer, layout gibi ortak parçalar `apps/web/src/components` altında. Tailwind yardımcı sınıflarıyla stil veriliyor.
- **Sayfa İçi Bölümler**: Örneğin ana sayfadaki ürün kartlarını düzenlemek için `pages/HomePage.tsx` içindeki grid yapısını değiştirin.
- **Tema/Tipografi**: `tailwind.config.ts` içinde renk paleti ve font aileleri tanımlı. Yeni renk veya boyut eklemek için `extend` alanını güncelleyin.
- **Formlar**: `CheckoutPage.tsx`, `ContactPage.tsx` gibi formlar hem UI hem API çağrılarını içerir. API uç noktasını değiştirmek için ilgili `api.post(...)` satırını güncelleyin.

### 3.2 İçerik Güncelleme
- **Metinler ve Dil Desteği**: Çift dilli içerikler `LanguageContext` sözlüğünde tutuluyor (`src/context/LanguageContext.tsx`). Yeni anahtar ekleyerek global çeviriler tanımlayın.
- **Ürün Kartı Görselleri**: Varsayılan görseller URL üzerinden geliyor. Yerel görsel kullanmak için `apps/web/public/images` altına dosya ekleyip ilgili URL’i `import` ederek güncelleyin.
- **Başlık/Fiyat Etiketi Değiştirme**: `ProductManager` üzerinden yönetici panelinden ilgili ürünü düzenleyebilir veya doğrudan veritabanında güncelleme yapabilirsiniz.

### 3.3 Yeni Ürün Ekleme / Silme
1. `/admin` paneline giriş yapın.
2. “Ürün Yönetimi” sekmesinden “Yeni Ürün” butonuna tıklayın.
3. Zorunlu alanları (slug, Türkçe/İngilizce ad, fiyat) doldurun, opsiyonel olarak görsel URL’si ekleyin.
4. Kaydettiğinizde API `POST /api/catalog/products` çağrısı yapar, Drizzle aracılığıyla MySQL’e kayıt eklenir.
5. Ürün silme veya güncelleme işlemleri aynı ekrandan yönetilir.

> **Slug nedir?** Slug değeri ürün veya koleksiyon URL’sinde kullanılan benzersiz kısa addır. Örn. “Santal Noir” ürünü için `santal-noir` slug’ı girildiğinde ziyaretçiler `http://localhost:5173/product/santal-noir` adresini kullanır. Slug değerleri boşluk veya Türkçe karakter içeremez.

> **Birden fazla görsel ekleme:** Ürün formundaki “Ek Görseller” bölümünden istediğiniz kadar URL girebilirsiniz. Yerel görsel kullanmak isterseniz dosyayı `apps/web/public/images` dizinine kopyalayıp URL alanına `/images/dosya-adi.jpg` yazın.

> Alternatif: CLI ile toplu ekleme yapmak isterseniz `apps/api/src/services/catalogService.ts` fonksiyonlarını kullanarak küçük bir seed script’i yazabilir veya mevcut `drizzle` migrasyonlarına veri ekleyebilirsiniz.

### 3.4 Kod Düzenlerken Dikkat Edilmesi Gerekenler
- Her iki paket de TypeScript kullanır; derleme hatalarını görmek için `pnpm -r run build` veya `pnpm --filter web build` / `pnpm --filter api build` çalıştırın.
- API tarafında session çerezleri kritik; `ENV.sessionCookieName` veya `ENV.sessionSecret` değerlerini değiştirdiğinizde uygulamayı yeniden başlatın.
- Refactor sırasında TR/EN çift dil desteğini korumak için `LanguageContext`’e yeni anahtar eklemeyi unutmayın; aksi halde `undefined` metinler ortaya çıkar.
- Tailwind sınıflarında global değişiklik yaparken `styles.css` içinde tanımlı `@tailwind` direktiflerini değiştirmeyin; Vercel build’lerinde gereklidir.

### 3.5 Site Ayarları (Footer & Bildirimler)
- Admin panelinde “Ayarlar” sekmesi, footer’daki Instagram/Facebook bağlantıları ile iletişim e-postasını düzenlemenize imkân tanır.
- “Sipariş Bildirim E-postası” alanına girdiğiniz adres, ödeme onaylandığında veya başarısız olduğunda SMTP üzerinden bilgilendirme almak istediğiniz mail kutusu olmalıdır.
- Formu kaydettikten sonra değişiklikler anında API tarafından `site_settings` tablosuna yazılır ve footer bileşeni yeni değerleri otomatik çeker.

---

## 4. Veritabanı

### 4.1 MySQL Bağlantısı
`.env` dosyasında aşağıdaki değişkenler yer almalıdır:

```env
DATABASE_URL=mysql://kullanici:parola@localhost:3306/premium_candles
SESSION_SECRET=super_guclu_gizli_anahtar
SESSION_COOKIE_NAME=pc_session
SESSION_TTL_MS=604800000   # 7 gün
BCRYPT_SALT_ROUNDS=12
CORS_ORIGIN=http://localhost:5173
APP_BASE_URL=http://localhost:5173
IYZICO_API_KEY=<iyzico_sandbox_veya_production_api_key>
IYZICO_SECRET_KEY=<iyzico_sandbox_veya_production_secret>
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com
SMTP_HOST=<smtp.host.com>
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<smtp_kullanici_adı>
SMTP_PASSWORD=<smtp_parolası>
```

- `DATABASE_URL` formatı `mysql://user:pass@host:port/dbname` olmalıdır. Yerel MySQL kullanıyorsanız `localhost:3306` ve oluşturduğunuz veritabanı adını yazın.
- Manuel bağlantı kurmanıza gerek yok; `apps/api/src/db.ts` Drizzle ile havuz oluşturup otomatik bağlanır.
- `APP_BASE_URL` API çağrılarının geri dönüş adresi için kullanılır (lokalde `http://localhost:5173`).
- `IYZICO_*` değerleri iyzico sanal POS entegrasyonu içindir. Sandbox kullanıyorsanız [iyzico panelinden](https://sandbox-merchant.iyzipay.com/) anahtarları alın.
- `SMTP_*` alanları yeni sipariş bildirim e-postalarının gönderilebilmesi için gereklidir. SMTP kullanmak istemezseniz bu alanları boş bırakabilirsiniz; sistem log’a uyarı yazar.

### 4.2 Şema ve Migrasyonlar
- Tablo tanımları `drizzle/schema.ts` dosyasında. Örn. `users`, `sessions`, `collections`, `products`, `orders`, `orderItems` vb.
- `drizzle/relations.ts` tablolar arası ilişki tanımlarını içerir.
- Migrasyon üretmek için: `pnpm drizzle:generate` (package.json’da `drizzle-kit generate`) → Yeni SQL dosyası `drizzle/migrations` içine düşer.
- Migrasyon uygulamak için: `pnpm drizzle:migrate` (env değişkenleri mevcut olmalı).

### 4.3 Seed / Test Verileri
- Admin paneli üzerinden ürün ekleyebileceğiniz için zorunlu seed dosyası yok. Ancak toplu veri eklemek istenirse `apps/api/src/services/catalogService.ts` fonksiyonlarını kullanan bir script yazıp `pnpm tsx scripts/seed.ts` gibi çalıştırabilirsiniz.
- Sipariş testleri için `/checkout` sayfasında sahte verilerle sipariş oluşturabilir, ardından `/admin` panelinde siparişin oluştuğunu ve durum güncellemesini test edebilirsiniz.

---

## 5. Yayınlama (Deployment)

### 5.1 GitHub’a Gönderme
```bash
git init
git add .
git commit -m "chore: initial release"
git branch -M main
git remote add origin git@github.com:username/premium-candle-store.git
git push -u origin main
```

### 5.2 Vercel’e Deploy
1. Vercel hesabınıza giriş yapın ve “New Project” → “Import Git Repository”.
2. Monorepo yapısı için `apps/web` dizinini “Framework Preset: Vite” olarak seçin.
3. Build & Output ayarları:
   - **Install Command**: `pnpm install`
   - **Build Command**: `pnpm --filter web build`
   - **Output Directory**: `apps/web/dist`
4. `Environment Variables` alanına aşağıdakileri girin (Vercel hem frontend hem API için bu değişkenleri kullanabilir):
   - `VITE_API_URL` → Vercel’de barındırılacak API adresi (ör. `https://premium-api.vercel.app/api`)
   - Frontend’de kullanılacak diğer değişkenler (gerekirse).

### 5.3 API’yi Vercel veya Diğer Platformlarda Çalıştırma
- Express tabanlı API, Vercel serverless yerine Node 18+ barındırma ortamında (Railway, Render, Fly.io) sorunsuz çalışır. Dockerfile eklemek isterseniz taban aldığınız Node imajına `pnpm install`, `pnpm --filter api build`, ardından `node apps/api/dist/server.js` komutuyla çalıştırabilirsiniz.
- Ortam değişkenlerini aynı şekilde platforma eklemeyi unutmayın.

### 5.4 Ortam Değişkenleri ve Gizli Anahtarlar
- Production ortamında `SESSION_SECRET` değerini uzun, rastgele bir string olarak belirleyin.
- MySQL kullanıcı adı/parolasını `.env`’de saklayıp Vercel/GitHub gibi platformlara **commit etmeyin**.

---

## 6. Güncelleme ve Bakım

### 6.1 Yeni Sürüm Oluşturma
1. Yeni özellik veya düzeltmeleri ayrı bir branch’te geliştirin.
2. Kod incelemesinden sonra `main` branch’ine merge edin.
3. Versiyonlama için `git tag vX.Y.Z` oluşturabilir, Release Notes hazırlayabilirsiniz.

### 6.2 Hata Düzeltme Süreci
- Hata kaynağını belirlerken API logları (`apps/api/src/server.ts` içinde `morgan` logları) ve browser konsol hatalarını inceleyin.
- Gerekirse veritabanındaki kayıtları `drizzle` üzerinden veya MySQL CLI ile kontrol edin.

### 6.3 Drizzle Migrasyonları Yönetme
- Yeni tablo/kolon eklediğinizde `drizzle/schema.ts`’i güncelleyin → `pnpm drizzle:generate` → migrasyonu commit edin.
- Production’da migrasyon çalıştırmadan önce staging ortamında test edin.

### 6.4 Arayüz Bakımı
- Tailwind yükseltmeleri veya component değişiklikleri sırasında `pnpm dlx tailwindcss -i ./src/styles.css -o ./dist/output.css --watch` benzeri komutlara gerek yok; Vite plugin otomatik işler.
- Lighthouse veya Chrome DevTools ile performans ve erişilebilirlik denetimleri yapın.

### 6.5 Güvenlik
- Admin paneline erişimi sadece `admin` rolü olan kullanıcılarla sınırlı tutun. Varsayılan kullanıcı adı/parolayı production ortamına taşımadan önce mutlaka değiştirin.
- Session çerezleri `httpOnly` + `secure` olarak işaretlenmiştir; HTTPS zorunludur.

---

## 7. Ödeme Akışı ve iyzico Entegrasyonu

1. **Adım 1 – Müşteri Bilgileri**: `/checkout` sayfası iki aşamalıdır. Kullanıcı ad-soyad, e-posta, telefon ve teslimat adresi alanlarını doldurur. Telefon formatı `5xx xxx xx xx` olacak şekilde doğrulanır; alan boş bırakılamaz.
2. **Adım 2 – iyzico Ödeme Formu**: Form başarıyla gönderildiğinde `POST /api/checkout/session` çağrılır ve iyzico Checkout Form HTML’i döner. Bu HTML doğrudan sayfaya gömülür. Ödeme tamamlandığında iyzico, `POST /api/checkout/iyzico/callback` üzerinden sonucu bildirir.
3. **Sipariş Oluşturma**: Ödeme onayı gelene kadar `orders` tablosuna kayıt yapılmaz. Onay alındığında `createOrder()` çağrılır, sipariş “paid” durumunda kaydedilir ve sepet temizlenir.
4. **Bildirim E-postası**: `SMTP_*` değişkenleri tanımlanmışsa `site_settings.notificationEmail` adresine başarı/başarısızlık e-postası gönderilir.
5. **Sandbox Kurulumu**:
   - [iyzico Sandbox](https://sandbox-merchant.iyzipay.com/) panelinden API Key ve Secret oluşturun.
   - `.env` içinde `IYZICO_API_KEY`, `IYZICO_SECRET_KEY`, `IYZICO_BASE_URL=https://sandbox-api.iyzipay.com` değerlerini girin.
   - Sunucuyu yeniden başlatın (`pnpm dev:api`).
6. **Canlı Ortama Geçiş**: Production anahtarlarını kullanın, iyzico panelinden PCI gereksinimlerini tamamlayın ve `.env` dosyasında `IYZICO_BASE_URL=https://api.iyzipay.com` olarak güncelleyin.
7. **Sorun Giderme**: Ödeme formu yüklenemiyorsa konsolda `Iyzico ödeme ayarları tanımlı değil` tipi hatalar kontrol edilmeli; genellikle eksik API/Secret anahtarından kaynaklanır. Ödeme başarısız ise callback içeriği log’larda görüntülenir.

---

## 8. Test ve Kalite Güvencesi

- **Manuel Test Senaryoları**
  1. Ana sayfada tüm CTA butonlarının doğru sayfalara yönlendirdiğini doğrulayın.
  2. `/shop` filtresi ile `?collection=minimal` ve `?collection=luxury` parametrelerini test edin.
  3. Ürün detay sayfasından sepet ekleme ve adede göre toplam tutar hesaplamasını kontrol edin.
  4. Checkout formunu iyzico sandbox kartlarıyla test edin. Ödeme başarılı olduğunda admin panelinde siparişin “paid” durumda göründüğünü onaylayın.
  5. Bülten formuna daha önce eklenmiş bir e-posta girdiğinizde “zaten abonesiniz” mesajının geldiğini doğrulayın.
  6. Admin panelinde “Ayarlar” sekmesini kullanarak footer bağlantılarını güncelleyin; değişikliklerin anlık olarak yayına yansıyıp yansımadığını kontrol edin.

---

## 9. Sorun Giderme

| Belirti | Olası Sebep | Çözüm |
| --- | --- | --- |
| `pnpm` komutu bulunamadı | pnpm kurulu değil | `npm install -g pnpm` veya `corepack enable` |
| API `ECONNREFUSED` hatası | MySQL bağlantısı yok | MySQL servisinin çalıştığından emin olun; `.env` bilgilerini doğrulayın |
| Admin paneli giriş yapmıyor | Yönetici hesabı eksik veya kimlik bilgisi hatalı | `pnpm seed:admin -- <kullanıcıAdı> <email> <şifre>` komutuyla yeni bir admin oluşturun, ardından tekrar deneyin |
| Build sırasında `ENV` hatası | `.env` dosyası eksik | Kök klasöre `.env` ekleyin ve `pnpm build` öncesi doldurun |
| Vercel deploy başarısız | Monorepo ayarları eksik | Proje ayarlarında `Root Directory: apps/web`, doğru build komutlarını girin |

---

## 10. Ek Kaynaklar

- Drizzle ORM Dokümantasyonu: https://orm.drizzle.team
- Vite & React Resmi Belgeleri: https://vitejs.dev, https://react.dev
- Tailwind CSS: https://tailwindcss.com/docs
- Vercel Monorepo Kılavuzu: https://vercel.com/guides/using-vercel-with-monorepos

---

Bu rehber, projeyi kurma, değiştirme, test etme ve dağıtma aşamalarında ihtiyaç duyacağınız tüm süreçleri kapsar. Ek sorularınız olursa bu dokümana ek başlıklar ekleyerek genişletebilirsiniz.

