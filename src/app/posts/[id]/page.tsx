"use client"

import { PostListBody } from "@/app/_types/PostListBody";
// import { MicroCmsPost } from "@/app/pp/_types/MicroCmsPost";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type Props = {
  params: {
    id: string
  }
}
/**
 * ルートパラメータよりidを取得 params
 */
const PostDetail: React.FC<Props> = ({params}) => {
  // const { id } = useParams<{id: string}>(); // useParamsでurlよりidを取得
  // const postId = Number(id) // Number関数で数値に変換
  const [post, setPost] = useState<PostListBody | null>(null);
  const [loading, setLoading] = useState(true);

  //記事詳細ページの取得
  // params.idが更新かかった際に発火
  useEffect(() => {
    const fetcher = async () => {
      try {

        const res = await fetch(`/api/admin/posts/${params.id}`)
        // const res = await fetch(`/api/posts/${params.id}`);
        const data = await res.json();
        setPost(data.post);
      } catch {
        console.error("Failed to fetch post");
      } finally {
        setLoading(false);
      }
    };

    fetcher();
  }, [params.id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    return <div>記事が見つかりません。</div>;
  }

  console.log("post--->", post);


  const { title, createdAt, postCategories, thumbnailUrl, content } = post;
  console.log("postCategories--->", postCategories);
  return (
    <div className="max-w-3xl m-auto pt-14">
      <div className="">
        <div className="">
          <Image
          width={200}
          height={200}
          src={thumbnailUrl}
          alt={title}
          />
        </div>
        <div className="p-4">
        <div className="flex justify-between">
            <div className="text-sm text-gray-400">{new Date(createdAt).toLocaleDateString()}</div>
            <div className="flex gap-2">
              {postCategories.map((c, index) => (
                <span className="px-2 py-1 text-xs text-blue-600 border border-solid border-blue-600 rounded" key={index}>
                  {c.category.name}
                </span>
              ))}
            </div>
          </div>
          <div className="text-2xl py-4">{title}</div>
          <div className="" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
