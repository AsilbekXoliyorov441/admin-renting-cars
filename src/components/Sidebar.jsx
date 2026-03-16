import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkClass = "block px-4 py-2 rounded hover:bg-gray-200";

  const active = "bg-black text-white";

  return (
    <div className="w-64 bg-white shadow">
      <div className="p-4 text-xl font-bold border-b">ADMIN</div>

      <div className="p-3 space-y-2">
        <NavLink
          to="/cars"
          className={({ isActive }) => `${linkClass} ${isActive && active}`}
        >
          Cars
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) => `${linkClass} ${isActive && active}`}
        >
          Users
        </NavLink>

        <NavLink
          to="/brands"
          className={({ isActive }) => `${linkClass} ${isActive && active}`}
        >
          Brands
        </NavLink>

        <NavLink
          to="/colors"
          className={({ isActive }) => `${linkClass} ${isActive && active}`}
        >
          Colors
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) => `${linkClass} ${isActive && active}`}
        >
          Categories
        </NavLink>

        <NavLink
          to="/colors-cars"
          className={({ isActive }) => `${linkClass} ${isActive && active}`}
        >
          Colors Cars
        </NavLink>

        <NavLink
          to="/categories-cars"
          className={({ isActive }) => `${linkClass} ${isActive && active}`}
        >
          Categories Cars
        </NavLink>

        <NavLink
          to="/brands-cars"
          className={({ isActive }) => `${linkClass} ${isActive && active}`}
        >
          Brands Cars
        </NavLink>

        <NavLink
          to="/faq"
          className={({ isActive }) => `${linkClass} ${isActive && active}`}
        >
          FAQ
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
