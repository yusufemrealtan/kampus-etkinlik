interface EventFormProps {
  onSubmit: () => void;
}

function EventForm({ onSubmit }: EventFormProps) {
  return (
    <>
      <p className="form-aciklama">
        Bu sprintte form sadece görünüm; kayıt yapılmaz.
      </p>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
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

        <button type="submit">Kaydet</button>
      </form>
    </>
  );
}

export default EventForm;