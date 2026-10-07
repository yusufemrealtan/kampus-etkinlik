import { events } from "./data.js";

// Sayfadaki boş container
const list = document.querySelector("#etkinlik-listesi");

// "2026-10-12" + "14:00" → "12 Ekim 2026, 14:00"
function tarihYaz(event) {
  const tarih = new Date(`${event.date}T${event.time}`);
  const gun = tarih.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${gun}, ${event.time}`;
}

// ADIM 4: Bir etkinlikten bir kart üret
function createCard(event) {
  return `
    <article class="kart">
      <h2>${event.title}</h2>
      <p><span class="etiket">${event.category}</span></p>
      <p>Tarih: ${tarihYaz(event)}</p>
      <p>Yer: ${event.location}</p>
      <p>Kontenjan: ${event.capacity} kişi</p>
      <p>${event.description}</p>
      <a href="etkinlik-detay.html?id=${event.id}">Detayları gör</a>
    </article>`;
}

// Verilen dizideki tüm etkinlikleri container'a yaz
function render(dizi) {
  list.innerHTML = dizi.map(createCard).join("");
}

// ADIM 5: data-limit varsa (ana sayfa) en yakın 2 etkinlik, yoksa hepsi
if (list.dataset.limit) {
  const yaklasan = [...events]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, Number(list.dataset.limit));
  render(yaklasan);
} else {
  render(events);
}

// ADIM 7: Filtre (sadece etkinlikler sayfasında var)
const filtreFormu = document.querySelector("#filtre-formu");

if (filtreFormu) {
  const arama = document.querySelector("#arama");
  const kategoriSecimi = document.querySelector("#kategori-filtre");
  const sonucSatiri = document.querySelector("#sonuc");

  // Kategorileri veriden üret, her biri bir kez (new Set)
  const kategoriler = [...new Set(events.map((e) => e.category))];
  kategoriler.forEach((kategori) => {
    kategoriSecimi.insertAdjacentHTML(
      "beforeend",
      `<option value="${kategori}">${kategori}</option>`
    );
  });

  function filtrele() {
    const aranan = arama.value.trim().toLocaleLowerCase("tr-TR");
    const secilenKategori = kategoriSecimi.value;

    const sonuc = events.filter((e) => {
      const metin = `${e.title} ${e.description} ${e.location}`
        .toLocaleLowerCase("tr-TR");
      const metinUyuyor = metin.includes(aranan);
      const kategoriUyuyor =
        secilenKategori === "" || e.category === secilenKategori;
      return metinUyuyor && kategoriUyuyor;
    });

    render(sonuc);

    if (sonuc.length === 0) {
      sonucSatiri.textContent = "Aramanıza uygun etkinlik bulunamadı.";
    } else {
      sonucSatiri.textContent = `${sonuc.length} etkinlik listeleniyor.`;
    }
  }

  arama.addEventListener("input", filtrele);           // yazdıkça
  kategoriSecimi.addEventListener("change", filtrele); // seçim değişince
  filtreFormu.addEventListener("submit", (e) => {
    e.preventDefault();                                // Enter'da sayfa yenilenmesin
    filtrele();
  });

  filtrele(); // sayfa açılınca "6 etkinlik listeleniyor." yazsın
}