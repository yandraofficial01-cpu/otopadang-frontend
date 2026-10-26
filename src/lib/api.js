import axios from 'axios';

// ===============================
// CLIENT API (untuk login, post, dashboard)
// Jalan di browser, pakai localStorage
// ===============================
const api = axios.create({
  baseURL: 'https://otopadang-api.vercel.app/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// ===============================
// SERVER API (untuk SEO & SSR)
// Jalan di server Vercel, pakai fetch + revalidate
// WAJIB dipakai di app/page.js & app/mobil/page.js
// ===============================
const BASE_URL = 'https://otopadang-api.vercel.app/api';

export async function getMobilSSR() {
  try {
    const res = await fetch(`${BASE_URL}/mobil`, {
      next: { revalidate: 60 }, // ISR 60 detik = SSR + cache
    });
    if (!res.ok) throw new Error('Failed to fetch');
    const json = await res.json();
    return json.data || json;
  } catch (error) {
    console.log("SSR Fallback:", error.message);
    // Data dummy biar build gak error kalau API mati
    return [
      { id: 1, merk: "Toyota", model: "Avanza G", tahun: 2021, harga: 185000000, lokasi: "Padang", foto: "", slug: "toyota-avanza-g-2021" },
      { id: 2, merk: "Honda", model: "Brio RS", tahun: 2022, harga: 165000000, lokasi: "Padang", foto: "", slug: "honda-brio-rs-2022" },
      { id: 3, merk: "Mitsubishi", model: "Pajero Sport", tahun: 2020, harga: 485000000, lokasi: "Padang", foto: "", slug: "pajero-sport-2020" },
    ];
  }
}

export async function getMobilByIdSSR(id) {
  try {
    const res = await fetch(`${BASE_URL}/mobil/${id}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || json;
  } catch {
    return null;
  }
}

export async function getShowroomSSR() {
  try {
    const res = await fetch(`${BASE_URL}/showroom`, {
      next: { revalidate: 300 }
    });
    if (!res.ok) throw new Error('Failed');
    const json = await res.json();
    return json.data || json;
  } catch {
    return [];
  }
}
