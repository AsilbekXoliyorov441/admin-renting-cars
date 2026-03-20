import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";

const BrandCarsPage = () => {
  const { get, post, put, del, loading } = useApi();

  const [brandCars, setBrandCars] = useState([]);
  const [openRow, setOpenRow] = useState(null);

  const emptyForm = {
    name: "",
    logo: "",
    brand_cars: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const fetchBrandCars = async () => {
    const data = await get("brands_with_cars?select=*&order=name.asc");
    setBrandCars(data || []);
  };

  useEffect(() => {
    fetchBrandCars();
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
      await put(`brands_with_cars?id=eq.${editId}`, form);
    } else {
      await post("brands_with_cars", form);
    }

    resetForm();
    fetchBrandCars();
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      name: item.name || "",
      logo: item.logo || "",
      brand_cars: item.brand_cars || "",
    });
    setOpenRow(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("O'chirmoqchimisiz?");
    if (!confirmDelete) return;

    await del(`brands_with_cars?id=eq.${id}`);
    fetchBrandCars();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Brands Cars</h2>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-3 mb-6">
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

        <input
          name="brand_cars"
          placeholder="Brand Cars (car id or info)"
          value={form.brand_cars}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button
          className={`bg-black text-white p-2 rounded ${
            !editId ? "col-span-3" : "col-span-2"
          }`}
        >
          {editId ? "Update" : "Add Brand Car"}
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
        <div className="text-center py-10">Loading...</div>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Logo</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Brand Cars</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {brandCars.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-400">
                  No records found.
                </td>
              </tr>
            ) : (
              brandCars.map((item) => (
                <React.Fragment key={item.id}>
                  {/* MAIN ROW */}
                  <tr className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      {item.logo ? (
                        <img
                          src={item.logo}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-contain border bg-white p-1"
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

                    <td className="p-3 font-medium">{item.name}</td>

                    <td className="p-3 text-gray-600 text-sm max-w-xs">
                      <div className="truncate">{item.brand_cars || "—"}</div>
                    </td>

                    <td className="p-3 space-x-2 whitespace-nowrap">
                      <button
                        onClick={() =>
                          setOpenRow(openRow === item.id ? null : item.id)
                        }
                        className="px-3 py-1 bg-gray-200 rounded"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {/* DETAILS ROW */}
                  {openRow === item.id && (
                    <tr className="bg-gray-50">
                      <td colSpan="4" className="p-6">
                        <div className="grid grid-cols-3 gap-6 text-sm">
                          <div>
                            <h4 className="font-semibold mb-3">Brand Info</h4>
                            <p className="mb-1">
                              <span className="text-gray-500">Name:</span>{" "}
                              {item.name}
                            </p>
                            <p className="mb-1">
                              <span className="text-gray-500">ID:</span>{" "}
                              <span className="font-mono text-xs text-gray-400">
                                {item.id}
                              </span>
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3">Logo</h4>
                            {item.logo ? (
                              <div>
                                <img
                                  src={item.logo}
                                  alt={item.name}
                                  className="w-20 h-20 object-contain rounded-xl border bg-white p-2"
                                />
                                <p className="mt-2 text-xs text-gray-400 break-all max-w-xs">
                                  {item.logo}
                                </p>
                              </div>
                            ) : (
                              <p className="text-gray-400">No logo provided</p>
                            )}
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3">Brand Cars</h4>
                            <p className="text-gray-600 break-all">
                              {item.brand_cars || "—"}
                            </p>
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

export default BrandCarsPage;