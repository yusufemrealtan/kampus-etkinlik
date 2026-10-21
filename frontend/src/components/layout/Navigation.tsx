import type { PageName } from "../../types/page";

interface NavigationProps {
  current: PageName;
  onNavigate: (page: PageName) => void;
}

const menuItems: { name: PageName; label: string }[] = [
  { name: "home", label: "Ana Sayfa" },
  { name: "events", label: "Etkinlikler" },
  { name: "add", label: "Ekle" },
];

function Navigation({ current, onNavigate }: NavigationProps) {
  return (
    <nav className="menu">
      <ul>
        {menuItems.map((item) => (
          <li key={item.name}>
            <a
              href="#"
              aria-current={current === item.name ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.name);
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;