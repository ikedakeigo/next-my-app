import { supabase } from "@/utils/supabase";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (request: NextRequest) => {
  // リクエストヘッダーからtokeを取得
  // tokenがない場合は空文字を代入
  const token = request.headers.get("Authorization") ?? "";

  console.log("token-------->", token);
  console.log("真偽？", token ? true : false)
  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるのでクライアントにもエラーを返す。
  if (error) return NextResponse.json({ status: error.message }, { status: 400 });

  try {


    // カテゴリーの一覧をDBから取得
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        createdAt: "desc", // 作成日時の降順で取得
      },
    });

    //レスポンスを返す
    return NextResponse.json(
      {
        status: "OK",
        categories,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          status: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
};

interface CreatePostRequestBody {
  name: string;
}

export const POST = async (request: Request) => {
  const token = request.headers.get("Authorization") ?? "";

  const { error } = await supabase.auth.getUser(token);

  if (error) return NextResponse.json({ status: error.message }, { status: 400 });
  try {
    // リクエストのbodyを取得
    const body = await request.json();

    // bodyの中からnameを取り出す
    const { name }: CreatePostRequestBody = body;

    // カテゴリーをDBに生成
    const data = await prisma.category.create({
      data: {
        name,
      },
    });

    // レスポンスを返す
    return NextResponse.json({
      status: "OK",
      message: "作成しました",
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          status: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
};
