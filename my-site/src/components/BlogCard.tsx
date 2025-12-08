// src/components/BlogCard.tsx
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
  post: BlogPost;
  imageSrc: string;
}

export default function BlogCard({ post, imageSrc }: Props) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // post.idはすでに.mdxが削除されているはず
  const postUrl = `/blog/${post.id}`;

  return (
    <a
      href={postUrl}
      className="bg-white border-2 border-gray-900 overflow-hidden hover:bg-gray-50 transition-colors flex flex-col h-full group"
    >
      {/* 記事画像 */}
      <div className="relative aspect-video bg-gray-200 overflow-hidden">
        <img
          src={imageSrc}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* 記事情報 */}
      <div className="p-6 flex flex-col grow">
        {/* タグ */}
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-900 text-white px-2 py-1 rounded uppercase tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* タイトル */}
        <h3 className="font-bold text-xl mb-3 group-hover:text-gray-600 transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* 説明 */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
          {post.description}
        </p>

        {/* メタ情報 */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200">
          <span className="font-medium">{post.author}</span>
          <time dateTime={post.publishDate}>{formatDate(post.publishDate)}</time>
        </div>
      </div>
    </a>
  );
}