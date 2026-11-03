// Kategori sadece bu 4 değerden biri olabilir (union type)
export type Category = "Seminer" | "Atölye" | "Söyleşi" | "Yarışma";

// Bir etkinlik neye benzer? (tarif)
export interface CampusEvent {
  id: string;
  title: string;
  category: Category;
  date: string;        // "2026-10-12"
  time: string;        // "14:00"
  location: string;
  capacity: number;
  description: string;
  image?: string;      // afiş isteğe bağlı (?)
}

// Formdaki veri: id yok, input hep metin verdiği için capacity string,
// kategori henüz seçilmemişse ""
export interface EventFormData {
  title: string;
  category: Category | "";
  date: string;
  time: string;
  location: string;
  capacity: string;
  description: string;
  image?: string;      // formda alanı yok; güncellemede afiş kaybolmasın diye taşınır
}

// Her alana en fazla bir hata mesajı
export type EventFormErrors = Partial<Record<keyof EventFormData, string>>;
