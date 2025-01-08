"use client";
import PostForm from "@/app/_compornents/PostForm";
import { useSupabaseSession } from "@/app/_hook/useSupabaseSession";
import { PostUpdateData } from "@/app/_types/PostUpdateData";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const NewPost = () => {
  const router = useRouter();
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  const { token } = useSupabaseSession();
  const handleCreate = async (updateData: PostUpdateData) => {
    if (!token) return;
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // Header に token を付与
        },
        body: JSON.stringify(updateData),
      });
      if (res.ok) {
        router.push("/admin/posts");
        alert("記事の作成ができました");
      }
    } catch (error) {
      console.log("データ取得エラー：", error);
      alert("記事の作成ができませんでした");
    }
  };
  return <PostForm isEdit={false} onCreate={handleCreate} thumbnailImageKey={thumbnailImageKey} setThumbnailImageKey={setThumbnailImageKey} />;
};

export default NewPost;
