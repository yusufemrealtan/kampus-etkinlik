import { Link } from "react-router-dom";
import { useEvents } from "../context/EventsContext";
import { formatDate } from "../utils/format-date";

function AdminPage() {
  const { events, deleteEvent } = useEvents();

  // Silmeden önce onay sorulur
  function handleDelete(id: string, title: string) {
    if (window.confirm(`"${title}" silinsin mi?`)) deleteEvent(id);
  }

  return (
    <>
      <div className="ust-satir">
        <h2 className="bolum-baslik">Etkinlik Yönetimi</h2>
        <Link className="buton" to="/admin/new">
          + Yeni etkinlik
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="sonuc">Henüz etkinlik yok.</p>
      ) : (
        <table className="tablo">
          <thead>
            <tr>
              <th>Etkinlik</th>
              <th>Tarih</th>
              <th>Kategori</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td data-baslik="Etkinlik">
                  <Link to={`/events/${event.id}`}>{event.title}</Link>
                </td>
                <td data-baslik="Tarih">{formatDate(event.date)}</td>
                <td data-baslik="Kategori">{event.category}</td>
                <td className="islemler">
                  <Link className="buton" to={`/admin/${event.id}/edit`}>
                    Düzenle
                  </Link>
                  <button
                    type="button"
                    className="buton buton-sil"
                    onClick={() => handleDelete(event.id, event.title)}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default AdminPage;
