import { events } from "./data.js";

const form = document.querySelector("#etkinlik-formu");
const mesaj = document.querySelector("#form-mesaj");

// Güncelleme sayfası mı? (forma data-mode="guncelle" işareti koyduk)
const guncelleModu = form.dataset.mode === "guncelle";
let etkinlik = null;

// ---------- ADIM 11: Güncelleme sayfası formu doldurur ----------
if (guncelleModu) {
  const id = new URLSearchParams(location.search).get("id");
  etkinlik = events.find((e) => e.id === id);

  if (etkinlik) {
    form.elements.ad.value = etkinlik.title;
    form.elements.kategori.value = etkinlik.category;
    form.elements.tarih.value = etkinlik.date;
    form.elements.saat.value = etkinlik.time;
    form.elements.yer.value = etkinlik.location;
    form.elements.kontenjan.value = etkinlik.capacity;
    form.elements.aciklama.value = etkinlik.description;
  } else {
    // id yok ya da yanlış: form yerine uyarı göster
    document.querySelector(".form-aciklama").remove();
    form.outerHTML = `
      <div class="hata-kutusu">
        Güncellenecek etkinlik seçilmedi. Önce listeden bir etkinlik seçin,
        detay sayfasındaki "Bu etkinliği güncelle" butonunu kullanın.
      </div>
      <a class="buton" href="etkinlikler.html">Etkinliklere git</a>`;
  }
}

// ---------- ADIM 10: Hataları alanların altına yaz ----------
const alanlar = ["ad", "kategori", "tarih", "saat", "yer", "kontenjan"];

function hatalariGoster(errors) {
  alanlar.forEach((alanAdi) => {
    const alan = form.elements[alanAdi];
    const hataYeri = document.querySelector(`#${alanAdi}-hata`);

    if (errors[alanAdi]) {
      hataYeri.textContent = errors[alanAdi];
      alan.setAttribute("aria-invalid", "true");   // kırmızı yap
    } else {
      hataYeri.textContent = "";                   // eski hatayı temizle
      alan.removeAttribute("aria-invalid");
    }
  });
}

// ---------- ADIM 9: Formu yakala, nesneye çevir ----------
function kaydet(e) {
  e.preventDefault(); // sayfa yenilenmesin

  const fd = new FormData(form);
  const kontenjanYazisi = fd.get("kontenjan").trim();

  // Formdaki name'ler Türkçe, nesnenin alanları data.js gibi İngilizce
  const data = {
    id: guncelleModu ? etkinlik.id : `event-${events.length + 1}`,
    title: fd.get("ad").trim(),
    category: fd.get("kategori"),
    date: fd.get("tarih"),
    time: fd.get("saat"),
    location: fd.get("yer").trim(),
    capacity: kontenjanYazisi === "" ? null : Number(kontenjanYazisi),
    description: fd.get("aciklama").trim(),
  };

  // ADIM 10: Kurallarla kontrol et, hataları topla
  const errors = {};
  if (data.title.length < 3) errors.ad = "Etkinlik adı en az 3 karakter olmalı.";
  if (data.category === "") errors.kategori = "Bir kategori seçin.";
  if (data.date === "") errors.tarih = "Tarih seçin.";
  if (data.time === "") errors.saat = "Saat seçin.";
  if (data.location === "") errors.yer = "Yer bilgisini yazın.";
  if (
    data.capacity !== null &&
    (!Number.isInteger(data.capacity) || data.capacity < 1 || data.capacity > 1000)
  ) {
    errors.kontenjan = "Kontenjan 1 ile 1000 arasında bir sayı olmalı.";
  }

  hatalariGoster(errors);

  // Hata varsa: mesaj göster, ilk hatalı alana git, dur
  if (Object.keys(errors).length > 0) {
    mesaj.className = "mesaj hatali";
    mesaj.textContent = "Formda hatalı alanlar var. Kırmızı alanları düzeltip tekrar deneyin.";
    form.elements[Object.keys(errors)[0]].focus();
    return;
  }

  // Hata yoksa: yeşil kutu + nesne
  console.log(data);
  const baslikMetni = guncelleModu
    ? "Etkinlik güncellendi (bu sprintte kaydedilmez):"
    : "Etkinlik oluşturuldu (bu sprintte kaydedilmez):";

  mesaj.className = "mesaj basarili";
  mesaj.innerHTML = `<p>${baslikMetni}</p><pre></pre>`;
  mesaj.querySelector("pre").textContent = JSON.stringify(data, null, 2);
}

// Formu sadece gerçekten sayfadaysa dinle
if (!guncelleModu || etkinlik) {
  form.addEventListener("submit", kaydet);
}