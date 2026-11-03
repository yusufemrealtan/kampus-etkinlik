import { NavLink } from "react-router-dom";

const menu = [
  { to: "/", label: "Ana Sayfa" },
  { to: "/events", label: "Etkinlikler" },
  { to: "/admin", label: "Yönetim" },
  { to: "/login", label: "Giriş" },
];

// NavLink açık sayfaya aria-current="page" ekler; CSS onu boyar.
// "/" için end: yoksa Ana Sayfa her adreste aktif görünür.
function Navigation() {
  return (
    <nav className="menu">
      <ul>
        {menu.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} end={item.to === "/"}>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;
