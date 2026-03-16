import React, { useEffect, useState } from "react";

const CarsPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch(
          "https://ikpfkhvdwjrblaiyniru.supabase.co/rest/v1/cars?select=*",
          {
            headers: {
              apikey: "sb_publishable_SbG03902HzuTqSDtUIqsQQ_PE0BqWfA",
              Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              "Content-Type": "application/json",
            },
          },
        );

        if (!res.ok) throw new Error("Supabase error");

        const data = await res.json();

        setCars(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="text-xl font-semibold mb-4">Cars</h2>

      <table className="w-full">
        <thead className="border-b">
          <tr className="text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
          </tr>
        </thead>

        <tbody>
          {cars.map((car) => (
            <tr key={car.id} className="border-b">
              <td className="p-2">{car.id}</td>
              <td className="p-2">{car.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CarsPage;
