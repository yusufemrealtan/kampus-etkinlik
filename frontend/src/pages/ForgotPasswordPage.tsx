import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = email.includes("@") ? "" : "Geçerli bir e-posta girin.";
    setError(found);
    setSent(found === "");
  }

  return (
    <>
      <h2 className="bolum-baslik">Şifremi Unuttum</h2>
      <p className="form-aciklama">
        Kayıtlı e-posta adresinizi yazın; şifre sıfırlama bağlantısı gönderelim.
      </p>
      <form className="form" noValidate onSubmit={handleSubmit}>
        <label htmlFor="email">E-posta</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? true : undefined}
        />
        <span className="hata-metni">{error}</span>

        <button type="submit">Bağlantı gönder</button>
      </form>

      {sent && <p className="mesaj mesaj-basari">Bağlantı {email} adresine gönderildi (demo).</p>}

      <p className="form-linkler">
        <Link to="/login">← Girişe dön</Link>
      </p>
    </>
  );
}

export default ForgotPasswordPage;
