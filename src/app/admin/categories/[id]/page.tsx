"use client";

import CategoryForm from '@/app/_compornents/CategoryForm';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

// パラメーターの型定義
type Params = {
  id: number;
}

// プロパティの型定義
type EditCategoryProps = {
  params: Params;
};

type UpdateData = {
  name: string;
  category?: { name: string };
};

const EditCategory: React.FC<EditCategoryProps> = ({params}) => {
  const {id} = params;
  const router = useRouter();
  const [category, setCategory] = useState();
  const [loading, setLoading] = useState(true);

  // カテゴリーの取得
  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/categories/${id}`);
        const data = await res.json();
        setCategory(data.category);
      } catch (error) {
        console.log("データ取得エラー:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategory();
  }, [id]);

  // カテゴリーの削除
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`,{
        method: 'DELETE',
        body: JSON.stringify(id)
      });
      const {status} = await res.json();
      if(status == 'OK') {
        router.push("/admin/categories");
        alert("カテゴリーの削除ができました");
      }
    } catch (error) {
      console.log("データ取得エラー:", error);
    }
  }

  // カテゴリーの更新
  const handleUpdate = async (updateData: UpdateData) => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });
      if(res.ok) {
        router.push("/admin/categories");
        alert("カテゴリーの更新ができました。")
      }
    } catch (error) {
      console.log("データの取得エラー：", error)
      alert("カテゴリーの更新ができませんでした")
    }
  }

  if(loading) {
    return <div>Loading...</div>
  }
  return (
    <CategoryForm
      handleDelete={handleDelete}
      onUpdate={handleUpdate}
      category={category}
      isEdit={true}
    />
  )
}

export default EditCategory
