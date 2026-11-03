import { Link } from "react-router-dom";
import type { CampusEvent } from "../../types/campus-event";
import { formatDate } from "../../utils/format-date";

interface EventDetailProps {
  event: CampusEvent;
}

// Sadece çizer: useParams ve useEvents yok, veriyi sayfa verir
function EventDetail({ event }: EventDetailProps) {
  return (
    <article className={event.image ? "detay" : "detay afissiz"}>
      {event.image && (
        <figure className="detay-afis">
          <img src={event.image} alt={`${event.title} afişi`} />
          <figcaption>{event.title} afişi</figcaption>
        </figure>
      )}

      <aside className="kunye">
        <h2>Etkinlik Künyesi</h2>
        <dl>
          <dt>Tarih</dt>
          <dd>{formatDate(event.date)}, {event.time}</dd>
          <dt>Yer</dt>
          <dd>{event.location}</dd>
          <dt>Kategori</dt>
          <dd>{event.category}</dd>
          <dt>Kontenjan</dt>
          <dd>{event.capacity} kişi</dd>
        </dl>
      </aside>

      <section className="aciklama">
        <h2>Açıklama</h2>
        <p>{event.description}</p>
        <div className="butonlar">
          <Link className="buton" to="/events">
            ← Listeye dön
          </Link>
          <Link className="buton" to={`/admin/${event.id}/edit`}>
            Bu etkinliği güncelle
          </Link>
        </div>
      </section>
    </article>
  );
}

export default EventDetail;
