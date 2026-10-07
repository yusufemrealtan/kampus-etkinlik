import { events } from "./data.js";

const container = document.querySelector("#detay");
const baslik = document.querySelector("#sayfa-basligi");

// Adres çubuğundaki ?id= değerini oku
const id = new URLSearchParams(location.search).get("id");

// Bu id'ye sahip etkinliği bul (bulamazsa undefined döner)
const event = events.find((e) => e.id === id);

if (!event) {
  // Önce kontrol: etkinlik yoksa hata kutusu göster
  baslik.textContent = "Etkinlik bulunamadı";
  document.title = "Etkinlik bulunamadı";
  container.innerHTML = `
    <div class="hata-kutusu" id="hata-metni"></div>
    <a class="buton" href="etkinlikler.html">← Listeye dön</a>`;

  const hataMetni = document.querySelector("#hata-metni");
  if (id) {
    hataMetni.textContent = `"${id}" numaralı bir etkinlik yok. Listeden bir etkinlik seçin.`;
  } else {
    hataMetni.textContent = "Hiçbir etkinlik seçilmedi. Listeden bir etkinlik seçin.";
  }
} else {
  // Etkinlik bulundu: başlık, sekme adı ve künyeyi doldur
  const tarih = new Date(`${event.date}T${event.time}`);
  const uzunTarih = tarih.toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
  });
  const kisaTarih = tarih.toLocaleDateString("tr-TR", {
    day: "numeric", month: "long",
  });

  baslik.textContent = event.title;
  document.title = event.title;

  container.innerHTML = `
    <article class="detay">
      <figure class="detay-afis">
        <div class="afis" role="img" aria-label="${event.title} afişi">
          <span class="afis-baslik">${event.title}</span>
          <span class="afis-alt">${kisaTarih} · ${event.location}</span>
        </div>
        <figcaption>${event.title} afişi</figcaption>
      </figure>

      <aside class="kunye">
        <h2>Etkinlik Künyesi</h2>
        <dl>
          <dt>Tarih</dt>     <dd>${uzunTarih}, ${event.time}</dd>
          <dt>Yer</dt>       <dd>${event.location}</dd>
          <dt>Kategori</dt>  <dd>${event.category}</dd>
          <dt>Kontenjan</dt> <dd>${event.capacity} kişi</dd>
        </dl>
      </aside>

      <section class="aciklama">
        <h2>Açıklama</h2>
        <p>${event.description}</p>
        <div class="butonlar">
          <a class="buton" href="etkinlikler.html">← Listeye dön</a>
          <a class="buton" href="etkinlik-guncelle.html?id=${event.id}">Bu etkinliği güncelle</a>
        </div>
      </section>
    </article>`;
}