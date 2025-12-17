import { useMemo, useState } from 'react';

interface Product {
  type: 'Patch Pack' | 'Sample Pack' | 'Wavetable';
  platform: string[];
  paid: boolean;
  bundle: boolean;
}

interface FilterState {
  paid: boolean | null;
  type: Product['type'] | null;
  platform: string[];
  bundle: boolean | null;
}

interface Props {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  allProducts: Product[];
}

const typeOptions: Product['type'][] = [
  'Patch Pack',
  'Sample Pack',
  'Wavetable',
];

// カスタムチェックボックスコンポーネント
function CustomCheckbox({ checked }: { checked: boolean }) {
  return (
    <div className="w-4 h-4 flex items-center justify-center">
      {checked && (
        <span className="text-base leading-none">🗸</span>
      )}
    </div>
  );
}

export default function ProductFilter({ filters, setFilters, allProducts }: Props) {
  const [openBundle, setOpenBundle] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);

  const availablePlatforms = useMemo(() => {
    if (!filters.type) {
      const allPlatforms = new Set<string>();
      allProducts.forEach(product => {
        product.platform.forEach(p => allPlatforms.add(p));
      });
      return Array.from(allPlatforms).sort();
    }

    const platforms = new Set<string>();
    allProducts
      .filter(product => product.type === filters.type)
      .forEach(product => {
        product.platform.forEach(p => platforms.add(p));
      });

    return Array.from(platforms).sort();
  }, [filters.type, allProducts]);

  const handleReset = () => {
    setFilters({
      paid: null,
      type: null,
      platform: [],
      bundle: null,
    });
  };

  const handleTypeChange = (newType: Product['type'] | null) => {
    setFilters({
      ...filters,
      type: newType,
      platform: [],
    });
  };

  const togglePlatform = (plat: string) => {
    const newPlatform = filters.platform.includes(plat)
      ? filters.platform.filter(p => p !== plat)
      : [...filters.platform, plat];
    setFilters({ ...filters, platform: newPlatform });
  };

  return (
    <div className="space-y-3 text-xs">
      {/* All Products */}
      <div>
        <button
          onClick={handleReset}
          className="w-full font-bold text-semibold-left px-1.5 py-1 rounded hover:bg-gray-100 transition text-xs"
        >
          RESET
        </button>
      </div>

      {/* Product Type */}
      <div className="border-t pt-3">
        <h3 className="font-semibold mb-1 text-gray-900 text-[12px] uppercase tracking-wide">Type</h3>
        <div className="space-y-1">
          <label className="flex items-center gap-2 cursor-pointer px-1.5 py-1 rounded transition group relative">
            <input
              type="checkbox"
              checked={filters.type === null}
              onChange={() => handleTypeChange(null)}
              className="hidden"
            />
            <CustomCheckbox checked={filters.type === null} />
            <span className="font-medium text-xs relative">
              All
              <span className="absolute top-1/2 left-0 right-0 h-px bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </span>
          </label>
          {typeOptions.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer px-1.5 py-1 rounded transition group relative">
              <input
                type="checkbox"
                checked={filters.type === type}
                onChange={() => handleTypeChange(type)}
                className="hidden"
              />
              <CustomCheckbox checked={filters.type === type} />
              <span className="font-medium text-xs relative">
                {type}
                <span className="absolute top-1/2 left-0 right-0 h-px bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Platform */}
      <div className="border-t pt-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-900 text-[12px] uppercase tracking-wide">Platform</h3>
          {filters.type && (
            <span className="text-xs text-gray-500">
              ({availablePlatforms.length})
            </span>
          )}
        </div>
        
        {availablePlatforms.length === 0 ? (
          <p className="text-xs text-gray-500 italic px-1.5 py-1">
            No platforms
          </p>
        ) : (
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            {availablePlatforms.map((plat) => {
              const isChecked = filters.platform.includes(plat);
              
              return (
                <label 
                  key={plat} 
                  className="flex items-center gap-2 cursor-pointer px-1.5 py-1 rounded transition group relative"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => togglePlatform(plat)}
                    className="hidden"
                  />
                  <CustomCheckbox checked={isChecked} />
                  <span className="font-medium text-xs leading-tight relative">
                    {plat}
                    <span className="absolute top-1/2 left-0 right-0 h-px bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Bundle */}
      <div className="border-t pt-3">
        <button
          onClick={() => setOpenBundle(prev => !prev)}
          className="w-full flex items-center justify-between hover:bg-gray-50 px-1.5 py-1 rounded transition cursor-pointer"
          aria-expanded={openBundle}
          aria-controls="bundle-panel"
        >
          <h3 className="font-semibold text-gray-900 text-[12px] uppercase tracking-wide">Bundle</h3>
          <span className="text-xs text-gray-600">
            {openBundle ? '−' : '+'}
          </span>
        </button>

        <div id="bundle-panel" className={openBundle ? 'mt-2 space-y-1' : 'hidden'}>
          <div className="space-y-1">
            <label className="flex items-center gap-2 cursor-pointer px-1.5 py-1 rounded transition group relative">
              <input
                type="checkbox"
                checked={filters.bundle === null}
                onChange={() => setFilters({ ...filters, bundle: null })}
                className="hidden"
              />
              <CustomCheckbox checked={filters.bundle === null} />
              <span className="text-xs relative">
                All
                <span className="absolute top-1/2 left-0 right-0 h-px bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer px-1.5 py-1 rounded transition group relative">
              <input
                type="checkbox"
                checked={filters.bundle === true}
                onChange={() => setFilters({ ...filters, bundle: true })}
                className="hidden"
              />
              <CustomCheckbox checked={filters.bundle === true} />
              <span className="font-medium text-xs relative">
                Bundle
                <span className="absolute top-1/2 left-0 right-0 h-px bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer px-1.5 py-1 rounded transition group relative">
              <input
                type="checkbox"
                checked={filters.bundle === false}
                onChange={() => setFilters({ ...filters, bundle: false })}
                className="hidden"
              />
              <CustomCheckbox checked={filters.bundle === false} />
              <span className="font-medium text-xs relative">
                Single
                <span className="absolute top-1/2 left-0 right-0 h-px bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="border-t pt-3">
        <button
          onClick={() => setOpenPrice(prev => !prev)}
          className="w-full flex items-center justify-between hover:bg-gray-50 px-1.5 py-1 rounded transition cursor-pointer"
          aria-expanded={openPrice}
          aria-controls="price-panel"
        >
          <h3 className="font-semibold text-gray-900 text-[12px] uppercase tracking-wide">Price</h3>
          <span className="text-xs text-gray-600">
            {openPrice ? '−' : '+'}
          </span>
        </button>

        <div id="price-panel" className={openPrice ? 'mt-2 space-y-1' : 'hidden'}>
          <div className="space-y-1">
            <label className="flex items-center gap-2 cursor-pointer px-1.5 py-1 rounded transition group relative">
              <input
                type="checkbox"
                checked={filters.paid === null}
                onChange={() => setFilters({ ...filters, paid: null })}
                className="hidden"
              />
              <CustomCheckbox checked={filters.paid === null} />
              <span className="font-medium text-xs relative">
                All
                <span className="absolute top-1/2 left-0 right-0 h-px bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer px-1.5 py-1 rounded transition group relative">
              <input
                type="checkbox"
                checked={filters.paid === true}
                onChange={() => setFilters({ ...filters, paid: true })}
                className="hidden"
              />
              <CustomCheckbox checked={filters.paid === true} />
              <span className="font-medium text-xs relative">
                Paid
                <span className="absolute top-1/2 left-0 right-0 h-px bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer px-1.5 py-1 rounded transition group relative">
              <input
                type="checkbox"
                checked={filters.paid === false}
                onChange={() => setFilters({ ...filters, paid: false })}
                className="hidden"
              />
              <CustomCheckbox checked={filters.paid === false} />
              <span className="font-medium text-xs relative">
                Free
                <span className="absolute top-1/2 left-0 right-0 h-px bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(filters.type || filters.platform.length > 0 || filters.bundle !== null || filters.paid !== null) && (
        <div className="border-t pt-3">
          <h4 className="text-xs font-semibold mb-1 text-gray-700 uppercase tracking-wide">Active</h4>
          <div className="flex flex-wrap gap-1">
            {filters.type && (
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded">
                {filters.type}
                <button
                  onClick={() => handleTypeChange(null)}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.platform.map((plat) => (
              <span key={plat} className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">
                {plat}
                <button
                  onClick={() => togglePlatform(plat)}
                  className="hover:text-green-900"
                >
                  ×
                </button>
              </span>
            ))}
            {filters.bundle !== null && (
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-1.5 py-0.5 rounded">
                {filters.bundle ? 'Bundle' : 'Single'}
                <button
                  onClick={() => setFilters({ ...filters, bundle: null })}
                  className="hover:text-purple-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.paid !== null && (
              <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded">
                {filters.paid ? 'Paid' : 'Free'}
                <button
                  onClick={() => setFilters({ ...filters, paid: null })}
                  className="hover:text-yellow-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}