import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import CarsPage from "./pages/CarsPage";
import BrandCarsPage from "./pages/BrandCarsPage";
import ColorsPage from "./pages/ColorsPage";
import CategoriesPage from "./pages/CategoriesPage";
import ColorsCarsPage from "./pages/ColorsCarsPage";
import CategoryCarsPage from "./pages/CategoryCarsPage";
import FaqPage from "./pages/FaqPage";
import BrandsPage from "./pages/BrandsPage";
import UsersPage from "./pages/UsersPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="cars" element={<CarsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="colors" element={<ColorsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="colors-cars" element={<ColorsCarsPage />} />
          <Route path="categories-cars" element={<CategoryCarsPage />} />
          <Route path="brands-cars" element={<BrandCarsPage />} />
          <Route path="faq" element={<FaqPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
