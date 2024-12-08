'use client';

import PostForm from "@/app/_compornents/PostForm";
import { PostListBody } from "@/app/_types/PostListBody";
import { PostUpdateData } from "@/app/_types/PostUpdateData";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Params = {
  id: number;
}

type EditPostProps = {
  params: Params;
}

const EditPost: React.FC<EditPostProps> = ({ params }) => {
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
        const data = await res.json();
        setPost(data.post);
      } catch (error) {
        console.log("データ取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

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

  // 記事の更新
  const handleUpdate = async (updateData: PostUpdateData) => {
    console.log("更新", updateData)
    try {
      const res = await fetch(`/api/admin/posts/${id}`,{
        method: "PUT",
        body: JSON.stringify(updateData),
      });
      if(res.ok) {
        router.push("/admin/posts");
        alert("記事の更新ができました")
      }
    } catch (error) {
      console.log("データの取得エラー：", error)
      alert("記事の更新ができませんでした")
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <PostForm
      handleDelete={handleDelete}
      onUpdate={handleUpdate}
      post={post}
      isEdit={true}
    />
  );
};

export default EditPost;
