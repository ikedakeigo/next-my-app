import { supabase } from "@/utils/supabase";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// カテゴリー詳細取得API
export const GET = async (
  request: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  }
) => {
  const { id } = params;

  // token検証
  const token = request.headers.get("Authorization") ?? "";
  const { error } = await supabase.auth.getUser(token);
  if ( error) return NextResponse.json({status: error.message}, {status: 400});

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json(
      {
        status: "OK",
        category,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};

// カテゴリー更新API
export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  const token = request.headers.get("Authorization") ?? "";
  // オブジェクトで受け取る
  const { name } = await request.json();

  const { error } = await supabase.auth.getUser(token);
  // 送ったtokenが正しくない場合、errorが返却されるのでクライアントにもエラーを返す。
  if (error) return NextResponse.json({ status: error.message }, { status: 400 });

  try {
    const category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    });

    return NextResponse.json(
      {
        status: "OK",
        category,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};

// カテゴリー削除API
export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  try {
    const category = await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json(
      {
        status: "OK",
        category,
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
