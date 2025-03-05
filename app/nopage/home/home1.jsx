"use client";
import { useState } from "react";
import axios from "axios";

export default function HeroSection() {
  const [name, setName] = useState("");
  const [meaning, setMeaning] = useState("");

  const fetchNameMeaning = async () => {
    if (!name) return;
    try {
      const response = await axios.get(`/api/name-meaning?name=${name}`);
      setMeaning(response.data.meaning);
    } catch (error) {
      setMeaning("Error fetching name meaning.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] bg-[#F8F5E9] text-[#1B4638]">
      <h1 className="text-4xl font-bold mb-4">Find Your Name Meaning</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="p-2 border border-gray-300 rounded-md text-center"
      />
      <button
        onClick={fetchNameMeaning}
        className="mt-4 px-6 py-2 bg-[#1B4638] text-white rounded-md"
      >
        Show Meaning
      </button>
      {meaning && <p className="mt-4 text-lg font-semibold">{meaning}</p>}
    </div>
  );
}
