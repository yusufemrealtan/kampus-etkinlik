import "./App.css";
import { useEffect, useState } from "react";
import type { CampusEvent, Category } from "./types/campus-event";
import { events } from "./data/events";
import {
  filterByCategory,
  findEventById,
  searchEvents,
} from "./utils/filter-events";

// ADIM 8: Sayfa adları için tip
type PageName = "home" | "events" | "detail" | "add" | "update";

// ADIM 8: Menü öğeleri bir dizide (Güncelle menüde yok)
const menuItems: { page: PageName; label: string }[] = [
  { page: "home", label: "Ana Sayfa" },
  { page: "events", label: "Etkinlikler" },
  { page: "add", label: "Ekle" },
];

// ADIM 9: En yakın 2 etkinlik (kopyala → sırala → ilk 2)
const upcoming = [...events]
  .sort((a, b) => a.date.localeCompare(b.date))
  .slice(0, 2);

// ADIM 10: Kategori seçenekleri veriden, her biri bir kez
const categories = [...new Set(events.map((e) => e.category))];

// ADIM 9: Tarih → "12 Ekim 2026"
const formatDate = (event: CampusEvent) =>
  new Date(`${event.date}T${event.time}`).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function App() {
  // ADIM 8: Açık sayfa ve seçili etkinlik
  const [page, setPage] = useState<PageName>("home");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ADIM 10: Arama metni ve seçili kategori
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState<Category | "">("");

  // ADIM 8: Sayfa değiştiren tek fonksiyon
  function go(next: PageName, id: string | null = null) {
    setPage(next);
    setSelectedId(id);
    window.scrollTo(0, 0);
  }

  // ADIM 12: Seçili etkinlik
  const selected = selectedId ? findEventById(events, selectedId) : undefined;

  // ADIM 10: Filtreli liste state değil, her çizimde hesaplanır
  const filtered = filterByCategory(searchEvents(events, searchText), category);

  // Sayfaya göre ana başlık
  let title = "Kampüs Etkinlikleri";
  if (page === "events") title = "Tüm Etkinlikler";
  if (page === "detail") title = selected ? selected.title : "Etkinlik bulunamadı";
  if (page === "add") title = "Etkinlik Ekle";
  if (page === "update") title = "Etkinlik Güncelle";

  // ADIM 11: Başlık değişince sekme adı da değişsin
  useEffect(() => {
    document.title =
      title === "Kampüs Etkinlikleri" ? title : `Kampüs Etkinlikleri — ${title}`;
  }, [title]);

  // ADIM 9: Bir etkinlikten kart (ana sayfa ve liste ortak kullanır)
  function renderCard(event: CampusEvent) {
    return (
      <article className="kart" key={event.id}>
        <h2>{event.title}</h2>
        <p>
          <span className="etiket">{event.category}</span>
        </p>
        <p>Tarih: {formatDate(event)}, {event.time}</p>
        <p>Yer: {event.location}</p>
        <p>Kontenjan: {event.capacity} kişi</p>
        <p>{event.description}</p>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            go("detail", event.id);
          }}
        >
          Detayları gör
        </a>
      </article>
    );
  }

  return (
    <>
      {/* ADIM 7: Başlık ve menü */}
      <header className="site-baslik">
        <h1>{title}</h1>
        {page === "home" && (
          <p className="alt-baslik">
            Fakültedeki seminer, atölye ve söyleşileri tek yerden takip edin.
          </p>
        )}
        {page === "events" && (
          <p className="alt-baslik">Ekim ayında kampüste düzenlenen etkinlikler.</p>
        )}
        <nav className="menu">
          <ul>
            {menuItems.map((item) => (
              <li key={item.page}>
                <a
                  href="#"
                  aria-current={page === item.page ? "page" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    go(item.page);
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        {/* ADIM 9: Ana sayfa */}
        {page === "home" && (
          <>
            <h2>Yaklaşan 2 Etkinlik</h2>
            <section className="kartlar">{upcoming.map(renderCard)}</section>
            <a
              className="buton"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                go("events");
              }}
            >
              Tüm etkinlikleri gör
            </a>
          </>
        )}

        {/* ADIM 10: Etkinlikler sayfası */}
        {page === "events" && (
          <>
            <form className="filtre" onSubmit={(e) => e.preventDefault()}>
              <div className="alan">
                <label htmlFor="arama">Etkinlik ara</label>
                <input
                  type="search"
                  id="arama"
                  placeholder="Örn. atölye, kariyer"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <div className="alan">
                <label htmlFor="kategori-filtre">Kategori</label>
                <select
                  id="kategori-filtre"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category | "")}
                >
                  <option value="">Tümü</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </form>

            <p id="sonuc">
              {filtered.length === 0
                ? "Aramanıza uygun etkinlik bulunamadı."
                : `${filtered.length} etkinlik listeleniyor.`}
            </p>

            <section className="kartlar uc-sutun">{filtered.map(renderCard)}</section>
          </>
        )}

        {/* ADIM 12: Detay — bulunamazsa */}
        {page === "detail" && !selected && (
          <>
            <div className="hata-kutusu">
              Etkinlik bulunamadı. Listeden bir etkinlik seçin.
            </div>
            <a
              className="buton"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                go("events");
              }}
            >
              ← Listeye dön
            </a>
          </>
        )}

        {/* ADIM 12: Detay — bulunursa */}
        {page === "detail" && selected && (
          <article className={selected.image ? "detay" : "detay afissiz"}>
            {selected.image && (
              <figure className="detay-afis">
                <img src={selected.image} alt={`${selected.title} afişi`} />
                <figcaption>{selected.title} afişi</figcaption>
              </figure>
            )}

            <aside className="kunye">
              <h2>Etkinlik Künyesi</h2>
              <dl>
                <dt>Tarih</dt>
                <dd>{formatDate(selected)}, {selected.time}</dd>
                <dt>Yer</dt>
                <dd>{selected.location}</dd>
                <dt>Kategori</dt>
                <dd>{selected.category}</dd>
                <dt>Kontenjan</dt>
                <dd>{selected.capacity} kişi</dd>
              </dl>
            </aside>

            <section className="aciklama">
              <h2>Açıklama</h2>
              <p>{selected.description}</p>
              <div className="butonlar">
                <a
                  className="buton"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    go("events");
                  }}
                >
                  ← Listeye dön
                </a>
                <a
                  className="buton"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    go("update", selected.id);
                  }}
                >
                  Bu etkinliği güncelle
                </a>
              </div>
            </section>
          </article>
        )}

        {/* ADIM 13: Ekle ve Güncelle — aynı form, sadece görünüm */}
        {(page === "add" || page === "update") && (
          <>
            <p className="form-aciklama">
              Bu sprintte form sadece görünüm; kayıt yapılmaz.
            </p>
            <form className="form" key={page} onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="title">Etkinlik Adı</label>
              <input
                id="title"
                name="title"
                type="text"
                maxLength={80}
                placeholder="Örn. Kariyer Günleri 2026"
              />

              <label htmlFor="category">Kategori</label>
              <select id="category" name="category" defaultValue="">
                <option value="">Seçiniz</option>
                <option value="Seminer">Seminer</option>
                <option value="Atölye">Atölye</option>
                <option value="Söyleşi">Söyleşi</option>
                <option value="Yarışma">Yarışma</option>
              </select>

              <label htmlFor="date">Tarih</label>
              <input id="date" name="date" type="date" />

              <label htmlFor="time">Saat</label>
              <input id="time" name="time" type="time" />

              <label htmlFor="location">Yer</label>
              <input
                id="location"
                name="location"
                type="text"
                maxLength={120}
                placeholder="Örn. A Blok Konferans Salonu"
              />

              <label htmlFor="capacity">Kontenjan</label>
              <input id="capacity" name="capacity" type="number" min={1} max={1000} />

              <label htmlFor="description">Açıklama</label>
              <textarea id="description" name="description" rows={5} />

              <button type="submit">{page === "update" ? "Güncelle" : "Kaydet"}</button>
            </form>
          </>
        )}
      </main>

      <footer>
        <p>Yusuf Emre Altan · 2416501065 · 2026</p>
      </footer>
    </>
  );
}

export default App;