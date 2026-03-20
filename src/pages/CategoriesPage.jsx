import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";

const CategoriesPage = () => {
  const { get, post, put, del, loading } = useApi();

  const [categories, setCategories] = useState([]);
  const [openRow, setOpenRow] = useState(null);

  const emptyForm = {
    name: "",
    image: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    const data = await get("categories?select=*&order=created_at.desc");
    setCategories(data || []);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await put(`categories?id=eq.${editId}`, form);
    } else {
      await post("categories", form);
    }

    resetForm();
    fetchCategories();
  };

  const handleEdit = (category) => {
    setEditId(category.id);
    setForm({
      name: category.name || "",
      image: category.image || "",
    });
    setOpenRow(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Kategoriyani o'chirmoqchimisiz?");
    if (!confirmDelete) return;

    await del(`categories?id=eq.${id}`);
    fetchCategories();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Categories</h2>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mb-6">
        <input
          name="name"
          placeholder="Name"
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

        <button
          className={`bg-black text-white p-2 rounded ${
            !editId ? "col-span-2" : ""
          }`}
        >
          {editId ? "Update Category" : "Add Category"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-300 p-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* TABLE */}
      {loading ? (
        <div className="text-center py-10">Loading categories...</div>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Created At</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-400">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <React.Fragment key={category.id}>
                  {/* MAIN ROW */}
                  <tr className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-10 h-10 rounded-lg object-cover border"
                          onError={(e) => {
                            e.target.outerHTML =
                              '<div class="w-10 h-10 rounded-lg bg-gray-100 border flex items-center justify-center text-gray-400 text-lg">🖼</div>';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 border flex items-center justify-center text-gray-400 text-lg">
                          🖼
                        </div>
                      )}
                    </td>

                    <td className="p-3 font-medium">{category.name}</td>

                    <td className="p-3 text-gray-500 text-sm whitespace-nowrap">
                      {category.created_at
                        ? new Date(category.created_at).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="p-3 space-x-2 whitespace-nowrap">
                      <button
                        onClick={() =>
                          setOpenRow(
                            openRow === category.id ? null : category.id
                          )
                        }
                        className="px-3 py-1 bg-gray-200 rounded"
                      >
                        Details
                      </button>

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

                  {/* DETAILS ROW */}
                  {openRow === category.id && (
                    <tr className="bg-gray-50">
                      <td colSpan="4" className="p-6">
                        <div className="grid grid-cols-2 gap-6 text-sm">
                          <div>
                            <h4 className="font-semibold mb-3">Category Info</h4>
                            <p className="mb-1">
                              <span className="text-gray-500">Name:</span>{" "}
                              {category.name}
                            </p>
                            <p className="mb-1">
                              <span className="text-gray-500">Created:</span>{" "}
                              {category.created_at
                                ? new Date(category.created_at).toLocaleString()
                                : "—"}
                            </p>
                            <p className="mb-1">
                              <span className="text-gray-500">ID:</span>{" "}
                              <span className="font-mono text-xs text-gray-400">
                                {category.id}
                              </span>
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3">Image</h4>
                            {category.image ? (
                              <div>
                                <img
                                  src={category.image}
                                  alt={category.name}
                                  className="w-24 h-24 object-cover rounded-xl border"
                                />
                                <p className="mt-2 text-xs text-gray-400 break-all max-w-xs">
                                  {category.image}
                                </p>
                              </div>
                            ) : (
                              <p className="text-gray-400">No image provided</p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoriesPage;