import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow p-4 flex justify-between">
          <h1 className="font-semibold text-lg">Car Admin Panel</h1>

          <button
            onClick={() => {
              localStorage.removeItem("admin");
              window.location.href = "/";
            }}
            className="text-sm bg-black text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
