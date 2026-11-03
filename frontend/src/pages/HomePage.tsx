import { Link } from "react-router-dom";
import { useEvents } from "../context/EventsContext";
import EventList from "../components/events/EventList";

function HomePage() {
  const { events } = useEvents();

  // En yakın 2 etkinlik
  const upcoming = [...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 2);

  return (
    <>
      <h2 className="bolum-baslik">Yaklaşan 2 Etkinlik</h2>
      <section className="kartlar">
        <EventList events={upcoming} />
      </section>
      <Link className="buton" to="/events">
        Tüm etkinlikleri gör
      </Link>
    </>
  );
}

export default HomePage;
