// src/components/BlogLayout.tsx
import { useState, useMemo } from 'react';
import BlogFilter from './BlogFilter';
import BlogCard from './BlogCard';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  publishDate: string;
  tags: string[];
  image: string;
  author: string;
}

interface Props {
  posts: BlogPost[];
  imageMap: Record<string, string>;
}

type SortOption = 'new' | 'old';

export default function BlogLayout({ posts, imageMap }: Props) {
  const [sortBy, setSortBy] = useState<SortOption>('new');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    tags: [] as string[],
  });

  // 利用可能なすべてのタグを取得
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // フィルタリングとソート
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...posts];

    if (filters.tags.length > 0) {
      filtered = filtered.filter(post =>
        filters.tags.some(tag => post.tags.includes(tag))
      );
    }

    // ソート
    if (sortBy === 'new') {
      filtered.sort((a, b) => 
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      );
    } else if (sortBy === 'old') {
      filtered.sort((a, b) => 
        new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()
      );
    }

    return filtered;
  }, [posts, filters, sortBy]);

  return (
    <div className="min-h-screen pt-16">
      <style>{`
        .sort-link { 
          position: relative; 
          display: inline-block; 
        }
        .sort-link::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) rotate(-12deg) scaleX(0);
          transform-origin: center;
          width: 120%;
          height: 1px;
          background: currentColor;
          opacity: 0.95;
          transition: transform .18s cubic-bezier(.2,.8,.2,1);
          pointer-events: none;
        }
        .sort-link:not(.bg-gray-900):hover::after,
        .sort-link:not(.bg-gray-900):focus::after {
          transform: translate(-50%, -50%) rotate(-12deg) scaleX(1);
        }
      `}</style>
      {/* 逆L字型レイアウト */}
      <div className="flex">
        {/* 左側: フィルター（固定） */}
        <aside className="hidden lg:block fixed left-0 top-16 w-56 h-[calc(100vh-4rem)] bg-white border-r border-gray-850 overflow-y-auto z-30">
          <div className="p-4">
            <BlogFilter 
              filters={filters} 
              setFilters={setFilters} 
              availableTags={availableTags}
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
                    {filters.tags.length > 0 && (
                      <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full min-w-5 text-center">
                        {filters.tags.length}
                      </span>
                    )}
                  </button>

                  {/* アクティブフィルター表示 */}
                  {filters.tags.length > 0 && (
                    <div className="hidden lg:flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-600 font-medium shrink-0">Active:</span>
                      {filters.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {tag}
                          <button
                            onClick={() => setFilters({ ...filters, tags: filters.tags.filter(t => t !== tag) })}
                            className="hover:text-blue-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {filters.tags.length > 3 && (
                        <span className="text-xs text-gray-600">
                          +{filters.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* 右側: ソートと記事数 */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* ソートメニュー */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSortBy('new')}
                      className={`sort-link text-xs font-medium transition relative ${
                        sortBy === 'new'
                          ? 'text-gray-900'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Newest
                    </button>
                    <button
                      onClick={() => setSortBy('old')}
                      className={`sort-link text-xs font-medium transition relative ${
                        sortBy === 'old'
                          ? 'text-gray-900'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Oldest
                    </button>
                  </div>

                  <div className="text-gray-600 text-xs font-medium whitespace-nowrap">
                    {filteredAndSortedPosts.length} posts
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

                <BlogFilter filters={filters} setFilters={setFilters} availableTags={availableTags} />

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => { setFilters({ tags: [] }); setShowFilters(false); }}
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

          {/* 記事グリッド（3列） */}
          <div className="p-10 pb-0">
            {filteredAndSortedPosts.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-gray-500 text-lg mb-2">No posts found</p>
                <p className="text-gray-400 text-sm mb-4">Try adjusting your filters</p>
                <button
                  onClick={() => setFilters({ tags: [] })}
                  className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSortedPosts.map((post) => (
                  <BlogCard 
                    key={post.id} 
                    post={post} 
                    imageSrc={imageMap[post.id] || '/placeholder.png'}
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