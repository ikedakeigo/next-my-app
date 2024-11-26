"use client";
import { RequestCategoryBody } from "@/app/_types/RequestCategoryBody";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const CategoryList = () => {
  const [categories, setCategories] = useState<RequestCategoryBody[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // カテゴリーの取得
    const allCategory = async () => {
      // ローディング開始
      setLoading(true);

      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        setCategories(data.categories);
      } catch (error) {
        console.log("データ取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };
    allCategory();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-10 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">カテゴリー一覧</h2>
        <div>
          <button type="button" className="bg-blue-600 text-white font-bold rounded-lg px-4 py-4">
            <Link href="/admin/categories/new">新規作成</Link>
          </button>
        </div>
      </div>

      <div className="p-4">
        <ul>
          {categories.map((category) => {
            return (
              <li className="py-4 border-b-2" key={category.id}>
                <Link href={`/admin/categories/${category.id}`}>{category.name}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default CategoryList;
