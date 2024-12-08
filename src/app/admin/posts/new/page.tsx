"use client";
import PostForm from "@/app/_compornents/PostForm";
import { PostUpdateData } from "@/app/_types/PostUpdateData";
import { useRouter } from "next/navigation";
import React from "react";

const NewPost = () => {
  const router = useRouter();

  const handleCreate = async(updateData: PostUpdateData) => {
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        body: JSON.stringify(updateData),
      });
      if(res.ok){
        router.push("/admin/posts");
        alert("記事の作成ができました")
      }
    } catch (error) {
      console.log("データ取得エラー：", error);
      alert("記事の作成ができませんでした")
    }
  }
  return <PostForm isEdit={false} onCreate={handleCreate} />;
};

export default NewPost;
