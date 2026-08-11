"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = "https://otopadang-api.up.railway.app";

export default function RumahPage() {
  const [rumahList, setRumahList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/rumah`, { cache: 'no-store' }) // <-- INI
    .then(res => res.json())
    .then(data => {
      setRumahList(Array.isArray(data) ? data : []); // jaga2
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  // ... sisanya sama persis punya lu
}
