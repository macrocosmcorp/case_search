"use client";
import axios from "axios";
import { useState } from "react";

export default function SearchInput({
  intitalQuery,
}: {
  intitalQuery: string | null;
}) {
  const [query, setQuery] = useState(intitalQuery || "");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    // Submit the query to the API
    axios
      .post("/search", { query })
      .then((response) => {
        // Handle the API response here
        console.log(response.data);
      })
      .catch((error) => {
        // Handle any errors here
        console.error(error);
      });
  };

  return (
    <div className="flex flex-row w-full gap-4 mt-4">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search SCOTUS opinions..."
        className="flex-grow px-2 py-1 border-tiny border-lines-soft text-basesm font-medium"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 text-letter-white bg-background-blue border-lines-blue focus:outline-none hover:bg-blue-600 border-micro font-mono mono-medium"
      >
        Search
      </button>
    </div>
  );
}
