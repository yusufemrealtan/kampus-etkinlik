# Kampüs Etkinlikleri API — Yusuf Emre Altan (2416501065)

Node + Express ile REST API. Sprint 8'den itibaren etkinlikler **MongoDB**'de (Mongoose) tutulur; sunucu kapanıp açılınca POST ile eklenen kayıtlar kaybolmaz. Sprint 9'da tam CRUD (PATCH, DELETE), arama ve yaklaşan etkinlikler eklendi.

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
| GET | `/health` | Sunucu ayakta mı | 200 | — | çalışıyor |
| GET | `/events` | Listeyi getir, tarihe göre sıralı | 200 | — | çalışıyor |
| GET | `/events?search=&category=` | Başlıkta ara (büyük/küçük harf fark etmez) ve/veya kategoriye göre süz | 200 | — | çalışıyor |
| GET | `/events/upcoming` | Bugün ve sonrası, en yakın önce | 200 · tarihe göre sıralı | — | çalışıyor |
| GET | `/events/:id` | Tek etkinlik (`:id` = MongoDB `_id`) | 200 | 404 | çalışıyor |
| POST | `/events` | Yeni etkinlik | 201 | 400 | çalışıyor |
| PATCH | `/events/:id` | Sadece gönderilen alanları güncelle | 200 · güncel kayıt | 400, 404 | çalışıyor |
| DELETE | `/events/:id` | Sil | 204 · gövde yok | 404 | çalışıyor |

**Status code'lar:** 200 tamam · 201 oluşturuldu · 204 içerik yok · 400 eksik/yanlış veri · 404 bulunamadı · 500 beklenmeyen hata

**Tarih:** API'de her yerde `"GG-AA-YYYY"` (`"15-10-2026"`). `"2026-12-20"` ya da `"31-02-2026"` → **400**. Veritabanında gerçek `Date` tutulur (`src/utils/date.js`): metin olsaydı `"05-11-2026"` `"15-10-2026"`dan küçük sayılır, Kasım Ekim'den önce sıralanırdı.

**Route sırası:** `/upcoming` `/:id`'den önce yazılır. Express yukarıdan aşağı dener; ters olursa `upcoming` bir id sanılır ve 404 döner.

**Hata biçimi** (bütün hatalar aynı):

```json
{ "error": { "message": "Event not found" } }
```

- Biçimi yanlış id (`/events/yok`, `/events/111111`) ve biçimi doğru ama kaydı olmayan id → GET, PATCH ve DELETE'te **404** (500 değil). 404 tek yerde: controller'daki `notFound(res)`.
- Beklenmeyen hatalar hata middleware'ine gider: kullanıcıya sadece `"Server error"` döner, sunucu çökmez.

## PATCH ve DELETE kuralları

| İstek | Sonuç | Neden |
|---|---|---|
| PATCH `{ "capacity": 55 }` | 200 | Sadece capacity değişir, yanıtta güncel kayıt (`returnDocument: "after"`) |
| PATCH `{ "title": "  Yeni Başlık  " }` | 200 | `trim` güncellemede de çalışır: `"Yeni Başlık"` |
| PATCH `{ "date": "25-12-2026" }` | 200 | Yanıtta `"25-12-2026"` |
| PATCH `{ }` | 400 | `Body is empty` |
| PATCH `{ "category": "Parti" }` | 400 | `runValidators: true`: enum kuralı güncellemede de çalışır |
| PATCH `{ "date": "2026-12-20" }` | 400 | `CastError` da 400'e çevrilir |
| PATCH `{ "_id": "abc" }` | 400 | `_id`, `createdAt`, `updatedAt`, `__v` değiştirilemez |
| PATCH `/events/yok` | 404 | `Event not found` |
| DELETE `/events/<_id>` | 204 | Gövde yok: `res.status(204).end()` |
| Aynı DELETE bir daha | 404 | Kayıt artık yok |

## Schema kuralları (`src/models/event-model.js`)

| Alan | Kurallar |
|---|---|
| `title` | zorunlu, `trim`, 3–100 karakter |
| `category` | zorunlu, `Seminer` · `Atölye` · `Söyleşi` · `Yarışma` |
| `capacity` | sayı, en az 0, varsayılan 0 |
| `date` | zorunlu, `Date`; gelen `"GG-AA-YYYY"` `set: parseDate` ile çevrilir, yanıtta `get: formatDate` ile yine `"GG-AA-YYYY"` (`toJSON: { getters: true }`) |
| `time`, `location` | varsayılan `""` (`location` trim) |
| `description` | `trim`, en fazla 500 karakter |
| `createdAt`, `updatedAt` | `timestamps: true` ile otomatik |

Kurala uymayan POST gövdesi Mongoose `ValidationError` üretir, controller bunu **400**'e çevirir.

```json
{
  "title": "Arduino ile Akıllı Park Sensörü",
  "category": "Atölye",
  "date": "08-12-2026",
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
| `src/utils/date.js` | `parseDate` ("GG-AA-YYYY" → Date), `formatDate` (Date → "GG-AA-YYYY"), `todayStart` |
| `src/data/seed-events.js` | Seed için 6 örnek etkinlik (id alanı yok, 2'si geçmiş tarihli) |
| `src/seed.js` | `npm run seed`: sil + 6 kayıt ekle |
| `src/routes/event-routes.js` | Hangi adres hangi fonksiyona gider |
| `src/controllers/event-controller.js` | `Event.find / findById / create / findByIdAndUpdate / findByIdAndDelete` |
| `requests/kampus-api.json` | Postman collection (Sprint 9: 18 istek, 45 test) |
| `requests/run-results.json` | Collection'ın son çalıştırma sonucu (18 istek, 45 test, 0 hata) |

## Postman ve newman

`requests/kampus-api.json` Sprint 9 collection'ıdır (hocanın `https://webdersi.vercel.app/test.json` dosyasıyla aynı): **18 istek, 45 test**. Postman'de **Import** ile açılır, collection'a sağ tık › **Run collection** › **Run**.

```bash
npm run seed   # 6 kayıt, 2'si geçmiş tarihli
npm run dev
# başka bir terminalde (newman: npm i -g newman)
newman run https://webdersi.vercel.app/test.json
```

id'ler elle girilmez: **02** listedeki ilk `_id`'yi, **05** yeni oluşan kaydın `_id`'sini kaydeder. PATCH ve DELETE o yeni kayıtla çalışır, en sonda kayıt silinir; seed verisi bozulmaz, istediğin kadar tekrar çalıştırılabilir.

| İstekler | Neyi test eder |
|---|---|
| 01–04 | Sprint 8: health, liste (tarihler GG-AA-YYYY), tek kayıt, 404 |
| 05–07 | POST: 201 ve tarih `"20-12-2026"`, eksik veri 400, yanlış tarih biçimi 400 |
| 08–13 | PATCH: capacity 200, tarih 200, boş body 400, `Parti` 400, `_id` 400, olmayan id 404 |
| 14–15 | `?search=atölye` ve `?search=atölye&category=Atölye` |
| 16 | `/events/upcoming`: geçmiş tarihli yok, en yakın önce |
| 17–18 | DELETE 204 ve boş gövde, tekrar silme 404 |

Son sonuç: **18 istek, 45 test, 0 hata** → `requests/run-results.json`.
