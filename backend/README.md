# Kampüs Etkinlikleri API — Yusuf Emre Altan (2416501065)

Node + Express ile REST API. Sprint 8'den itibaren etkinlikler **MongoDB**'de (Mongoose) tutulur; sunucu kapanıp açılınca POST ile eklenen kayıtlar kaybolmaz.

## Çalıştırma

```bash
cd backend
npm install
cp .env.example .env   # MONGODB_URI'yi kendi veritabanı adresinle değiştir
npm run seed           # veritabanına 6 örnek etkinlik
npm run dev
```

- `npm run dev`: `node --watch src/server.js` (dosya değişince yeniden başlar)
- `npm start`: `node src/server.js`
- `npm run seed`: `node src/seed.js` (önce `events` koleksiyonunu siler, sonra 6 kayıt ekler; kaç kez çalışırsa çalışsın 6 kayıt kalır)

Sunucu önce veritabanına bağlanır, sonra `http://localhost:3000` adresinde dinler. Bağlanamazsa hatayı yazıp kapanır.

## Ortam değişkenleri

| Değişken | Örnek (`.env.example`) | Açıklama |
|---|---|---|
| `PORT` | `3000` | Sunucunun dinleyeceği port |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/kampus` | Veritabanı adresi. Gerçek adres (Atlas) sadece `.env`'de durur |

`.env` GitHub'a gönderilmez. Bağlantı adresi şifre içerdiği için kodda, README'de, `.env.example`'da ve Postman collection'ında yer almaz; terminale de sadece host ve veritabanı adı yazılır.

## REST sözleşmesi

| Method | Endpoint | Amaç | Başarılı | Hata | Durum |
|---|---|---|---|---|---|
| GET | `/health` | Sunucu ayakta mı | 200 | — | Sprint 7 |
| GET | `/events` | Listeyi getir (`?category=Atölye` isteğe bağlı, tarihe göre sıralı) | 200 | — | Sprint 8: MongoDB |
| GET | `/events/:id` | Tek etkinlik (`:id` = MongoDB `_id`) | 200 | 404 | Sprint 8: MongoDB |
| POST | `/events` | Yeni etkinlik | 201 | 400 | Sprint 8: MongoDB |
| PATCH | `/events/:id` | Güncelle | 200 | 400, 404 | Sprint 9 |
| DELETE | `/events/:id` | Sil | 204 | 404 | Sprint 9 |

**Status code'lar:** 200 tamam · 201 oluşturuldu · 204 içerik yok · 400 eksik/yanlış veri · 404 bulunamadı · 500 beklenmeyen hata

**Hata biçimi** (bütün hatalar aynı):

```json
{ "error": { "message": "Event not found" } }
```

- Biçimi yanlış id (`/events/yok`, `/events/111111`) ve biçimi doğru ama kaydı olmayan id → **404** (500 değil).
- Beklenmeyen hatalar hata middleware'ine gider: kullanıcıya sadece `"Server error"` döner, sunucu çökmez.

## Schema kuralları (`src/models/event-model.js`)

| Alan | Kurallar |
|---|---|
| `title` | zorunlu, `trim`, 3–100 karakter |
| `category` | zorunlu, `Seminer` · `Atölye` · `Söyleşi` · `Yarışma` |
| `capacity` | sayı, en az 0, varsayılan 0 |
| `date` | zorunlu |
| `time`, `location` | varsayılan `""` (`location` trim) |
| `description` | `trim`, en fazla 500 karakter |
| `createdAt`, `updatedAt` | `timestamps: true` ile otomatik |

Kurala uymayan POST gövdesi Mongoose `ValidationError` üretir, controller bunu **400**'e çevirir.

```json
{
  "title": "Arduino ile Akıllı Park Sensörü",
  "category": "Atölye",
  "date": "2026-12-08",
  "capacity": 25
}
```

## Klasör yapısı

| Dosya | İşi |
|---|---|
| `src/app.js` | Express uygulaması, middleware, route'lar, 404 ve hata yakalayıcı |
| `src/server.js` | `.env`'i okur, önce veritabanına bağlanır, sonra portu dinler |
| `src/config/database.js` | MongoDB bağlantısı (`MONGODB_URI`) |
| `src/models/event-model.js` | Event schema'sı ve modeli (collection: `events`) |
| `src/data/seed-events.js` | Seed için 6 örnek etkinlik (id alanı yok) |
| `src/seed.js` | `npm run seed`: sil + 6 kayıt ekle |
| `src/routes/event-routes.js` | Hangi adres hangi fonksiyona gider |
| `src/controllers/event-controller.js` | `async/await` ile `Event.find / findById / create` |
| `requests/kampus-api.json` | Postman collection (6 istek) |

## Postman

`requests/kampus-api.json` dosyası Postman'de **Import** ile açılır. İstekleri sırayla çalıştır: **2. istek** listedeki ilk etkinliğin `_id`'sini `eventId` değişkenine kaydeder, **3. istek** bu `_id`'yi kullanır.

| # | İstek | Beklenen |
|---|---|---|
| 1 | GET /health | 200 · ok + student |
| 2 | GET /events | 200 · 6 kayıt (seed sonrası), `_id` + `createdAt` |
| 3 | GET /events/{{eventId}} | 200 · listeden alınan `_id`'li etkinlik |
| 4 | GET /events/yok | 404 · error |
| 5 | POST /events (tam body) | 201 · `_id` + `createdAt` |
| 6 | POST /events (sadece title) | 400 · error |

**Kalıcılık testi:** `npm run seed` → `npm run dev` → 5. istek (201) → terminalde `Ctrl+C` → tekrar `npm run dev` → 2. istek: 7 kayıt, yeni eklenen listede.
