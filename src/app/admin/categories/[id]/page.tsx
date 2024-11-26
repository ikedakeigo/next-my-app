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

  if(loading) {
    return <div>Loading...</div>
  }
  return (
    <CategoryForm
      handleDelete={handleDelete}
      category={category}
      isEdit={true}
    />
  )
}

export default EditCategory
