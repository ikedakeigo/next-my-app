"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { RequestCategoryBody } from "../_types/RequestCategoryBody";

type CategoryFormProps = {
  handleDelete?: () => void;
  category?: RequestCategoryBody;
  isEdit?: boolean;
};

type FormValues = {
  name: string;
};

const CategoryForm: React.FC<CategoryFormProps> = ({ handleDelete, category, isEdit }) => {
  console.log("category--------->", category);
  console.log("isEdit--------->", isEdit);

  // formの登録
  const { register, handleSubmit } = useForm<FormValues>();

  const router = useRouter();

  // formで送信されたデータ(data)を取得
  // SubmitHandler<FormValues>は、formのデータを受け取る型
  // onsubmit に渡されるデータが FormValues に一致することを保証
  const onsubmit: SubmitHandler<FormValues> = async (data) => {
    const updateData = {
      ...data,
      category,
    };

    console.log("updateData--------->", updateData);

    try {
      const res = await fetch(`/api/admin/categories/${isEdit ? `${category?.id}` : ""}`, {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(updateData),
      });
      if (res.ok) {
        router.push("/admin/categories");
        alert(isEdit ? "カテゴリーの更新ができました" : "カテゴリーの作成ができました");
      }
    } catch (error) {
      console.log("データ取得エラー:", error);
      alert(isEdit ? "カテゴリーの更新ができませんでした" : "");
    }
  };

  return (
    <div className="p-10 w-full">
      <div className=" mb-6">
        <h2 className="text-xl font-bold">{isEdit ? "カテゴリー編集" : "カテゴリー新規作成"}</h2>
        <div></div>
      </div>

      <form onSubmit={handleSubmit(onsubmit)}>
        <div className="p-4">
          <label className="block mb-2">カテゴリー名</label>
          <input type="text" className="border-2 text-black border-gray-300 p-2" defaultValue={category?.name} {...register("name", { required: true })} />
        </div>

        <div className="p-4 flex  items-center">
          <button type="submit" className="bg-blue-600 text-white font-bold rounded-lg px-4 py-4">
            {isEdit ? "更新" : "作成"}
          </button>
          {isEdit && (
            <button type="button" className="bg-red-600 text-white font-bold rounded-lg px-4 py-4" onClick={handleDelete}>
              削除
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
