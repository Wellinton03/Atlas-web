import "./Sidebar.css";

import {
  LayoutDashboard,
  Wallet,
  FolderTree,
  CreditCard,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Movimentações",
    path: "/movements",
    icon: Wallet,
  },
  {
    label: "Categorias",
    path: "/categorias",
    icon: FolderTree,
  },
  {
    label: "Contas",
    path: "/contas",
    icon: CreditCard,
  },
  {
    label: "Configurações",
    path: "/configuracoes",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {menuItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </aside>
  );
}
