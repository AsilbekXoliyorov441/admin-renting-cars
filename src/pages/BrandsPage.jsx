import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";

const BrandsPage = () => {
  const { get, post, put, del, loading } = useApi();

  const [brands, setBrands] = useState([]);
  const [openRow, setOpenRow] = useState(null);

  const emptyForm = {
    name: "",
    logo: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const fetchBrands = async () => {
    const data = await get("brands?select=*&order=created_at.desc");
    setBrands(data || []);
  };

  useEffect(() => {
    fetchBrands();
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
      await put(`brands?id=eq.${editId}`, form);
    } else {
      await post("brands", form);
    }

    resetForm();
    fetchBrands();
  };

  const handleEdit = (brand) => {
    setEditId(brand.id);
    setForm({
      name: brand.name || "",
      logo: brand.logo || "",
    });
    setOpenRow(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Brandni o'chirmoqchimisiz?");
    if (!confirmDelete) return;

    await del(`brands?id=eq.${id}`);
    fetchBrands();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Brands</h2>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mb-6">
        <input
          name="name"
          placeholder="Brand name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="logo"
          placeholder="Logo URL"
          value={form.logo}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button
          className={`bg-black text-white p-2 rounded ${
            !editId ? "col-span-2" : ""
          }`}
        >
          {editId ? "Update Brand" : "Add Brand"}
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
        <div className="text-center py-10">Loading brands...</div>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Logo</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Created At</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {brands.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-400">
                  No brands found.
                </td>
              </tr>
            ) : (
              brands.map((brand) => (
                <React.Fragment key={brand.id}>
                  {/* MAIN ROW */}
                  <tr className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="w-10 h-10 rounded-lg object-cover border"
                          onError={(e) => {
                            e.target.outerHTML =
                              '<div class="w-10 h-10 rounded-lg bg-gray-100 border flex items-center justify-center text-gray-400 text-lg">🏷</div>';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 border flex items-center justify-center text-gray-400 text-lg">
                          🏷
                        </div>
                      )}
                    </td>

                    <td className="p-3 font-medium">{brand.name}</td>

                    <td className="p-3 text-gray-500 text-sm whitespace-nowrap">
                      {brand.created_at
                        ? new Date(brand.created_at).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="p-3 space-x-2 whitespace-nowrap">
                      <button
                        onClick={() =>
                          setOpenRow(openRow === brand.id ? null : brand.id)
                        }
                        className="px-3 py-1 bg-gray-200 rounded"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => handleEdit(brand)}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(brand.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {/* DETAILS ROW */}
                  {openRow === brand.id && (
                    <tr className="bg-gray-50">
                      <td colSpan="4" className="p-6">
                        <div className="grid grid-cols-2 gap-6 text-sm">
                          <div>
                            <h4 className="font-semibold mb-3">Brand Info</h4>
                            <p className="mb-1">
                              <span className="text-gray-500">Name:</span>{" "}
                              {brand.name}
                            </p>
                            <p className="mb-1">
                              <span className="text-gray-500">Created:</span>{" "}
                              {brand.created_at
                                ? new Date(brand.created_at).toLocaleString()
                                : "—"}
                            </p>
                            <p className="mb-1">
                              <span className="text-gray-500">ID:</span>{" "}
                              <span className="font-mono text-xs text-gray-400">
                                {brand.id}
                              </span>
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3">Logo</h4>
                            {brand.logo ? (
                              <div>
                                <img
                                  src={brand.logo}
                                  alt={brand.name}
                                  className="w-24 h-24 object-contain rounded-xl border bg-white p-2"
                                />
                                <p className="mt-2 text-xs text-gray-400 break-all max-w-xs">
                                  {brand.logo}
                                </p>
                              </div>
                            ) : (
                              <p className="text-gray-400">No logo provided</p>
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

export default BrandsPage;