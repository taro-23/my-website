// src/components/ProductSidebar.tsx
interface Props {
  currentType: string;
  currentPlatforms?: string[];
}

const productTypes = [
  'Patch Pack',
  'Sample Pack',
  'Wavetable',
] as const;

export default function ProductSidebar({ currentType, currentPlatforms = [] }: Props) {
  return (
    <div className="space-y-3 text-xs">
      {/* All Products */}
      <div>
        <a
          href="/store"
          className="block w-full text-left px-1.5 py-1 rounded hover:bg-gray-100 transition text-xs font-semibold"
        >
          ALL PRODUCTS
        </a>
      </div>

      {/* Product Types */}
      <div className="border-t pt-3">
        <h3 className="font-semibold mb-1 text-gray-900 text-[12px] uppercase tracking-wide">
          Type
        </h3>
        <div className="space-y-1">
          {productTypes.map((type) => {
            const isActive = currentType === type;
            const typeParam = encodeURIComponent(type);

            return (
              <a
                key={type}
                href={`/store?type=${typeParam}`}
                className={`block px-1.5 py-1 rounded transition text-xs font-medium group ${
                  isActive ? '' : 'hover:bg-gray-50'
                }`}
              >
                <span className="relative inline-block">
                  {type}
                  {isActive ? (
                    <span className="absolute top-1/2 left-0 right-0 h-px bg-black"></span>
                  ) : (
                    <span className="absolute top-1/2 left-0 right-0 h-px bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  )}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Current Product Platform */}
      {currentPlatforms.length > 0 && (
        <div className="border-t pt-3">
          <h3 className="font-semibold mb-1 text-gray-900 text-[12px] uppercase tracking-wide">
            Platform
          </h3>
          <div className="space-y-1">
            {currentPlatforms.map((platform) => (
              <div
                key={platform}
                className="px-1.5 py-1 bg-gray-100 rounded text-xs font-medium text-gray-900"
              >
                {platform}
              </div>
            ))}
          </div>
        </div>
      )}



    </div>
  );
}