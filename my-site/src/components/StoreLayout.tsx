// src/components/StoreLayout.tsx
import { useState, useMemo } from 'react';
import type { Product } from '../data/products';
import ProductFilter from './ProductFilter';
import ProductCard from './ProductCard';

interface Props {
  products: Product[];
  imageMap: Record<string, string>;
}

type SortOption = 'new' | 'price-low' | 'price-high';

export default function StoreLayout({ products, imageMap }: Props) {
  const [sortBy, setSortBy] = useState<SortOption>('new');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    paid: null as boolean | null,
    type: null as Product['type'] | null,
    platform: [] as string[],
    bundle: null as boolean | null,
  });

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    if (filters.paid !== null) {
      filtered = filtered.filter(p => p.paid === filters.paid);
    }
    if (filters.type !== null) {
      filtered = filtered.filter(p => p.type === filters.type);
    }
    if (filters.platform.length > 0) {
      filtered = filtered.filter(p => 
        filters.platform.some(plat => p.platform.includes(plat))
      );
    }
    if (filters.bundle !== null) {
      filtered = filtered.filter(p => p.bundle === filters.bundle);
    }

    if (sortBy === 'new') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, filters, sortBy]);

  return (
    <div className="min-h-screen pt-16">
      {/* 逆L字型レイアウト */}
      <div className="flex">
        {/* 左側: フィルター（固定） */}
        <aside className="hidden lg:block fixed left-0 top-16 w-56 h-[calc(100vh-4rem)] bg-white border-r border-gray-850 overflow-y-auto z-30">
          <div className="p-4">
            <ProductFilter 
              filters={filters} 
              setFilters={setFilters} 
              allProducts={products}
            />
          </div>
        </aside>

        {/* 右側: メインコンテンツエリア */}
        <div className="w-full lg:ml-56">
          {/* ソートバー（固定） */}
          <div className="sticky top-16 bg-white border-b border-gray-950 z-20">
            <div className="px-4 py-2">
              <div className="flex items-center justify-between gap-4">
                {/* 左側: アクティブフィルター表示 */}
                <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                  {/* モバイルフィルターボタン */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition text-sm shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="font-medium text-sm">Filter</span>
                    {(filters.type || filters.platform.length > 0 || filters.bundle !== null || filters.paid !== null) && (
                      <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full min-w-5 text-center">
                        {[
                          filters.type ? 1 : 0,
                          filters.platform.length,
                          filters.bundle !== null ? 1 : 0,
                          filters.paid !== null ? 1 : 0
                        ].reduce((a, b) => a + b, 0)}
                      </span>
                    )}
                  </button>

                  {/* アクティブフィルター表示 */}
                  {(filters.type || filters.platform.length > 0 || filters.bundle !== null || filters.paid !== null) && (
                    <div className="hidden lg:flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-600 font-medium shrink-0">Active:</span>
                      {filters.type && (
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {filters.type}
                          <button
                            onClick={() => setFilters({ ...filters, type: null, platform: [] })}
                            className="hover:text-blue-900"
                          >
                            ×
                          </button>
                        </span>
                      )}
                      {filters.platform.slice(0, 2).map((plat) => (
                        <span key={plat} className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {plat}
                          <button
                            onClick={() => setFilters({ ...filters, platform: filters.platform.filter(p => p !== plat) })}
                            className="hover:text-green-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {filters.platform.length > 2 && (
                        <span className="text-xs text-gray-600">
                          +{filters.platform.length - 2} more
                        </span>
                      )}
                      {filters.bundle !== null && (
                        <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
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
                        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
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
                  )}
                </div>

                {/* 右側: ソートと商品数 */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* ソートメニュー */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSortBy('new')}
                      className={`px-3 py-2 text-xs font-medium rounded-lg transition ${
                        sortBy === 'new'
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      New
                    </button>
                    <button
                      onClick={() => setSortBy('price-low')}
                      className={`px-3 py-2 text-xs font-medium rounded-lg transition ${
                        sortBy === 'price-low'
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Low
                    </button>
                    <button
                      onClick={() => setSortBy('price-high')}
                      className={`px-3 py-2 text-xs font-medium rounded-lg transition ${
                        sortBy === 'price-high'
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      High
                    </button>
                  </div>

                  <div className="text-gray-600 text-xs font-medium whitespace-nowrap">
                    {filteredAndSortedProducts.length} products
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* モバイル固定オーバーレイ */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters dialog">
              {/* 背景遮蔽（クリックで閉じる） */}
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />

              {/* フィルター本体 */}
              <aside id="mobile-filters" className="absolute left-0 top-0 h-full w-full bg-white overflow-auto p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    aria-label="Close filters"
                    className="text-2xl leading-none text-gray-700"
                  >
                    ×
                  </button>
                </div>

                <ProductFilter filters={filters} setFilters={setFilters} allProducts={products} />

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => { setFilters({ paid: null, type: null, platform: [], bundle: null }); setShowFilters(false); }}
                    className="flex-1 px-4 py-2 border rounded-md text-sm"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md text-sm"
                  >
                    Apply
                  </button>
                </div>
              </aside>
            </div>
          )}

          {/* 商品グリッド（スクロール可能） */}
          <div className="p-10 pb-0">
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-gray-500 text-lg mb-2">No products found</p>
                <p className="text-gray-400 text-sm mb-4">Try adjusting your filters</p>
                <button
                  onClick={() => setFilters({ paid: null, type: null, platform: [], bundle: null })}
                  className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    imageSrc={imageMap[product.id] || '/placeholder.png'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}