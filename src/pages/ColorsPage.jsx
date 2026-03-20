import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";

const ColorsPage = () => {
  const { get, post, put, del, loading } = useApi();

  const [colors, setColors] = useState([]);
  const [openRow, setOpenRow] = useState(null);

  const emptyForm = {
    name: "",
    hex_code: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const fetchColors = async () => {
    const data = await get("colors?select=*&order=name.asc");
    setColors(data || []);
  };

  useEffect(() => {
    fetchColors();
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
      await put(`colors?id=eq.${editId}`, form);
    } else {
      await post("colors", form);
    }

    resetForm();
    fetchColors();
  };

  const handleEdit = (color) => {
    setEditId(color.id);
    setForm({
      name: color.name || "",
      hex_code: color.hex_code || "",
    });
    setOpenRow(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Rangni o'chirmoqchimisiz?");
    if (!confirmDelete) return;

    await del(`colors?id=eq.${id}`);
    fetchColors();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Colors</h2>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mb-6">
        <input
          name="name"
          placeholder="Color name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <div className="flex items-center gap-2 border rounded px-2">
          <input
            type="color"
            name="hex_code"
            value={form.hex_code || "#000000"}
            onChange={handleChange}
            className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
          />
          <input
            name="hex_code"
            placeholder="#000000"
            value={form.hex_code}
            onChange={handleChange}
            className="flex-1 p-1 outline-none text-sm font-mono"
            required
          />
        </div>

        <button
          className={`bg-black text-white p-2 rounded ${
            !editId ? "col-span-2" : ""
          }`}
        >
          {editId ? "Update Color" : "Add Color"}
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
        <div className="text-center py-10">Loading colors...</div>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Color</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Hex Code</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {colors.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-400">
                  No colors found.
                </td>
              </tr>
            ) : (
              colors.map((color) => (
                <React.Fragment key={color.id}>
                  {/* MAIN ROW */}
                  <tr className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <div
                        className="w-10 h-10 rounded-lg border shadow-sm"
                        style={{
                          backgroundColor: color.hex_code || "#cccccc",
                        }}
                      />
                    </td>

                    <td className="p-3 font-medium">{color.name}</td>

                    <td className="p-3">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {color.hex_code || "—"}
                      </span>
                    </td>

                    <td className="p-3 space-x-2 whitespace-nowrap">
                      <button
                        onClick={() =>
                          setOpenRow(openRow === color.id ? null : color.id)
                        }
                        className="px-3 py-1 bg-gray-200 rounded"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => handleEdit(color)}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(color.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {/* DETAILS ROW */}
                  {openRow === color.id && (
                    <tr className="bg-gray-50">
                      <td colSpan="4" className="p-6">
                        <div className="grid grid-cols-2 gap-6 text-sm">
                          <div>
                            <h4 className="font-semibold mb-3">Color Info</h4>
                            <p className="mb-1">
                              <span className="text-gray-500">Name:</span>{" "}
                              {color.name}
                            </p>
                            <p className="mb-1">
                              <span className="text-gray-500">Hex Code:</span>{" "}
                              <span className="font-mono">{color.hex_code}</span>
                            </p>
                            <p className="mb-1">
                              <span className="text-gray-500">ID:</span>{" "}
                              <span className="font-mono text-xs text-gray-400">
                                {color.id}
                              </span>
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3">Preview</h4>
                            <div className="flex items-center gap-4">
                              <div
                                className="w-20 h-20 rounded-xl border shadow"
                                style={{
                                  backgroundColor: color.hex_code || "#cccccc",
                                }}
                              />
                              <div>
                                <p className="font-mono text-lg font-bold">
                                  {color.hex_code}
                                </p>
                                <p className="text-gray-500 text-xs mt-1">
                                  {color.name}
                                </p>
                              </div>
                            </div>
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

export default ColorsPage;