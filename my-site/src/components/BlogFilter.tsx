// src/components/BlogFilter.tsx
interface FilterState {
  tags: string[];
}

interface Props {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  availableTags: string[];
}

export default function BlogFilter({ filters, setFilters, availableTags }: Props) {
  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    setFilters({ ...filters, tags: newTags });
  };

  const handleReset = () => {
    setFilters({ tags: [] });
  };

  return (
    <div className="space-y-3 text-xs">
      {/* All Posts */}
      <div>
        <button
          onClick={handleReset}
          className="w-full text-left px-1.5 py-1 rounded hover:bg-gray-100 transition text-xs"
        >
          All Posts
        </button>
      </div>

      {/* Tags */}
      <div className="border-t pt-3">
        <h3 className="font-semibold mb-1 text-gray-900 text-[10px] uppercase tracking-wide">Tags</h3>
        <div className="space-y-1">
          {availableTags.map((tag) => {
            const isChecked = filters.tags.includes(tag);
            
            return (
              <label 
                key={tag} 
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-1.5 py-1 rounded transition"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleTag(tag)}
                  className="w-3 h-3 text-blue-600"
                />
                <span className="text-xs leading-tight">{tag}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Active Filters */}
      {filters.tags.length > 0 && (
        <div className="border-t pt-3">
          <h4 className="text-xs font-semibold mb-1 text-gray-700 uppercase tracking-wide">Active</h4>
          <div className="flex flex-wrap gap-1">
            {filters.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded"
              >
                {tag}
                <button
                  onClick={() => toggleTag(tag)}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}