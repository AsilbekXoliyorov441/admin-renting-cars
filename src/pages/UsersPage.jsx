import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";

const UsersPage = () => {
  const { get, post, put, del, loading } = useApi();

  const [users, setUsers] = useState([]);
  const [openRow, setOpenRow] = useState(null);

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
    setOpenRow(null);
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
              <th className="p-3 text-left">Avatar</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <React.Fragment key={user.id}>
                  <tr className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <img
                        src={user.avatar || "https://i.pravatar.cc/100"}
                        alt={user.name || "User"}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    </td>

                    <td className="p-3 font-medium">{user.name || "—"}</td>

                    <td className="p-3 text-gray-600">{user.email || "—"}</td>

                    <td className="p-3 text-gray-600">{user.phone || "—"}</td>

                    <td className="p-3">
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

                    <td className="p-3 space-x-2 whitespace-nowrap">
                      <button
                        onClick={() =>
                          setOpenRow(openRow === user.id ? null : user.id)
                        }
                        className="px-3 py-1 bg-gray-200 rounded"
                      >
                        Details
                      </button>

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

                  {openRow === user.id && (
                    <tr className="bg-gray-50">
                      <td colSpan="6" className="p-6">
                        <div className="grid grid-cols-3 gap-6 text-sm">
                          <div>
                            <h4 className="font-semibold mb-3">User Info</h4>
                            <p className="mb-1">
                              <span className="text-gray-500">Name:</span>{" "}
                              {user.name || "—"}
                            </p>
                            <p className="mb-1">
                              <span className="text-gray-500">Email:</span>{" "}
                              {user.email || "—"}
                            </p>
                            <p className="mb-1">
                              <span className="text-gray-500">Phone:</span>{" "}
                              {user.phone || "—"}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3">Profile</h4>
                            <img
                              src={user.avatar || "https://i.pravatar.cc/100"}
                              alt={user.name || "User"}
                              className="w-24 h-24 rounded-xl object-cover border"
                            />
                            <p className="mt-2 text-xs text-gray-400 break-all max-w-xs line-clamp-2">
                              {user.avatar || "Default avatar"}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3">Meta</h4>
                            <p className="mb-1">
                              <span className="text-gray-500">Role:</span>{" "}
                              <span className="font-medium">
                                {user.role || "user"}
                              </span>
                            </p>
                            <p className="mb-1">
                              <span className="text-gray-500">ID:</span>{" "}
                              <span className="font-mono text-xs text-gray-400">
                                {user.id}
                              </span>
                            </p>
                            <p className="mb-1">
                              <span className="text-gray-500">Created:</span>{" "}
                              {user.created_at
                                ? new Date(user.created_at).toLocaleString()
                                : "—"}
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

export default UsersPage;
