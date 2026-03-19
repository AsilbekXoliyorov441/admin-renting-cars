import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";

const CarsPage = () => {
  const { get, post, put, del, loading } = useApi();

  const [cars, setCars] = useState([]);

  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openRow, setOpenRow] = useState(null);

  const emptyForm = {
    brand_id: "",
    color_id: "",
    category_id: "",
    model: "",
    year: "",
    fuel_type: "",
    transmission: "",
    engine: "",
    horsepower: "",
    seats: "",
    doors: "",
    mileage: "",
    drive_type: "",
    air_conditioning: false,
    bluetooth: false,
    gps: false,
    parking_sensors: false,
    rear_camera: false,
    cruise_control: false,
    price_per_day: "",
    price_per_week: "",
    price_per_month: "",
    deposit: "",
    min_rent_days: "",
    images: "",
    videos: "",
    city: "",
    location: "",
    latitude: "",
    longitude: "",
    is_available: true,
    is_featured: false,
    description: "",
    status: "active",
  };

  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const fetchCars = async () => {
    const data = await get("cars?select=*");
    setCars(data || []);
  };

  const fetchRelations = async () => {
    setBrands((await get("brands?select=*")) || []);
    setColors((await get("colors?select=*")) || []);
    setCategories((await get("categories?select=*")) || []);
  };

  useEffect(() => {
    fetchCars();
    fetchRelations();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      year: Number(form.year),
      horsepower: Number(form.horsepower),
      seats: Number(form.seats),
      doors: Number(form.doors),
      mileage: Number(form.mileage),
      price_per_day: Number(form.price_per_day),
      price_per_week: Number(form.price_per_week),
      price_per_month: Number(form.price_per_month),
      deposit: Number(form.deposit),
      min_rent_days: Number(form.min_rent_days),
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      images: form.images ? form.images.split(",") : [],
      videos: form.videos ? form.videos.split(",") : [],
    };

    if (editId) {
      await put(`cars?id=eq.${editId}`, payload);
    } else {
      await post("cars", payload);
    }

    resetForm();
    fetchCars();
  };

  const handleEdit = (car) => {
    setEditId(car.id);

    setForm({
      ...car,
      images: car.images?.join(",") || "",
      videos: car.videos?.join(",") || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete car?")) return;

    await del(`cars?id=eq.${id}`);
    fetchCars();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-6">Cars</h2>

      {/* FORM */}

      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-3 mb-8">
        {/* relations */}

        <select
          name="brand_id"
          value={form.brand_id}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Brand</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          name="color_id"
          value={form.color_id}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Color</option>
          {colors.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* basic */}

        <input
          name="model"
          placeholder="Model"
          value={form.model}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="year"
          placeholder="Year"
          value={form.year}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="fuel_type"
          placeholder="Fuel Type"
          value={form.fuel_type}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="transmission"
          placeholder="Transmission"
          value={form.transmission}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="engine"
          placeholder="Engine"
          value={form.engine}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="horsepower"
          placeholder="Horsepower"
          value={form.horsepower}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="seats"
          placeholder="Seats"
          value={form.seats}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="doors"
          placeholder="Doors"
          value={form.doors}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="mileage"
          placeholder="Mileage"
          value={form.mileage}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="drive_type"
          placeholder="Drive Type"
          value={form.drive_type}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* features */}

        <label>
          <input
            type="checkbox"
            name="air_conditioning"
            checked={form.air_conditioning}
            onChange={handleChange}
          />{" "}
          Air conditioning
        </label>
        <label>
          <input
            type="checkbox"
            name="bluetooth"
            checked={form.bluetooth}
            onChange={handleChange}
          />{" "}
          Bluetooth
        </label>
        <label>
          <input
            type="checkbox"
            name="gps"
            checked={form.gps}
            onChange={handleChange}
          />{" "}
          GPS
        </label>
        <label>
          <input
            type="checkbox"
            name="parking_sensors"
            checked={form.parking_sensors}
            onChange={handleChange}
          />{" "}
          Parking sensors
        </label>
        <label>
          <input
            type="checkbox"
            name="rear_camera"
            checked={form.rear_camera}
            onChange={handleChange}
          />{" "}
          Rear camera
        </label>
        <label>
          <input
            type="checkbox"
            name="cruise_control"
            checked={form.cruise_control}
            onChange={handleChange}
          />{" "}
          Cruise control
        </label>

        {/* pricing */}

        <input
          name="price_per_day"
          placeholder="Price per day"
          value={form.price_per_day}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="price_per_week"
          placeholder="Price per week"
          value={form.price_per_week}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="price_per_month"
          placeholder="Price per month"
          value={form.price_per_month}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="deposit"
          placeholder="Deposit"
          value={form.deposit}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="min_rent_days"
          placeholder="Min rent days"
          value={form.min_rent_days}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* media */}

        <input
          name="images"
          placeholder="Images URL (comma separated)"
          value={form.images}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="videos"
          placeholder="Videos URL (comma separated)"
          value={form.videos}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* location */}

        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="latitude"
          placeholder="Latitude"
          value={form.latitude}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="longitude"
          placeholder="Longitude"
          value={form.longitude}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* other */}

        <label>
          <input
            type="checkbox"
            name="is_available"
            checked={form.is_available}
            onChange={handleChange}
          />{" "}
          Available
        </label>
        <label>
          <input
            type="checkbox"
            name="is_featured"
            checked={form.is_featured}
            onChange={handleChange}
          />{" "}
          Featured
        </label>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded col-span-4"
        />

        <button className="col-span-4 bg-black text-white p-3 rounded">
          {editId ? "Update Car" : "Add Car"}
        </button>
      </form>

      {/* TABLE */}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th>Image</th>
              <th>Model</th>
              <th>Year</th>
              <th>City</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {cars.map((car) => {
              const brand = brands.find((b) => b.id === car.brand_id);
              const category = categories.find((c) => c.id === car.category_id);

              return (
                <React.Fragment key={car.id}>
                  {/* MAIN ROW */}

                  <tr className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <img
                        src={car.images?.[0]}
                        className="w-20 h-14 object-cover rounded-lg"
                      />
                    </td>

                    <td className="font-semibold">
                      {brand?.name} {car.model}
                    </td>

                    <td>{category?.name}</td>

                    <td>{car.year}</td>

                    <td>{car.city}</td>

                    <td className="font-semibold">${car.price_per_day}</td>

                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          car.is_available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {car.is_available ? "Available" : "Busy"}
                      </span>
                    </td>

                    <td className="space-x-2">
                      <button
                        onClick={() =>
                          setOpenRow(openRow === car.id ? null : car.id)
                        }
                        className="px-3 py-1 bg-gray-200 rounded"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => handleEdit(car)}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(car.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {/* DETAILS ROW */}

                  {openRow === car.id && (
                    <tr className="bg-gray-50">
                      <td colSpan="8" className="p-6">
                        <div className="grid grid-cols-4 gap-6 text-sm">
                          {/* ENGINE */}

                          <div>
                            <h4 className="font-semibold mb-2">Engine</h4>

                            <p>Engine: {car.engine}</p>
                            <p>Horsepower: {car.horsepower}</p>
                            <p>Fuel: {car.fuel_type}</p>
                            <p>Transmission: {car.transmission}</p>
                            <p>Drive: {car.drive_type}</p>
                          </div>

                          {/* SPECS */}

                          <div>
                            <h4 className="font-semibold mb-2">Specs</h4>

                            <p>Seats: {car.seats}</p>
                            <p>Doors: {car.doors}</p>
                            <p>Mileage: {car.mileage}</p>
                          </div>

                          {/* PRICES */}

                          <div>
                            <h4 className="font-semibold mb-2">Pricing</h4>

                            <p>Day: ${car.price_per_day}</p>
                            <p>Week: ${car.price_per_week}</p>
                            <p>Month: ${car.price_per_month}</p>
                            <p>Deposit: ${car.deposit}</p>
                            <p>Min rent: {car.min_rent_days} days</p>
                          </div>

                          {/* LOCATION */}

                          <div>
                            <h4 className="font-semibold mb-2">Location</h4>

                            <p>City: {car.city}</p>
                            <p>Address: {car.location}</p>
                            <p>Lat: {car.latitude}</p>
                            <p>Lng: {car.longitude}</p>
                          </div>
                        </div>

                        {/* FEATURES */}

                        <div className="mt-6">
                          <h4 className="font-semibold mb-2">Features</h4>

                          <div className="flex flex-wrap gap-2">
                            {car.air_conditioning && (
                              <span className="px-2 py-1 bg-gray-200 rounded text-xs">
                                AC
                              </span>
                            )}

                            {car.bluetooth && (
                              <span className="px-2 py-1 bg-gray-200 rounded text-xs">
                                Bluetooth
                              </span>
                            )}

                            {car.gps && (
                              <span className="px-2 py-1 bg-gray-200 rounded text-xs">
                                GPS
                              </span>
                            )}

                            {car.parking_sensors && (
                              <span className="px-2 py-1 bg-gray-200 rounded text-xs">
                                Parking Sensors
                              </span>
                            )}

                            {car.rear_camera && (
                              <span className="px-2 py-1 bg-gray-200 rounded text-xs">
                                Rear Camera
                              </span>
                            )}

                            {car.cruise_control && (
                              <span className="px-2 py-1 bg-gray-200 rounded text-xs">
                                Cruise Control
                              </span>
                            )}
                          </div>
                        </div>

                        {/* DESCRIPTION */}

                        <div className="mt-6">
                          <h4 className="font-semibold mb-2">Description</h4>

                          <p className="text-gray-600">{car.description}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CarsPage;
