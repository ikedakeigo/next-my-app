"use client";
import { PostListBody } from "@/app/_types/PostListBody";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const PostList = () => {
  const [posts, setPosts] = useState<PostListBody[]>([]);
  const [loading, setLoding] = useState(true)

  useEffect(() => {
    const allPost = async () => {
      // 取得開始
      setLoding(true)

      try {
        // 記事一覧apiを取得
        // const res = await fetch("/api/admin/posts");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/posts`);
        const data = await res.json();
        setPosts(data.posts);
      } catch (error) {
        console.log("データ取得エラー:", error);
      } finally {
        // データの取得が完了したらローディング終了
        setLoding(false)
      }
    };
    allPost();
  }, []);

  const changeDateFormat = (data: string) => new Date(data).toLocaleDateString('ja-JP')

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-10 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">記事一覧</h2>
        <div>
          <button type="button" className="bg-blue-600 text-white font-bold rounded-lg px-4 py-4">
            <Link href="/admin/posts/new">新規作成</Link>
          </button>
        </div>
      </div>

      <div className="p-4">
        <ul>
          {posts.map((post) => {
            return (
              <li className="py-4 border-b-2" key={post.id}>
                <Link href={`/admin/posts/${post.id}`}>{post.title}</Link>
                <p className="text-gray-400">
                {changeDateFormat(post.createdAt)}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PostList;
