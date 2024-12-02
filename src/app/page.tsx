"use client";
import { useEffect, useState } from "react";
// import styles from "./PostList.module.css";
import Link from "next/link";

// import { MicroCmsPost } from "./pp/_types/MicroCmsPost";
import { PostListBody } from "./_types/PostListBody";

const PostList = () => {
  const [postsList, setPostsList] = useState<PostListBody[]>([]);

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPostsList(data.posts);
    };

    fetcher();
  }, []);

  console.log("postsList--->", postsList)
  return (
    <ul className="flex flex-col gap-8">
      {postsList.map((post) => (
        <li className="m-auto p-4 border border-solid border-gray-300 w-11/12 max-w-3xl" key={post.id}>
          {/* Linkコンポーネントを使用して詳細ページに遷移 */}
          <Link href={`/posts/${post.id}`} className="">
          <div className="flex justify-between">
              <div>
                <div className="">
                  <div className="text-sm text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</div>
                  <div className="flex gap-2">
                    {post.postCategories.map((postCategories, index) => (
                      <span className="px-2 py-1 text-xs text-blue-600 border border-solid border-blue-600 rounded" key={index}>
                        {postCategories.category.name}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-2xl py-4">{post.title}</p>
                <div className="line-clamp-2" dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
