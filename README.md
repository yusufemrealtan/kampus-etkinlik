https://yusufemrealtan-frontend.vercel.app

# Kampüs Etkinlikleri — Yusuf Emre Altan (2416501065)

## Kurulum

```bash
cd frontend
npm install
npm run dev
```

## Route listesi

| Adres | Sayfa |
|---|---|
| `/` | HomePage — yaklaşan 2 etkinlik |
| `/events` | EventsPage — arama ve kategori filtresi |
| `/events/:id` | EventDetailPage — etkinlik detayı |
| `/login` | LoginPage — giriş formu |
| `/register` | RegisterPage — kayıt formu |
| `/forgot-password` | ForgotPasswordPage — şifremi unuttum |
| `/admin` | AdminPage — tablo, düzenle, sil |
| `/admin/new` | AddEventPage — etkinlik ekle |
| `/admin/:id/edit` | EditEventPage — etkinlik güncelle |
| `*` | NotFoundPage — sayfa bulunamadı |

## Sprint 6 + Vize — Router, Context ve Yönetim

- React Router: `main.tsx`'te `BrowserRouter`, `App.tsx`'te 10 `Route`. Menü `NavLink`, sayfa içi bağlantılar `Link`.
- `context/EventsContext.tsx`: etkinlik listesi ve `addEvent`, `updateEvent`, `deleteEvent` (spread, map, filter). Veri bellekte tutulur; sayfa yenilenince başa döner.
- `components/forms/EventForm.tsx`: controlled form, `utils/validate-event.ts` ile 7 alan doğrulaması. Ekle ve Güncelle sayfaları aynı formu kullanır.
- Giriş, kayıt ve şifremi unuttum sayfalarında form doğrulaması var (gerçek giriş Sprint 10'da).
- `frontend/vercel.json`: alt sayfalar yenilendiğinde 404 vermemesi için tüm adresler `index.html`'e yönlendirilir.

## Sprint 2 — CSS ve Responsive

- Öğrenci: Yusuf Emre Altan — 2416501065
- CSS dosyası: `sprint2/css/2416501065.css`
- Ton: 345 · Font: Times New Roman
- Canlı adres: https://kampus-etkinlik.vercel.app
## Sprint 3 — JavaScript ve DOM
- Veriler: `sprint3/js/data.js` (6 etkinlik)
- Modüller: event-list.js, event-detail.js, event-form.js
## Sprint 4 — Vite, TypeScript ve React

Proje `frontend/` klasöründe. Çalıştırmak için: `cd frontend`, `npm install`, `npm run dev`.

| Dosya | Görevi |
|---|---|
| package.json | Proje adı, komutlar (dev, build) ve paket listesi. |
| package-lock.json | Yüklenen paketlerin tam sürümleri. |
| node_modules/ | İndirilen paketler; GitHub'a gönderilmez. |
| tsconfig*.json | TypeScript ayarları. |
| vite.config.ts | Vite ayarları ve React eklentisi. |
| index.html | Tek HTML dosyası; içinde boş div#root bulunur. |
| src/main.tsx | React'i başlatır ve App bileşenini root'a çizer. |
| src/App.tsx | Uygulamanın ana bileşeni; 5 sayfanın hepsi burada. |
| src/App.css | Uygulamanın stilleri; Sprint 3'teki CSS. |
| src/index.css | Genel stil dosyası; bu sprintte boş. |
| src/types/campus-event.ts | Etkinlik ve kategori tipleri. |
| src/data/events.ts | Tipli 6 etkinlik verisi. |
| src/utils/filter-events.ts | Arama, kategori filtresi ve id ile bulma fonksiyonları. |
| public/ | Olduğu gibi kopyalanan dosyalar (afis.svg). |
## Sprint 5 — React Bileşenleri
App.tsx 9 bileşene bölündü: Header, Navigation, Footer (layout),
EventCard, EventList, EventFilter, EventDetail (events), EventForm (forms).
State App'te kalır; bileşenler veriyi props ile alır, olayları callback ile bildirir.