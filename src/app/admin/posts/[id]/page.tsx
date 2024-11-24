'use client';

import PostForm from "@/app/_compornents/PostForm";
import { PostListBody } from "@/app/_types/PostListBody";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const EditPost = ({ params }:any) => {
  const { id } = params;
  const router = useRouter();
  const [post, setPost] = useState<PostListBody>();
  const [loading, setLoading] = useState(true);

  // 記事の取得
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/posts/${id}`);
        console.log("res--------->", res)
        const data = await res.json();
        setPost(data.post);
      } catch (error) {
        console.log("データ取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, []);

  // 記事の削除
  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
        body: JSON.stringify(id),
      });
      const { status } = await res.json();
      if (status === "OK") {
        router.push("/admin/posts");
        alert("記事の削除ができました")
      }
    } catch (error) {
      console.log("データの取得エラー:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>
  }

  console.log("post-------->", post)
  return (
    <PostForm
      handleDelete={handleDelete}
      post={post}
      isEdit={true}
    />
  );
};

export default EditPost;
