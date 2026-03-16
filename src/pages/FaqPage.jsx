import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";

const FaqPage = () => {
  const { get, post, put, del, loading } = useApi();

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
    fetchFaqs();
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
    const confirmDelete = window.confirm("FAQ ni o'chirmoqchimisiz?");
    if (!confirmDelete) return;

    await del(`faq?id=eq.${id}`);
    fetchFaqs();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">FAQ</h2>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 mb-6">
        <input
          name="question"
          placeholder="Question"
          value={form.question}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <textarea
          name="answer"
          placeholder="Answer"
          value={form.answer}
          onChange={handleChange}
          className="border p-2 rounded resize-none"
          rows={3}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <button
            className={`bg-black text-white p-2 rounded ${
              !editId ? "col-span-2" : ""
            }`}
          >
            {editId ? "Update FAQ" : "Add FAQ"}
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
        </div>
      </form>

      {/* TABLE */}
      {loading ? (
        <div className="text-center py-10">Loading FAQs...</div>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left w-5">#</th>
              <th className="p-3 text-left">Question</th>
              <th className="p-3 text-left">Answer</th>
              <th className="p-3 text-left">Created At</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {faqs.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-400">
                  No FAQs found.
                </td>
              </tr>
            ) : (
              faqs.map((faq, index) => (
                <tr key={faq.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-gray-400 text-sm">{index + 1}</td>

                  <td className="p-3 font-medium max-w-xs">
                    {faq.question}
                  </td>

                  <td className="p-3 text-gray-600 text-sm max-w-sm">
                    <div className="line-clamp-2">{faq.answer}</div>
                  </td>

                  <td className="p-3 text-gray-500 text-sm whitespace-nowrap">
                    {faq.created_at
                      ? new Date(faq.created_at).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="p-3 space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(faq)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FaqPage;