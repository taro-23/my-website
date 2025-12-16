// src/components/ProductSidebar.tsx
interface Props {
  currentType: string;
}

const productTypes = [
  'Patch Pack',
  'Sample Pack',
  'Wavetable',
] as const;

export default function ProductSidebar({ currentType }: Props) {
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
                className={`block px-1.5 py-1 rounded transition text-xs ${
                  isActive
                    ? 'bg-gray-900 text-white font-medium'
                    : 'hover:bg-gray-50 font-medium'
                }`}
              >
                {type}
              </a>
            );
          })}
        </div>
      </div>


      {/* Quick Links */}
      <div className="border-t pt-3">
        <h3 className="font-semibold mb-1 text-gray-900 text-[10px] uppercase tracking-wide">
          Quick Links
        </h3>
        <div className="space-y-1">
          <a
            href="/store?paid=false"
            className="block px-1.5 py-1 rounded hover:bg-gray-50 transition text-xs"
          >
            Free Products
          </a>
          <a
            href="/store?bundle=true"
            className="block px-1.5 py-1 rounded hover:bg-gray-50 transition text-xs"
          >
            Bundles
          </a>
        </div>
      </div>
    </div>
  );
}