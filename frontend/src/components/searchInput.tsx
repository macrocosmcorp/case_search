"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function SearchInput({
  intitalQuery,
}: {
  intitalQuery: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = inputRef.current?.value || "";
    if (query.length === 0) {
      return;
    }
    router.push(`/?q=${encodeURIComponent(query)}`);
  };

  return (
    <form className="flex flex-row w-full gap-4 mt-4" onSubmit={handleSearch}>
      <input
        ref={inputRef}
        type="text"
        defaultValue={intitalQuery || ""}
        placeholder="Search SCOTUS opinions..."
        className="flex-grow px-2 py-1 border-tiny border-lines-soft text-basesm font-medium"
      />
      <button
        type="submit"
        className="px-4 py-2 text-letter-white bg-background-blue border-lines-blue focus:outline-none hover:bg-blue-600 border-micro font-mono mono-medium"
      >
        Search
      </button>
    </form>
  );
}
