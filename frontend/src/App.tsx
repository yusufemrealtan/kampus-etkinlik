import "./App.css";
import { useEffect, useState } from "react";
import type { Category } from "./types/campus-event";
import type { PageName } from "./types/page";
import { events } from "./data/events";
import { filterByCategory, findEventById, searchEvents } from "./utils/filter-events";
import Header from "./components/layout/Header";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import EventList from "./components/events/EventList";
import EventFilter from "./components/events/EventFilter";
import EventDetail from "./components/events/EventDetail";
import EventForm from "./components/forms/EventForm";

// En yakın 2 etkinlik ve kategori listesi
const upcoming = [...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 2);
const categories = [...new Set(events.map((e) => e.category))];

function App() {
  // State'ler App'te kalır
  const [page, setPage] = useState<PageName>("home");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState<Category | "">("");

  function go(next: PageName, id: string | null = null) {
    setPage(next);
    setSelectedId(id);
    window.scrollTo(0, 0);
  }

  // Hesaplanan değerler
  const selected = selectedId ? findEventById(events, selectedId) : undefined;
  const filtered = filterByCategory(searchEvents(events, searchText), category);

  let title = "Kampüs Etkinlikleri";
  if (page === "events") title = "Tüm Etkinlikler";
  if (page === "detail") title = selected ? selected.title : "Etkinlik bulunamadı";
  if (page === "add") title = "Etkinlik Ekle";
  if (page === "update") title = "Etkinlik Güncelle";

  let text: string | undefined;
  if (page === "home") text = "Fakültedeki seminer, atölye ve söyleşileri tek yerden takip edin.";
  if (page === "events") text = "Ekim ayında kampüste düzenlenen etkinlikler.";

  useEffect(() => {
    document.title =
      title === "Kampüs Etkinlikleri" ? title : `Kampüs Etkinlikleri — ${title}`;
  }, [title]);

  return (
    <>
      <Header title={title} text={text} />
      <Navigation current={page} onNavigate={go} />

      <main>
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

        {page === "detail" && !selected && (
          <>
            <div className="hata-kutusu">Etkinlik bulunamadı. Listeden bir etkinlik seçin.</div>
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

        {page === "detail" && selected && (
          <EventDetail
            event={selected}
            onBack={() => go("events")}
            onEdit={(id) => go("update", id)}
          />
        )}

        {(page === "add" || page === "update") && (
          <EventForm key={page} onSubmit={() => window.scrollTo(0, 0)} />
        )}
      </main>

      <Footer />
    </>
  );
}

export default App;