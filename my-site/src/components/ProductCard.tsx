// src/components/ProductCard.tsx
import type { Product } from '../data/productsdata';

interface Props {
  product: Product;
  imageSrc: string; // Astroから渡される最適化済み画像パス
}

export default function ProductCard({ product, imageSrc }: Props) {
  // product.idはすでに.mdxが削除されているはず
  const productUrl = `/products/${product.id}`;
  
  return (
    <a 
      href={productUrl}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group"
    >
      {/* 商品画像 */}
      <div className="relative aspect-square bg-gray-200 overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.bundle && (
          <span className="absolute top-2 right-2 bg-gray-950 text-white text-xs px-2 py-1 rounded font-semibold">
            Bundle
          </span>
        )}
        {!product.paid && (
          <span className="absolute top-2 left-2 bg-slate-100 text-black text-xs px-2 py-1 rounded font-semibold">
            FREE
          </span>
        )}
      </div>

      {/* 商品情報 */}
      <div className="p-4 flex flex-col grow">
        {/* 名前と価格を同じ行に配置 */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base pr-2 group-hover:text-slate-950 transition-colors flex-1 wrap-break-word">
            {product.name}
          </h3>
          <span className="text-s font-normal text-gray-900 whitespace-nowrap shrink-0">
            {product.paid ? `$${product.price}` : 'Free'}
          </span>
        </div>

        {/* タグ */}
        <div className="flex flex-wrap gap-1 mb-3 mt-1">
          <span className="text-xs bg-gray-200 text-gray-950 px-2 py-1 rounded">
            {product.type}
          </span>
          {product.platform.slice(0, 2).map((plat) => (
            <span key={plat} className="text-xs bg-zinc-900 text-gray-50 px-2 py-1 rounded">
              {plat}
            </span>
          ))}
          {product.platform.length > 2 && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              +{product.platform.length - 2}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}