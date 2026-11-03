import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Category, EventFormData, EventFormErrors } from "../../types/campus-event";
import { validateEvent } from "../../utils/validate-event";

interface EventFormProps {
  initialData: EventFormData;
  submitText: string;
  onSubmit: (data: EventFormData) => void;
}

const categoryOptions: Category[] = ["Seminer", "Atölye", "Söyleşi", "Yarışma"];

// Form kaydetmeyi bilmez: geçerli veriyi onSubmit ile sayfaya verir
function EventForm({ initialData, submitText, onSubmit }: EventFormProps) {
  const [data, setData] = useState<EventFormData>(initialData);
  const [errors, setErrors] = useState<EventFormErrors>({});

  // Tek handleChange: name'e bakıp ilgili alanı günceller
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateEvent(data);
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit(data);
  }

  return (
    <form className="form" noValidate onSubmit={handleSubmit}>
      <label htmlFor="title">Etkinlik Adı</label>
      <input
        id="title"
        name="title"
        type="text"
        maxLength={80}
        placeholder="Örn. Kariyer Günleri 2026"
        value={data.title}
        onChange={handleChange}
        aria-invalid={errors.title ? true : undefined}
      />
      <span className="hata-metni">{errors.title}</span>

      <label htmlFor="category">Kategori</label>
      <select
        id="category"
        name="category"
        value={data.category}
        onChange={handleChange}
        aria-invalid={errors.category ? true : undefined}
      >
        <option value="">Seçiniz</option>
        {categoryOptions.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <span className="hata-metni">{errors.category}</span>

      <label htmlFor="date">Tarih</label>
      <input
        id="date"
        name="date"
        type="date"
        value={data.date}
        onChange={handleChange}
        aria-invalid={errors.date ? true : undefined}
      />
      <span className="hata-metni">{errors.date}</span>

      <label htmlFor="time">Saat</label>
      <input
        id="time"
        name="time"
        type="time"
        value={data.time}
        onChange={handleChange}
        aria-invalid={errors.time ? true : undefined}
      />
      <span className="hata-metni">{errors.time}</span>

      <label htmlFor="location">Yer</label>
      <input
        id="location"
        name="location"
        type="text"
        maxLength={120}
        placeholder="Örn. A Blok Konferans Salonu"
        value={data.location}
        onChange={handleChange}
        aria-invalid={errors.location ? true : undefined}
      />
      <span className="hata-metni">{errors.location}</span>

      <label htmlFor="capacity">Kontenjan</label>
      <input
        id="capacity"
        name="capacity"
        type="number"
        min={1}
        max={1000}
        value={data.capacity}
        onChange={handleChange}
        aria-invalid={errors.capacity ? true : undefined}
      />
      <span className="hata-metni">{errors.capacity}</span>

      <label htmlFor="description">Açıklama</label>
      <textarea
        id="description"
        name="description"
        rows={5}
        value={data.description}
        onChange={handleChange}
        aria-invalid={errors.description ? true : undefined}
      />
      <span className="hata-metni">{errors.description}</span>

      <button type="submit">{submitText}</button>
    </form>
  );
}

export default EventForm;
