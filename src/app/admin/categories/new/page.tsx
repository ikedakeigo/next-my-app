"use client";
import CategoryForm from '@/app/_compornents/CategoryForm';
import React from 'react'

const NewCategory = () => {
  // 編集画面の場合はisEditをtrueにする
  return <CategoryForm isEdit={false}/>
}

export default NewCategory
