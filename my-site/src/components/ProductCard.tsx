// src/components/ProductCard.tsx
import type { Product } from '../data/productsdata';

interface Props {
  product: Product;
  imageSrc: string;
}

export default function ProductCard({ product, imageSrc }: Props) {
  const productUrl = `/products/${product.id}`;
  
  return (
    <a 
      href={productUrl}
      className="bg-white hover:bg-gray-50 transition-colors flex flex-col h-full group p-4"
    >
      {/* 商品画像 */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden mb-2">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        {product.bundle && (
          <span className="absolute top-2 right-2 bg-gray-950 text-white text-xs px-2 py-1 font-semibold">
            Bundle
          </span>
        )}
        {!product.paid && (
          <span className="absolute top-2 left-2 bg-white text-black text-xs px-2 py-1 border border-gray-900 font-semibold">
            FREE
          </span>
        )}
      </div>

      {/* 商品情報 */}
      <div className="flex flex-col grow">
        {/* 名前と価格 */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-sm group-hover:text-gray-600 transition-colors flex-1">
            {product.name}
          </h3>
          <span className="text-sm font-bold text-gray-900 whitespace-nowrap shrink-0">
            {product.paid ? `$${product.price}` : 'Free'}
          </span>
        </div>

        {/* タグ */}
        <div className="flex flex-wrap gap-1">
          <span className="text-xs bg-gray-900 text-white px-2 py-1">
            {product.type}
          </span>
          {product.platform.slice(0, 2).map((plat) => (
            <span key={plat} className="text-xs border border-gray-900 text-gray-900 px-2 py-1">
              {plat}
            </span>
          ))}
          {product.platform.length > 2 && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1">
              +{product.platform.length - 2}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}