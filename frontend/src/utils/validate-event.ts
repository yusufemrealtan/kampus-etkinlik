import type { EventFormData, EventFormErrors } from "../types/campus-event";

// Veri girer, hata nesnesi çıkar. Hata yoksa {} döner.
export function validateEvent(data: EventFormData): EventFormErrors {
  const errors: EventFormErrors = {};

  if (data.title.trim().length < 3) errors.title = "En az 3 karakter olmalı.";
  if (data.category === "") errors.category = "Bir kategori seçin.";
  if (data.date === "") errors.date = "Tarih boş olamaz.";
  if (data.time === "") errors.time = "Saat boş olamaz.";
  if (data.location.trim() === "") errors.location = "Yer boş olamaz.";

  const capacity = Number(data.capacity);
  if (data.capacity.trim() === "" || !Number.isInteger(capacity) || capacity < 1 || capacity > 1000)
    errors.capacity = "1 ile 1000 arası tam sayı olmalı.";

  if (data.description.trim().length < 10)
    errors.description = "En az 10 karakter olmalı.";

  return errors;
}
