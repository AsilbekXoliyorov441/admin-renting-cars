import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";

const UsersPage = () => {
  const { get, post, put, del, loading } = useApi();

  const [users, setUsers] = useState([]);

  const emptyForm = {
    name: "",
    email: "",
    phone: "",
    avatar: "",
    role: "user",
  };

  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const fetchUsers = async () => {
    const data = await get("users?select=*");
    setUsers(data || []);
  };

  useEffect(() => {
    fetchUsers();
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
      await put(`users?id=eq.${editId}`, form);
    } else {
      await post("users", form);
    }

    resetForm();
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEditId(user.id);

    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      avatar: user.avatar || "",
      role: user.role || "user",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Userni o‘chirmoqchimisiz?");
    if (!confirmDelete) return;

    await del(`users?id=eq.${id}`);
    fetchUsers();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Users</h2>
      </div>

      {/* FORM */}

      <form onSubmit={handleSubmit} className="grid grid-cols-5 gap-3 mb-6">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="avatar"
          placeholder="Avatar URL"
          value={form.avatar}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>

        <button className="col-span-3 bg-black text-white p-2 rounded">
          {editId ? "Update User" : "Add User"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={resetForm}
            className="col-span-2 bg-gray-300 p-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* TABLE */}

      {loading ? (
        <div className="text-center py-10">Loading users...</div>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="p-2">
                  <img
                    src={user.avatar || "https://i.pravatar.cc/100"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>

                <td>{user.name}</td>

                <td>{user.email}</td>

                <td>{user.phone}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersPage;
