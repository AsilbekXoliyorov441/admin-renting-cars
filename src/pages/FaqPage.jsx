import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";

const FaqPage = () => {
  const { get, post, put, del, loading, error } = useApi();

  const [faqs, setFaqs] = useState([]);
  const emptyForm = {
    question: "",
    answer: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const fetchFaqs = async () => {
    const data = await get("faq?select=*&order=created_at.desc");
    setFaqs(data || []);
  };

  useEffect(() => {
    const init = async () => {
      await fetchFaqs();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      await put(`faq?id=eq.${editId}`, form);
    } else {
      await post("faq", form);
    }

    resetForm();
    fetchFaqs();
  };

  const handleEdit = (faq) => {
    setEditId(faq.id);
    setForm({
      question: faq.question || "",
      answer: faq.answer || "",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this FAQ?");
    if (!confirmDelete) return;

    await del(`faq?id=eq.${id}`);
    fetchFaqs();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">FAQ</h1>

      {/* FORM SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editId ? "Change FAQ" : "Add new FAQ"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
            <input
              name="question"
              placeholder="Enter question..."
              value={form.question}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
            <textarea
              name="answer"
              placeholder="Enter answer..."
              value={form.answer}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 resize-none focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              required
            ></textarea>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Loading..." : editId ? "Change FAQ" : "Add new FAQ"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {error && <div className="p-4 bg-red-100 text-red-700">{error}</div>}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 font-semibold text-sm w-12 text-center">#</th>
                <th className="p-4 font-semibold text-sm">Question</th>
                <th className="p-4 font-semibold text-sm">Answer</th>
                <th className="p-4 font-semibold text-sm">Date</th>
                <th className="p-4 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && faqs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500">Loading...</td>
                </tr>
              ) : faqs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-400">FAQ list is empty</td>
                </tr>
              ) : (
                faqs.map((faq, index) => (
                  <tr key={faq.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4 text-sm text-gray-400 text-center">{index + 1}</td>
                    <td className="p-4 text-sm font-medium align-top max-w-xs">{faq.question}</td>
                    <td className="p-4 text-sm text-gray-600 align-top">
                      <div className="line-clamp-2">{faq.answer}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {faq.created_at ? new Date(faq.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-4 text-sm text-right space-x-10 align-top">
                      <button
                        onClick={() => handleEdit(faq)}
                        className="text-blue-600 cursor-pointer hover:text-blue-800 font-medium"
                      >
                        Change
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id)}
                        className="text-red-600 cursor-pointer hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;