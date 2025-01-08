"use client";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { RequestPostBody } from "../_types/RequestPostBody";
import { RequestCategoryBody } from "../_types/RequestCategoryBody";
import { PostUpdateData } from "../_types/PostUpdateData";
import { v4 as uuidv4 } from "uuid"; // 固有IDを生成するライブラリ
import { supabase } from "@/utils/supabase";
import Image from "next/image";

type PostFormProps = {
  handleDelete?: () => void;
  onUpdate?: (data: PostUpdateData) => void;
  onCreate?: (data: PostUpdateData) => void;
  post?: RequestPostBody;
  isEdit?: boolean;
};

type FormValues = {
  categories: string[];
  title: string;
  content: string;
  thumbnailUrl: string;
}

const PostForm: React.FC<PostFormProps> = ({ handleDelete, onUpdate, onCreate, post, isEdit }) => {
  // カテゴリーの初期値
  const [categories, setCategories] = useState<RequestCategoryBody[]>([]);

  const {
    register, // 入力フィールドを登録する
    handleSubmit, // フォーム送信時の処理を定義する
    setValue, // 入力フォームの初期値
  } = useForm<FormValues>();

  const router = useRouter();

  useEffect(() => {
    const fetchCategory = async () => {
      // 全カテゴリーを取得
      const allCategories = await fetch("/api/admin/categories");
      // fetchしたデータをjsonとして受け取る
      const categoryData = await allCategories.json();
      // 受け取ったオブジェクトのcategoriesをuseStateに渡す
      setCategories(categoryData.categories);

      if (post) {
        // カテゴリーのオブジェクトを取得
        const categoryLists = post.postCategories.map((c) => c.category);
        // カテゴリー名を取得
        const categoryNames = categoryLists.map((c) => c.name);
        // 取得したカテゴリー名をsetValueに設定
        setValue("categories", categoryNames);
      }
    };

    fetchCategory();
  }, [post, setValue]);

  // 記事投稿
  const onsubmit: SubmitHandler<FormValues> = async (data) => {
    const initCategories = categories
    //includesを使用してフォームで入力したカテゴリーの名前を取得
    .filter((c) => data.categories.includes(c.name))
    //フィルタリングしたカテゴリーからidと名前を取り出し、新しいオブジェクトに変換
    // .map((c) => ({id: c.id, name: c.name}));
    const updateData = {
      ...data,
      categories: initCategories
    };

    if (post?.id) {
      onUpdate?.(updateData);
    } else {
      onCreate?.(updateData);
    }
  };

  // 画像投稿
  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      // 画像が選択されていなかった場合return
      return;
    }

    const file = event.target.files[0]; //選択された画像を取得

    const filePath = `private/${uuidv4()}`;

    // Supabaseに画像をアップロード
    // supabase.storage.from('post_thumbnail').uploadというメソッドで、画像をアップロードできます。
    const { data, error } = await supabase.storage
      .from("post_thumbnail") // バケットの指定
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    // アップロードに失敗したらエラーを表示して終了
    if (error) {
      alert(error.message);
      return;
    }

    // data.pathに画像固有のkeyが入っているので、thumbnailImageKeyに格納する
    setThumbnailImageKey(data.path);
  };

  // DBに保存しているthumbnailImageKeyを元に、Supabaseから画像のURLを取得
  useEffect(() => {
    if (!thumbnailImageKey) return;

    // Supabaseから画像のURLを取得する関数
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        // バケット名を指定して、画像のURLを取得
        .from("post_thumbnail")
        // 画像のkeyを指定
        .getPublicUrl(thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };

    console.log("画像のキー", thumbnailImageKey);

    fetcher();
  }, [thumbnailImageKey]);

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
          <label htmlFor="thumbnailImageKey" className="mb-2 text-sm font-medium text-gray-700">
            サムネイルURL
          </label>
          <input type="file" id="thumbnailImageKey" onChange={handleImageChange} accept="image/*" />

          {thumbnailImageUrl && (
            <div className="mt-2">
              <Image src={thumbnailImageUrl} alt="thumbnail" width={400} height={400} />
            </div>
          )}
          
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
