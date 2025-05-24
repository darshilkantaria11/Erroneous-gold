"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;
        const slug = trimmed.toLowerCase().replace(/\s+/g, "-"); // "Fairy Necklace" => "fairy-necklace"
        router.push(`/search/${slug}`);
    };

    return (
        <form onSubmit={handleSearch} className="flex items-center space-x-3">
            <div className="relative flex items-center bg-white border border-c4 rounded-full px-4 py-2">
                <input
                    type="text"
                    placeholder="Search..."
                    className="outline-none bg-transparent text-sm w-24 md:w-44 text-c4"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <FiSearch className="text-gray-500 w-5 h-5" />
            </div>
        </form>
    );
}
