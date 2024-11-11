"use client";
// import { Post } from "@/app/_types/Post";
import { MicroCmsPost } from "@/app/pp/_types/MicroCmsPost";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type Props = {
  params: {
    id: string;
  };
};
/**
 * ルートパラメータよりidを取得 params
 */
const PostDetail: React.FC<Props> = ({ params }) => {
  // const { id } = useParams<{id: string}>(); // useParamsでurlよりidを取得
  // const postId = Number(id) // Number関数で数値に変換
  const [post, setPost] = useState<MicroCmsPost | null>(null);
  const [loading, setLoading] = useState(true);

  //記事詳細ページの取得
  // params.idが更新かかった際に発火
  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch(`https://840vmtpwl1.microcms.io/api/v1/posts/${params.id}`, {
          headers: {
            "X-MICROCMS-API-KEY": "bph1RS3bmZ37K4rnwICqsW1vdLMfAQWJ5BRL",
          },
        });

        const post = await res.json();
        console.log("contents---->", post);
        setPost(post);
      } catch {
        console.error("Failed to fetch post");
      } finally {
        setLoading(false);
      }
    };

    fetcher();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    return <div>記事が見つかりません。</div>;
  }

  console.log("post--->", post);
  const { title, createdAt, categories, thumbnail, content } = post;
  return (
    <div className="">
      <div className="">
        <div className="">
          <Image
            width={thumbnail.width}
            height={thumbnail.height}
            src={thumbnail.url}
            alt={title}
          />
        </div>
        <div className="">
          <div className="">
            <div className="">{new Date(createdAt).toLocaleDateString()}</div>
            <div className="">
              {categories.map((category, index) => (
                <span className="" key={index}>
                  {category.name}
                </span>
              ))}
            </div>
          </div>
          <div className="">{title}</div>
          <div className="" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
