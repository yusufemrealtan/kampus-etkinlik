import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  password2?: string;
}

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found: RegisterErrors = {};
    if (name.trim().length < 3) found.name = "Ad soyad en az 3 karakter olmalı.";
    if (!email.includes("@")) found.email = "Geçerli bir e-posta girin.";
    if (password.length < 6) found.password = "Şifre en az 6 karakter olmalı.";
    if (password2 !== password) found.password2 = "Şifreler aynı değil.";
    setErrors(found);
    setSent(Object.keys(found).length === 0);
  }

  return (
    <>
      <h2 className="bolum-baslik">Kayıt Ol</h2>
      <form className="form" noValidate onSubmit={handleSubmit}>
        <label htmlFor="name">Ad Soyad</label>
        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={errors.name ? true : undefined}
        />
        <span className="hata-metni">{errors.name}</span>

        <label htmlFor="email">E-posta</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={errors.email ? true : undefined}
        />
        <span className="hata-metni">{errors.email}</span>

        <label htmlFor="password">Şifre</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={errors.password ? true : undefined}
        />
        <span className="hata-metni">{errors.password}</span>

        <label htmlFor="password2">Şifre (tekrar)</label>
        <input
          id="password2"
          name="password2"
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          aria-invalid={errors.password2 ? true : undefined}
        />
        <span className="hata-metni">{errors.password2}</span>

        <button type="submit">Kayıt ol</button>
      </form>

      {sent && <p className="mesaj mesaj-basari">Bilgiler geçerli. Gerçek kayıt Sprint 10'da.</p>}

      <p className="form-linkler">
        <Link to="/login">Zaten hesabın var mı? Giriş yap</Link>
      </p>
    </>
  );
}

export default RegisterPage;
