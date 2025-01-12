"use client";

import PostForm from "@/app/_compornents/PostForm";
import { useSupabaseSession } from "@/app/_hook/useSupabaseSession";
import { PostListBody } from "@/app/_types/PostListBody";
import { PostUpdateData } from "@/app/_types/PostUpdateData";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Params = {
  id: number;
};

type EditPostProps = {
  params: Params;
};

const EditPost: React.FC<EditPostProps> = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [post, setPost] = useState<PostListBody>();
  const [loading, setLoading] = useState(true);
  const { token } = useSupabaseSession();
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");

  // 記事の取得
  useEffect(() => {
    if (!token) return;
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/posts/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        const data = await res.json();
        setPost(data.post);
        if(data.post.thumbnailImageKey) {
          setThumbnailImageKey(data.post.thumbnailImageKey);// 画像のキーを取得
        }else {
          console.log("画像がない");
          setThumbnailImageKey("");
        }

      } catch (error) {
        console.log("データ取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, token]);

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
        alert("記事の削除ができました");
      }
    } catch (error) {
      console.log("データの取得エラー:", error);
    } finally {
      setLoading(false);
    }
  };

  // 記事の更新
  const handleUpdate = async (updateData: PostUpdateData) => {
    console.log("更新", updateData);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });
      if (res.ok) {
        router.push("/admin/posts");
        alert("記事の更新ができました");
      }
    } catch (error) {
      console.log("データの取得エラー：", error);
      alert("記事の更新ができませんでした");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <PostForm handleDelete={handleDelete} onUpdate={handleUpdate} post={post} isEdit={true} thumbnailImageKey={thumbnailImageKey} setThumbnailImageKey={setThumbnailImageKey} />;
};

export default EditPost;
