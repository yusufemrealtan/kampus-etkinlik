import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

interface LoginErrors {
  email?: string;
  password?: string;
}

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [sent, setSent] = useState(false);

  // Bu sprintte sadece doğrulama: bilgiler hiçbir yere gönderilmez
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found: LoginErrors = {};
    if (!email.includes("@")) found.email = "Geçerli bir e-posta girin.";
    if (password.length < 6) found.password = "Şifre en az 6 karakter olmalı.";
    setErrors(found);
    setSent(Object.keys(found).length === 0);
  }

  return (
    <>
      <h2 className="bolum-baslik">Giriş</h2>
      <form className="form" noValidate onSubmit={handleSubmit}>
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

        <button type="submit">Giriş yap</button>
      </form>

      {sent && <p className="mesaj mesaj-basari">Bilgiler geçerli. Gerçek giriş Sprint 10'da.</p>}

      <p className="form-linkler">
        <Link to="/forgot-password">Şifremi unuttum</Link>
        <Link to="/register">Kayıt ol</Link>
      </p>
    </>
  );
}

export default LoginPage;
