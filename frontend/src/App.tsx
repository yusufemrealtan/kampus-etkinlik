import "./App.css";
import { useEffect, useState } from "react";
import type { Category } from "./types/campus-event";
import type { PageName } from "./types/page";
import { events } from "./data/events";
import {
  filterByCategory,
  findEventById,
  searchEvents,
} from "./utils/filter-events";
// ← ADIM 8: formatDate import'u silindi
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import Navigation from "./components/layout/Navigation";
import EventList from "./components/events/EventList";
import EventFilter from "./components/events/EventFilter";
import EventDetail from "./components/events/EventDetail"; // ← ADIM 8

// En yakın 2 etkinlik (kopyala → sırala → ilk 2)
const upcoming = [...events]
  .sort((a, b) => a.date.localeCompare(b.date))
  .slice(0, 2);

// Kategori seçenekleri veriden, her biri bir kez
const categories = [...new Set(events.map((e) => e.category))];

function App() {
  // Açık sayfa ve seçili etkinlik
  const [page, setPage] = useState<PageName>("home");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Arama metni ve seçili kategori (state App'te kalır: lifting state)
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState<Category | "">("");

  // Sayfa değiştiren tek fonksiyon
  function go(next: PageName, id: string | null = null) {
    setPage(next);
    setSelectedId(id);
    window.scrollTo(0, 0);
  }

  // Seçili etkinlik (bulmak App'in işi)
  const selected = selectedId ? findEventById(events, selectedId) : undefined;

  // Filtreli liste her çizimde hesaplanır
  const filtered = filterByCategory(searchEvents(events, searchText), category);

  // Sayfaya göre ana başlık
  let title = "Kampüs Etkinlikleri";
  if (page === "events") title = "Tüm Etkinlikler";
  if (page === "detail") title = selected ? selected.title : "Etkinlik bulunamadı";
  if (page === "add") title = "Etkinlik Ekle";
  if (page === "update") title = "Etkinlik Güncelle";

  // Sayfaya göre alt yazı (sadece ana sayfa ve etkinliklerde)
  let text: string | undefined;
  if (page === "home") text = "Fakültedeki seminer, atölye ve söyleşileri tek yerden takip edin.";
  if (page === "events") text = "Ekim ayında kampüste düzenlenen etkinlikler.";

  // Başlık değişince sekme adı da değişsin
  useEffect(() => {
    document.title =
      title === "Kampüs Etkinlikleri" ? title : `Kampüs Etkinlikleri — ${title}`;
  }, [title]);

  return (
    <>
      <Header title={title} text={text} />
      <Navigation current={page} onNavigate={go} />

      <main>
        {/* Ana sayfa */}
        {page === "home" && (
          <>
            <h2>Yaklaşan 2 Etkinlik</h2>
            <section className="kartlar">
              <EventList events={upcoming} onShowDetail={(id) => go("detail", id)} />
            </section>
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

        {/* Etkinlikler sayfası */}
        {page === "events" && (
          <>
            <EventFilter
              searchText={searchText}
              category={category}
              categories={categories}
              onSearchChange={setSearchText}
              onCategoryChange={setCategory}
            />

            {filtered.length > 0 && (
              <p id="sonuc">{filtered.length} etkinlik listeleniyor.</p>
            )}

            <section className="kartlar uc-sutun">
              <EventList
                events={filtered}
                onShowDetail={(id) => go("detail", id)}
                emptyText="Aramanıza uygun etkinlik bulunamadı."
              />
            </section>
          </>
        )}

        {/* Detay — bulunamazsa (App'te kalır) */}
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

        {/* Detay — bulunursa ← ADIM 8 */}
        {page === "detail" && selected && (
          <EventDetail
            event={selected}
            onBack={() => go("events")}
            onEdit={(id) => go("update", id)}
          />
        )}

        {/* Ekle ve Güncelle — aynı form, sadece görünüm */}
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

      <Footer />
    </>
  );
}

export default App;