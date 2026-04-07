type SearchBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
};

export default function SearchBar({
  query,
  onQueryChange,
  onSearch,
  loading,
}: SearchBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch();
          }
        }}
        placeholder="Search for a product..."
        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-black"
      />
      <button
        onClick={onSearch}
        disabled={loading}
        className="rounded-lg bg-black px-5 py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
}