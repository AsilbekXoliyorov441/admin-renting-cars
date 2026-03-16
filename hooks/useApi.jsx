import { useState } from "react";

const BASE_URL = "https://ikpfkhvdwjrblaiyniru.supabase.co/rest/v1";

const baseHeaders = {
  apikey: "sb_publishable_SbG03902HzuTqSDtUIqsQQ_PE0BqWfA",
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrcGZraHZkd2pyYmxhaXluaXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MzY2NTUsImV4cCI6MjA4OTIxMjY1NX0.hXUFHOlBAdIwh_ZDdpj2JkX9By56FTKrIkVOMldo13E",
};

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (url, method = "GET", body = null) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/${url}`, {
        method,
        headers: {
          ...baseHeaders,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: body ? JSON.stringify(body) : null,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "API error");
      }

      if (res.status === 204) return true;

      return await res.json();
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const get = (url) => request(url, "GET");

  const post = (url, body) => request(url, "POST", body);

  const put = (url, body) => request(url, "PATCH", body);

  const del = (url) => request(url, "DELETE");

  return { get, post, put, del, loading, error };
};
