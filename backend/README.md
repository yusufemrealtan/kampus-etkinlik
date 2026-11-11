# Kampüs Etkinlikleri API — Yusuf Emre Altan (2416501065)

Sprint 7: Node + Express ile REST API. Etkinlikleri JSON olarak verir. Veri şimdilik bellekte tutulur, sunucu yeniden başlayınca POST ile eklenenler kaybolur (Sprint 8'de MongoDB).

## Çalıştırma

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

- `npm run dev`: `node --watch src/server.js` (dosya değişince yeniden başlar)
- `npm start`: `node src/server.js`

Sunucu adresi: `http://localhost:3000`

## Ortam değişkenleri

| Değişken | Varsayılan | Açıklama |
|---|---|---|
| `PORT` | `3000` | Sunucunun dinleyeceği port. `.env` dosyasından okunur. |

`.env` GitHub'a gönderilmez; hangi değişkenlerin gerektiği `.env.example` dosyasında yazar.

## REST sözleşmesi

| Method | Endpoint | Amaç | Başarılı | Hata | Durum |
|---|---|---|---|---|---|
| GET | `/health` | Sunucu ayakta mı | 200 | — | Bu sprint |
| GET | `/events` | Listeyi getir (`?category=Atölye` isteğe bağlı) | 200 | — | Bu sprint |
| GET | `/events/:id` | Tek etkinlik | 200 | 404 | Bu sprint |
| POST | `/events` | Yeni etkinlik | 201 | 400 | Bu sprint |
| PATCH | `/events/:id` | Güncelle | 200 | 400, 404 | Sprint 9 |
| DELETE | `/events/:id` | Sil | 204 | 404 | Sprint 9 |

**Status code'lar:** 200 tamam · 201 oluşturuldu · 204 içerik yok · 400 eksik/yanlış veri · 404 bulunamadı

**Hata biçimi** (bütün hatalar aynı):

```json
{ "error": { "message": "Event not found" } }
```

**POST /events gövdesi:** `title`, `category` ve `date` zorunlu; `capacity`, `time`, `location`, `description` isteğe bağlı.

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
| `src/app.js` | Express uygulaması, middleware, route'ları bağlar |
| `src/server.js` | `.env`'i okur, portu dinler |
| `src/routes/event-routes.js` | Hangi adres hangi fonksiyona gider |
| `src/controllers/event-controller.js` | İsteği işler, yanıtı döndürür |
| `src/data/events.js` | Bellek içi 6 etkinlik |
| `requests/kampus-api.json` | Postman collection (6 istek) |

## Postman

`requests/kampus-api.json` dosyası Postman'de **Import** ile açılır. İçinde 6 istek var:

| # | İstek | Beklenen |
|---|---|---|
| 1 | GET /health | 200 · ok + student |
| 2 | GET /events | 200 · 6 kayıt |
| 3 | GET /events/event-2 | 200 · event-2 |
| 4 | GET /events/yok | 404 · error |
| 5 | POST /events (tam body) | 201 · yeni id |
| 6 | POST /events (sadece title) | 400 · error |
