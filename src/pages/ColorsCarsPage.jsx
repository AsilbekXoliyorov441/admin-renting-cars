import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";

const ColorsCarsPage = () => {
  const { get, post, put, del, loading } = useApi();

  const [colorsCars, setColorsCars] = useState([]);
  const [openRow, setOpenRow] = useState(null);

  const emptyForm = {
    name: "",
    hex_code: "",
    color_cars: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const stringifyColorCars = (value) => {
    if (value == null || value === "") return "";
    if (typeof value === "string") return value;

    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  };

  const getColorCarsLabel = (value) => {
    if (value == null || value === "") return "—";

    if (Array.isArray(value)) {
      if (value.length === 0) return "—";

      return value
        .map((car) => {
          if (car && typeof car === "object") {
            return car.model || car.name || car.id || "Car";
          }

          return String(car);
        })
        .join(", ");
    }

    if (typeof value === "object") {
      return value.model || value.name || value.id || stringifyColorCars(value);
    }

    return String(value);
  };

  const getCarsCount = (value) => {
    if (Array.isArray(value)) return value.length;
    if (typeof value === "number") return value;
    return 0;
  };

  const fetchColorsCars = async () => {
    const data = await get("colors_with_cars?select=*&order=name.asc");
    setColorsCars(data || []);
  };

  useEffect(() => {
    fetchColorsCars();
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
      await put(`colors_with_cars?id=eq.${editId}`, form);
    } else {
      await post("colors_with_cars", form);
    }

    resetForm();
    fetchColorsCars();
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      name: item.name || "",
      hex_code: item.hex_code || "",
      color_cars: stringifyColorCars(item.color_cars),
    });
    setOpenRow(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("O'chirmoqchimisiz?");
    if (!confirmDelete) return;

    await del(`colors_with_cars?id=eq.${id}`);
    fetchColorsCars();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Colors Cars</h2>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-3 mb-6">
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

        <input
          name="color_cars"
          placeholder="Color Cars (car id or info)"
          value={form.color_cars}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button
          className={`bg-black text-white p-2 rounded ${
            !editId ? "col-span-3" : "col-span-2"
          }`}
        >
          {editId ? "Update" : "Add Color Car"}
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
              <th className="p-3 text-left">Color</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Hex Code</th>
              <th className="p-3 text-left">Color Cars</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {colorsCars.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-400">
                  No records found.
                </td>
              </tr>
            ) : (
              colorsCars.map((item) => (
                <React.Fragment key={item.id}>
                  {/* MAIN ROW */}
                  <tr className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <div
                        className="w-10 h-10 rounded-lg border shadow-sm"
                        style={{
                          backgroundColor: item.hex_code || "#cccccc",
                        }}
                      />
                    </td>

                    <td className="p-3 font-medium">{item.name}</td>

                    <td className="p-3">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {item.hex_code || "—"}
                      </span>
                    </td>

                    <td className="p-3 text-sm">
                      <span className="font-semibold">
                        {getCarsCount(item.color_cars)}
                      </span>
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
                      <td colSpan="5" className="p-6">
                        <div className="grid grid-cols-3 gap-6 text-sm">
                          <div>
                            <h4 className="font-semibold mb-3">Color Info</h4>
                            <p className="mb-1">
                              <span className="text-gray-500">Name:</span>{" "}
                              {item.name}
                            </p>
                            <p className="mb-1">
                              <span className="text-gray-500">Hex Code:</span>{" "}
                              <span className="font-mono">{item.hex_code}</span>
                            </p>
                            <p className="mb-1">
                              <span className="text-gray-500">ID:</span>{" "}
                              <span className="font-mono text-xs text-gray-400">
                                {item.id}
                              </span>
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3">Preview</h4>
                            <div className="flex items-center gap-3">
                              <div
                                className="w-16 h-16 rounded-xl border shadow"
                                style={{
                                  backgroundColor: item.hex_code || "#cccccc",
                                }}
                              />
                              <div>
                                <p className="font-mono font-bold">
                                  {item.hex_code}
                                </p>
                                <p className="text-gray-500 text-xs mt-1">
                                  {item.name}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3">Color Cars</h4>
                            <p className="mb-2 text-gray-600">
                              Count:{" "}
                              <span className="font-semibold">
                                {getCarsCount(item.color_cars)}
                              </span>
                            </p>
                            <p className="text-gray-600 break-all">
                              {getColorCarsLabel(item.color_cars)}
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

export default ColorsCarsPage;
