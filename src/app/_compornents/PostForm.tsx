"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { RequestPostBody } from "../_types/RequestPostBody";
import { RequestCategoryBody } from "../_types/RequestCategoryBody";
import { PostUpdateData } from "../_types/PostUpdateData";

type PostFormProps = {
  handleDelete?: () => void;
  onUpdate?: (data: PostUpdateData) => void;
  onCreate?: (data: PostUpdateData) => void;
  post?: RequestPostBody;
  isEdit?: boolean;
};

const PostForm: React.FC<PostFormProps> = ({ handleDelete, onUpdate, onCreate, post, isEdit }) => {
  // カテゴリーの初期値
  const [categories, setCategories] = useState<RequestCategoryBody[]>([]);

  const {
    register, // 入力フィールドを登録する
    handleSubmit, // フォーム送信時の処理を定義する
    setValue, // 入力フォームの初期値
  } = useForm<PostUpdateData>({
    defaultValues: {
      categories: post?.postCategories.map((c) => c.category.name) || [],
    },
  });

  const router = useRouter();

  // 選択されたカテゴリー
  const [categoryName, setCategoryName] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategory = async () => {
      // 全カテゴリーを取得
      const allCategories = await fetch("/api/admin/categories");

      const categoryData = await allCategories.json();

      setCategories(categoryData.categories);
      if (post) {
        // カテゴリーのオブジェクトを取得
        const categoryLists = post.postCategories.map((c) => c.category);
        console.log("カテゴリーのリスト", categoryLists);

        // カテゴリー名のリストをカテゴリーの初期値に設定
        const categoryNames = categoryLists.filter((c) => c).map((c) => c.name);
        setValue("categories", categoryNames);
        setCategoryName(categoryNames);
        console.log("初期値のカテゴリー", categoryNames);
      }
    };

    fetchCategory();
  }, [post]);

  // 記事投稿
  const onsubmit: SubmitHandler<PostUpdateData> = async (data) => {
    const initCategories = categories
    //includesを使用してその名前に一致するカテゴリーのidを取得
    // @ts-ignore
    .filter((category) => data.categories.includes(category.name))
    //フィルタリングしたカテゴリーからidを取り出し、新しいオブジェクトに変換
    .map((category) => ({ id: category.id }));

    const updateData = {
      ...data,
      categories: initCategories
    };

    console.log("更新する記事のカテゴリー", categoryName);

    if (post?.id) {
      console.log("フォームのカテゴリー", updateData);
      onUpdate?.(updateData);
    } else {
      onCreate?.(updateData);
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
          <select
            id="categories"
            multiple
            {...register("categories")}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
              // useForm の状態を更新
              setValue("categories", selectedOptions);
            }}
            className="border text-blue-500  border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
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
