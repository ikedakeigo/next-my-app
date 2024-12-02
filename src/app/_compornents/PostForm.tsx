"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { RequestPostBody } from "../_types/RequestPostBody";
import { RequestCategoryBody } from "../_types/RequestCategoryBody";

type PostFormProps = {
  handleDelete?: () => void;
  post?: RequestPostBody;
  isEdit?: boolean;
};

type FormValues = {
  title: string;
  content: string;
  thumbnailUrl: string;
};

const PostForm = ({ handleDelete, post, isEdit }: PostFormProps) => {
  const {
    register, // 入力フィールドを登録する
    handleSubmit, // フォーム送信時の処理を定義する
  } = useForm<FormValues>();

  const router = useRouter();

  // カテゴリーの初期値
  const [categories, setCategories] = useState<RequestCategoryBody[]>([]);

  // 選択されたカテゴリー
  const [categoryName, setCategoryName] = useState<string[]>([]);

  // 選択されたカテゴリーのオブジェクト
  const [selectCategories, setSelectCategories] = useState<RequestCategoryBody[]>([]);

  useEffect(() => {
    const fetchCategory = async () => {
      // 全カテゴリーを取得
      const allCategories = await fetch("/api/admin/categories");

      const categoryData = await allCategories.json();

      setCategories(categoryData.categories);

      if (post) {
        // カテゴリーのオブジェクトを取得
        const categoryLists = post.postCategories.map((c) => c.category);

        // カテゴリー名のリストをカテゴリーの初期値に設定
        const categoryNames = categoryLists.map((c) => c.name);
        setCategoryName(categoryNames);
      }
    };

    fetchCategory();
  }, [post]);

  const handleChange = (edit: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      target: { value },
    } = edit;

    // 選択されたカテゴリー名を更新
    const selectedCategoryNames = typeof value === "string" ? value.split(",") : value;
    setCategoryName(selectedCategoryNames);

    // 選択されたカテゴリー名に基づいて、selectCategoryを更新
    // filterメソッドを使用して、選択されたカテゴリー名に一致するカテゴリーを取得
    /**
     * filterメソッドの書き方
     * - ブラケット `{}` を使用する場合、`return` を明示的に記述する必要がある。
     * - 簡潔に書く場合、括弧 `()` を使用することで暗黙的に値を返せる。
     *
     * 例:
     * const updatedSelectedCategories = categories.filter((c) => (
     *   selectedCategoryNames.includes(c.name)
     * ));
     */
    // return が必要な場合
    // const updatedSelectedCategories = categories.filter((c) => {
    //  return selectedCategoryNames.includes(c.name);
    // });
    // 省略記法 以下
    const updatedSelectedCategories = categories.filter((c) => selectedCategoryNames.includes(c.name));

    console.log("updatedSelectedCategories------->", updatedSelectedCategories);
    setSelectCategories(updatedSelectedCategories);
  };

  // 記事投稿
  const onsubmit: SubmitHandler<FormValues> = async (data) => {
    const updateData = {
      ...data,
      categories: selectCategories,
    };

    console.log("updateData------->", updateData);

    try {
      const res = await fetch(`/api/admin/posts/${isEdit ? `${post?.id}` : ""}`, {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(updateData),
      });
      if (res.ok) {
        router.push("/admin/posts");
        alert(isEdit ? "記事を更新しました" : "記事を作成しました");
      }
    } catch (error) {
      console.log(error);
      alert(isEdit ? "記事の更新に失敗しました" : "");
    }
  };

  return (
    <div className="p-10 w-full">
      <h2 className="text-xl font-bold mb-6">{isEdit ? "記事編集" : "記事作成"}</h2>

      <form action="" onSubmit={handleSubmit(onsubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="title" className="mb-2 text-sm font-medium text-gray-700">
            タイトル
          </label>
          <input type="text" id="title" defaultValue={post?.title} {...register("title")} className="text-blue-500 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="content" className="mb-2 text-sm font-medium text-gray-700">
            内容
          </label>
          <textarea id="content" defaultValue={post?.content} className="border text-blue-500  border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} {...register("content")} />
        </div>

        <div className="flex flex-col">
          <label htmlFor="thumbnailUrl" className="mb-2 text-sm font-medium text-gray-700">
            サムネイルURL
          </label>
          <input type="text" id="thumbnailUrl" defaultValue={post?.thumbnailUrl} {...register("thumbnailUrl")} className="border text-blue-500 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="flex flex-col">
          <label htmlFor="categories" className="mb-2 text-sm font-medium text-gray-700">
            カテゴリー
          </label>
          <select id="categories" multiple value={categoryName} onChange={handleChange} className="border text-blue-500  border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          {isEdit ? (
            <>
              <button type="submit" className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-blue-700">
                更新
              </button>
              <button type="button" className="bg-red-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-red-700" onClick={() => handleDelete?.()}>
                削除
              </button>
            </>
          ) : (
            <>
              <button type="submit" className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-blue-700">
                作成
              </button>
            </>
          )}
          <button type="button" className="bg-gray-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-gray-700" onClick={() => router.back()}>
            戻る
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
