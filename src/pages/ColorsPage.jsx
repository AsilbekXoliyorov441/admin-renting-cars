import React, { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const COLORS_ENDPOINT = `${API_URL}/colors`;
const PAGE_SIZE = 10;

const initialForm = {
  name: "",
  hex_code: "#000000",
};

const orderOptions = [
  { value: "name.asc", label: "Nomi: A-Z" },
  { value: "name.desc", label: "Nomi: Z-A" },
  { value: "hex_code.asc", label: "HEX: A-Z" },
  { value: "hex_code.desc", label: "HEX: Z-A" },
  { value: "id.asc", label: "ID: o‘sish" },
  { value: "id.desc", label: "ID: kamayish" },
];

const ColorsPage = () => {
  const [colors, setColors] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [search, setSearch] = useState("");
  const [hexFilter, setHexFilter] = useState("");
  const [order, setOrder] = useState("name.asc");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const normalizeHex = (value) => {
    if (!value) return "";
    let hex = value.trim().toUpperCase();
    if (!hex.startsWith("#")) hex = `#${hex}`;
    return hex;
  };

  const isValidHex = (value) => {
    const hex = normalizeHex(value);
    return /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex);
  };

  const getErrorMessage = async (res, fallbackMessage) => {
    try {
      const text = await res.text();
      return text || fallbackMessage;
    } catch {
      return fallbackMessage;
    }
  };

  const buildHeaders = (extraHeaders = {}) => {
    return {
      "Content-Type": "application/json",
      ...extraHeaders,
    };
  };

  const buildQuery = (targetPage = page) => {
    const params = new URLSearchParams();

    params.set("select", "id,name,hex_code");
    params.set("order", order);
    params.set("limit", String(PAGE_SIZE));
    params.set("offset", String((targetPage - 1) * PAGE_SIZE));

    if (search.trim()) {
      params.set("name", `ilike.*${search.trim()}*`);
    }

    if (hexFilter.trim()) {
      params.set("hex_code", `ilike.*${hexFilter.trim()}*`);
    }

    return params.toString();
  };

  const fetchColors = useCallback(
    async (targetPage = page) => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${COLORS_ENDPOINT}?${buildQuery(targetPage)}`, {
          method: "GET",
          headers: {
            Prefer: "count=none",
            "Range-Unit": "items",
          },
        });

        if (!res.ok) {
          throw new Error(await getErrorMessage(res, "Ranglarni olishda xatolik yuz berdi."));
        }

        const data = await res.json();
        setColors(Array.isArray(data) ? data : []);
      } catch (err) {
        setColors([]);
        setError(err.message || "Noma’lum xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    },
    [page, order, search, hexFilter]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchColors(page);
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchColors, page]);

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [success]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "hex_code" ? value.toUpperCase() : value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Rang nomini kiriting.");
      return;
    }

    if (!isValidHex(form.hex_code)) {
      setError("HEX code noto‘g‘ri. Masalan: #FF0000 yoki #FFF");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: form.name.trim(),
        hex_code: normalizeHex(form.hex_code),
      };

      const res = await fetch(`${COLORS_ENDPOINT}?select=id,name,hex_code`, {
        method: "POST",
        headers: buildHeaders({
          Prefer: "return=representation",
        }),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Rang qo‘shishda xatolik yuz berdi."));
      }

      setForm(initialForm);
      setSuccess("Rang muvaffaqiyatli qo‘shildi.");

      setPage(1);
      await fetchColors(1);
    } catch (err) {
      setError(err.message || "Rang qo‘shishda xatolik yuz berdi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`"${name}" rangini o‘chirmoqchimisiz?`);
    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      setDeleteId(id);

      const res = await fetch(`${COLORS_ENDPOINT}?id=eq.${id}`, {
        method: "DELETE",
        headers: {
          Prefer: "return=minimal",
        },
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Rangni o‘chirishda xatolik yuz berdi."));
      }

      setSuccess("Rang muvaffaqiyatli o‘chirildi.");

      const nextPage = colors.length === 1 && page > 1 ? page - 1 : page;

      if (nextPage !== page) {
        setPage(nextPage);
      } else {
        await fetchColors(nextPage);
      }
    } catch (err) {
      setError(err.message || "Rangni o‘chirishda xatolik yuz berdi.");
    } finally {
      setDeleteId("");
    }
  };

  const handleRefresh = async () => {
    setError("");
    setSuccess("");
    await fetchColors(page);
  };

  const handleResetFilters = () => {
    setSearch("");
    setHexFilter("");
    setOrder("name.asc");
    setPage(1);
  };

  const canGoPrev = page > 1;
  const canGoNext = colors.length === PAGE_SIZE;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Colors</h1>
            <p className="mt-1 text-sm text-gray-500">
              Ranglarni boshqarish paneli
            </p>
          </div>

          <button
            onClick={handleRefresh}
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Yangilash
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-1">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Yangi rang qo‘shish
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Rang nomi
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Masalan: Red"
                  value={form.name}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  HEX code
                </label>

                <div className="flex gap-3">
                  <input
                    type="text"
                    name="hex_code"
                    placeholder="#FF0000"
                    value={form.hex_code}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 uppercase outline-none transition focus:border-black"
                  />

                  <input
                    type="color"
                    value={isValidHex(form.hex_code) ? normalizeHex(form.hex_code) : "#000000"}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        hex_code: e.target.value.toUpperCase(),
                      }))
                    }
                    className="h-11 w-14 cursor-pointer rounded-xl border border-gray-300 bg-white p-1"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <p className="mb-2 text-sm font-medium text-gray-700">Preview</p>
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full border border-gray-300"
                    style={{
                      backgroundColor: isValidHex(form.hex_code)
                        ? normalizeHex(form.hex_code)
                        : "#FFFFFF",
                    }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {form.name || "Rang nomi"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {isValidHex(form.hex_code)
                        ? normalizeHex(form.hex_code)
                        : "Noto‘g‘ri HEX"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Saqlanmoqda..." : "Qo‘shish"}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end">
              <div className="w-full">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nomi bo‘yicha qidirish
                </label>
                <input
                  type="text"
                  placeholder="Masalan: red"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-black"
                />
              </div>

              <div className="w-full">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  HEX bo‘yicha filter
                </label>
                <input
                  type="text"
                  placeholder="#FF0000"
                  value={hexFilter}
                  onChange={(e) => {
                    setHexFilter(e.target.value.toUpperCase());
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 uppercase outline-none transition focus:border-black"
                />
              </div>

              <div className="w-full md:max-w-xs">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Saralash
                </label>
                <select
                  value={order}
                  onChange={(e) => {
                    setOrder(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-black"
                >
                  {orderOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleResetFilters}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Tozalash
              </button>
            </div>

            <div className="mb-4 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <p className="text-sm text-gray-600">
                Sahifa: <span className="font-semibold text-gray-900">{page}</span>
              </p>
              <p className="text-sm text-gray-600">
                Ko‘rsatilgan:{" "}
                <span className="font-semibold text-gray-900">{colors.length}</span>
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="px-4 py-3 font-medium">Preview</th>
                    <th className="px-4 py-3 font-medium">Nomi</th>
                    <th className="px-4 py-3 font-medium">HEX</th>
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium text-right">Amal</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-500">
                        Yuklanmoqda...
                      </td>
                    </tr>
                  ) : colors.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-500">
                        Ma’lumot topilmadi
                      </td>
                    </tr>
                  ) : (
                    colors.map((color) => (
                      <tr key={color.id} className="text-sm text-gray-700">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="h-8 w-8 rounded-full border border-gray-300"
                              style={{ backgroundColor: color.hex_code }}
                            />
                          </div>
                        </td>

                        <td className="px-4 py-3 font-medium text-gray-900">
                          {color.name}
                        </td>

                        <td className="px-4 py-3">
                          <span className="rounded-lg bg-gray-100 px-2 py-1 font-mono text-xs">
                            {color.hex_code}
                          </span>
                        </td>

                        <td className="max-w-55 truncate px-4 py-3 text-xs text-gray-500">
                          {color.id}
                        </td>

                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDelete(color.id, color.name)}
                            disabled={deleteId === color.id}
                            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deleteId === color.id ? "O‘chirilmoqda..." : "O‘chirish"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setPage((prev) => prev - 1)}
                disabled={!canGoPrev || loading}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Oldingi
              </button>

              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!canGoNext || loading}
                className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Keyingi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorsPage;
