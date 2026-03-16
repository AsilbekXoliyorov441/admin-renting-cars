
import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";

const CategoryCarsPage = () => {
  const { get, post, put, del, loading } = useApi();

  const [categories, setCategories] = useState([]);

  const emptyForm = {
    name: "",
    image: "",
    category_cars: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    const data = await get("categories_with_cars?select=*");
    setCategories(data || []);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await put(`categories_with_cars?id=eq.${editId}`, form);
    } else {
      await post("categories_with_cars", form);
    }

    resetForm();
    fetchCategories();
  };

  const handleEdit = (category) => {
    setForm({
      name: category.name || "",
      image: category.image || "",
      category_cars: category.category_cars || "",
    });

    setEditId(category.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete category?")) return;

    await del(`categories_with_cars?id=eq.${id}`);
    fetchCategories();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-bold mb-6">
        Categories With Cars
      </h2>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-3 gap-4 mb-8"
      >

        <input
          name="name"
          placeholder="Category Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="category_cars"
          placeholder="Cars data"
          value={form.category_cars}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button className="col-span-3 bg-black text-white p-3 rounded">
          {editId ? "Update Category" : "Add Category"}
        </button>

      </form>

      {/* TABLE */}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Image</th>
              <th>Name</th>
              <th>Cars</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {categories.map((category) => {

              const carsCount = Array.isArray(category.category_cars)
                ? category.category_cars.length
                : category.category_cars || 0;

              return (
                <tr
                  key={category.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-2">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-20 h-12 object-cover rounded"
                    />
                  </td>

                  <td className="font-semibold">
                    {category.name}
                  </td>

                  <td>
                    {carsCount}
                  </td>

                  <td className="space-x-2">

                    <button
                      onClick={() => handleEdit(category)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(category.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              );

            })}

          </tbody>

        </table>
      )}

    </div>
  );
};

export default CategoryCarsPage;
