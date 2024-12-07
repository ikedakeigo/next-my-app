"use client";
import CategoryForm from '@/app/_compornents/CategoryForm';
import { useRouter } from 'next/navigation';
import React from 'react'

const NewCategory = () => {
  const router = useRouter();

  const handleCreate = async(updateData) => {
    try {
      const res = await fetch("/api/admin/categories",{
        method: "POST",
        body: JSON.stringify(updateData)
      });
      if(res.ok) {
        router.push("/admin/categories");
        alert("カテゴリーの作成ができました")
      }
    } catch (error) {
      console.log("データ取得エラー：", error);
      alert("カテゴリーの作成ができませんでした")
    }
  }

  // 編集画面の場合はisEditをtrueにする
  return <CategoryForm isEdit={false} onCreate={handleCreate}/>
}

export default NewCategory
